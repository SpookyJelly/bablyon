import {
  Camera,
  CascadedShadowGenerator,
  Color3,
  DirectionalLight,
  Engine,
  FreeCamera,
  HemisphericLight,
  Ray,
  SSAORenderingPipeline,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Sound,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
  Animation,
} from "@babylonjs/core";
import {
  skybox,
  ground,
  aroundWall,
  obstacle,
  houses,
  loadMobs,
} from "./stage";
import { ShooterCameraDashInput } from "./camera/ShooterCameraDashInput";
import { createEnemyUI, setUpRemainEnemy } from "./ui/remainEnemy";
import { setUpCrossHair } from "./ui/crossHair";
import { clearEnemyUI, resetEnemy } from "./ui/clearEnemy";
import gunfireSoundURL from "../assets/sound/gunfire.mp3?url";
import { recoilm } from "../assets/animation/recoil";
// import { OBJFileLoader } from "@babylonjs/loaders";
import "@babylonjs/loaders";
export class MainScene {
  readonly #engine: Engine;
  readonly #scene: Scene;
  readonly #camera: FreeCamera;
  readonly #mainLight: DirectionalLight;
  readonly #shadowGenerator: ShadowGenerator;
  #gunfireSound?: Sound;
  #akm: TransformNode;
  #aim = false;

  constructor(engine: Engine) {
    this.#engine = engine;
    const canvas = this.#engine.getRenderingCanvas();
    if (!canvas) throw new Error("Could not find canvas element");

    this.#scene = new Scene(this.#engine);
    this.#camera = setUpMainCamera(canvas, this.#scene);
    this.#mainLight = new DirectionalLight(
      "MainLight",
      new Vector3(2, -5, 1).normalize(),
      this.#scene
    );

    const sublight = new HemisphericLight(
      "sublight",
      new Vector3(0, 1, 0),
      this.#scene
    );
    sublight.intensity = 0.4;

    this.#mainLight.shadowEnabled = true;
    this.#mainLight.diffuse = new Color3(1, 1, 0.96);
    // end

    this.#shadowGenerator = new CascadedShadowGenerator(2048, this.#mainLight);
    setUpCrossHair();
    new SSAORenderingPipeline("ssaoPipeline", this.#scene, 0.95, [
      this.#camera,
    ]);

    /**
     * start main loop
     *
     */

    // transform Node test
    // Transform Node 가 뭔지..
    this.#akm = new TransformNode("akm", this.#scene);
    this.#akm.parent = this.#camera; // setting camera as parent makes follow camera
    this.#camera.fov = 1;
    // parent가 camera가 되면, camera의 rotation에 따라서 움직인다.
    this.#akm.position = new Vector3(0.75, -0.95, 0.9);
    // this.#akm.rotation.x = -0.01;

    // must import loader before use

    SceneLoader.ImportMesh(
      "",
      "https://dl.dropbox.com/s/kqnda4k2aqx8pro/",
      "AKM.obj",
      this.#scene,
      (newMeshes) => {
        const mat = new StandardMaterial("", this.#scene);
        mat.diffuseTexture = new Texture(
          "https://dl.dropbox.com/s/isvd4dggvp3vks2/akm_diff.tga"
        );
        mat.bumpTexture = new Texture(
          "https://dl.dropbox.com/s/hiuhjsp4pckt9pu/akm_norm.tga"
        );
        mat.specularTexture = new Texture(
          "https://dl.dropbox.com/s/f3samm7vuvl0ez4/akm_spec.tga"
        );
        for (var i = 0; i < newMeshes.length; i++) {
          let ak = newMeshes[i];
          ak.material = mat;
          ak.scaling.x = 0.05;
          ak.scaling.y = 0.05;
          ak.scaling.z = 0.05;
          ak.isPickable = false;
          ak.parent = this.#akm;
        }
      }
    );

    // animation
    this.#akm.animations.push(recoilm);
  }
  public async start(): Promise<void> {
    skybox(this.#scene);
    ground(this.#scene);
    aroundWall(this.#scene);
    obstacle(this.#scene);

    await houses(this.#scene, this.#shadowGenerator);
    await loadMobs(this.#scene, this.#shadowGenerator);

    this.#gunfireSound = await new Promise(
      (resolve: (value: Sound) => void) => {
        const sound: Sound = new Sound(
          `Gunfire`,
          gunfireSoundURL,
          this.#scene,
          () => resolve(sound)
        );
      }
    );

    this.#scene.activeCamera = this.#camera;

    // event listener
    document.addEventListener("click", this.onMouseClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        resetEnemy(this.#scene, this.#shadowGenerator);
      }
    });

    const textblock = createEnemyUI();
    clearEnemyUI();

    // updater
    this.#engine.runRenderLoop(() => {
      this.#scene.render();
      const remains = this.#scene.meshes.filter((mesh) => {
        return mesh.name.match(/^mob-./) !== null;
      });
      setUpRemainEnemy(remains.length, textblock);
    });
  }
  public async dispose(): Promise<void> {
    // TODO
    //
    this.#scene.dispose();
  }
  public async render(): Promise<void> {
    // TODO
    this.#scene.render();
  }

  private readonly onPrimaryClick = (isAim: boolean): void => {
    this.#scene.beginAnimation(this.#akm, 0, 5, false);
    const ran = isAim ? 0.01 : Math.random() * (0.1 - 0.05) + 0.05;
    // NOTE: this.#camera.rotation.x 만 수정해도 되나, 추후 수정을 위해서 모두 수정
    this.#camera.rotation = new Vector3(
      this.#camera.rotation.x - ran,
      this.#camera.rotation.y,
      this.#camera.rotation.z
    );

    const originPosition = this.#camera.globalPosition.clone();
    const forwardPosition = this.#camera.getDirection(Vector3.Forward());
    const ray = new Ray(originPosition, forwardPosition, 200);

    if (this.#gunfireSound) {
      this.#gunfireSound.play();
    }
    const hit = this.#scene.pickWithRay(ray, (mesh) => {
      return mesh.name.match(/^mob-./) !== null;
    });
    if (hit && hit.pickedMesh) {
      hit.pickedMesh.dispose();
    }
  };

  private readonly onSecondaryClick = (isAim: boolean): void => {
    if (isAim) {
      this.#camera.fov = 1;
      this.#akm.position = new Vector3(0.75, -0.95, 0.9);
      this.#aim = false;
    } else {
      this.#camera.fov = 0.3;
      this.#akm.position = new Vector3(0, -0.41, 0.56);
      this.#aim = true;
    }
  };

  private readonly onMouseClick = (event: MouseEvent): void => {
    if (!this.#engine.isPointerLock) {
      this.#engine.enterPointerlock();
    }
    switch (event.button) {
      case 0:
        this.onPrimaryClick(this.#aim);
        return;
      case 2:
        this.onSecondaryClick(this.#aim);
        return;
      case 1:
      default:
        return;
    }
  };
}

function setUpMainCamera(canvas: HTMLCanvasElement, scene: Scene): FreeCamera {
  const initalPotision = new Vector3(
    Math.random() * 200 - 100,
    2,
    Math.random() * 200 - 100
  );
  const camera = new FreeCamera("MainCamera", initalPotision, scene);
  camera.setTarget(Vector3.Zero());
  camera.inputs.add(new ShooterCameraDashInput(camera));
  camera.attachControl(canvas, true);
  camera.applyGravity = true;
  camera.ellipsoid = new Vector3(1.2, 1.2, 1.2);
  camera.checkCollisions = true;
  return camera;
}
