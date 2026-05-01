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
  flowerGroup,
  frames,
  group,
  hold,
  layer,
  move,
  poly,
  pop,
  rect,
  ringGroup,
  sparkleGroup,
  spin,
  starGroup,
  stroke,
  textGroup,
  thumbGroup,
  writeLottieFiles,
} from "./lottie-effect-helpers.mjs";

function burstLayers(totalFrames, startIndex, startFrame, center, particles) {
  return particles.map((particle, particleIndex) =>
    layer({
      index: startIndex + particleIndex,
      name: `${particle.name ?? "Particle"} ${particleIndex + 1}`,
      opacity: fade(totalFrames, startFrame, Math.min(totalFrames, startFrame + 30), 2, 10),
      position: move(totalFrames, [
        { t: 0, value: [...center, 0] },
        { t: startFrame, value: [...center, 0] },
        { t: Math.min(totalFrames - 10, startFrame + 18), value: [...particle.target, 0] },
        { t: totalFrames, value: [...particle.target, 0] },
      ]),
      rotation: Array.isArray(particle.rotation) ? particle.rotation : spin(totalFrames, particle.turns ?? 0.8, Math.min(totalFrames - 6, startFrame + 20), particle.rotation ?? 0),
      scale: pop(totalFrames, startFrame, Math.min(totalFrames, startFrame + 30), particle.peakScale ?? 132, particle.settleScale ?? 100),
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

function verticalBounceFrames(
  totalFrames,
  startFrame,
  endFrame,
  { startY, overshootY, settleY, exitY = settleY - 20, x = 960 }
) {
  const holdFrame = Math.max(startFrame + 10, endFrame - 8);
  return move(totalFrames, [
    { t: 0, value: [x, startY, 0] },
    { t: startFrame, value: [x, startY, 0] },
    { t: startFrame + 6, value: [x, overshootY, 0] },
    { t: startFrame + 10, value: [x, settleY, 0] },
    { t: holdFrame, value: [x, settleY, 0] },
    { t: endFrame, value: [x, exitY, 0] },
  ]);
}

const cloverGroup = () => group("Clover", [ellipse(0, -54, 76, 92), fill(COLORS.green), ellipse(48, -6, 76, 92), fill(COLORS.mint), ellipse(-48, -6, 76, 92), fill(COLORS.green), ellipse(0, 44, 76, 92), fill(COLORS.mint), rect(0, 116, 18, 106, 10), fill(COLORS.green)]);
const hatGroup = () => group("Hat", [rect(0, 92, 260, 38, 18), fill(COLORS.green), poly([[-98, 88], [-70, -122], [92, -122], [116, 88]]), fill(COLORS.green), rect(0, -18, 112, 28, 12), fill(COLORS.gold), rect(0, -18, 30, 34, 8), fill(COLORS.orange)]);
const coinGroup = () => group("Coin", [ellipse(0, 0, 94, 94), fill(COLORS.gold), ellipse(0, 0, 94, 94), stroke(COLORS.white, 8, 64), textGroup("B", COLORS.white, 12)]);
const potGroup = () => group("Pot", [ellipse(0, 112, 220, 42), fill(COLORS.slate, 20), rect(0, 20, 190, 150, 34), fill(COLORS.slate), ellipse(0, -40, 186, 68), fill(COLORS.slate), rect(0, -52, 206, 18, 8), fill(COLORS.white, 20)]);
const roseGroup = () => group("Rose", [ellipse(0, -84, 124, 148), fill(COLORS.rose), ellipse(52, -14, 120, 142), fill(COLORS.red), ellipse(-56, -12, 120, 142), fill(COLORS.pink), ellipse(0, 68, 108, 128), fill(COLORS.rose), ellipse(0, 0, 70, 70), fill(COLORS.gold)]);
const bouquetGroup = () => group("Bouquet", [group("Stem L", [rect(0, 82, 16, 220, 8), fill(COLORS.green)], { p: [-120, 160] }), group("Stem C", [rect(0, 82, 16, 240, 8), fill(COLORS.green)], { p: [0, 170] }), group("Stem R", [rect(0, 82, 16, 220, 8), fill(COLORS.green)], { p: [120, 160] }), group("Flower L", [flowerGroup()], { p: [-120, -10], s: [54, 54] }), group("Flower C", [flowerGroup()], { p: [0, -54], s: [62, 62] }), group("Flower R", [flowerGroup()], { p: [120, -10], s: [54, 54] })]);
const flameGroup = () => group("Flames", [ellipse(-38, -174, 18, 30), fill(COLORS.orange), ellipse(0, -184, 18, 34), fill(COLORS.gold), ellipse(38, -174, 18, 30), fill(COLORS.orange)]);

function rainbowBand(outerRadiusX, outerRadiusY, innerRadiusX, innerRadiusY, color) {
  const outer = [];
  const inner = [];
  for (let step = 0; step <= 10; step += 1) {
    const angle = Math.PI - (Math.PI * step) / 10;
    outer.push([Math.cos(angle) * outerRadiusX, Math.sin(angle) * outerRadiusY]);
    inner.unshift([Math.cos(angle) * innerRadiusX, Math.sin(angle) * innerRadiusY]);
  }
  return group("Rainbow Band", [poly([...outer, ...inner]), fill(color)]);
}

const rainbowGroup = () =>
  group("Rainbow", [
    rainbowBand(250, 180, 214, 150, COLORS.red),
    rainbowBand(214, 150, 182, 124, COLORS.orange),
    rainbowBand(182, 124, 152, 100, COLORS.yellow),
    rainbowBand(152, 100, 124, 78, COLORS.green),
    rainbowBand(124, 78, 98, 58, COLORS.blue),
  ]);

function buildCountdownVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [];
  let index = 1;
  [
    { glyph: "3", start: 0, end: 22, color: COLORS.gold },
    { glyph: "2", start: 24, end: 46, color: COLORS.orange },
    { glyph: "1", start: 48, end: 68, color: COLORS.blue },
  ].forEach((digit, digitIndex) =>
    layers.push(
      layer({
        index: index++,
        name: `Countdown ${digit.glyph}`,
        opacity: fade(totalFrames, digit.start, digit.end, 3, 6),
        position: verticalBounceFrames(totalFrames, digit.start, digit.end, {
          startY: 520,
          overshootY: 398 - digitIndex * 4,
          settleY: 430,
          exitY: 384,
        }),
        scale: reboundScaleFrames(totalFrames, digit.start, digit.end, {
          peakScale: 138,
          undershootScale: 92,
          settleScale: 100,
          exitScale: 110,
        }),
        shapes: [textGroup(digit.glyph, digit.color, 60)],
        totalFrames,
      })
    )
  );
  if (mode === "pop")
    layers.push(
      layer({
        index: index++,
        name: "Pop Ring",
        opacity: fade(totalFrames, 66, totalFrames, 2, 10),
        position: [960, 520, 0],
        scale: reboundScaleFrames(totalFrames, 66, totalFrames, {
          peakScale: 188,
          undershootScale: 104,
          settleScale: 126,
          exitScale: 136,
        }),
        shapes: [ringGroup(COLORS.white, 260, 16)],
        totalFrames,
      })
    );
  if (mode !== "confetti")
    layers.push(
      layer({
        index: index++,
        name: "Impact Sparkle",
        opacity: fade(totalFrames, 68, totalFrames, 2, 8),
        position: [960, 520, 0],
        scale: reboundScaleFrames(totalFrames, 68, totalFrames, {
          peakScale: 154,
          undershootScale: 96,
          settleScale: 110,
          exitScale: 118,
        }),
        shapes: [sparkleGroup(COLORS.white, 54)],
        totalFrames,
      })
    );
  if (mode === "confetti") layers.push(...burstLayers(totalFrames, index, 66, [960, 520], [{ shape: confettiGroup(COLORS.pink, 26, 12), target: [660, 230], turns: 1.6 }, { shape: confettiGroup(COLORS.blue, 22, 22), target: [820, 170], turns: 1.2 }, { shape: confettiGroup(COLORS.yellow, 30, 14), target: [960, 150], turns: 1 }, { shape: confettiGroup(COLORS.green, 24, 12), target: [1110, 180], turns: 1.4 }, { shape: confettiGroup(COLORS.orange, 22, 22), target: [1270, 240], turns: 1.7 }, { shape: sparkleGroup(COLORS.white, 42), target: [760, 700], turns: 0.6 }, { shape: sparkleGroup(COLORS.gold, 42), target: [1160, 700], turns: -0.6 }]));
  if (mode === "gold") layers.push(...burstLayers(totalFrames, index, 66, [960, 520], [{ shape: starGroup(COLORS.gold, 42, 16), target: [640, 280], turns: 1 }, { shape: starGroup(COLORS.yellow, 38, 14), target: [790, 180], turns: 0.7 }, { shape: starGroup(COLORS.orange, 38, 14), target: [960, 150], turns: 1.1 }, { shape: starGroup(COLORS.gold, 38, 14), target: [1130, 180], turns: 0.8 }, { shape: starGroup(COLORS.yellow, 42, 16), target: [1280, 280], turns: 1.2 }, { shape: sparkleGroup(COLORS.white, 46), target: [960, 720], turns: 0.3 }]));
  return animation(name, durationMs, layers);
}

function buildCountdownBingoLetterPop() {
  const durationMs = 3800;
  const totalFrames = frames(durationMs);
  const layers = [];
  let index = 1;
  [{ glyph: "3", start: 0, end: 22, color: COLORS.gold }, { glyph: "2", start: 24, end: 46, color: COLORS.orange }, { glyph: "1", start: 48, end: 68, color: COLORS.blue }].forEach((digit, digitIndex) =>
    layers.push(
      layer({
        index: index++,
        name: `Countdown ${digit.glyph}`,
        opacity: fade(totalFrames, digit.start, digit.end, 3, 6),
        position: verticalBounceFrames(totalFrames, digit.start, digit.end, {
          startY: 430,
          overshootY: 286 - digitIndex * 4,
          settleY: 326,
          exitY: 286,
        }),
        scale: reboundScaleFrames(totalFrames, digit.start, digit.end, {
          startScale: digitIndex === 0 ? 74 : 0,
          peakScale: 144,
          undershootScale: 92,
          settleScale: 108,
          exitScale: 116,
        }),
        shapes: [textGroup(digit.glyph, digit.color, 64)],
        totalFrames,
      })
    )
  );
  [["B", COLORS.red, 560], ["I", COLORS.blue, 760], ["N", COLORS.gold, 960], ["G", COLORS.green, 1160], ["O", COLORS.purple, 1360]].forEach(([glyph, color, x], letterIndex) =>
    layers.push(
      layer({
        index: index++,
        name: `Bingo Letter ${glyph}`,
        opacity: fade(totalFrames, 70 + letterIndex * 5, totalFrames, 2, 8),
        position: verticalBounceFrames(totalFrames, 70 + letterIndex * 5, totalFrames, {
          startY: 240,
          overshootY: 632 + (letterIndex % 2) * 10,
          settleY: 596,
          exitY: 574,
          x,
        }),
        scale: reboundScaleFrames(totalFrames, 70 + letterIndex * 5, totalFrames, {
          startScale: 74,
          peakScale: 142,
          undershootScale: 94,
          settleScale: 110,
          exitScale: 118,
        }),
        rotation: [
          ease(70 + letterIndex * 5, -90 + letterIndex * 8, 12),
          ease(82 + letterIndex * 5, 12, -4),
          ease(94 + letterIndex * 5, -4, 0),
          hold(totalFrames, 0),
        ],
        shapes: [bingoBallGroup(glyph, color)],
        totalFrames,
      })
    )
  );
  layers.push(
    layer({
      index: index++,
      name: "Impact Ring",
      opacity: fade(totalFrames, 92, totalFrames, 2, 8),
      position: [960, 590, 0],
      scale: reboundScaleFrames(totalFrames, 92, totalFrames, {
        startScale: 76,
        peakScale: 178,
        undershootScale: 98,
        settleScale: 126,
        exitScale: 134,
      }),
      shapes: [ringGroup(COLORS.white, 360, 14)],
      totalFrames,
    })
  );
  layers.push(layer({ index: index++, name: "Bingo Word", opacity: fade(totalFrames, 96, totalFrames, 3, 8), position: verticalBounceFrames(totalFrames, 96, totalFrames, { startY: 860, overshootY: 800, settleY: 824, exitY: 798 }), scale: reboundScaleFrames(totalFrames, 96, totalFrames, { startScale: 76, peakScale: 132, undershootScale: 96, settleScale: 106, exitScale: 114 }), shapes: [textGroup("BINGO", COLORS.white, 28)], totalFrames }));
  layers.push(layer({ index: index++, name: "Final Sparkle", opacity: fade(totalFrames, 100, totalFrames, 2, 8), position: [960, 842, 0], scale: reboundScaleFrames(totalFrames, 100, totalFrames, { peakScale: 140, undershootScale: 98, settleScale: 110, exitScale: 116 }), shapes: [sparkleGroup(COLORS.gold, 52)], totalFrames }));
  return animation("Countdown Bingo Letter Pop", durationMs, layers);
}

function buildThumbVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const heroMode = mode === "confetti" || mode === "gold";
  const layers = [
    layer({
      index: 1,
      name: "Thumb",
      opacity: heroMode ? 100 : fade(totalFrames, 0, totalFrames, 2, 8),
      position: move(totalFrames, [
        { t: 0, value: [960, heroMode ? 588 : 720, 0] },
        { t: 14, value: [960, heroMode ? 494 : 506, 0] },
        { t: 24, value: [960, 540, 0] },
        { t: totalFrames, value: [960, 540, 0] },
      ]),
      scale: reboundScaleFrames(totalFrames, 0, totalFrames, {
        startScale: heroMode ? 78 : 0,
        peakScale: heroMode ? 132 : 118,
        undershootScale: 92,
        settleScale: heroMode ? 108 : 100,
        exitScale: heroMode ? 116 : 108,
      }),
      rotation:
        mode === "sparkle"
          ? [ease(0, -12, 8), ease(18, 8, -2), ease(28, -2, 0), hold(totalFrames, 0)]
          : [ease(0, -10, 12), ease(20, 12, -3), ease(30, -3, 0), hold(totalFrames, 0)],
      shapes: [thumbGroup()],
      totalFrames,
    }),
  ];
  let index = 2;
  if (mode === "bounce") layers.push(layer({ index: index++, name: "Bounce Ring", opacity: fade(totalFrames, 10, totalFrames, 2, 10), position: [960, 540, 0], scale: reboundScaleFrames(totalFrames, 10, totalFrames, { peakScale: 166, undershootScale: 102, settleScale: 114, exitScale: 122 }), shapes: [ringGroup(COLORS.white, 240, 14)], totalFrames }));
  if (mode === "confetti") layers.push(...burstLayers(totalFrames, index, 14, [960, 520], [{ shape: confettiGroup(COLORS.yellow, 28, 14), target: [720, 250], turns: 1.2, peakScale: 140 }, { shape: confettiGroup(COLORS.pink, 26, 14), target: [840, 170], turns: 1.4, peakScale: 136 }, { shape: confettiGroup(COLORS.orange, 26, 14), target: [1080, 170], turns: 1.3, peakScale: 136 }, { shape: confettiGroup(COLORS.green, 28, 14), target: [1200, 250], turns: 1.2, peakScale: 140 }]));
  if (mode === "gold") layers.push(...burstLayers(totalFrames, index, 14, [960, 520], [{ shape: starGroup(COLORS.gold, 54, 20), target: [710, 280], turns: 0.8, peakScale: 142 }, { shape: starGroup(COLORS.yellow, 42, 16), target: [840, 190], turns: 1.1, peakScale: 136 }, { shape: starGroup(COLORS.orange, 42, 16), target: [1080, 190], turns: 1.3, peakScale: 136 }, { shape: starGroup(COLORS.gold, 54, 20), target: [1210, 280], turns: 0.9, peakScale: 142 }]));
  if (mode === "sparkle") layers.push(...burstLayers(totalFrames, index, 14, [960, 520], [{ shape: sparkleGroup(COLORS.white, 54), target: [730, 260], turns: 0.4 }, { shape: sparkleGroup(COLORS.gold, 44), target: [860, 150], turns: -0.3 }, { shape: sparkleGroup(COLORS.yellow, 44), target: [1100, 150], turns: 0.3 }, { shape: sparkleGroup(COLORS.white, 54), target: [1230, 260], turns: -0.4 }]));
  if (mode === "confetti" || mode === "gold")
    layers.push(
      layer({
        index: index + 12,
        name: "Reaction Ring",
        opacity: fade(totalFrames, 16, totalFrames, 2, 8),
        position: [960, 530, 0],
        scale: reboundScaleFrames(totalFrames, 16, totalFrames, {
          startScale: heroMode ? 72 : 0,
          peakScale: heroMode ? 186 : 170,
          undershootScale: 102,
          settleScale: heroMode ? 126 : 118,
          exitScale: heroMode ? 136 : 128,
        }),
        shapes: [ringGroup(COLORS.white, heroMode ? 320 : 270, 14)],
        totalFrames,
      })
    );
  return animation(name, durationMs, layers);
}

function buildLeprechaunVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [];
  let index = 1;
  if (mode === "clover") ["-180", "0", "180"].forEach((offset, i) => layers.push(layer({ index: index++, name: `Clover ${i + 1}`, opacity: fade(totalFrames, i * 8, totalFrames, 2, 8), position: [960 + Number(offset), 480 + (i === 1 ? -60 : 30), 0], scale: pop(totalFrames, i * 8, totalFrames, 120, 100), rotation: spin(totalFrames, 0.6 + i * 0.2, 34 + i * 6), shapes: [cloverGroup()], totalFrames })));
  if (mode === "rainbow") { layers.push(layer({ index: index++, name: "Pot", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 716, 0], scale: pop(totalFrames, 0, totalFrames, 116, 100), shapes: [potGroup()], totalFrames })); layers.push(layer({ index: index++, name: "Rainbow", opacity: fade(totalFrames, 10, totalFrames, 3, 8), position: [960, 518, 0], scale: pop(totalFrames, 10, totalFrames, 122, 100), shapes: [rainbowGroup()], totalFrames })); }
  if (mode === "hat") { layers.push(layer({ index: index++, name: "Hat", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: move(totalFrames, [{ t: 0, value: [960, 300, 0] }, { t: 16, value: [960, 500, 0] }, { t: 32, value: [960, 460, 0] }, { t: totalFrames, value: [960, 480, 0] }]), scale: [ease(0, [70, 70, 100], [116, 116, 100]), ease(16, [116, 116, 100], [100, 100, 100]), hold(totalFrames, [100, 100, 100])], shapes: [hatGroup()], totalFrames })); layers.push(layer({ index: index++, name: "Hat Clover", opacity: fade(totalFrames, 16, totalFrames, 2, 8), position: [1110, 338, 0], scale: pop(totalFrames, 16, totalFrames, 108, 100), rotation: spin(totalFrames, 0.5, 32, 12), shapes: [cloverGroup()], totalFrames })); }
  if (mode === "coins") {
    layers.push(
      layer({
        index: index++,
        name: "Pot",
        opacity: 100,
        position: move(totalFrames, [
          { t: 0, value: [960, 792, 0] },
          { t: 14, value: [960, 694, 0] },
          { t: 24, value: [960, 724, 0] },
          { t: totalFrames, value: [960, 724, 0] },
        ]),
        scale: reboundScaleFrames(totalFrames, 0, totalFrames, {
          startScale: 76,
          peakScale: 132,
          undershootScale: 94,
          settleScale: 108,
          exitScale: 114,
        }),
        shapes: [potGroup()],
        totalFrames,
      })
    );
    layers.push(
      ...burstLayers(totalFrames, index, 18, [960, 700], [
        { shape: coinGroup(), target: [760, 390], turns: 1, peakScale: 146 },
        { shape: coinGroup(), target: [960, 240], turns: 0.8, peakScale: 156 },
        { shape: coinGroup(), target: [1160, 390], turns: 1, peakScale: 146 },
      ])
    );
    layers.push(
      ...burstLayers(totalFrames, index + 3, 24, [960, 700], [
        { shape: sparkleGroup(COLORS.gold, 60), target: [960, 438], turns: 0.3, peakScale: 154 },
        { shape: sparkleGroup(COLORS.white, 48), target: [820, 472], turns: -0.2, peakScale: 140 },
        { shape: sparkleGroup(COLORS.white, 48), target: [1100, 472], turns: 0.2, peakScale: 140 },
      ])
    );
    layers.push(
      layer({
        index: index + 8,
        name: "Lucky Ring",
        opacity: fade(totalFrames, 26, totalFrames, 2, 8),
        position: [960, 450, 0],
        scale: reboundScaleFrames(totalFrames, 26, totalFrames, {
          startScale: 72,
          peakScale: 168,
          undershootScale: 96,
          settleScale: 122,
          exitScale: 130,
        }),
        shapes: [ringGroup(COLORS.gold, 290, 12)],
        totalFrames,
      })
    );
  }
  return animation(name, durationMs, layers);
}

function buildFlowersVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [];
  let index = 1;
  if (mode === "bouquet") { layers.push(layer({ index: index++, name: "Bouquet", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 560, 0], scale: pop(totalFrames, 0, totalFrames, 118, 100), shapes: [bouquetGroup()], totalFrames })); layers.push(...burstLayers(totalFrames, index, 18, [960, 460], [{ shape: starGroup(COLORS.gold, 36, 14), target: [760, 260], turns: 0.7 }, { shape: starGroup(COLORS.orange, 32, 12), target: [910, 180], turns: 1 }, { shape: starGroup(COLORS.yellow, 32, 12), target: [1010, 180], turns: 1.1 }, { shape: starGroup(COLORS.gold, 36, 14), target: [1160, 260], turns: 0.8 }])); }
  if (mode === "petals") { layers.push(layer({ index: index++, name: "Base Flower", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 730, 0], scale: pop(totalFrames, 0, totalFrames, 102, 100), shapes: [flowerGroup()], totalFrames })); [["rose", 760], ["pink", 920], ["orange", 1030], ["yellow", 1160], ["teal", 860]].forEach(([tone, x], i) => layers.push(layer({ index: index++, name: `Petal ${i + 1}`, opacity: fade(totalFrames, 10 + i * 3, totalFrames, 2, 8), position: move(totalFrames, [{ t: 0, value: [x, 580, 0] }, { t: 20 + i * 3, value: [x + (i - 2) * 40, 320, 0] }, { t: 58 + i * 5, value: [x + (i - 2) * 70, 830, 0] }, { t: totalFrames, value: [x + (i - 2) * 80, 940, 0] }]), rotation: spin(totalFrames, 0.7 + i * 0.2, 80 + i * 6), scale: pop(totalFrames, 10 + i * 3, totalFrames, 102, 88), shapes: [group("Petal", [ellipse(0, 0, 84, 128), fill(COLORS[tone])])], totalFrames }))); }
  if (mode === "rose") { layers.push(layer({ index: index++, name: "Rose", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 540, 0], scale: [ease(0, [68, 68, 100], [116, 116, 100]), ease(22, [116, 116, 100], [100, 100, 100]), hold(totalFrames, [100, 100, 100])], rotation: spin(totalFrames, 1.4, 34), shapes: [roseGroup()], totalFrames })); layers.push(...burstLayers(totalFrames, index, 20, [960, 520], [{ shape: sparkleGroup(COLORS.white, 38), target: [780, 320], turns: 0.4 }, { shape: sparkleGroup(COLORS.gold, 34), target: [960, 220], turns: 0.3 }, { shape: sparkleGroup(COLORS.white, 38), target: [1140, 320], turns: -0.4 }])); }
  if (mode === "wave") [420, 740, 1080, 1420].forEach((x, i) => layers.push(layer({ index: index++, name: `Spring Flower ${i + 1}`, opacity: fade(totalFrames, i * 6, totalFrames, 2, 8), position: move(totalFrames, [{ t: 0, value: [x - 200, 660 + (i % 2) * 80, 0] }, { t: 24 + i * 4, value: [x, 520 - (i % 2) * 60, 0] }, { t: 48 + i * 4, value: [x + 120, 620 + (i % 2) * 80, 0] }, { t: totalFrames, value: [x + 160, 560, 0] }]), scale: pop(totalFrames, i * 6, totalFrames, 98, 82), rotation: [ease(0, -12, 10), ease(32 + i * 4, 10, -8), ease(62 + i * 4, -8, 0), hold(totalFrames, 0)], shapes: [flowerGroup()], totalFrames })));
  return animation(name, durationMs, layers);
}

