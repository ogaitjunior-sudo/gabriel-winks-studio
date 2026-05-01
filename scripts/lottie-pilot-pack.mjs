import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PROJECT_ROOT } from "./wink-config.mjs";

const FRAMES_PER_SECOND = 30;
const LOTTIE_ROOT = path.join(PROJECT_ROOT, "public", "lottie");
const EASE_IN = { x: [0.667], y: [1] };
const EASE_OUT = { x: [0.333], y: [0] };

const COLORS = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  cyan: "#38bdf8",
  gold: "#facc15",
  green: "#22c55e",
  navy: "#1e3a8a",
  orange: "#fb923c",
  pink: "#f472b6",
  purple: "#a855f7",
  red: "#ef4444",
  rose: "#fb7185",
  sky: "#0ea5e9",
  slate: "#334155",
  teal: "#14b8a6",
  white: "#ffffff",
  yellow: "#fde047",
};

const GLYPHS = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
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

export const PILOT_PACK_SPECS = Object.freeze([
  { builder: buildCountdown321Bingo, id: "countdown-bingo-ball-letters-effect-wink", outputPath: "countdown/countdown-3-2-1-bingo.json" },
  { builder: buildCountdownSimple321, id: "countdown-simple-party-effect-wink", outputPath: "countdown/countdown-simple-3-2-1.json" },
  { builder: buildBingoLetterCollision, id: "bb-collision", outputPath: "bingo/bingo-balls-letter-collision.json" },
  { builder: buildBingoJackpotSpin, id: "bouncing-bingo-jackpot", outputPath: "bingo/bingo-balls-jackpot-spin.json" },
  { builder: buildFireworksBingoBurst, id: "fireworks-final-bingo-countdown-effect-wink", outputPath: "fireworks/fireworks-bingo-burst.json" },
  { builder: buildConfettiCannonParty, id: "cf-cannon", outputPath: "confetti/confetti-cannon-party.json" },
  { builder: buildGoldStarsBurst, id: "gs-burst", outputPath: "gold-stars/gold-stars-burst.json" },
  { builder: buildHappyBirthdayCakePop, id: "happy-birthday-cake-pop-effect-wink", outputPath: "happy-birthday/happy-birthday-cake-pop.json" },
  { builder: buildThumbsUpReactionPop, id: "thumbs-up-pop", outputPath: "thumbs-up/thumbs-up-reaction-pop.json" },
  { builder: buildFlowersBloomPop, id: "flowers-bloom-pop", outputPath: "flowers/flowers-bloom-pop.json" },
]);

export const PILOT_LOTTIE_REGISTRY = Object.freeze(
  Object.fromEntries(
    PILOT_PACK_SPECS.map((spec) => [spec.id, `/lottie/${spec.outputPath.replaceAll("\\", "/")}`])
  )
);

function frameCountFor(durationMs) {
  return Math.round((durationMs / 1000) * FRAMES_PER_SECOND);
}

function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => segment + segment)
          .join("")
      : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;

  return [red, green, blue, alpha];
}

function staticProp(value) {
  return { a: 0, k: value };
}

function animatedProp(keyframes) {
  return { a: 1, k: keyframes };
}

function holdKeyframe(time, value) {
  return { h: 1, s: Array.isArray(value) ? value : [value], t: time };
}

function easedKeyframe(time, startValue, endValue) {
  return {
    e: Array.isArray(endValue) ? endValue : [endValue],
    i: EASE_IN,
    o: EASE_OUT,
    s: Array.isArray(startValue) ? startValue : [startValue],
    t: time,
  };
}

function fadeKeyframes(totalFrames, startFrame, endFrame, fadeInFrames = 4, fadeOutFrames = 6) {
  const fadeInEnd = Math.min(endFrame, startFrame + fadeInFrames);
  const fadeOutStart = Math.max(startFrame, endFrame - fadeOutFrames);

  return [
    holdKeyframe(0, 0),
    holdKeyframe(startFrame, 0),
    easedKeyframe(startFrame, 0, 100),
    holdKeyframe(fadeInEnd, 100),
    holdKeyframe(fadeOutStart, 100),
    easedKeyframe(fadeOutStart, 100, 0),
    holdKeyframe(endFrame, 0),
    holdKeyframe(totalFrames, 0),
  ];
}

function popScaleKeyframes(totalFrames, startFrame, endFrame, peakScale = 118, settleScale = 100) {
  const peakFrame = startFrame + 4;
  const settleFrame = startFrame + 9;

  return [
    holdKeyframe(0, [0, 0, 100]),
    holdKeyframe(startFrame, [0, 0, 100]),
    easedKeyframe(startFrame, [0, 0, 100], [peakScale, peakScale, 100]),
    easedKeyframe(peakFrame, [peakScale, peakScale, 100], [settleScale, settleScale, 100]),
    holdKeyframe(settleFrame, [settleScale, settleScale, 100]),
    holdKeyframe(Math.max(settleFrame, endFrame - 6), [settleScale, settleScale, 100]),
    easedKeyframe(Math.max(settleFrame, endFrame - 6), [settleScale, settleScale, 100], [0, 0, 100]),
    holdKeyframe(endFrame, [0, 0, 100]),
    holdKeyframe(totalFrames, [0, 0, 100]),
  ];
}

