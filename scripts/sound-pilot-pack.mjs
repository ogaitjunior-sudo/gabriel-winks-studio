import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PROJECT_ROOT } from "./wink-config.mjs";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");

const SAMPLE_RATE = 44_100;
const SOUND_ROOT = path.join(PROJECT_ROOT, "public", "sounds");
const TWO_PI = Math.PI * 2;

const NOTE = Object.freeze({
  C2: 65.41,
  G2: 98,
  A2: 110,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196,
  A3: 220,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
  F6: 1396.91,
  G6: 1567.98,
  A6: 1760,
  B6: 1975.53,
  C7: 2093,
  D7: 2349.32,
  E7: 2637.02,
  G7: 3135.96,
  A7: 3520,
});

const CUE_SOUND_SPECS = Object.freeze([
  {
    durationMs: 320,
    events: [
      {
        attackMs: 2,
        curvePower: 0.45,
        durationMs: 105,
        freq: NOTE.C3,
        glideToFreq: NOTE.G2,
        releaseMs: 145,
        startMs: 0,
        type: "tone",
        volume: 0.32,
        volumeCurve: "decay",
        wave: "sine",
      },
      {
        attackMs: 1,
        durationMs: 145,
        freq: NOTE.G5,
        glideToFreq: NOTE.C6,
        pitchCurve: 0.55,
        releaseMs: 85,
        startMs: 10,
        type: "tone",
        volume: 0.2,
        wave: "triangle",
      },
      {
        attackMs: 0,
        color: "bright",
        durationMs: 90,
        releaseMs: 70,
        startMs: 4,
        type: "noise",
        volume: 0.1,
      },
      {
        attackMs: 4,
        durationMs: 180,
        freq: NOTE.D7,
        releaseMs: 150,
        startMs: 82,
        type: "tone",
        volume: 0.045,
        wave: "sine",
      },
    ],
    fileName: "pop.mp3",
    seed: 101,
  },
  {
    durationMs: 560,
    events: [
      {
        attackMs: 18,
        color: "air",
        durationMs: 470,
        releaseMs: 170,
        startMs: 0,
        tremoloDepth: 0.18,
        tremoloHz: 13,
        type: "noise",
        volume: 0.14,
        volumeCurve: "swell",
      },
      {
        attackMs: 16,
        durationMs: 430,
        freq: NOTE.A2,
        glideToFreq: NOTE.A5,
        pitchCurve: 1.75,
        releaseMs: 120,
        startMs: 18,
        type: "tone",
        volume: 0.065,
        volumeCurve: "swell",
        wave: "saw",
      },
      {
        attackMs: 6,
        durationMs: 220,
        freq: NOTE.E5,
        glideToFreq: NOTE.C7,
        pitchCurve: 1.35,
        releaseMs: 125,
        startMs: 255,
        type: "tone",
        volume: 0.055,
        wave: "triangle",
      },
    ],
    fileName: "whoosh.mp3",
    seed: 103,
  },
  {
    durationMs: 820,
    events: [
      {
        attackMs: 0,
        curvePower: 0.5,
        durationMs: 430,
        freq: NOTE.C3,
        glideToFreq: NOTE.C2,
        pitchCurve: 1.8,
        releaseMs: 360,
        startMs: 0,
        type: "tone",
        volume: 0.42,
        volumeCurve: "decay",
        wave: "sine",
      },
      {
        attackMs: 2,
        color: "bright",
        durationMs: 135,
        releaseMs: 110,
        startMs: 8,
        type: "noise",
        volume: 0.2,
      },
      {
        attackMs: 12,
        color: "rumble",
        durationMs: 660,
        releaseMs: 520,
        startMs: 34,
        type: "noise",
        volume: 0.18,
      },
      {
        attackMs: 6,
        durationMs: 360,
        freq: NOTE.G3,
        glideToFreq: NOTE.D3,
        releaseMs: 310,
        startMs: 34,
        type: "tone",
        volume: 0.12,
        wave: "triangle",
      },
    ],
    fileName: "boom.mp3",
    seed: 107,
  },
  {
    durationMs: 760,
    events: [
      {
        attackMs: 2,
        durationMs: 700,
        freq: NOTE.C6,
        harmonics: [
          { multiple: 1, volume: 1 },
          { multiple: 2.01, volume: 0.42 },
          { multiple: 3.02, volume: 0.18 },
        ],
        releaseMs: 660,
        startMs: 0,
        type: "tone",
        volume: 0.13,
        wave: "sine",
      },
      {
        attackMs: 2,
        durationMs: 620,
        freq: NOTE.E6,
        harmonics: [
          { multiple: 1, volume: 1 },
          { multiple: 2.02, volume: 0.28 },
        ],
        releaseMs: 560,
        startMs: 72,
        type: "tone",
        volume: 0.1,
        wave: "sine",
      },
      {
        attackMs: 2,
        durationMs: 520,
        freq: NOTE.G6,
        releaseMs: 480,
        startMs: 148,
        type: "tone",
        volume: 0.065,
        wave: "triangle",
      },
    ],
    fileName: "chime.mp3",
    seed: 109,
  },
  {
    durationMs: 650,
    events: [
      {
        attackMs: 2,
        durationMs: 260,
        freq: NOTE.G6,
        releaseMs: 230,
        startMs: 0,
        type: "tone",
        volume: 0.07,
        wave: "sine",
      },
      {
        attackMs: 2,
        durationMs: 300,
        freq: NOTE.C7,
        releaseMs: 270,
        startMs: 88,
        type: "tone",
        volume: 0.08,
        wave: "triangle",
      },
      {
        attackMs: 2,
        durationMs: 320,
        freq: NOTE.E7,
        releaseMs: 295,
        startMs: 190,
        type: "tone",
        volume: 0.065,
        wave: "sine",
      },
      {
        attackMs: 8,
        color: "crystal",
        durationMs: 420,
        releaseMs: 230,
        startMs: 55,
        tremoloDepth: 0.25,
        tremoloHz: 18,
        type: "noise",
        volume: 0.045,
      },
    ],
    fileName: "sparkle.mp3",
    seed: 113,
  },
  {
    durationMs: 360,
    events: [
      {
        attackMs: 1,
        curvePower: 0.5,
        durationMs: 190,
        freq: NOTE.G3,
        glideToFreq: NOTE.A2,
        pitchCurve: 1.6,
        releaseMs: 145,
        startMs: 0,
        type: "tone",
        volume: 0.28,
        volumeCurve: "decay",
        wave: "sine",
      },
      {
        attackMs: 4,
        durationMs: 205,
        freq: NOTE.C5,
        glideToFreq: NOTE.G5,
        pitchCurve: 0.65,
        releaseMs: 140,
        startMs: 38,
        type: "tone",
        volume: 0.13,
        wave: "triangle",
      },
      {
        attackMs: 1,
        color: "grain",
        durationMs: 85,
        releaseMs: 55,
        startMs: 8,
        type: "noise",
        volume: 0.07,
      },
    ],
    fileName: "bounce.mp3",
    seed: 127,
  },
  {
    durationMs: 980,
    events: [
      {
        attackMs: 4,
        color: "applause",
        durationMs: 820,
        releaseMs: 450,
        startMs: 40,
        tremoloDepth: 0.22,
        tremoloHz: 9,
        type: "noise",
        volume: 0.13,
      },
      {
        attackMs: 3,
        durationMs: 260,
        freq: NOTE.C5,
        releaseMs: 190,
        startMs: 0,
        type: "tone",
        volume: 0.12,
        wave: "triangle",
      },
      {
        attackMs: 3,
        durationMs: 300,
        freq: NOTE.E5,
        releaseMs: 220,
        startMs: 135,
        type: "tone",
        volume: 0.13,
        wave: "triangle",
      },
      {
        attackMs: 3,
        durationMs: 390,
        freq: NOTE.G5,
        releaseMs: 310,
        startMs: 270,
        type: "tone",
        volume: 0.14,
        wave: "triangle",
      },
      {
        attackMs: 2,
        durationMs: 520,
        freq: NOTE.C6,
        releaseMs: 430,
        startMs: 410,
        type: "tone",
        volume: 0.09,
        wave: "sine",
      },
    ],
    fileName: "cheer.mp3",
    seed: 131,
  },
  {
    durationMs: 720,
    events: [
      {
        attackMs: 8,
        color: "soft",
        durationMs: 620,
        releaseMs: 310,
        startMs: 0,
        tremoloDepth: 0.55,
        tremoloHz: 19,
        type: "noise",
        volume: 0.07,
      },
      {
        attackMs: 8,
        durationMs: 280,
        freq: NOTE.A5,
        glideToFreq: NOTE.E6,
        pitchCurve: 0.8,
        releaseMs: 180,
        startMs: 55,
        tremoloDepth: 0.2,
        tremoloHz: 11,
        type: "tone",
        volume: 0.055,
        wave: "triangle",
      },
      {
        attackMs: 8,
        durationMs: 340,
        freq: NOTE.D6,
        glideToFreq: NOTE.A5,
        releaseMs: 260,
        startMs: 260,
        tremoloDepth: 0.28,
        tremoloHz: 13,
        type: "tone",
        volume: 0.045,
        wave: "sine",
      },
    ],
    fileName: "flutter.mp3",
    seed: 137,
  },
  {
    durationMs: 180,
    events: [
      {
        attackMs: 0,
        curvePower: 0.28,
        durationMs: 72,
        freq: NOTE.A6,
        glideToFreq: NOTE.C6,
        releaseMs: 58,
        startMs: 0,
        type: "tone",
        volume: 0.16,
        volumeCurve: "decay",
        wave: "square",
      },
      {
        attackMs: 0,
        color: "bright",
        durationMs: 55,
        releaseMs: 42,
        startMs: 0,
        type: "noise",
        volume: 0.075,
      },
      {
        attackMs: 0,
        curvePower: 0.6,
        durationMs: 88,
        freq: NOTE.C4,
        glideToFreq: NOTE.A3,
        releaseMs: 72,
        startMs: 12,
        type: "tone",
        volume: 0.09,
        volumeCurve: "decay",
        wave: "triangle",
      },
    ],
    fileName: "click.mp3",
    seed: 139,
  },
]);

