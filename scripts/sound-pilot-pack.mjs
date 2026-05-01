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

const CUE_SOUND_SPECS = Object.freeze([
  {
    durationMs: 190,
    events: [
      { durationMs: 120, freq: 780, type: "tone", volume: 0.22, wave: "triangle", startMs: 0 },
      { durationMs: 110, type: "noise", volume: 0.08, startMs: 20 },
    ],
    fileName: "pop.mp3",
    seed: 101,
  },
  {
    durationMs: 260,
    events: [
      {
        durationMs: 230,
        freq: 520,
        glideToFreq: 220,
        type: "tone",
        volume: 0.16,
        wave: "saw",
        startMs: 0,
      },
      { durationMs: 240, type: "noise", volume: 0.06, startMs: 0 },
    ],
    fileName: "whoosh.mp3",
    seed: 103,
  },
  {
    durationMs: 520,
    events: [
      {
        durationMs: 360,
        freq: 180,
        glideToFreq: 110,
        type: "tone",
        volume: 0.22,
        wave: "sine",
        startMs: 0,
      },
      { durationMs: 420, type: "noise", volume: 0.16, startMs: 60 },
    ],
    fileName: "boom.mp3",
    seed: 107,
  },
  {
    durationMs: 340,
    events: [
      { durationMs: 220, freq: 920, type: "tone", volume: 0.14, wave: "sine", startMs: 0 },
      { durationMs: 240, freq: 1240, type: "tone", volume: 0.12, wave: "sine", startMs: 90 },
    ],
    fileName: "chime.mp3",
    seed: 109,
  },
  {
    durationMs: 280,
    events: [
      { durationMs: 160, freq: 1480, type: "tone", volume: 0.08, wave: "sine", startMs: 0 },
      { durationMs: 220, freq: 1760, type: "tone", volume: 0.08, wave: "triangle", startMs: 70 },
      { durationMs: 220, type: "noise", volume: 0.03, startMs: 30 },
    ],
    fileName: "sparkle.mp3",
    seed: 113,
  },
  {
    durationMs: 180,
    events: [
      { durationMs: 140, freq: 420, type: "tone", volume: 0.2, wave: "triangle", startMs: 0 },
      { durationMs: 120, freq: 680, type: "tone", volume: 0.12, wave: "sine", startMs: 20 },
    ],
    fileName: "bounce.mp3",
    seed: 127,
  },
  {
    durationMs: 560,
    events: [
      { durationMs: 180, freq: 520, type: "tone", volume: 0.12, wave: "triangle", startMs: 0 },
      { durationMs: 180, freq: 760, type: "tone", volume: 0.12, wave: "triangle", startMs: 110 },
      { durationMs: 220, freq: 980, type: "tone", volume: 0.12, wave: "triangle", startMs: 220 },
      { durationMs: 260, type: "noise", volume: 0.04, startMs: 120 },
    ],
    fileName: "cheer.mp3",
    seed: 131,
  },
  {
    durationMs: 260,
    events: [
      { durationMs: 220, type: "noise", volume: 0.05, startMs: 0 },
      {
        durationMs: 180,
        freq: 760,
        glideToFreq: 520,
        type: "tone",
        volume: 0.05,
        wave: "triangle",
        startMs: 30,
      },
    ],
    fileName: "flutter.mp3",
    seed: 137,
  },
  {
    durationMs: 130,
    events: [
      { durationMs: 70, freq: 1120, type: "tone", volume: 0.12, wave: "square", startMs: 0 },
      { durationMs: 90, type: "noise", volume: 0.04, startMs: 0 },
    ],
    fileName: "click.mp3",
    seed: 139,
  },
]);

