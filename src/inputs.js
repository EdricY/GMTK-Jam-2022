import { canvas } from "./globals"
export const getEl = x => document.getElementById(x);

export const cursor = { x: -1, y: -1 }
export const keys = {}

export function setUpInputs(onClick) {

  canvas.addEventListener("mousedown", e => {
    e.preventDefault()
    let k = e.button
    keys[k] = true

  })
  canvas.addEventListener("mouseup", e => {
    let k = e.button
    keys[k] = false
  })

  canvas.addEventListener("mousemove", e => {
    cursor.x = Math.round(e.offsetX * canvas.width / canvas.clientWidth)
    cursor.y = Math.round(e.offsetY * canvas.height / canvas.clientHeight)
  })

  canvas.addEventListener("click", e => {
    cursor.x = Math.round(e.offsetX * canvas.width / canvas.clientWidth)
    cursor.y = Math.round(e.offsetY * canvas.height / canvas.clientHeight)
    onClick(cursor.x, cursor.y);
  })
}


export const leftBtn = getEl("leftBtn");
export const rightBtn = getEl("rightBtn");

export function flashOffButtons() {
  if (!leftBtn.disabled) {
    leftBtn.disabled = true;
    setTimeout(() => leftBtn.disabled = false, 200)
  }
  if (!rightBtn.disabled) {
    rightBtn.disabled = true;
    setTimeout(() => rightBtn.disabled = false, 200)
  }
}

leftBtn.addEventListener("click", () => {
  flashOffButtons();
})

rightBtn.addEventListener("click", () => {
  flashOffButtons();
})

export function switchButtons(lText, rText, lAction, rAction) {
  leftBtn.disabled = true;
  rightBtn.disabled = true;
  setTimeout(() => {
    leftBtn.innerText = lText;
    rightBtn.innerText = rText;
    leftBtn.onclick = lAction;
    rightBtn.onclick = rAction;
    leftBtn.disabled = false;
    rightBtn.disabled = false;
  }, 150);
}
