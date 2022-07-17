import { ctx, H, randEl, randInt, W } from "./globals";
import { leftBtn, rightBtn, switchButtons } from "./inputs";
import { activeDice, bountyBoard, level } from "./levels";
import { imgs } from "./load";
import { leftBtnAction, rightBtnAction } from "./main";

const squareSize = 80;

export class DiceGrid {
  constructor(n = 5) {
    this.n = n;
    this.size = n * squareSize;
    this.halfsize = n * squareSize / 2;
    this.leftEdge = (W / 2) - this.halfsize;
    this.topEdge = H - this.size - squareSize * 3;
    this.grid = new Array(n * n).fill(null);
    this.allResolved = true;

    this.hArrows = new Array(n).fill(false);
    this.vArrows = new Array(n).fill(false);

    this.selectedLine = null;
  }

  getSelectedLine() {
    if (!this.selectedLine) return [];
    if (this.selectedLine[0] === 'v') return this.getCol(this.selectedLine[1])
    else if (this.selectedLine[0] === 'h') return this.getRow(this.selectedLine[1])
  }

  rerollSelectedLine() {
    if (!this.selectedLine) return;
    if (this.selectedLine[0] === 'v') this.rerollCol(this.selectedLine[1])
    else if (this.selectedLine[0] === 'h') this.rerollRow(this.selectedLine[1])
  }

  deselectLine() {
    this.selectedLine = null;
    switchButtons(`ROLL (🍌${activeDice.activeCost})`, "SWEEP (🍌2)", leftBtnAction, rightBtnAction)
  }

  rerollRow(r) {
    if (r < 0 || r >= this.n) return;
    const first = r * this.n;
    for (let count = 0; count < this.n; count++) {
      this.grid[first + count]?.roll();
    }
  }

  rerollCol(c) {
    if (c < 0 || c >= this.n) return;
    const first = c;
    for (let count = 0; count < this.n; count++) {
      this.grid[first + count * this.n]?.roll();
    }
  }

  getRow(r) {
    const arr = [];
    if (r < 0 || r >= this.n) return arr;
    const first = r * this.n;
    for (let count = 0; count < this.n; count++) {
      arr.push(this.grid[first + count])
    }
    return arr;
  }

  getCol(c) {
    const arr = [];
    if (c < 0 || c >= this.n) return arr;
    const first = c;
    for (let count = 0; count < this.n; count++) {
      arr.push(this.grid[first + count * this.n])
    }
    return arr;
  }

  contains(x, y) {
    if (x < this.leftEdge) return false;
    if (x >= this.leftEdge + this.size) return false;
    if (y < this.topEdge) return false;
    if (y >= this.topEdge + this.size) return false;
    return true;
  }

  outerContains(x, y) {
    if (x < this.leftEdge - squareSize) return false;
    if (x >= this.leftEdge + this.size + squareSize) return false;
    if (y < this.topEdge - squareSize) return false;
    if (y >= this.topEdge + this.size + squareSize) return false;
    return true;
  }

  getDiceAtXY(x, y) {
    if (!this.contains(x, y)) {
      return undefined;
    }
    const dx = x - this.leftEdge;
    const dy = y - this.topEdge;
    const c = Math.floor(dx / squareSize);
    const r = Math.floor(dy / squareSize);
    return this.getDiceAtRC(r, c);
  }

  getConnectedColors(dice) {
    if (!dice) return [];
    if (dice.color === "gray") return [];
    const idx = this.grid.findIndex(x => x === dice);
    if (idx == -1) return [];
    const r = Math.floor(idx / this.n);
    const c = idx % this.n;
    return this.connectedColorsTraverse(dice.color, r, c)
  }

  connectedColorsTraverse(color, r, c, arr = []) {
    const d = this.getDiceAtRC(r, c);
    if (!d) return;
    if (arr.includes(d)) return;
    if (!d.resolved) return;
    if (d.color !== color) return;
    arr.push(d);
    this.connectedColorsTraverse(color, r + 1, c, arr);
    this.connectedColorsTraverse(color, r - 1, c, arr);
    this.connectedColorsTraverse(color, r, c + 1, arr);
    this.connectedColorsTraverse(color, r, c - 1, arr);
    return arr;
  }

  uncolorAndReroll(diceArr) {
    for (let index = 0; index < diceArr.length; index++) {
      const dice = diceArr[index];
      dice.colors[dice.faceIdx] = "gray";
      // dice.faces[dice.faceIdx] = "gray";
      dice.remapFaces();
      dice.particleSpiral();
      dice.doDelayedReroll();
    }
  }

  getArrowAtXY(x, y) {
    if (this.contains(x, y)) return null;
    if (!this.outerContains(x, y)) return null;

    const dx = x - this.leftEdge;
    const dy = y - this.topEdge;
    const c = Math.floor(dx / squareSize);
    const r = Math.floor(dy / squareSize);
    if ((c === -1 || c === this.n) && r < this.n && r >= 0) {
      if (!this.anyDiceInRow(r)) return null;
      return ["h", r];
    }
    if ((r === -1 || r === this.n) && c < this.n && c >= 0) {
      if (!this.anyDiceInCol(c)) return null;
      return ["v", c];
    }
  }

