import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { MAIN_BALLS, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const PINBALLS = [
  { x: 500, y: 280, tx: 240, ty: 180, r: 20, color: 0, delay: 0 },
  { x: 760, y: 220, tx: 210, ty: 250, r: 24, color: 1, delay: 0.18 },
  { x: 1150, y: 260, tx: -220, ty: 220, r: 22, color: 2, delay: 0.36 },
  { x: 1420, y: 300, tx: -250, ty: 180, r: 20, color: 3, delay: 0.54 },
  { x: 1420, y: 760, tx: -260, ty: -180, r: 24, color: 4, delay: 0.72 },
  { x: 1140, y: 820, tx: -220, ty: -220, r: 22, color: 0, delay: 0.9 },
  { x: 760, y: 840, tx: 200, ty: -230, r: 20, color: 1, delay: 1.08 },
  { x: 500, y: 760, tx: 230, ty: -180, r: 24, color: 2, delay: 1.26 },
];

const BUMPERS = [
  [560, 260, 860, 180],
  [1320, 260, 1060, 180],
  [560, 820, 860, 900],
  [1320, 820, 1060, 900],
  [420, 400, 360, 640],
  [1500, 400, 1560, 640],
];

export function BingoBallsPinballChaos({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <rect
        x={SAFE_AREA.left}
        y={SAFE_AREA.top}
        width={SAFE_AREA.right - SAFE_AREA.left}
        height={SAFE_AREA.bottom - SAFE_AREA.top}
        rx="54"
        fill="none"
        stroke="white"
        strokeOpacity="0.08"
        strokeWidth="4"
      />

      {BUMPERS.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={GOLD}
          strokeOpacity="0.22"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}

      {PINBALLS.map((ball, i) => (
        <g
          key={i}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${ball.tx}px`,
            "--ty": `${ball.ty}px`,
            animation: "wink-comet 3.3s ease-in-out infinite, wink-bounce-loop 1.1s ease-in-out infinite",
            animationDelay: `${ball.delay}s, ${ball.delay * 0.5}s`,
          }}
        >
          <SmallBingoBall cx={ball.x} cy={ball.y} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      {MAIN_BALLS.map((ball, i) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-in 3.3s cubic-bezier(.34,1.56,.64,1) infinite",
            animationDelay: `${1.34 + i * 0.07}s`,
          }}
        >
          <g
            style={{
              transformOrigin: `${ball.x}px ${ball.y - 170}px`,
              animation: "wink-twinkle 3.3s ease-in-out infinite",
              animationDelay: `${2.06 + i * 0.05}s`,
            }}
          >
            <path d={starPath(ball.x, ball.y - 170, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </MainBingoBall>
      ))}
    </EffectSvg>
  );
}
