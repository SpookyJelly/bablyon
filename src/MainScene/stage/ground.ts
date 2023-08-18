import {
  Color3,
  CreateGround,
  Mesh,
  Scene,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

/**
 * perforce: build ground
 * @param scene
 * @returns Ground mesh
 */
export function ground(scene: Scene): Mesh {
  const material = new StandardMaterial("ground", scene);
  material.specularColor = new Color3(0, 0, 0);
  //   material.specularColor = Color3.White();

  const groundDiffuse = new Texture(
    "https://playground.babylonjs.com/textures/grass.png",
    scene
  );
  groundDiffuse.uScale = 120;
  groundDiffuse.vScale = 120;
  material.diffuseTexture = groundDiffuse;
  const groundBump = new Texture(
    "https://playground.babylonjs.com/textures/grassn.png",
    scene
  );
  groundBump.uScale = 120;
  groundBump.vScale = 120;
  material.bumpTexture = groundBump;

  const ground = CreateGround("ground", { width: 400, height: 400 }, scene);
  ground.material = material;
  ground.checkCollisions = true;
  ground.receiveShadows = true;
  return ground;
}
