import { Scene, FreeCamera, Engine, Vector3, CreateBox } from "@babylonjs/core";
import { Button, AdvancedDynamicTexture } from "@babylonjs/gui";
import Emitter from "./service/emitter";

export function Scene1(engine: Engine) {
  const scene = new Scene(engine);
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(engine.getRenderingCanvas() as HTMLCanvasElement, true);

  const sample = CreateBox("sample", { size: 2 }, scene);
  sample.position = new Vector3(0, 0, 0);
  //   console.log("manager", Manager);

  const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  const button = Button.CreateSimpleButton("but", "Click Me");
  button.width = "150px";
  button.height = "40px";
  button.color = "white";
  button.background = "green";
  advancedTexture.addControl(button);

  button.onPointerUpObservable.add(() => {
    console.log("a");
    Emitter.emit("message", "hello");
    scene.dispose();
  });

  engine.runRenderLoop(() => {
    scene.render();
  });

  return scene;
}
