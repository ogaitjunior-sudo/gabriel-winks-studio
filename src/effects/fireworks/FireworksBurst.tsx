import { EffectSvg } from "../_shared";

const RAYS = 14;

export function FireworksBurst({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <defs>
        <radialGradient id="fwb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(50 100% 85%)" stopOpacity="1" />
          <stop offset="60%" stopColor="hsl(40 100% 60%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(20 90% 50%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* glow core */}
      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.4s ease-out infinite" }}>
        <circle cx="960" cy="540" r="80" fill="url(#fwb-core)" />
      </g>
      {/* rays */}
      {Array.from({ length: RAYS }).map((_, i) => {
        const angle = (360 / RAYS) * i;
        return (
          <g
            key={i}
            style={{
              transformOrigin: "960px 540px",
              transform: `rotate(${angle}deg)`,
            }}
          >
            <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.4s ease-out infinite", animationDelay: `${i * 0.02}s` }}>
              <line x1="960" y1="540" x2="960" y2="220" stroke="hsl(45 95% 65%)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <circle cx="960" cy="220" r="6" fill="hsl(50 100% 80%)" />
            </g>
          </g>
        );
      })}
    </EffectSvg>
  );
}