function moveKeyframes(totalFrames, points) {
  const keyframes = [];

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[index + 1];

    if (!next) {
      keyframes.push(holdKeyframe(current.t, current.value));
      continue;
    }

    keyframes.push(easedKeyframe(current.t, current.value, next.value));
  }

  const last = points.at(-1);
  if (last && last.t < totalFrames) {
    keyframes.push(holdKeyframe(totalFrames, last.value));
  }

  return keyframes;
}

function spinKeyframes(totalFrames, turns, settleFrame, finalRotation = 0) {
  return [
    holdKeyframe(0, 0),
    easedKeyframe(0, 0, turns * 360),
    easedKeyframe(Math.max(0, settleFrame - 6), turns * 360, finalRotation),
    holdKeyframe(settleFrame, finalRotation),
    holdKeyframe(totalFrames, finalRotation),
  ];
}

function fill(color, opacity = 100) {
  return {
    c: staticProp(hexToRgba(color)),
    nm: "Fill",
    o: staticProp(opacity),
    r: 1,
    ty: "fl",
  };
}

function stroke(color, width, opacity = 100) {
  return {
    c: staticProp(hexToRgba(color)),
    lc: 2,
    lj: 2,
    nm: "Stroke",
    o: staticProp(opacity),
    ty: "st",
    w: staticProp(width),
  };
}

function rectPath(x, y, width, height, roundness = 0) {
  return {
    d: 1,
    nm: "Rect",
    p: staticProp([x, y]),
    r: staticProp(roundness),
    s: staticProp([width, height]),
    ty: "rc",
  };
}

function ellipsePath(x, y, width, height) {
  return {
    d: 1,
    nm: "Ellipse",
    p: staticProp([x, y]),
    s: staticProp([width, height]),
    ty: "el",
  };
}

function starPath(radius, innerRadius, points = 5, rotation = 0) {
  return {
    d: 1,
    ir: staticProp(innerRadius),
    is: staticProp(0),
    nm: "Star",
    or: staticProp(radius),
    os: staticProp(0),
    p: staticProp([0, 0]),
    pt: staticProp(points),
    r: staticProp(rotation),
    sy: 1,
    ty: "sr",
  };
}

function polygonPath(points, closed = true) {
  return {
    ks: staticProp({
      c: closed,
      i: points.map(() => [0, 0]),
      o: points.map(() => [0, 0]),
      v: points,
    }),
    nm: "Path",
    ty: "sh",
  };
}

function group(name, items, transformOverrides = {}) {
  return {
    it: [
      ...items,
      {
        a: staticProp(transformOverrides.a ?? [0, 0]),
        nm: "Transform",
        o: staticProp(transformOverrides.o ?? 100),
        p: staticProp(transformOverrides.p ?? [0, 0]),
        r: staticProp(transformOverrides.r ?? 0),
        s: staticProp(transformOverrides.s ?? [100, 100]),
        sk: staticProp(0),
        sa: staticProp(0),
        ty: "tr",
      },
    ],
    nm: name,
    ty: "gr",
  };
}

function makeShapeLayer({
  index,
  name,
  shapes,
  totalFrames,
  position = [960, 540, 0],
  scale = [100, 100, 100],
  rotation = 0,
  opacity = 100,
  inPoint = 0,
  outPoint = totalFrames,
}) {
  return {
    ao: 0,
    bm: 0,
    ddd: 0,
    ind: index,
    ip: inPoint,
    ks: {
      a: staticProp([0, 0, 0]),
      o: Array.isArray(opacity) ? animatedProp(opacity) : staticProp(opacity),
      p:
        Array.isArray(position) && position.length > 0 && typeof position[0] === "object"
          ? animatedProp(position)
          : staticProp(position),
      r: Array.isArray(rotation) ? animatedProp(rotation) : staticProp(rotation),
      s:
        Array.isArray(scale) && scale.length > 0 && typeof scale[0] === "object"
          ? animatedProp(scale)
          : staticProp(scale),
    },
    nm: name,
    op: outPoint,
    shapes,
    sr: 1,
    st: 0,
    ty: 4,
  };
}

function createAnimation(name, width, height, durationMs, layers) {
  return {
    assets: [],
    ddd: 0,
    fr: FRAMES_PER_SECOND,
    h: height,
    ip: 0,
    layers,
    markers: [],
    nm: name,
    op: frameCountFor(durationMs),
    v: "5.10.0",
    w: width,
  };
}

function getGlyphPattern(character) {
  const pattern = GLYPHS[character];
  if (!pattern) {
    throw new Error(`Missing glyph pattern for "${character}".`);
  }

  return pattern;
}

function measureWord(text, cellSize, spacing) {
  let width = 0;
  const letterGap = Math.max(4, Math.round(cellSize * 0.3));

  for (const character of text) {
    if (character === " ") {
      width += Math.round(cellSize * 2.2);
      continue;
    }

    const pattern = getGlyphPattern(character);
    width += pattern[0].length * cellSize + letterGap;
  }

  return width > 0 ? width - letterGap : 0;
}

