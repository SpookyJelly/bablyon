import {
  Camera,
  DirectionalLight,
  Engine,
  FreeCamera,
  Scene,
  ShadowGenerator,
  Vector3,
  Color3,
  CascadedShadowGenerator,
  SSAORenderingPipeline,
  HemisphericLight,
  Sound,
} from "@babylonjs/core";
import { SceneNo } from "./SceneNo";
import { ShooterCameraDashInput } from "./MainScene/ShooterCameraDashInput";
import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui";
import { skybox } from "./MainScene/skybox";
import { ground } from "./MainScene/ground";
import { ContextHolder } from "./ContextHolder";
import { aroundWall } from "./MainScene/aroundWall";
import { obstacle } from "./MainScene/obstacle";
import { houses } from "./MainScene/houses";
export class SceneGenerator {
  readonly #engine: Engine;
  readonly #scene: Scene;
  readonly #sceneNo: SceneNo;
  readonly #camera: Camera;
  readonly #mainLight: DirectionalLight;
  // readonly #mainLight: HemisphericLight | DirectionalLight;
  readonly #shadowGenerator: ShadowGenerator;
  constructor(engine: Engine, sceneNo: SceneNo) {
    console.log("Hello from SceneGenerator.ts");
    this.#engine = engine;
    this.#sceneNo = sceneNo;
    const canvas = this.#engine.getRenderingCanvas();
    if (!canvas) throw new Error("Could not find canvas element");

    // this is conditionally instantiated
    if (sceneNo === SceneNo.MainScene) {
      this.#scene = new Scene(this.#engine);
      this.#camera = setUpMainCamera(canvas, this.#scene);
      // Main Light
      // Directional Light : 지정한 한 지점에서만 광원이 있다. (태양같이)
      // Hemispheric Light : 지정한 지점에서 모든 방향으로 광원이 있다. (방 안에서 전체적으로 밝게)
      // Direction Light를 놓고 AroundWall을 설정했을떄, 벽의 일부 면이 안보이는 이유가 Direction Light에 의해 가려진 것이기 때문 (빛이 안닿아서)
      this.#mainLight = new DirectionalLight(
        "MainLight",
        new Vector3(2, -5, 1).normalize(),
        this.#scene
      );

      // I added another light to make the scene brighter
      const sublight = new HemisphericLight(
        "sublight",
        new Vector3(0, 1, 0),
        this.#scene
      );
      sublight.intensity = 0.4;

      this.#mainLight.shadowEnabled = true;
      this.#mainLight.diffuse = new Color3(1, 1, 0.96);
      // end

      this.#shadowGenerator = new CascadedShadowGenerator(
        2048,
        this.#mainLight
      );
      setUpCrossHair();
      new SSAORenderingPipeline("ssaoPipeline", this.#scene, 0.95, [
        this.#camera,
      ]);
    }
    // TODO: add title Scene

    //

    /**
     * start main loop
     *
     */
  }
  public async start(): Promise<void> {
    console.log("Hello from SceneGenerator.ts");
    // 아래와 같은 조건식으로 씬 번호에 따른 매쉬 로드가 가능하다
    // if (this.#sceneNo === SceneNo.MainScene) {
    skybox(this.#scene);
    ground(this.#scene);
    aroundWall(this.#scene);
    obstacle(this.#scene);

    await houses(this.#scene, this.#shadowGenerator);

    // TODO: add sound effect
    // this.gunfireSound = await new Promise((resolve: (value: Sound) => void) => {
    //   const sound: Sound = new Sound(
    //     `Gunfire`,
    //     gunfireSoundURL,
    //     this.#scene,
    //     () => resolve(sound)
    //   );
    // });
    if (this.#sceneNo === SceneNo.MainScene) {
      console.log("test");
    } else {
      console.log("ohter");
    }
    // document.addEventListener('click', this.onMoushClick)
    this.#engine.runRenderLoop(() => {
      this.#scene.render();
    });
  }
  public async dispose(): Promise<void> {
    // TODO
    console.log("Hello from SceneGenerator.ts");
  }
  public async render(): Promise<void> {
    // TODO
    console.log("Hello from SceneGenerator.ts");
  }
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

function setUpCrossHair(): AdvancedDynamicTexture {
  const texture = AdvancedDynamicTexture.CreateFullscreenUI("FullscreenUI");

  const xRect = new Rectangle("xRect");
  xRect.height = "2px";
  xRect.width = "20px";
  xRect.background = "White";
  xRect.color = "White";

  const yRect = new Rectangle("yRect");
  yRect.height = "20px";
  yRect.width = "2px";
  yRect.background = "White";
  yRect.color = "White";

  texture.addControl(xRect);
  texture.addControl(yRect);
  return texture;
}
