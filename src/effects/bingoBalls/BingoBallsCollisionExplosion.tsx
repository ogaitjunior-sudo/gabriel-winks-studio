import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import {
  type BingoMotionStyle,
  MAIN_BALLS,
  MAIN_CENTER_X,
  MAIN_CY,
  MainBingoBall,
  SAFE_AREA,
  SMALL_PALETTE,
  SmallBingoBall,
  createBingoArrivalStyle,
} from "./_bingoShared";

const DURATION = 3.3;

const CHAOS_INBOUND = [
  { x: SAFE_AREA.left - 90, y: 220, tx: 650, ty: 310, r: 26, color: 0, delay: 0.1 },
  { x: SAFE_AREA.left - 100, y: 540, tx: 690, ty: 0, r: 22, color: 1, delay: 0.22 },
  { x: SAFE_AREA.left - 110, y: 830, tx: 650, ty: -290, r: 24, color: 2, delay: 0.34 },
  { x: MAIN_CENTER_X, y: SAFE_AREA.top - 120, tx: 0, ty: 440, r: 28, color: 3, delay: 0.18 },
  { x: MAIN_CENTER_X, y: SAFE_AREA.bottom + 130, tx: 0, ty: -440, r: 30, color: 4, delay: 0.52 },
  { x: SAFE_AREA.right + 90, y: 220, tx: -650, ty: 310, r: 26, color: 2, delay: 0.46 },
  { x: SAFE_AREA.right + 100, y: 540, tx: -690, ty: 0, r: 22, color: 0, delay: 0.58 },
  { x: SAFE_AREA.right + 110, y: 830, tx: -650, ty: -290, r: 24, color: 4, delay: 0.7 },
];

const CHAOS_SWARM = Array.from({ length: 12 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 12;
  return {
    color: index % SMALL_PALETTE.length,
    r: 18 + (index % 3) * 5,
    sx: Math.cos(angle) * (140 + (index % 4) * 26),
    sy: Math.sin(angle) * (100 + (index % 5) * 18),
  };
});

const WORD_POP = MAIN_BALLS.map((ball, index) => ({
  ...ball,
  delay: 0.52 + index * 0.05,
  fromX: MAIN_CENTER_X - ball.x,
  fromY: MAIN_CY - ball.y,
  overshootX: (2 - index) * -10,
  overshootY: index % 2 === 0 ? -18 : 18,
}));

const IMPACT_RAYS = Array.from({ length: 12 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 12;
  return {
    x1: MAIN_CENTER_X,
    y1: MAIN_CY,
    x2: MAIN_CENTER_X + Math.cos(angle) * 320,
    y2: MAIN_CY + Math.sin(angle) * 170,
  };
});

const CONFETTI = Array.from({ length: 14 }, (_, index) => ({
  delay: 1.72 + (index % 5) * 0.08,
  r0: `${index * 17}deg`,
  r1: `${130 + index * 19}deg`,
  r2: `${260 + index * 21}deg`,
  tx: `${-260 + index * 40}px`,
  ty: `${-150 + (index % 4) * 85}px`,
  w: 16 + (index % 2) * 4,
  h: 12 + (index % 3) * 4,
  x: MAIN_CENTER_X - 8,
  y: MAIN_CY - 6,
  fill: index % 2 === 0 ? GOLD : SMALL_PALETTE[index % SMALL_PALETTE.length].bg,
}));

export function BingoBallsCollisionExplosion({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {CHAOS_INBOUND.map((ball, index) => (
        <g
          key={index}
          style={
            {
              "--tx": `${ball.tx}px`,
              "--ty": `${ball.ty}px`,
              animation: `wink-comet ${DURATION}s cubic-bezier(.18,.84,.34,1) infinite`,
              animationDelay: `${ball.delay}s`,
            } as BingoMotionStyle
          }
        >
          <SmallBingoBall cx={ball.x} cy={ball.y} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      {CHAOS_SWARM.map((ball, index) => (
        <g
          key={`swarm-${index}`}
          style={
            {
              "--sx": `${ball.sx}px`,
              "--sy": `${ball.sy}px`,
              animation: `wink-scatter ${DURATION}s ease-in-out infinite`,
              transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
            } as BingoMotionStyle
          }
        >
          <SmallBingoBall cx={MAIN_CENTER_X} cy={MAIN_CY} r={ball.r} color={SMALL_PALETTE[ball.color]} />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        <circle cx={MAIN_CENTER_X} cy={MAIN_CY} r="150" fill={GOLD} opacity="0.26" />
        <circle cx={MAIN_CENTER_X} cy={MAIN_CY} r="92" fill="white" opacity="0.22" />
        {IMPACT_RAYS.map((ray, index) => (
          <line
            key={index}
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            stroke={index % 2 === 0 ? GOLD : GOLD_LIGHT}
            strokeLinecap="round"
            strokeWidth="4.2"
            opacity="0.9"
          />
        ))}
      </g>

      {CONFETTI.map((piece, index) => (
        <g
          key={`confetti-${index}`}
          style={
            {
              "--r0": piece.r0,
              "--r1": piece.r1,
              "--r2": piece.r2,
              "--tx": piece.tx,
              "--ty": piece.ty,
              animation: `wink-confetti-wave ${DURATION}s ease-out infinite`,
              animationDelay: `${piece.delay}s`,
            } as BingoMotionStyle
          }
        >
          <rect x={piece.x} y={piece.y} width={piece.w} height={piece.h} rx="3" fill={piece.fill} opacity="0.92" />
        </g>
      ))}

      {WORD_POP.map((ball, index) => (
        <g key={ball.index} transform={`translate(${ball.x} ${ball.y})`}>
          <g style={createBingoArrivalStyle(ball)}>
            <g style={{ animation: `wink-bingo-final-bounce ${DURATION}s ease-out infinite` }}>
              <MainBingoBall index={index} cx={0} cy={0}>
                <g
                  style={{
                    transformOrigin: `0px -168px`,
                    animation: `wink-sparkle ${DURATION}s ease-in-out infinite`,
                    animationDelay: `${1.94 + index * 0.04}s`,
                  }}
                >
                  <path d={starPath(0, -168, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.1" />
                </g>
              </MainBingoBall>
            </g>
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
