import {
  CreateBox,
  CubeTexture,
  Mesh,
  Scene,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

// perforce: build skybox
export function skybox(scene: Scene): Mesh {
  const mesh = CreateBox("MainSkybox", { size: 4000 }, scene);
  const material = new StandardMaterial("MainSkyboxMaterial", scene);
  material.backFaceCulling = false;
  material.disableLighting = true;
  material.reflectionTexture = new CubeTexture(
    `https://playground.babylonjs.com/textures/skybox`,
    scene
  );
  material.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  mesh.infiniteDistance = true;
  mesh.material = material;
  return mesh;
}
