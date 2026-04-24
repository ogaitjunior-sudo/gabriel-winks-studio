import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import {
  MAIN_BALLS,
  MAIN_CENTER_X,
  MAIN_CY,
  MainBingoBall,
  SMALL_PALETTE,
  SmallBingoBall,
  createBingoArrivalStyle,
} from "./_bingoShared";

const DURATION = 3.0;

const WAVE_TRAIL = Array.from({ length: 12 }, (_, index) => ({
  color: (index + 1) % SMALL_PALETTE.length,
  r: 18 + (index % 2) * 4,
  x: 300 + index * 120,
  y: 410 + Math.sin((index / 11) * Math.PI * 1.8) * 110,
  delay: index * 0.08,
}));

const LETTER_WAVE = MAIN_BALLS.map((ball, index) => ({
  ...ball,
  delay: index * 0.14,
  fromX: -620 - index * 90,
  fromY: index % 2 === 0 ? -110 : 125,
  overshootX: 16,
  overshootY: index % 2 === 0 ? 18 : -18,
}));

const WAVE_STARS = MAIN_BALLS.map((ball, index) => ({
  ...ball,
  delay: 1.72 + index * 0.05,
  y: ball.y - 175,
}));

export function BingoBallsWaveSequence({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path
        d="M 250 560 C 470 350, 690 730, 920 560 S 1370 350, 1670 560"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.22"
      />
      <path
        d="M 250 620 C 470 450, 690 790, 920 620 S 1370 450, 1670 620"
        fill="none"
        stroke={GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.16"
      />

      {WAVE_TRAIL.map((ball, index) => (
        <SmallBingoBall
          key={index}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={SMALL_PALETTE[ball.color]}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: `wink-bounce-loop 1.2s ease-in-out infinite`,
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="640" ry="175" fill={GOLD} opacity="0.18" />
      </g>

      {LETTER_WAVE.map((ball, index) => (
        <g key={ball.index} transform={`translate(${ball.x} ${ball.y})`}>
          <g style={createBingoArrivalStyle(ball)}>
            <g style={{ animation: `wink-bingo-final-bounce ${DURATION}s ease-out infinite` }}>
              <MainBingoBall index={index} cx={0} cy={0} />
            </g>
          </g>
        </g>
      ))}

      {WAVE_STARS.map((star, index) => (
        <g
          key={`star-${index}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: `wink-sparkle ${DURATION}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, 17)} fill={index % 2 === 0 ? GOLD : GOLD_LIGHT} />
        </g>
      ))}
    </EffectSvg>
  );
}
