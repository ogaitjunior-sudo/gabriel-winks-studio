import { EffectSvg } from "../_shared";

interface BlastProps { cx: number; cy: number; size: number; color: string; delay: number; rays: number; }

function Blast({ cx, cy, size, color, delay, rays }: BlastProps) {
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "wink-burst 3.6s ease-out infinite", animationDelay: `${delay}s` }}>
      <circle cx={cx} cy={cy} r={size * 0.25} fill={color} opacity="0.5" />
      {Array.from({ length: rays }).map((_, i) => {
        const a = (Math.PI * 2 * i) / rays;
        const x2 = cx + Math.cos(a) * size;
        const y2 = cy + Math.sin(a) * size;
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <circle cx={x2} cy={y2} r="5" fill="hsl(50 100% 80%)" />
          </g>
        );
      })}
    </g>
  );
}

export function FireworksGrandFinale({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <Blast cx={520}  cy={520} size={220} color="hsl(20 95% 60%)" delay={0}    rays={12} />
      <Blast cx={1400} cy={520} size={220} color="hsl(280 80% 65%)" delay={0.3} rays={12} />
      <Blast cx={960}  cy={540} size={340} color="hsl(45 95% 60%)"  delay={0.6} rays={16} />
    </EffectSvg>
  );
}
