import { Dice } from "./dice";
import { H, W, canvas, ctx, MS_PER_UPDATE, randInt } from "./globals"
import { leftBtn, rightBtn, switchButtons } from "./inputs";
import { loadLevel1 } from "./levels";
import { imgs } from "./load";
import { gameDraw, gameUpdate, leftBtnAction, rightBtnAction } from "./main";

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
  static get TUTORIAL1() { return 4 }
  static get TUTORIAL2() { return 5 }

  inState(num) {
    return this.state == num
  }

  gotoMenu() {
    leftBtn.classList.remove("nodisp");
    rightBtn.classList.remove("nodisp");

    this.keepTicking = false;
    this.state = GameState.MENU;

    ctx.drawImage(imgs["menu"], 0, 0, W, H);
    this.update = () => { }
    this.draw = () => {
      ctx.drawImage(imgs["menu"], 0, 0, W, H);
    }

    switchButtons("PLAY", "CREDITS", () => this.gotoTutorial1(), () => this.gotoCredits())
  }

  gotoCredits() {
    leftBtn.classList.remove("nodisp");
    rightBtn.classList.remove("nodisp");

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
    this.update = () => { }

    requestAnimationFrame(this.tick.bind(this));



    switchButtons("BACK", "DO MAGIC", () => this.gotoMenu(), () => {
      const rand = randInt(0, 5);
      creditsDice.forEach(x => x.rollToFace(rand))
    }
    )
  }

  gotoTutorial1() {
    leftBtn.classList.add("nodisp");
    rightBtn.classList.add("nodisp");
    this.keepTicking = false;
    this.state = GameState.TUTORIAL1;
    this.draw = () => tutorialDraw1(ctx);
    tutorialDraw1(ctx)
  }

  gotoTutorial2() {
    leftBtn.classList.add("nodisp");
    rightBtn.classList.add("nodisp");

    this.keepTicking = false;
    this.state = GameState.TUTORIAL2;
    this.draw = () => tutorialDraw2(ctx);
    tutorialDraw2(ctx)
  }

  gotoGame() {
    leftBtn.classList.remove("nodisp");
    rightBtn.classList.remove("nodisp");

    this.keepTicking = true;
    this.state = GameState.GAME;
    this.update = gameUpdate;
    this.draw = gameDraw;
    requestAnimationFrame(this.tick.bind(this));

    switchButtons(`ROLL (1)`, "SWEEP (2)", leftBtnAction, rightBtnAction);
    loadLevel1();
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

function tutorialDraw1(ctx) {
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(imgs["tutorial1"], 0, 0, W, H);
}

function tutorialDraw2(ctx) {
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(imgs["tutorial2"], 0, 0, W, H);
}