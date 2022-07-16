import { Dice } from "./dice";
import { allDice, ctx, H, MS_PER_UPDATE, W } from "./globals";
import { preloadAssets, doneLoadingResrcs, imgs } from "./load";

function init() {
  // initial setup
  preloadAssets();

  // wait for assets to finish loading
  let loadImgInterval = setInterval(() => {
    if (doneLoadingResrcs()) {
      clearInterval(loadImgInterval);

      addALotOfDice();
      tick();
    }
  }, 100)
}

let lastTime;
let lag;
function tick() {
  let current = performance.now();
  let elapsed = current - lastTime;
  lastTime = current;
  lag += elapsed;
  while (lag >= MS_PER_UPDATE) {
    this.update();
    lag -= MS_PER_UPDATE;
  }
  draw();
  requestAnimationFrame(tick);
}

function update() {

}

function draw() {
  ctx.clearRect(0, 0, W, H)
  allDice.forEach(d => d.draw(ctx))
}

function addALotOfDice() {
  console.log('start!');
  for (let i = 0; i < 17; i++) {
    let d = new Dice(
      ["shield", "arrow", "arrow", "arrow", "arrow", "arrow"],
      ["gray", "gray", "gray", "green", "red", "blue"],
    )
    d.x = 100 + Math.random() * 300;
    d.y = 100 + Math.random() * 300;
    allDice.push(d);
    d.roll(Math.floor((Math.random() * 6)), 1000, 1);
  }
}


init();
