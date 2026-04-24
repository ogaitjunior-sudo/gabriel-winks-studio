import type { CSSProperties } from "react";

import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import {
  MAIN_BALLS,
  MAIN_CENTER_X,
  MAIN_CY,
  MainBingoBall,
  SMALL_PALETTE,
  SmallBingoBall,
  createBingoSpiralLetterStyle,
} from "./_bingoShared";

const DURATION = 3.4;

const ORBITERS = Array.from({ length: 18 }, (_, index) => ({
  delay: (index * 0.09) % 1.7,
  duration: 2.5 + (index % 4) * 0.22,
  radius: 210 + (index % 5) * 34,
  r: 18 + (index % 3) * 5,
  color: index % SMALL_PALETTE.length,
}));

const LETTER_SPINS = MAIN_BALLS.map((ball, index) => ({
  ...ball,
  delay: 0.14 + index * 0.1,
  orbitRadius: 420 - Math.abs(2 - index) * 48,
  spinMid: index < 2 ? 24 : -24,
  spinStart: -320 + index * 140,
}));

const SNAP_STARS = Array.from({ length: 9 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 9;
  return {
    x: MAIN_CENTER_X + Math.cos(angle) * 390,
    y: MAIN_CY + Math.sin(angle) * 185,
    r: 15 + (index % 3) * 4,
  };
});

export function BingoBallsSpiralSnap({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <g opacity="0.2">
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="520" ry="240" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" />
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="360" ry="170" fill="none" stroke={GOLD} strokeWidth="2.4" />
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="220" ry="102" fill="none" stroke="white" strokeWidth="2" />
      </g>

      {ORBITERS.map((orbiter, index) => (
        <g key={index} transform={`translate(${MAIN_CENTER_X} ${MAIN_CY})`}>
          <g
            style={
              {
                "--orbit-r": `${orbiter.radius}px`,
                animation: `wink-orbit ${orbiter.duration}s linear infinite`,
                animationDelay: `${orbiter.delay}s`,
                transformOrigin: "0 0",
              } as CSSProperties
            }
          >
            <SmallBingoBall cx={0} cy={0} r={orbiter.r} color={SMALL_PALETTE[orbiter.color]} />
          </g>
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="660" ry="195" fill={GOLD} opacity="0.2" />
        <ellipse cx={MAIN_CENTER_X} cy={MAIN_CY} rx="540" ry="125" fill="white" opacity="0.18" />
      </g>

      {LETTER_SPINS.map((ball, index) => (
        <g key={ball.index} transform={`translate(${ball.x} ${ball.y})`}>
          <g style={createBingoSpiralLetterStyle(ball)}>
            <g style={{ animation: `wink-bingo-final-bounce ${DURATION}s ease-out infinite` }}>
              <MainBingoBall index={index} cx={0} cy={0} />
            </g>
          </g>
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${MAIN_CENTER_X}px ${MAIN_CY}px`,
          animation: `wink-bingo-impact ${DURATION}s ease-out infinite`,
        }}
      >
        {SNAP_STARS.map((star, index) => (
          <path
            key={index}
            d={starPath(star.x, star.y, star.r)}
            fill={index % 2 === 0 ? GOLD : GOLD_LIGHT}
            stroke="white"
            strokeWidth="1.1"
          />
        ))}
      </g>
    </EffectSvg>
  );
}
