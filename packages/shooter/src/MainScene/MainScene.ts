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
  ShadowGenerator,
  Sound,
  Vector3,
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
import gunfireSoundURL from "../assets/gunfire.mp3?url";

export class MainScene {
  readonly #engine: Engine;
  readonly #scene: Scene;
  readonly #camera: Camera;
  readonly #mainLight: DirectionalLight;
  readonly #shadowGenerator: ShadowGenerator;
  #gunfireSound?: Sound;

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
  }
  public async start(): Promise<void> {
    skybox(this.#scene);
    ground(this.#scene);
    aroundWall(this.#scene);
    obstacle(this.#scene);

    await houses(this.#scene, this.#shadowGenerator);
    await loadMobs(this.#scene, this.#shadowGenerator);

    // TODO: add sound effect
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
    document.addEventListener("click", this.onMouseClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "r") {
        resetEnemy(this.#scene, this.#shadowGenerator);
      }
    });

    const textblock = createEnemyUI();
    clearEnemyUI();

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

  private readonly onMouseClick = (event: MouseEvent): void => {
    if (!this.#engine.isPointerLock) {
      this.#engine.enterPointerlock();
    }
    // button 0 === primary
    if (event.button !== 0) return;

    const originPosition = this.#camera.globalPosition.clone();
    // (0,0,1) vector 방향.
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
}

function setUpMainCamera(canvas: HTMLCanvasElement, scene: Scene): Camera {
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