function pixelWordGroup(text, color, cellSize = 24, spacing = 0) {
  const rects = [];
  const letterGap = Math.max(4, Math.round(cellSize * 0.3));
  const pixelSize = Math.max(4, Math.round(cellSize * 0.86));
  const wordWidth = measureWord(text, cellSize, spacing);
  const wordHeight = 7 * cellSize;
  let cursorX = -wordWidth / 2;

  for (const character of text) {
    if (character === " ") {
      cursorX += Math.round(cellSize * 2.2);
      continue;
    }

    const pattern = getGlyphPattern(character);
    const glyphWidth = pattern[0].length * cellSize;

    for (let row = 0; row < pattern.length; row += 1) {
      for (let column = 0; column < pattern[row].length; column += 1) {
        if (pattern[row][column] !== "1") {
          continue;
        }

        rects.push(
          rectPath(
            cursorX + column * cellSize + cellSize / 2,
            -wordHeight / 2 + row * cellSize + cellSize / 2,
            pixelSize,
            pixelSize,
            Math.round(pixelSize * 0.16)
          )
        );
      }
    }

    cursorX += glyphWidth + letterGap + spacing;
  }

  return group(`Word ${text}`, [...rects, fill(color)]);
}

function starGroup(color, outerRadius, innerRadius, rotation = 0) {
  return group("Star", [starPath(outerRadius, innerRadius, 5, rotation), fill(color)]);
}

function sparkleGroup(color, radius = 34) {
  return group("Sparkle", [
    rectPath(0, 0, radius * 0.28, radius * 1.9, radius * 0.14),
    rectPath(0, 0, radius * 1.9, radius * 0.28, radius * 0.14),
    fill(color),
  ]);
}

function burstRingGroup(color, radius, width) {
  return group("Ring", [ellipsePath(0, 0, radius, radius), stroke(color, width, 90)]);
}

function bingoBallGroup(letter, baseColor) {
  return group("Bingo Ball", [
    group("Shadow", [ellipsePath(0, 96, 156, 34), fill(COLORS.slate, 20)]),
    group("Ball", [
      ellipsePath(0, 0, 176, 176),
      fill(baseColor),
      ellipsePath(0, 0, 176, 176),
      stroke(COLORS.white, 10, 80),
    ]),
    group("Highlight", [ellipsePath(-26, -34, 44, 22), fill(COLORS.white, 25)]),
    group("Letter", [pixelWordGroup(letter, COLORS.white, 16)]),
  ]);
}

function cannonGroup(side = "left") {
  const direction = side === "left" ? 1 : -1;

  return group("Cannon", [
    group("Barrel", [
      polygonPath([
        [-100 * direction, -28],
        [48 * direction, -68],
        [72 * direction, 68],
        [-82 * direction, 34],
      ]),
      fill(COLORS.slate),
    ]),
    group("Rim", [ellipsePath(80 * direction, 0, 54, 128), stroke(COLORS.white, 8, 80)]),
    group("Base", [ellipsePath(-36 * direction, 50, 72, 72), fill(COLORS.navy)]),
  ]);
}

function cakeGroup() {
  return group("Cake", [
    group("Plate", [ellipsePath(0, 182, 430, 64), fill(COLORS.white, 75)]),
    group("Bottom", [rectPath(0, 76, 300, 132, 28), fill("#f7c59f")]),
    group("Top", [rectPath(0, -24, 248, 116, 24), fill("#f472b6")]),
    group("Icing", [
      polygonPath([
        [-124, -74],
        [-68, -102],
        [-12, -84],
        [36, -104],
        [96, -80],
        [124, -56],
        [124, 8],
        [-124, 8],
      ]),
      fill(COLORS.white),
    ]),
    group("Candle", [rectPath(-38, -126, 18, 70, 10), fill(COLORS.sky)]),
    group("Candle", [rectPath(0, -132, 18, 78, 10), fill(COLORS.yellow)]),
    group("Candle", [rectPath(38, -126, 18, 70, 10), fill(COLORS.teal)]),
    group("Flame", [ellipsePath(-38, -174, 18, 30), fill(COLORS.orange)]),
    group("Flame", [ellipsePath(0, -184, 18, 34), fill(COLORS.gold)]),
    group("Flame", [ellipsePath(38, -174, 18, 30), fill(COLORS.orange)]),
  ]);
}

function thumbGroup() {
  return group("Thumb", [
    group("Sleeve", [rectPath(-58, 94, 88, 86, 18), fill(COLORS.navy)]),
    group("Palm", [rectPath(38, 32, 156, 150, 32), fill("#f8c9a6")]),
    group("Finger", [rectPath(102, -84, 40, 124, 18), fill("#f8c9a6")]),
    group("Finger", [rectPath(146, -40, 40, 118, 18), fill("#f8c9a6")]),
    group("Finger", [rectPath(188, 6, 40, 110, 18), fill("#f8c9a6")]),
    group("Thumb Stem", [rectPath(-10, -20, 80, 48, 18), fill("#f8c9a6")]),
    group("Thumb Tip", [
      polygonPath([
        [-42, -8],
        [14, -96],
        [82, -68],
        [48, 14],
        [-12, 34],
      ]),
      fill("#f8c9a6"),
    ]),
  ]);
}

