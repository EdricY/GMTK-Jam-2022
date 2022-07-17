import { DiceRender } from "./dice-render";
import { H, MS_PER_UPDATE, randEl, randInt, W } from "./globals";
import { resourceManager } from "./levels";
import { sounds } from "./load";
import { Particles } from "./particles";

const colorDict = {
  red: "#df4a36",
  blue: "#2aadda",
  green: "#60cb9f",
  gray: "#999",
}

export class Dice {
  constructor(faces, colors, x = 0, y = 0) {
    this.renderer = new DiceRender(faces, colors)
    this.faces = faces;
    this.colors = colors;
    this.faceIdx = 0;
    this.face;
    this.color;
    this.resolved = false;
    this.x = x;
    this.y = y;

    this.rerollCountdown = 0;
  }

  get face() {
    return this.faces[this.faceIdx];
  }
  get color() {
    return this.colors[this.faceIdx];
  }

  doDelayedReroll(ticks = 20) {
    this.rerollCountdown = ticks;
  }

  remapFaces() {
    this.renderer.mapFaces(this.faces, this.colors);
    this.renderer.draw(this.renderer.bufferCtx, this.x, this.y, true);
  }

  particleExplode() {
    Particles.explode(this.x, this.y, colorDict[this.color])
  }

  particleSpiral() {
    Particles.explode(this.x, this.y, colorDict[this.color])
  }

  update() {
    if (this.rerollCountdown > 0) {
      this.rerollCountdown--
      if (this.rerollCountdown === 1) {
        this.roll();
      }
      return;
    }

    if (!this.resolved && this.renderer.shouldBeResolved()) {
      this.resolved = true;
      const clunkName = randEl(["clunk1", "clunk2", "clunk3", "clunk4",])
      const clunk = sounds[clunkName];
      clunk.currentTime = 0
      clunk.play();
      Particles.explode(this.x, this.y, colorDict[this.color]);

      if (this.face === "onebanana") {
        resourceManager.addBananas(1, this.x, this.y);
      } else if (this.face === "threebanana") {
        resourceManager.addBananas(3, this.x, this.y);
      }
    }

  }

  draw(ctx) {
    this.renderer.draw(ctx, this.x, this.y);
  }

  roll() {
    this.rollToFace(randInt(0, 5))
  }

  rollToFace(idx) {
    this.resolved = false;
    this.faceIdx = idx;
    this.renderer.roll(idx, randInt(1000, 2000), .01 + Math.random())
  }

}