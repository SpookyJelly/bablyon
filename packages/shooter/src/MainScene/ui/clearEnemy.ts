import { Scene, ShadowGenerator } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { loadMobs } from "../stage";
export const clearEnemyUI = () => {
  const texture = AdvancedDynamicTexture.CreateFullscreenUI("reset enemy");
  const textblock = new TextBlock();

  textblock.text = "Press R to reset enemy";
  textblock.color = "white";
  textblock.fontSize = 24;
  textblock.top = "45%";
  textblock.left = "40%";

  texture.addControl(textblock);
};
export const resetEnemy = async (
  scene: Scene,
  shadowGenerator: ShadowGenerator
) => {
  scene.meshes
    .filter((mesh) => mesh.name.includes("mob"))
    .forEach((mesh) => {
      mesh.dispose();
    });

  await loadMobs(scene, shadowGenerator);
};
