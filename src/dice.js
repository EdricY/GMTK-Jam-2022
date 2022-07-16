import { DiceRender } from "./dice-render";
import { H, MS_PER_UPDATE, randEl, randInt, W } from "./globals";
import { sounds } from "./load";
import { Particles } from "./particles";

const colorDict = {
  red: "#df4a36",
  blue: "#2aadda",
  green: "#60cb9f",
  gray: "#999",
}

export class Dice {
  constructor(faces, colors) {
    this.renderer = new DiceRender(faces, colors)
    this.faces = faces;
    this.colors = colors;
    this.faceIdx = 0;
    this.face;
    this.color;
    this.resolved = false;
    this.x = 0;
    this.y = 0;
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
      const clunkName = randEl(["clunk1", "clunk2", "clunk3", "clunk4",])
      const clunk = sounds[clunkName];
      clunk.currentTime = 0
      clunk.play();
      Particles.explode(this.x, this.y, colorDict[this.color])
    }
  }

  draw(ctx) {
    this.renderer.draw(ctx, this.x, this.y);
  }

  roll() {
    this.resolved = false;
    this.faceIdx = randInt(0, 5);
    this.renderer.roll(this.faceIdx, randInt(1000, 2000), .01 + Math.random())
  }
}