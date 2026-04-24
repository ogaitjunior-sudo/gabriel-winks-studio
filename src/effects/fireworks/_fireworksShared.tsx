import { GOLD_LIGHT, starPath } from "../_shared";

export const FIREWORK_SAFE_AREA = {
  left: 320,
  right: 1600,
  top: 140,
  bottom: 900,
  centerX: 960,
  centerY: 520,
  launchY: 900,
} as const;

export const FIREWORK_ACCENTS = [
  "hsl(45 95% 62%)",
  "hsl(18 94% 60%)",
  "hsl(195 88% 62%)",
  "hsl(282 82% 70%)",
  "hsl(150 70% 56%)",
  "hsl(50 100% 82%)",
] as const;

export function fireworkGlowId(prefix: string, suffix: string | number) {
  return `${prefix}-${suffix}-glow`;
}

export function FireworkGlowGradient({
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
      <stop offset="0%" stopColor="white" stopOpacity="0.86" />
      <stop offset="24%" stopColor={inner} stopOpacity="0.44" />
      <stop offset="58%" stopColor={outer} stopOpacity="0.12" />
      <stop offset="100%" stopColor={outer} stopOpacity="0" />
    </radialGradient>
  );
}

export function GlowFlash({
  glowId,
  cx,
  cy,
  r,
  opacity = 0.9,
  animation = "wink-glow-pulse 3.6s ease-in-out infinite",
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
      <ellipse cx={cx} cy={cy} rx={r * 0.94} ry={r * 0.72} fill={`url(#${glowId})`} opacity={opacity * 0.42} />
      <ellipse cx={cx} cy={cy - r * 0.05} rx={r * 0.56} ry={r * 0.4} fill={`url(#${glowId})`} opacity={opacity * 0.28} />
      <circle cx={cx} cy={cy} r={r * 0.18} fill="white" opacity={opacity * 0.12} />
    </g>
  );
}

export function RocketTrail({
  x,
  y,
  tx,
  ty,
  color,
  delay,
  duration = 3.8,
  headRadius = 6,
  strokeWidth = 3,
  opacity = 0.76,
}: {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  delay: number;
  duration?: number;
  headRadius?: number;
  strokeWidth?: number;
  opacity?: number;
}) {
  return (
    <g
      style={{
        // @ts-expect-error css custom props
        "--tx": `${tx}px`,
        "--ty": `${ty}px`,
        animation: `wink-comet ${duration}s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <line
        x1={x}
        y1={y}
        x2={x - tx * 0.22}
        y2={y - ty * 0.22}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
      <circle cx={x} cy={y} r={headRadius} fill={color} />
    </g>
  );
}

export function ExplosionRing({
  cx,
  cy,
  radius,
  color,
  delay,
  duration = 3.6,
  strokeWidth = 4,
}: {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  delay: number;
  duration?: number;
  strokeWidth?: number;
}) {
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `wink-ring-expand ${duration}s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </g>
  );
}

export function FireworkBurst({
  cx,
  cy,
  radius,
  color,
  tip = GOLD_LIGHT,
  delay,
  duration = 3.8,
  rays = 14,
  core = 16,
  width = 2.8,
}: {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  tip?: string;
  delay: number;
  duration?: number;
  rays?: number;
  core?: number;
  width?: number;
}) {
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `wink-burst ${duration}s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <circle cx={cx} cy={cy} r={core} fill="white" opacity="0.82" />
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / rays;
        const x2 = cx + Math.cos(angle) * radius;
        const y2 = cy + Math.sin(angle) * radius;
        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle cx={x2} cy={y2} r="5" fill={tip} />
          </g>
        );
      })}
    </g>
  );
}

export function FireworkStars({
  cx,
  cy,
  radius,
  delay,
  duration = 3.8,
  count = 8,
  color = GOLD_LIGHT,
  size = 14,
}: {
  cx: number;
  cy: number;
  radius: number;
  delay: number;
  duration?: number;
  count?: number;
  color?: string;
  size?: number;
}) {
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `wink-burst ${duration}s ease-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        return <path key={i} d={starPath(x, y, size)} fill={color} opacity="0.88" />;
      })}
    </g>
  );
}
