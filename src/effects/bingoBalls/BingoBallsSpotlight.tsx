import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import {
  BINGO_LETTERS,
  MAIN_CY,
  MAIN_GAP,
  MAIN_START_X,
  MainBingoBall,
  SMALL_PALETTE,
  SmallBingoBall,
} from "./_bingoShared";

export function BingoBallsSpotlight({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <ellipse
        cx={960}
        cy={560}
        rx={760}
        ry={240}
        fill={GOLD}
        opacity="0.12"
        style={{ animation: "wink-glow-pulse 3.4s ease-in-out infinite" }}
      />

      {BINGO_LETTERS.map((_, i) => {
        const x = MAIN_START_X + i * MAIN_GAP;

        return (
          <g key={i}>
            <MainBingoBall
              index={i}
              style={{
                transformOrigin: `${x}px ${MAIN_CY}px`,
                animation: "wink-glow-pulse 3s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
            <g
              style={{
                transform: `translate(${x}px, ${MAIN_CY}px)`,
              }}
            >
              <g
                style={{
                  // @ts-expect-error css custom props
                  "--orbit-r": "135px",
                  transformOrigin: "0 0",
                  animation: "wink-orbit 3.4s linear infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              >
                <SmallBingoBall cx={0} cy={0} r={22} color={SMALL_PALETTE[(i + 2) % SMALL_PALETTE.length]} />
              </g>
            </g>
            <g
              style={{
                transformOrigin: `${x}px ${MAIN_CY - 170}px`,
                animation: "wink-sparkle 2.4s ease-in-out infinite",
                animationDelay: `${0.2 + i * 0.12}s`,
              }}
            >
              <path d={starPath(x, MAIN_CY - 170, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
            </g>
          </g>
        );
      })}
    </EffectSvg>
  );
}
