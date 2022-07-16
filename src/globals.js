export const W = 600;
export const H = 1000;

export const getEl = x => document.getElementById(x);
export const canvas = getEl("canvas");
export const ctx = canvas.getContext("2d");
export const UPDATES_PER_SEC = 15;
export const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;


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