function flowerGroup() {
  return group("Flower", [
    group("Petal", [ellipsePath(0, -126, 112, 168), fill(COLORS.rose)]),
    group("Petal", [ellipsePath(98, -44, 112, 168), fill(COLORS.pink)]),
    group("Petal", [ellipsePath(98, 70, 112, 168), fill(COLORS.orange)]),
    group("Petal", [ellipsePath(0, 146, 112, 168), fill(COLORS.yellow)]),
    group("Petal", [ellipsePath(-98, 70, 112, 168), fill(COLORS.teal)]),
    group("Petal", [ellipsePath(-98, -44, 112, 168), fill(COLORS.purple)]),
    group("Center", [ellipsePath(0, 8, 124, 124), fill(COLORS.gold)]),
  ]);
}

function simpleConfettiGroup(color, width, height) {
  return group("Confetti Piece", [
    rectPath(0, 0, width, height, Math.min(width, height) * 0.24),
    fill(color),
  ]);
}

function createBurstParticleLayers(totalFrames, startIndex, startFrame, center, particles) {
  return particles.map((particle, particleIndex) =>
    makeShapeLayer({
      index: startIndex + particleIndex,
      name: `${particle.name ?? "Particle"} ${particleIndex + 1}`,
      opacity: fadeKeyframes(
        totalFrames,
        startFrame,
        Math.min(totalFrames, startFrame + 26),
        2,
        10
      ),
      position: moveKeyframes(totalFrames, [
        { t: 0, value: [...center, 0] },
        { t: startFrame, value: [...center, 0] },
        { t: Math.min(totalFrames - 10, startFrame + 18), value: [...particle.target, 0] },
        { t: totalFrames, value: [...particle.target, 0] },
      ]),
      rotation: Array.isArray(particle.rotation)
        ? particle.rotation
        : spinKeyframes(
            totalFrames,
            particle.turns ?? 0.5,
            Math.min(totalFrames - 8, startFrame + 20),
            particle.rotation ?? 0
          ),
      scale: popScaleKeyframes(
        totalFrames,
        startFrame,
        Math.min(totalFrames, startFrame + 28),
        particle.peakScale ?? 132,
        particle.settleScale ?? 100
      ),
      shapes: [particle.shape],
      totalFrames,
    })
  );
}

function buildCountdown321Bingo() {
  const durationMs = 3600;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  const digitFrames = [
    { glyph: "3", start: 0, end: 26, color: COLORS.yellow },
    { glyph: "2", start: 28, end: 56, color: COLORS.orange },
    { glyph: "1", start: 58, end: 82, color: COLORS.sky },
  ];

  for (const digit of digitFrames) {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Countdown ${digit.glyph}`,
        opacity: fadeKeyframes(totalFrames, digit.start, digit.end, 3, 6),
        position: [960, 380, 0],
        scale: popScaleKeyframes(totalFrames, digit.start, digit.end, 128, 100),
        shapes: [pixelWordGroup(digit.glyph, digit.color, 64)],
        totalFrames,
      })
    );
  }

  const finalBallPositions = [
    [520, 640],
    [700, 640],
    [880, 640],
    [1060, 640],
    [1240, 640],
  ];
  const introBallPositions = [
    [180, 200],
    [400, 130],
    [960, 120],
    [1520, 130],
    [1740, 200],
  ];
  const letters = ["B", "I", "N", "G", "O"];
  const colors = [COLORS.red, COLORS.blue, COLORS.gold, COLORS.green, COLORS.purple];

  letters.forEach((letter, letterIndex) => {
    const startFrame = 70 + letterIndex * 3;
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Bingo Ball ${letter}`,
        opacity: fadeKeyframes(totalFrames, startFrame, totalFrames - 2, 2, 8),
        position: moveKeyframes(totalFrames, [
          { t: 0, value: [...introBallPositions[letterIndex], 0] },
          { t: startFrame, value: [...introBallPositions[letterIndex], 0] },
          { t: 90 + letterIndex * 2, value: [...finalBallPositions[letterIndex], 0] },
          { t: totalFrames, value: [...finalBallPositions[letterIndex], 0] },
        ]),
        rotation: spinKeyframes(totalFrames, 1.5 + letterIndex * 0.1, 92 + letterIndex * 2),
        scale: popScaleKeyframes(totalFrames, startFrame, totalFrames - 2, 118, 100),
        shapes: [bingoBallGroup(letter, colors[letterIndex])],
        totalFrames,
      })
    );
  });

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Bingo Word",
      opacity: fadeKeyframes(totalFrames, 88, totalFrames, 4, 10),
      position: [960, 864, 0],
      scale: popScaleKeyframes(totalFrames, 88, totalFrames, 124, 100),
      shapes: [pixelWordGroup("BINGO", COLORS.white, 26)],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Bingo Sparkle",
      opacity: fadeKeyframes(totalFrames, 90, totalFrames, 2, 8),
      position: [960, 846, 0],
      scale: popScaleKeyframes(totalFrames, 90, totalFrames, 130, 100),
      shapes: [sparkleGroup(COLORS.gold, 62)],
      totalFrames,
    })
  );

  return createAnimation("Countdown 3 2 1 Bingo", 1920, 1080, durationMs, layers);
}

