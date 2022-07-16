import { Dice } from "./dice";
import { preloadAssets, doneLoadingResrcs, imgs } from "./load";

function init() {
  // initial setup
  preloadAssets();

  // wait for assets to finish loading
  let loadImgInterval = setInterval(() => {
    if (doneLoadingResrcs()) {
      clearInterval(loadImgInterval);

      doThing();
    }
  }, 100)
}

function doThing() {
  console.log('start!');
  let x = new Dice(
    ["shield", "arrow", "arrow", "arrow", "arrow", "arrow"],
    ["gray", "gray", "gray", "green", "red", "blue"],
  )
  x.roll(Math.floor(Math.random() * 6), 100, 1);
  x.drawScene();
  setInterval(() => x.drawScene(), 10)
  console.log(x)
}

init();
