import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, sparkleCross } from "./_goldShared";

const LAYERS = Array.from({ length: 16 }, (_, i) => ({
  x: 240 + ((i * 98) % 1440),
  y: 120 + (i % 3) * 30,
  size: 12 + (i % 4) * 3,
  speed: 2.8 + (i % 3) * 0.26,
  delay: (i * 0.1) % 2.1,
  color: GOLD_ACCENTS[i % GOLD_ACCENTS.length],
}));

const SHINE_PATH = "M 420 620 Q 960 420 1500 620";

export function GoldStarsCelebrationCascade({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {LAYERS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: `wink-shower ${star.speed}s linear infinite`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.size)} fill={star.color} stroke={GOLD_LIGHT} strokeWidth="1" opacity={0.68 + (i % 3) * 0.08} />
        </g>
      ))}

      <path d={SHINE_PATH} stroke={GOLD} strokeWidth="2" fill="none" opacity="0.12" />
      {Array.from({ length: 8 }, (_, i) => (
        <g
          key={`shine-${i}`}
          style={{
            offsetPath: `path('${SHINE_PATH}')`,
            animation: "wink-trail 3.5s linear infinite",
            animationDelay: `${1.2 + i * 0.08}s`,
          }}
        >
          {sparkleCross(0, 0, 14, GOLD_LIGHT)}
        </g>
      ))}
    </EffectSvg>
  );
}
