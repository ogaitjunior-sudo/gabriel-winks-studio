import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient } from "./_goldShared";

const ORBITS = [
  { radius: 150, size: 20, speed: 2.6, color: 0 },
  { radius: 240, size: 26, speed: 3.4, color: 1 },
  { radius: 330, size: 21, speed: 4, color: 2 },
  { radius: 285, size: 16, speed: 3.1, color: 4 },
];

export function GoldStarsOrbitShine({ playing }: { playing: boolean }) {
  const glow = glowId("gsos", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.14)}</defs>

      <g style={{ animation: "wink-glow-pulse 3.4s ease-in-out infinite" }}>
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 220, 0.28)}
        <circle cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} r="30" fill={GOLD_LIGHT} />
      </g>

      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="340" ry="220" fill="none" stroke={GOLD} strokeWidth="1.8" opacity="0.16" />
      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="215" ry="142" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.2" opacity="0.16" />

      {ORBITS.map((orbit, i) => (
        <g key={i} transform={`translate(${GOLD_SAFE_AREA.centerX} ${GOLD_SAFE_AREA.centerY})`}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${orbit.radius}px`,
              transformOrigin: "0 0",
              animation: `wink-orbit ${orbit.speed}s linear infinite`,
              animationDelay: `${i * -0.7}s`,
            }}
          >
            <path d={starPath(0, 0, orbit.size)} fill={GOLD_ACCENTS[orbit.color]} stroke={GOLD_LIGHT} strokeWidth="1.2" />
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
