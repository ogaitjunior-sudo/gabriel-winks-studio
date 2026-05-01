import fs from "node:fs/promises";
import path from "node:path";

import { PROJECT_ROOT } from "./wink-config.mjs";

export const FPS = 30;
const EASE_IN = { x: [0.667], y: [1] };
const EASE_OUT = { x: [0.333], y: [0] };

export const LOTTIE_EFFECT_ROOT = path.join(PROJECT_ROOT, "public", "lottie", "effect-winks");

export const COLORS = {
  blue: "#3b82f6",
  gold: "#facc15",
  green: "#22c55e",
  mint: "#34d399",
  navy: "#1e3a8a",
  orange: "#fb923c",
  pink: "#f472b6",
  purple: "#a855f7",
  red: "#ef4444",
  rose: "#fb7185",
  slate: "#334155",
  teal: "#14b8a6",
  white: "#ffffff",
  yellow: "#fde047",
};

const GLYPHS = {
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00110", "00001", "00001", "10001", "01110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "11110", "10001", "10001", "10001", "11110"],
  D: ["11100", "10010", "10001", "10001", "10001", "10010", "11100"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
};

export const frames = (durationMs) => Math.round((durationMs / 1000) * FPS);
export const sp = (value) => ({ a: 0, k: value });
export const ap = (keyframes) => ({ a: 1, k: keyframes });
export const hold = (time, value) => ({ h: 1, s: Array.isArray(value) ? value : [value], t: time });
export const ease = (time, startValue, endValue) => ({
  e: Array.isArray(endValue) ? endValue : [endValue],
  i: EASE_IN,
  o: EASE_OUT,
  s: Array.isArray(startValue) ? startValue : [startValue],
  t: time,
});

export function fade(totalFrames, startFrame, endFrame, fadeInFrames = 4, fadeOutFrames = 8) {
  const fadeInEnd = Math.min(endFrame, startFrame + fadeInFrames);
  const fadeOutStart = Math.max(startFrame, endFrame - fadeOutFrames);
  return [
    hold(0, 0),
    hold(startFrame, 0),
    ease(startFrame, 0, 100),
    hold(fadeInEnd, 100),
    hold(fadeOutStart, 100),
    ease(fadeOutStart, 100, 0),
    hold(endFrame, 0),
    hold(totalFrames, 0),
  ];
}

export function pop(totalFrames, startFrame, endFrame, peakScale = 118, settleScale = 100, startScale = 0) {
  const peakFrame = startFrame + 4;
  const settleFrame = startFrame + 10;
  const hidden = [startScale, startScale, 100];
  const peak = [peakScale, peakScale, 100];
  const settle = [settleScale, settleScale, 100];
  return [
    hold(0, hidden),
    hold(startFrame, hidden),
    ease(startFrame, hidden, peak),
    ease(peakFrame, peak, settle),
    hold(Math.max(settleFrame, endFrame - 8), settle),
    ease(Math.max(settleFrame, endFrame - 8), settle, hidden),
    hold(endFrame, hidden),
    hold(totalFrames, hidden),
  ];
}

export function move(totalFrames, points) {
  const keyframes = [];
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    keyframes.push(next ? ease(current.t, current.value, next.value) : hold(current.t, current.value));
  }
  const last = points.at(-1);
  if (last && last.t < totalFrames) keyframes.push(hold(totalFrames, last.value));
  return keyframes;
}

export function spin(totalFrames, turns, settleFrame, finalRotation = 0) {
  return [
    hold(0, 0),
    ease(0, 0, turns * 360),
    ease(Math.max(0, settleFrame - 8), turns * 360, finalRotation),
    hold(settleFrame, finalRotation),
    hold(totalFrames, finalRotation),
  ];
}

function rgba(hex, alpha = 1) {
  const value = hex.replace("#", "");
  const read = (start) => Number.parseInt(value.slice(start, start + 2), 16) / 255;
  return [read(0), read(2), read(4), alpha];
}

