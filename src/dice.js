import { DiceRender } from "./dice-render";
import { H, MS_PER_UPDATE, randInt, W } from "./globals";

export class Dice {
  constructor(faces, colors, x, y) {
    this.renderer = new DiceRender(faces, colors)

  }

  draw(ctx) {
    this.renderer.draw(ctx, this.x, this.y);
  }

  roll() {
    this.renderer.roll(randInt(1, 6), 1000 + randInt(10, 3000), .01 + Math.random())
  }
}