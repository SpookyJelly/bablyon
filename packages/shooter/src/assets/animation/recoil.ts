import { Animation } from "@babylonjs/core";

const recoilm = new Animation(
  "recoilm",
  "position.z",
  30,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_CYCLE
);

const remkeys = [
  { frame: 0, value: 0.5 },
  { frame: 1, value: -0.03 },
  { frame: 5, value: 0.5 },
  { frame: 6, value: 0.2 },
  { frame: 7, value: -0.06 },
  { frame: 11, value: 0.2 },
];

recoilm.setKeys(remkeys);

export { recoilm };
