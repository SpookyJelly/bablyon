import {
  Scene,
  FreeCamera,
  Engine,
  Vector3,
  CreateSphere,
} from "@babylonjs/core";
import Emitter from "./service/emitter";
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

export function Scene2(engine: Engine) {
  const scene = new Scene(engine);
  const camera = new FreeCamera("camera2", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(engine.getRenderingCanvas() as HTMLCanvasElement, true);

  const sample = CreateSphere("sample", { diameter: 2 }, scene);
  sample.position = new Vector3(0, 0, 0);
  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const button = Button.CreateSimpleButton("but2", "Click Me2");
  button.width = "150px";
  button.height = "40px";
  button.color = "white";
  button.background = "green";
  advancedTexture.addControl(button);

  button.onPointerUpObservable.add(() => {
    Emitter.emit("sceneChange", ["scene1", scene]);
  });
  return scene;
}
