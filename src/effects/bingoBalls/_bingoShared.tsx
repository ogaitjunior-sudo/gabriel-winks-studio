import type { CSSProperties, ReactNode } from "react";

/** The 5 main BINGO balls — large, centered, always legible. */
export const BINGO_LETTERS = ["B", "I", "N", "G", "O"] as const;

export const BALL_COLORS = [
  { bg: "hsl(0 80% 58%)",    deep: "hsl(0 70% 40%)" },     // B - red
  { bg: "hsl(35 95% 55%)",   deep: "hsl(28 85% 40%)" },    // I - orange
  { bg: "hsl(50 95% 55%)",   deep: "hsl(42 80% 40%)" },    // N - yellow
  { bg: "hsl(140 60% 48%)",  deep: "hsl(140 55% 32%)" },   // G - green
  { bg: "hsl(210 80% 55%)",  deep: "hsl(212 70% 38%)" },   // O - blue
] as const;

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

export function MainBingoBall({ index, cx, cy, style, children }: MainBallProps) {
  const x = cx ?? MAIN_START_X + index * MAIN_GAP;
  const y = cy ?? MAIN_CY;
  const c = BALL_COLORS[index];
  const id = `bb-${index}`;
  return (
    <g style={style}>
      <defs>
        <radialGradient id={`${id}-grad`} cx="35%" cy="32%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="35%" stopColor={c.bg} />
          <stop offset="100%" stopColor={c.deep} />
        </radialGradient>
      </defs>
      {/* shadow */}
      <ellipse cx={x} cy={y + MAIN_BALL_R + 14} rx={MAIN_BALL_R * 0.75} ry={10} fill="black" opacity="0.18" />
      {/* ball */}
      <circle cx={x} cy={y} r={MAIN_BALL_R} fill={`url(#${id}-grad)`} stroke={c.deep} strokeWidth="2.5" />
      {/* inner white circle for letter */}
      <circle cx={x} cy={y} r={MAIN_BALL_R * 0.62} fill="white" stroke={c.deep} strokeWidth="2" />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight={900}
        fontSize={MAIN_BALL_R * 0.9}
        fill={c.deep}
      >
        {BINGO_LETTERS[index]}
      </text>
      {/* highlight */}
      <ellipse cx={x - MAIN_BALL_R * 0.4} cy={y - MAIN_BALL_R * 0.55} rx={MAIN_BALL_R * 0.35} ry={MAIN_BALL_R * 0.18} fill="white" opacity="0.45" />
      {children}
    </g>
  );
}

/** Small decorative ball (no letter) */
export function SmallBingoBall({ cx, cy, r = 28, color, style }: { cx: number; cy: number; r?: number; color: { bg: string; deep: string }; style?: CSSProperties }) {
  const id = `sb-${cx}-${cy}-${r}`;
  return (
    <g style={style}>
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="32%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="35%" stopColor={color.bg} />
          <stop offset="100%" stopColor={color.deep} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-g)`} stroke={color.deep} strokeWidth="1.5" />
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.5} rx={r * 0.3} ry={r * 0.14} fill="white" opacity="0.5" />
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
