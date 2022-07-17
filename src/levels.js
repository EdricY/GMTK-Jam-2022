

import { DiceGrid } from "./dice-grid";
import { BountyBoard } from "./bounty";
import { ActiveDice } from "./active-dice";
import { ResourceManager } from "./resource";
import { gameState } from "./globals";
import { Dice } from "./dice";
export let diceGrid;
export let activeDice;
export let bountyBoard;
export let resourceManager = new ResourceManager();

export let level = 1;
export function loadLevel1() {
  level = 1;
  diceGrid = new DiceGrid(3);
  bountyBoard = new BountyBoard();
  activeDice = new ActiveDice();
  resourceManager = new ResourceManager();
}

export function loadLevel2() {
  level = 2;
  diceGrid = new DiceGrid(4);
  bountyBoard = new BountyBoard();
  activeDice = new ActiveDice();
  resourceManager = new ResourceManager();

  let d1 = new Dice(
    [...activeDice.dice.faces],
    [...activeDice.dice.colors],
  )
  d1.roll();
  diceGrid.addDiceRandomLoc(d1);
  diceGrid.update();
  let d2 = new Dice(
    [...activeDice.dice.faces],
    [...activeDice.dice.colors],
  )
  d2.roll();
  diceGrid.addDiceRandomLoc(d2);
  diceGrid.update();
}

export function loadLevel3() {
  level = 3;
  diceGrid = new DiceGrid(5);
  bountyBoard = new BountyBoard();
  activeDice = new ActiveDice();
  resourceManager = new ResourceManager();

  let d1 = new Dice(
    [...activeDice.dice.faces],
    [...activeDice.dice.colors],
  )
  d1.roll();
  diceGrid.addDiceRandomLoc(d1);
  diceGrid.update();
  let d2 = new Dice(
    [...activeDice.dice.faces],
    [...activeDice.dice.colors],
  )
  d2.roll();
  diceGrid.addDiceRandomLoc(d2);
  diceGrid.update();
}

export function gotoNextLevel() {
  if (level === 1) loadLevel2()
  else if (level === 2) loadLevel3()
  else if (level === 3) gameState.gotoCredits();
}

export function reloadCurrentLevel() {
  if (level === 1) loadLevel1()
  else if (level === 2) loadLevel2()
  else if (level === 3) loadLevel3()

}