function buildCountdownSimple321() {
  const durationMs = 3000;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  [
    { glyph: "3", start: 0, end: 22, color: COLORS.gold },
    { glyph: "2", start: 22, end: 44, color: COLORS.sky },
    { glyph: "1", start: 44, end: 58, color: COLORS.rose },
  ].forEach((digit) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Simple Countdown ${digit.glyph}`,
        opacity: fadeKeyframes(totalFrames, digit.start, digit.end, 3, 5),
        position: [960, 440, 0],
        scale: popScaleKeyframes(totalFrames, digit.start, digit.end, 122, 100),
        shapes: [pixelWordGroup(digit.glyph, digit.color, 56)],
        totalFrames,
      })
    );
  });

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Countdown Ring",
      opacity: fadeKeyframes(totalFrames, 56, totalFrames, 2, 10),
      position: [960, 520, 0],
      scale: popScaleKeyframes(totalFrames, 56, totalFrames, 160, 112),
      shapes: [burstRingGroup(COLORS.white, 260, 14)],
      totalFrames,
    })
  );

  const burstParticles = [
    { shape: starGroup(COLORS.gold, 34, 14), target: [640, 270], turns: 0.8 },
    { shape: starGroup(COLORS.orange, 28, 12), target: [760, 190], turns: 1.1 },
    { shape: starGroup(COLORS.sky, 26, 10), target: [960, 160], turns: 0.7 },
    { shape: starGroup(COLORS.pink, 32, 12), target: [1160, 190], turns: 0.9 },
    { shape: starGroup(COLORS.green, 30, 12), target: [1280, 270], turns: 1.2 },
    { shape: sparkleGroup(COLORS.cyan, 44), target: [630, 620], turns: 0.5, peakScale: 118 },
    { shape: sparkleGroup(COLORS.yellow, 44), target: [1288, 620], turns: -0.5, peakScale: 118 },
    { shape: simpleConfettiGroup(COLORS.white, 28, 12), target: [820, 770], turns: 1.6, peakScale: 140 },
    { shape: simpleConfettiGroup(COLORS.teal, 20, 20), target: [1100, 770], turns: -1.2, peakScale: 140 },
  ];

  layers.push(...createBurstParticleLayers(totalFrames, index, 56, [960, 520], burstParticles));

  return createAnimation("Countdown Simple 3 2 1", 1920, 1080, durationMs, layers);
}

function buildBingoLetterCollision() {
  const durationMs = 3400;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Collision Flash",
      opacity: fadeKeyframes(totalFrames, 42, 70, 1, 10),
      position: [960, 540, 0],
      scale: popScaleKeyframes(totalFrames, 42, 70, 170, 110),
      shapes: [burstRingGroup(COLORS.white, 220, 18)],
      totalFrames,
    })
  );

  const letters = ["B", "I", "N", "G", "O"];
  const colors = [COLORS.red, COLORS.sky, COLORS.gold, COLORS.green, COLORS.purple];
  const starts = [
    [140, 180],
    [1760, 220],
    [240, 860],
    [1700, 900],
    [960, 80],
  ];
  const scramble = [
    [760, 520],
    [1110, 430],
    [930, 690],
    [1170, 640],
    [840, 400],
  ];
  const align = [
    [520, 560],
    [700, 560],
    [880, 560],
    [1060, 560],
    [1240, 560],
  ];

  letters.forEach((letter, letterIndex) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Collision Ball ${letter}`,
        opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 10),
        position: moveKeyframes(totalFrames, [
          { t: 0, value: [...starts[letterIndex], 0] },
          { t: 26 + letterIndex * 2, value: [...scramble[letterIndex], 0] },
          { t: 68 + letterIndex * 3, value: [...align[letterIndex], 0] },
          { t: totalFrames, value: [...align[letterIndex], 0] },
        ]),
        rotation: spinKeyframes(totalFrames, 1.6 + letterIndex * 0.12, 80 + letterIndex * 2),
        scale: [
          easedKeyframe(0, [72, 72, 100], [108, 108, 100]),
          easedKeyframe(20, [108, 108, 100], [122, 122, 100]),
          easedKeyframe(52, [122, 122, 100], [100, 100, 100]),
          holdKeyframe(totalFrames, [100, 100, 100]),
        ],
        shapes: [bingoBallGroup(letter, colors[letterIndex])],
        totalFrames,
      })
    );
  });

  return createAnimation("Bingo Balls Letter Collision", 1920, 1080, durationMs, layers);
}

