import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const CROWN_BALLS = Array.from({ length: 9 }, (_, i) => {
  const progress = i / 8;
  return {
    x: 380 + progress * 1160,
    y: 420 - Math.sin(progress * Math.PI) * 180,
    r: i === 4 ? 40 : 28 + (i % 2) * 4,
    color: SMALL_PALETTE[i % SMALL_PALETTE.length],
    delay: i * 0.1,
  };
});

const JEWELS = [
  { x: 540, y: 210, size: 16, delay: 0.3 },
  { x: 960, y: 150, size: 26, delay: 0.8 },
  { x: 1380, y: 210, size: 16, delay: 1.3 },
];

export function BingoBallsCrownArc({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {CROWN_BALLS.map((ball, i) => (
        <SmallBingoBall
          key={i}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={ball.color}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-loop 2.2s ease-in-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}

      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall
          key={i}
          index={i}
          style={{
            transformOrigin: "center",
            animation: "wink-bounce-loop 2.2s ease-in-out infinite",
            animationDelay: `${0.4 + i * 0.08}s`,
          }}
        />
      ))}

      {JEWELS.map((jewel, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${jewel.x}px ${jewel.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${jewel.delay}s`,
          }}
        >
          <path d={starPath(jewel.x, jewel.y, jewel.size)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.2" />
        </g>
      ))}
    </EffectSvg>
  );
}