const PILOT_SOUND_TRACK_SPECS = Object.freeze([
  {
    durationMs: 2350,
    events: [
      { durationMs: 120, freq: NOTE.C5, glideToFreq: NOTE.G4, type: "tone", volume: 0.2, wave: "triangle", startMs: 0, attackMs: 1, releaseMs: 80 },
      { durationMs: 80, type: "noise", volume: 0.065, startMs: 12, color: "grain", attackMs: 0, releaseMs: 55 },
      { durationMs: 120, freq: NOTE.B4, glideToFreq: NOTE.F4, type: "tone", volume: 0.2, wave: "triangle", startMs: 580, attackMs: 1, releaseMs: 80 },
      { durationMs: 80, type: "noise", volume: 0.065, startMs: 592, color: "grain", attackMs: 0, releaseMs: 55 },
      { durationMs: 120, freq: NOTE.A4, glideToFreq: NOTE.E4, type: "tone", volume: 0.2, wave: "triangle", startMs: 1160, attackMs: 1, releaseMs: 80 },
      { durationMs: 80, type: "noise", volume: 0.065, startMs: 1172, color: "grain", attackMs: 0, releaseMs: 55 },
      { durationMs: 420, freq: NOTE.G3, glideToFreq: NOTE.C5, type: "tone", volume: 0.13, wave: "saw", startMs: 1450, attackMs: 12, releaseMs: 170, pitchCurve: 1.4, volumeCurve: "swell" },
      { durationMs: 610, type: "noise", volume: 0.1, startMs: 1500, color: "applause", attackMs: 5, releaseMs: 420 },
      { durationMs: 560, freq: NOTE.C5, type: "tone", volume: 0.13, wave: "triangle", startMs: 1700, attackMs: 2, releaseMs: 470 },
      { durationMs: 540, freq: NOTE.E5, type: "tone", volume: 0.12, wave: "triangle", startMs: 1780, attackMs: 2, releaseMs: 460 },
      { durationMs: 520, freq: NOTE.G5, type: "tone", volume: 0.11, wave: "triangle", startMs: 1860, attackMs: 2, releaseMs: 440 },
      { durationMs: 420, freq: NOTE.C6, type: "tone", volume: 0.07, wave: "sine", startMs: 1980, attackMs: 2, releaseMs: 360 },
    ],
    fileName: "countdown-pop.mp3",
    id: "countdown-bingo-ball-letters-effect-wink",
    seed: 11,
  },
  {
    durationMs: 2150,
    events: [
      { durationMs: 115, freq: NOTE.A5, glideToFreq: NOTE.E5, type: "tone", volume: 0.17, wave: "square", startMs: 0, attackMs: 0, releaseMs: 70, volumeCurve: "decay" },
      { durationMs: 115, freq: NOTE.G5, glideToFreq: NOTE.D5, type: "tone", volume: 0.17, wave: "square", startMs: 540, attackMs: 0, releaseMs: 70, volumeCurve: "decay" },
      { durationMs: 115, freq: NOTE.F5, glideToFreq: NOTE.C5, type: "tone", volume: 0.17, wave: "square", startMs: 1080, attackMs: 0, releaseMs: 70, volumeCurve: "decay" },
      { durationMs: 260, type: "noise", volume: 0.14, startMs: 1430, color: "bright", attackMs: 1, releaseMs: 150 },
      { durationMs: 420, freq: NOTE.C4, glideToFreq: NOTE.C6, type: "tone", volume: 0.11, wave: "saw", startMs: 1410, attackMs: 8, releaseMs: 190, pitchCurve: 1.65, volumeCurve: "swell" },
      { durationMs: 430, freq: NOTE.C6, type: "tone", volume: 0.09, wave: "triangle", startMs: 1690, attackMs: 3, releaseMs: 340 },
      { durationMs: 390, freq: NOTE.E6, type: "tone", volume: 0.07, wave: "sine", startMs: 1780, attackMs: 3, releaseMs: 310 },
    ],
    fileName: "countdown-beep.mp3",
    id: "countdown-simple-party-effect-wink",
    seed: 13,
  },
  {
    durationMs: 1900,
    events: [
      { durationMs: 520, type: "noise", volume: 0.07, startMs: 0, color: "grain", attackMs: 8, releaseMs: 220, tremoloDepth: 0.35, tremoloHz: 23 },
      { durationMs: 380, freq: NOTE.G2, glideToFreq: NOTE.D3, type: "tone", volume: 0.11, wave: "sine", startMs: 0, attackMs: 4, releaseMs: 240 },
      { durationMs: 150, freq: NOTE.G4, glideToFreq: NOTE.B4, type: "tone", volume: 0.17, wave: "triangle", startMs: 520, attackMs: 1, releaseMs: 100 },
      { durationMs: 120, type: "noise", volume: 0.12, startMs: 532, color: "bright", attackMs: 1, releaseMs: 90 },
      { durationMs: 240, freq: NOTE.C3, glideToFreq: NOTE.A2, type: "tone", volume: 0.25, wave: "sine", startMs: 650, attackMs: 0, releaseMs: 210, volumeCurve: "decay" },
      { durationMs: 430, freq: NOTE.C5, type: "tone", volume: 0.1, wave: "triangle", startMs: 910, attackMs: 3, releaseMs: 300 },
      { durationMs: 440, freq: NOTE.E5, type: "tone", volume: 0.095, wave: "triangle", startMs: 1020, attackMs: 3, releaseMs: 320 },
      { durationMs: 460, freq: NOTE.G5, type: "tone", volume: 0.09, wave: "triangle", startMs: 1130, attackMs: 3, releaseMs: 340 },
      { durationMs: 580, type: "noise", volume: 0.085, startMs: 1120, color: "applause", attackMs: 6, releaseMs: 380 },
    ],
    fileName: "bingo-pop.mp3",
    id: "bb-collision",
    seed: 17,
  },
  {
    durationMs: 2550,
    events: [
      { durationMs: 1180, type: "noise", volume: 0.085, startMs: 0, color: "grain", attackMs: 8, releaseMs: 330, tremoloDepth: 0.42, tremoloHz: 28 },
      { durationMs: 1180, freq: NOTE.C3, glideToFreq: NOTE.C6, type: "tone", volume: 0.09, wave: "saw", startMs: 0, attackMs: 15, releaseMs: 250, pitchCurve: 1.55, volumeCurve: "swell" },
      { durationMs: 80, freq: NOTE.C6, type: "tone", volume: 0.1, wave: "square", startMs: 235, attackMs: 0, releaseMs: 55, volumeCurve: "decay" },
      { durationMs: 80, freq: NOTE.D6, type: "tone", volume: 0.1, wave: "square", startMs: 410, attackMs: 0, releaseMs: 55, volumeCurve: "decay" },
      { durationMs: 80, freq: NOTE.E6, type: "tone", volume: 0.1, wave: "square", startMs: 575, attackMs: 0, releaseMs: 55, volumeCurve: "decay" },
      { durationMs: 80, freq: NOTE.G6, type: "tone", volume: 0.1, wave: "square", startMs: 735, attackMs: 0, releaseMs: 55, volumeCurve: "decay" },
      { durationMs: 120, type: "noise", volume: 0.13, startMs: 1210, color: "bright", attackMs: 0, releaseMs: 90 },
      { durationMs: 700, freq: NOTE.C5, type: "tone", volume: 0.13, wave: "triangle", startMs: 1260, attackMs: 2, releaseMs: 560 },
      { durationMs: 680, freq: NOTE.E5, type: "tone", volume: 0.12, wave: "triangle", startMs: 1380, attackMs: 2, releaseMs: 540 },
      { durationMs: 690, freq: NOTE.G5, type: "tone", volume: 0.12, wave: "triangle", startMs: 1500, attackMs: 2, releaseMs: 560 },
      { durationMs: 760, type: "noise", volume: 0.075, startMs: 1480, color: "coin", attackMs: 4, releaseMs: 500, tremoloDepth: 0.3, tremoloHz: 17 },
      { durationMs: 520, freq: NOTE.C6, type: "tone", volume: 0.08, wave: "sine", startMs: 1760, attackMs: 2, releaseMs: 430 },
    ],
    fileName: "jackpot-spin.mp3",
    id: "bouncing-bingo-jackpot",
    seed: 19,
  },
  {
    durationMs: 2350,
    events: [
      { durationMs: 820, type: "noise", volume: 0.12, startMs: 0, color: "air", attackMs: 18, releaseMs: 260, volumeCurve: "swell" },
      { durationMs: 780, freq: NOTE.C3, glideToFreq: NOTE.G6, type: "tone", volume: 0.07, wave: "saw", startMs: 0, attackMs: 14, releaseMs: 180, pitchCurve: 1.8, volumeCurve: "swell" },
      { durationMs: 430, freq: NOTE.C3, glideToFreq: NOTE.C2, type: "tone", volume: 0.42, wave: "sine", startMs: 840, attackMs: 0, releaseMs: 360, pitchCurve: 1.7, volumeCurve: "decay" },
      { durationMs: 170, type: "noise", volume: 0.23, startMs: 850, color: "bright", attackMs: 0, releaseMs: 130 },
      { durationMs: 760, type: "noise", volume: 0.16, startMs: 920, color: "rumble", attackMs: 10, releaseMs: 620 },
      { durationMs: 360, freq: NOTE.G6, type: "tone", volume: 0.06, wave: "sine", startMs: 1220, attackMs: 2, releaseMs: 310 },
      { durationMs: 390, freq: NOTE.C7, type: "tone", volume: 0.055, wave: "sine", startMs: 1360, attackMs: 2, releaseMs: 330 },
      { durationMs: 460, freq: NOTE.E7, type: "tone", volume: 0.05, wave: "sine", startMs: 1530, attackMs: 2, releaseMs: 380 },
      { durationMs: 620, type: "noise", volume: 0.045, startMs: 1350, color: "crystal", attackMs: 4, releaseMs: 360 },
    ],
    fileName: "fireworks-boom.mp3",
    id: "fireworks-final-bingo-countdown-effect-wink",
    seed: 23,
  },
  {
    durationMs: 1950,
    events: [
      { durationMs: 210, type: "noise", volume: 0.17, startMs: 0, color: "bright", attackMs: 0, releaseMs: 140 },
      { durationMs: 210, freq: NOTE.G4, glideToFreq: NOTE.C5, type: "tone", volume: 0.13, wave: "triangle", startMs: 28, attackMs: 1, releaseMs: 140 },
      { durationMs: 260, type: "noise", volume: 0.15, startMs: 310, color: "bright", attackMs: 0, releaseMs: 170 },
      { durationMs: 250, freq: NOTE.A4, glideToFreq: NOTE.E5, type: "tone", volume: 0.12, wave: "triangle", startMs: 345, attackMs: 1, releaseMs: 170 },
      { durationMs: 900, type: "noise", volume: 0.09, startMs: 520, color: "confetti", attackMs: 10, releaseMs: 530, tremoloDepth: 0.22, tremoloHz: 14 },
      { durationMs: 460, freq: NOTE.C5, type: "tone", volume: 0.1, wave: "triangle", startMs: 700, attackMs: 2, releaseMs: 340 },
      { durationMs: 470, freq: NOTE.E5, type: "tone", volume: 0.09, wave: "triangle", startMs: 820, attackMs: 2, releaseMs: 350 },
      { durationMs: 520, freq: NOTE.G5, type: "tone", volume: 0.09, wave: "triangle", startMs: 965, attackMs: 2, releaseMs: 400 },
      { durationMs: 420, freq: NOTE.C6, type: "tone", volume: 0.055, wave: "sine", startMs: 1190, attackMs: 2, releaseMs: 330 },
    ],
    fileName: "confetti-burst.mp3",
    id: "cf-cannon",
    seed: 29,
  },
  {
    durationMs: 2250,
    events: [
      { durationMs: 760, freq: NOTE.C6, type: "tone", volume: 0.09, wave: "sine", startMs: 0, attackMs: 2, releaseMs: 690, harmonics: [{ multiple: 1, volume: 1 }, { multiple: 2.01, volume: 0.38 }] },
      { durationMs: 710, freq: NOTE.E6, type: "tone", volume: 0.085, wave: "sine", startMs: 180, attackMs: 2, releaseMs: 650, harmonics: [{ multiple: 1, volume: 1 }, { multiple: 2.02, volume: 0.25 }] },
      { durationMs: 780, freq: NOTE.G6, type: "tone", volume: 0.08, wave: "triangle", startMs: 365, attackMs: 2, releaseMs: 700 },
      { durationMs: 620, freq: NOTE.C7, type: "tone", volume: 0.06, wave: "sine", startMs: 625, attackMs: 2, releaseMs: 530 },
      { durationMs: 980, type: "noise", volume: 0.05, startMs: 480, color: "crystal", attackMs: 10, releaseMs: 560, tremoloDepth: 0.28, tremoloHz: 18 },
      { durationMs: 640, freq: NOTE.E7, type: "tone", volume: 0.048, wave: "sine", startMs: 1100, attackMs: 2, releaseMs: 570 },
      { durationMs: 520, freq: NOTE.G7, type: "tone", volume: 0.035, wave: "sine", startMs: 1500, attackMs: 2, releaseMs: 450 },
    ],
    fileName: "sparkle-chime.mp3",
    id: "gs-burst",
    seed: 31,
  },
  {
    durationMs: 2300,
    events: [
      { durationMs: 260, freq: NOTE.C5, type: "tone", volume: 0.11, wave: "triangle", startMs: 0, attackMs: 3, releaseMs: 190 },
      { durationMs: 260, freq: NOTE.C5, type: "tone", volume: 0.095, wave: "triangle", startMs: 245, attackMs: 3, releaseMs: 190 },
      { durationMs: 360, freq: NOTE.D5, type: "tone", volume: 0.11, wave: "triangle", startMs: 490, attackMs: 3, releaseMs: 280 },
      { durationMs: 380, freq: NOTE.C5, type: "tone", volume: 0.1, wave: "triangle", startMs: 830, attackMs: 3, releaseMs: 300 },
      { durationMs: 450, freq: NOTE.F5, type: "tone", volume: 0.1, wave: "triangle", startMs: 1120, attackMs: 3, releaseMs: 360 },
      { durationMs: 470, freq: NOTE.E5, type: "tone", volume: 0.095, wave: "triangle", startMs: 1420, attackMs: 3, releaseMs: 380 },
      { durationMs: 180, type: "noise", volume: 0.14, startMs: 1560, color: "bright", attackMs: 0, releaseMs: 115 },
      { durationMs: 420, type: "noise", volume: 0.07, startMs: 1670, color: "confetti", attackMs: 4, releaseMs: 290 },
      { durationMs: 420, freq: NOTE.C6, type: "tone", volume: 0.06, wave: "sine", startMs: 1710, attackMs: 2, releaseMs: 340 },
      { durationMs: 360, freq: NOTE.E6, type: "tone", volume: 0.045, wave: "sine", startMs: 1880, attackMs: 2, releaseMs: 280 },
    ],
    fileName: "birthday-pop.mp3",
    id: "happy-birthday-cake-pop-effect-wink",
    seed: 37,
  },
  {
    durationMs: 1650,
    events: [
      { durationMs: 90, freq: NOTE.C4, glideToFreq: NOTE.G3, type: "tone", volume: 0.19, wave: "triangle", startMs: 0, attackMs: 0, releaseMs: 70, volumeCurve: "decay" },
      { durationMs: 80, type: "noise", volume: 0.09, startMs: 4, color: "grain", attackMs: 0, releaseMs: 54 },
      { durationMs: 300, freq: NOTE.G5, type: "tone", volume: 0.11, wave: "triangle", startMs: 130, attackMs: 2, releaseMs: 210 },
      { durationMs: 360, freq: NOTE.C6, type: "tone", volume: 0.105, wave: "sine", startMs: 260, attackMs: 2, releaseMs: 270 },
      { durationMs: 420, type: "noise", volume: 0.07, startMs: 360, color: "confetti", attackMs: 4, releaseMs: 280 },
      { durationMs: 420, freq: NOTE.E6, type: "tone", volume: 0.055, wave: "sine", startMs: 590, attackMs: 2, releaseMs: 330 },
      { durationMs: 360, freq: NOTE.G6, type: "tone", volume: 0.04, wave: "sine", startMs: 850, attackMs: 2, releaseMs: 280 },
    ],
    fileName: "thumbs-up-pop.mp3",
    id: "thumbs-up-pop",
    seed: 41,
  },
  {
    durationMs: 2450,
    events: [
      { durationMs: 920, type: "noise", volume: 0.045, startMs: 0, color: "soft", attackMs: 30, releaseMs: 520, tremoloDepth: 0.3, tremoloHz: 7 },
      { durationMs: 900, freq: NOTE.G4, type: "tone", volume: 0.065, wave: "sine", startMs: 0, attackMs: 24, releaseMs: 680 },
      { durationMs: 850, freq: NOTE.C5, type: "tone", volume: 0.07, wave: "sine", startMs: 190, attackMs: 22, releaseMs: 660 },
      { durationMs: 780, freq: NOTE.E5, type: "tone", volume: 0.055, wave: "triangle", startMs: 420, attackMs: 18, releaseMs: 600 },
      { durationMs: 260, type: "noise", volume: 0.08, startMs: 850, color: "soft", attackMs: 6, releaseMs: 180 },
      { durationMs: 760, freq: NOTE.G5, type: "tone", volume: 0.055, wave: "sine", startMs: 960, attackMs: 8, releaseMs: 580 },
      { durationMs: 680, freq: NOTE.C6, type: "tone", volume: 0.048, wave: "sine", startMs: 1220, attackMs: 7, releaseMs: 520 },
      { durationMs: 640, type: "noise", volume: 0.035, startMs: 1370, color: "crystal", attackMs: 8, releaseMs: 360 },
    ],
    fileName: "soft-bloom.mp3",
    id: "flowers-bloom-pop",
    seed: 43,
  },
  {
    durationMs: 2200,
    events: [
      { durationMs: 420, type: "noise", volume: 0.08, startMs: 0, color: "coin", attackMs: 4, releaseMs: 260, tremoloDepth: 0.22, tremoloHz: 18 },
      { durationMs: 115, freq: NOTE.C6, type: "tone", volume: 0.1, wave: "square", startMs: 60, attackMs: 0, releaseMs: 80, volumeCurve: "decay" },
      { durationMs: 115, freq: NOTE.E6, type: "tone", volume: 0.095, wave: "square", startMs: 210, attackMs: 0, releaseMs: 80, volumeCurve: "decay" },
      { durationMs: 130, freq: NOTE.G6, type: "tone", volume: 0.095, wave: "square", startMs: 360, attackMs: 0, releaseMs: 90, volumeCurve: "decay" },
      { durationMs: 620, freq: NOTE.G3, glideToFreq: NOTE.D5, type: "tone", volume: 0.07, wave: "saw", startMs: 360, attackMs: 18, releaseMs: 240, pitchCurve: 1.4, volumeCurve: "swell" },
      { durationMs: 180, type: "noise", volume: 0.14, startMs: 760, color: "bright", attackMs: 0, releaseMs: 115 },
      { durationMs: 620, type: "noise", volume: 0.08, startMs: 820, color: "coin", attackMs: 4, releaseMs: 360, tremoloDepth: 0.28, tremoloHz: 21 },
      { durationMs: 560, freq: NOTE.C5, type: "tone", volume: 0.09, wave: "triangle", startMs: 900, attackMs: 2, releaseMs: 420 },
      { durationMs: 560, freq: NOTE.E5, type: "tone", volume: 0.085, wave: "triangle", startMs: 1030, attackMs: 2, releaseMs: 420 },
      { durationMs: 580, freq: NOTE.G5, type: "tone", volume: 0.08, wave: "triangle", startMs: 1160, attackMs: 2, releaseMs: 440 },
      { durationMs: 520, freq: NOTE.C6, type: "tone", volume: 0.055, wave: "sine", startMs: 1450, attackMs: 2, releaseMs: 400 },
      { durationMs: 500, type: "noise", volume: 0.04, startMs: 1470, color: "crystal", attackMs: 6, releaseMs: 300 },
    ],
    fileName: "lucky-coins.mp3",
    id: "leprechaun-lucky-clover",
    seed: 47,
  },
]);

