import { EffectSvg } from "../_shared";

export function FireworksCenterBlast({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <defs>
        <radialGradient id="fwcb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(50 100% 90%)" stopOpacity="1" />
          <stop offset="40%" stopColor="hsl(40 100% 65%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(20 90% 50%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.8s ease-out infinite" }}>
        <circle cx="960" cy="540" r="220" fill="url(#fwcb-glow)" />
      </g>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 24;
        const r = 320;
        const x2 = 960 + Math.cos(a) * r;
        const y2 = 540 + Math.sin(a) * r;
        return (
          <g key={i} style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.8s ease-out infinite", animationDelay: `${(i % 4) * 0.04}s` }}>
            <line x1="960" y1="540" x2={x2} y2={y2} stroke="hsl(45 95% 65%)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <circle cx={x2} cy={y2} r="4" fill="hsl(50 100% 80%)" />
          </g>
        );
      })}
    </EffectSvg>
  );
}
