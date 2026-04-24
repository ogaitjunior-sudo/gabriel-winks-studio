import { EffectSvg } from "../_shared";
import { dustDot, GOLD_ACCENTS, goldStar } from "./_goldShared";

const PATH_D = "M 220 560 Q 520 320 820 540 T 1380 540 T 1700 500";

export function GoldStarsRibbon({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d={PATH_D} stroke="hsl(43 94% 60%)" strokeWidth="2.2" fill="none" opacity="0.16" />
      <path d={PATH_D} stroke="hsl(48 100% 84%)" strokeWidth="12" fill="none" opacity="0.05" />

      {Array.from({ length: 9 }, (_, i) => (
        <g
          key={i}
          style={{
            offsetPath: `path('${PATH_D}')`,
            animation: "wink-trail 3.2s linear infinite",
            animationDelay: `${i * 0.24}s`,
          }}
        >
          {goldStar(0, 0, 18 + (i % 2) * 4, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
        </g>
      ))}

      {Array.from({ length: 7 }, (_, i) => (
        <g key={`dust-${i}`} style={{ animation: "wink-fade-loop 3.2s ease-in-out infinite", animationDelay: `${0.9 + i * 0.14}s` }}>
          {dustDot(520 + i * 150, 520 + ((i % 2) * 24 - 12), 4, 0.26)}
        </g>
      ))}
    </EffectSvg>
  );
}
