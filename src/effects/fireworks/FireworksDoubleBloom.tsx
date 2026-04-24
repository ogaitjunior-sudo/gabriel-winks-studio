import { EffectSvg } from "../_shared";

const PALETTE = ["hsl(0 85% 60%)", "hsl(45 95% 60%)", "hsl(195 90% 60%)", "hsl(280 75% 65%)"];

function Bloom({ cx, cy, hue, delay }: { cx: number; cy: number; hue: string; delay: number }) {
  const rays = Array.from({ length: 14 }, (_, i) => i);
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "wink-burst 2.6s ease-out infinite", animationDelay: `${delay}s` }}>
      {rays.map((i) => {
        const ang = (i / rays.length) * Math.PI * 2;
        const x2 = cx + Math.cos(ang) * 220;
        const y2 = cy + Math.sin(ang) * 220;
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={hue} strokeWidth="3" strokeLinecap="round" opacity="0.9" />;
      })}
      <circle cx={cx} cy={cy} r={18} fill={hue} opacity="0.95" />
    </g>
  );
}

export function FireworksDoubleBloom({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <Bloom cx={680} cy={460} hue={PALETTE[0]} delay={0} />
      <Bloom cx={1240} cy={520} hue={PALETTE[2]} delay={0.6} />
      <Bloom cx={960} cy={620} hue={PALETTE[1]} delay={1.2} />
      <Bloom cx={820} cy={380} hue={PALETTE[3]} delay={1.8} />
    </EffectSvg>
  );
}
