import { Scene, SceneLoader, ShadowGenerator, Vector3 } from "@babylonjs/core";

/**
 * perforce: build houses
 * @param {Scene} target Scene
 * @param {ShadowGenerator} shadowGenerator main Shadow generator
 * @returns {Promise<void>}
 * @async
 */

export async function houses(
  _: Scene,
  shadowGenerator: ShadowGenerator
): Promise<void> {
  const result = await SceneLoader.ImportMeshAsync(
    `semi_house`,
    `https://assets.babylonjs.com/meshes/`,
    `both_houses_scene.babylon`
  );
  const houseBase = result.meshes[0];
  houseBase.checkCollisions = true;
  // houseBase.isVisible = false;
  const array = Array.from({ length: 10 }, (_, i) => i);
  array.forEach((i) => {
    const house = houseBase.clone(`house${i}`, null);
    if (!house) throw new Error("Error! clone house failed");
    shadowGenerator.addShadowCaster(house);
    house.position = new Vector3(
      Math.random() * 200 - 100,
      0,
      Math.random() * 200 - 100
    );
    house.scaling = new Vector3(
      Math.random() + 8,
      Math.random() + 8,
      Math.random() + 8
    );
    house.rotate(Vector3.Up(), Math.random() * Math.PI * 4);
  });
  houseBase.setEnabled(false);
}
