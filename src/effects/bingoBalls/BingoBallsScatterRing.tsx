import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MAIN_CENTER_X, MAIN_CY, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const RING = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  radius: 310,
  sx: Math.cos((Math.PI * 2 * i) / 12) * 36,
  sy: Math.sin((Math.PI * 2 * i) / 12) * 36,
  r: 22 + (i % 3) * 2,
  color: i % SMALL_PALETTE.length,
  delay: i * 0.08,
}));

const HALO = Array.from({ length: 10 }, (_, i) => ({
  delay: 1.82 + i * 0.08,
  color: (i + 2) % SMALL_PALETTE.length,
}));

export function BingoBallsScatterRing({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {RING.map((ball, i) => (
        <g key={i} style={{ transform: `translate(${MAIN_CENTER_X}px, ${MAIN_CY}px)` }}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${ball.radius}px`,
              transformOrigin: "0 0",
              animation: "wink-orbit 3.5s linear infinite",
              animationDelay: `${ball.delay}s`,
            }}
          >
            <SmallBingoBall cx={0} cy={0} r={ball.r} color={SMALL_PALETTE[ball.color]} />
          </g>
        </g>
      ))}

      {RING.map((ball, i) => {
        const x = MAIN_CENTER_X + Math.cos((Math.PI * 2 * i) / 12) * ball.radius;
        const y = MAIN_CY + Math.sin((Math.PI * 2 * i) / 12) * ball.radius;

        return (
          <SmallBingoBall
            key={`scatter-${i}`}
            cx={x}
            cy={y}
            r={18}
            color={SMALL_PALETTE[(ball.color + 1) % SMALL_PALETTE.length]}
            style={{
              // @ts-expect-error css custom props
              "--sx": `${ball.sx}px`,
              "--sy": `${ball.sy}px`,
              transformOrigin: `${x}px ${y}px`,
              animation: "wink-scatter 3.5s ease-in-out infinite",
              animationDelay: `${0.86 + ball.delay}s`,
            }}
          />
        );
      })}

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-in 3.5s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.28 + i * 0.07}s`,
          }}
        />
      ))}

      {HALO.map((ball, i) => (
        <g key={`halo-${i}`} style={{ transform: `translate(${MAIN_CENTER_X}px, ${MAIN_CY}px)` }}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": "470px",
              transformOrigin: "0 0",
              animation: "wink-orbit 2.8s linear infinite",
              animationDelay: `${ball.delay}s`,
            }}
          >
            <SmallBingoBall cx={0} cy={0} r={18} color={SMALL_PALETTE[ball.color]} />
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
