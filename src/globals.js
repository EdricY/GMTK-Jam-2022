import { getEl } from "./inputs";
import GameState from "./state";

export const W = 600;
export const H = 1000;

export const canvas = getEl("canvas");
export const ctx = canvas.getContext("2d");
export const UPDATES_PER_SEC = 60;
export const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;

export const gameState = new GameState();

export function lerp(a, b, frac) {
  return a * (1 - frac) + b * frac;
}
export function lerpBounded(a, b, frac) {
  frac = Math.max(0, Math.min(frac, 1));
  return lerp(a, b, frac);
}

export function randBell(num, frac = .5) {
  let radius = num * frac;
  return num + Math.random() * radius - Math.random() * radius;
}

export function randInt(min, max) {
  const range = max - min + 1;
  return Math.floor(Math.random() * range);
}

export function randEl(arr) {
  const range = arr.length;
  return arr[Math.floor(Math.random() * range)];
}

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const defaultColors = ["red", "blue", "green", "red", "blue", "green"]
export const getDefaultRandomColors = (array) => {
  shuffle(defaultColors);
  return [...defaultColors];
}