function buildBingoJackpotSpin() {
  const durationMs = 3400;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  const reelXs = [420, 690, 960, 1230, 1500];
  reelXs.forEach((reelX, reelIndex) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Reel Frame ${reelIndex + 1}`,
        opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 8),
        position: [reelX, 430, 0],
        shapes: [
          group("Frame", [
            rectPath(0, 0, 220, 280, 28),
            fill(COLORS.slate, 85),
            rectPath(0, 0, 220, 280, 28),
            stroke(COLORS.white, 10, 80),
          ]),
        ],
        totalFrames,
      })
    );
  });

  const letters = ["B", "I", "N", "G", "O"];
  const colors = [COLORS.red, COLORS.sky, COLORS.gold, COLORS.green, COLORS.purple];

  letters.forEach((letter, letterIndex) => {
    const x = reelXs[letterIndex];
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Jackpot Reel ${letter}`,
        opacity: fadeKeyframes(totalFrames, 4, totalFrames, 2, 10),
        position: moveKeyframes(totalFrames, [
          { t: 0, value: [x, 220, 0] },
          { t: 22, value: [x, 640, 0] },
          { t: 42, value: [x, 300, 0] },
          { t: 60, value: [x, 560, 0] },
          { t: 82, value: [x, 430, 0] },
          { t: totalFrames, value: [x, 430, 0] },
        ]),
        rotation: spinKeyframes(totalFrames, 2.8 + letterIndex * 0.2, 86, 0),
        scale: [
          holdKeyframe(0, [88, 88, 100]),
          easedKeyframe(0, [88, 88, 100], [110, 110, 100]),
          easedKeyframe(82, [110, 110, 100], [100, 100, 100]),
          holdKeyframe(totalFrames, [100, 100, 100]),
        ],
        shapes: [bingoBallGroup(letter, colors[letterIndex])],
        totalFrames,
      })
    );
  });

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Jackpot Bingo Word",
      opacity: fadeKeyframes(totalFrames, 86, totalFrames, 4, 8),
      position: [960, 800, 0],
      scale: popScaleKeyframes(totalFrames, 86, totalFrames, 118, 100),
      shapes: [pixelWordGroup("BINGO", COLORS.gold, 24)],
      totalFrames,
    })
  );

  return createAnimation("Bingo Balls Jackpot Spin", 1920, 1080, durationMs, layers);
}

function buildFireworksBingoBurst() {
  const durationMs = 3900;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  const rocketTargets = [
    { start: [520, 940], end: [600, 260], color: COLORS.rose },
    { start: [960, 980], end: [960, 210], color: COLORS.gold },
    { start: [1400, 940], end: [1320, 260], color: COLORS.sky },
  ];

  rocketTargets.forEach((rocket, rocketIndex) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Rocket Trail ${rocketIndex + 1}`,
        opacity: fadeKeyframes(totalFrames, 10 + rocketIndex * 8, 52 + rocketIndex * 8, 1, 6),
        position: moveKeyframes(totalFrames, [
          { t: 0, value: [...rocket.start, 0] },
          { t: 10 + rocketIndex * 8, value: [...rocket.start, 0] },
          { t: 52 + rocketIndex * 8, value: [...rocket.end, 0] },
          { t: totalFrames, value: [...rocket.end, 0] },
        ]),
        rotation: [
          holdKeyframe(0, 0),
          easedKeyframe(
            10 + rocketIndex * 8,
            0,
            rocketIndex === 1 ? 0 : rocketIndex === 0 ? -14 : 14
          ),
          holdKeyframe(totalFrames, rocketIndex === 1 ? 0 : rocketIndex === 0 ? -14 : 14),
        ],
        scale: [
          holdKeyframe(0, [100, 0, 100]),
          easedKeyframe(10 + rocketIndex * 8, [100, 0, 100], [100, 100, 100]),
          holdKeyframe(totalFrames, [100, 100, 100]),
        ],
        shapes: [group("Trail", [rectPath(0, 0, 22, 260, 10), fill(rocket.color)])],
        totalFrames,
      })
    );

    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Firework Burst ${rocketIndex + 1}`,
        opacity: fadeKeyframes(totalFrames, 48 + rocketIndex * 8, 86 + rocketIndex * 8, 1, 12),
        position: [...rocket.end, 0],
        scale: popScaleKeyframes(totalFrames, 48 + rocketIndex * 8, 90 + rocketIndex * 8, 188, 100),
        rotation: spinKeyframes(totalFrames, 1.1, 86 + rocketIndex * 8),
        shapes: [starGroup(rocket.color, 66, 24, rocketIndex * 16)],
        totalFrames,
      })
    );
  });

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Bingo Reveal Word",
      opacity: fadeKeyframes(totalFrames, 72, totalFrames, 5, 10),
      position: [960, 610, 0],
      scale: popScaleKeyframes(totalFrames, 72, totalFrames, 126, 100),
      shapes: [pixelWordGroup("BINGO", COLORS.white, 34)],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Bingo Reveal Spark",
      opacity: fadeKeyframes(totalFrames, 76, totalFrames, 2, 8),
      position: [960, 610, 0],
      scale: popScaleKeyframes(totalFrames, 76, totalFrames, 136, 100),
      shapes: [sparkleGroup(COLORS.gold, 72)],
      totalFrames,
    })
  );

  return createAnimation("Fireworks Bingo Burst", 1920, 1080, durationMs, layers);
}

