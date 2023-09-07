import {
  Application,
  Texture,
  Sprite,
  Assets,
  Loader,
  Rectangle,
  BaseTexture,
  Spritesheet,
  Text,
  ParticleContainer,
  Graphics,
} from "pixi.js";
import metaData from "./static/treasureHunter.json";
import { keyboard } from "./keyboard";

const app = new Application({
  width: 256,
  height: 256,
  antialias: true,
  resolution: 1,
  backgroundColor: 0x061639,
});

app.renderer.resize(512, 512);
app.resizeTo = window;

// Texture from 과 Assets load의 차이가?
// 현재까지는 없어보이는데?

// const texture = Texture.from(
//   "https://pixijs.io/examples/examples/assets/bunny.png"
// );
//

const texture = await Assets.load(
  "https://pixijs.io/examples/examples/assets/bunny.png"
);
const titleSet = await Assets.load("./static/tileset.png");
// verse new Sprite?
// const bunny = new Sprite(texture);
const bunny = Sprite.from(texture);
bunny.scale.set(5, 5);
bunny.position.set(200, 200);
bunny.anchor.set(0.5, 0.5);
bunny.rotation = 0.5;

// titleSet image의 사이즈

// 하나의 이미지가 64x64 이고, 5*6으로 총 30개의 이미지가 있다.
// x위치, y위치, width, height <-- 로켓의 위치를 타일셋에서 계산했다
const rectangle = new Rectangle(192, 128, 64, 64);

// titleSet.frame = rectangle2;
//
titleSet.frame = rectangle;

const rocket = Sprite.from(titleSet);
rocket.x = 32;
rocket.y = 32;
app.stage.addChild(rocket);

// app.stage.addChild(bunny);

const spriteSheet = new Spritesheet(
  BaseTexture.from("./static/treasureHunter.png"),
  metaData // json 그냥 Import 해도 되는구나
);
await spriteSheet.parse();

const dungeon = new Sprite(spriteSheet.textures["dungeon.png"]);
app.stage.addChild(dungeon);

const explorer = new Sprite(spriteSheet.textures["explorer.png"]);
explorer.x = 68;
explorer.y = app.stage.height / 2 - explorer.height / 2;
app.stage.addChild(explorer);
let explorerHit = false;

const treasure = new Sprite(spriteSheet.textures["treasure.png"]);

treasure.x = app.stage.width - treasure.width - 48;
treasure.y = app.stage.height / 2 - treasure.height / 2;
app.stage.addChild(treasure);

function randomInit(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const blobs = Array.from({ length: 6 }).map((_, i) => {
  const [spacing, xOffset] = [48, 150];
  const blob = new Sprite(spriteSheet.textures["blob.png"]);
  blob.x = spacing * i + xOffset;
  blob.y = randomInit(0, app.stage.height - blob.height);

  app.stage.addChild(blob);
  return blob;
});

const text = new Text("Hello Pixi!");
text.x = app.stage.width / 2 - text.width / 2;
text.y = app.stage.height / 2 - text.height / 2;
text.style.fill = 0xffffff;
text.style.fontSize = 64;
app.stage.addChild(text);
text.text = 1;

const up = keyboard("ArrowUp");
const down = keyboard("ArrowDown");
const left = keyboard("ArrowLeft");
const right = keyboard("ArrowRight");
let vx = 0;
let vy = 0;
up.press = () => {
  vy = -2;
  vx = 0;
};
up.release = () => {
  if (!down.isDown && vx === 0) vy = 0;
};

down.press = () => {
  vy = 2;
  vx = 0;
};
down.release = () => {
  if (!up.isDown && vx === 0) vy = 0;
};

left.press = () => {
  if (left.isDown && explorerHit) return;

  vx = -2;
  vy = 0;
};
left.release = () => {
  if (!right.isDown && vy === 0) vx = 0;
};

right.press = () => {
  vx = 2;
  vy = 0;
  return;
};
right.release = () => {
  if (!left.isDown && vy === 0) vx = 0;
};
// 밑에 선언할수록 위의 레이어에 올려진다. 크로와상 만들듯 층층이
// app.stage.addChild(bunny);
// const superIt = new ParticleContainer();
// superIt.addChild(bunny);
// app.stage.addChild(superIt);

// 그래픽스는 스프라이트가 아니지만, 마찬가지로 stage에 add 해야한다.
//캔버스나 D3와 유사
const rect = new Graphics();
rect.lineStyle({ width: 4, color: "blue", alpha: 1 });
rect.drawRect(10, 10, 32, 32);
app.stage.addChild(rect);

// let state: "play" | "pause" = "play";

app.ticker.add((delta) => {
  explorerHit = collisionDetection(explorer, [...blobs, treasure]);
  gameLoop(delta);
});

function collisionDetection(player: Sprite, obstacles: Sprite[]) {
  return obstacles.some((obstacle) => {
    // Getbounds라는 아주 편한 메서드가 있다. 알아서 스프라이트의 경계를 구해줌
    const playerBounds = player.getBounds();
    const obstacleBounds = obstacle.getBounds();
    return (
      playerBounds.x + playerBounds.width > obstacleBounds.x &&
      playerBounds.x < obstacleBounds.x + obstacleBounds.width &&
      playerBounds.y + playerBounds.height > obstacleBounds.y &&
      playerBounds.y < obstacleBounds.y + obstacleBounds.height
    );
  });
}
function gameLoop(delta: number, state: "play" | "pause" = "play") {
  if (state === "play") play(delta);
}

function play(delta: number) {
  explorer.x += vx;
  explorer.y += vy;
}

document.body.appendChild(app.view as HTMLCanvasElement);
