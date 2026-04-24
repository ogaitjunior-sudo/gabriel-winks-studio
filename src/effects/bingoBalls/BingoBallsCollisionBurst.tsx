import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const INBOUND = [
  { x: 160, y: 220, tx: 720, ty: 320, r: 26, color: 0, delay: 0 },
  { x: 960, y: 100, tx: 0, ty: 420, r: 30, color: 1, delay: 0.14 },
  { x: 1760, y: 210, tx: -720, ty: 330, r: 28, color: 2, delay: 0.28 },
  { x: 220, y: 540, tx: 640, ty: 0, r: 24, color: 3, delay: 0.42 },
  { x: 1700, y: 540, tx: -640, ty: 0, r: 24, color: 4, delay: 0.56 },
  { x: 180, y: 870, tx: 720, ty: -330, r: 28, color: 1, delay: 0.7 },
  { x: 960, y: 980, tx: 0, ty: -430, r: 30, color: 3, delay: 0.84 },
  { x: 1740, y: 860, tx: -720, ty: -320, r: 26, color: 0, delay: 0.98 },
];

const BURST_ANGLES = Array.from({ length: 10 }, (_, i) => (Math.PI * 2 * i) / 10);

export function BingoBallsCollisionBurst({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {INBOUND.map((ball, i) => (
        <g
          key={i}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${ball.tx}px`,
            "--ty": `${ball.ty}px`,
            animation: "wink-comet 3.2s ease-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        >
          <SmallBingoBall cx={ball.x} cy={ball.y} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      <g
        style={{
          transformOrigin: "960px 540px",
          animation: "wink-burst 3.2s ease-out infinite",
          animationDelay: "0.96s",
        }}
      >
        {BURST_ANGLES.map((angle, i) => (
          <g key={i}>
            <line
              x1={960}
              y1={540}
              x2={960 + Math.cos(angle) * 180}
              y2={540 + Math.sin(angle) * 180}
              stroke={i % 2 === 0 ? GOLD : "white"}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.92"
            />
            <path
              d={starPath(960 + Math.cos(angle) * 210, 540 + Math.sin(angle) * 210, 18)}
              fill={GOLD}
              stroke={GOLD_LIGHT}
              strokeWidth="1"
            />
          </g>
        ))}
      </g>

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-in 3.2s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.08 + i * 0.08}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y - 170}px`,
              animation: "wink-sparkle 3.2s ease-in-out infinite",
              animationDelay: `${1.84 + i * 0.08}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 170, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
