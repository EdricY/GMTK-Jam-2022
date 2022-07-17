import { Dice } from "./dice";
import { canvas, ctx, gameState, getEl, getDefaultRandomColors, H, MS_PER_UPDATE, randInt, W } from "./globals";
import { leftBtn, rightBtn, setUpInputs, switchButtons } from "./inputs";
import { activeDice, bountyBoard, diceGrid, level, reloadCurrentLevel, resourceManager } from "./levels";
import { preloadAssets, doneLoadingResrcs, imgs, sounds } from "./load";
import { Particles } from "./particles";
import GameState from "./state";

let loseTimer = 0;
let lost = false;

export function init() {
  // initial setup
  preloadAssets();

  // wait for assets to finish loading
  let loadImgInterval = setInterval(() => {
    if (imgs["menu"] && !gameState.inState(GameState.MENU)) {
      gameState.gotoMenu();
    }
    if (doneLoadingResrcs()) {
      leftBtn.disabled = false;
      rightBtn.disabled = false;
      clearInterval(loadImgInterval);
    }
  }, 500)
}

export function gameUpdate() {
  diceGrid.update();
  Particles.update();
  resourceManager.update()
  activeDice.update();

  if (resourceManager.bananas < 2) {
    loseTimer++
    if (loseTimer === 100 || loseTimer === 200) {
      sounds.blip.currentTime = 0
      sounds.blip.play();
    } else if (loseTimer === 300) {
      sounds.blip.currentTime = 0
      sounds.blip.play();

      lost = true;
      switchButtons("RETRY", "EXIT", () => {
        reloadCurrentLevel();
        switchButtons(`ROLL (🍌1)`, "SWEEP (🍌2)", leftBtnAction, rightBtnAction);
        lost = false;
      }, () => {
        gameState.gotoMenu();
        lost = false;
      })
    }
  } else {
    loseTimer = 0;
  }
}

export function gameDraw() {
  ctx.clearRect(0, 0, W, H)
  ctx.drawImage(imgs['background'], 0, 0, W, H)
  bountyBoard.draw(ctx);
  Particles.draw(ctx);
  diceGrid.draw(ctx);
  resourceManager.draw(ctx);
  activeDice.draw(ctx);

  if (lost) {
    ctx.save()
    ctx.globalAlpha = .5
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
    ctx.restore()
    ctx.drawImage(imgs.dead, W / 2 - 200, H / 2 - 200, 400, 400);
  }
  else if (loseTimer > 150) {
    ctx.save()
    ctx.globalAlpha = loseTimer % 10 > 2 ? 1 : .5
    ctx.drawImage(imgs.dead, W - 100, 30, 100, 100);
    ctx.restore()
  } else {
    if (resourceManager.bananas > 20) {
      ctx.drawImage(imgs.happy, W - 100, 30, 100, 100);
    } else if (resourceManager.bananas > 1) {
      ctx.drawImage(imgs.neutral, W - 100, 30, 100, 100);
    } else {
      ctx.drawImage(imgs.dead, W - 100, 30, 100, 100);
    }
  }
}

function onClick(x, y) {
  if (gameState.inState(GameState.TUTORIAL1)) {
    gameState.gotoTutorial2();
  } else if (gameState.inState(GameState.TUTORIAL2)) {
    gameState.gotoGame();
  }
  if (lost) return;
  if (!gameState.inState(GameState.GAME)) return;

  if (diceGrid.allResolved) {
    const didSelct = diceGrid.selectArrowAtXY(x, y);
    if (didSelct) return;
  }

  const clickedDice = diceGrid.getDiceAtXY(x, y);
  if (clickedDice) {
    const sameColoredDice = diceGrid.getConnectedColors(clickedDice);
    if (sameColoredDice.length <= 1) return;
    sameColoredDice.forEach(d => {
      resourceManager.addBananas(1, d.x, d.y)
    })
    diceGrid.uncolorAndReroll(sameColoredDice);
    sounds.shoop.currentTime = 0;
    sounds.shoop.play();
  }
}


export function leftBtnAction() {
  if (diceGrid.selectedLine) {
    const claimedDice = diceGrid.getSelectedLine();
    diceGrid.deselectLine();
    bountyBoard.submitDice(claimedDice);
    claimedDice.forEach(d => d && diceGrid.removeDice(d));
  } else {
    // roll active dice
    if (activeDice.activeCost > resourceManager.bananas) {
      resourceManager.startShake();
      return;
    }
    if (!diceGrid.hasSpace()) return;
    resourceManager.loseBananas(activeDice.activeCost);
    activeDice.diceCount++;
    let d = new Dice(
      [...activeDice.dice.faces],
      [...activeDice.dice.colors],
    )
    d.roll();
    diceGrid.addDiceRandomLoc(d);
    diceGrid.update();
    activeDice.incrementActiveCost();
  }
}

export function rightBtnAction() {
  if (diceGrid.selectedLine) {
    if (resourceManager.bananas < 4 + level) {
      resourceManager.startShake();
      return;
    }
    resourceManager.loseBananas(5)

    diceGrid.rerollSelectedLine();
    diceGrid.deselectLine();
  } else {
    if (resourceManager.bananas <= 1) {
      resourceManager.startShake();
      return;
    }
    activeDice.startSweep();
    resourceManager.loseBananas(2)
  }

}

setUpInputs(onClick)
init();
