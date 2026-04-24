import { EffectSvg } from "../_shared";

const BURSTS = [
  { cx: 420, cy: 420, rx: 150, ry: 110, color: "hsl(352 86% 66%)", delay: 0 },
  { cx: 780, cy: 320, rx: 180, ry: 130, color: "hsl(42 95% 62%)", delay: 0.35 },
  { cx: 1120, cy: 320, rx: 180, ry: 130, color: "hsl(195 92% 64%)", delay: 0.7 },
  { cx: 1500, cy: 420, rx: 150, ry: 110, color: "hsl(282 82% 70%)", delay: 1.05 },
  { cx: 960, cy: 620, rx: 220, ry: 160, color: "hsl(152 70% 56%)", delay: 1.4 },
];

const SHARDS = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

export function FireworksPrismBurst({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {BURSTS.map((burst, burstIndex) => (
        <g
          key={burstIndex}
          style={{
            transformOrigin: `${burst.cx}px ${burst.cy}px`,
            animation: "wink-burst 3s ease-out infinite",
            animationDelay: `${burst.delay}s`,
          }}
        >
          {SHARDS.map((angle, i) => {
            const x = burst.cx + Math.cos(angle) * burst.rx;
            const y = burst.cy + Math.sin(angle) * burst.ry;

            return (
              <g key={i}>
                <line
                  x1={burst.cx}
                  y1={burst.cy}
                  x2={x}
                  y2={y}
                  stroke={burst.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <rect
                  x={x - 7}
                  y={y - 7}
                  width={14}
                  height={14}
                  rx={1.5}
                  fill={burst.color}
                  opacity="0.88"
                  transform={`rotate(45 ${x} ${y})`}
                />
              </g>
            );
          })}
          <circle cx={burst.cx} cy={burst.cy} r="12" fill="white" opacity="0.82" />
        </g>
      ))}
    </EffectSvg>
  );
}
