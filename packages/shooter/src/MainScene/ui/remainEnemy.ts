import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

export const createEnemyUI = () => {
  const texutre = AdvancedDynamicTexture.CreateFullscreenUI("EnemyUI");
  const textblock = new TextBlock();
  texutre.addControl(textblock);
  textblock.fontSize = "24px";
  textblock.color = "white";
  textblock.top = "-45%";
  textblock.left = "40%";
  return textblock;
};

export const setUpRemainEnemy = (Remains: number, textBlock: TextBlock) => {
  textBlock.text = "Enemy Left:" + Remains.toString();
  return textBlock;
};
