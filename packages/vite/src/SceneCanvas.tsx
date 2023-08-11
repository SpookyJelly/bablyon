import { useRef, useEffect } from "react";
import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";
import { buildHouse } from "./hooks";

export default function SceneCanvas() {
  const reactCanvas = useRef(null);
  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(reactCanvas.current);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera(
        "camera",
        0,
        Math.PI / 3,
        10,
        Vector3.Zero(),
        scene
      );

      camera.setPosition(new Vector3(0, 5, -10));
      camera.attachControl(reactCanvas.current, true);
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      // const box = MeshBuilder.CreateBox("box", {});
      // box.position.y = 0.5;
      // const roof = MeshBuilder.CreateCylinder("roof", {
      //   diameter: 1.3,
      //   height: 1.5,
      //   tessellation: 3,
      // });
      // roof.scaling.x = 0.75;
      // roof.rotation.z = Math.PI / 2;
      // roof.position.y = 1.22;

      const ground = MeshBuilder.CreateGround(
        "ground",
        { width: 6, height: 6 },
        scene
      );
      const detachedHouse = buildHouse(1);
      detachedHouse.rotation.y = -Math.PI / 16;
      detachedHouse.position.x = -6.8;
      detachedHouse.position.z = 2.5;

      engine.runRenderLoop(() => {
        scene.render();
      });
      return () => {
        engine.dispose();
      };
    }
  }, []);

  return (
    <canvas ref={reactCanvas} style={{ width: "100vw", height: "100vh" }} />
  );
}
