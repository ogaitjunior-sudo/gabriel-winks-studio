import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MAIN_CENTER_X, MAIN_CY, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const SPIRALERS = Array.from({ length: 16 }, (_, i) => ({
  angle: (360 / 16) * i,
  delay: (i * 0.11) % 1.8,
  r: 20 + (i % 4) * 3,
  color: i % SMALL_PALETTE.length,
}));

export function BingoBallsSpiralCollapse({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {SPIRALERS.map((ball, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
            transform: `rotate(${ball.angle}deg)`,
          }}
        >
          <g
            style={{
              transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
              animation: "wink-swirl 3.2s ease-in-out infinite",
              animationDelay: `${ball.delay}s`,
            }}
          >
            <SmallBingoBall cx={MAIN_CENTER_X} cy={MAIN_CY} r={ball.r} color={SMALL_PALETTE[ball.color]} />
          </g>
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: "wink-burst 3.2s ease-out infinite",
          animationDelay: "1.02s",
        }}
      >
        <circle cx={MAIN_CENTER_X} cy={MAIN_CY} r="48" fill={GOLD} opacity="0.35" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 8;
          return (
            <line
              key={i}
              x1={MAIN_CENTER_X}
              y1={MAIN_CY}
              x2={MAIN_CENTER_X + Math.cos(angle) * 130}
              y2={MAIN_CY + Math.sin(angle) * 130}
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.88"
            />
          );
        })}
      </g>

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-in 3.2s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.16 + i * 0.07}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y - 160}px`,
              animation: "wink-sparkle 3.2s ease-in-out infinite",
              animationDelay: `${1.94 + i * 0.06}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 160, 16)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
