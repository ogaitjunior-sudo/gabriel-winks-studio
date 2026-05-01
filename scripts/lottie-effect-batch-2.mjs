import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  COLORS,
  animation,
  bingoBallGroup,
  cakeGroup,
  confettiGroup,
  ease,
  ellipse,
  fade,
  fill,
  frames,
  group,
  hold,
  layer,
  move,
  pop,
  rect,
  ringGroup,
  sparkleGroup,
  spin,
  starGroup,
  stroke,
  textGroup,
  writeLottieFiles,
} from "./lottie-effect-helpers.mjs";

const LETTERS = ["B", "I", "N", "G", "O"];
const BALL_COLORS = [COLORS.red, COLORS.blue, COLORS.gold, COLORS.green, COLORS.purple];
const LINE_XS = [560, 740, 920, 1100, 1280];
const LINE_POSITIONS = LINE_XS.map((x) => [x, 540]);
const ARC_POSITIONS = [
  [456, 650],
  [708, 576],
  [960, 500],
  [1212, 576],
  [1464, 650],
];

function burstLayers(totalFrames, startIndex, startFrame, center, particles) {
  return particles.map((particle, particleIndex) =>
    layer({
      index: startIndex + particleIndex,
      name: `${particle.name ?? "Particle"} ${particleIndex + 1}`,
      opacity: fade(totalFrames, startFrame, Math.min(totalFrames, startFrame + 28), 2, 10),
      position: move(totalFrames, [
        { t: 0, value: [...center, 0] },
        { t: startFrame, value: [...center, 0] },
        { t: Math.min(totalFrames - 10, startFrame + 18), value: [...particle.target, 0] },
        { t: totalFrames, value: [...particle.target, 0] },
      ]),
      rotation: spin(totalFrames, particle.turns ?? 0.8, Math.min(totalFrames - 6, startFrame + 20), particle.finalRotation ?? 0),
      scale: pop(totalFrames, startFrame, Math.min(totalFrames, startFrame + 28), particle.peakScale ?? 132, particle.settleScale ?? 100),
      shapes: [particle.shape],
      totalFrames,
    })
  );
}

function reboundScaleFrames(
  totalFrames,
  startFrame,
  endFrame,
  {
    startScale = 0,
    peakScale = 130,
    undershootScale = 94,
    settleScale = 100,
    exitScale = 108,
  } = {}
) {
  const hidden = [startScale, startScale, 100];
  const peak = [peakScale, peakScale, 100];
  const undershoot = [undershootScale, undershootScale, 100];
  const settle = [settleScale, settleScale, 100];
  const exit = [exitScale, exitScale, 100];
  const settleFrame = startFrame + 10;
  const holdFrame = Math.max(settleFrame, endFrame - 8);
  const exitFrame = Math.max(settleFrame + 1, endFrame - 4);

  return [
    hold(0, hidden),
    hold(startFrame, hidden),
    ease(startFrame, hidden, peak),
    ease(startFrame + 4, peak, undershoot),
    ease(startFrame + 8, undershoot, settle),
    hold(holdFrame, settle),
    ease(holdFrame, settle, exit),
    ease(exitFrame, exit, hidden),
    hold(totalFrames, hidden),
  ];
}

const balloonGroup = (color) =>
  group("Balloon", [
    ellipse(0, -40, 120, 150),
    fill(color),
    rect(0, 48, 8, 120, 4),
    fill(COLORS.white, 70),
    ellipse(-18, -72, 26, 42),
    fill(COLORS.white, 22),
  ]);

const presentGroup = () =>
  group("Present", [
    rect(0, 30, 220, 180, 26),
    fill(COLORS.pink),
    rect(0, -90, 240, 42, 18),
    fill(COLORS.rose),
    rect(0, 30, 30, 222, 12),
    fill(COLORS.gold),
    rect(0, -90, 30, 42, 12),
    fill(COLORS.gold),
  ]);

const crownGroup = () =>
  group("Crown", [
    rect(0, 70, 240, 44, 20),
    fill(COLORS.gold),
    group("Spikes", [
      rect(-80, 0, 54, 126, 10),
      fill(COLORS.gold),
      rect(0, -30, 56, 160, 10),
      fill(COLORS.yellow),
      rect(80, 0, 54, 126, 10),
      fill(COLORS.gold),
    ]),
  ]);

