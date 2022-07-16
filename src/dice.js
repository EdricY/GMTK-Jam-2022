import { DiceRender } from "./dice-render";
import { H, MS_PER_UPDATE, randInt, W } from "./globals";
import { sounds } from "./load";

export class Dice {
  constructor(faces, colors, x, y) {
    this.renderer = new DiceRender(faces, colors)
    this.faces = faces;
    this.colors = colors;
    this.faceIdx = 0;
    this.face;
    this.color;
    this.resolved = false;
  }

  get face() {
    return this.faces[this.faceIdx];
  }
  get color() {
    return this.colors[this.faceIdx];
  }

  update() {
    if (!this.resolved && this.renderer.shouldBeResolved()) {
      this.resolved = true;
      sounds["clunk"].currentTime = 0
      sounds["clunk"].play()
    }
  }

  draw(ctx) {
    this.renderer.draw(ctx, this.x, this.y);
  }

  roll() {
    this.resolved = false;
    this.faceIdx = randInt(0, 5);
    this.renderer.roll(this.faceIdx, randInt(500, 1000), .01 + Math.random())
  }
}