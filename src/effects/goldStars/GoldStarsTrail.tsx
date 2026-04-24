import { EffectSvg } from "../_shared";
import { dustDot, GOLD_ACCENTS } from "./_goldShared";
import { goldStar } from "./_goldShared";

const PATH_D = "M 260 700 Q 660 220 1020 320 T 1660 620";

const DUST = [
  [460, 500],
  [720, 320],
  [980, 320],
  [1260, 430],
  [1480, 560],
] as const;

export function GoldStarsTrail({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d={PATH_D} stroke="hsl(43 94% 60%)" strokeWidth="2.4" fill="none" opacity="0.14" />
      <path d={PATH_D} stroke="hsl(48 100% 84%)" strokeWidth="10" fill="none" opacity="0.06" />

      {Array.from({ length: 8 }, (_, i) => (
        <g
          key={i}
          style={{
            offsetPath: `path('${PATH_D}')`,
            animation: "wink-trail 3s ease-in-out infinite",
            animationDelay: `${i * 0.22}s`,
          }}
        >
          {goldStar(0, 0, 18 + (i % 3) * 4, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
        </g>
      ))}

      {DUST.map(([x, y], i) => (
        <g
          key={`dust-${i}`}
          style={{ animation: "wink-fade-loop 3s ease-in-out infinite", animationDelay: `${0.7 + i * 0.12}s` }}
        >
          {dustDot(x, y, 4 + (i % 2), 0.34)}
        </g>
      ))}
    </EffectSvg>
  );
}
