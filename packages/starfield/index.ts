import { Engine, Scene } from "@babylonjs/core";
import { Scene1 } from "./src/scene1";
import { Scene2 } from "./src/scene2";
import Emitter from "./src/service/emitter";
// import나 export를 쓰지 않고 그냥 canvas로 변수 지정하게 되면은 전역 변수와 네임스페이스 충돌이 난다.
// Import, export를 사용해서 ESModule임을 알려줘야지 고립 가능.
const canvas = document.getElementById("app") as HTMLCanvasElement;

if (!canvas) throw new Error("Could not find canvas element");

async function main(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas, true, {
    alpha: true,
    antialias: true,
    audioEngine: true,
  });

  //   const scene = new Scene(engine);
  // const scene = Scene1(engine);

  const Manager = new SceneManger(engine);

  Emitter.on("message", (text: any) => {
    console.log("text", text);
    if (text === "hello") {
      //   Manager.currentScene.detachControl();
      Manager.currentScene.dispose();
      Manager.currentScene = Scene2(engine);
    }
    if (text === "bye") {
      //   Manager.currentScene.detachControl();
      Manager.currentScene.dispose();
      Manager.currentScene = Scene1(engine);
    }
  });
  //   const currentScene = Manager.currentScene;

  //   console.log("currentScene", currentScene);
  engine.runRenderLoop(() => {
    // scene.render();
    Manager.currentScene.render();
  });
  //   const scene = new Scene(engine);
}

class SceneManger {
  currentScene: Scene;
  constructor(engine: Engine) {
    this.currentScene = Scene1(engine);
  }
}

main(canvas).catch((err) => console.error(err));
