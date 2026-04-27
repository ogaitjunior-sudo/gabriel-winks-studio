import type { CSSProperties, ReactNode } from "react";

/** The 5 main BINGO balls - large, centered, always legible. */
export const BINGO_LETTERS = ["B", "I", "N", "G", "O"] as const;

export interface BingoBallColor {
  bg: string;
  deep: string;
  letter: (typeof BINGO_LETTERS)[number];
}

export const BALL_COLORS = [
  { bg: "#0278df", deep: "#015cab", letter: "B" },
  { bg: "#f70900", deep: "#c10700", letter: "I" },
  { bg: "#9610b8", deep: "#740c8f", letter: "N" },
  { bg: "#36af0a", deep: "#288407", letter: "G" },
  { bg: "#f7c901", deep: "#c89d01", letter: "O" },
] as const satisfies readonly BingoBallColor[];

export const MAIN_BALL_R = 110;
export const MAIN_GAP = 260;
export const MAIN_CY = 540;
export const MAIN_START_X = 960 - MAIN_GAP * 2;
export const MAIN_CENTER_X = 960;

export const MAIN_BALLS = BINGO_LETTERS.map((_, index) => ({
  index,
  x: MAIN_START_X + index * MAIN_GAP,
  y: MAIN_CY,
}));

export const SAFE_AREA = {
  left: 320,
  right: 1600,
  top: 180,
  bottom: 900,
  centerX: 960,
  centerY: 540,
} as const;

export interface MainBallProps {
  index: number;
  cx?: number;
  cy?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

function renderBingoBallFace({
  color,
  cx,
  cy,
  fontSize,
  innerRadius,
  outerRadius,
  shadowOpacity = 0.18,
  shadowRx,
  shadowRy,
  strokeWidth,
}: {
  color: BingoBallColor;
  cx: number;
  cy: number;
  fontSize: number;
  innerRadius: number;
  outerRadius: number;
  shadowOpacity?: number;
  shadowRx: number;
  shadowRy: number;
  strokeWidth: number;
}) {
  return (
    <>
      <ellipse
        cx={cx}
        cy={cy + outerRadius + 14}
        rx={shadowRx}
        ry={shadowRy}
        fill="black"
        opacity={shadowOpacity}
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerRadius}
        fill={color.bg}
        stroke={color.deep}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerRadius * 0.88}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={Math.max(1, strokeWidth * 0.55)}
      />
      <circle
        cx={cx}
        cy={cy}
        r={innerRadius}
        fill="white"
        stroke={color.deep}
        strokeWidth={Math.max(1.4, strokeWidth * 0.72)}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Arial Black, Trebuchet MS, system-ui, sans-serif"
        fontWeight={900}
        fontSize={fontSize}
        fill={color.bg}
        stroke={color.deep}
        strokeWidth={Math.max(0.8, fontSize * 0.026)}
        paintOrder="stroke"
      >
        {color.letter}
      </text>
      <ellipse
        cx={cx - outerRadius * 0.38}
        cy={cy - outerRadius * 0.54}
        rx={outerRadius * 0.33}
        ry={outerRadius * 0.17}
        fill="white"
        opacity="0.5"
      />
      <path
        d={`M ${cx - outerRadius * 0.52} ${cy - outerRadius * 0.1} C ${cx - outerRadius * 0.18} ${cy - outerRadius * 0.24}, ${cx + outerRadius * 0.08} ${cy - outerRadius * 0.16}, ${cx + outerRadius * 0.3} ${cy + outerRadius * 0.04}`}
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeLinecap="round"
        strokeWidth={Math.max(1, strokeWidth * 0.42)}
      />
    </>
  );
}

export function MainBingoBall({ index, cx, cy, style, children }: MainBallProps) {
  const x = cx ?? MAIN_START_X + index * MAIN_GAP;
  const y = cy ?? MAIN_CY;
  const color = BALL_COLORS[index];

  return (
    <g style={style}>
      {renderBingoBallFace({
        color,
        cx: x,
        cy: y,
        fontSize: MAIN_BALL_R * 0.88,
        innerRadius: MAIN_BALL_R * 0.62,
        outerRadius: MAIN_BALL_R,
        shadowRx: MAIN_BALL_R * 0.75,
        shadowRy: 10,
        strokeWidth: 3,
      })}
      {children}
    </g>
  );
}

/** Small decorative bingo ball that still keeps the official B/I/N/G/O face styling. */
export function SmallBingoBall({
  cx,
  cy,
  r = 28,
  color,
  style,
}: {
  cx: number;
  cy: number;
  r?: number;
  color: BingoBallColor;
  style?: CSSProperties;
}) {
  return (
    <g style={style}>
      {renderBingoBallFace({
        color,
        cx,
        cy,
        fontSize: Math.max(10, r * 0.84),
        innerRadius: r * 0.58,
        outerRadius: r,
        shadowOpacity: 0.14,
        shadowRx: r * 0.72,
        shadowRy: Math.max(4, r * 0.18),
        strokeWidth: Math.max(1.4, r * 0.08),
      })}
    </g>
  );
}

export const SMALL_PALETTE = BALL_COLORS;

export type BingoMotionStyle = CSSProperties & Record<`--${string}`, string>;

export function createBingoArrivalStyle(options: {
  delay?: number;
  duration: number;
  fromX: number;
  fromY: number;
  overshootX?: number;
  overshootY?: number;
  timingFunction?: string;
}): BingoMotionStyle {
  const {
    delay = 0,
    duration,
    fromX,
    fromY,
    overshootX = 0,
    overshootY = 0,
    timingFunction = "cubic-bezier(.22,1,.36,1)",
  } = options;

  return {
    "--from-x": `${fromX}px`,
    "--from-y": `${fromY}px`,
    "--overshoot-x": `${overshootX}px`,
    "--overshoot-y": `${overshootY}px`,
    animation: `wink-bingo-arrive ${duration}s ${timingFunction} infinite`,
    animationDelay: `${delay}s`,
    transformOrigin: "0 0",
  };
}

export function createBingoSpiralLetterStyle(options: {
  delay?: number;
  duration: number;
  orbitRadius: number;
  spinMid?: number;
  spinStart: number;
  timingFunction?: string;
}): BingoMotionStyle {
  const {
    delay = 0,
    duration,
    orbitRadius,
    spinMid = 24,
    spinStart,
    timingFunction = "cubic-bezier(.2,1,.32,1)",
  } = options;

  return {
    "--orbit-r": `${orbitRadius}px`,
    "--spin-mid": `${spinMid}deg`,
    "--spin-start": `${spinStart}deg`,
    animation: `wink-bingo-spiral-letter ${duration}s ${timingFunction} infinite`,
    animationDelay: `${delay}s`,
    transformOrigin: "0 0",
  };
}
