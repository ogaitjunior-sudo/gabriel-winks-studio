import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRainField,
  createWaveField,
  confettiGlowId,
} from "./_confettiShared";

const FRONT_RAIN = createRainField({
  count: 22,
  left: 340,
  right: 1580,
  top: 130,
  drop: 850,
  drift: 190,
  delayStart: 0,
  delayStep: 0.095,
  duration: 3.4,
  sizeMin: 14,
  sizeMax: 24,
});

const BACK_RAIN = createRainField({
  count: 14,
  left: 430,
  right: 1490,
  top: 90,
  drop: 760,
  drift: 110,
  delayStart: 0.08,
  delayStep: 0.09,
  duration: 3.4,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 2,
  shapeOffset: 1,
});

const GARLAND = createWaveField({
  count: 14,
  left: 360,
  right: 1560,
  centerY: 230,
  amplitude: 58,
  travelX: 120,
  delayStart: 0.18,
  delayStep: 0.035,
  duration: 3.4,
  sizeMin: 12,
  sizeMax: 20,
  shapeOffset: 3,
});

export function ConfettiRainCelebration({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("crc", "sky");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[6]} />
      </defs>

      <path d="M 340 235 C 610 120, 820 330, 1040 220 S 1390 155, 1580 245" fill="none" stroke={CONFETTI_ACCENTS[1]} strokeWidth="4" strokeLinecap="round" opacity="0.2" />
      <ConfettiGlow glowId={glow} cx={960} cy={270} r={300} opacity={0.48} />

      <ConfettiSparkle cx={620} cy={180} size={14} delay={0.18} duration={3.4} opacity={0.56} />
      <ConfettiSparkle cx={960} cy={150} size={22} delay={0.26} duration={3.4} opacity={0.72} />
      <ConfettiSparkle cx={1310} cy={190} size={14} delay={0.34} duration={3.4} opacity={0.56} />

      {GARLAND.map((piece, index) => (
        <AnimatedConfettiPiece key={`garland-${index}`} piece={piece} animation="wink-confetti-wave" easing="ease-in-out" spinDuration={1.7} />
      ))}

      {BACK_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`back-${index}`}
          piece={{ ...piece, opacity: 0.58 }}
          animation="wink-confetti-fall"
          easing="linear"
          spinDuration={1.8}
        />
      ))}

      {FRONT_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`front-${index}`}
          piece={piece}
          animation="wink-confetti-fall"
          easing="linear"
          spinDuration={1.5}
        />
      ))}
    </EffectSvg>
  );
}
