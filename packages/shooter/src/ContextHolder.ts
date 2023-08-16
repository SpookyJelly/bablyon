import { Engine, SceneOptions } from "@babylonjs/core";
import { SceneNo } from "./SceneNo";
import { SceneInterface } from "./SceneInterface";
import { SceneGenerator } from "./SceneGenerator";

//** holds data across scenes
export class ContextHolder {
  private readonly _sceneInstances = new Map<SceneNo, SceneInterface>();
  private _currentSceneNo?: SceneNo;

  public constructor(private readonly _engine: Engine) {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("unload", this.onUnload);
  }

  private get currentScene(): SceneInterface | undefined {
    if (!this._currentSceneNo) return undefined;
    if (this._sceneInstances.has(this._currentSceneNo)) {
      const scene = this._sceneInstances.get(this._currentSceneNo);
      if (scene) return scene;
    }
    return undefined;
  }

  private onResize = () => {
    this._engine.resize();
  };

  private onUnload = () => {
    this._sceneInstances.forEach((scene) => scene.dispose());
    this._engine.dispose();
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("unload", this.onUnload);
  };

  /**
   * @param sceneNo target scene no
   * @param withDispose dispose current scene
   */
  private async switchScene(
    sceneNo: SceneNo,
    withDispose = true
  ): Promise<void> {
    if (withDispose) {
      await this.currentScene?.dispose();
    }
    if (this._sceneInstances.has(sceneNo)) {
      //reuse scene
      this._currentSceneNo = sceneNo;
      return;
    }

    // const scene = createScene(this._engine, sceneNo);

    const scene = new SceneGenerator(this._engine, sceneNo);
    console.log("scen", scene);
    await scene.start();
    // this._sceneInstances.set(sceneNo, scene);
  }

  public async switchSceneWithDispose(sceneNo: SceneNo): Promise<void> {
    return this.switchScene(sceneNo, true);
  }
  public async switchSceneWithoutDispose(sceneNo: SceneNo): Promise<void> {
    return this.switchScene(sceneNo, false);
  }
  public async render(): Promise<void> {
    await this.currentScene?.render();
  }
}
