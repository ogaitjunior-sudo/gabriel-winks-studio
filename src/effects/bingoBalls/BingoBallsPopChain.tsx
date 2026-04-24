import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const POPS = [
  { x: 260, y: 520, r: 26, color: 0, delay: 0.06 },
  { x: 440, y: 440, r: 22, color: 1, delay: 0.22 },
  { x: 620, y: 600, r: 26, color: 2, delay: 0.38 },
  { x: 820, y: 460, r: 24, color: 3, delay: 0.54 },
  { x: 1100, y: 620, r: 26, color: 4, delay: 0.7 },
  { x: 1300, y: 460, r: 24, color: 2, delay: 0.86 },
  { x: 1480, y: 610, r: 26, color: 1, delay: 1.02 },
  { x: 1660, y: 520, r: 24, color: 0, delay: 1.18 },
];

export function BingoBallsPopChain({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {POPS.map((ball, i) => (
        <g key={i}>
          {i < POPS.length - 1 ? (
            <line
              x1={ball.x}
              y1={ball.y}
              x2={POPS[i + 1].x}
              y2={POPS[i + 1].y}
              stroke={GOLD}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.18"
              style={{ animation: "wink-fade-loop 3.2s ease-in-out infinite", animationDelay: `${ball.delay}s` }}
            />
          ) : null}
          <SmallBingoBall
            cx={ball.x}
            cy={ball.y}
            r={ball.r}
            color={SMALL_PALETTE[ball.color]}
            style={{
              transformOrigin: `${ball.x}px ${ball.y}px`,
              animation: "wink-pop-up 3.2s cubic-bezier(.34,1.56,.64,1) infinite",
              animationDelay: `${ball.delay}s`,
            }}
          />
        </g>
      ))}

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-in 3.2s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.32 + i * 0.07}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y}px`,
              animation: "wink-glow-pulse 1.6s ease-in-out infinite",
              animationDelay: `${2.04 + i * 0.06}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 160, 16)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