const PILOT_SOUND_TRACK_SPECS = Object.freeze([
  {
    durationMs: 1400,
    events: [
      { durationMs: 150, freq: 880, type: "tone", volume: 0.28, wave: "triangle", startMs: 0 },
      { durationMs: 150, freq: 760, type: "tone", volume: 0.28, wave: "triangle", startMs: 190 },
      { durationMs: 150, freq: 660, type: "tone", volume: 0.28, wave: "triangle", startMs: 380 },
      {
        durationMs: 220,
        freq: 720,
        glideToFreq: 940,
        type: "tone",
        volume: 0.24,
        wave: "square",
        startMs: 620,
      },
      { durationMs: 260, type: "noise", volume: 0.14, startMs: 860 },
      { durationMs: 260, freq: 520, type: "tone", volume: 0.18, wave: "sine", startMs: 860 },
    ],
    fileName: "countdown-pop.mp3",
    id: "countdown-bingo-ball-letters-effect-wink",
    seed: 11,
  },
  {
    durationMs: 1100,
    events: [
      { durationMs: 120, freq: 980, type: "tone", volume: 0.22, wave: "square", startMs: 0 },
      { durationMs: 120, freq: 820, type: "tone", volume: 0.22, wave: "square", startMs: 200 },
      { durationMs: 120, freq: 680, type: "tone", volume: 0.22, wave: "square", startMs: 400 },
      { durationMs: 220, type: "noise", volume: 0.12, startMs: 620 },
      {
        durationMs: 240,
        freq: 640,
        glideToFreq: 940,
        type: "tone",
        volume: 0.18,
        wave: "triangle",
        startMs: 620,
      },
    ],
    fileName: "countdown-beep.mp3",
    id: "countdown-simple-party-effect-wink",
    seed: 13,
  },
  {
    durationMs: 1200,
    events: [
      { durationMs: 180, freq: 480, type: "tone", volume: 0.2, wave: "sine", startMs: 0 },
      { durationMs: 180, freq: 540, type: "tone", volume: 0.2, wave: "sine", startMs: 170 },
      { durationMs: 140, type: "noise", volume: 0.16, startMs: 320 },
      { durationMs: 220, freq: 620, type: "tone", volume: 0.22, wave: "triangle", startMs: 320 },
      { durationMs: 180, freq: 780, type: "tone", volume: 0.18, wave: "triangle", startMs: 620 },
    ],
    fileName: "bingo-pop.mp3",
    id: "bb-collision",
    seed: 17,
  },
  {
    durationMs: 1700,
    events: [
      { durationMs: 900, freq: 260, glideToFreq: 980, type: "tone", volume: 0.16, wave: "saw", startMs: 0 },
      { durationMs: 180, freq: 980, type: "tone", volume: 0.22, wave: "triangle", startMs: 940 },
      { durationMs: 180, freq: 1240, type: "tone", volume: 0.2, wave: "triangle", startMs: 1120 },
      { durationMs: 180, type: "noise", volume: 0.12, startMs: 1320 },
    ],
    fileName: "jackpot-spin.mp3",
    id: "bouncing-bingo-jackpot",
    seed: 19,
  },
  {
    durationMs: 1600,
    events: [
      { durationMs: 260, freq: 180, glideToFreq: 130, type: "tone", volume: 0.24, wave: "sine", startMs: 0 },
      { durationMs: 520, type: "noise", volume: 0.18, startMs: 180 },
      { durationMs: 440, freq: 420, glideToFreq: 760, type: "tone", volume: 0.14, wave: "triangle", startMs: 320 },
      { durationMs: 300, freq: 300, type: "tone", volume: 0.12, wave: "sine", startMs: 820 },
    ],
    fileName: "fireworks-boom.mp3",
    id: "fireworks-final-bingo-countdown-effect-wink",
    seed: 23,
  },
  {
    durationMs: 1300,
    events: [
      { durationMs: 240, type: "noise", volume: 0.16, startMs: 0 },
      { durationMs: 220, freq: 760, type: "tone", volume: 0.18, wave: "triangle", startMs: 40 },
      { durationMs: 180, freq: 920, type: "tone", volume: 0.16, wave: "triangle", startMs: 180 },
      { durationMs: 240, type: "noise", volume: 0.12, startMs: 360 },
      {
        durationMs: 220,
        freq: 680,
        glideToFreq: 860,
        type: "tone",
        volume: 0.14,
        wave: "square",
        startMs: 420,
      },
    ],
    fileName: "confetti-burst.mp3",
    id: "cf-cannon",
    seed: 29,
  },
  {
    durationMs: 1500,
    events: [
      { durationMs: 320, freq: 1040, type: "tone", volume: 0.16, wave: "sine", startMs: 0 },
      { durationMs: 320, freq: 1320, type: "tone", volume: 0.14, wave: "sine", startMs: 180 },
      { durationMs: 420, freq: 1560, type: "tone", volume: 0.12, wave: "triangle", startMs: 360 },
      { durationMs: 260, type: "noise", volume: 0.04, startMs: 120 },
    ],
    fileName: "sparkle-chime.mp3",
    id: "gs-burst",
    seed: 31,
  },
  {
    durationMs: 1600,
    events: [
      { durationMs: 200, freq: 520, type: "tone", volume: 0.16, wave: "triangle", startMs: 0 },
      { durationMs: 200, freq: 660, type: "tone", volume: 0.16, wave: "triangle", startMs: 180 },
      { durationMs: 240, freq: 780, type: "tone", volume: 0.15, wave: "triangle", startMs: 360 },
      { durationMs: 160, type: "noise", volume: 0.1, startMs: 620 },
      { durationMs: 260, freq: 940, type: "tone", volume: 0.12, wave: "sine", startMs: 760 },
    ],
    fileName: "birthday-pop.mp3",
    id: "happy-birthday-cake-pop-effect-wink",
    seed: 37,
  },
  {
    durationMs: 1000,
    events: [
      { durationMs: 140, freq: 620, type: "tone", volume: 0.18, wave: "square", startMs: 0 },
      { durationMs: 120, type: "noise", volume: 0.08, startMs: 80 },
      { durationMs: 180, freq: 880, type: "tone", volume: 0.14, wave: "triangle", startMs: 220 },
      { durationMs: 220, freq: 1120, type: "tone", volume: 0.1, wave: "sine", startMs: 420 },
    ],
    fileName: "thumbs-up-pop.mp3",
    id: "thumbs-up-pop",
    seed: 41,
  },
  {
    durationMs: 1700,
    events: [
      { durationMs: 420, freq: 330, type: "tone", volume: 0.12, wave: "sine", startMs: 0 },
      { durationMs: 540, freq: 440, type: "tone", volume: 0.1, wave: "sine", startMs: 120 },
      { durationMs: 480, freq: 660, type: "tone", volume: 0.08, wave: "triangle", startMs: 320 },
      { durationMs: 180, type: "noise", volume: 0.05, startMs: 760 },
    ],
    fileName: "soft-bloom.mp3",
    id: "flowers-bloom-pop",
    seed: 43,
  },
]);

