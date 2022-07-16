export const W = 800;
export const H = 960;

export const getEl = x => document.getElementById(x);
export const canvas = getEl("canvas");
export const ctx = canvas.getContext("2d");
export const UPDATES_PER_SEC = 15;
export const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;


export const allDice = []


export const lerp = (a, b, frac) => a * (1 - frac) + b * frac;
export const lerpBounded = (a, b, frac) => {
  frac = Math.max(0, Math.min(frac, 1));
  return lerp(a, b, frac);
}

export const randBell = (num, frac = .5) => {
  let radius = num * frac;
  return num + Math.random() * radius - Math.random() * radius;
}

export const randInt = (min, max) => {
  const range = max - min + 1;
  return Math.floor(Math.random() * range);
}