export const PILOT_SOUND_SPECS = PILOT_SOUND_TRACK_SPECS;

export const PILOT_SOUND_REGISTRY = Object.freeze(
  Object.fromEntries(PILOT_SOUND_TRACK_SPECS.map((spec) => [spec.id, `/sounds/${spec.fileName}`]))
);

export const PILOT_SOUND_CATEGORY_REGISTRY = Object.freeze({
  "Bingo Balls": "/sounds/bingo-pop.mp3",
  "Bouncing Bingo Balls": "/sounds/bingo-pop.mp3",
  Confetti: "/sounds/confetti-burst.mp3",
  Countdown: "/sounds/countdown-pop.mp3",
  Fireworks: "/sounds/fireworks-boom.mp3",
  Flowers: "/sounds/soft-bloom.mp3",
  "Gold Stars": "/sounds/sparkle-chime.mp3",
  "Happy Birthday": "/sounds/birthday-pop.mp3",
  Leprechaun: "/sounds/lucky-coins.mp3",
  "Thumbs Up": "/sounds/thumbs-up-pop.mp3",
});

function containsAny(source, terms) {
  return terms.some((term) => source.includes(term));
}

export function resolvePilotSoundPath({ category, id, name }) {
  const registeredPath = PILOT_SOUND_REGISTRY[id];
  if (registeredPath) {
    return registeredPath;
  }

  const source = `${id ?? ""} ${name ?? ""} ${category ?? ""}`.toLowerCase();

  if (category === "Countdown") {
    return source.includes("simple") ? "/sounds/countdown-beep.mp3" : "/sounds/countdown-pop.mp3";
  }

  if (category === "Bingo Balls" || category === "Bouncing Bingo Balls") {
    return containsAny(source, ["jackpot", "slot", "roulette", "drumroll"])
      ? "/sounds/jackpot-spin.mp3"
      : "/sounds/bingo-pop.mp3";
  }

  return PILOT_SOUND_CATEGORY_REGISTRY[category ?? ""];
}

