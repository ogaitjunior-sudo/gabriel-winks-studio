import type { CSSProperties } from "react";

import { GOLD_LIGHT, starPath } from "../_shared";

export const CONFETTI_SAFE_AREA = {
  left: 320,
  right: 1600,
  top: 150,
  bottom: 920,
  centerX: 960,
  centerY: 540,
} as const;

export const CONFETTI_ACCENTS = [
  "hsl(352 92% 67%)",
  "hsl(42 98% 62%)",
  "hsl(196 88% 64%)",
  "hsl(150 64% 54%)",
  "hsl(276 82% 72%)",
  "hsl(22 98% 60%)",
  "hsl(48 100% 92%)",
] as const;

export const CONFETTI_SHAPES = ["rect", "circle", "star", "streamer", "diamond", "ribbon"] as const;

export type ConfettiShape = (typeof CONFETTI_SHAPES)[number];

export interface ConfettiPieceData {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  shape: ConfettiShape;
  color: string;
  delay: number;
  duration?: number;
  opacity?: number;
  sx?: number;
  sy?: number;
  rotateStart?: number;
  rotateMid?: number;
  rotateEnd?: number;
}

interface SpreadOptions {
  cx: number;
  cy: number;
  count: number;
  radiusX?: number;
  radiusY?: number;
  angleOffset?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface FanOptions {
  x: number;
  y: number;
  count: number;
  angleStart: number;
  angleEnd: number;
  distance?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface RainOptions {
  count: number;
  left: number;
  right: number;
  top: number;
  drop?: number;
  drift?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface HeartOptions {
  cx: number;
  cy: number;
  count: number;
  scale?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface WaveOptions {
  count: number;
  left: number;
  right: number;
  centerY: number;
  amplitude?: number;
  travelX?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface SpiralOptions {
  cx: number;
  cy: number;
  count: number;
  turns?: number;
  startRadius?: number;
  endRadius?: number;
  radiusScaleY?: number;
  angleOffset?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface RingOptions {
  cx: number;
  cy: number;
  count: number;
  ringRadiusX?: number;
  ringRadiusY?: number;
  expandX?: number;
  expandY?: number;
  angleOffset?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

interface TunnelOptions {
  cx: number;
  cy: number;
  count: number;
  spreadX?: number;
  spreadY?: number;
  exitRadiusX?: number;
  exitRadiusY?: number;
  angleOffset?: number;
  delayStart?: number;
  delayStep?: number;
  duration?: number;
  sizeMin?: number;
  sizeMax?: number;
  palette?: readonly string[];
  shapes?: readonly ConfettiShape[];
  colorOffset?: number;
  shapeOffset?: number;
}

function pickFrom<T>(items: readonly T[], index: number, offset = 0) {
  return items[(index + offset + items.length * 8) % items.length];
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function rotation(value: number) {
  return `${value}deg`;
}

export function confettiGlowId(prefix: string, suffix: string | number) {
  return `${prefix}-${suffix}-glow`;
}

export function ConfettiGlowGradient({
  id,
  inner,
  outer = inner,
}: {
  id: string;
  inner: string;
  outer?: string;
}) {
  return (
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="white" stopOpacity="0.84" />
      <stop offset="26%" stopColor={inner} stopOpacity="0.34" />
      <stop offset="60%" stopColor={outer} stopOpacity="0.1" />
      <stop offset="100%" stopColor={outer} stopOpacity="0" />
    </radialGradient>
  );
}

export function ConfettiGlow({
  glowId,
  cx,
  cy,
  r,
  opacity = 0.82,
  animation = "wink-glow-pulse 3.4s ease-in-out infinite",
  delay,
}: {
  glowId: string;
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
  animation?: string;
  delay?: string;
}) {
  return (
    <g style={{ animation, animationDelay: delay }}>
      <ellipse cx={cx} cy={cy} rx={r * 0.96} ry={r * 0.72} fill={`url(#${glowId})`} opacity={opacity * 0.42} />
      <ellipse cx={cx - r * 0.03} cy={cy - r * 0.04} rx={r * 0.54} ry={r * 0.38} fill={`url(#${glowId})`} opacity={opacity * 0.24} />
      <ellipse cx={cx + r * 0.04} cy={cy + r * 0.03} rx={r * 0.3} ry={r * 0.22} fill={`url(#${glowId})`} opacity={opacity * 0.16} />
    </g>
  );
}

export function ConfettiSparkle({
  cx,
  cy,
  size = 16,
  color = GOLD_LIGHT,
  delay = 0,
  duration = 3.4,
  opacity = 0.9,
}: {
  cx: number;
  cy: number;
  size?: number;
  color?: string;
  delay?: number;
  duration?: number;
  opacity?: number;
}) {
  return (
    <g
      opacity={opacity}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `wink-sparkle ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy - size} x2={cx} y2={cy + size} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line
        x1={cx - size * 0.7}
        y1={cy - size * 0.7}
        x2={cx + size * 0.7}
        y2={cy + size * 0.7}
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.72"
      />
      <line
        x1={cx - size * 0.7}
        y1={cy + size * 0.7}
        x2={cx + size * 0.7}
        y2={cy - size * 0.7}
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.72"
      />
    </g>
  );
}

function ConfettiGlyph({
  shape,
  size,
  fill,
  opacity = 0.96,
}: {
  shape: ConfettiShape;
  size: number;
  fill: string;
  opacity?: number;
}) {
  if (shape === "circle") {
    return <circle cx="0" cy="0" r={size * 0.42} fill={fill} opacity={opacity} />;
  }

  if (shape === "star") {
    return <path d={starPath(0, 0, size * 0.62, size * 0.28)} fill={fill} opacity={opacity} />;
  }

  if (shape === "streamer") {
    return (
      <rect
        x={-size * 0.16}
        y={-size * 0.95}
        width={size * 0.32}
        height={size * 1.9}
        rx={size * 0.16}
        fill={fill}
        opacity={opacity}
      />
    );
  }

  if (shape === "diamond") {
    return (
      <rect
        x={-size * 0.42}
        y={-size * 0.42}
        width={size * 0.84}
        height={size * 0.84}
        rx={size * 0.14}
        fill={fill}
        opacity={opacity}
        transform="rotate(45)"
      />
    );
  }

  if (shape === "ribbon") {
    return (
      <path
        d={`M ${-size * 0.1} ${-size * 0.95}
            C ${size * 0.7} ${-size * 0.7}, ${-size * 0.72} ${-size * 0.2}, ${size * 0.08} ${size * 0.16}
            C ${size * 0.82} ${size * 0.5}, ${-size * 0.5} ${size * 0.88}, ${size * 0.14} ${size * 1.02}`}
        fill="none"
        stroke={fill}
        strokeWidth={size * 0.24}
        strokeLinecap="round"
        strokeOpacity={opacity}
      />
    );
  }

  return (
    <rect
      x={-size * 0.52}
      y={-size * 0.32}
      width={size * 1.04}
      height={size * 0.64}
      rx={size * 0.16}
      fill={fill}
      opacity={opacity}
    />
  );
}

export function AnimatedConfettiPiece({
  piece,
  animation = "wink-confetti-launch",
  easing = "cubic-bezier(.16,.84,.24,1)",
  spinDuration,
}: {
  piece: ConfettiPieceData;
  animation?: string;
  easing?: string;
  spinDuration?: number;
}) {
  const outerStyle = {
    animation: `${animation} ${piece.duration ?? 3.4}s ${easing} infinite`,
    animationDelay: `${piece.delay}s`,
    transformOrigin: "0px 0px",
    "--sx": `${piece.sx ?? 0}px`,
    "--sy": `${piece.sy ?? 0}px`,
    "--tx": `${piece.tx}px`,
    "--ty": `${piece.ty}px`,
    "--r0": rotation(piece.rotateStart ?? 0),
    "--r1": rotation(piece.rotateMid ?? 180),
    "--r2": rotation(piece.rotateEnd ?? 320),
  } as CSSProperties;

  const innerStyle = {
    animation: `wink-confetti-shimmer ${spinDuration ?? 1.4 + ((piece.size % 6) * 0.12)}s ease-in-out infinite`,
    animationDelay: `${piece.delay}s`,
    transformOrigin: "0px 0px",
    "--r0": rotation(piece.rotateStart ?? 0),
    "--r1": rotation(piece.rotateMid ?? 180),
  } as CSSProperties;

  return (
    <g transform={`translate(${piece.x} ${piece.y})`}>
      <g style={outerStyle}>
        <g style={innerStyle}>
          <ConfettiGlyph
            shape={piece.shape}
            size={piece.size}
            fill={piece.color}
            opacity={piece.opacity}
          />
        </g>
      </g>
    </g>
  );
}

export function createRadialBurst({
  cx,
  cy,
  count,
  radiusX = 420,
  radiusY = 300,
  angleOffset = 0,
  delayStart = 0,
  delayStep = 0.04,
  duration = 3.4,
  sizeMin = 14,
  sizeMax = 28,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: SpreadOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / count;
    const angle = angleOffset + t * Math.PI * 2;
    const spread = 0.8 + (index % 4) * 0.12;
    const sizeT = (index % 5) / 4;

    return {
      x: cx,
      y: cy,
      tx: Math.cos(angle) * radiusX * spread,
      ty: Math.sin(angle) * radiusY * spread,
      size: Math.round(lerp(sizeMin, sizeMax, sizeT)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 18 - 24,
      rotateMid: 180 + index * 16,
      rotateEnd: 320 + index * 20,
    };
  });
}

export function createFanLaunch({
  x,
  y,
  count,
  angleStart,
  angleEnd,
  distance = 720,
  delayStart = 0,
  delayStep = 0.03,
  duration = 3.6,
  sizeMin = 14,
  sizeMax = 28,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: FanOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const angle = toRadians(lerp(angleStart, angleEnd, t));
    const distanceScale = 0.78 + (index % 4) * 0.08;

    return {
      x,
      y,
      tx: Math.cos(angle) * distance * distanceScale,
      ty: Math.sin(angle) * distance * distanceScale,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 5) / 4)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 14 - 20,
      rotateMid: 150 + index * 18,
      rotateEnd: 290 + index * 22,
    };
  });
}

export function createRainField({
  count,
  left,
  right,
  top,
  drop = 820,
  drift = 160,
  delayStart = 0,
  delayStep = 0.08,
  duration = 3.6,
  sizeMin = 12,
  sizeMax = 24,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: RainOptions): ConfettiPieceData[] {
  const columns = Math.max(4, Math.ceil(Math.sqrt(count * 1.7)));
  const rows = Math.ceil(count / columns);
  const stepX = columns === 1 ? 0 : (right - left) / (columns - 1);

  return Array.from({ length: count }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const driftOffset = -drift + (index % 5) * ((drift * 2) / 4);

    return {
      x: left + col * stepX + (row % 2 === 0 ? 0 : stepX * 0.28),
      y: top - row * 54,
      tx: driftOffset,
      ty: drop - row * 28,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 5) / 4)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + col * delayStep * 0.34 + row * 0.08,
      duration: duration + (index % 3) * 0.14,
      rotateStart: index * 12,
      rotateMid: 180 + index * 22,
      rotateEnd: 300 + index * 17,
    };
  });
}

export function createHeartBurst({
  cx,
  cy,
  count,
  scale = 18,
  delayStart = 0.12,
  delayStep = 0.04,
  duration = 3.4,
  sizeMin = 14,
  sizeMax = 24,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: HeartOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = (Math.PI * 2 * index) / count;
    const heartX = 16 * Math.sin(t) ** 3;
    const heartY =
      -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    return {
      x: cx,
      y: cy,
      tx: heartX * scale,
      ty: heartY * scale * 0.9,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 4) / 3)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 18,
      rotateMid: 180 + index * 12,
      rotateEnd: 280 + index * 20,
    };
  });
}

export function createWaveField({
  count,
  left,
  right,
  centerY,
  amplitude = 130,
  travelX = 260,
  delayStart = 0,
  delayStep = 0.07,
  duration = 3.4,
  sizeMin = 12,
  sizeMax = 22,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: WaveOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const phase = t * Math.PI * 2;

    return {
      x: lerp(left, right, t),
      y: centerY + Math.sin(phase * 1.1) * amplitude,
      sx: -200 - (index % 3) * 24,
      sy: Math.cos(phase) * 36,
      tx: travelX + (index % 4) * 22,
      ty: Math.sin(phase + 0.6) * 72,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 5) / 4)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 16 - 18,
      rotateMid: 180 + index * 18,
      rotateEnd: 330 + index * 18,
    };
  });
}

export function createSpiralField({
  cx,
  cy,
  count,
  turns = 2.2,
  startRadius = 60,
  endRadius = 520,
  radiusScaleY = 0.78,
  angleOffset = 0,
  delayStart = 0.12,
  delayStep = 0.035,
  duration = 3.6,
  sizeMin = 12,
  sizeMax = 24,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: SpiralOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 1 : index / (count - 1);
    const angle = angleOffset + t * Math.PI * 2 * turns;
    const radius = lerp(startRadius, endRadius, t);

    return {
      x: cx,
      y: cy,
      tx: Math.cos(angle) * radius,
      ty: Math.sin(angle) * radius * radiusScaleY,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 5) / 4)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 16 - 24,
      rotateMid: 170 + index * 16,
      rotateEnd: 300 + index * 20,
    };
  });
}

export function createRingField({
  cx,
  cy,
  count,
  ringRadiusX = 220,
  ringRadiusY = 220,
  expandX = 180,
  expandY = 180,
  angleOffset = 0,
  delayStart = 0.1,
  delayStep = 0.03,
  duration = 3.4,
  sizeMin = 12,
  sizeMax = 22,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: RingOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / count;
    const angle = angleOffset + t * Math.PI * 2;
    const startX = cx + Math.cos(angle) * ringRadiusX;
    const startY = cy + Math.sin(angle) * ringRadiusY;

    return {
      x: startX,
      y: startY,
      tx: Math.cos(angle) * expandX,
      ty: Math.sin(angle) * expandY,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 5) / 4)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 14,
      rotateMid: 180 + index * 16,
      rotateEnd: 320 + index * 18,
    };
  });
}

export function createTunnelField({
  cx,
  cy,
  count,
  spreadX = 780,
  spreadY = 420,
  exitRadiusX = 220,
  exitRadiusY = 160,
  angleOffset = 0,
  delayStart = 0.08,
  delayStep = 0.04,
  duration = 3.8,
  sizeMin = 12,
  sizeMax = 22,
  palette = CONFETTI_ACCENTS,
  shapes = CONFETTI_SHAPES,
  colorOffset = 0,
  shapeOffset = 0,
}: TunnelOptions): ConfettiPieceData[] {
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0.5 : index / count;
    const angle = angleOffset + t * Math.PI * 2;

    return {
      x: cx,
      y: cy,
      sx: Math.cos(angle) * spreadX,
      sy: Math.sin(angle) * spreadY,
      tx: Math.cos(angle) * exitRadiusX,
      ty: Math.sin(angle) * exitRadiusY,
      size: Math.round(lerp(sizeMin, sizeMax, (index % 5) / 4)),
      shape: pickFrom(shapes, index, shapeOffset),
      color: pickFrom(palette, index, colorOffset),
      delay: delayStart + index * delayStep,
      duration,
      rotateStart: index * 12 - 20,
      rotateMid: 180 + index * 16,
      rotateEnd: 320 + index * 18,
    };
  });
}
