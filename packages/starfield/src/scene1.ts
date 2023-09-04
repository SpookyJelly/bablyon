import {
  Scene,
  FreeCamera,
  Engine,
  Vector3,
  CreateBox,
  Color3,
  Color4,
  PointLight,
  UniversalCamera,
  StandardMaterial,
  Texture,
  CreateSphere,
  SceneLoader,
  AssetsManager,
  TransformNode,
  HemisphericLight,
  DirectionalLight,
  LightBlock,
  CreateLathe,
  Mesh,
  CreateText,
} from "@babylonjs/core";
import { Button, AdvancedDynamicTexture } from "@babylonjs/gui";
import Emitter from "./service/emitter";
import sun2 from "./assets/sun2.jpg";
import sky from "./assets/8k_sky.jpg";
import mercuryTexture from "./assets/mercury.png";
import moonTexture from "./assets/moon.jpg";
import venusTexture from "./assets/venus.png";
import earthTexture from "./assets/earth.jpeg";
import marsTexture from "./assets/mars.jpg";
import jupiterTexture from "./assets/jupiter.png";
import ringTexture from "./assets/ring.png";
import saturnTexture from "./assets/saturn.jpg";
import uranusTexture from "./assets/uranus.jpg";
import neptuneTexture from "./assets/neptune.jpg";

import "@babylonjs/loaders";
import { TerrainMaterial, WaterMaterial } from "@babylonjs/materials";