export const PILOT_SOUND_CUE_REGISTRY = Object.freeze({
  "bb-collision": Object.freeze([
    { sound: "/sounds/whoosh.mp3", time: 0 },
    { sound: "/sounds/bounce.mp3", time: 0.95 },
    { sound: "/sounds/cheer.mp3", time: 2.1 },
  ]),
  "bouncing-bingo-jackpot": Object.freeze([
    { sound: "/sounds/whoosh.mp3", time: 0 },
    { sound: "/sounds/click.mp3", time: 1.1 },
    { sound: "/sounds/cheer.mp3", time: 2.2 },
  ]),
  "cf-cannon": Object.freeze([
    { sound: "/sounds/pop.mp3", time: 0 },
    { sound: "/sounds/cheer.mp3", time: 0.55 },
    { sound: "/sounds/sparkle.mp3", time: 1.45 },
  ]),
  "countdown-bingo-ball-letters-effect-wink": Object.freeze([
    { sound: "/sounds/pop.mp3", time: 0 },
    { sound: "/sounds/pop.mp3", time: 0.62 },
    { sound: "/sounds/pop.mp3", time: 1.24 },
    { sound: "/sounds/cheer.mp3", time: 2.05 },
  ]),
  "countdown-simple-party-effect-wink": Object.freeze([
    { sound: "/sounds/click.mp3", time: 0 },
    { sound: "/sounds/click.mp3", time: 0.58 },
    { sound: "/sounds/click.mp3", time: 1.16 },
    { sound: "/sounds/cheer.mp3", time: 1.9 },
  ]),
  "fireworks-final-bingo-countdown-effect-wink": Object.freeze([
    { sound: "/sounds/whoosh.mp3", time: 0 },
    { sound: "/sounds/boom.mp3", time: 1.1 },
    { sound: "/sounds/sparkle.mp3", time: 2.05 },
  ]),
  "flowers-bloom-pop": Object.freeze([
    { sound: "/sounds/pop.mp3", time: 0 },
    { sound: "/sounds/flutter.mp3", time: 0.95 },
    { sound: "/sounds/chime.mp3", time: 1.8 },
  ]),
  "gs-burst": Object.freeze([
    { sound: "/sounds/chime.mp3", time: 0 },
    { sound: "/sounds/sparkle.mp3", time: 0.8 },
    { sound: "/sounds/chime.mp3", time: 1.7 },
  ]),
  "happy-birthday-cake-pop-effect-wink": Object.freeze([
    { sound: "/sounds/pop.mp3", time: 0 },
    { sound: "/sounds/sparkle.mp3", time: 0.95 },
    { sound: "/sounds/chime.mp3", time: 1.85 },
  ]),
  "thumbs-up-pop": Object.freeze([
    { sound: "/sounds/pop.mp3", time: 0 },
    { sound: "/sounds/chime.mp3", time: 0.55 },
    { sound: "/sounds/click.mp3", time: 1.25 },
  ]),
});