const potGroup = () =>
  group("Pot", [
    ellipse(0, 112, 220, 42),
    fill(COLORS.slate, 20),
    rect(0, 20, 190, 150, 34),
    fill(COLORS.slate),
    ellipse(0, -40, 186, 68),
    fill(COLORS.slate),
    rect(0, -52, 206, 18, 8),
    fill(COLORS.white, 20),
  ]);

const coinGroup = () =>
  group("Coin", [
    ellipse(0, 0, 92, 92),
    fill(COLORS.gold),
    ellipse(0, 0, 92, 92),
    stroke(COLORS.white, 8, 60),
    textGroup("B", COLORS.white, 12),
  ]);

function pushBingoBalls(layers, startIndex, totalFrames, config) {
  LETTERS.forEach((letter, letterIndex) => {
    layers.push(
      layer({
        index: startIndex + letterIndex,
        name: `${config.prefix ?? "Bingo"} ${letter}`,
        opacity: fade(totalFrames, config.startFrames?.[letterIndex] ?? 0, totalFrames, 2, 8),
        position: move(totalFrames, config.positionPoints(letterIndex)),
        rotation:
          config.rotationKeyframes?.(letterIndex) ??
          spin(totalFrames, 0.8 + letterIndex * 0.1, config.settleFrame ?? 44),
        scale:
          config.scaleKeyframes?.(letterIndex) ??
          pop(totalFrames, config.startFrames?.[letterIndex] ?? 0, totalFrames, config.peakScale ?? 118, 100),
        shapes: [bingoBallGroup(letter, BALL_COLORS[letterIndex])],
        totalFrames,
      })
    );
  });
}

function buildBingoVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [];
  let index = 1;
  let finalPositions = LINE_POSITIONS;

  if (mode === "crown") finalPositions = ARC_POSITIONS;
  if (mode === "slot") {
    LINE_XS.forEach((x, reelIndex) => {
      layers.push(
        layer({
          index: index++,
          name: `Slot Frame ${reelIndex + 1}`,
          opacity: fade(totalFrames, 0, totalFrames, 2, 8),
          position: [x, 520, 0],
          shapes: [group("Frame", [rect(0, 0, 180, 220, 28), fill(COLORS.slate, 85), rect(0, 0, 180, 220, 28), stroke(COLORS.white, 10, 75)])],
          totalFrames,
        })
      );
    });
  }

  if (mode === "countdown") {
    [
      { glyph: "3", start: 0, end: 18, color: COLORS.gold },
      { glyph: "2", start: 20, end: 38, color: COLORS.orange },
      { glyph: "1", start: 40, end: 56, color: COLORS.blue },
    ].forEach((digit) =>
      layers.push(
        layer({
          index: index++,
          name: `Countdown ${digit.glyph}`,
          opacity: fade(totalFrames, digit.start, digit.end, 2, 5),
          position: [960, 320, 0],
          scale: pop(totalFrames, digit.start, digit.end, 128, 100),
          shapes: [textGroup(digit.glyph, digit.color, 52)],
          totalFrames,
        })
      )
    );
  }

  const configByMode = {
    bouncein: {
      peakScale: 118,
      positionPoints: (i) => [{ t: 0, value: [LINE_XS[i], -180, 0] }, { t: 18 + i * 3, value: [LINE_XS[i], 622, 0] }, { t: 28 + i * 3, value: [LINE_XS[i], 520, 0] }, { t: 36 + i * 3, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      scaleKeyframes: (i) => reboundScaleFrames(totalFrames, [0, 3, 6, 9, 12][i], totalFrames, { peakScale: 132, undershootScale: 92, settleScale: 100, exitScale: 108 }),
      settleFrame: 36,
      startFrames: [0, 3, 6, 9, 12],
    },
    classic: {
      positionPoints: (i) => [{ t: 0, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      scaleKeyframes: (i) => pop(totalFrames, i * 6, totalFrames, 124, 100),
      settleFrame: 42,
      startFrames: [0, 6, 12, 18, 24],
    },
    crown: {
      positionPoints: (i) => [{ t: 0, value: [LINE_XS[i], 860, 0] }, { t: 16 + i * 3, value: [ARC_POSITIONS[i][0], ARC_POSITIONS[i][1] - 54, 0] }, { t: 28 + i * 3, value: [ARC_POSITIONS[i][0], ARC_POSITIONS[i][1] + 10, 0] }, { t: 38 + i * 3, value: [...ARC_POSITIONS[i], 0] }, { t: totalFrames, value: [...ARC_POSITIONS[i], 0] }],
      scaleKeyframes: (i) => reboundScaleFrames(totalFrames, [0, 3, 6, 9, 12][i], totalFrames, { startScale: 74, peakScale: 146, undershootScale: 98, settleScale: 116, exitScale: 124 }),
      settleFrame: 40,
      startFrames: [0, 3, 6, 9, 12],
    },
    drumroll: {
      positionPoints: (i) => [{ t: 0, value: [LINE_XS[i], 540, 0] }, { t: 14 + i * 2, value: [LINE_XS[i], 420 - i * 18, 0] }, { t: 24 + i * 2, value: [LINE_XS[i], 620 + i * 10, 0] }, { t: 36 + i * 2, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      startFrames: [0, 0, 0, 0, 0],
    },
    orbit: {
      positionPoints: (i) => [{ t: 0, value: [960 + Math.cos((i / 5) * Math.PI * 2) * 260, 540 + Math.sin((i / 5) * Math.PI * 2) * 200, 0] }, { t: 34, value: [960 + Math.cos((i / 5) * Math.PI * 2 + Math.PI) * 220, 540 + Math.sin((i / 5) * Math.PI * 2 + Math.PI) * 180, 0] }, { t: 62, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      settleFrame: 62,
      startFrames: [0, 0, 0, 0, 0],
    },
    popchain: {
      positionPoints: (i) => [{ t: 0, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      scaleKeyframes: (i) => pop(totalFrames, 8 + i * 8, totalFrames, 130, 100),
      startFrames: [8, 16, 24, 32, 40],
    },
    popup: {
      positionPoints: (i) => [{ t: 0, value: [LINE_XS[i], 980, 0] }, { t: 18 + i * 3, value: [LINE_XS[i], 500 - i * 10, 0] }, { t: 30 + i * 3, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      startFrames: [0, 3, 6, 9, 12],
    },
    scatter: {
      positionPoints: (i) => [{ t: 0, value: [960, 540, 0] }, { t: 18 + i * 2, value: [640 + i * 150, 260 + (i % 2) * 220, 0] }, { t: 48 + i * 2, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      startFrames: [0, 0, 0, 0, 0],
    },
    slot: {
      positionPoints: (i) => [{ t: 0, value: [LINE_XS[i], 240, 0] }, { t: 16 + i * 4, value: [LINE_XS[i], 620, 0] }, { t: 28 + i * 4, value: [LINE_XS[i], 520, 0] }, { t: totalFrames, value: [LINE_XS[i], 520, 0] }],
      startFrames: [0, 4, 8, 12, 16],
    },
    spin: {
      positionPoints: (i) => [{ t: 0, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      rotationKeyframes: (i) => spin(totalFrames, 2.2 + i * 0.2, 40 + i * 2),
      scaleKeyframes: () => [ease(0, [82, 82, 100], [108, 108, 100]), ease(24, [108, 108, 100], [100, 100, 100]), hold(totalFrames, [100, 100, 100])],
      startFrames: [0, 0, 0, 0, 0],
    },
    countdown: {
      positionPoints: (i) => [{ t: 0, value: [LINE_XS[i], 140, 0] }, { t: 58 + i * 3, value: [LINE_XS[i], 620, 0] }, { t: 74 + i * 3, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      startFrames: [58, 61, 64, 67, 70],
      settleFrame: 78,
    },
    wave: {
      positionPoints: (i) => [{ t: 0, value: [360 + i * 220, 660, 0] }, { t: 24 + i * 4, value: [LINE_XS[i], 470 - (i % 2) * 50, 0] }, { t: 42 + i * 4, value: [...LINE_POSITIONS[i], 0] }, { t: totalFrames, value: [...LINE_POSITIONS[i], 0] }],
      startFrames: [0, 4, 8, 12, 16],
    },
  }[mode];

  pushBingoBalls(layers, index, totalFrames, configByMode);
  index += LETTERS.length + (mode === "slot" ? LETTERS.length : 0);

  if (mode === "crown") {
    layers.push(layer({ index: index++, name: "Crown", opacity: 100, position: [960, 272, 0], scale: reboundScaleFrames(totalFrames, 8, totalFrames, { startScale: 76, peakScale: 136, undershootScale: 96, settleScale: 112, exitScale: 122 }), shapes: [crownGroup()], totalFrames }));
    layers.push(layer({ index: index++, name: "Crown Ring", opacity: fade(totalFrames, 18, totalFrames, 2, 8), position: [960, 560, 0], scale: reboundScaleFrames(totalFrames, 18, totalFrames, { peakScale: 184, undershootScale: 102, settleScale: 126, exitScale: 134 }), shapes: [ringGroup(COLORS.white, 360, 14)], totalFrames }));
  } else if (mode === "countdown") {
    layers.push(layer({ index: index++, name: "Bingo Word", opacity: fade(totalFrames, 74, totalFrames, 3, 8), position: [960, 830, 0], scale: pop(totalFrames, 74, totalFrames, 118, 100), shapes: [textGroup("BINGO", COLORS.white, 24)], totalFrames }));
  } else if (mode !== "slot") {
    if (mode === "bouncein") {
      layers.push(layer({ index: index++, name: "Bounce Ring", opacity: fade(totalFrames, 30, totalFrames, 2, 8), position: [960, 540, 0], scale: reboundScaleFrames(totalFrames, 30, totalFrames, { peakScale: 158, undershootScale: 98, settleScale: 116, exitScale: 124 }), shapes: [ringGroup(COLORS.white, 280, 12)], totalFrames }));
    }
    layers.push(layer({ index: index++, name: "Bingo Word", opacity: fade(totalFrames, Math.max(16, totalFrames - 36), totalFrames, 2, 8), position: [960, 826, 0], scale: pop(totalFrames, Math.max(16, totalFrames - 36), totalFrames, 112, 100), shapes: [textGroup("BINGO", COLORS.white, 22)], totalFrames }));
  }

  return animation(name, durationMs, layers);
}

function buildGoldVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [];
  let index = 1;

  const addStar = (name, position, startFrame, target = position, rotationTurns = 0.8, scalePeak = 118, color = COLORS.gold, radius = 42) =>
    layers.push(layer({ index: index++, name, opacity: fade(totalFrames, startFrame, totalFrames, 2, 8), position: move(totalFrames, [{ t: 0, value: [...position, 0] }, { t: startFrame, value: [...position, 0] }, { t: Math.min(totalFrames - 16, startFrame + 20), value: [...target, 0] }, { t: totalFrames, value: [...target, 0] }]), rotation: spin(totalFrames, rotationTurns, Math.min(totalFrames - 12, startFrame + 22)), scale: pop(totalFrames, startFrame, totalFrames, scalePeak, 100), shapes: [starGroup(color, radius, Math.round(radius * 0.38))], totalFrames }));

  if (mode === "big" || mode === "popdeluxe") addStar("Center Star", [960, 500], 0, [960, 500], 0.8, mode === "popdeluxe" ? 150 : 132, COLORS.gold, mode === "popdeluxe" ? 90 : 76);
  if (mode === "cascade") {
    addStar("Hero Star", [960, 540], 0, [960, 540], 0.9, 150, COLORS.gold, 94);
    [[640, 430], [780, 720], [1140, 720], [1280, 430]].forEach((pos, i) =>
      addStar(`Cascade ${i + 1}`, [960, 540], 6 + i * 4, pos, 0.9 + i * 0.1, 124, i % 2 ? COLORS.yellow : COLORS.gold, 52)
    );
  }
  if (mode === "cometarc") [[520, 680, 700, 420], [760, 640, 870, 320], [1000, 640, 1050, 320], [1240, 680, 1220, 420]].forEach((coords, i) => addStar(`Comet ${i + 1}`, [coords[0], coords[1]], i * 6, [coords[2], coords[3]], 1 + i * 0.1, 110, COLORS.yellow, 32));
  if (mode === "const") [[640, 340], [820, 460], [960, 280], [1120, 430], [1280, 320]].forEach((pos, i) => addStar(`Constellation ${i + 1}`, pos, i * 6, pos, 0.4 + i * 0.1, 108, COLORS.gold, 28));
  if (mode === "crown") [[660, 520], [820, 390], [960, 320], [1100, 390], [1260, 520]].forEach((pos, i) => addStar(`Crown Star ${i + 1}`, [pos[0], 900], i * 4, pos, 0.7, 110, COLORS.gold, 30));
  if (mode === "explode") {
    const particles = burstLayers(totalFrames, index, 10, [960, 500], [{ shape: starGroup(COLORS.gold, 40, 14), target: [680, 300], turns: 0.8 }, { shape: starGroup(COLORS.yellow, 34, 12), target: [840, 180], turns: 1 }, { shape: starGroup(COLORS.gold, 36, 12), target: [1080, 180], turns: 1.1 }, { shape: starGroup(COLORS.yellow, 40, 14), target: [1240, 300], turns: 0.8 }, { shape: sparkleGroup(COLORS.white, 42), target: [960, 760], turns: 0.2 }]);
    layers.push(...particles);
    index += particles.length;
  }
  if (mode === "crossspark") ["gold", "white", "gold"].forEach((tone, i) => layers.push(layer({ index: index++, name: `Spark ${i + 1}`, opacity: fade(totalFrames, i * 8, totalFrames, 2, 8), position: [960, 500, 0], scale: pop(totalFrames, i * 8, totalFrames, 120 + i * 12, 100), shapes: [sparkleGroup(COLORS[tone], 60 + i * 16)], totalFrames })));
  if (mode === "mirror") [[620, 520], [1300, 520], [780, 340], [1140, 340]].forEach((pos, i) => addStar(`Mirror ${i + 1}`, [960, 500], i * 4, pos, 0.9, 112, i < 2 ? COLORS.gold : COLORS.yellow, 32));
  if (mode === "pinwheel") [[960, 260], [1260, 500], [960, 740], [660, 500]].forEach((pos, i) => addStar(`Pinwheel ${i + 1}`, [960, 500], i * 5, pos, 1.4, 108, COLORS.gold, 30));
  if (mode === "ribbon") {
    [[760, 420, COLORS.rose], [960, 500, COLORS.gold], [1160, 580, COLORS.teal]].forEach(([x, y, color], i) => {
      layers.push(layer({ index: index++, name: `Ribbon ${i + 1}`, opacity: fade(totalFrames, i * 6, totalFrames, 2, 8), position: move(totalFrames, [{ t: 0, value: [300, y - 120 + i * 40, 0] }, { t: 24 + i * 4, value: [x, y, 0] }, { t: totalFrames, value: [x + 120, y + 20, 0] }]), rotation: [ease(0, -22, 14), ease(24 + i * 4, 14, -6), hold(totalFrames, -6)], scale: [ease(0, [30, 30, 100], [100, 100, 100]), hold(totalFrames, [100, 100, 100])], shapes: [confettiGroup(color, 260, 34)], totalFrames }));
    });
  }
  if (mode === "trailarc") [[520, 620], [680, 460], [860, 340], [1060, 320], [1260, 400], [1400, 560]].forEach((pos, i) => addStar(`Trail ${i + 1}`, [360, 760], i * 4, pos, 0.7, 104, i % 2 ? COLORS.yellow : COLORS.gold, 24));

  if (mode === "big") {
    layers.push(layer({ index: index++, name: "Center Ring", opacity: fade(totalFrames, 6, totalFrames, 2, 8), position: [960, 500, 0], scale: reboundScaleFrames(totalFrames, 6, totalFrames, { peakScale: 172, undershootScale: 100, settleScale: 118, exitScale: 126 }), shapes: [ringGroup(COLORS.white, 250, 12)], totalFrames }));
    layers.push(layer({ index: index++, name: "Center Sparkle", opacity: fade(totalFrames, 12, totalFrames, 2, 8), position: [960, 500, 0], scale: reboundScaleFrames(totalFrames, 12, totalFrames, { peakScale: 148, undershootScale: 98, settleScale: 110, exitScale: 118 }), shapes: [sparkleGroup(COLORS.gold, 56)], totalFrames }));
  }

  if (mode === "cascade") {
    layers.push(layer({ index: index++, name: "Cascade Ring", opacity: fade(totalFrames, 16, totalFrames, 2, 8), position: [960, 540, 0], scale: reboundScaleFrames(totalFrames, 16, totalFrames, { startScale: 72, peakScale: 178, undershootScale: 100, settleScale: 124, exitScale: 132 }), shapes: [ringGroup(COLORS.white, 360, 14)], totalFrames }));
  }

  if (mode !== "explode" && mode !== "crossspark") {
    layers.push(layer({ index: index++, name: "Star Ring", opacity: fade(totalFrames, Math.max(8, totalFrames - 34), totalFrames, 2, 8), position: [960, 520, 0], scale: pop(totalFrames, Math.max(8, totalFrames - 34), totalFrames, 138, 108), shapes: [ringGroup(COLORS.white, 240, 12)], totalFrames }));
  }
  layers.push(layer({ index: index++, name: "Gold Title", opacity: fade(totalFrames, Math.max(14, totalFrames - 30), totalFrames, 2, 8), position: [960, 828, 0], scale: pop(totalFrames, Math.max(14, totalFrames - 30), totalFrames, 112, 100), shapes: [textGroup("BINGO", COLORS.white, 20)], totalFrames }));

  return animation(name, durationMs, layers);
}

function buildBirthdayVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [layer({ index: 1, name: "Cake", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 640, 0], scale: pop(totalFrames, 0, totalFrames, 116, 100), shapes: [cakeGroup(true)], totalFrames })];
  let index = 2;

  if (mode === "balloons") {
    layers[0] = {
      ...layers[0],
      ks: {
        ...layers[0].ks,
        o: { a: 0, k: 100 },
        p: { a: 1, k: move(totalFrames, [{ t: 0, value: [960, 700, 0] }, { t: 14, value: [960, 612, 0] }, { t: 24, value: [960, 640, 0] }, { t: totalFrames, value: [960, 640, 0] }]) },
        s: { a: 1, k: reboundScaleFrames(totalFrames, 0, totalFrames, { startScale: 78, peakScale: 132, undershootScale: 94, settleScale: 110, exitScale: 118 }) },
      },
    };
    [[700, 306, COLORS.rose], [960, 236, COLORS.yellow], [1220, 306, COLORS.blue]].forEach(([x, y, color], i) =>
      layers.push(
        layer({
          index: index++,
          name: `Balloon ${i + 1}`,
          opacity: 100,
          position: move(totalFrames, [
            { t: 0, value: [x, y + 24, 0] },
            { t: 14 + i * 4, value: [x, y - 24, 0] },
            { t: 24 + i * 4, value: [x, y, 0] },
            { t: totalFrames, value: [x, y - 18, 0] },
          ]),
          rotation: [ease(0, -12, 8), ease(24 + i * 5, 8, -5), ease(44 + i * 5, -5, 2), hold(totalFrames, 2)],
          scale: reboundScaleFrames(totalFrames, 8 + i * 5, totalFrames, { startScale: 76, peakScale: 124, undershootScale: 96, settleScale: 104, exitScale: 112 }),
          shapes: [balloonGroup(color)],
          totalFrames,
        })
      )
    );
    layers.push(layer({ index: index++, name: "Balloon Ring", opacity: fade(totalFrames, 20, totalFrames, 2, 8), position: [960, 356, 0], scale: reboundScaleFrames(totalFrames, 20, totalFrames, { startScale: 74, peakScale: 170, undershootScale: 100, settleScale: 122, exitScale: 132 }), shapes: [ringGroup(COLORS.white, 340, 12)], totalFrames }));
    layers.push(layer({ index: index++, name: "Happy", opacity: fade(totalFrames, 18, totalFrames, 2, 8), position: [960, 210, 0], scale: reboundScaleFrames(totalFrames, 18, totalFrames, { startScale: 68, peakScale: 124, undershootScale: 96, settleScale: 104, exitScale: 112 }), shapes: [textGroup("HAPPY", COLORS.white, 22)], totalFrames }));
    layers.push(layer({ index: index++, name: "Birthday", opacity: fade(totalFrames, 28, totalFrames, 2, 8), position: [960, 292, 0], scale: reboundScaleFrames(totalFrames, 28, totalFrames, { startScale: 68, peakScale: 118, undershootScale: 96, settleScale: 102, exitScale: 110 }), shapes: [textGroup("BIRTHDAY", COLORS.gold, 18)], totalFrames }));
  }
  if (mode === "party") {
    const particles = burstLayers(totalFrames, index, 24, [960, 420], [{ shape: starGroup(COLORS.gold, 34, 12), target: [720, 220], turns: 0.8 }, { shape: starGroup(COLORS.yellow, 28, 10), target: [860, 160], turns: 1 }, { shape: starGroup(COLORS.rose, 30, 10), target: [1060, 160], turns: 1 }, { shape: starGroup(COLORS.blue, 34, 12), target: [1200, 220], turns: 0.9 }]);
    layers.push(...particles);
    index += particles.length;
  }
  if (mode === "frosting") layers.push(layer({ index: index++, name: "Frosting Bar", opacity: fade(totalFrames, 18, totalFrames, 2, 8), position: [960, 378, 0], scale: pop(totalFrames, 18, totalFrames, 112, 100), shapes: [group("Bar", [rect(0, 0, 520, 28, 14), fill(COLORS.white), rect(0, 0, 520, 28, 14), stroke(COLORS.pink, 6, 70)])], totalFrames }));
  if (mode === "gift") {
    layers.unshift(layer({ index: 1, name: "Present", opacity: fade(totalFrames, 0, 36, 2, 6), position: [960, 620, 0], scale: pop(totalFrames, 0, 36, 118, 100), shapes: [presentGroup()], totalFrames }));
    layers[1] = { ...layers[1], ind: 2, ip: 22, opacity: fade(totalFrames, 22, totalFrames, 2, 8) };
    index += 1;
  }
  if (mode === "sparkle") {
    const particles = burstLayers(totalFrames, index, 18, [960, 430], [{ shape: sparkleGroup(COLORS.white, 44), target: [760, 260], turns: 0.4 }, { shape: sparkleGroup(COLORS.gold, 38), target: [860, 160], turns: 0.2 }, { shape: sparkleGroup(COLORS.gold, 38), target: [1060, 160], turns: -0.2 }, { shape: sparkleGroup(COLORS.white, 44), target: [1160, 260], turns: -0.4 }]);
    layers.push(...particles);
    index += particles.length;
  }

  layers.push(layer({ index: index++, name: "Happy", opacity: fade(totalFrames, 16, totalFrames, 2, 8), position: [960, 220, 0], scale: pop(totalFrames, 16, totalFrames, 114, 100), shapes: [textGroup("HAPPY", COLORS.white, 18)], totalFrames }));
  layers.push(layer({ index: index++, name: "Birthday", opacity: fade(totalFrames, 28, totalFrames, 2, 8), position: [960, 296, 0], scale: pop(totalFrames, 28, totalFrames, 110, 100), shapes: [textGroup("BIRTHDAY", COLORS.gold, 15)], totalFrames }));

  return animation(name, durationMs, layers);
}

function buildPotOfGold(name, durationMs) {
  const totalFrames = frames(durationMs);
  const layers = [
    layer({ index: 1, name: "Pot", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 700, 0], scale: pop(totalFrames, 0, totalFrames, 114, 100), shapes: [potGroup()], totalFrames }),
    layer({ index: 2, name: "Coin Ring", opacity: fade(totalFrames, 20, totalFrames, 2, 8), position: [960, 380, 0], scale: pop(totalFrames, 20, totalFrames, 126, 108), shapes: [ringGroup(COLORS.gold, 220, 12)], totalFrames }),
  ];
  layers.push(...burstLayers(totalFrames, 3, 12, [960, 620], [{ shape: coinGroup(), target: [760, 340], turns: 1 }, { shape: coinGroup(), target: [860, 220], turns: 1.2 }, { shape: coinGroup(), target: [960, 180], turns: 0.8 }, { shape: coinGroup(), target: [1060, 220], turns: 1.1 }, { shape: coinGroup(), target: [1160, 340], turns: 0.9 }, { shape: sparkleGroup(COLORS.gold, 42), target: [960, 420], turns: 0.2 }]));
  return animation(name, durationMs, layers);
}

export const EFFECT_BATCH_2_SPECS = Object.freeze([
  { id: "bb-bouncein", builder: () => buildBingoVariant("Bingo Balls Bounce In", 2800, "bouncein") },
  { id: "bb-classic", builder: () => buildBingoVariant("Bingo Balls Classic", 3000, "classic") },
  { id: "bb-crown", builder: () => buildBingoVariant("Bingo Balls Crown Arc", 3000, "crown") },
  { id: "bb-drumroll", builder: () => buildBingoVariant("Bingo Balls Drumroll", 3200, "drumroll") },
  { id: "bb-orbit", builder: () => buildBingoVariant("Bingo Balls Orbit", 3600, "orbit") },
  { id: "bb-popchain", builder: () => buildBingoVariant("Bingo Balls Pop Chain", 3200, "popchain") },
  { id: "bb-popup", builder: () => buildBingoVariant("Bingo Balls Pop Up", 2600, "popup") },
  { id: "bb-scatter", builder: () => buildBingoVariant("Bingo Balls Scatter", 3200, "scatter") },
  { id: "bb-slot", builder: () => buildBingoVariant("Bingo Balls Slot", 2800, "slot") },
  { id: "bb-spin", builder: () => buildBingoVariant("Bingo Balls Spin", 3000, "spin") },
  { id: "bouncing-bingo-countdown", builder: () => buildBingoVariant("Countdown Bounce Bingo", 3400, "countdown") },
  { id: "bouncing-bingo-wave", builder: () => buildBingoVariant("Wave Bounce Bingo", 3000, "wave") },
  { id: "gs-big", builder: () => buildGoldVariant("Gold Stars Big Star", 2800, "big") },
  { id: "gs-cascade", builder: () => buildGoldVariant("Gold Stars Celebration Cascade", 3500, "cascade") },
  { id: "gs-cometarc", builder: () => buildGoldVariant("Gold Stars Comet Arc", 3200, "cometarc") },
  { id: "gs-const", builder: () => buildGoldVariant("Gold Stars Constellation", 3000, "const") },
  { id: "gs-crown", builder: () => buildGoldVariant("Gold Stars Crown", 2800, "crown") },
  { id: "gs-explode", builder: () => buildGoldVariant("Gold Stars Explode", 2600, "explode") },
  { id: "gs-crossspark", builder: () => buildGoldVariant("Gold Stars Magic Cross Spark", 3000, "crossspark") },
  { id: "gs-mirror", builder: () => buildGoldVariant("Gold Stars Mirror Burst", 3200, "mirror") },
  { id: "gs-pinwheel", builder: () => buildGoldVariant("Gold Stars Pinwheel", 3400, "pinwheel") },
  { id: "gs-popdeluxe", builder: () => buildGoldVariant("Gold Stars Pop Deluxe", 3000, "popdeluxe") },
  { id: "gs-ribbon", builder: () => buildGoldVariant("Gold Stars Ribbon", 3200, "ribbon") },
  { id: "gs-trailarc", builder: () => buildGoldVariant("Gold Stars Trail Arc", 3200, "trailarc") },
  { id: "happy-birthday-balloon-cake-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Balloon Letters", 3500, "balloons") },
  { id: "happy-birthday-party-popper-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Cupcake Parade", 3400, "party") },
  { id: "happy-birthday-frosting-write-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Elegant Gold", 3500, "frosting") },
  { id: "happy-birthday-gift-cake-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Hat Drop", 3300, "gift") },
  { id: "happy-birthday-sparkle-cake-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Spin Sparkle Cake", 3200, "sparkle") },
  { id: "leprechaun-pot-of-gold", builder: () => buildPotOfGold("Leprechaun Pot Of Gold", 3200) },
]);

export async function generateEffectWinksBatch2() {
  await writeLottieFiles(EFFECT_BATCH_2_SPECS);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  await generateEffectWinksBatch2();
}
