// console.log("Hello from main.ts");
import { Engine } from "@babylonjs/core";

import { SceneNo } from "./SceneNo";
import { ContextHolder } from "./ContextHolder";

import "pepjs";
import "./style.css";

// * Entry point

async function main(canvas: HTMLCanvasElement): Promise<void> {
  const engine = new Engine(
    canvas,
    true,
    {
      alpha: true,
      antialias: true,
      audioEngine: true,
      autoEnableWebVR: true,
      depth: true,
    },
    true
  );
  const context = new ContextHolder(engine);
  await context.switchSceneWithDispose(SceneNo.MainScene);
}

const canvas = document.querySelector<HTMLCanvasElement>("#app");
if (!canvas) throw new Error("Could not find canvas element");
main(canvas).catch((err) => console.error(err));