function createNoiseGenerator(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

function clamp(sample) {
  return Math.max(-1, Math.min(1, sample));
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function milliseconds(valueMs, fallbackMs) {
  return ((valueMs ?? fallbackMs) || 0) / 1000;
}

function envelope(time, duration, attack = 0.01, release = 0.12, curve = 1) {
  if (duration <= 0) return 0;

  const attackSeconds = Math.min(Math.max(0, attack), duration * 0.85);
  const releaseSeconds = Math.min(Math.max(0, release), duration);
  const releaseStart = Math.max(attackSeconds, duration - releaseSeconds);
  let level = 1;

  if (attackSeconds > 0 && time < attackSeconds) {
    level = time / attackSeconds;
  }

  if (releaseSeconds > 0 && time > releaseStart) {
    const releaseDuration = Math.max(0.001, duration - releaseStart);
    level = Math.min(level, (duration - time) / releaseDuration);
  }

  return Math.pow(clamp01(level), Math.max(0.1, curve));
}

function waveSample(kind, phase) {
  switch (kind) {
    case "square":
      return Math.sign(Math.sin(phase));
    case "triangle":
      return (2 / Math.PI) * Math.asin(Math.sin(phase));
    case "saw":
      return 2 * (phase / TWO_PI - Math.floor(phase / TWO_PI + 0.5));
    default:
      return Math.sin(phase);
  }
}

function curvedProgress(progress, curve = 1) {
  return Math.pow(clamp01(progress), Math.max(0.1, curve));
}

function applyVolumeCurve(amplitude, progress, event) {
  const curvePower = Math.max(0.1, event.curvePower ?? 1);

  switch (event.volumeCurve) {
    case "decay":
      return amplitude * Math.pow(1 - clamp01(progress), curvePower);
    case "swell":
      return amplitude * (0.16 + 0.84 * Math.pow(clamp01(progress), curvePower));
    default:
      return amplitude;
  }
}

function applyTremolo(amplitude, time, event) {
  if (!event.tremoloDepth || !event.tremoloHz) {
    return amplitude;
  }

  const depth = clamp01(event.tremoloDepth);
  const lfo = (Math.sin(TWO_PI * event.tremoloHz * time) + 1) / 2;
  return amplitude * (1 - depth + depth * lfo);
}

function harmonicSample(event, phase) {
  const wave = event.wave ?? "sine";
  const harmonics = Array.isArray(event.harmonics)
    ? event.harmonics
    : [{ multiple: 1, volume: 1, wave }];
  let sample = 0;
  let weight = 0;

  for (const harmonic of harmonics) {
    const harmonicVolume = harmonic.volume ?? 1;
    sample +=
      waveSample(harmonic.wave ?? wave, phase * (harmonic.multiple ?? 1) + (harmonic.phase ?? 0)) *
      harmonicVolume;
    weight += Math.abs(harmonicVolume);
  }

  return weight > 0 ? sample / weight : 0;
}

function addTone(samples, event) {
  const startIndex = Math.max(0, Math.round(((event.startMs ?? 0) / 1000) * SAMPLE_RATE));
  const endIndex = Math.min(
    samples.length,
    startIndex + Math.round((event.durationMs / 1000) * SAMPLE_RATE)
  );
  const durationSeconds = (endIndex - startIndex) / SAMPLE_RATE;
  const attack = milliseconds(event.attackMs, 10);
  const release = milliseconds(event.releaseMs, 120);
  let phase = 0;

  for (let sampleIndex = startIndex; sampleIndex < endIndex; sampleIndex += 1) {
    const time = (sampleIndex - startIndex) / SAMPLE_RATE;
    const progress = durationSeconds > 0 ? time / durationSeconds : 0;
    const pitchProgress = curvedProgress(progress, event.pitchCurve ?? 1);
    let frequency =
      event.glideToFreq == null
        ? event.freq
        : event.freq + (event.glideToFreq - event.freq) * pitchProgress;

    if (event.vibratoDepth && event.vibratoHz) {
      frequency += Math.sin(TWO_PI * event.vibratoHz * time) * event.vibratoDepth;
    }

    phase += (TWO_PI * frequency) / SAMPLE_RATE;
    let amplitude =
      (event.volume ?? 0.1) *
      envelope(time, durationSeconds, attack, release, event.envelopeCurve ?? 1);
    amplitude = applyVolumeCurve(amplitude, progress, event);
    amplitude = applyTremolo(amplitude, time, event);
    samples[sampleIndex] += harmonicSample(event, phase) * amplitude;
  }
}

function shapeNoiseSample(raw, event, state, time) {
  state.low = state.low ?? 0;
  state.lastRaw = state.lastRaw ?? 0;

  switch (event.color) {
    case "air":
      state.low = state.low * 0.92 + raw * 0.08;
      return (raw - state.low) * 0.68;
    case "applause": {
      state.low = state.low * 0.74 + raw * 0.26;
      const slap = Math.abs(raw) > 0.68 ? raw * 0.76 : raw * 0.2;
      return state.low * 0.35 + slap;
    }
    case "bright": {
      const bright = raw - state.lastRaw * 0.78;
      state.lastRaw = raw;
      return bright * 0.72;
    }
    case "coin": {
      state.low = state.low * 0.82 + raw * 0.18;
      const shimmer = Math.sin(TWO_PI * (2600 + raw * 460) * time) * 0.16;
      return (raw - state.low) * 0.48 + shimmer;
    }
    case "confetti":
      state.low = state.low * 0.68 + raw * 0.32;
      return state.low * 0.75 + (raw - state.low) * 0.22;
    case "crystal": {
      state.low = state.low * 0.9 + raw * 0.1;
      const sparkle = Math.abs(raw) > 0.84 ? raw : raw * 0.16;
      return (sparkle - state.low * 0.35) * 0.72;
    }
    case "grain":
      state.low = state.low * 0.62 + raw * 0.38;
      return state.low;
    case "rumble":
      state.low = state.low * 0.975 + raw * 0.025;
      return state.low * 3.2;
    case "soft":
      state.low = state.low * 0.86 + raw * 0.14;
      return state.low * 1.35;
    default:
      state.low = state.low * 0.72 + raw * 0.28;
      return state.low;
  }
}

function addNoise(samples, event, seed) {
  const startIndex = Math.max(0, Math.round(((event.startMs ?? 0) / 1000) * SAMPLE_RATE));
  const endIndex = Math.min(
    samples.length,
    startIndex + Math.round((event.durationMs / 1000) * SAMPLE_RATE)
  );
  const durationSeconds = (endIndex - startIndex) / SAMPLE_RATE;
  const noise = createNoiseGenerator(seed);
  const attack = milliseconds(event.attackMs, 5);
  const release = milliseconds(event.releaseMs, 180);
  const state = {};

  for (let sampleIndex = startIndex; sampleIndex < endIndex; sampleIndex += 1) {
    const time = (sampleIndex - startIndex) / SAMPLE_RATE;
    const progress = durationSeconds > 0 ? time / durationSeconds : 0;
    let amplitude =
      (event.volume ?? 0.1) *
      envelope(time, durationSeconds, attack, release, event.envelopeCurve ?? 1);
    amplitude = applyVolumeCurve(amplitude, progress, event);
    amplitude = applyTremolo(amplitude, time, event);
    samples[sampleIndex] += shapeNoiseSample(noise(), event, state, time) * amplitude;
  }
}

function finishSamples(samples) {
  const fadeSamples = Math.min(samples.length, Math.round(SAMPLE_RATE * 0.006));

  for (let index = 0; index < fadeSamples; index += 1) {
    const fadeIn = index / fadeSamples;
    const fadeOut = (fadeSamples - index) / fadeSamples;
    samples[index] *= fadeIn;
    samples[samples.length - 1 - index] *= fadeOut;
  }

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.tanh(samples[index] * 1.08) / Math.tanh(1.08);
  }

  let peak = 0;
  for (const sample of samples) {
    peak = Math.max(peak, Math.abs(sample));
  }

  if (peak > 0.92) {
    const gain = 0.92 / peak;
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] *= gain;
    }
  }

  return samples;
}

