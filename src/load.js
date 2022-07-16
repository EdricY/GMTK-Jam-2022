export var loaded = 0;
const imgSources = {
  red: "./assets/red.png",
  blue: "./assets/blue.png",
  green: "./assets/green.png",
  gray: "./assets/gray.png",
  shield: "./assets/shield.png",
  arrowUp: "./assets/arrow-up.png",
  arrowDown: "./assets/arrow-down.png",
  arrowRight: "./assets/arrow-right.png",
  arrowLeft: "./assets/arrow-left.png",
  diceIcon: "./assets/dice.png",
  glyph1: "./assets/thicdiceface1.png",
  glyph2: "./assets/thicdiceface2.png",
  glyph3: "./assets/thicdiceface3.png",
  glyph4: "./assets/thicdiceface4.png",
  glyph5: "./assets/thicdiceface5.png",
  glyph6: "./assets/thicdiceface6.png",
  onebanana: "./assets/onebanana.png",
  threebanana: "./assets/threebanana.png",
  splitbanana: "./assets/splitbanana.png",
}

const audioSources = {
  clunk: "./assets/clunk.mp3",
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
window.sounds = sounds;

export const doneLoadingResrcs = () => {
  return loaded == Object.keys(imgSources).length + Object.keys(audioSources).length
}

const onResrcLoad = () => {
  loaded++;
  // console.log("loaded", loaded);
}