export const fill = (color, opacity = 100) => ({ c: sp(rgba(color)), nm: "Fill", o: sp(opacity), r: 1, ty: "fl" });
export const stroke = (color, width, opacity = 100) => ({
  c: sp(rgba(color)),
  lc: 2,
  lj: 2,
  nm: "Stroke",
  o: sp(opacity),
  ty: "st",
  w: sp(width),
});
export const rect = (x, y, width, height, roundness = 0) => ({ d: 1, nm: "Rect", p: sp([x, y]), r: sp(roundness), s: sp([width, height]), ty: "rc" });
export const ellipse = (x, y, width, height) => ({ d: 1, nm: "Ellipse", p: sp([x, y]), s: sp([width, height]), ty: "el" });
export const star = (radius, innerRadius, points = 5, rotation = 0) => ({
  d: 1,
  ir: sp(innerRadius),
  is: sp(0),
  nm: "Star",
  or: sp(radius),
  os: sp(0),
  p: sp([0, 0]),
  pt: sp(points),
  r: sp(rotation),
  sy: 1,
  ty: "sr",
});
export const poly = (points, closed = true) => ({
  ks: sp({ c: closed, i: points.map(() => [0, 0]), o: points.map(() => [0, 0]), v: points }),
  nm: "Path",
  ty: "sh",
});

export function group(name, items, transform = {}) {
  return {
    it: [
      ...items,
      {
        a: sp(transform.a ?? [0, 0]),
        nm: "Transform",
        o: sp(transform.o ?? 100),
        p: sp(transform.p ?? [0, 0]),
        r: sp(transform.r ?? 0),
        s: sp(transform.s ?? [100, 100]),
        sa: sp(0),
        sk: sp(0),
        ty: "tr",
      },
    ],
    nm: name,
    ty: "gr",
  };
}

export function layer({ index, name, shapes, totalFrames, position = [960, 540, 0], scale = [100, 100, 100], rotation = 0, opacity = 100, inPoint = 0, outPoint = totalFrames }) {
  return {
    ao: 0,
    bm: 0,
    ddd: 0,
    ind: index,
    ip: inPoint,
    ks: {
      a: sp([0, 0, 0]),
      o: Array.isArray(opacity) ? ap(opacity) : sp(opacity),
      p: Array.isArray(position) && typeof position[0] === "object" ? ap(position) : sp(position),
      r: Array.isArray(rotation) ? ap(rotation) : sp(rotation),
      s: Array.isArray(scale) && typeof scale[0] === "object" ? ap(scale) : sp(scale),
    },
    nm: name,
    op: outPoint,
    shapes,
    sr: 1,
    st: 0,
    ty: 4,
  };
}

export const animation = (name, durationMs, layers) => ({
  assets: [],
  ddd: 0,
  fr: FPS,
  h: 1080,
  ip: 0,
  layers,
  markers: [],
  nm: name,
  op: frames(durationMs),
  v: "5.10.0",
  w: 1920,
});

function textWidth(text, cellSize) {
  const gap = Math.max(4, Math.round(cellSize * 0.3));
  return [...text].reduce((width, char) => width + (char === " " ? Math.round(cellSize * 2.2) : GLYPHS[char][0].length * cellSize + gap), 0) - gap;
}

export function textGroup(text, color, cellSize = 24) {
  const gap = Math.max(4, Math.round(cellSize * 0.3));
  const pixel = Math.max(4, Math.round(cellSize * 0.86));
  const height = cellSize * 7;
  let x = -textWidth(text, cellSize) / 2;
  const pixels = [];
  for (const char of text) {
    if (char === " ") {
      x += Math.round(cellSize * 2.2);
      continue;
    }
    const glyph = GLYPHS[char];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let column = 0; column < glyph[row].length; column += 1) {
        if (glyph[row][column] !== "1") continue;
        pixels.push(rect(x + column * cellSize + cellSize / 2, -height / 2 + row * cellSize + cellSize / 2, pixel, pixel, Math.round(pixel * 0.14)));
      }
    }
    x += glyph[0].length * cellSize + gap;
  }
  return group(`Word ${text}`, [...pixels, fill(color)]);
}