  selectArrowAtXY(x, y) {
    const lastSelected = this.selectedLine;
    this.selectedLine = this.getArrowAtXY(x, y);
    if (this.selectedLine) {
      switchButtons(bountyBoard.isSubmittable(this.getSelectedLine()) ? "SUBMIT!" : "REMOVE",
        `REROLL (🍌${4 + level})`,
        leftBtnAction,
        rightBtnAction

      );
      return true;
    } else if (lastSelected) {
      this.deselectLine();
    }
    return false;
  }

  getDiceAtRC(r, c) {
    if (r < 0 || r >= this.n) return;
    if (c < 0 || c >= this.n) return;
    return this.grid[r * this.n + c];
  }

  removeAt(r, c) {
    this.grid[r * this.n + c] = null;

    if (!this.anyDiceInCol(c)) this.vArrows[c] = false;
    if (!this.anyDiceInRow(r)) this.hArrows[r] = false;
  }

  remove(idx) {
    this.removeAt(Math.floor(idx / this.n), idx % this.n)
  }

  removeDice(d) {
    const idx = this.grid.findIndex((x) => x === d);
    this.remove(idx);
  }

  hasSpace() {
    return this.grid.some(x => x === null);
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
    this.vArrows[c] = true;
    this.hArrows[r] = true;
    dice.x = this.leftEdge + (c * squareSize) + squareSize / 2;
    dice.y = this.topEdge + (r * squareSize) + squareSize / 2;
    dice.x += randInt(-2, 2);
    dice.y += randInt(-2, 2);
    this.grid[r * this.n + c] = dice;
  }

  anyDiceInCol(c) {
    for (let i = 0; i < this.n; i++) {
      if (this.grid[c + i * this.n]) return true;
    }
    return false;
  }

  anyDiceInRow(r) {
    for (let i = 0; i < this.n; i++) {
      if (this.grid[r * this.n + i]) return true;
    }
    return false;
  }

  drawSelectedLine(ctx) {
    if (!this.selectedLine) return;
    if (this.selectedLine[0] === 'v') {
      const c = this.selectedLine[1];
      drawRoundRect(ctx, "#dd0", this.leftEdge + c * squareSize, this.topEdge, squareSize, this.size, 10, 4, "#8a7611")
    }
    else if (this.selectedLine[0] === 'h') {
      const r = this.selectedLine[1];
      drawRoundRect(ctx, "#dd0", this.leftEdge, this.topEdge + r * squareSize, this.size, squareSize, 10, 4, "#8a7611")
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.grid.length; i++) {
      const dice = this.grid[i];
      if (dice) {
        let offset = Math.sin(.005 * Date.now() + i * Math.PI / .81);
        ctx.save()
        ctx.translate(offset, 0)
        dice.draw(ctx)
        ctx.restore()
      }
    }

    if (!this.allResolved) return;
    this.drawSelectedLine(ctx);
    // vertical arrows
    for (let c = 0; c < this.n; c++) {


      if (!this.vArrows[c]) continue;

      let x = this.leftEdge + c * squareSize;
      let offset = 5 * Math.sin(.005 * Date.now() + c * Math.PI / .81);
      let topY = this.topEdge - squareSize + offset;
      let botY = this.topEdge + this.size - offset;
      ctx.drawImage(imgs["arrowDown"], x, topY, squareSize, squareSize);
      ctx.drawImage(imgs["arrowUp"], x, botY, squareSize, squareSize);
    }

    // horizontal arrows
    for (let r = 0; r < this.n; r++) {
      if (!this.hArrows[r]) continue;
      let y = this.topEdge + r * squareSize;
      let offset = 5 * Math.sin(.005 * Date.now() + r * Math.PI / .81);
      let lx = this.leftEdge - squareSize + offset;
      let rx = this.leftEdge + this.size - offset + 10;
      ctx.drawImage(imgs["arrowRight"], lx, y, squareSize, squareSize);
      ctx.drawImage(imgs["arrowLeft"], rx, y, squareSize, squareSize);
    }
  }

  update() {
    this.allResolved = true;
    for (let index = 0; index < this.grid.length; index++) {
      const dice = this.grid[index];
      if (!dice) continue;
      dice.update();
      if (!dice.resolved) this.allResolved = false;
    }
  }
}


const pi = Math.PI;
export function drawRoundRect(ctx, color, x, y, w, h, r, lw, backColor, fillColor) {
  if (backColor) {
    ctx.save();
    ctx.translate(3, 3)
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, 1.5 * pi, pi, true);
    ctx.arc(x + r, y + h - r, r, pi, .5 * pi, true);
    ctx.arc(x + w - r, y + h - r, r, .5 * pi, 0, true);
    ctx.arc(x + w - r, y + r, r, 0, 1.5 * pi, true);
    ctx.closePath();
    ctx.strokeStyle = backColor;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(x + r, y + r, r, 1.5 * pi, pi, true);
  ctx.arc(x + r, y + h - r, r, pi, .5 * pi, true);
  ctx.arc(x + w - r, y + h - r, r, .5 * pi, 0, true);
  ctx.arc(x + w - r, y + r, r, 0, 1.5 * pi, true);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
}

