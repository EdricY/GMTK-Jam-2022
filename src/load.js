export var loaded = 0;
const imgSources = {
  menu: "./assets/title.png",
  tutorial1: "./assets/tutorial1.png",
  tutorial2: "./assets/tutorial2.png",
  red: "./assets/red.png",
  blue: "./assets/blue.png",
  green: "./assets/green.png",
  gray: "./assets/gray.png",
  shield: "./assets/shield.png",
  arrowUp: "./assets/arrowlighter-up.png",
  arrowDown: "./assets/arrowlighter-down.png",
  arrowRight: "./assets/arrowlighter-right.png",
  arrowLeft: "./assets/arrowlighter-left.png",
  diceIcon: "./assets/dice.png",
  glyph1: "./assets/thicdiceface1.png",
  glyph2: "./assets/thicdiceface4.png",
  glyph3: "./assets/thicdiceface2.png",
  onebanana: "./assets/onebanana.png",
  threebanana: "./assets/threebanana.png",
  splitbanana: "./assets/splitbanana.png",
  background: "./assets/background.png",
  credits: "./assets/credits.png",
  check: "./assets/check.png",
  dead: "./assets/monkeyface-dead.png",
  happy: "./assets/monkeyface-happyeyebrow.png",
  neutral: "./assets/monkeyface-happy.png",
}

const audioSources = {
  clunk1: "./assets/clunk.mp3",
  clunk2: "./assets/clunk.mp3",
  clunk3: "./assets/clunk.mp3",
  clunk4: "./assets/clunk.mp3",
  blip: "./assets/blip.mp3",
  shoop: "./assets/shoop.mp3",
  win: "./assets/win.mp3",
}
export const imgs = {}
export const sounds = {}

export function preloadAssets() {
  for (let key in imgSources) {
    imgs[key] = new Image()
    imgs[key].src = imgSources[key]
    imgs[key].onload = onResrcLoad
  }

  for (let key in audioSources) {
    sounds[key] = new Audio(audioSources[key])
    sounds[key].onloadeddata = onResrcLoad
  }
}

export const doneLoadingResrcs = () => {
  return loaded == Object.keys(imgSources).length + Object.keys(audioSources).length
}

const onResrcLoad = () => {
  loaded++;
  // console.log("loaded", loaded);
}
