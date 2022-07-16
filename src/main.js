import { Dice } from "./dice";
import { DiceGrid } from "./dice-grid";
import { canvas, ctx, gameState, getEl, H, leftBtn, MS_PER_UPDATE, randInt, rightBtn, W } from "./globals";
import { setUpInputs } from "./inputs";
import { preloadAssets, doneLoadingResrcs, imgs } from "./load";
import { Particles } from "./particles";
import GameState from "./state";
let diceGrid;

export function init() {
  // initial setup
  preloadAssets();
  gameState.gotoMenu();

  // wait for assets to finish loading
  let loadImgInterval = setInterval(() => {
    if (doneLoadingResrcs()) {
      leftBtn.disabled = false;
      rightBtn.disabled = false;
      clearInterval(loadImgInterval);

      diceGrid = new DiceGrid();
      window.diceGrid = diceGrid
    }
  }, 500)
}

export function gameUpdate() {
  diceGrid.update();
  Particles.update();
}

export function gameDraw() {
  const now = Date.now()
  ctx.clearRect(0, 0, W, H)
  ctx.drawImage(imgs['background'], 0, 0, W, H)
  Particles.draw(ctx);
  diceGrid.draw(ctx);

}

function onClick(x, y) {
  if (!gameState.inState(GameState.GAME)) {
    return;
  }

  if (diceGrid.allResolved) {

    diceGrid.selectArrowAtXY(x, y);
  }
  // const clickedDice = diceGrid.getDiceAtXY(x, y);
  // if (clickedDice) diceGrid.removeDice(clickedDice)
}

export function leftBtnAction() {
  if (diceGrid.selectedLine) {
    const claimedDice = diceGrid.getSelectedLine();
    diceGrid.deselectLine();
    claimedDice.forEach(d => d && diceGrid.removeDice(d));
  } else {

    let d = new Dice(
      ["onebanana", "onebanana", "splitbanana", "splitbanana", "threebanana", "threebanana"],
      ["red", "blue", "blue", "blue", "red", "blue"],
    )
    d.roll();
    diceGrid.addDiceRandomLoc(d);
    diceGrid.update();
  }
}

export function rightBtnAction() {
  if (diceGrid.selectedLine) {
    diceGrid.rerollSelectedLine();
    diceGrid.deselectLine();
  } else {
    let d = new Dice(
      ["glyph1", "glyph2", "glyph3", "glyph4", "glyph5", "glyph6"],
      ["gray", "red", "green", "green", "blue", "red"],
    )
    d.roll();
    diceGrid.addDiceRandomLoc(d);
    diceGrid.update();

  }

}

setUpInputs(onClick)
init();
