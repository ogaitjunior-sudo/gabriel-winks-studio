import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, sparkleCross } from "./_goldShared";

const HALO = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  size: 16 + (i % 3) * 4,
  delay: i * 0.12,
}));

export function GoldStarsHaloRing({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <ellipse
        cx={GOLD_SAFE_AREA.centerX}
        cy={GOLD_SAFE_AREA.centerY}
        rx={320}
        ry={210}
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
        opacity="0.14"
      />

      <ellipse
        cx={GOLD_SAFE_AREA.centerX}
        cy={GOLD_SAFE_AREA.centerY}
        rx={230}
        ry={150}
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth="1.4"
        opacity="0.12"
      />

      {HALO.map((star, i) => (
        <g key={i} transform={`translate(${GOLD_SAFE_AREA.centerX} ${GOLD_SAFE_AREA.centerY})`}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${250 + (i % 3) * 36}px`,
              transformOrigin: "0 0",
              animation: "wink-orbit 3.4s linear infinite",
              animationDelay: `${star.delay}s`,
            }}
          >
            <path d={starPath(0, 0, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-burst 3.4s ease-out infinite",
          animationDelay: "1.8s",
        }}
      >
        {sparkleCross(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 28, GOLD_LIGHT)}
      </g>
    </EffectSvg>
  );
}
