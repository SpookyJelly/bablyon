import {
  CreateBox,
  Scene,
  StandardMaterial,
  Vector3,
  Texture,
  Mesh,
} from "@babylonjs/core";

/**
 * perforce: build obstacle
 * @param scene Target Scene
 */

export function obstacle(scene: Scene): void {
  const material = new StandardMaterial("obstacle", scene);
  const diffuse = new Texture(
    "https://playground.babylonjs.com/textures/crate.png",
    scene
  );
  diffuse.uScale = 2;
  diffuse.vScale = 2;

  material.diffuseTexture = diffuse;

  const bump = new Texture(
    "https://playground.babylonjs.com/textures/normalMap.jpg",
    scene
  );
  bump.uScale = 2;
  bump.vScale = 2;

  material.bumpTexture = bump;
  const array = Array.from({ length: 20 }, (_, i) => i);
  array.forEach((i) => {
    const box = CreateBox(`obstacle${i}`, { size: 2 }, scene);
    box.material = material.clone(`obstacle_mat${i}`);
    const axis = new Vector3(
      Math.random() * Math.PI - Math.PI / 2,
      Math.random() * Math.PI - Math.PI / 2,
      Math.random() * Math.PI - Math.PI / 2
    );
    box.rotate(axis, Math.random() * Math.PI);
    box.position = new Vector3(
      Math.random() * 200 - 100,
      Math.random() * 3 - 1.5,
      Math.random() * 200 - 100
    );
    box.setEnabled(true);
  });
}