function buildConfettiCannonParty() {
  const durationMs = 3600;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Left Cannon",
      opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 8),
      position: [190, 780, 0],
      rotation: -18,
      shapes: [cannonGroup("left")],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Right Cannon",
      opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 8),
      position: [1730, 780, 0],
      rotation: 18,
      shapes: [cannonGroup("right")],
      totalFrames,
    })
  );

  const confettiSpecs = [
    { start: [240, 700], end: [520, 220], color: COLORS.gold, rotation: 220 },
    { start: [260, 690], end: [720, 200], color: COLORS.pink, rotation: 180 },
    { start: [300, 760], end: [860, 300], color: COLORS.teal, rotation: 260 },
    { start: [320, 740], end: [980, 260], color: COLORS.white, rotation: 140 },
    { start: [1660, 700], end: [1400, 220], color: COLORS.cyan, rotation: -220 },
    { start: [1640, 690], end: [1200, 210], color: COLORS.orange, rotation: -180 },
    { start: [1600, 760], end: [1080, 320], color: COLORS.rose, rotation: -250 },
    { start: [1580, 740], end: [940, 260], color: COLORS.yellow, rotation: -140 },
    { start: [260, 720], end: [620, 420], color: COLORS.blue, rotation: 320 },
    { start: [1640, 720], end: [1300, 420], color: COLORS.green, rotation: -300 },
  ];

  confettiSpecs.forEach((piece, pieceIndex) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Confetti ${pieceIndex + 1}`,
        opacity: fadeKeyframes(totalFrames, 18, totalFrames - 2, 1, 10),
        position: moveKeyframes(totalFrames, [
          { t: 0, value: [...piece.start, 0] },
          { t: 18, value: [...piece.start, 0] },
          { t: 48, value: [...piece.end, 0] },
          {
            t: 82,
            value: [piece.end[0] + (piece.end[0] > 960 ? 90 : -90), piece.end[1] + 320, 0],
          },
          {
            t: totalFrames,
            value: [piece.end[0] + (piece.end[0] > 960 ? 90 : -90), piece.end[1] + 420, 0],
          },
        ]),
        rotation: [
          holdKeyframe(0, 0),
          easedKeyframe(18, 0, piece.rotation),
          holdKeyframe(totalFrames, piece.rotation),
        ],
        scale: popScaleKeyframes(totalFrames, 18, totalFrames, 140, 100),
        shapes: [
          pieceIndex % 2 === 0
            ? simpleConfettiGroup(piece.color, 26, 12)
            : group("Confetti Dot", [ellipsePath(0, 0, 18, 18), fill(piece.color)]),
        ],
        totalFrames,
      })
    );
  });

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Party Sparkle",
      opacity: fadeKeyframes(totalFrames, 26, totalFrames, 2, 8),
      position: [960, 320, 0],
      scale: popScaleKeyframes(totalFrames, 26, totalFrames, 150, 100),
      shapes: [sparkleGroup(COLORS.white, 86)],
      totalFrames,
    })
  );

  return createAnimation("Confetti Cannon Party", 1920, 1080, durationMs, layers);
}

function buildGoldStarsBurst() {
  const durationMs = 3000;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Central Star",
      opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 8),
      position: [960, 540, 0],
      scale: popScaleKeyframes(totalFrames, 0, totalFrames, 168, 100),
      rotation: spinKeyframes(totalFrames, 1.2, 70, 0),
      shapes: [starGroup(COLORS.gold, 132, 56)],
      totalFrames,
    })
  );

  const starParticles = [
    { shape: starGroup(COLORS.yellow, 54, 20), target: [620, 250], turns: 1.3 },
    { shape: starGroup(COLORS.orange, 44, 18), target: [760, 180], turns: 1.1 },
    { shape: starGroup(COLORS.white, 40, 16), target: [960, 160], turns: 0.9 },
    { shape: starGroup(COLORS.gold, 48, 18), target: [1160, 190], turns: 1.2 },
    { shape: starGroup(COLORS.yellow, 58, 22), target: [1300, 260], turns: 1.3 },
    { shape: sparkleGroup(COLORS.white, 48), target: [690, 770], turns: 0.4, peakScale: 118 },
    { shape: sparkleGroup(COLORS.gold, 56), target: [1230, 760], turns: -0.5, peakScale: 124 },
  ];

  layers.push(...createBurstParticleLayers(totalFrames, index, 10, [960, 540], starParticles));

  return createAnimation("Gold Stars Burst", 1920, 1080, durationMs, layers);
}

function buildHappyBirthdayCakePop() {
  const durationMs = 3000;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Cake Pop",
      opacity: fadeKeyframes(totalFrames, 8, totalFrames, 2, 10),
      position: moveKeyframes(totalFrames, [
        { t: 0, value: [960, 900, 0] },
        { t: 8, value: [960, 900, 0] },
        { t: 28, value: [960, 620, 0] },
        { t: totalFrames, value: [960, 620, 0] },
      ]),
      scale: popScaleKeyframes(totalFrames, 8, totalFrames, 126, 100),
      shapes: [cakeGroup()],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Happy Word",
      opacity: fadeKeyframes(totalFrames, 28, totalFrames, 2, 8),
      position: [960, 220, 0],
      scale: popScaleKeyframes(totalFrames, 28, totalFrames, 122, 100),
      shapes: [pixelWordGroup("HAPPY", COLORS.yellow, 24)],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Birthday Word",
      opacity: fadeKeyframes(totalFrames, 40, totalFrames, 2, 10),
      position: [960, 332, 0],
      scale: popScaleKeyframes(totalFrames, 40, totalFrames, 118, 100),
      shapes: [pixelWordGroup("BIRTHDAY", COLORS.white, 18)],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Birthday Sparkle",
      opacity: fadeKeyframes(totalFrames, 42, totalFrames, 2, 8),
      position: [960, 320, 0],
      scale: popScaleKeyframes(totalFrames, 42, totalFrames, 128, 100),
      shapes: [sparkleGroup(COLORS.pink, 62)],
      totalFrames,
    })
  );

  return createAnimation("Happy Birthday Cake Pop", 1920, 1080, durationMs, layers);
}

function buildThumbsUpReactionPop() {
  const durationMs = 2800;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Reaction Bubble",
      opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 8),
      position: [960, 540, 0],
      scale: popScaleKeyframes(totalFrames, 0, totalFrames, 154, 104),
      shapes: [group("Bubble", [ellipsePath(0, 0, 500, 360), fill(COLORS.sky, 24)])],
      totalFrames,
    })
  );

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Thumb Pop",
      opacity: fadeKeyframes(totalFrames, 0, totalFrames, 2, 8),
      position: [960, 560, 0],
      rotation: [
        holdKeyframe(0, -18),
        easedKeyframe(0, -18, 8),
        easedKeyframe(18, 8, 0),
        holdKeyframe(totalFrames, 0),
      ],
      scale: popScaleKeyframes(totalFrames, 0, totalFrames, 140, 100),
      shapes: [thumbGroup()],
      totalFrames,
    })
  );

  const sparkles = [
    { position: [720, 310], color: COLORS.gold, scale: 110 },
    { position: [1240, 320], color: COLORS.white, scale: 130 },
    { position: [680, 650], color: COLORS.pink, scale: 100 },
    { position: [1270, 650], color: COLORS.yellow, scale: 120 },
  ];

  sparkles.forEach((sparkle, sparkleIndex) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Reaction Sparkle ${sparkleIndex + 1}`,
        opacity: fadeKeyframes(totalFrames, 10 + sparkleIndex * 4, totalFrames, 2, 10),
        position: [...sparkle.position, 0],
        scale: popScaleKeyframes(
          totalFrames,
          10 + sparkleIndex * 4,
          totalFrames,
          sparkle.scale,
          100
        ),
        rotation: spinKeyframes(
          totalFrames,
          sparkleIndex % 2 === 0 ? 0.6 : -0.6,
          48 + sparkleIndex * 4
        ),
        shapes: [sparkleGroup(sparkle.color, 48)],
        totalFrames,
      })
    );
  });

  return createAnimation("Thumbs Up Reaction Pop", 1920, 1080, durationMs, layers);
}

