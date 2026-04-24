import { EffectSvg } from "../_shared";

const BURSTS = [
  { cx: 260, cy: 690, radius: 180, color: "hsl(10 92% 60%)", tip: "hsl(42 100% 74%)", delay: 0 },
  { cx: 540, cy: 560, radius: 220, color: "hsl(42 95% 60%)", tip: "hsl(52 100% 82%)", delay: 0.3 },
  { cx: 860, cy: 430, radius: 240, color: "hsl(195 88% 60%)", tip: "hsl(195 100% 85%)", delay: 0.6 },
  { cx: 1180, cy: 440, radius: 240, color: "hsl(282 82% 68%)", tip: "hsl(292 100% 84%)", delay: 0.9 },
  { cx: 1480, cy: 570, radius: 220, color: "hsl(150 70% 56%)", tip: "hsl(160 90% 84%)", delay: 1.2 },
  { cx: 1660, cy: 700, radius: 180, color: "hsl(24 94% 58%)", tip: "hsl(44 100% 78%)", delay: 1.5 },
];

const RAYS = 14;

export function FireworksFanSweep({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {BURSTS.map((burst, burstIndex) => (
        <g
          key={burstIndex}
          style={{
            transformOrigin: `${burst.cx}px ${burst.cy}px`,
            animation: "wink-burst 3.4s ease-out infinite",
            animationDelay: `${burst.delay}s`,
          }}
        >
          {Array.from({ length: RAYS }).map((_, i) => {
            const angle = ((-110 + (220 / (RAYS - 1)) * i) * Math.PI) / 180;
            const length = burst.radius + (i % 3) * 28;
            const x = burst.cx + Math.cos(angle) * length;
            const y = burst.cy + Math.sin(angle) * length;

            return (
              <g key={i}>
                <line
                  x1={burst.cx}
                  y1={burst.cy}
                  x2={x}
                  y2={y}
                  stroke={burst.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.92"
                />
                <circle cx={x} cy={y} r="5" fill={burst.tip} />
              </g>
            );
          })}
          <circle cx={burst.cx} cy={burst.cy} r="14" fill="white" opacity="0.85" />
        </g>
      ))}
    </EffectSvg>
  );
}
