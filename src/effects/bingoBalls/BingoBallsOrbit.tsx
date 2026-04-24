import { EffectSvg } from "../_shared";
import { MainBingoBall, SmallBingoBall, BINGO_LETTERS, SMALL_PALETTE, MAIN_START_X, MAIN_GAP, MAIN_CY } from "./_bingoShared";

const ORBITERS = Array.from({ length: 5 }, (_, i) => ({
  index: i,
  // each orbit anchored on its main ball
  cx: MAIN_START_X + i * MAIN_GAP,
  cy: MAIN_CY,
  r: 24,
  delay: i * 0.2,
  duration: 3.6,
  color: SMALL_PALETTE[(i + 1) % SMALL_PALETTE.length],
}));

export function BingoBallsOrbit({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {/* main BINGO */}
      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall key={i} index={i} />
      ))}
      {/* orbiters: each small ball orbits its main ball */}
      {ORBITERS.map((o, i) => (
        <g key={i} style={{ transform: `translate(${o.cx}px, ${o.cy}px)` }}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": "170px",
              transformOrigin: "0 0",
              animation: `wink-orbit ${o.duration}s linear infinite`,
              animationDelay: `${o.delay}s`,
            }}
          >
            <SmallBingoBall cx={0} cy={0} r={o.r} color={o.color} />
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
