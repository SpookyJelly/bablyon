import {
  Camera,
  Vector3,
  Scene,
  TransformNode,
  SceneLoader,
  Texture,
  StandardMaterial,
} from "@babylonjs/core";
import "@babylonjs/loaders";
export const loadAkm = (scene: Scene, camera: Camera) => {
  const akm = new TransformNode("akm", scene);
  akm.parent = camera;
  akm.position = new Vector3(0.75, -0.95, 0.9);

  SceneLoader.ImportMesh(
    "",
    "https://dl.dropbox.com/s/kqnda4k2aqx8pro/",
    "AKM.obj",
    scene,
    (newMeshes) => {
      const mat = new StandardMaterial("", scene);
      mat.diffuseTexture = new Texture(
        "https://dl.dropbox.com/s/isvd4dggvp3vks2/akm_diff.tga"
      );
      mat.bumpTexture = new Texture(
        "https://dl.dropbox.com/s/hiuhjsp4pckt9pu/akm_norm.tga"
      );
      mat.specularTexture = new Texture(
        "https://dl.dropbox.com/s/f3samm7vuvl0ez4/akm_spec.tga"
      );
      for (var i = 0; i < newMeshes.length; i++) {
        let ak = newMeshes[i];
        ak.material = mat;
        ak.scaling.x = 0.05;
        ak.scaling.y = 0.05;
        ak.scaling.z = 0.05;
        ak.isPickable = false;
        ak.parent = akm;
      }
    }
  );
  return akm;
};
