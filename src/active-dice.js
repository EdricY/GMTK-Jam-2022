import { Dice } from "./dice"
import { getDefaultRandomColors, randEl } from "./globals"
import { leftBtn } from "./inputs";



const duration = 200;
export class ActiveDice {
  constructor() {
    this.diceCount = 0;
    this.dice = new Dice(
      [
        "onebanana",
        "splitbanana",
        "threebanana",
        "onebanana",
        "onebanana",
        "threebanana"
      ],
      getDefaultRandomColors(),
      250, 100
    )

    this.dice.renderer.rollStopTime = Date.now() + 99999999;
    this.dice.renderer.rotXVel = .001;
    this.dice.renderer.rotYVel = -.005;

    this.sweepTime = Date.now();
    this.didSweep = true;

    this.activeCost = 1;
    leftBtn.innerText = `ROLL (${this.activeCost})`;

  }
  incrementActiveCost() {
    this.activeCost += Math.round(this.activeCost / 2)
    leftBtn.innerText = `ROLL (${this.activeCost})`;
  }
  startSweep() {
    this.didSweep = false;
    this.sweepTime = Date.now() + duration;
  }

  sweep() {
    this.diceCount++;
    this.activeCost = 1;
    leftBtn.innerText = `ROLL (${this.activeCost})`;

    const faces = getRandomFaces(this.diceCount)

    this.dice.faces = faces;
    this.dice.colors = getRandomColors()
    this.dice.remapFaces();

    this.dice.renderer.rollStopTime = Date.now() + 99999999;
  }

  update() {
    if (!this.didSweep && Date.now() > this.sweepTime) {
      this.sweep();
      this.didSweep = true;
    }
  }

  draw(ctx) {
    if (Date.now() < this.sweepTime) {
      //sweep away
      let frac = 1 - (this.sweepTime - Date.now()) / duration
      ctx.save();
      ctx.globalAlpha = 1 - frac
      ctx.translate(frac * 300, 0)
      this.dice.draw(ctx);
      ctx.restore();
    } else if (Date.now() - duration / 2 < this.sweepTime) {
      // swoop in
      let frac = -(this.sweepTime - Date.now()) / duration * 2
      ctx.save();
      ctx.globalAlpha = 1 - frac
      ctx.translate(0, (frac * 50) - 50)
      this.dice.draw(ctx);
      ctx.restore();
    } else {
      this.dice.draw(ctx);
    }
  }

}

const defaultColors = ["red", "blue", "green", "red", "blue", "green"]

function getRandomColors() {
  const rand = Math.random();
  let arr;
  if (rand < 0.25) {
    arr = ["red", "red", "red", "red", randEl(defaultColors), randEl(defaultColors)]
  } else if (rand < 0.5) {
    arr = ["green", "green", "green", "green", randEl(defaultColors), randEl(defaultColors)]
  } else if (rand < 0.5) {
    arr = ["blue", "blue", "blue", "blue", randEl(defaultColors), randEl(defaultColors)]
  } else {
    arr = getDefaultRandomColors()
  }
  return arr;
}

let bananaOptions1 = [
  "onebanana",
  "onebanana",
  "onebanana",
  "onebanana",
  "onebanana",
  "splitbanana",
  "threebanana",
  "threebanana"
]

let faceOptions = [
  "onebanana",
  "splitbanana",
  "threebanana",
  "glyph1",
  "glyph2",
  "glyph3",
]

function getRandomFaces(diceCount) {
  if (diceCount < 5) {
    return [
      randEl(bananaOptions1),
      randEl(bananaOptions1),
      randEl(bananaOptions1),
      randEl(bananaOptions1),
      randEl(bananaOptions1),
      randEl(bananaOptions1),
    ]
  }

  return [
    randEl(faceOptions),
    randEl(faceOptions),
    randEl(faceOptions),
    randEl(faceOptions),
    randEl(faceOptions),
    randEl(faceOptions),
  ];
}