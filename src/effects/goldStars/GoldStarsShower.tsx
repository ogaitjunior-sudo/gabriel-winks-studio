import { EffectSvg } from "../_shared";
import { dustDot, GOLD_ACCENTS, goldStar } from "./_goldShared";

const DROPS = Array.from({ length: 14 }, (_, i) => ({
  x: 260 + ((i * 101) % 1400),
  delay: (i * 0.19) % 2.8,
  size: 12 + (i % 3) * 4,
  speed: 3 + (i % 3) * 0.12,
}));

export function GoldStarsShower({ playing }: { playing: boolean }) {
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
          {dustDot(drop.x + drop.size * 1.5, 180, 3, 0.3)}
        </g>
      ))}
    </EffectSvg>
  );
}
