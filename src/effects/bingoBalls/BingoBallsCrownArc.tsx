import { EffectSvg, GOLD, GOLD_DEEP, GOLD_LIGHT, starPath } from "../_shared";
import { MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const HERO_BALLS = [
  { index: 0, x: 432, y: 646, delay: 0.04 },
  { index: 1, x: 696, y: 580, delay: 0.1 },
  { index: 2, x: 960, y: 516, delay: 0.16 },
  { index: 3, x: 1224, y: 580, delay: 0.22 },
  { index: 4, x: 1488, y: 646, delay: 0.28 },
] as const;

const SIDE_ORBS = [
  { x: 312, y: 662, r: 54, color: SMALL_PALETTE[0], delay: 0.18 },
  { x: 1608, y: 662, r: 54, color: SMALL_PALETTE[4], delay: 0.24 },
] as const;

const JEWELS = [
  { x: 732, y: 232, size: 22, delay: 0.18 },
  { x: 960, y: 188, size: 34, delay: 0.28 },
  { x: 1188, y: 232, size: 22, delay: 0.38 },
] as const;

function crownPath(cx: number, cy: number, width: number, height: number) {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height / 2;
  const bottom = cy + height / 2;
  return [
    `M ${left} ${bottom - height * 0.08}`,
    `L ${left + width * 0.16} ${cy + height * 0.04}`,
    `L ${left + width * 0.3} ${top + height * 0.16}`,
    `L ${cx} ${cy - height * 0.04}`,
    `L ${right - width * 0.3} ${top + height * 0.16}`,
    `L ${right - width * 0.16} ${cy + height * 0.04}`,
    `L ${right} ${bottom - height * 0.08}`,
    `L ${right - width * 0.02} ${bottom + height * 0.12}`,
    `L ${left + width * 0.02} ${bottom + height * 0.12}`,
    "Z",
  ].join(" ");
}

export function BingoBallsCrownArc({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <ellipse cx="960" cy="612" rx="486" ry="188" fill={GOLD} opacity="0.12" />

      <g
        style={{
          transformOrigin: "960px 280px",
          animation: "wink-featured-pop 2.9s cubic-bezier(.22,1,.36,1) infinite",
        }}
      >
        <ellipse cx="960" cy="284" rx="280" ry="96" fill={GOLD_LIGHT} opacity="0.18" />
        <path d={crownPath(960, 272, 640, 236)} fill={GOLD} stroke={GOLD_DEEP} strokeWidth="16" />
        <rect x="642" y="332" width="636" height="70" rx="28" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="14" />
        <rect x="684" y="348" width="552" height="24" rx="12" fill={GOLD_LIGHT} opacity="0.56" />

        {JEWELS.map((jewel, i) => (
          <g
            key={`jewel-${i}`}
            style={{
              transformOrigin: `${jewel.x}px ${jewel.y}px`,
              animation: "wink-glow-pulse 1.15s ease-in-out infinite",
              animationDelay: `${jewel.delay}s`,
            }}
          >
            <path d={starPath(jewel.x, jewel.y, jewel.size)} fill={GOLD_LIGHT} stroke="#fff7d6" strokeWidth="4" />
          </g>
        ))}
      </g>

      <circle
        cx="960"
        cy="586"
        r="364"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth="18"
        opacity="0.76"
        style={{
          transformOrigin: "960px 586px",
          animation: "wink-featured-burst 2.9s ease-out infinite",
        }}
      />

      {SIDE_ORBS.map((ball, i) => (
        <SmallBingoBall
          key={`orb-${i}`}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={ball.color}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation:
              "wink-featured-pop 2.9s cubic-bezier(.22,1,.36,1) infinite, wink-bounce-loop 1.58s ease-in-out infinite",
            animationDelay: `${ball.delay}s, ${0.78 + ball.delay}s`,
          }}
        />
      ))}

      {HERO_BALLS.map((ball) => (
        <MainBingoBall
          key={ball.index}
          index={ball.index}
          cx={ball.x}
          cy={ball.y}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation:
              "wink-featured-pop 2.9s cubic-bezier(.22,1,.36,1) infinite, wink-bingo-final-bounce 2.9s ease-in-out infinite",
            animationDelay: `${ball.delay}s, ${ball.delay}s`,
          }}
        />
      ))}

      {[
        { x: 564, y: 442, size: 26, delay: 0.18 },
        { x: 1356, y: 442, size: 26, delay: 0.32 },
      ].map((spark, i) => (
        <g
          key={`spark-${i}`}
          style={{
            transformOrigin: `${spark.x}px ${spark.y}px`,
            animation: "wink-twinkle 1.12s ease-in-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        >
          <path d={starPath(spark.x, spark.y, spark.size)} fill={GOLD_LIGHT} stroke="#fff7d6" strokeWidth="3" />
        </g>
      ))}
    </EffectSvg>
  );
}
