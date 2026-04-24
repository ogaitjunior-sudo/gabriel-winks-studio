import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, dustDot, glowCircle, glowId, goldGlowGradient, goldStar, sparkleCross } from "./_goldShared";

const STARS = [
  { x: 720, y: 430, r: 42, delay: 0.04 },
  { x: 960, y: 350, r: 60, delay: 0.18 },
  { x: 1200, y: 430, r: 42, delay: 0.32 },
  { x: 810, y: 650, r: 34, delay: 0.46 },
  { x: 1110, y: 650, r: 34, delay: 0.6 },
  { x: 960, y: 565, r: 46, delay: 0.74 },
];

export function GoldStarsPop({ playing }: { playing: boolean }) {
  const glow = glowId("gsp", "cluster");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.28)}</defs>

      {glowCircle(glow, 960, 520, 260, 0.32)}

      {STARS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-pop 2.4s cubic-bezier(.22,1,.36,1) infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          {glowCircle(glow, star.x, star.y, star.r * 1.6, 0.24)}
          {goldStar(star.x, star.y, star.r, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
        </g>
      ))}

      {STARS.map((star, i) => (
        <g
          key={`spark-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-sparkle 2.4s ease-in-out infinite",
            animationDelay: `${1.08 + i * 0.06}s`,
          }}
        >
          {sparkleCross(star.x + (i % 2 === 0 ? 52 : -52), star.y - 42, 14)}
        </g>
      ))}

      {dustDot(840, 280, 4, 0.36)}
      {dustDot(1080, 260, 4, 0.34)}
      {dustDot(760, 760, 4, 0.28)}
      {dustDot(1160, 760, 4, 0.28)}
    </EffectSvg>
  );
}
