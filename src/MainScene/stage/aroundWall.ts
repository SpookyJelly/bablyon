import {
  CreateBox,
  Scene,
  Vector3,
  Mesh,
  StandardMaterial,
  Color3,
  Texture,
  Space,
  VertexBuffer,
  VertexData,
} from "@babylonjs/core";

/**
 *
 * perforce: build walls around the ground for prevent falling
 * @param scene Target scene
 */

export function aroundWall(scene: Scene): Mesh {
  const wall1 = CreateBox("wall1", { size: 1 }, scene);
  wall1.scaling = new Vector3(200, 10, 1);
  wall1.position.z = 100;

  const wall2 = CreateBox("wall2", { size: 1 }, scene);
  wall2.scaling = new Vector3(200, 10, 1);
  wall2.position.z = -100;

  const wall3 = CreateBox("wall3", { size: 1 }, scene);
  wall3.position.x = 100;
  wall3.scaling = new Vector3(1, 10, 200);

  const wall4 = CreateBox("wall4", { size: 1 }, scene);
  wall4.position.x = -100;
  wall4.scaling = new Vector3(1, 10, 200);

  const result = Mesh.MergeMeshes([wall1, wall2, wall3, wall4], true, true)!;
  result.checkCollisions = true;
  result.receiveShadows = true;
  result.visibility = 0;
  return result;
  //   return wall2;
}
