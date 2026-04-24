import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS } from "./_goldShared";

const PATH_D = "M 180 540 Q 420 360 660 540 T 1140 540 T 1740 540";

export function GoldStarsWaveSweep({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d={PATH_D} stroke={GOLD} strokeWidth="2" fill="none" opacity="0.14" />
      <path d={PATH_D} stroke={GOLD_LIGHT} strokeWidth="10" fill="none" opacity="0.06" />

      {Array.from({ length: 14 }, (_, i) => (
        <g
          key={i}
          style={{
            offsetPath: `path('${PATH_D}')`,
            animation: "wink-trail 3.2s linear infinite, wink-glow-pulse 1.6s ease-in-out infinite",
            animationDelay: `${i * 0.14}s, ${i * 0.08}s`,
          }}
        >
          <path d={starPath(0, 0, 16 + (i % 4) * 4)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}
    </EffectSvg>
  );
}