function synthesize(spec) {
  const sampleCount = Math.ceil((spec.durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float32Array(sampleCount);

  spec.events.forEach((event, index) => {
    if (event.type === "noise") {
      addNoise(samples, event, spec.seed + index * 97);
      return;
    }

    addTone(samples, event);
  });

  return finishSamples(samples);
}

function wavBufferFromSamples(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  const dataSize = samples.length * 2;

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < samples.length; index += 1) {
    buffer.writeInt16LE(Math.round(clamp(samples[index]) * 32767), 44 + index * 2);
  }

  return buffer;
}

function encodeMp3(wavPath, outputPath) {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static is not available.");
  }

  const result = spawnSync(
    ffmpegPath,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      wavPath,
      "-codec:a",
      "libmp3lame",
      "-q:a",
      "4",
      outputPath,
    ],
    { encoding: "utf8" }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `ffmpeg exited with code ${result.status}`);
  }
}

async function writeAudioSpec(spec, tempRoot) {
  const wavPath = path.join(tempRoot, `${path.parse(spec.fileName).name}.wav`);
  const outputPath = path.join(SOUND_ROOT, spec.fileName);
  const wavBuffer = wavBufferFromSamples(synthesize(spec));

  await fs.writeFile(wavPath, wavBuffer);
  encodeMp3(wavPath, outputPath);
  return outputPath;
}

export async function generateSoundPilotPack() {
  await fs.mkdir(SOUND_ROOT, { recursive: true });
  const tempRoot = path.join(SOUND_ROOT, ".tmp-sound-pack");
  await fs.rm(tempRoot, { force: true, recursive: true });
  await fs.mkdir(tempRoot, { recursive: true });

  const writtenFiles = [];
  const uniqueSpecs = [...CUE_SOUND_SPECS, ...PILOT_SOUND_TRACK_SPECS];

  try {
    for (const spec of uniqueSpecs) {
      writtenFiles.push(await writeAudioSpec(spec, tempRoot));
    }
  } finally {
    await fs.rm(tempRoot, { force: true, recursive: true });
  }

  return writtenFiles;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentModulePath = fileURLToPath(import.meta.url);

if (invokedPath === currentModulePath) {
  const files = await generateSoundPilotPack();
  for (const filePath of files) {
    console.log(path.relative(PROJECT_ROOT, filePath).replaceAll("\\", "/"));
  }
}
