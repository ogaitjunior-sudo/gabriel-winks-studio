import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const STORM = Array.from({ length: 14 }, (_, i) => ({
  x: SAFE_AREA.left + 60 + ((i * 97) % (SAFE_AREA.right - SAFE_AREA.left - 120)),
  y: SAFE_AREA.top + 40 + ((i * 71) % (SAFE_AREA.bottom - SAFE_AREA.top - 80)),
  sx: ((i % 4) - 1.5) * 42,
  sy: ((i % 5) - 2) * 36,
  r: 22 + (i % 3) * 4,
  color: i % SMALL_PALETTE.length,
  delay: (i * 0.12) % 1.4,
}));

export function BingoBallsBounceStorm({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {STORM.map((ball, i) => (
        <SmallBingoBall
          key={i}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={SMALL_PALETTE[ball.color]}
          style={{
            // @ts-expect-error css custom props
            "--sx": `${ball.sx}px`,
            "--sy": `${ball.sy}px`,
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-scatter 3.4s ease-in-out infinite, wink-bounce-loop 1.3s ease-in-out infinite",
            animationDelay: `${ball.delay}s, ${ball.delay * 0.6}s`,
          }}
        />
      ))}

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-pop-up 3.4s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.16 + i * 0.08}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y}px`,
              animation: "wink-glow-pulse 1.6s ease-in-out infinite",
              animationDelay: `${1.9 + i * 0.08}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 165, 14)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
