import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient, goldStar, sparkleCross } from "./_goldShared";

const COUNT = 14;

export function GoldStarsHalo({ playing }: { playing: boolean }) {
  const glow = glowId("gsh", "ring");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.24)}</defs>

      <g style={{ animation: "wink-glow-pulse 2.4s ease-in-out infinite" }}>
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 230, 0.58)}
        <circle cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} r="26" fill="hsl(48 100% 84%)" />
      </g>

      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx={310} ry={205} fill="none" stroke="hsl(43 94% 60%)" strokeWidth="2" opacity="0.2" />
      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx={220} ry={145} fill="none" stroke="hsl(48 100% 84%)" strokeWidth="1.4" opacity="0.16" />

      {Array.from({ length: COUNT }, (_, i) => {
        return (
          <g key={i} transform={`translate(${GOLD_SAFE_AREA.centerX} ${GOLD_SAFE_AREA.centerY})`}>
            <g
              style={{
                // @ts-expect-error css custom props
                "--orbit-r": `${225 + (i % 3) * 34}px`,
                transformOrigin: "0 0",
                animation: "wink-orbit 2.9s linear infinite",
                animationDelay: `${(i * -2.9) / COUNT}s`,
              }}
            >
              {goldStar(0, 0, 17 + (i % 3) * 4, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
            </g>
          </g>
        );
      })}

      <g style={{ animation: "wink-sparkle 2.4s ease-in-out infinite", animationDelay: "1.08s" }}>
        {sparkleCross(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 18)}
      </g>
    </EffectSvg>
  );
}
