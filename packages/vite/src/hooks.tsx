import React from "react";
import {
  Mesh,
  StandardMaterial,
  Vector3,
  Vector4,
  Texture,
  MeshBuilder,
  Nullable,
} from "@babylonjs/core";

const buildBox = (width: number) => {
  //texture
  const boxMat = new StandardMaterial("boxMat");
  if (width === 2) {
    boxMat.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/semihouse.png"
    );
  } else {
    boxMat.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/cubehouse.png"
    );
  }

  const faceUV = [];
  if (width === 2) {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  } else {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
  }

  const box = MeshBuilder.CreateBox("box", { faceUV, width, wrap: true });
  box.material = boxMat;
  box.position.y = 0.5;
  return box;
};

const buildRoof = (width: number) => {
  //texture
  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );
  const roof = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.material = roofMat;
  // roof.scaling = new Vector3(0.75, width);
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  return roof;
};

export const buildHouse = (width: number) => {
  const box = buildBox(width);
  const roof = buildRoof(width);
  return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)!;
};
