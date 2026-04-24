import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MAIN_CENTER_X, MAIN_CY, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const CHAOS = Array.from({ length: 16 }, (_, i) => ({
  x: SAFE_AREA.left + 80 + ((i * 81) % (SAFE_AREA.right - SAFE_AREA.left - 160)),
  y: SAFE_AREA.top + 60 + ((i * 97) % (SAFE_AREA.bottom - SAFE_AREA.top - 120)),
  sx: ((i % 5) - 2) * 38,
  sy: ((i % 4) - 1.5) * 42,
  r: 18 + (i % 3) * 4,
  color: i % SMALL_PALETTE.length,
  delay: (i * 0.08) % 1.2,
}));

const CONFETTI = Array.from({ length: 10 }, (_, i) => ({
  x: 260 + i * 155,
  delay: 1.56 + (i % 5) * 0.08,
  color: (i + 1) % SMALL_PALETTE.length,
}));

const CELEBRATION_STARS = [
  { x: 420, y: 260, size: 18, delay: 1.9 },
  { x: 960, y: 170, size: 28, delay: 2.02 },
  { x: 1500, y: 260, size: 18, delay: 2.14 },
  { x: 620, y: 820, size: 14, delay: 2.26 },
  { x: 1300, y: 820, size: 14, delay: 2.38 },
];

export function BingoBallsGrandCelebration({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {CHAOS.map((ball, i) => (
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
            animation: "wink-scatter 3.8s ease-in-out infinite, wink-bounce-loop 1.2s ease-in-out infinite",
            animationDelay: `${ball.delay}s, ${ball.delay * 0.5}s`,
          }}
        />
      ))}

      {CONFETTI.map((ball, i) => (
        <g
          key={`confetti-${i}`}
          style={{
            transformOrigin: `${ball.x}px 120px`,
            animation: "wink-shower 3.8s linear infinite",
            animationDelay: `${ball.delay}s`,
          }}
        >
          <SmallBingoBall cx={ball.x} cy={120} r={18} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: "wink-burst 3.8s ease-out infinite",
          animationDelay: "1.18s",
        }}
      >
        <circle cx={MAIN_CENTER_X} cy={MAIN_CY} r="110" fill={GOLD} opacity="0.22" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 12;
          return (
            <g key={i}>
              <line
                x1={MAIN_CENTER_X}
                y1={MAIN_CY}
                x2={MAIN_CENTER_X + Math.cos(angle) * 240}
                y2={MAIN_CY + Math.sin(angle) * 240}
                stroke={i % 2 === 0 ? GOLD : "white"}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d={starPath(MAIN_CENTER_X + Math.cos(angle) * 275, MAIN_CY + Math.sin(angle) * 275, 20)}
                fill={GOLD}
                stroke={GOLD_LIGHT}
                strokeWidth="1"
              />
            </g>
          );
        })}
      </g>

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-in 3.8s cubic-bezier(.34,1.56,.64,1) infinite, wink-glow-pulse 1.8s ease-in-out infinite",
            animationDelay: `${1.34 + i * 0.07}s, ${2.14 + i * 0.05}s`,
          }}
        />
      ))}

      {CELEBRATION_STARS.map((star, i) => (
        <g
          key={`star-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-sparkle 3.8s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.size)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.2" />
        </g>
      ))}
    </EffectSvg>
  );
}
