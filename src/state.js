import { H, leftBtn, rightBtn, W, canvas, ctx, MS_PER_UPDATE } from "./globals"
import { gameDraw, gameUpdate, leftBtnAction, rightBtnAction, startGame } from "./main";

export default class GameState {
  constructor() {
    this.state = 0
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

    ctx.clearRect(0, 0, W, H);
    ctx.font = "50px Arial"
    ctx.fillText("Menu", 100, 100);

    leftBtn.innerText = "PLAY"
    leftBtn.onclick = () => {
      this.gotoGame();
    }

    rightBtn.innerText = "CREDITS"
    rightBtn.onclick = () => this.gotoCredits()
  }

  gotoCredits() {
    this.keepTicking = false;
    this.state = GameState.CRED;

    ctx.clearRect(0, 0, W, H);
    ctx.font = "50px Arial"
    ctx.fillText("Credits", 100, 100);

    leftBtn.innerText = "BACK"
    leftBtn.onclick = () => this.gotoMenu();

    rightBtn.innerText = "DO MAGIC";
    rightBtn.onclick = () => console.log("asdf");
  }

  gotoGame() {
    this.keepTicking = true;
    this.state = GameState.GAME;
    this.update = gameUpdate;
    this.draw = gameDraw;
    requestAnimationFrame(this.tick.bind(this));

    leftBtn.innerText = "ADD DICE"
    leftBtn.onclick = leftBtnAction;

    rightBtn.innerText = "B";
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