export function Scene1(engine: Engine) {
  const scene = new Scene(engine);

  // scene base
  scene.clearColor = new Color4(1, 1, 1, 0);
  scene.collisionsEnabled = true;

  // camera base
  const camera = new UniversalCamera(
    "camera1",
    new Vector3(136, 0, 107),
    scene
  );
  // 생성 후 set Target으로 타겟 설정 잊지 말기
  camera.setTarget(new Vector3(0, 0, 100));
  // attachControl의 첫번째 인자는 Canvas이다
  camera.attachControl(engine.getRenderingCanvas() as HTMLCanvasElement, true);
  camera.fov = 0.4;

  // camera key setup

  camera.keysUp.push(87); // W
  camera.keysDown.push(83); // S
  camera.keysLeft.push(65); // A
  camera.keysRight.push(68); // D

  // camera의 충돌 크기 생성
  camera.ellipsoid = new Vector3(10, 10, 10);
  camera.checkCollisions = true;
  camera.speed = 0.5;

  // light

  const light = new PointLight("light", new Vector3(0, 0, 100), scene);
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 1, 1);

  light.intensity = 7;
  // const light2 = new HemisphericLight("light2", new Vector3(0, 1, 1), scene);

  // skybox;
  const skybox = CreateBox("skybox", { size: 10000 }, scene);
  const skyboxMaterial = new StandardMaterial("skybox", scene);

  // Culling State: 랜더링 성능을 향상시키기 위해 카메라에서 멀리 있는 기본 형식을 제거 하는 것.
  // 기본적으로 뒷면 (backFace)을 가리므로, 바빌론에서는 backFaceCulling이라고 하는듯
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new Texture(sky, scene, true);

  // 좌표계 모드를 어떻게 설정한건데 모르겠네요
  skyboxMaterial.reflectionTexture.coordinatesMode =
    Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE;
  skybox.material = skyboxMaterial;
  skybox.checkCollisions = true;

  // sun
  // const sun = CreateSphere("sphere", { diameter: 50, segments: 54 }, scene);
  // sun.position = new Vector3(0, 0, 100);
  // const sunMaterial = new StandardMaterial("matrial", scene);
  // sunMaterial.emissiveTexture = new Texture(sun2, scene);
  // sunMaterial.disableLighting = true;
  // sun.material = sunMaterial;
  // sun.checkCollisions = true;

  // object sun
  const objSun = new TransformNode("sun", scene);
  objSun.position = new Vector3(0, -10, 100);

  light.position = objSun.position;

  // NOTE: asset의 경로는 root path로부터 상대적인 경로로 지정해야한다?
  SceneLoader.ImportMesh("", "./src/assets/", "sun_02.obj", scene, (meshes) => {
    const mat = new StandardMaterial("", scene);
    // mat.ambientColor = new Color3(0, 1, 0);
    // mat.diffuseColor = new Color3(0.0, 0.7, 0.1); // diffuse Color 지정으로 텍스쳐를 덮어씌울 수 있다.
    mat.emissiveColor = new Color3(1, 1, 0);
    mat.specularColor = new Color3(1, 1, 1);
    meshes.forEach((mesh) => {
      mesh.material = mat;
      mesh.checkCollisions = true;
      mesh.scaling = new Vector3(0.2, 0.2, 0.2);
      mesh.isPickable = false;
      mesh.parent = objSun;
    });
  });

  // mercury

  const mercury = CreateSphere("mercury", { diameter: 5, segments: 54 }, scene);

  const mercuryMaterial = new StandardMaterial("mercuryMaterial", scene);
  mercuryMaterial.ambientTexture = new Texture(mercuryTexture, scene);
  mercuryMaterial.specularColor = new Color3(0, 0, 0);

  // disable Lighting 을 넣으면 빛 반사도 포함한 모든 빛 효과가 차단된다
  // mercuryMaterial.disableLighting = true;
  mercury.material = mercuryMaterial;
  mercury.checkCollisions = true;

  let mercuryTheta = 0;

  // const light2 = new DirectionalLight("dir01", new Vector3(0, -1, 0), scene);

  // object venus
  const objVenus = new TransformNode("venus", scene);
  // objVenus.position = new Vector3(0, 16, 150);
  // ImportMesh의 첫번째 Param인 Meshname이, 내가 이 씬에서 지칭할 이름이 아니라, 사전에 지정된 이름으로 추측된다.
  // 어딘가에서 이름을 선언하는 부분이 있을것. 아래의 경우도, 처음에는 venus라는 이름으로 지정해봤더니 안되고, 공백으로 놓으니까 된다
  // 시발...왜 검은색으로 보이는거야..
  SceneLoader.ImportMesh("", "./src/assets/", "venus.obj", scene, (meshes) => {
    const mat = new StandardMaterial("", scene);
    mat.diffuseColor = new Color3(1, 0, 1);
    mat.ambientColor = new Color3(0, 0.4, 0);
    mat.emissiveColor = new Color3(1, 0.4, 0);
    mat.specularColor = new Color3(1, 1, 1);

    meshes.forEach((mesh) => {
      mesh.material = mat;
      mesh.checkCollisions = true;
      mesh.scaling = new Vector3(0.03, 0.03, 0.03);
      mesh.parent = objVenus;
    });
  });

  let venusTheta = 0;

  // moon

  const moon = CreateSphere("moon", { diameter: 3, segments: 54 }, scene);
  const moonMaterial = new StandardMaterial("moonMaterial", scene);
  moonMaterial.ambientTexture = new Texture(moonTexture, scene);
  // moonMaterial.emissiveTexture = new Texture(moonTexture, scene);
  // moonMaterial.emissiveTexture.level = 0.4;
  moonMaterial.specularColor = new Color3(0, 0, 0);

  moon.material = moonMaterial;
  moon.checkCollisions = true;

  let moonTheta = Math.PI / 2;

  // earth
  const earth = CreateSphere("earth", { diameter: 10, segments: 54 }, scene);
  const earthMaterial = new StandardMaterial("earthMaterial", scene);
  earthMaterial.ambientTexture = new Texture(earthTexture, scene);
  // earthMaterial.emissiveTexture.level = 0.4;
  earthMaterial.specularColor = new Color3(0, 0, 0);
  earth.material = earthMaterial;
  earth.checkCollisions = true;

  let earthTheta = 0;

  // mars

  const mars = CreateSphere("mars", { diameter: 10, segments: 54 }, scene);
  const marsMaterial = new StandardMaterial("marsMaterial", scene);
  marsMaterial.ambientTexture = new Texture(marsTexture, scene);
  // marsMaterial.emissiveTexture = new Texture(marsTexture, scene);
  // marsMaterial.emissiveTexture.level = 0.4;
  marsMaterial.specularColor = new Color3(0, 0, 0);
  mars.material = marsMaterial;
  mars.checkCollisions = true;

  let marsTheta = 0;

  // jupiter

  const jupiter = CreateSphere(
    "jupiter",
    { diameter: 30, segments: 54 },
    scene
  );

  const jupiterMaterial = new StandardMaterial("jupiterMaterial", scene);
  jupiterMaterial.ambientTexture = new Texture(jupiterTexture, scene);
  // jupiterMaterial.emissiveTexture = new Texture(jupiterTexture, scene);
  // jupiterMaterial.emissiveTexture.level = 0.4;
  jupiterMaterial.specularColor = new Color3(0, 0, 0);
  jupiter.material = jupiterMaterial;
  jupiter.checkCollisions = true;

  let jupiterTheta = 0;

  // saturn

  const ringMaterial = new StandardMaterial("ringMaterial", scene);
  ringMaterial.emissiveTexture = new Texture(ringTexture, scene);
  ringMaterial.emissiveTexture.level = 0.8;
  ringMaterial.backFaceCulling = false;

  const innerRadius = 2.475 * 1.1;
  const outerRadius = 2.475 * 2.3;
  const segments = 100;

  const ringShape = [
    new Vector3(innerRadius, 0, 0),
    new Vector3(outerRadius, 0, 0),
    new Vector3(innerRadius, 0.01, 0),
    new Vector3(outerRadius, 0.01, 0),
  ];

  // NOTE: what is Lathe?
  const ring = CreateLathe(
    "ring",
    {
      shape: ringShape,
      radius: innerRadius,
      tessellation: segments,
      sideOrientation: Mesh.DOUBLESIDE,
    },
    scene
  );
  ring.convertToFlatShadedMesh();
  ring.material = ringMaterial;

  //saturn

  const saturn = CreateSphere("saturn", { diameter: 20, segments: 54 }, scene);
  const saturnMaterial = new StandardMaterial("saturnMaterial", scene);
  saturnMaterial.ambientTexture = new Texture(saturnTexture, scene);
  // saturnMaterial.emissiveTexture = new Texture(saturnTexture, scene);
  // saturnMaterial.emissiveTexture.level = 0.4;
  saturnMaterial.specularColor = new Color3(0, 0, 0);
  saturn.material = saturnMaterial;
  saturn.checkCollisions = true;

  let saturnTheta = 0;

  // uranus
  const uranus = CreateSphere("uranus", { diameter: 32, segments: 54 }, scene);
  const uranusMaterial = new StandardMaterial("uranusMaterial", scene);
  uranusMaterial.ambientTexture = new Texture(uranusTexture, scene);
  // uranusMaterial.emissiveTexture = new Texture(uranusTexture, scene);
  // uranusMaterial.emissiveTexture.level = 0.4;
  uranusMaterial.specularColor = new Color3(0, 0, 0);
  uranus.material = uranusMaterial;
  uranus.checkCollisions = true;

  let uranusTheta = 0;

  // neptune
  const neptune = CreateSphere(
    "neptune",
    { diameter: 32, segments: 54 },
    scene
  );
  const neptuneMaterial = new StandardMaterial("neptuneMaterial", scene);
  neptuneMaterial.ambientTexture = new Texture(neptuneTexture, scene);
  // neptuneMaterial.emissiveTexture = new Texture(neptuneTexture, scene);
  // neptuneMaterial.emissiveTexture.level = 0.4;
  neptuneMaterial.specularColor = new Color3(0, 0, 0);
  neptune.material = neptuneMaterial;
  neptune.checkCollisions = true;

  let neptuneTheta = 0;

  // button

  // const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  // const button = Button.CreateSimpleButton("but", "Click Me");
  // button.width = "150px";
  // button.height = "40px";
  // button.color = "white";
  // button.background = "green";
  // advancedTexture.addControl(button);

  // button.onPointerUpObservable.add(() => {
  //   Emitter.emit("sceneChange", ["scene2", scene]);
  // });
  engine.runRenderLoop(() => {
    tic();
    scene.render();
  });

  function tic() {
    // mercury turn
    mercury.rotation.y += 0.01;
    mercuryTheta += 0.001 / 0.241;
    mercury.position.x = 40 * Math.cos(mercuryTheta);
    mercury.position.z = 100 + 40 * Math.sin(mercuryTheta);

    //venus turn
    objVenus.rotation.y += 0.003;
    venusTheta += 0.001 / 0.615;
    objVenus.position.x = 70 * Math.cos(venusTheta);
    objVenus.position.z = 100 + 70 * Math.sin(venusTheta);

    //earth turn
    earth.rotation.y += 0.01;
    earthTheta += 0.0001;
    earth.position.x = 100 * Math.cos(earthTheta);
    earth.position.z = 100 + 100 * Math.sin(earthTheta);

    moon.rotation.y += 0.01;
    moonTheta += 0.0001 / 0.07;
    moon.position.x = earth.position.x + 10 * Math.cos(moonTheta);
    moon.position.z = earth.position.z + 10 * Math.sin(moonTheta);

    // mars turn
    mars.rotation.y += 0.01;
    marsTheta += 0.001 / 1.88;
    mars.position.x = 152 * Math.cos(marsTheta);
    mars.position.z = 100 + 152 * Math.sin(marsTheta);

    // saturn turn
    saturn.rotation.x = 0.1;
    saturn.rotation.y += 0.0445;
    ring.rotation.x = 0.1;
    saturnTheta += 0.0001 / 29.4;
    ring.position.x = 958 * Math.cos(saturnTheta);
    ring.position.z = 100;
    saturn.position.x = ring.position.x;
    saturn.position.z = ring.position.z;

    // uranus turn
    uranus.rotation.y += 0.00415;
    uranusTheta += 0.0001 / 83.7;
    uranus.position.x = 1920 * Math.cos(uranusTheta);
    uranus.position.z = 100 + 1920 * Math.sin(uranusTheta);

    // neptune turn
    neptune.rotation.y += 0.00415;
    neptuneTheta += 0.0001 / 163.7;
    neptune.position.x = 3000 * Math.cos(neptuneTheta);
    neptune.position.z = 100 + 3000 * Math.sin(neptuneTheta);

    // jupiter turn
    jupiter.rotation.y += 0.01;
    jupiterTheta += 0.0001 / 11.86;
    jupiter.position.x = 300 * Math.cos(jupiterTheta);
    jupiter.position.z = 100 + 300 * Math.sin(jupiterTheta);

    // sun
    objSun.rotation.y += 0.00001;
  }

  return scene;
}