export const sparkleGroup = (color, radius = 34) => group("Sparkle", [rect(0, 0, radius * 0.26, radius * 1.8, radius * 0.12), rect(0, 0, radius * 1.8, radius * 0.26, radius * 0.12), fill(color)]);
export const ringGroup = (color, radius, width) => group("Ring", [ellipse(0, 0, radius, radius), stroke(color, width, 90)]);
export const starGroup = (color, outerRadius, innerRadius, rotation = 0) => group("Star", [star(outerRadius, innerRadius, 5, rotation), fill(color)]);
export const confettiGroup = (color, width, height) => group("Confetti", [rect(0, 0, width, height, Math.min(width, height) * 0.24), fill(color)]);
export const bingoBallGroup = (letter, color) => group("Ball", [ellipse(0, 96, 152, 30), fill(COLORS.slate, 18), ellipse(0, 0, 168, 168), fill(color), ellipse(0, 0, 168, 168), stroke(COLORS.white, 10, 82), ellipse(-24, -34, 40, 20), fill(COLORS.white, 24), textGroup(letter, COLORS.white, 16)]);
export const thumbGroup = () => group("Thumb", [rect(-60, 94, 92, 84, 18), fill(COLORS.navy), rect(38, 34, 156, 150, 32), fill("#f8c9a6"), rect(102, -84, 40, 122, 18), fill("#f8c9a6"), rect(146, -40, 40, 116, 18), fill("#f8c9a6"), rect(188, 6, 40, 108, 18), fill("#f8c9a6"), rect(-12, -20, 84, 48, 18), fill("#f8c9a6"), poly([[-44, -8], [14, -98], [84, -68], [48, 14], [-12, 34]]), fill("#f8c9a6")]);
export const cakeGroup = (showFlames = true) => group("Cake", [ellipse(0, 182, 430, 64), fill(COLORS.white, 75), rect(0, 76, 300, 132, 28), fill("#f7c59f"), rect(0, -24, 248, 116, 24), fill(COLORS.pink), poly([[-124, -74], [-68, -102], [-12, -84], [36, -104], [96, -80], [124, -56], [124, 8], [-124, 8]]), fill(COLORS.white), rect(-38, -126, 18, 70, 10), fill(COLORS.blue), rect(0, -132, 18, 78, 10), fill(COLORS.yellow), rect(38, -126, 18, 70, 10), fill(COLORS.teal), ...(showFlames ? [ellipse(-38, -174, 18, 30), fill(COLORS.orange), ellipse(0, -184, 18, 34), fill(COLORS.gold), ellipse(38, -174, 18, 30), fill(COLORS.orange)] : [])]);
export const flowerGroup = () => group("Flower", [ellipse(0, -126, 112, 168), fill(COLORS.rose), ellipse(98, -44, 112, 168), fill(COLORS.pink), ellipse(98, 70, 112, 168), fill(COLORS.orange), ellipse(0, 146, 112, 168), fill(COLORS.yellow), ellipse(-98, 70, 112, 168), fill(COLORS.teal), ellipse(-98, -44, 112, 168), fill(COLORS.purple), ellipse(0, 8, 124, 124), fill(COLORS.gold)]);

export async function writeLottieFiles(specs) {
  await fs.mkdir(LOTTIE_EFFECT_ROOT, { recursive: true });
  await Promise.all(specs.map(async (spec) => {
    const outputPath = path.join(LOTTIE_EFFECT_ROOT, `${spec.id}.json`);
    await fs.writeFile(outputPath, `${JSON.stringify(spec.builder(), null, 2)}\n`, "utf8");
  }));
}
