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

const DURATION = 3.4;

const COUNTDOWN_MARKS = [
  { label: "3", delay: 0, x: 960, y: 296 },
  { label: "2", delay: 0.34, x: 960, y: 296 },
  { label: "1", delay: 0.68, x: 960, y: 296 },
];

const INBOUND_BALLS = [
  { x: SAFE_AREA.left - 110, y: 260, tx: 620, ty: 220, r: 28, color: 0, delay: 0.12 },
  { x: SAFE_AREA.left - 130, y: 760, tx: 700, ty: -210, r: 24, color: 1, delay: 0.26 },
  { x: SAFE_AREA.right + 110, y: 250, tx: -620, ty: 225, r: 28, color: 2, delay: 0.4 },
  { x: SAFE_AREA.right + 125, y: 760, tx: -700, ty: -205, r: 24, color: 3, delay: 0.54 },
  { x: 960, y: SAFE_AREA.top - 120, tx: 0, ty: 390, r: 30, color: 4, delay: 0.18 },
  { x: 960, y: SAFE_AREA.bottom + 120, tx: 0, ty: -390, r: 30, color: 0, delay: 0.62 },
  { x: 210, y: 460, tx: 540, ty: 110, r: 20, color: 2, delay: 0.74 },
  { x: 1710, y: 460, tx: -540, ty: 110, r: 20, color: 4, delay: 0.86 },
];

const MAIN_ENTRIES = MAIN_BALLS.map((ball, index) => {
  const arrivals = [
    { delay: 0.12, fromX: -760, fromY: -290, overshootX: 26, overshootY: 18 },
    { delay: 0.24, fromX: -520, fromY: 250, overshootX: 22, overshootY: -18 },
    { delay: 0.36, fromX: 0, fromY: -620, overshootX: 0, overshootY: 26 },
    { delay: 0.48, fromX: 520, fromY: -250, overshootX: -22, overshootY: 18 },
    { delay: 0.6, fromX: 760, fromY: 280, overshootX: -26, overshootY: -16 },
  ];

  return {
    ...ball,
    ...arrivals[index],
  };
});

const BURST_LINES = Array.from({ length: 12 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 12;
  return {
    x1: MAIN_CENTER_X + Math.cos(angle) * 110,
    y1: MAIN_CY + Math.sin(angle) * 55,
    x2: MAIN_CENTER_X + Math.cos(angle) * 430,
    y2: MAIN_CY + Math.sin(angle) * 220,
  };
});

const BURST_STARS = Array.from({ length: 10 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 10;
  return {
    x: MAIN_CENTER_X + Math.cos(angle) * 340,
    y: MAIN_CY + Math.sin(angle) * 170,
    r: 16 + (index % 2) * 5,
  };
});

export function BingoBallsCountdownBounce({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="650" ry="220" fill={GOLD} opacity="0.22" />
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="540" ry="140" fill="white" opacity="0.18" />
      </g>

      {COUNTDOWN_MARKS.map((mark) => (
        <text
          key={mark.label}
          x={mark.x}
          y={mark.y}
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={900}
          fontSize={210}
          fill="white"
          opacity="0"
          stroke={GOLD_LIGHT}
          strokeWidth="6"
          paintOrder="stroke"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: `wink-bingo-countdown ${DURATION}s ease-out infinite`,
            animationDelay: `${mark.delay}s`,
          }}
        >
          {mark.label}
        </text>
      ))}

      {INBOUND_BALLS.map((ball, index) => (
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

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        {BURST_LINES.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={index % 2 === 0 ? GOLD : "white"}
            strokeLinecap="round"
            strokeWidth="5"
            opacity="0.88"
          />
        ))}
        {BURST_STARS.map((star, index) => (
          <path
            key={`star-${index}`}
            d={starPath(star.x, star.y, star.r)}
            fill={index % 2 === 0 ? GOLD : GOLD_LIGHT}
            stroke="white"
            strokeWidth="1.3"
          />
        ))}
      </g>

      {MAIN_ENTRIES.map((ball, index) => (
        <g key={ball.index} transform={`translate(${ball.x} ${ball.y})`}>
          <g style={createBingoArrivalStyle(ball)}>
            <g
              style={{
                animation: `wink-bingo-final-bounce ${DURATION}s ease-out infinite`,
              }}
            >
              <MainBingoBall index={index} cx={0} cy={0}>
                <g
                  style={{
                    transformOrigin: `0px -170px`,
                    animation: `wink-sparkle ${DURATION}s ease-in-out infinite`,
                    animationDelay: `${1.8 + index * 0.04}s`,
                  }}
                >
                  <path
                    d={starPath(0, -170, 18)}
                    fill={GOLD}
                    stroke={GOLD_LIGHT}
                    strokeWidth="1.1"
                  />
                </g>
              </MainBingoBall>
            </g>
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
