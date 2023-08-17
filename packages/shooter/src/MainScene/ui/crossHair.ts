import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui";

export const setUpCrossHair = (): AdvancedDynamicTexture => {
  const texture = AdvancedDynamicTexture.CreateFullscreenUI("CrossHair");

  const xRect = new Rectangle("xRect");
  xRect.height = "2px";
  xRect.width = "20px";
  xRect.background = "White";
  xRect.color = "White";

  const yRect = new Rectangle("yRect");
  yRect.height = "20px";
  yRect.width = "2px";
  yRect.background = "White";
  yRect.color = "White";

  texture.addControl(xRect);
  texture.addControl(yRect);
  return texture;
};
