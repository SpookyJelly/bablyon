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

  const Manager = new SceneManger(engine);

  Emitter.on("sceneChange", ([sceneName, scene]: [string, Scene]) => {
    console.log("scene", scene);
    if (scene) scene.dispose(); // sceneChange에서 모든 것을 처리하도록 수정했는데, 이게 맞는지 모르겠다
    Manager.switchToScene(sceneName);
  });

  engine.runRenderLoop(() => {
    Manager.currentScene.render();
  });
}

class SceneManger {
  #currentScene: Scene;
  #engine: Engine;
  // sceneMap: Map<string, Scene>;
  sceneMap: { [key: string]: Scene };
  constructor(engine: Engine) {
    this.#engine = engine;
    // 시작화면 Scene1로 시작
    this.#currentScene = Scene1(engine);
    // NOTE:
    // 아래와 같이 Map이나 Object에 미리 저장해놓고, 교체하는 방식은 통하지 않는다.
    // 이유는 모르겠다. 아예 안되는 것도 아니고 몇번 되다가 엔진 자체가 멈춘다. 그래서 switchToScene 메소드를 만들어서 교체하는 방식으로 구현했다.
    this.sceneMap = {
      scene1: Scene1(engine),
      scene2: Scene2(engine),
    };
  }

  switchToScene(sceneName: string) {
    switch (sceneName) {
      case "scene1":
        this.currentScene = Scene1(this.#engine);
        break;
      case "scene2":
        this.currentScene = Scene2(this.#engine);
        break;
      default:
        break;
    }
  }

  get currentScene() {
    return this.#currentScene;
  }
  set currentScene(scene: Scene) {
    this.#currentScene = scene;
  }
  // set currentScene(sceneName: string) {
  //   this.#currentScene = this.sceneMap[sceneName];
  // }
}

main(canvas).catch((err) => console.error(err));
