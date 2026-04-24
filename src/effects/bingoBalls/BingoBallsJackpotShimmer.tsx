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

const DURATION = 3.4;

const FALLING_BALLS = Array.from({ length: 16 }, (_, index) => ({
  color: index % SMALL_PALETTE.length,
  delay: (index * 0.12) % 1.8,
  r: 18 + (index % 3) * 5,
  x: 320 + index * 84,
  y: 80 + (index % 2) * 28,
}));

const JACKPOT_WORD = MAIN_BALLS.map((ball, index) => ({
  ...ball,
  delay: 0.16 + index * 0.1,
  fromX: index < 2 ? -180 - index * 65 : index === 2 ? 0 : 180 + (index - 2) * 65,
  fromY: -640 - (index % 2) * 70,
  overshootX: index < 2 ? 18 : index === 2 ? 0 : -18,
  overshootY: 24,
}));

const SHIMMER_STARS = Array.from({ length: 14 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 14;
  return {
    delay: 1.84 + (index % 6) * 0.05,
    r: 14 + (index % 3) * 4,
    x: MAIN_CENTER_X + Math.cos(angle) * 450,
    y: MAIN_CY + Math.sin(angle) * 205,
  };
});

export function BingoBallsJackpotShimmer({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="700" ry="215" fill={GOLD} opacity="0.22" />
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY + 35} rx="540" ry="115" fill="white" opacity="0.18" />
      </g>

      {FALLING_BALLS.map((ball, index) => (
        <SmallBingoBall
          key={index}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={SMALL_PALETTE[ball.color]}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: `wink-shower ${DURATION}s ease-in infinite`,
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}

      {JACKPOT_WORD.map((ball, index) => (
        <g key={ball.index} transform={`translate(${ball.x} ${ball.y})`}>
          <g style={createBingoArrivalStyle(ball)}>
            <g style={{ animation: `wink-bingo-final-bounce ${DURATION}s ease-out infinite` }}>
              <MainBingoBall index={index} cx={0} cy={0} />
            </g>
          </g>
        </g>
      ))}

      {SHIMMER_STARS.map((star, index) => (
        <g
          key={`shimmer-${index}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: `wink-sparkle ${DURATION}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <path
            d={starPath(star.x, star.y, star.r)}
            fill={index % 2 === 0 ? GOLD_LIGHT : GOLD}
            stroke="white"
            strokeWidth="1"
          />
        </g>
      ))}
    </EffectSvg>
  );
}
