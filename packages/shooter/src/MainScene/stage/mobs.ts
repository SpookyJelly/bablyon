import {
  Scene,
  ShadowGenerator,
  CreateCapsule,
  StandardMaterial,
  Color3,
  Vector3,
} from "@babylonjs/core";

export async function loadMobs(
  scene: Scene,
  shadowGenerator: ShadowGenerator
): Promise<void> {
  const arr = Array.from({ length: 20 }).map((_, i) => {
    const capsuleBase = CreateCapsule(
      `mob-${i}`,
      {
        height: 4,
        capSubdivisions: 6,
        radius: 1,
        subdivisions: 6,
        tessellation: 16,
      },
      scene
    );

    // capsuleBase.position.y = 1;
    const material = new StandardMaterial("mobMaterial", scene);
    material.diffuseColor = new Color3(
      Math.random(),
      Math.random(),
      Math.random()
    );
    capsuleBase.material = material;
    shadowGenerator.addShadowCaster(capsuleBase);
    capsuleBase.position = new Vector3(
      Math.random() * 200 - 100,
      2,
      Math.random() * 200 - 100
    );
    capsuleBase.rotate(Vector3.Up(), Math.random() * Math.PI * 4);
    scene.onBeforeRenderObservable.add(() => {
      // render 직전에 capsule을 회전 시킨다
      capsuleBase.rotate(Vector3.Up(), Math.random() * 0.5 - 0.25);
      const delta = scene.getEngine().getDeltaTime() / 100;
      // Mesh의 메서드(MovewithCollisions)를 이용해서, delta만큼 매 프레임 이동시킨다.
      capsuleBase.moveWithCollisions(
        capsuleBase.forward.multiplyByFloats(delta, delta, delta)
      );
    });
  });
}
