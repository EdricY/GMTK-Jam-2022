import { Dice } from "./dice";
import { DiceGrid } from "./dice-grid";
import { canvas, ctx, getEl, H, MS_PER_UPDATE, randInt, W } from "./globals";
import { setUpInputs } from "./inputs";
import { preloadAssets, doneLoadingResrcs, imgs } from "./load";
import { drawMenu } from "./menu";
let diceGrid;
getEl("leftBtn").onclick = () => {
  screen.orientation.lock('portrait');
  document.body.requestFullscreen();
}
function init() {

  drawMenu(ctx);
  // initial setup
  preloadAssets();

  // wait for assets to finish loading
  let loadImgInterval = setInterval(() => {
    if (doneLoadingResrcs()) {
      clearInterval(loadImgInterval);

      diceGrid = new DiceGrid();
      window.diceGrid = diceGrid
      addALotOfDice();
      tick();
    }
  }, 500)
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
  const now = Date.now()
  ctx.clearRect(0, 0, W, H)
  diceGrid.draw(ctx);
}

function addALotOfDice() {
  console.log('start!');
  for (let i = 0; i < 5; i++) {
    let d = Math.random() < .5 ? new Dice(
      ["arrowDown", "arrowDown", "arrowDown", "arrowDown", "arrowDown", "arrowDown"],
      ["gray", "gray", "gray", "green", "green", "green"],
    ) : new Dice(
      ["shield", "shield", "shield", "shield", "shield", "shield"],
      ["red", "blue", "blue", "blue", "red", "blue"],
    )
    diceGrid.addDiceRandomLoc(d);
    d.roll(randInt(1, 6), 1000 + randInt(10, 3000), .01 + Math.random());
  }
}

function onClick(x, y) {
  let d = Math.random() < .5 ? new Dice(
    ["arrowDown", "arrowDown", "arrowDown", "arrowDown", "arrowDown", "arrowDown"],
    ["gray", "gray", "gray", "green", "green", "green"],
  ) : new Dice(
    ["shield", "shield", "shield", "shield", "shield", "shield"],
    ["red", "blue", "blue", "blue", "red", "blue"],
  )
  diceGrid.addDiceSequential(d);
  d.roll(randInt(1, 6), 1000 + randInt(10, 3000), .01 + Math.random());
}

setUpInputs(onClick)
init();
