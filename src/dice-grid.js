import { H, randEl, randInt, W } from "./globals";
import { imgs } from "./load";

const squareSize = 80;

export class DiceGrid {
  constructor(n = 5) {
    this.n = n;
    this.size = n * squareSize;
    this.halfsize = n * squareSize / 2;
    this.leftEdge = (W / 2) - this.halfsize;
    this.topEdge = H - this.size - squareSize * 2.5;
    console.log(this.topEdge)
    this.grid = new Array(n * n).fill(null);

  }

  getRC(r, c) {
    return this.grid[r * this.n + c];
  }

  removeAt(r, c) {
    this.grid[r * this.n + c] = null;
  }

  removeDice(d) {
    const idx = this.grid.findIndex((x) => x === d);
    this.grid[idx] = null;
  }

  addDiceSequential(dice) {
    const openIdx = this.grid.findIndex((x) => x === null);
    if (openIdx == -1) return;
    const r = Math.floor(openIdx / this.n);
    const c = openIdx % this.n;
    this.addDice(dice, r, c)
  }

  addDiceRandomLoc(dice) {
    const opens = this.grid.map((x, i) => x ? null : i);
    const openIndexes = opens.filter(x => x !== null);
    if (openIndexes.length == 0) return;
    const idx = randEl(openIndexes);
    const r = Math.floor(idx / this.n);
    const c = idx % this.n;
    this.addDice(dice, r, c);
  }

  addDice(dice, r, c) {
    dice.x = this.leftEdge + (c * squareSize) + squareSize / 2;
    dice.y = this.topEdge + (r * squareSize) + squareSize / 2;
    dice.x += randInt(-5, 5);
    dice.y += randInt(-2, 2);
    this.grid[r * this.n + c] = dice;
  }

  draw(ctx) {
    for (let i = 0; i < this.grid.length; i++) {
      const dice = this.grid[i];
      if (dice) dice.draw(ctx)
    }


    // vertical arrows
    for (let i = 0; i < this.n; i++) {
      let x = this.leftEdge + i * squareSize;
      let offset = 5 * Math.sin(.005 * Date.now() + i * Math.PI / .81);
      let topY = this.topEdge - squareSize + offset;
      let botY = this.topEdge + this.size - offset;
      ctx.drawImage(imgs["arrowDown"], x, topY, squareSize, squareSize);
      ctx.drawImage(imgs["arrowUp"], x, botY, squareSize, squareSize);
    }

    // horizontal arrows
    for (let i = 0; i < this.n; i++) {
      let y = this.topEdge + i * squareSize;
      let offset = 5 * Math.sin(.005 * Date.now() + i * Math.PI / .81);
      let lx = this.leftEdge - squareSize + offset;
      let rx = this.leftEdge + this.size - offset + 10;
      ctx.drawImage(imgs["arrowRight"], lx, y, squareSize, squareSize);
      ctx.drawImage(imgs["arrowLeft"], rx, y, squareSize, squareSize);
    }
  }
}