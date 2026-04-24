import { EffectSvg } from "../_shared";

const PETALS = Array.from({ length: 24 }, (_, i) => {
  const ang = (i / 24) * Math.PI * 2;
  return { ang, dx: Math.cos(ang), dy: Math.sin(ang) };
});

export function FireworksChrysanthemum({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <defs>
        <radialGradient id="chrys-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(50 100% 80%)" />
          <stop offset="100%" stopColor="hsl(20 90% 55%)" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 3s ease-out infinite" }}>
        {PETALS.map((p, i) => (
          <line
            key={i}
            x1={960 + p.dx * 30}
            y1={540 + p.dy * 30}
            x2={960 + p.dx * 280}
            y2={540 + p.dy * 280}
            stroke="url(#chrys-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}
        {PETALS.map((p, i) => (
          <circle key={`t-${i}`} cx={960 + p.dx * 280} cy={540 + p.dy * 280} r={6} fill="hsl(45 100% 75%)" />
        ))}
        <circle cx={960} cy={540} r={28} fill="hsl(45 100% 80%)" />
      </g>
    </EffectSvg>
  );
}