export const PILOT_SOUND_SPECS = PILOT_SOUND_TRACK_SPECS;

export const PILOT_SOUND_REGISTRY = Object.freeze(
  Object.fromEntries(PILOT_SOUND_TRACK_SPECS.map((spec) => [spec.id, `/sounds/${spec.fileName}`]))
);

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

function envelope(time, duration, attack = 0.01, release = 0.12) {
  if (duration <= 0) return 0;
  if (time < attack) return time / attack;
  if (time > duration - release) return Math.max(0, (duration - time) / release);
  return 1;
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

function addTone(samples, event) {
  const startIndex = Math.max(0, Math.round((event.startMs / 1000) * SAMPLE_RATE));
  const endIndex = Math.min(
    samples.length,
    startIndex + Math.round((event.durationMs / 1000) * SAMPLE_RATE)
  );
  const durationSeconds = (endIndex - startIndex) / SAMPLE_RATE;
  let phase = 0;

  for (let sampleIndex = startIndex; sampleIndex < endIndex; sampleIndex += 1) {
    const time = (sampleIndex - startIndex) / SAMPLE_RATE;
    const progress = durationSeconds > 0 ? time / durationSeconds : 0;
    let frequency =
      event.glideToFreq == null
        ? event.freq
        : event.freq + (event.glideToFreq - event.freq) * progress;

    if (event.vibratoDepth && event.vibratoHz) {
      frequency += Math.sin(TWO_PI * event.vibratoHz * time) * event.vibratoDepth;
    }

    phase += (TWO_PI * frequency) / SAMPLE_RATE;
    const amplitude = event.volume * envelope(time, durationSeconds);
    samples[sampleIndex] += waveSample(event.wave ?? "sine", phase) * amplitude;
  }
}

function addNoise(samples, event, seed) {
  const startIndex = Math.max(0, Math.round((event.startMs / 1000) * SAMPLE_RATE));
  const endIndex = Math.min(
    samples.length,
    startIndex + Math.round((event.durationMs / 1000) * SAMPLE_RATE)
  );
  const durationSeconds = (endIndex - startIndex) / SAMPLE_RATE;
  const noise = createNoiseGenerator(seed);
  let previous = 0;

  for (let sampleIndex = startIndex; sampleIndex < endIndex; sampleIndex += 1) {
    const time = (sampleIndex - startIndex) / SAMPLE_RATE;
    const amplitude = event.volume * envelope(time, durationSeconds, 0.005, 0.18);
    previous = previous * 0.72 + noise() * 0.28;
    samples[sampleIndex] += previous * amplitude;
  }
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

  return samples;
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
      "7",
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
