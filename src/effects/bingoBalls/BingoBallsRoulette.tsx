import { EffectSvg } from "../_shared";
import { MainBingoBall, SmallBingoBall, BINGO_LETTERS, SMALL_PALETTE } from "./_bingoShared";

const ORBIT = Array.from({ length: 10 }, (_, i) => i);

export function BingoBallsRoulette({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {/* Outer orbit */}
      {ORBIT.map((i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 540px",
            transform: "translate(960px, 540px)",
            // @ts-expect-error css
            "--orbit-r": "440px",
            animation: "wink-orbit 7s linear infinite",
            animationDelay: `${(i / ORBIT.length) * -7}s`,
          }}
        >
          <SmallBingoBall cx={0} cy={0} r={26} color={SMALL_PALETTE[i % SMALL_PALETTE.length]} />
        </g>
      ))}
      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall key={i} index={i} />
      ))}
    </EffectSvg>
  );
}
