import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const DROPS = Array.from({ length: 12 }, (_, i) => ({
  x: 280 + i * 125,
  delay: (i * 0.16) % 1.8,
  r: 20 + (i % 3) * 4,
  color: i % SMALL_PALETTE.length,
}));

const LANDED = Array.from({ length: 7 }, (_, i) => ({
  x: 420 + i * 180,
  y: 830 - (i % 2) * 45,
  r: 20,
  color: (i + 2) % SMALL_PALETTE.length,
  delay: i * 0.1,
}));

export function BingoBallsRocketDrop({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {DROPS.map((ball, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${ball.x}px 110px`,
            animation: "wink-shower 3.4s linear infinite",
            animationDelay: `${ball.delay}s`,
          }}
        >
          <SmallBingoBall cx={ball.x} cy={110} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      {LANDED.map((ball, i) => (
        <SmallBingoBall
          key={`landed-${i}`}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={SMALL_PALETTE[ball.color]}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-loop 1.5s ease-in-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-pop-up 3.4s cubic-bezier(.34,1.56,.64,1) infinite, wink-bounce-loop 1.5s ease-in-out infinite",
            animationDelay: `${1.18 + i * 0.08}s, ${2.08 + i * 0.06}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y - 170}px`,
              animation: "wink-sparkle 3.4s ease-in-out infinite",
              animationDelay: `${2 + i * 0.06}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 170, 16)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
