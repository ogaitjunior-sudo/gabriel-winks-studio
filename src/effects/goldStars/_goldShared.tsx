import { GOLD, GOLD_DEEP, GOLD_LIGHT, starPath } from "../_shared";

export const GOLD_SAFE_AREA = {
  left: 340,
  right: 1580,
  top: 170,
  bottom: 910,
  centerX: 960,
  centerY: 540,
} as const;

export const GOLD_ACCENTS = [
  GOLD,
  "hsl(42 100% 70%)",
  GOLD_LIGHT,
  "hsl(39 84% 52%)",
  "hsl(50 100% 92%)",
] as const;

export const GOLD_GLOW = "hsl(43 100% 72%)";
export const GOLD_DUST = "hsl(48 90% 88%)";

export function glowId(prefix: string, suffix: string | number) {
  return `${prefix}-${suffix}-glow`;
}

export function goldGlowGradient(id: string, midOpacity = 0.34, outerColor = GOLD_DEEP) {
  return (
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.86" />
      <stop offset="24%" stopColor={GOLD_GLOW} stopOpacity={Math.max(midOpacity * 0.78, 0.1)} />
      <stop offset="58%" stopColor={GOLD_GLOW} stopOpacity={Math.max(midOpacity * 0.26, 0.04)} />
      <stop offset="100%" stopColor={outerColor} stopOpacity="0" />
    </radialGradient>
  );
}

export function glowCircle(
  glow: string,
  cx: number,
  cy: number,
  r: number,
  opacity = 1
) {
  return (
    <g opacity={opacity}>
      <ellipse cx={cx} cy={cy} rx={r * 0.96} ry={r * 0.72} fill={`url(#${glow})`} opacity="0.34" />
      <ellipse cx={cx - r * 0.04} cy={cy - r * 0.06} rx={r * 0.58} ry={r * 0.42} fill={`url(#${glow})`} opacity="0.26" />
      <ellipse cx={cx + r * 0.05} cy={cy + r * 0.03} rx={r * 0.32} ry={r * 0.24} fill={`url(#${glow})`} opacity="0.18" />
    </g>
  );
}

export function goldStar(cx: number, cy: number, r: number, fill = GOLD, stroke = GOLD_LIGHT, strokeWidth = 1.2) {
  return <path d={starPath(cx, cy, r)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
}

export function dustDot(cx: number, cy: number, r = 4, opacity = 0.48) {
  return <circle cx={cx} cy={cy} r={r} fill={GOLD_DUST} opacity={opacity} />;
}

export function sparkleCross(cx: number, cy: number, size: number, color = GOLD_LIGHT) {
  const inner = size * 0.18;

  return (
    <g opacity="0.88">
      <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <line x1={cx} y1={cy - size} x2={cx} y2={cy + size} stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <line
        x1={cx - size * 0.72}
        y1={cy - size * 0.72}
        x2={cx + size * 0.72}
        y2={cy + size * 0.72}
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.66"
      />
      <line
        x1={cx - size * 0.72}
        y1={cy + size * 0.72}
        x2={cx + size * 0.72}
        y2={cy - size * 0.72}
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.66"
      />
      <path d={starPath(cx, cy, inner, inner * 0.42)} fill={color} opacity="0.72" />
    </g>
  );
}
