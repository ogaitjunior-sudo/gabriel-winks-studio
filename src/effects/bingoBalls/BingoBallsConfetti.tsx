import { EffectSvg } from "../_shared";
import { MainBingoBall, SmallBingoBall, BINGO_LETTERS, SMALL_PALETTE } from "./_bingoShared";

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  x: 240 + ((i * 89) % 1440),
  delay: (i * 0.13) % 2.6,
  color: SMALL_PALETTE[i % SMALL_PALETTE.length],
  size: 14 + ((i * 5) % 14),
}));

export function BingoBallsConfetti({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {CONFETTI.map((c, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${c.x}px 120px`,
            animation: "wink-shower 3.2s linear infinite",
            animationDelay: `${c.delay}s`,
          }}
        >
          <SmallBingoBall cx={c.x} cy={120} r={c.size} color={c.color} />
        </g>
      ))}
      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall key={i} index={i} />
      ))}
    </EffectSvg>
  );
}
