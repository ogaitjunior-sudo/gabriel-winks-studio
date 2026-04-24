import { EffectSvg, GOLD_LIGHT } from "../_shared";
import { BINGO_LETTERS, MAIN_GAP, MAIN_START_X, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const WAVE = BINGO_LETTERS.map((_, i) => ({
  x: MAIN_START_X + i * MAIN_GAP,
  y: 540 + Math.sin((i / 4) * Math.PI * 2) * 90,
  delay: i * 0.18,
}));

export function BingoBallsWave({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d="M 330 540 C 520 330, 700 750, 900 540 S 1300 330, 1590 540" fill="none" stroke={GOLD_LIGHT} strokeWidth="4" strokeLinecap="round" opacity="0.2" />

      {WAVE.map((ball, i) => (
        <SmallBingoBall
          key={`rider-${i}`}
          cx={ball.x}
          cy={ball.y - 170}
          r={22}
          color={SMALL_PALETTE[(i + 1) % SMALL_PALETTE.length]}
          style={{
            transformOrigin: `${ball.x}px ${ball.y - 170}px`,
            animation: "wink-bounce-loop 1.4s ease-in-out infinite",
            animationDelay: `${ball.delay + 0.08}s`,
          }}
        />
      ))}

      {WAVE.map((ball, i) => (
        <MainBingoBall
          key={i}
          index={i}
          cx={ball.x}
          cy={ball.y}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-loop 1.4s ease-in-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}
    </EffectSvg>
  );
}