function buildBirthdayVariant(name, durationMs, mode) {
  const totalFrames = frames(durationMs);
  const layers = [layer({ index: 1, name: "Cake", opacity: fade(totalFrames, 0, totalFrames, 2, 8), position: [960, 600, 0], scale: pop(totalFrames, 0, totalFrames, 116, 100), shapes: [cakeGroup(mode !== "candles")], totalFrames })];
  let index = 2;
  if (mode === "title") { layers.push(layer({ index: index++, name: "Happy", opacity: fade(totalFrames, 20, totalFrames, 2, 8), position: [960, 230, 0], scale: pop(totalFrames, 20, totalFrames, 116, 100), shapes: [textGroup("HAPPY", COLORS.white, 20)], totalFrames })); layers.push(layer({ index: index++, name: "Birthday", opacity: fade(totalFrames, 34, totalFrames, 2, 8), position: [960, 314, 0], scale: pop(totalFrames, 34, totalFrames, 112, 100), shapes: [textGroup("BIRTHDAY", COLORS.gold, 16)], totalFrames })); }
  if (mode === "candles") {
    layers[0] = {
      ...layers[0],
      ks: {
        ...layers[0].ks,
        o: { a: 0, k: 100 },
        p: { a: 1, k: move(totalFrames, [{ t: 0, value: [960, 704, 0] }, { t: 16, value: [960, 570, 0] }, { t: 26, value: [960, 600, 0] }, { t: totalFrames, value: [960, 600, 0] }]) },
        s: { a: 1, k: reboundScaleFrames(totalFrames, 0, totalFrames, { startScale: 80, peakScale: 130, undershootScale: 94, settleScale: 108, exitScale: 116 }) },
      },
    };
    layers.push(layer({ index: index++, name: "Flames", opacity: fade(totalFrames, 14, totalFrames, 2, 8), position: [960, 600, 0], scale: reboundScaleFrames(totalFrames, 14, totalFrames, { startScale: 76, peakScale: 124, undershootScale: 96, settleScale: 110, exitScale: 118 }), shapes: [flameGroup()], totalFrames }));
    layers.push(layer({ index: index++, name: "Title Ring", opacity: fade(totalFrames, 32, totalFrames, 2, 8), position: [960, 270, 0], scale: reboundScaleFrames(totalFrames, 32, totalFrames, { startScale: 74, peakScale: 172, undershootScale: 98, settleScale: 122, exitScale: 130 }), shapes: [ringGroup(COLORS.white, 320, 12)], totalFrames }));
    layers.push(layer({ index: index++, name: "Happy", opacity: fade(totalFrames, 34, totalFrames, 2, 8), position: verticalBounceFrames(totalFrames, 34, totalFrames, { startY: 182, overshootY: 210, settleY: 226, exitY: 208 }), scale: reboundScaleFrames(totalFrames, 34, totalFrames, { startScale: 74, peakScale: 126, undershootScale: 96, settleScale: 104, exitScale: 112 }), shapes: [textGroup("HAPPY", COLORS.white, 20)], totalFrames }));
    layers.push(layer({ index: index++, name: "Birthday", opacity: fade(totalFrames, 42, totalFrames, 2, 8), position: verticalBounceFrames(totalFrames, 42, totalFrames, { startY: 250, overshootY: 284, settleY: 300, exitY: 282 }), scale: reboundScaleFrames(totalFrames, 42, totalFrames, { startScale: 74, peakScale: 120, undershootScale: 96, settleScale: 104, exitScale: 110 }), shapes: [textGroup("BIRTHDAY", COLORS.gold, 17)], totalFrames }));
  }
  layers.push(...burstLayers(totalFrames, index, mode === "title" ? 34 : 42, [960, 320], [{ shape: sparkleGroup(COLORS.white, 40), target: [760, 220], turns: 0.5 }, { shape: sparkleGroup(COLORS.gold, 34), target: [860, 140], turns: 0.3 }, { shape: sparkleGroup(COLORS.white, 34), target: [1060, 140], turns: -0.3 }, { shape: sparkleGroup(COLORS.gold, 40), target: [1160, 220], turns: -0.5 }]));
  return animation(name, durationMs, layers);
}

