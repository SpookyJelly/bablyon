import { CreateBox, Scene, Vector3, Mesh } from "@babylonjs/core";

/**
 *
 * perforce: build walls around the ground for prevent falling
 * @param scene Target scene
 */

function createWall(name: string, position: Vector3, scaling: Vector3): Mesh {
  const wall = CreateBox(name, { size: 1 });

  wall.scaling = scaling;
  wall.position = position;
  return wall;
}
export function aroundWall(scene: Scene): Mesh {
  // NOTE:
  // createWall이라는 함수에 기존에 사용되던 hosting scene을 넣어주지 않았다.
  // 근데 어떻게 지금 canvas에 그려지는 것인지는 차후에 알아보자. 만약 문제가 생긴다면 이 부분을 살펴 볼 것.
  const [wall1, wall2, wall3, wall4] = [
    createWall("wall1", new Vector3(200, 10, 1), new Vector3(0, 0, 100)),
    createWall("wall2", new Vector3(200, 10, 1), new Vector3(0, 0, -100)),
    createWall("wall3", new Vector3(100, 0, 0), new Vector3(1, 10, 200)),
    createWall("wall4", new Vector3(-100, 0, 0), new Vector3(1, 10, 200)),
  ];

  const result = Mesh.MergeMeshes([wall1, wall2, wall3, wall4], true, true)!;
  result.checkCollisions = true;
  result.receiveShadows = true;
  result.visibility = 0;
  return result;
}
