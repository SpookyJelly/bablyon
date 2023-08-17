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

    if (this.#sceneNo === SceneNo.MainScene) {
      this.#currentScene = new MainScene(this.#engine);
    }
  }
  public async start(): Promise<void> {
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
