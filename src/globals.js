export const W = 800;
export const H = 960;

export const getEl = x => document.getElementById(x);
export const canvas = getEl("canvas");
export const ctx = canvas.getContext("2d");
export const UPDATES_PER_SEC = 15;
export const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;


export const allDice = []