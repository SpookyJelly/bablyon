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
  Ray,
} from "@babylonjs/core";
import { SceneNo } from "./SceneNo";
import { ShooterCameraDashInput } from "./MainScene/camera/ShooterCameraDashInput";
import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui";
import { SceneInterface } from "./SceneInterface";
import { MainScene } from "./MainScene/MainScene";
export class SceneGenerator {
  readonly #engine: Engine;
  readonly #currentScene: SceneInterface;
  readonly #sceneNo: SceneNo;
  constructor(engine: Engine, sceneNo: SceneNo) {
    this.#engine = engine;
    this.#sceneNo = sceneNo;
    this.#currentScene = new MainScene(this.#engine);
    const canvas = this.#engine.getRenderingCanvas();
    if (!canvas) throw new Error("Could not find canvas element");
    console.log("scene No", this.#sceneNo);
    /**
     * start main loop
     *
     */

    if (this.#sceneNo === SceneNo.MainScene) {
      this.#currentScene = new MainScene(this.#engine);
    } else if (this.#sceneNo === SceneNo.TitleScene) {
      console.log("todo");
    }
    // if (this.#currentScene === undefined)
    // throw new Error("currentScene is undefined");
  }
  public async start(): Promise<void> {
    // 아래와 같은 조건식으로 씬 번호에 따른 매쉬 로드가 가능하다
    // if (this.#currentScene === undefined)
    // throw new Error("currentScene is undefined");
    // this.#engine.runRenderLoop(() => {
    this.#currentScene.start();
  }
  public async dispose(): Promise<void> {
    // TODO
    this.#currentScene.dispose();
  }
  public async render(): Promise<void> {
    this.#currentScene.render();
  }
}
