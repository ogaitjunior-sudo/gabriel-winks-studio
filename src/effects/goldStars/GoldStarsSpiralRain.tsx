import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS } from "./_goldShared";

const PATH_D = "M 280 160 Q 520 180 760 420 T 1220 760 T 1640 900";

export function GoldStarsSpiralRain({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d={PATH_D} stroke={GOLD} strokeWidth="2" fill="none" opacity="0.1" />

      {Array.from({ length: 13 }, (_, i) => (
        <g
          key={i}
          style={{
            offsetPath: `path('${PATH_D}')`,
            animation: "wink-trail 3.4s linear infinite, wink-swirl 3.4s ease-in-out infinite",
            animationDelay: `${i * 0.18}s, ${i * 0.1}s`,
          }}
        >
          <path d={starPath(0, 0, 14 + (i % 3) * 4)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      {Array.from({ length: 7 }, (_, i) => (
        <circle
          key={`dust-${i}`}
          cx={1120 + i * 70}
          cy={780 + (i % 2) * 34}
          r="4"
          fill={GOLD_LIGHT}
          opacity="0.45"
          style={{ animation: "wink-fade-loop 3.4s ease-in-out infinite", animationDelay: `${1.2 + i * 0.12}s` }}
        />
      ))}
    </EffectSvg>
  );
}
