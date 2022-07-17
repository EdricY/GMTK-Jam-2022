import { drawRoundRect } from "./dice-grid";
import { H, W } from "./globals";
import { gotoNextLevel, level } from "./levels";
import { imgs, sounds } from "./load";
import { Particles } from "./particles";

export class BountyBoard {
  constructor() {
    this.ctx = document.createElement("canvas").getContext("2d");
    this.ctx.canvas.width = 500
    this.ctx.canvas.height = 500
    drawRoundRect(this.ctx, "#dd0", 10, 20, 98, 190, 10, 4, "#8a7611", "#CCC");
    let y = 30;
    this.ctx.drawImage(imgs["gray"], 20, y + 60 * 0, 50, 50)
    this.ctx.drawImage(imgs["glyph1"], 20, y + 60 * 0, 50, 50)
    this.ctx.drawImage(imgs["gray"], 20, y + 60 * 1, 50, 50)
    this.ctx.drawImage(imgs["glyph2"], 20, y + 60 * 1, 50, 50)
    this.ctx.drawImage(imgs["gray"], 20, y + 60 * 2, 50, 50)
    this.ctx.drawImage(imgs["glyph3"], 20, y + 60 * 2, 50, 50)

    this.faces = {
      glyph1: false,
      glyph2: false,
      glyph3: false
    }
  }

  isSubmittable(arr) {
    if (arr.length < 3) return false;
    if (arr.some(x => !x)) return false;
    const face = arr[0].face;
    if (!(face in this.faces)) return false;
    if (arr.some(x => x.face != face)) return false;
    return true
  }

  submitDice(arr) {
    if (!this.isSubmittable(arr)) return
    const face = arr[0].face;

    this.faces[face] = true;

    if (face === "glyph1") Particles.spiral(65, 70, "lime", 30, 10)
    else if (face === "glyph2") Particles.spiral(65, 130, "lime", 30, 10)
    else if (face === "glyph3") Particles.spiral(65, 190, "lime", 30, 10)
    if (this.faces.glyph1 && this.faces.glyph2 && this.faces.glyph3) {
      Particles.spiral(W / 2, H / 2, "lime", 60, 20)
      Particles.spiral(W / 2, H / 2, "white", 60, 20)
      Particles.spiral(W / 2, H / 2, "green", 60, 20)
      setTimeout(gotoNextLevel, 1000)
    }

    sounds.win.currentTime = 0;
    sounds.win.play();
  }

  draw(ctx) {
    ctx.drawImage(this.ctx.canvas, 0, 0);
    const text = `x${level + 2}`;
    ctx.textAlign = "left"
    ctx.fillStyle = "#dd0"
    ctx.fillText(text, 63, 68)
    ctx.fillText(text, 63, 128)
    ctx.fillText(text, 63, 188)
    ctx.fillStyle = "#8a7611"
    ctx.fillText(text, 65, 70)
    ctx.fillText(text, 65, 130)
    ctx.fillText(text, 65, 190)

    if (this.faces.glyph1) ctx.drawImage(imgs["check"], 22, 0);
    if (this.faces.glyph2) ctx.drawImage(imgs["check"], 22, 60);
    if (this.faces.glyph3) ctx.drawImage(imgs["check"], 22, 120);

  }
}

