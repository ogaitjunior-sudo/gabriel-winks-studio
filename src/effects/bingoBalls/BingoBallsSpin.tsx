import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const SPARKS = Array.from({ length: 10 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 10,
  radius: 365 + (i % 2) * 35,
  delay: i * 0.08,
}));

export function BingoBallsSpin({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <ellipse cx={SAFE_AREA.centerX} cy={SAFE_AREA.centerY} rx="430" ry="290" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" opacity="0.18" />
      <ellipse cx={SAFE_AREA.centerX} cy={SAFE_AREA.centerY} rx="285" ry="190" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.2" />

      <g transform={`translate(${SAFE_AREA.centerX} ${SAFE_AREA.centerY})`}>
        {BINGO_LETTERS.map((_, i) => (
          <g
            key={i}
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${285 + (i % 2) * 36}px`,
              transformOrigin: "0 0",
              animation: "wink-orbit 3s linear infinite",
              animationDelay: `${(-3 * i) / BINGO_LETTERS.length}s`,
            }}
          >
            <MainBingoBall index={i} cx={0} cy={0} />
          </g>
        ))}
      </g>

      {SPARKS.map((spark, i) => {
        const x = SAFE_AREA.centerX + Math.cos(spark.angle) * spark.radius;
        const y = SAFE_AREA.centerY + Math.sin(spark.angle) * spark.radius * 0.66;
        return (
          <g
            key={i}
            style={{
              transformOrigin: `${x}px ${y}px`,
              animation: "wink-sparkle 3s ease-in-out infinite",
              animationDelay: `${spark.delay}s`,
            }}
          >
            <path d={starPath(x, y, 14 + (i % 2) * 4)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        );
      })}

      <SmallBingoBall cx={SAFE_AREA.centerX} cy={SAFE_AREA.centerY} r={34} color={SMALL_PALETTE[2]} />
    </EffectSvg>
  );
}
