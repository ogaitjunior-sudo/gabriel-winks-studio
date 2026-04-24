import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS } from "./_goldShared";

const PATH_D = "M 200 660 C 440 260 760 260 980 540 S 1460 840 1720 420";

export function GoldStarsRibbonTrail({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d={PATH_D} stroke={GOLD} strokeWidth="3" fill="none" opacity="0.16" />
      <path d={PATH_D} stroke={GOLD_LIGHT} strokeWidth="14" fill="none" opacity="0.06" />

      {Array.from({ length: 12 }, (_, i) => (
        <g
          key={i}
          style={{
            offsetPath: `path('${PATH_D}')`,
            animation: "wink-trail 3.4s linear infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        >
          <path d={starPath(0, 0, 14 + (i % 3) * 5)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      {Array.from({ length: 9 }, (_, i) => (
        <circle
          key={`dust-${i}`}
          cx={380 + i * 150}
          cy={560 + ((i % 2) * 40 - 20)}
          r="4"
          fill={GOLD_LIGHT}
          opacity="0.42"
          style={{ animation: "wink-fade-loop 3.4s ease-in-out infinite", animationDelay: `${0.8 + i * 0.1}s` }}
        />
      ))}
    </EffectSvg>
  );
}
