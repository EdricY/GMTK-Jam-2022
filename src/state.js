import { Dice } from "./dice";
import { H, W, canvas, ctx, MS_PER_UPDATE, randInt } from "./globals"
import { leftBtn, rightBtn, switchButtons } from "./inputs";
import { imgs } from "./load";
import { gameDraw, gameUpdate, leftBtnAction, rightBtnAction, startGame } from "./main";

export default class GameState {
  constructor() {
    this.state = -1;
    this.keepTicking = false;
    this.update = () => { }
    this.draw = () => { }
  }
  static get MENU() { return 0 }
  static get PAUSE() { return 1 }
  static get GAME() { return 2 }
  static get CRED() { return 3 }

  inState(num) {
    return this.state == num
  }

  gotoMenu() {
    this.keepTicking = false;
    this.state = GameState.MENU;

    ctx.drawImage(imgs["menu"], 0, 0, W, H);
    this.update = () => { }
    this.draw = () => { }

    switchButtons("PLAY", "CREDITS", () => this.gotoGame(), () => this.gotoCredits())
  }

  gotoCredits() {
    this.keepTicking = true;
    this.state = GameState.CRED;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(imgs["credits"], 0, 0, W, H);

    const creditsDice = [
      new Dice(
        ["E", "E", "E", "M", "I", "I"],
        ["gray", "red", "green", "green", "blue", "red"],
        100, 100
      ),
      new Dice(
        ["D", "D", "D", "A", "M", "M"],
        ["gray", "red", "green", "green", "blue", "red"],
        200, 100
      ),
      new Dice(
        ["R", "R", "R", "G", "A", "A"],
        ["gray", "red", "green", "green", "blue", "red"],
        300, 100
      ),
      new Dice(
        ["I", "I", "I", "I", "N", "N"],
        ["gray", "red", "green", "green", "blue", "red"],
        400, 100
      ),
      new Dice(
        ["C", "C", "C", "C", "I", "I"],
        ["gray", "red", "green", "green", "blue", "red"],
        500, 100
      ),
    ];
    creditsDice.forEach(x => x.rollToFace(0))
    this.draw = () => creditsDraw(ctx, creditsDice);
    requestAnimationFrame(this.tick.bind(this));



    switchButtons("BACK", "DO MAGIC", () => this.gotoMenu(), () => {
      const rand = randInt(0, 5);
      creditsDice.forEach(x => x.rollToFace(rand))
    }
    )
  }

  gotoGame() {
    this.keepTicking = true;
    this.state = GameState.GAME;
    this.update = gameUpdate;
    this.draw = gameDraw;
    requestAnimationFrame(this.tick.bind(this));

    leftBtn.innerText = "DICE A"
    leftBtn.onclick = leftBtnAction;

    rightBtn.innerText = "DICE B";
    rightBtn.onclick = rightBtnAction;
  }
  tick() {
    let current = performance.now();
    let elapsed = current - lastTime;
    lastTime = current;
    lag += elapsed;
    while (lag >= MS_PER_UPDATE) {
      this.update();
      lag -= MS_PER_UPDATE;
    }
    this.draw();
    if (this.keepTicking) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }
}

let lastTime = performance.now();
let lag = 0;

function creditsDraw(ctx, creditsDice) {
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(imgs["credits"], 0, 0, W, H);

  creditsDice.forEach(dice => {
    dice.draw(ctx);
  });
}
