import { H, W } from "./globals"

export function drawMenu(ctx) {
  ctx.clearRect(0, 0, W, H)
  ctx.fillText("Menu", 100, 100)
}