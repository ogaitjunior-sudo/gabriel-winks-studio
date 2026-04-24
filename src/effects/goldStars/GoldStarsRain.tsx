import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, dustDot, goldStar } from "./_goldShared";

const DROPS = Array.from({ length: 16 }, (_, i) => ({
  x: 240 + ((i * 109) % 1440),
  delay: (i * 0.15) % 2.6,
  size: 10 + (i % 4) * 3,
  speed: 2.9 + (i % 3) * 0.2,
}));

export function GoldStarsRain({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {DROPS.map((drop, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${drop.x}px 150px`,
            animation: `wink-shower ${drop.speed}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        >
          {goldStar(drop.x, 150, drop.size, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
          {dustDot(drop.x + 18, 188, 3, 0.24)}
        </g>
      ))}
    </EffectSvg>
  );
}
