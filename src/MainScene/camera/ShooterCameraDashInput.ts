import {
  FreeCamera,
  ICameraInput,
  KeyboardInfo,
  Nullable,
  Observer,
  Tools,
  Vector3,
} from "@babylonjs/core";

// this is a camera with dash input
export class ShooterCameraDashInput implements ICameraInput<FreeCamera> {
  public readonly camera: FreeCamera;

  // dash speed
  public readonly dashSpeed = 0.8;
  public readonly walkSpeed = 0.5;

  #isDash = false;
  #wantToJump = false;
  #isJumping = false;
  #onKeyboardObservable: Nullable<Observer<KeyboardInfo>> = null;

  // inheritdoc
  public constructor(camera: FreeCamera) {
    this.camera = camera;

    // WASD to move
    camera.keysUp = ["W".charCodeAt(0)];
    camera.keysDown = ["S".charCodeAt(0)];
    camera.keysLeft = ["A".charCodeAt(0)];
    camera.keysRight = ["D".charCodeAt(0)];
  }

  public attachControl(noPreventDefault?: boolean): void {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this.camera.angularSensibility = 5000; // gets input sensibility for mouse input. Higher values reduce sensitivity.
    this.camera.getScene().gravity = new Vector3(0, -0.1, 0);

    this.camera.applyGravity = true;

    const observer = this.camera.getScene().onKeyboardObservable.add((info) => {
      // type === 1 means keydown (maybe)
      this.#isDash = info.type === 1 && info.event.code === "ShiftLeft";
      this.#wantToJump = info.type === 1 && info.event.code === "Space";

      if (!noPreventDefault) info.event.preventDefault();
    });
    this.#onKeyboardObservable = observer;
  }

  public detachControl(): void {
    if (this.#onKeyboardObservable) {
      this.camera
        .getScene()
        .onKeyboardObservable.remove(this.#onKeyboardObservable);
      this.#onKeyboardObservable = null;
    }
  }
  // called when requestAnimationFrame

  public checkInputs(): void {
    this.camera.speed = this.walkSpeed;
    if (this.#isDash) {
      this.camera.speed = this.dashSpeed;
    }
    this.#isJumping = this.camera.position.y >= 2.5;
    if (this.#wantToJump && !this.#isJumping) {
      this.camera.cameraDirection.y += 0.5;
    }
  }

  public getClassName(): string {
    return "ShooterCameraDashInput";
  }
  public getSimpleName(): string {
    return "dash";
  }
}