function buildFireworkNumber(name, number, color) {
  const durationMs = 2800;
  const totalFrames = frames(durationMs);
  const layers = [layer({ index: 1, name: "Rocket Trail", opacity: fade(totalFrames, 4, 38, 1, 6), position: move(totalFrames, [{ t: 0, value: [960, 930, 0] }, { t: 4, value: [960, 930, 0] }, { t: 38, value: [960, 280, 0] }, { t: totalFrames, value: [960, 280, 0] }]), scale: [hold(0, [100, 0, 100]), ease(4, [100, 0, 100], [100, 100, 100]), hold(totalFrames, [100, 100, 100])], shapes: [group("Trail", [rect(0, 0, 22, 280, 10), fill(color)])], totalFrames }), layer({ index: 2, name: `Number ${number}`, opacity: fade(totalFrames, 34, totalFrames, 3, 8), position: [960, 520, 0], scale: pop(totalFrames, 34, totalFrames, 126, 100), shapes: [textGroup(String(number), COLORS.white, 82)], totalFrames })];
  layers.push(...burstLayers(totalFrames, 3, 34, [960, 320], [{ shape: starGroup(color, 56, 22), target: [720, 200], turns: 0.9 }, { shape: starGroup(COLORS.gold, 44, 16), target: [860, 120], turns: 1.1 }, { shape: starGroup(COLORS.white, 42, 14), target: [960, 80], turns: 0.7 }, { shape: starGroup(COLORS.gold, 44, 16), target: [1060, 120], turns: 1.1 }, { shape: starGroup(color, 56, 22), target: [1200, 200], turns: 0.9 }, { shape: sparkleGroup(COLORS.white, 44), target: [780, 360], turns: 0.4 }, { shape: sparkleGroup(COLORS.white, 44), target: [1140, 360], turns: -0.4 }]));
  return animation(name, durationMs, layers);
}

