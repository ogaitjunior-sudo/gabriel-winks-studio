import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MAIN_CENTER_X, MAIN_CY, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const OUTBOUND = Array.from({ length: 14 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 14;
  return {
    tx: Math.cos(angle) * (260 + (i % 3) * 40),
    ty: Math.sin(angle) * (180 + (i % 4) * 35),
    r: 22 + (i % 3) * 4,
    color: i % SMALL_PALETTE.length,
    delay: (i % 7) * 0.08,
  };
});

const RETURNERS = MAIN_BALLS.flatMap((ball, i) => [
  { x: ball.x - 260, y: ball.y - 230, tx: 260, ty: 230, r: 22, color: i, delay: 1.02 + i * 0.06 },
  { x: ball.x + 260, y: ball.y + 230, tx: -260, ty: -230, r: 18, color: (i + 2) % SMALL_PALETTE.length, delay: 1.18 + i * 0.06 },
]);

export function BingoBallsExplosionToFormation({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d="M 350 540 C 560 260, 1360 260, 1570 540" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.16" />
      <path d="M 350 540 C 560 820, 1360 820, 1570 540" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" opacity="0.14" />

      {OUTBOUND.map((ball, i) => (
        <g
          key={i}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${ball.tx}px`,
            "--ty": `${ball.ty}px`,
            animation: "wink-comet 3.3s ease-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        >
          <SmallBingoBall cx={MAIN_CENTER_X} cy={MAIN_CY} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      {RETURNERS.map((ball, i) => (
        <g
          key={`return-${i}`}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${ball.tx}px`,
            "--ty": `${ball.ty}px`,
            animation: "wink-comet 3.3s ease-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        >
          <SmallBingoBall cx={ball.x} cy={ball.y} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: "wink-glow-pulse 3.3s ease-in-out infinite",
          animationDelay: "0.95s",
        }}
      >
        <circle cx={MAIN_CENTER_X} cy={MAIN_CY} r="110" fill={GOLD} opacity="0.16" />
        <circle cx={MAIN_CENTER_X} cy={MAIN_CY} r="72" fill={GOLD} opacity="0.24" />
        {Array.from({ length: 10 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 10;
          return (
            <line
              key={i}
              x1={MAIN_CENTER_X + Math.cos(angle) * 74}
              y1={MAIN_CY + Math.sin(angle) * 44}
              x2={MAIN_CENTER_X + Math.cos(angle) * 220}
              y2={MAIN_CY + Math.sin(angle) * 150}
              stroke={i % 2 === 0 ? GOLD_LIGHT : GOLD}
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.45"
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
            animation: "wink-pop-up 3.3s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.28 + i * 0.07}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y - 165}px`,
              animation: "wink-twinkle 3.3s ease-in-out infinite",
              animationDelay: `${1.98 + i * 0.06}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 165, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
