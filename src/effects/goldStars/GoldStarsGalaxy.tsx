import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient, goldStar } from "./_goldShared";

const ORBITS = [
  { r: 120, count: 5, speed: 6, size: 13 },
  { r: 225, count: 7, speed: 9, size: 16 },
  { r: 330, count: 9, speed: 12, size: 18 },
];

export function GoldStarsGalaxy({ playing }: { playing: boolean }) {
  const glow = glowId("gsg", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.2)}</defs>

      <g style={{ animation: "wink-glow-pulse 6s ease-in-out infinite" }}>
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 260, 0.52)}
        {goldStar(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 30, GOLD_ACCENTS[0], undefined, 1.6)}
      </g>

      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="360" ry="230" fill="none" stroke={GOLD_ACCENTS[2]} strokeWidth="1.2" opacity="0.16" />
      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="235" ry="150" fill="none" stroke={GOLD_ACCENTS[0]} strokeWidth="1.2" opacity="0.14" />

      {ORBITS.map((orbit, orbitIndex) => (
        <g key={orbitIndex} transform={`translate(${GOLD_SAFE_AREA.centerX} ${GOLD_SAFE_AREA.centerY})`}>
          {Array.from({ length: orbit.count }, (_, i) => (
            <g
              key={i}
              style={{
                // @ts-expect-error css custom props
                "--orbit-r": `${orbit.r}px`,
                transformOrigin: "0 0",
                animation: `wink-orbit ${orbit.speed}s linear infinite`,
                animationDelay: `${(i / orbit.count) * -orbit.speed}s`,
              }}
            >
              {goldStar(0, 0, orbit.size, GOLD_ACCENTS[(orbitIndex + i) % GOLD_ACCENTS.length], undefined, 1)}
            </g>
          ))}
        </g>
      ))}
    </EffectSvg>
  );
}
