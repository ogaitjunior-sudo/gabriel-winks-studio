import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, dustDot, goldStar, sparkleCross } from "./_goldShared";

const PTS = [
  { x: 610, y: 350, r: 16, delay: 0 },
  { x: 780, y: 290, r: 22, delay: 0.22 },
  { x: 960, y: 250, r: 28, delay: 0.44 },
  { x: 1140, y: 300, r: 20, delay: 0.66 },
  { x: 1320, y: 380, r: 16, delay: 0.88 },
  { x: 1250, y: 670, r: 18, delay: 0.18 },
  { x: 1020, y: 740, r: 20, delay: 0.4 },
  { x: 820, y: 710, r: 18, delay: 0.62 },
  { x: 650, y: 590, r: 14, delay: 0.84 },
  { x: 960, y: 540, r: 34, delay: 0.28 },
];

export function GoldStarsTwinkle({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {PTS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          {goldStar(star.x, star.y, star.r, GOLD_ACCENTS[i % GOLD_ACCENTS.length], undefined, i === 9 ? 1.5 : 1)}
        </g>
      ))}

      {PTS.filter((_, i) => i !== 9).map((star, i) => (
        <g
          key={`cross-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-fade-loop 2.8s ease-in-out infinite",
            animationDelay: `${0.18 + i * 0.12}s`,
          }}
        >
          {sparkleCross(star.x, star.y, star.r * 1.2)}
        </g>
      ))}

      {dustDot(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 6, 0.36)}
    </EffectSvg>
  );
}
