let tau = 2 * Math.PI;
let partColors = ["#812", "#26C", "#262"];

export const Particles = {
  parts: [],
  update: function () {
    let len = this.parts.length;
    for (let i = 0; i < len; i++) {
      if (this.parts[i].update) {
        this.parts[i].update();
      }
      else {
        this.parts.splice(i--, 1);
        len--;
      }
    }
  },

  draw: function (ctx) {
    for (let p of this.parts) {
      if (p.draw) p.draw(ctx);
    }
  },
  addPart: function (x, y, color) {
    this.parts.push(newPart(x, y, color));
  },
  explode: function (x, y, color, t = 20, rscale = 4) {
    for (let i = 0; i < t; i++) {
      this.parts.push(newPart(x, y, color, rscale));
    }
  },
  spiral: function (x, y, color, t = 20, rscale = 4) {
    for (let i = 0; i < t; i++) {
      this.parts.push(newSpiralPart(x, y, color, rscale));
    }
  },
  addSpiralPart: function (x, y) {
    this.parts.push(newSpiralPart(x, y));
  },


}

function newPart(x, y, color, rscale) {
  return {
    ox: x,
    oy: y,
    x: x,
    y: y,
    r: 1 + rscale * Math.random(),
    v: .8,
    color: color,
    theta: Math.random() * tau,
    draw: function (ctx) {
      ctx.beginPath();
      let oldW = ctx.lineWidth;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.r, 0, tau);
      ctx.fill();
      ctx.closePath();
      ctx.lineWidth = oldW;
    },
    update: function () {
      this.x += this.v * this.r * Math.cos(this.theta);
      this.y += this.v * this.r * Math.sin(this.theta);
      this.r -= .1;
      if (this.r <= 0) {
        this.update = null;
        this.draw = () => { };
        return;
      }
      this.theta += .3 - .6 * Math.random();
    },

  }
}


function newSpiralPart(x, y, color, rscale) {
  return {
    ox: x,
    oy: y,
    x: x,
    y: y,
    r: 1 + rscale * Math.random(),
    v: 10,
    color: color,
    theta: Math.random() * tau,
    draw: function (ctx) {
      ctx.beginPath();
      ctx.lineWidth = .2;
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.r, 0, tau);
      ctx.fill();
    },
    update: function () {
      this.x += this.r * Math.cos(this.theta);
      this.y += this.r * Math.sin(this.theta);
      this.r -= .1;
      if (this.r <= 0) {
        this.update = null;
        this.draw = () => { };
        return;
      }
      this.theta += .05;
    },

  }
}
