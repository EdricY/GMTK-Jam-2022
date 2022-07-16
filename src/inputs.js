import { canvas } from "./globals"

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