function buildFlowersBloomPop() {
  const durationMs = 3000;
  const totalFrames = frameCountFor(durationMs);
  const layers = [];
  let index = 1;

  layers.push(
    makeShapeLayer({
      index: index++,
      name: "Bloom Flower",
      opacity: fadeKeyframes(totalFrames, 4, totalFrames, 3, 10),
      position: [960, 560, 0],
      rotation: [
        holdKeyframe(0, -24),
        easedKeyframe(4, -24, 14),
        easedKeyframe(28, 14, 0),
        holdKeyframe(totalFrames, 0),
      ],
      scale: popScaleKeyframes(totalFrames, 4, totalFrames, 134, 100),
      shapes: [flowerGroup()],
      totalFrames,
    })
  );

  const petals = [
    { target: [700, 250], color: COLORS.rose, rotation: -180 },
    { target: [840, 170], color: COLORS.pink, rotation: -130 },
    { target: [1080, 170], color: COLORS.orange, rotation: 120 },
    { target: [1220, 260], color: COLORS.yellow, rotation: 170 },
    { target: [720, 820], color: COLORS.teal, rotation: -200 },
    { target: [1200, 820], color: COLORS.purple, rotation: 210 },
  ];

  petals.forEach((petal, petalIndex) => {
    layers.push(
      makeShapeLayer({
        index: index++,
        name: `Petal ${petalIndex + 1}`,
        opacity: fadeKeyframes(totalFrames, 26, totalFrames, 1, 10),
        position: moveKeyframes(totalFrames, [
          { t: 0, value: [960, 560, 0] },
          { t: 26, value: [960, 560, 0] },
          { t: 52, value: [...petal.target, 0] },
          { t: totalFrames, value: [...petal.target, 0] },
        ]),
        rotation: [
          holdKeyframe(0, 0),
          easedKeyframe(26, 0, petal.rotation),
          holdKeyframe(totalFrames, petal.rotation),
        ],
        scale: popScaleKeyframes(totalFrames, 26, totalFrames, 132, 100),
        shapes: [group("Petal", [ellipsePath(0, 0, 62, 108), fill(petal.color)])],
        totalFrames,
      })
    );
  });

  return createAnimation("Flowers Bloom Pop", 1920, 1080, durationMs, layers);
}

export async function generateLottiePilotPack() {
  const writtenFiles = [];

  for (const spec of PILOT_PACK_SPECS) {
    const targetPath = path.join(LOTTIE_ROOT, spec.outputPath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, `${JSON.stringify(spec.builder(), null, 2)}\n`, "utf8");
    writtenFiles.push(targetPath);
  }

  return writtenFiles;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentModulePath = fileURLToPath(import.meta.url);

if (invokedPath === currentModulePath) {
  const files = await generateLottiePilotPack();
  for (const filePath of files) {
    console.log(path.relative(PROJECT_ROOT, filePath).replaceAll("\\", "/"));
  }
}
