import { EffectSvg } from "../_shared";

const SHOTS = [
  { cx: 480,  cy: 360, hue: "hsl(0 85% 60%)",   delay: 0 },
  { cx: 1440, cy: 380, hue: "hsl(195 90% 60%)", delay: 0.5 },
  { cx: 960,  cy: 300, hue: "hsl(45 95% 60%)",  delay: 1.0 },
  { cx: 760,  cy: 520, hue: "hsl(280 75% 65%)", delay: 1.5 },
  { cx: 1200, cy: 540, hue: "hsl(140 70% 55%)", delay: 2.0 },
];

export function FireworksSkyShow({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {SHOTS.map((s, idx) => {
        const sparks = Array.from({ length: 16 }, (_, i) => {
          const ang = (i / 16) * Math.PI * 2;
          return { x: Math.cos(ang) * 180, y: Math.sin(ang) * 180 };
        });
        return (
          <g key={idx} style={{ transformOrigin: `${s.cx}px ${s.cy}px`, animation: "wink-burst 3s ease-out infinite", animationDelay: `${s.delay}s` }}>
            {sparks.map((sp, i) => (
              <circle key={i} cx={s.cx + sp.x} cy={s.cy + sp.y} r={4} fill={s.hue} />
            ))}
            <circle cx={s.cx} cy={s.cy} r={10} fill="white" opacity="0.85" />
          </g>
        );
      })}
    </EffectSvg>
  );
}