export const EFFECT_BATCH_1_SPECS = Object.freeze([
  { id: "countdown-simple-pop-effect-wink", builder: () => buildCountdownVariant("Countdown Simple Pop", 3000, "pop") },
  { id: "countdown-simple-confetti-effect-wink", builder: () => buildCountdownVariant("Countdown Simple Confetti", 3200, "confetti") },
  { id: "countdown-simple-gold-burst-effect-wink", builder: () => buildCountdownVariant("Countdown Simple Gold Burst", 3000, "gold") },
  { id: "countdown-bingo-letter-pop-effect-wink", builder: buildCountdownBingoLetterPop },
  { id: "thumbs-up-bounce", builder: () => buildThumbVariant("Thumbs Up Bounce", 2800, "bounce") },
  { id: "thumbs-up-confetti", builder: () => buildThumbVariant("Thumbs Up Confetti", 3200, "confetti") },
  { id: "thumbs-up-gold-burst", builder: () => buildThumbVariant("Thumbs Up Gold Burst", 3000, "gold") },
  { id: "thumbs-up-sparkle", builder: () => buildThumbVariant("Thumbs Up Sparkle", 2800, "sparkle") },
  { id: "leprechaun-lucky-clover", builder: () => buildLeprechaunVariant("Leprechaun Lucky Clover", 3000, "clover") },
  { id: "leprechaun-rainbow-pop", builder: () => buildLeprechaunVariant("Leprechaun Rainbow Pop", 3200, "rainbow") },
  { id: "leprechaun-hat-bounce", builder: () => buildLeprechaunVariant("Leprechaun Hat Bounce", 2800, "hat") },
  { id: "leprechaun-gold-coins", builder: () => buildLeprechaunVariant("Leprechaun Gold Coins", 3200, "coins") },
  { id: "flowers-bouquet-burst", builder: () => buildFlowersVariant("Flowers Bouquet Burst", 3200, "bouquet") },
  { id: "flowers-petal-rain", builder: () => buildFlowersVariant("Flowers Petal Rain", 3200, "petals") },
  { id: "flowers-rose-spin", builder: () => buildFlowersVariant("Flowers Rose Spin", 3000, "rose") },
  { id: "flowers-spring-wave", builder: () => buildFlowersVariant("Flowers Spring Wave", 3200, "wave") },
  { id: "happy-birthday-bounce-title-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Bounce Title", 3100, "title") },
  { id: "happy-birthday-candle-light-effect-wink", builder: () => buildBirthdayVariant("Happy Birthday Candle Light", 3200, "candles") },
  { id: "fireworks-number-1-effect-wink", builder: () => buildFireworkNumber("Fireworks Number One", 1, COLORS.rose) },
  { id: "fireworks-number-2-effect-wink", builder: () => buildFireworkNumber("Fireworks Number Two", 2, COLORS.blue) },
]);

export const EFFECT_BATCH_1_LOTTIE_REGISTRY = Object.freeze(
  Object.fromEntries(EFFECT_BATCH_1_SPECS.map((spec) => [spec.id, `/lottie/effect-winks/${spec.id}.json`]))
);

export async function generateEffectWinksBatch1() {
  await writeLottieFiles(EFFECT_BATCH_1_SPECS);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  await generateEffectWinksBatch1();
}
