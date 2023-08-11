import {
  Camera,
  DirectionalLight,
  Engine,
  FreeCamera,
  Scene,
  ShadowGenerator,
  Vector3,
} from "@babylonjs/core";
import { SceneNo } from "./SceneNo";
export class SceneGenerator {
  private readonly _engine: Engine;
  private readonly _scene: Scene;
  private readonly _camera: Camera;
  private readonly _mainLight: DirectionalLight;
  private readonly _shadowGenerator: ShadowGenerator;
  constructor(engine: Engine, sceneNo: SceneNo) {
    console.log("Hello from SceneGenerator.ts");
    this._engine = engine;
    const canvas = this._engine.getRenderingCanvas();
    if (!canvas) throw new Error("Could not find canvas element");
    if (sceneNo === SceneNo.MainScene) {
      this._scene = new Scene(this._engine);
      this._camera = setUpMainCamera(canvas, this._scene);
    }
  }
  public async start(): Promise<void> {
    console.log("Hello from SceneGenerator.ts");
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
  camera.inputs.add(new Shooter());
}
