import { EffectSvg } from "../_shared";
import { MainBingoBall, SmallBingoBall, BINGO_LETTERS, SMALL_PALETTE } from "./_bingoShared";

const RAIN = Array.from({ length: 16 }, (_, i) => ({
  x: 200 + ((i * 103) % 1520),
  delay: (i * 0.18) % 3,
  size: 18 + ((i * 4) % 16),
  color: SMALL_PALETTE[i % SMALL_PALETTE.length],
  speed: 3 + ((i * 0.17) % 1.4),
}));

export function BingoBallsRain({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {RAIN.map((r, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${r.x}px 100px`,
            animation: `wink-shower ${r.speed}s linear infinite`,
            animationDelay: `${r.delay}s`,
          }}
        >
          <SmallBingoBall cx={r.x} cy={100} r={r.size} color={r.color} />
        </g>
      ))}
      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall key={i} index={i} />
      ))}
    </EffectSvg>
  );
}
