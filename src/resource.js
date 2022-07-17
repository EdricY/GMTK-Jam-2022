export class ResourceManager {
  constructor() {
    this.bananas = 20;
    this.messages = [];
  }

  loseBananas(num) {
    this.bananas -= num;

  }

  addBananas(num, x, y) {
    this.bananas += num;
    this.messages.push(new PlusMessage(num, x, y));
    this.shakeCountdown = 0;
  }

  startShake() {
    this.shakeCountdown = 30;
  }

  update() {
    for (let index = 0; index < this.messages.length; index++) {
      const m = this.messages[index];
      if (m.isExpired()) {
        this.messages.splice(index--)
      }
    }

    if (this.shakeCountdown > 0) this.shakeCountdown--
  }

  draw(ctx) {
    // hud
    ctx.font = "bold 30px 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif";
    ctx.textAlign = "right"
    ctx.fillStyle = "#8a7611";
    ctx.fillText(`Bananas: ${this.bananas}`, 580, 140)
    if (this.shakeCountdown > 0 && this.shakeCountdown % 6 > 2) {
      ctx.fillStyle = "#d00";
    } else {
      ctx.fillStyle = "#dd0";
    }
    ctx.fillText(`Bananas: ${this.bananas}`, 582, 142);


    for (let index = 0; index < this.messages.length; index++) {
      const m = this.messages[index];
      m.draw(ctx)
    }
  }
}


const duration = 1000;
class PlusMessage {
  constructor(num, x, y) {
    this.x = x;
    this.y = y;
    this.num = num;
    this.endTime = Date.now() + duration;
  }

  isExpired() {
    return Date.now() > this.endTime;
  }

  draw(ctx) {
    const percent = (this.endTime - Date.now()) / duration;
    const y = this.y - 50 + percent * 50
    ctx.save();
    ctx.globalAlpha = percent;
    ctx.font = "bold 30px 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif";
    ctx.textAlign = "center"
    ctx.fillStyle = "#8a7611";
    ctx.fillText(`+${this.num}`, this.x - 2, y - 2)
    ctx.fillStyle = "#dd0";
    ctx.fillText(`+${this.num}`, this.x, y);
    ctx.restore();
  }
}
