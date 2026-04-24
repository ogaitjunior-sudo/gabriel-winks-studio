import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MAIN_CENTER_X, MAIN_CY, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const ORBITERS = Array.from({ length: 12 }, (_, i) => ({
  radius: 230 + (i % 3) * 44,
  r: 20 + (i % 2) * 4,
  color: i % SMALL_PALETTE.length,
  delay: i * 0.09,
  duration: 3.4 - (i % 3) * 0.25,
}));

const WORD_ORBITERS = MAIN_BALLS.map((ball, i) => ({
  ...ball,
  r: 20,
  color: (i + 1) % SMALL_PALETTE.length,
  delay: 1.76 + i * 0.08,
}));

export function BingoBallsOrbitImpact({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {ORBITERS.map((orbiter, i) => (
        <g key={i} style={{ transform: `translate(${MAIN_CENTER_X}px, ${MAIN_CY}px)` }}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${orbiter.radius}px`,
              transformOrigin: "0 0",
              animation: `wink-orbit ${orbiter.duration}s linear infinite`,
              animationDelay: `${orbiter.delay}s`,
            }}
          >
            <SmallBingoBall cx={0} cy={0} r={orbiter.r} color={SMALL_PALETTE[orbiter.color]} />
          </g>
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: "wink-burst 3.4s ease-out infinite",
          animationDelay: "1.02s",
        }}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 8;
          return (
            <path
              key={i}
              d={starPath(MAIN_CENTER_X + Math.cos(angle) * 100, MAIN_CY + Math.sin(angle) * 100, 18)}
              fill={GOLD}
              stroke={GOLD_LIGHT}
              strokeWidth="1"
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
            animation: "wink-bounce-in 3.4s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.18 + i * 0.07}s`,
          }}
        />
      ))}

      {WORD_ORBITERS.map((orbiter, i) => (
        <g key={`word-${i}`} style={{ transform: `translate(${orbiter.x}px, ${orbiter.y}px)` }}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": "150px",
              transformOrigin: "0 0",
              animation: "wink-orbit 2.6s linear infinite",
              animationDelay: `${orbiter.delay}s`,
            }}
          >
            <SmallBingoBall cx={0} cy={0} r={orbiter.r} color={SMALL_PALETTE[orbiter.color]} />
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
