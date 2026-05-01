import { EffectSvg, GOLD, GOLD_LIGHT } from "../_shared";
import { GOLD_ACCENTS, glowCircle, glowId, goldGlowGradient, goldStar, sparkleCross } from "./_goldShared";

const FEATURE_STARS = [
  { x: 640, y: 432, size: 76, delay: 0.08, color: GOLD_ACCENTS[1] },
  { x: 782, y: 716, size: 64, delay: 0.18, color: GOLD_ACCENTS[2] },
  { x: 1138, y: 716, size: 64, delay: 0.26, color: GOLD_ACCENTS[3] },
  { x: 1280, y: 432, size: 76, delay: 0.34, color: GOLD_ACCENTS[4] },
] as const;

export function GoldStarsCelebrationCascade({ playing }: { playing: boolean }) {
  const centerGlowId = glowId("gold-stars-cascade", "hero");
  const supportGlowId = glowId("gold-stars-cascade", "support");

  return (
    <EffectSvg playing={playing}>
      <defs>
        {goldGlowGradient(centerGlowId, 0.42)}
        {goldGlowGradient(supportGlowId, 0.26)}
      </defs>

      <ellipse cx="960" cy="590" rx="414" ry="170" fill={GOLD} opacity="0.1" />

      <g
        style={{
          transformOrigin: "960px 540px",
          animation: "wink-glow-pulse 1.46s ease-in-out infinite",
        }}
      >
        {glowCircle(centerGlowId, 960, 536, 348, 1)}
      </g>

      <circle
        cx="960"
        cy="540"
        r="322"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth="18"
        opacity="0.78"
        style={{
          transformOrigin: "960px 540px",
          animation: "wink-featured-burst 3s ease-out infinite",
        }}
      />

      <g
        style={{
          transformOrigin: "960px 540px",
          animation: "wink-featured-pop 3s cubic-bezier(.22,1,.36,1) infinite",
        }}
      >
        {goldStar(960, 540, 178, GOLD_ACCENTS[0], GOLD_LIGHT, 10)}
        {goldStar(960, 540, 92, "#fff5c8", GOLD_LIGHT, 7)}
        <ellipse cx="922" cy="486" rx="56" ry="24" fill="#fff" opacity="0.26" />
      </g>

      {FEATURE_STARS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation:
              "wink-featured-pop 3s cubic-bezier(.22,1,.36,1) infinite, wink-bounce-loop 1.54s ease-in-out infinite",
            animationDelay: `${star.delay}s, ${0.74 + star.delay}s`,
          }}
        >
          {glowCircle(supportGlowId, star.x, star.y, star.size * 1.54, 0.9)}
          {goldStar(star.x, star.y, star.size, star.color, GOLD_LIGHT, 6)}
        </g>
      ))}

      {[
        { x: 536, y: 322, size: 34, delay: 0.18 },
        { x: 960, y: 228, size: 44, delay: 0.26 },
        { x: 1384, y: 322, size: 34, delay: 0.34 },
        { x: 960, y: 820, size: 32, delay: 0.42 },
      ].map((sparkle, i) => (
        <g
          key={`sparkle-${i}`}
          style={{
            transformOrigin: `${sparkle.x}px ${sparkle.y}px`,
            animation: "wink-twinkle 1.08s ease-in-out infinite",
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          {sparkleCross(sparkle.x, sparkle.y, sparkle.size, GOLD_LIGHT)}
        </g>
      ))}
    </EffectSvg>
  );
}
