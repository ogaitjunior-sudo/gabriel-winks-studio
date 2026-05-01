import fs from "node:fs/promises";
import path from "node:path";

import {
  PROJECT_ROOT,
  WINK_SPECS,
  ensureWinkStructure,
  sortIds,
  titleFromId,
} from "./wink-config.mjs";
import { normalizeWinkSvgFiles } from "./normalize-wink-svgs.mjs";

const FONT_STACK = "'Trebuchet MS', 'Segoe UI', sans-serif";
const STROKE_LIGHT = "rgba(255,255,255,0.75)";
const LOOP_STYLE = `
  text {
    font-family: ${FONT_STACK};
    paint-order: stroke fill;
  }

  @keyframes wink-enter-pop {
    0%, 100% {
      opacity: 0;
      transform: translate(var(--from-x, 0px), var(--from-y, 32px)) scale(0.32) rotate(var(--from-r, -14deg));
    }
    14% { opacity: 1; }
    32% { opacity: 1; transform: translate(0px, 0px) scale(1.08) rotate(0deg); }
    64% { opacity: 1; transform: translate(0px, 0px) scale(1) rotate(0deg); }
    88% { opacity: 1; }
  }

  @keyframes wink-enter-rise {
    0%, 100% { opacity: 0; transform: translate(0px, 120px) scale(0.4); }
    18% { opacity: 1; }
    34% { opacity: 1; transform: translate(0px, -10px) scale(1.05); }
    50%, 84% { opacity: 1; transform: translate(0px, 0px) scale(1); }
  }

  @keyframes wink-enter-spin {
    0%, 100% { opacity: 0; transform: rotate(-220deg) scale(0.2); }
    18% { opacity: 1; }
    36% { opacity: 1; transform: rotate(12deg) scale(1.08); }
    54%, 86% { opacity: 1; transform: rotate(0deg) scale(1); }
  }

  @keyframes wink-hover-bob {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50% { transform: translateY(-14px) rotate(1.4deg); }
  }

  @keyframes wink-hover-sway {
    0%, 100% { transform: rotate(-3deg) translateY(0px); }
    50% { transform: rotate(3deg) translateY(-8px); }
  }

  @keyframes wink-featured-pop {
    0%, 100% { opacity: 1; transform: translateY(0px) scale(0.78) rotate(-6deg); }
    12% { opacity: 1; transform: translateY(-26px) scale(1.3) rotate(4deg); }
    22% { opacity: 1; transform: translateY(10px) scale(0.95) rotate(-2deg); }
    34%, 76% { opacity: 1; transform: translateY(0px) scale(1) rotate(0deg); }
    88% { opacity: 1; transform: translateY(-8px) scale(1.06) rotate(0deg); }
  }

  @keyframes wink-featured-burst {
    0%, 40%, 100% { opacity: 0; transform: scale(0.38); }
    48% { opacity: 0.95; transform: scale(0.92); }
    60% { opacity: 0.42; transform: scale(1.18); }
    72% { opacity: 0; transform: scale(1.34); }
  }

  @keyframes wink-pulse {
    0%, 100% { transform: scale(0.96); opacity: 0.65; }
    50% { transform: scale(1.08); opacity: 1; }
  }

  @keyframes wink-impact-ring {
    0%, 46%, 100% { opacity: 0; transform: scale(0.24); }
    58% { opacity: 0.95; transform: scale(1); }
    82% { opacity: 0; transform: scale(1.38); }
  }

  @keyframes wink-burst-sprite {
    0%, 100% {
      opacity: 0;
      transform: translate(0px, 0px) scale(0.18) rotate(var(--r0, 0deg));
    }
    18% { opacity: 1; }
    60% {
      opacity: 1;
      transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(1) rotate(var(--r1, 180deg));
    }
    82% {
      opacity: 1;
      transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.92) rotate(var(--r2, 320deg));
    }
  }

  @keyframes wink-fall {
    0%, 100% {
      opacity: 0;
      transform: translate(0px, -120px) rotate(var(--r0, 0deg)) scale(0.55);
    }
    14% { opacity: 1; }
    84% { opacity: 1; }
    100% {
      opacity: 0;
      transform: translate(var(--tx, 0px), var(--ty, 620px)) rotate(var(--r1, 220deg)) scale(1);
    }
  }

  @keyframes wink-twinkle {
    0%, 100% { opacity: 0; transform: scale(0.2) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(12deg); }
  }

  @keyframes wink-finale {
    0%, 54%, 100% { opacity: 0; transform: scale(0.4); }
    64% { opacity: 1; transform: scale(1.1); }
    84% { opacity: 1; transform: scale(1); }
  }

  @keyframes wink-flame {
    0%, 100% { transform: scaleY(0.82) rotate(-3deg); opacity: 0.78; }
    50% { transform: scaleY(1.12) rotate(3deg); opacity: 1; }
  }

  @keyframes wink-draw-path {
    0%, 100% {
      opacity: 0;
      stroke-dashoffset: var(--dash, 900);
    }
    16% { opacity: 1; }
    42%, 82% {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }

  @keyframes wink-count-step {
    0%, 100% { opacity: 0; transform: scale(0.28); }
    9% { opacity: 1; transform: scale(1.08); }
    18% { opacity: 1; transform: scale(1); }
    26% { opacity: 0; transform: scale(1.18); }
  }
`;

const VARIANTS = [
  categoryEntries("Countdown", [
    [
      "countdown-bingo-letter-pop-chat-wink",
      "chat",
      3800,
      { mood: "bingo-letter-pop", name: "Countdown Bingo Letter Pop" },
    ],
    [
      "countdown-bingo-ball-letters-chat-wink",
      "chat",
      3900,
      { mood: "bingo-ball-letters", name: "Countdown Bingo Ball Letters" },
    ],
    [
      "countdown-bingo-confetti-reveal-chat-wink",
      "chat",
      3900,
      { mood: "bingo-confetti-reveal", name: "Countdown Bingo Confetti Reveal" },
    ],
    [
      "countdown-bingo-gold-flash-chat-wink",
      "chat",
      3800,
      { mood: "bingo-gold-flash", name: "Countdown Bingo Gold Flash" },
    ],
    [
      "countdown-bingo-bounce-letters-chat-wink",
      "chat",
      3600,
      { mood: "bingo-bounce-letters", name: "Countdown Bingo Bounce Letters" },
    ],
    [
      "countdown-simple-pop-chat-wink",
      "chat",
      2900,
      { mood: "simple-pop", name: "Countdown Simple Pop" },
    ],
    [
      "countdown-simple-confetti-chat-wink",
      "chat",
      3000,
      { mood: "simple-confetti", name: "Countdown Simple Confetti" },
    ],
    [
      "countdown-simple-firework-chat-wink",
      "chat",
      3200,
      { mood: "simple-firework", name: "Countdown Simple Firework" },
    ],
    [
      "countdown-simple-gold-burst-chat-wink",
      "chat",
      3000,
      { mood: "simple-gold-burst", name: "Countdown Simple Gold Burst" },
    ],
    [
      "countdown-simple-party-chat-wink",
      "chat",
      3200,
      { mood: "simple-party", name: "Countdown Simple Party" },
    ],
    [
      "countdown-bingo-letter-pop-effect-wink",
      "effect",
      3800,
      { mood: "bingo-letter-pop", name: "Countdown Bingo Letter Pop" },
    ],
    [
      "countdown-bingo-ball-letters-effect-wink",
      "effect",
      4000,
      { mood: "bingo-ball-letters", name: "Countdown Bingo Ball Letters" },
    ],
    [
      "countdown-bingo-confetti-reveal-effect-wink",
      "effect",
      3900,
      { mood: "bingo-confetti-reveal", name: "Countdown Bingo Confetti Reveal" },
    ],
    [
      "countdown-bingo-firework-reveal-effect-wink",
      "effect",
      3900,
      { mood: "bingo-firework-reveal", name: "Countdown Bingo Firework Reveal" },
    ],
    [
      "countdown-bingo-mega-reveal-effect-wink",
      "effect",
      4000,
      { mood: "bingo-mega-reveal", name: "Countdown Bingo Mega Reveal" },
    ],
    [
      "countdown-simple-pop-effect-wink",
      "effect",
      3000,
      { mood: "simple-pop", name: "Countdown Simple Pop" },
    ],
    [
      "countdown-simple-confetti-effect-wink",
      "effect",
      3200,
      { mood: "simple-confetti", name: "Countdown Simple Confetti" },
    ],
    [
      "countdown-simple-firework-effect-wink",
      "effect",
      3300,
      { mood: "simple-firework", name: "Countdown Simple Firework" },
    ],
    [
      "countdown-simple-gold-burst-effect-wink",
      "effect",
      3000,
      { mood: "simple-gold-burst", name: "Countdown Simple Gold Burst" },
    ],
    [
      "countdown-simple-party-effect-wink",
      "effect",
      3400,
      { mood: "simple-party", name: "Countdown Simple Party" },
    ],
  ]),
  categoryEntries("Happy Birthday", [
    [
      "happy-birthday-cake-pop-chat-wink",
      "chat",
      3000,
      { mood: "center-pop-bounce", name: "Happy Birthday Cake Pop Bounce" },
    ],
    [
      "happy-birthday-candle-light-chat-wink",
      "chat",
      3200,
      { mood: "candles-sequence-fade", name: "Happy Birthday Candle Fade In" },
    ],
    [
      "happy-birthday-confetti-cake-chat-wink",
      "chat",
      3300,
      { mood: "confetti-cannon-reveal", name: "Happy Birthday Confetti Cannon" },
    ],
    [
      "happy-birthday-bounce-title-chat-wink",
      "chat",
      3000,
      { mood: "jelly-bounce-cake", name: "Happy Birthday Jelly Cake Bounce" },
    ],
    [
      "happy-birthday-gift-cake-chat-wink",
      "chat",
      3200,
      { mood: "gift-box-reveal", name: "Happy Birthday Gift Box Reveal" },
    ],
    [
      "happy-birthday-balloon-cake-chat-wink",
      "chat",
      3400,
      { mood: "balloon-lift-follow", name: "Happy Birthday Balloon Lift" },
    ],
    [
      "happy-birthday-sparkle-cake-chat-wink",
      "chat",
      3200,
      { mood: "stars-circle-shimmer", name: "Happy Birthday Star Shimmer" },
    ],
    [
      "happy-birthday-party-popper-chat-wink",
      "chat",
      3300,
      { mood: "side-popper-burst", name: "Happy Birthday Party Poppers" },
    ],
    [
      "happy-birthday-frosting-write-chat-wink",
      "chat",
      3400,
      { mood: "frosting-script-title", name: "Happy Birthday Frosting Script" },
    ],
    [
      "happy-birthday-mega-party-chat-wink",
      "chat",
      3700,
      { mood: "ribbon-unwrap-reveal", name: "Happy Birthday Ribbon Reveal" },
    ],
    [
      "happy-birthday-cake-pop-effect-wink",
      "effect",
      3000,
      { mood: "cake-slices-assemble", name: "Happy Birthday Cake Slice Build" },
    ],
    [
      "happy-birthday-candle-light-effect-wink",
      "effect",
      3200,
      { mood: "wish-blow-title", name: "Happy Birthday Candle Wish" },
    ],
    [
      "happy-birthday-confetti-cake-effect-wink",
      "effect",
      3400,
      { mood: "firework-backdrop-cake", name: "Happy Birthday Firework Backdrop" },
    ],
    [
      "happy-birthday-bounce-title-effect-wink",
      "effect",
      3100,
      { mood: "sparkle-trail-title", name: "Happy Birthday Sparkle Trail" },
    ],
    [
      "happy-birthday-gift-cake-effect-wink",
      "effect",
      3300,
      { mood: "hat-drop-cake", name: "Happy Birthday Hat Drop" },
    ],
    [
      "happy-birthday-balloon-cake-effect-wink",
      "effect",
      3500,
      { mood: "balloon-letter-title", name: "Happy Birthday Balloon Letters" },
    ],
    [
      "happy-birthday-sparkle-cake-effect-wink",
      "effect",
      3200,
      { mood: "spin-sparkle-cake", name: "Happy Birthday Spin Sparkle Cake" },
    ],
    [
      "happy-birthday-party-popper-effect-wink",
      "effect",
      3400,
      { mood: "cupcake-parade-cake", name: "Happy Birthday Cupcake Parade" },
    ],
    [
      "happy-birthday-frosting-write-effect-wink",
      "effect",
      3500,
      { mood: "gold-elegant-birthday", name: "Happy Birthday Elegant Gold" },
    ],
    [
      "happy-birthday-mega-party-effect-wink",
      "effect",
      3900,
      { mood: "mega-party-finale", name: "Happy Birthday Mega Party Finale" },
    ],
  ]),
  categoryEntries("Thumbs Up", [
    ["thumbs-up-pop", "effect", 2800, { title: "LIKE!", accent: "POP", mood: "pop", name: "Thumbs Up Signature Pop" }],
    ["thumbs-up-gold-burst", "effect", 3000, { title: "NICE", accent: "WIN", mood: "gold", name: "Thumbs Up Gilded Victory" }],
    ["thumbs-up-sparkle", "effect", 2800, { title: "APPROVED", accent: "SPARK", mood: "sparkle", name: "Thumbs Up Starlight Approval" }],
    ["thumbs-up-bounce", "effect", 2800, { title: "YEAH", accent: "BOUNCE", mood: "bounce", name: "Thumbs Up Bounce Royale" }],
    ["thumbs-up-confetti", "effect", 3200, { title: "CHEERS", accent: "CONFETTI", mood: "confetti", name: "Thumbs Up Celebration Luxe" }],
    ["thumbs-up-premium-pulse", "effect", 3000, { title: "PREMIUM", accent: "PULSE", mood: "pulse", name: "Thumbs Up Premium Pulse" }],
    ["thumbs-up-spotlight-salute", "effect", 3200, { title: "SPOTLIGHT", accent: "SALUTE", mood: "spotlight", name: "Thumbs Up Spotlight Salute" }],
    ["thumbs-up-victory-seal", "effect", 3000, { title: "VICTORY", accent: "SEAL", mood: "seal", name: "Thumbs Up Victory Seal" }],
    ["thumbs-up-royal-ribbon", "effect", 3200, { title: "ROYAL", accent: "RIBBON", mood: "ribbon", name: "Thumbs Up Royal Ribbon" }],
    ["thumbs-up-neon-flare", "effect", 3000, { title: "NEON", accent: "FLARE", mood: "flare", name: "Thumbs Up Neon Flare" }],
    ["thumbs-up-star-ring", "chat", 2800, { title: "TOP", accent: "PICK", mood: "ring" }],
    ["thumbs-up-fast-reaction", "chat", 2600, { title: "FAST", accent: "REACTION", mood: "fast" }],
    ["thumbs-up-win-badge", "chat", 2900, { title: "WIN", accent: "BADGE", mood: "badge" }],
    ["thumbs-up-jackpot", "chat", 3200, { title: "JACKPOT", accent: "LIKE", mood: "jackpot" }],
    ["thumbs-up-chat-reaction", "chat", 2800, { title: "CHAT", accent: "REACTION", mood: "chat" }],
  ]),
  categoryEntries("Leprechaun", [
    ["leprechaun-lucky-clover", "effect", 3000, { title: "LUCKY", accent: "CLOVER", mood: "clover", name: "Leprechaun Clover Royale" }],
    ["leprechaun-gold-coins", "effect", 3200, { title: "GOLD", accent: "COINS", mood: "coins", name: "Leprechaun Golden Coin Shower" }],
    ["leprechaun-rainbow-pop", "effect", 3200, { title: "RAINBOW", accent: "POP", mood: "rainbow", name: "Leprechaun Rainbow Luxe" }],
    ["leprechaun-hat-bounce", "effect", 2800, { title: "LUCKY", accent: "HAT", mood: "hat", name: "Leprechaun Emerald Hat Bounce" }],
    ["leprechaun-pot-of-gold", "effect", 3200, { title: "POT O' GOLD", accent: "LUCK", mood: "pot", name: "Leprechaun Pot Of Gold Premiere" }],
    ["leprechaun-emerald-crown", "effect", 3000, { title: "EMERALD", accent: "CROWN", mood: "crown", name: "Leprechaun Emerald Crown" }],
    ["leprechaun-coin-fountain", "effect", 3200, { title: "COIN", accent: "FOUNTAIN", mood: "fountain", name: "Leprechaun Coin Fountain" }],
    ["leprechaun-lucky-seal", "effect", 3000, { title: "LUCKY", accent: "SEAL", mood: "seal", name: "Leprechaun Lucky Seal" }],
    ["leprechaun-rainbow-vault", "effect", 3400, { title: "RAINBOW", accent: "VAULT", mood: "vault", name: "Leprechaun Rainbow Vault" }],
    ["leprechaun-treasure-burst", "effect", 3200, { title: "TREASURE", accent: "BURST", mood: "treasure", name: "Leprechaun Treasure Burst" }],
    ["leprechaun-lucky-spin", "chat", 2800, { title: "SPIN", accent: "LUCKY", mood: "spin" }],
    ["leprechaun-clover-burst", "chat", 2900, { title: "CLOVER", accent: "BURST", mood: "burst" }],
    ["leprechaun-gold-rain", "chat", 3200, { title: "GOLD", accent: "RAIN", mood: "rain" }],
    ["leprechaun-magic-spark", "chat", 2800, { title: "MAGIC", accent: "SPARK", mood: "magic" }],
    ["leprechaun-jackpot-luck", "chat", 3400, { title: "JACKPOT", accent: "LUCK", mood: "jackpot" }],
  ]),
  categoryEntries("Flowers", [
    ["flowers-bloom-pop", "effect", 3000, { title: "BLOOM", accent: "POP", mood: "bloom", name: "Flowers Velvet Bloom" }],
    ["flowers-petal-rain", "effect", 3200, { title: "PETALS", accent: "RAIN", mood: "petals", name: "Flowers Petal Rain Reverie" }],
    ["flowers-bouquet-burst", "effect", 3200, { title: "BOUQUET", accent: "BURST", mood: "bouquet", name: "Flowers Bouquet Gala" }],
    ["flowers-rose-spin", "effect", 3000, { title: "ROSE", accent: "SPIN", mood: "rose", name: "Flowers Rose Luxe Spin" }],
    ["flowers-spring-wave", "effect", 3200, { title: "SPRING", accent: "WAVE", mood: "spring", name: "Flowers Spring Garden Overture" }],
    ["flowers-orchid-glow", "effect", 3000, { title: "ORCHID", accent: "GLOW", mood: "orchid", name: "Flowers Orchid Glow Premiere" }],
    ["flowers-peony-crown", "effect", 3200, { title: "PEONY", accent: "CROWN", mood: "crown", name: "Flowers Peony Crown" }],
    ["flowers-blossom-halo", "effect", 3000, { title: "BLOSSOM", accent: "HALO", mood: "halo", name: "Flowers Blossom Halo" }],
    ["flowers-garden-ribbon", "effect", 3200, { title: "GARDEN", accent: "RIBBON", mood: "ribbon", name: "Flowers Garden Ribbon Gala" }],
    ["flowers-petal-fanfare", "effect", 3200, { title: "PETAL", accent: "FANFARE", mood: "fanfare", name: "Flowers Petal Fanfare" }],
    ["flowers-heart-petals", "chat", 2900, { title: "LOVE", accent: "PETALS", mood: "heart" }],
    ["flowers-garden-sparkle", "chat", 3000, { title: "GARDEN", accent: "SPARKLE", mood: "sparkle" }],
    ["flowers-floral-confetti", "chat", 3200, { title: "FLORAL", accent: "CONFETTI", mood: "confetti" }],
    ["flowers-soft-bloom", "chat", 3000, { title: "SOFT", accent: "BLOOM", mood: "soft" }],
    ["flowers-mega-bloom", "chat", 3600, { title: "MEGA", accent: "BLOOM", mood: "mega" }],
  ]),
  categoryEntries("Fireworks", [
    [
      "fireworks-bingo-text-effect-wink",
      "effect",
      3200,
      { mood: "bingo-text", name: "Fireworks Bingo Text Showcase" },
    ],
    [
      "fireworks-win-text-effect-wink",
      "effect",
      2900,
      { mood: "win-text", name: "Fireworks Win Text Showcase" },
    ],
    [
      "fireworks-jackpot-text-effect-wink",
      "effect",
      3600,
      { mood: "jackpot-text", name: "Fireworks Jackpot Text Showcase" },
    ],
    [
      "fireworks-star-shape-effect-wink",
      "effect",
      3000,
      { mood: "star-shape", name: "Fireworks Star Shape Showcase" },
    ],
    [
      "fireworks-heart-shape-effect-wink",
      "effect",
      3000,
      { mood: "heart-shape", name: "Fireworks Heart Shape Showcase" },
    ],
    [
      "fireworks-crown-shape-effect-wink",
      "effect",
      3200,
      { mood: "crown-shape", name: "Fireworks Crown Shape Showcase" },
    ],
    [
      "fireworks-clover-shape-effect-wink",
      "effect",
      3000,
      { mood: "clover-shape", name: "Fireworks Clover Shape Showcase" },
    ],
    [
      "fireworks-smiley-shape-effect-wink",
      "effect",
      3000,
      { mood: "smiley-shape", name: "Fireworks Smiley Shape Showcase" },
    ],
    [
      "fireworks-trophy-shape-effect-wink",
      "effect",
      3200,
      { mood: "trophy-shape", name: "Fireworks Trophy Shape Showcase" },
    ],
    [
      "fireworks-gift-shape-effect-wink",
      "effect",
      3000,
      { mood: "gift-shape", name: "Fireworks Gift Shape Showcase" },
    ],
    [
      "fireworks-cake-shape-effect-wink",
      "effect",
      3200,
      { mood: "cake-shape", name: "Fireworks Cake Shape Showcase" },
    ],
    [
      "fireworks-thumbs-up-shape-effect-wink",
      "effect",
      3000,
      { mood: "thumbs-shape", name: "Fireworks Thumbs Up Shape Showcase" },
    ],
    [
      "fireworks-flower-shape-effect-wink",
      "effect",
      3000,
      { mood: "flower-shape", name: "Fireworks Flower Shape Showcase" },
    ],
    [
      "fireworks-rainbow-arc-effect-wink",
      "effect",
      3400,
      { mood: "rainbow-arc", name: "Fireworks Rainbow Arc Showcase" },
    ],
    [
      "fireworks-number-3-effect-wink",
      "effect",
      2800,
      { mood: "number-3", name: "Fireworks Number Three Showcase" },
    ],
    [
      "fireworks-number-2-effect-wink",
      "effect",
      2800,
      { mood: "number-2", name: "Fireworks Number Two Showcase" },
    ],
    [
      "fireworks-number-1-effect-wink",
      "effect",
      2800,
      { mood: "number-1", name: "Fireworks Number One Showcase" },
    ],
    [
      "fireworks-final-bingo-countdown-effect-wink",
      "effect",
      3900,
      { mood: "countdown-finale", name: "Fireworks Final Bingo Countdown Showcase" },
    ],
    [
      "fireworks-gold-burst-frame-effect-wink",
      "effect",
      3400,
      { mood: "gold-frame", name: "Fireworks Gold Burst Frame Showcase" },
    ],
    [
      "fireworks-mega-finale-symbols-effect-wink",
      "effect",
      4000,
      { mood: "mega-finale", name: "Fireworks Mega Finale Symbols Showcase" },
    ],
  ]),
].flat();

const RETIRED_LIBRARY_VARIANTS = [
  { id: "countdown-pop-bingo", kind: "effect" },
  { id: "countdown-casino-balls", kind: "effect" },
  { id: "countdown-confetti-reveal", kind: "effect" },
  { id: "countdown-firework-burst", kind: "effect" },
  { id: "countdown-neon-bounce", kind: "effect" },
  { id: "countdown-gold-flash", kind: "chat" },
  { id: "countdown-jackpot-spin", kind: "chat" },
  { id: "countdown-bingo-ball-drop", kind: "chat" },
  { id: "countdown-star-burst", kind: "chat" },
  { id: "countdown-party-finale", kind: "chat" },
  { id: "birthday-cake-candle-pop", kind: "effect" },
  { id: "birthday-balloon-burst", kind: "effect" },
  { id: "birthday-confetti-shower", kind: "effect" },
  { id: "birthday-gift-box-pop", kind: "effect" },
  { id: "birthday-party-hat-bounce", kind: "effect" },
  { id: "birthday-sparkle-title", kind: "chat" },
  { id: "birthday-cupcake-spin", kind: "chat" },
  { id: "birthday-streamer-wave", kind: "chat" },
  { id: "birthday-candle-wish", kind: "chat" },
  { id: "birthday-mega-party", kind: "chat" },
];

const FIREWORK_STAGE_WINDOWS = {
  a: { end: 47, hold: 42, settle: 38, start: 30 },
  b: { end: 63, hold: 58, settle: 54, start: 46 },
  c: { end: 79, hold: 74, settle: 70, start: 62 },
  d: { end: 95, hold: 90, settle: 86, start: 78 },
  single: { end: 88, hold: 72, settle: 48, start: 36 },
};

function buildFireworkStageKeyframes(name, window) {
  const launchStart = Math.max(window.start - 18, 0);
  const preStart = Math.max(window.start - 8, 0);
  const burstStart = Math.max(window.start - 4, 0);
  const holdFade = Math.max(window.hold - 4, 0);

  return `
    @keyframes fw-trail-${name} {
      0%, ${Math.max(launchStart - 4, 0)}%,
      100% {
        opacity: 0;
        stroke-dashoffset: var(--trail-len, 900);
      }
      ${launchStart}% { opacity: 0.12; }
      ${Math.max(window.start - 1, launchStart)}% {
        opacity: 0.94;
        stroke-dashoffset: 0;
      }
      ${Math.min(window.start + 3, window.end)}% {
        opacity: 0;
        stroke-dashoffset: 0;
      }
    }

    @keyframes fw-head-${name} {
      0%, ${Math.max(launchStart - 3, 0)}%,
      100% {
        opacity: 0;
        transform: translate(0px, 0px) scale(0.18);
      }
      ${launchStart}% { opacity: 1; }
      ${Math.max(window.start - 1, launchStart)}% {
        opacity: 1;
        transform: translate(var(--dx, 0px), var(--dy, 0px)) scale(1);
      }
      ${Math.min(window.start + 2, window.end)}% {
        opacity: 0;
        transform: translate(var(--dx, 0px), var(--dy, 0px)) scale(0.42);
      }
    }

    @keyframes fw-pause-${name} {
      0%, ${Math.max(window.start - 6, 0)}%,
      100% {
        opacity: 0;
        transform: scale(0.18);
      }
      ${Math.max(window.start - 2, 0)}% {
        opacity: 1;
        transform: scale(0.34);
      }
      ${Math.min(window.start + 3, window.end)}% {
        opacity: 0;
        transform: scale(0.62);
      }
    }

    @keyframes fw-window-${name} {
      0%, ${preStart}%,
      100% { opacity: 0; }
      ${window.start}%,
      ${window.hold}% { opacity: 1; }
      ${window.end}% { opacity: 0; }
    }

    @keyframes fw-particle-${name} {
      0%, ${preStart}%,
      100% {
        opacity: 0;
        transform: translate(0px, 0px) scale(0.14);
      }
      ${window.start}% {
        opacity: 1;
        transform: translate(calc(var(--tx, 0px) * 0.24), calc(var(--ty, 0px) * 0.24)) scale(0.5);
      }
      ${window.settle}%,
      ${window.hold}% {
        opacity: 1;
        transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(1);
      }
      ${window.end}% {
        opacity: 0;
        transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0.72);
      }
    }

    @keyframes fw-outline-${name} {
      0%, ${preStart}%,
      100% {
        opacity: 0;
        stroke-dashoffset: var(--dash-len, 1800);
      }
      ${window.settle}%,
      ${window.hold}% {
        opacity: 1;
        stroke-dashoffset: 0;
      }
      ${window.end}% {
        opacity: 0;
        stroke-dashoffset: 0;
      }
    }

    @keyframes fw-burst-${name} {
      0%, ${Math.max(burstStart - 1, 0)}%,
      100% {
        opacity: 0;
        transform: scale(0.16);
      }
      ${burstStart}% {
        opacity: 1;
        transform: scale(0.26);
      }
      ${window.settle}% {
        opacity: 1;
        transform: scale(1);
      }
      ${holdFade}% {
        opacity: 0.22;
        transform: scale(1.08);
      }
      ${window.end}% {
        opacity: 0;
        transform: scale(1.18);
      }
    }

    @keyframes fw-core-${name} {
      0%, ${Math.max(window.start - 1, 0)}%,
      100% {
        opacity: 0;
        transform: scale(0.22);
      }
      ${window.settle}%,
      ${window.hold}% {
        opacity: 0.94;
        transform: scale(1);
      }
      ${window.end}% {
        opacity: 0;
        transform: scale(1.2);
      }
    }

    @keyframes fw-sparkle-${name} {
      0%, ${Math.max(window.settle - 4, 0)}%,
      100% {
        opacity: 0;
        transform: scale(0.24);
      }
      ${Math.min(window.settle + 4, window.hold)}%,
      ${window.hold}% {
        opacity: 1;
        transform: scale(1);
      }
      ${window.end}% {
        opacity: 0;
        transform: scale(1.26);
      }
    }
  `;
}

const FIREWORK_STAGE_STYLE = `
  @keyframes fw-ambient-twinkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0.24) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(16deg);
    }
  }

  .fw-outline {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: var(--dash-len, 1800);
    stroke-dashoffset: var(--dash-len, 1800);
    vector-effect: non-scaling-stroke;
  }

  .fw-dot-outline {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1 20;
    vector-effect: non-scaling-stroke;
  }

  ${Object.entries(FIREWORK_STAGE_WINDOWS)
    .map(([name, window]) => buildFireworkStageKeyframes(name, window))
    .join("\n")}
`;

function categoryEntries(category, entries) {
  return entries.map(([id, kind, durationMs, details]) => ({
    category,
    durationMs,
    id,
    kind,
    ...details,
  }));
}

async function cleanupRetiredVariants(retiredVariants) {
  const byKind = new Map();

  for (const variant of retiredVariants) {
    if (!byKind.has(variant.kind)) {
      byKind.set(variant.kind, []);
    }
    byKind.get(variant.kind).push(variant.id);
  }

  for (const [kind, ids] of byKind.entries()) {
    const paths = await ensureWinkStructure(kind);

    await Promise.all(
      ids.flatMap((id) => [
        fs.rm(path.join(paths.svgDir, `${id}.svg`), { force: true }),
        fs.rm(path.join(paths.apngDir, `${id}.apng`), { force: true }),
        fs.rm(path.join(paths.framesDir, id), { force: true, recursive: true }),
      ])
    );
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function round(value) {
  return Number(value.toFixed(2));
}

function percentX(ctx, value) {
  return round(ctx.width * value);
}

function percentY(ctx, value) {
  return round(ctx.height * value);
}

function unit(ctx, value) {
  return round(Math.min(ctx.width, ctx.height) * value);
}

function polarX(cx, radius, angleDeg) {
  return round(cx + radius * Math.cos((angleDeg * Math.PI) / 180));
}

function polarY(cy, radius, angleDeg) {
  return round(cy + radius * Math.sin((angleDeg * Math.PI) / 180));
}

function starPath(cx, cy, outerRadius, innerRadius, points = 5) {
  const values = [];

  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -90 + (360 / (points * 2)) * index;
    values.push(`${polarX(cx, radius, angle)},${polarY(cy, radius, angle)}`);
  }

  return values.join(" ");
}

function heartPath(cx, cy, width, height) {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height * 0.18;
  const bottom = cy + height / 2;
  return [
    `M ${cx} ${bottom}`,
    `C ${right} ${cy + height * 0.18}, ${right} ${top}, ${cx} ${top}`,
    `C ${left} ${top}, ${left} ${cy + height * 0.18}, ${cx} ${bottom}`,
    "Z",
  ].join(" ");
}

function rainbowArcPath(cx, cy, radius) {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
}

function shadow(cx, cy, rx, ry = rx * 0.22, opacity = 0.16) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${opacity}" />`;
}

function outlineText(text, x, y, fontSize, fill, stroke, extras = "") {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${fontSize}" font-weight="900" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    2,
    fontSize * 0.04
  )}" letter-spacing="${Math.max(0, fontSize * 0.03)}" ${extras}>${escapeXml(text)}</text>`;
}

function pillLabel(x, y, width, height, fill, stroke, text, textColor) {
  return `
    <g>
      <rect x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}" rx="${
    height / 2
  }" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(2, height * 0.07)}" />
      ${outlineText(text, x, y + height * 0.03, height * 0.42, textColor, stroke)}
    </g>
  `;
}

function glowCircle(cx, cy, radius, fill, opacity) {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" opacity="${opacity}" />`;
}

function sparkle(cx, cy, radius, fill, stroke = STROKE_LIGHT) {
  return `<polygon points="${starPath(cx, cy, radius, radius * 0.42, 4)}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    1.2,
    radius * 0.08
  )}" />`;
}

function impactRing(ctx, color, radius, strokeWidth = unit(ctx, 0.014)) {
  const cx = ctx.centerX;
  const cy = ctx.centerY;
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="0.88" style="transform-origin:${cx}px ${cy}px; animation:wink-impact-ring ${ctx.loopSeconds}s ease-out infinite;" />`;
}

function burstGroup(ctx, options = {}) {
  const {
    centerX = ctx.centerX,
    centerY = ctx.centerY,
    colors = ["#ffe88a", "#ffd34d", "#ff8f5c", "#fff3d8"],
    count = 14,
    distance = unit(ctx, 0.26),
    shape = "circle",
    size = unit(ctx, 0.018),
    startAngle = -90,
  } = options;

  return Array.from({ length: count }, (_, index) => {
    const angle = startAngle + (360 / count) * index;
    const delay = round(index * 0.03);
    const color = colors[index % colors.length];
    const tx = polarX(0, distance, angle);
    const ty = polarY(0, distance, angle);
    const sprite = renderParticleShape(shape, {
      color,
      ctx,
      cy: centerY,
      cx: centerX,
      size,
    });

    return `<g style="transform-origin:${centerX}px ${centerY}px; --tx:${tx}px; --ty:${ty}px; --r0:${angle}deg; --r1:${
      angle + 120
    }deg; --r2:${angle + 220}deg; animation:wink-burst-sprite ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite; animation-delay:${delay}s;">${sprite}</g>`;
  }).join("");
}

function fallGroup(ctx, options = {}) {
  const {
    colors = ["#ffd66b", "#f5f0de", "#7ff2b2"],
    columns = 10,
    shape = "confetti",
    size = unit(ctx, 0.02),
    top = percentY(ctx, 0.14),
    spread = ctx.width * 0.72,
    travelY = ctx.height * 0.62,
  } = options;
  const startX = ctx.centerX - spread / 2;

  return Array.from({ length: columns }, (_, index) => {
    const cx = round(startX + (spread / Math.max(columns - 1, 1)) * index);
    const tx = round((index % 2 === 0 ? -1 : 1) * unit(ctx, 0.035));
    const ty = round(travelY + ((index % 3) - 1) * unit(ctx, 0.04));
    const color = colors[index % colors.length];
    const delay = round(index * 0.05);
    const sprite = renderParticleShape(shape, {
      color,
      ctx,
      cx,
      cy: top,
      size,
    });

    return `<g style="transform-origin:${cx}px ${top}px; --tx:${tx}px; --ty:${ty}px; --r0:${index * 22}deg; --r1:${
      120 + index * 17
    }deg; animation:wink-fall ${ctx.loopSeconds}s linear infinite; animation-delay:${delay}s;">${sprite}</g>`;
  }).join("");
}

function twinkleGroup(ctx, options = {}) {
  const {
    colors = ["#fff5c8", "#ffe486", "#9fefff"],
    points = [
      [0.26, 0.24],
      [0.38, 0.18],
      [0.62, 0.19],
      [0.74, 0.28],
      [0.24, 0.74],
      [0.76, 0.76],
    ],
    radius = unit(ctx, 0.018),
  } = options;

  return points
    .map(([x, y], index) => {
      const cx = percentX(ctx, x);
      const cy = percentY(ctx, y);
      const fill = colors[index % colors.length];
      return `<g style="transform-origin:${cx}px ${cy}px; animation:wink-twinkle 1.4s ease-in-out infinite; animation-delay:${round(
        index * 0.17
      )}s;">${sparkle(cx, cy, radius, fill)}</g>`;
    })
    .join("");
}

function renderParticleShape(shape, { color, cx, cy, size }) {
  switch (shape) {
    case "star":
      return `<polygon points="${starPath(cx, cy, size, size * 0.45, 5)}" fill="${color}" stroke="${STROKE_LIGHT}" stroke-width="${Math.max(
        1,
        size * 0.08
      )}" />`;
    case "coin":
      return `
        <circle cx="${cx}" cy="${cy}" r="${size}" fill="${color}" stroke="#b27f00" stroke-width="${Math.max(1.5, size * 0.12)}" />
        <circle cx="${cx}" cy="${cy}" r="${size * 0.56}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="${Math.max(
          1,
          size * 0.1
        )}" />
      `;
    case "petal":
      return `
        <ellipse cx="${cx}" cy="${cy}" rx="${size * 0.72}" ry="${size * 1.16}" fill="${color}" />
        <ellipse cx="${cx}" cy="${cy}" rx="${size * 0.25}" ry="${size * 0.95}" fill="rgba(255,255,255,0.32)" />
      `;
    case "clover":
      return clover(cx, cy, size, color, "#0f6035");
    case "confetti":
      return `<rect x="${cx - size * 0.55}" y="${cy - size * 0.55}" width="${size * 1.1}" height="${size * 1.1}" rx="${size * 0.2}" fill="${color}" />`;
    default:
      return `<circle cx="${cx}" cy="${cy}" r="${size}" fill="${color}" />`;
  }
}

const OFFICIAL_BINGO_BALL_STYLES = {
  B: { fill: "#0278df", stroke: "#015cab" },
  I: { fill: "#f70900", stroke: "#c10700" },
  N: { fill: "#9610b8", stroke: "#740c8f" },
  G: { fill: "#36af0a", stroke: "#288407" },
  O: { fill: "#f7c901", stroke: "#c89d01" },
};

const OFFICIAL_BINGO_LETTER_COLORS = ["#0278df", "#f70900", "#9610b8", "#36af0a", "#f7c901"];

function officialBingoBallStyle(label, fallbackFill, fallbackStroke) {
  const key = String(label ?? "")
    .trim()
    .toUpperCase();

  return OFFICIAL_BINGO_BALL_STYLES[key] ?? { fill: fallbackFill, stroke: fallbackStroke };
}

function bingoBall(cx, cy, radius, fill, stroke, label, textColor = stroke) {
  const official = officialBingoBallStyle(label, fill, stroke);
  const outerFill = official.fill;
  const outerStroke = official.stroke;
  const letterFill = official.fill ?? textColor;

  return `
    <g>
      ${shadow(cx, cy + radius * 1.1, radius * 0.78)}
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${outerFill}" stroke="${outerStroke}" stroke-width="${Math.max(
    2,
    radius * 0.08
  )}" />
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.88}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="${Math.max(
    1.2,
    radius * 0.04
  )}" />
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.64}" fill="#ffffff" stroke="${outerStroke}" stroke-width="${Math.max(
    1.6,
    radius * 0.05
  )}" />
      <text x="${cx}" y="${cy + radius * 0.02}" text-anchor="middle" dominant-baseline="central" font-size="${radius * 0.94}" font-weight="900" fill="${letterFill}" stroke="${outerStroke}" stroke-width="${Math.max(
    1.2,
    radius * 0.06
  )}" letter-spacing="0" font-family="'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif">${escapeXml(label)}</text>
      <ellipse cx="${cx - radius * 0.36}" cy="${cy - radius * 0.48}" rx="${radius * 0.34}" ry="${radius * 0.17}" fill="#fff" opacity="0.5" />
      <path d="M ${cx - radius * 0.52} ${cy - radius * 0.1} C ${cx - radius * 0.18} ${cy - radius * 0.24}, ${cx + radius * 0.08} ${cy - radius * 0.16}, ${cx + radius * 0.3} ${cy + radius * 0.04}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-linecap="round" stroke-width="${Math.max(
    1,
    radius * 0.035
  )}" />
    </g>
  `;
}

function balloon(cx, cy, width, height, fill, stroke) {
  const bottomY = cy + height * 0.52;
  return `
    <g>
      <ellipse cx="${cx}" cy="${cy}" rx="${width / 2}" ry="${height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    2,
    width * 0.06
  )}" />
      <ellipse cx="${cx - width * 0.16}" cy="${cy - height * 0.16}" rx="${width * 0.14}" ry="${height * 0.12}" fill="#fff" opacity="0.38" />
      <path d="M ${cx} ${bottomY} C ${cx - width * 0.06} ${bottomY + height * 0.22}, ${cx + width * 0.08} ${
    bottomY + height * 0.52
  }, ${cx - width * 0.04} ${bottomY + height * 0.8}" fill="none" stroke="${stroke}" stroke-width="${Math.max(
    1.6,
    width * 0.04
  )}" stroke-linecap="round" />
      <polygon points="${cx - width * 0.08},${bottomY - 2} ${cx + width * 0.08},${bottomY - 2} ${cx},${
    bottomY + height * 0.12
  }" fill="${stroke}" opacity="0.8" />
    </g>
  `;
}

function cake(cx, cy, width, height, colors) {
  const baseY = cy + height * 0.26;
  return `
    <g>
      ${shadow(cx, cy + height * 0.62, width * 0.34, height * 0.12)}
      <rect x="${cx - width * 0.34}" y="${cy - height * 0.04}" width="${width * 0.68}" height="${height * 0.28}" rx="${
    width * 0.08
  }" fill="${colors.base}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <rect x="${cx - width * 0.24}" y="${cy - height * 0.28}" width="${width * 0.48}" height="${height * 0.22}" rx="${
    width * 0.08
  }" fill="${colors.top}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <path d="M ${cx - width * 0.34} ${cy + height * 0.02} Q ${cx - width * 0.26} ${cy + height * 0.12}, ${cx - width * 0.18} ${
    cy + height * 0.02
  } T ${cx - width * 0.02} ${cy + height * 0.02} T ${cx + width * 0.14} ${cy + height * 0.02} T ${
    cx + width * 0.3
  } ${cy + height * 0.02}" fill="none" stroke="#fff7ef" stroke-width="${Math.max(
    2,
    width * 0.032
  )}" stroke-linecap="round" />
      ${Array.from({ length: 3 }, (_, index) => {
        const candleX = cx + (index - 1) * width * 0.13;
        return `
          <g style="transform-origin:${candleX}px ${cy - height * 0.34}px; animation:wink-flame 0.9s ease-in-out infinite; animation-delay:${round(
            index * 0.12
          )}s;">
            <rect x="${candleX - width * 0.02}" y="${cy - height * 0.42}" width="${width * 0.04}" height="${
          height * 0.16
        }" rx="${width * 0.01}" fill="${index === 1 ? "#8be9ff" : "#ffd66b"}" />
            <path d="M ${candleX} ${cy - height * 0.52} C ${candleX + width * 0.04} ${cy - height * 0.47}, ${
          candleX + width * 0.02
        } ${cy - height * 0.4}, ${candleX} ${cy - height * 0.34} C ${candleX - width * 0.02} ${
          cy - height * 0.4
        }, ${candleX - width * 0.04} ${cy - height * 0.47}, ${candleX} ${
          cy - height * 0.52
        } Z" fill="#ffb33b" />
          </g>
        `;
      }).join("")}
      <rect x="${cx - width * 0.42}" y="${baseY}" width="${width * 0.84}" height="${height * 0.08}" rx="${
    width * 0.04
  }" fill="${colors.plate}" />
    </g>
  `;
}

function giftBox(cx, cy, width, height, colors) {
  return `
    <g>
      ${shadow(cx, cy + height * 0.46, width * 0.34, height * 0.1)}
      <rect x="${cx - width * 0.34}" y="${cy - height * 0.04}" width="${width * 0.68}" height="${height * 0.42}" rx="${
    width * 0.08
  }" fill="${colors.body}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <rect x="${cx - width * 0.4}" y="${cy - height * 0.22}" width="${width * 0.8}" height="${height * 0.16}" rx="${
    width * 0.06
  }" fill="${colors.lid}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <rect x="${cx - width * 0.05}" y="${cy - height * 0.22}" width="${width * 0.1}" height="${height * 0.6}" fill="${colors.ribbon}" />
      <rect x="${cx - width * 0.4}" y="${cy + height * 0.05}" width="${width * 0.8}" height="${height * 0.08}" fill="${colors.ribbon}" />
      <path d="M ${cx} ${cy - height * 0.22} C ${cx - width * 0.06} ${cy - height * 0.4}, ${cx - width * 0.2} ${
    cy - height * 0.38
  }, ${cx - width * 0.16} ${cy - height * 0.2} C ${cx - width * 0.06} ${cy - height * 0.12}, ${
    cx + width * 0.02
  } ${cy - height * 0.18}, ${cx} ${cy - height * 0.22} Z" fill="${colors.ribbon}" />
      <path d="M ${cx} ${cy - height * 0.22} C ${cx + width * 0.06} ${cy - height * 0.4}, ${cx + width * 0.2} ${
    cy - height * 0.38
  }, ${cx + width * 0.16} ${cy - height * 0.2} C ${cx + width * 0.06} ${cy - height * 0.12}, ${
    cx - width * 0.02
  } ${cy - height * 0.18}, ${cx} ${cy - height * 0.22} Z" fill="${colors.ribbon}" />
    </g>
  `;
}

function partyHat(cx, cy, width, height, colors) {
  return `
    <g>
      <path d="M ${cx} ${cy - height * 0.5} L ${cx + width * 0.32} ${cy + height * 0.38} L ${cx - width * 0.32} ${
    cy + height * 0.38
  } Z" fill="${colors.body}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <circle cx="${cx}" cy="${cy - height * 0.52}" r="${width * 0.08}" fill="${colors.pom}" />
      <path d="M ${cx - width * 0.22} ${cy + height * 0.22} Q ${cx} ${cy - height * 0.02}, ${cx + width * 0.22} ${
    cy + height * 0.2
  }" fill="none" stroke="#fff5d2" stroke-width="${Math.max(2, width * 0.026)}" stroke-dasharray="${
    width * 0.08
  } ${width * 0.05}" />
      ${Array.from({ length: 4 }, (_, index) => {
        const dotX = cx + (index - 1.5) * width * 0.08;
        const dotY = cy + height * (-0.16 + index * 0.1);
        return `<circle cx="${dotX}" cy="${dotY}" r="${width * 0.036}" fill="${
          index % 2 === 0 ? colors.pom : "#fff3dc"
        }" />`;
      }).join("")}
    </g>
  `;
}

function cupcake(cx, cy, width, height, colors) {
  return `
    <g>
      ${shadow(cx, cy + height * 0.44, width * 0.3, height * 0.1)}
      <path d="M ${cx - width * 0.28} ${cy + height * 0.06} L ${cx + width * 0.28} ${cy + height * 0.06} L ${
    cx + width * 0.2
  } ${cy + height * 0.38} L ${cx - width * 0.2} ${cy + height * 0.38} Z" fill="${colors.cup}" stroke="${
    colors.stroke
  }" stroke-width="${Math.max(2, width * 0.03)}" />
      ${Array.from({ length: 4 }, (_, index) => {
        const scoopX = cx + (index - 1.5) * width * 0.14;
        const scoopY = cy - (index % 2 === 0 ? height * 0.08 : height * 0.16);
        return `<circle cx="${scoopX}" cy="${scoopY}" r="${width * 0.14}" fill="${colors.frosting}" stroke="${colors.stroke}" stroke-width="${Math.max(
          1.8,
          width * 0.02
        )}" />`;
      }).join("")}
      <circle cx="${cx}" cy="${cy - height * 0.26}" r="${width * 0.07}" fill="${colors.cherry}" stroke="${colors.stroke}" stroke-width="${Math.max(
    1.5,
    width * 0.018
  )}" />
    </g>
  `;
}

function thumbIcon(cx, cy, size, fill, stroke) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const scale = size / 100;
  const pathData = [
    `M ${x + scale * 35} ${y + scale * 88}`,
    `L ${x + scale * 18} ${y + scale * 88}`,
    `Q ${x + scale * 10} ${y + scale * 88}, ${x + scale * 10} ${y + scale * 80}`,
    `L ${x + scale * 10} ${y + scale * 52}`,
    `Q ${x + scale * 10} ${y + scale * 44}, ${x + scale * 18} ${y + scale * 44}`,
    `L ${x + scale * 34} ${y + scale * 44}`,
    `L ${x + scale * 34} ${y + scale * 18}`,
    `Q ${x + scale * 34} ${y + scale * 10}, ${x + scale * 42} ${y + scale * 10}`,
    `Q ${x + scale * 50} ${y + scale * 10}, ${x + scale * 50} ${y + scale * 18}`,
    `L ${x + scale * 50} ${y + scale * 36}`,
    `L ${x + scale * 76} ${y + scale * 36}`,
    `Q ${x + scale * 90} ${y + scale * 36}, ${x + scale * 90} ${y + scale * 50}`,
    `Q ${x + scale * 90} ${y + scale * 62}, ${x + scale * 80} ${y + scale * 64}`,
    `L ${x + scale * 78} ${y + scale * 64}`,
    `Q ${x + scale * 80} ${y + scale * 74}, ${x + scale * 72} ${y + scale * 80}`,
    `Q ${x + scale * 68} ${y + scale * 86}, ${x + scale * 58} ${y + scale * 86}`,
    `L ${x + scale * 35} ${y + scale * 88}`,
    "Z",
  ].join(" ");

  return `
    <g>
      <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(2, size * 0.04)}" stroke-linejoin="round" />
      <path d="M ${x + scale * 48} ${y + scale * 28} L ${x + scale * 48} ${y + scale * 44}" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="${Math.max(
    1.8,
    size * 0.028
  )}" stroke-linecap="round" />
    </g>
  `;
}

function clover(cx, cy, radius, fill, stroke) {
  const leaf = radius * 0.54;
  return `
    <g>
      <circle cx="${cx - leaf}" cy="${cy - leaf}" r="${leaf}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.08
  )}" />
      <circle cx="${cx + leaf}" cy="${cy - leaf}" r="${leaf}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.08
  )}" />
      <circle cx="${cx - leaf}" cy="${cy + leaf}" r="${leaf}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.08
  )}" />
      <circle cx="${cx + leaf}" cy="${cy + leaf}" r="${leaf}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.08
  )}" />
      <path d="M ${cx} ${cy + radius * 0.58} C ${cx - radius * 0.06} ${cy + radius * 1.1}, ${cx + radius * 0.18} ${
    cy + radius * 1.34
  }, ${cx + radius * 0.4} ${cy + radius * 1.54}" fill="none" stroke="${stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.08
  )}" stroke-linecap="round" />
    </g>
  `;
}

function leprechaunHat(cx, cy, width, height, colors) {
  return `
    <g>
      <rect x="${cx - width * 0.34}" y="${cy - height * 0.12}" width="${width * 0.68}" height="${height * 0.5}" rx="${
    width * 0.08
  }" fill="${colors.body}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <rect x="${cx - width * 0.42}" y="${cy + height * 0.24}" width="${width * 0.84}" height="${height * 0.12}" rx="${
    width * 0.04
  }" fill="${colors.brim}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <rect x="${cx - width * 0.3}" y="${cy + height * 0.04}" width="${width * 0.6}" height="${height * 0.12}" fill="${
    colors.band
  }" />
      <rect x="${cx - width * 0.06}" y="${cy + height * 0.02}" width="${width * 0.12}" height="${height * 0.16}" fill="none" stroke="${
    colors.buckle
  }" stroke-width="${Math.max(2, width * 0.028)}" />
      <rect x="${cx - width * 0.03}" y="${cy + height * 0.06}" width="${width * 0.06}" height="${height * 0.08}" fill="${
    colors.buckle
  }" />
    </g>
  `;
}

function potOfGold(cx, cy, width, height, colors) {
  const coinRadius = width * 0.08;
  return `
    <g>
      ${shadow(cx, cy + height * 0.4, width * 0.36, height * 0.1)}
      ${Array.from({ length: 6 }, (_, index) => {
        const coinX = cx + (index - 2.5) * width * 0.09;
        const coinY = cy - height * 0.1 - Math.abs(index - 2.5) * height * 0.02;
        return `<circle cx="${coinX}" cy="${coinY}" r="${coinRadius}" fill="${colors.coin}" stroke="#b27f00" stroke-width="${Math.max(
          1.5,
          width * 0.018
        )}" />`;
      }).join("")}
      <path d="M ${cx - width * 0.34} ${cy - height * 0.04} Q ${cx} ${cy - height * 0.2}, ${cx + width * 0.34} ${
    cy - height * 0.04
  } L ${cx + width * 0.26} ${cy + height * 0.28} Q ${cx} ${cy + height * 0.42}, ${cx - width * 0.26} ${
    cy + height * 0.28
  } Z" fill="${colors.pot}" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.03)}" />
      <path d="M ${cx - width * 0.24} ${cy - height * 0.18} Q ${cx} ${cy - height * 0.34}, ${cx + width * 0.24} ${
    cy - height * 0.18
  }" fill="none" stroke="${colors.stroke}" stroke-width="${Math.max(2, width * 0.024)}" stroke-linecap="round" />
    </g>
  `;
}

function flower(cx, cy, radius, colors, petals = 6) {
  return `
    <g>
      ${Array.from({ length: petals }, (_, index) => {
        const angle = (360 / petals) * index;
        const px = polarX(cx, radius * 0.78, angle);
        const py = polarY(cy, radius * 0.78, angle);
        return `<ellipse cx="${px}" cy="${py}" rx="${radius * 0.46}" ry="${radius * 0.8}" fill="${colors.petal}" stroke="${colors.stroke}" stroke-width="${Math.max(
          1,
          radius * 0.08
        )}" transform="rotate(${angle} ${px} ${py})" />`;
      }).join("")}
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.42}" fill="${colors.center}" stroke="${colors.stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.09
  )}" />
    </g>
  `;
}

function rose(cx, cy, radius, colors) {
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${colors.outer}" stroke="${colors.stroke}" stroke-width="${Math.max(
    1.5,
    radius * 0.08
  )}" />
      <path d="M ${cx - radius * 0.36} ${cy + radius * 0.02} C ${cx - radius * 0.18} ${cy - radius * 0.34}, ${cx + radius * 0.24} ${
    cy - radius * 0.3
  }, ${cx + radius * 0.18} ${cy + radius * 0.02} C ${cx + radius * 0.14} ${cy + radius * 0.24}, ${
    cx - radius * 0.04
  } ${cy + radius * 0.3}, ${cx - radius * 0.16} ${cy + radius * 0.14}" fill="none" stroke="${
    colors.inner
  }" stroke-width="${Math.max(2, radius * 0.12)}" stroke-linecap="round" />
      <path d="M ${cx - radius * 0.02} ${cy - radius * 0.06} C ${cx + radius * 0.18} ${cy - radius * 0.12}, ${
    cx + radius * 0.16
  } ${cy + radius * 0.12}, ${cx} ${cy + radius * 0.16}" fill="none" stroke="${colors.inner}" stroke-width="${Math.max(
    1.6,
    radius * 0.09
  )}" stroke-linecap="round" />
    </g>
  `;
}

function bouquet(cx, cy, size, colors) {
  return `
    <g>
      ${flower(cx - size * 0.26, cy - size * 0.1, size * 0.2, {
        center: colors.sun,
        petal: colors.pink,
        stroke: colors.stroke,
      })}
      ${flower(cx + size * 0.24, cy - size * 0.16, size * 0.19, {
        center: colors.sun,
        petal: colors.blue,
        stroke: colors.stroke,
      })}
      ${flower(cx, cy - size * 0.28, size * 0.22, {
        center: colors.sun,
        petal: colors.yellow,
        stroke: colors.stroke,
      })}
      <path d="M ${cx - size * 0.24} ${cy + size * 0.08} L ${cx} ${cy + size * 0.42} L ${cx + size * 0.24} ${
    cy + size * 0.08
  }" fill="${colors.wrap}" stroke="${colors.stroke}" stroke-width="${Math.max(2, size * 0.03)}" />
      <path d="M ${cx - size * 0.14} ${cy + size * 0.18} Q ${cx} ${cy + size * 0.28}, ${cx + size * 0.14} ${
    cy + size * 0.18
  }" fill="none" stroke="${colors.ribbon}" stroke-width="${Math.max(2, size * 0.026)}" />
      <path d="M ${cx - size * 0.2} ${cy - size * 0.02} L ${cx - size * 0.04} ${cy + size * 0.24}" fill="none" stroke="#2f9b4b" stroke-width="${Math.max(
    2,
    size * 0.02
  )}" stroke-linecap="round" />
      <path d="M ${cx + size * 0.18} ${cy - size * 0.08} L ${cx + size * 0.04} ${cy + size * 0.22}" fill="none" stroke="#2f9b4b" stroke-width="${Math.max(
    2,
    size * 0.02
  )}" stroke-linecap="round" />
      <path d="M ${cx} ${cy - size * 0.12} L ${cx} ${cy + size * 0.26}" fill="none" stroke="#2f9b4b" stroke-width="${Math.max(
    2,
    size * 0.02
  )}" stroke-linecap="round" />
    </g>
  `;
}

function scenePalette(category, mood) {
  const palettes = {
    Countdown: {
      balls: { base: "#102a52", accent: "#ffd454", flash: "#ff9153", soft: "#fff1d0", extra: "#5ad8ff" },
      confetti: { base: "#0e2b52", accent: "#ffca3f", flash: "#ff5f7a", soft: "#fff6d9", extra: "#3de0c2" },
      drop: { base: "#12314d", accent: "#ffd25a", flash: "#ff7b6f", soft: "#fff5d8", extra: "#61d0ff" },
      firework: { base: "#141f4f", accent: "#ffca45", flash: "#ff7a5d", soft: "#fff5dd", extra: "#8dc7ff" },
      gold: { base: "#3e2b0a", accent: "#ffd95d", flash: "#fff2c7", soft: "#7a5211", extra: "#ffb84b" },
      jackpot: { base: "#3f0c14", accent: "#ffd857", flash: "#ff465f", soft: "#fff4d9", extra: "#ff9d4b" },
      neon: { base: "#071529", accent: "#73f2ff", flash: "#f477ff", soft: "#fffef9", extra: "#ffd54b" },
      party: { base: "#241149", accent: "#ffca4f", flash: "#ff5d89", soft: "#fff5df", extra: "#61f0d2" },
      pop: { base: "#0d2146", accent: "#ffd456", flash: "#ff864c", soft: "#fff5dc", extra: "#69d6ff" },
      stars: { base: "#17214b", accent: "#ffd966", flash: "#fff2ba", soft: "#89ceff", extra: "#ff77c8" },
    },
    "Happy Birthday": {
      "center-pop-bounce": { base: "#5c2341", accent: "#ff8dbc", flash: "#ffd967", soft: "#fff5e6", extra: "#7fdbff" },
      "candles-sequence-fade": { base: "#4b2148", accent: "#ff91c4", flash: "#ffd45c", soft: "#fff8eb", extra: "#91ecff" },
      "confetti-cannon-reveal": { base: "#2a295c", accent: "#ff7ea4", flash: "#ffd35f", soft: "#fff8e6", extra: "#66f0ca" },
      "jelly-bounce-cake": { base: "#4d2658", accent: "#ffa0c5", flash: "#ffe17a", soft: "#fff6ef", extra: "#7fe2ff" },
      "gift-box-reveal": { base: "#243a63", accent: "#ff667d", flash: "#ffd86d", soft: "#fff7eb", extra: "#73dcff" },
      "balloon-lift-follow": { base: "#24305b", accent: "#ff6fa6", flash: "#ffd764", soft: "#fff8e5", extra: "#67e4cf" },
      "stars-circle-shimmer": { base: "#34255b", accent: "#ff8fc3", flash: "#ffe37f", soft: "#fff7ef", extra: "#8bddff" },
      "side-popper-burst": { base: "#27315d", accent: "#ff7a8c", flash: "#ffd55d", soft: "#fff8e7", extra: "#74e9ff" },
      "frosting-script-title": { base: "#5b2c4f", accent: "#ff98c4", flash: "#ffe08a", soft: "#fff8f2", extra: "#8bdff8" },
      "ribbon-unwrap-reveal": { base: "#213e63", accent: "#ff7d7d", flash: "#ffd76c", soft: "#fff9ee", extra: "#7fe1ff" },
      "cake-slices-assemble": { base: "#4f2342", accent: "#ff89b9", flash: "#ffd869", soft: "#fff5e8", extra: "#7fd4ff" },
      "wish-blow-title": { base: "#432045", accent: "#ff9d7f", flash: "#ffd866", soft: "#fff8ef", extra: "#8ddcff" },
      "firework-backdrop-cake": { base: "#27194e", accent: "#ff80a8", flash: "#ffd659", soft: "#fff7e6", extra: "#5de5ff" },
      "sparkle-trail-title": { base: "#3f2263", accent: "#ff8ec0", flash: "#ffe27c", soft: "#fff8f0", extra: "#87efff" },
      "hat-drop-cake": { base: "#4c235e", accent: "#ff7ac2", flash: "#ffd35a", soft: "#fff4dc", extra: "#73f0cf" },
      "balloon-letter-title": { base: "#2c2b61", accent: "#ff82b2", flash: "#ffd967", soft: "#fff8ee", extra: "#7addff" },
      "spin-sparkle-cake": { base: "#4d2258", accent: "#ff87bf", flash: "#ffe07b", soft: "#fff6ed", extra: "#8ddfff" },
      "cupcake-parade-cake": { base: "#41224a", accent: "#ff95cf", flash: "#ffd35a", soft: "#fff7df", extra: "#7ef0d2" },
      "gold-elegant-birthday": { base: "#4f360a", accent: "#ffcf57", flash: "#fff3b2", soft: "#fff7db", extra: "#ffd98d" },
      "mega-party-finale": { base: "#34134a", accent: "#ff68a7", flash: "#ffdc64", soft: "#fff3e0", extra: "#63ddff" },
    },
    "Thumbs Up": {
      badge: { base: "#12315d", accent: "#65c8ff", flash: "#ffd353", soft: "#f6fbff", extra: "#7cffcf" },
      bounce: { base: "#1a3162", accent: "#68afff", flash: "#ffd45c", soft: "#f7fbff", extra: "#7be8c8" },
      chat: { base: "#23366c", accent: "#64c8ff", flash: "#ffe36e", soft: "#f6f9ff", extra: "#8ef2cf" },
      confetti: { base: "#23315e", accent: "#68bcff", flash: "#ffd255", soft: "#f8fbff", extra: "#ff7f9d" },
      flare: { base: "#1a285b", accent: "#7adaff", flash: "#ffe270", soft: "#f5fbff", extra: "#8f9dff" },
      gold: { base: "#503707", accent: "#ffcd4a", flash: "#fff2b3", soft: "#5ad0ff", extra: "#f7f7ea" },
      jackpot: { base: "#37174d", accent: "#ffcc4d", flash: "#ff6680", soft: "#faf2ff", extra: "#6ce7ff" },
      pop: { base: "#17325e", accent: "#76cfff", flash: "#ffd55d", soft: "#f5fbff", extra: "#7bf0d0" },
      pulse: { base: "#132e56", accent: "#73d6ff", flash: "#ffe37a", soft: "#f7fcff", extra: "#82ffd4" },
      ribbon: { base: "#2a2f6d", accent: "#6fcfff", flash: "#ffd460", soft: "#f7fbff", extra: "#ff8cae" },
      ring: { base: "#2b2c67", accent: "#77d4ff", flash: "#ffe16d", soft: "#f9fbff", extra: "#9bf9cf" },
      seal: { base: "#1c315f", accent: "#76c8ff", flash: "#ffd96f", soft: "#f5fbff", extra: "#90f2cd" },
      sparkle: { base: "#173762", accent: "#7cd8ff", flash: "#ffe47a", soft: "#f6fbff", extra: "#9ef3cf" },
      spotlight: { base: "#1a2a57", accent: "#72d1ff", flash: "#ffe485", soft: "#f9fcff", extra: "#88efff" },
      fast: { base: "#152d57", accent: "#60c2ff", flash: "#ffd455", soft: "#f8fbff", extra: "#7ce1ff" },
    },
    Leprechaun: {
      burst: { base: "#0f5d39", accent: "#7ddf5b", flash: "#ffd858", soft: "#ecffe7", extra: "#8ce9ff" },
      clover: { base: "#0d5933", accent: "#6ddb5e", flash: "#ffd85a", soft: "#efffe8", extra: "#8de9ff" },
      coins: { base: "#215222", accent: "#ffd14e", flash: "#9cee61", soft: "#f7ffe6", extra: "#ffd889" },
      crown: { base: "#124d32", accent: "#7ee268", flash: "#ffd85d", soft: "#eeffe9", extra: "#9de6ff" },
      fountain: { base: "#194a2a", accent: "#ffd553", flash: "#9af06a", soft: "#f8ffe8", extra: "#8edfff" },
      gold: { base: "#215127", accent: "#ffd455", flash: "#a9f26d", soft: "#f7ffe6", extra: "#ffb84d" },
      hat: { base: "#12573d", accent: "#7ce365", flash: "#ffd45f", soft: "#ecffe7", extra: "#7edcff" },
      jackpot: { base: "#2b184b", accent: "#ffd24a", flash: "#85e96d", soft: "#f7f1ff", extra: "#7de6ff" },
      magic: { base: "#174f46", accent: "#73e2d9", flash: "#ffd95f", soft: "#ecfff8", extra: "#9af46d" },
      pot: { base: "#1d4c2b", accent: "#8be05f", flash: "#ffd452", soft: "#efffe7", extra: "#8fd8ff" },
      rain: { base: "#215127", accent: "#ffd455", flash: "#a9f26d", soft: "#f7ffe6", extra: "#ffb84d" },
      rainbow: { base: "#23463f", accent: "#7ddf6a", flash: "#ffd95a", soft: "#f5ffe7", extra: "#ff7ea7" },
      seal: { base: "#12473c", accent: "#77e0cf", flash: "#ffd85a", soft: "#ecfff8", extra: "#8fed67" },
      spin: { base: "#15513a", accent: "#7be46c", flash: "#ffd45b", soft: "#ecffe8", extra: "#7fe0ff" },
      treasure: { base: "#21431f", accent: "#ffd454", flash: "#9def64", soft: "#f8ffe8", extra: "#ffcb78" },
      vault: { base: "#203d44", accent: "#81e06e", flash: "#ffd95b", soft: "#f5ffe8", extra: "#ff91c8" },
    },
    Flowers: {
      bloom: { base: "#5c2450", accent: "#ff8cc8", flash: "#ffd968", soft: "#fff2f7", extra: "#7bd886" },
      bouquet: { base: "#3f2750", accent: "#ff92c5", flash: "#ffd96a", soft: "#fff4fa", extra: "#82dbff" },
      confetti: { base: "#402550", accent: "#ff9fc9", flash: "#ffd96b", soft: "#fff4fb", extra: "#75f0bc" },
      crown: { base: "#4a2855", accent: "#ff98d4", flash: "#ffe071", soft: "#fff5fb", extra: "#8bdfff" },
      fanfare: { base: "#47224f", accent: "#ff8fc4", flash: "#ffd86d", soft: "#fff4fa", extra: "#7ee6a7" },
      halo: { base: "#542657", accent: "#ff9dd6", flash: "#ffe47a", soft: "#fff6fc", extra: "#8cebc7" },
      heart: { base: "#53264d", accent: "#ff7fb0", flash: "#ffd96d", soft: "#fff2f6", extra: "#8ce5b7" },
      mega: { base: "#4a1c50", accent: "#ff8bbd", flash: "#ffe26f", soft: "#fff1fb", extra: "#8bd6ff" },
      orchid: { base: "#4d235d", accent: "#d89aff", flash: "#ffe06f", soft: "#fbf3ff", extra: "#8df0ca" },
      petals: { base: "#50234b", accent: "#ffa8cc", flash: "#ffd969", soft: "#fff4fb", extra: "#87edc2" },
      ribbon: { base: "#472c5a", accent: "#ff97cb", flash: "#ffd86c", soft: "#fff5fb", extra: "#7fdcff" },
      rose: { base: "#5b1f41", accent: "#ff7085", flash: "#ffd66b", soft: "#fff2f5", extra: "#7be6a1" },
      soft: { base: "#684266", accent: "#ffd0e7", flash: "#fff1ad", soft: "#fffafc", extra: "#a4f0ce" },
      sparkle: { base: "#4d2d57", accent: "#ff9ece", flash: "#ffe178", soft: "#fff5fb", extra: "#8bf0b2" },
      spring: { base: "#36513f", accent: "#8be49c", flash: "#ffd964", soft: "#f4fff5", extra: "#ff92d5" },
    },
    Fireworks: {
      "bingo-text": { accent: "#ffd94f", core: "#fff5bb", extra: "#54e7ff", flash: "#ff8f4f", outline: "#fff9d8", soft: "#fffdf4", trail: "#ffd975" },
      "win-text": { accent: "#5ce4ff", core: "#e9fbff", extra: "#ffd552", flash: "#7cffb8", outline: "#f5ffff", soft: "#ffffff", trail: "#8ddcff" },
      "jackpot-text": { accent: "#ffca4e", core: "#fff1c2", extra: "#ff6378", flash: "#ffef8b", outline: "#fff5d8", soft: "#fffef7", trail: "#ffab5d" },
      "star-shape": { accent: "#ffe05d", core: "#fff8bf", extra: "#89d8ff", flash: "#ff9e55", outline: "#fff8d0", soft: "#fffef8", trail: "#ffd868" },
      "heart-shape": { accent: "#ff6fa7", core: "#ffd6ea", extra: "#ffd567", flash: "#ff9a76", outline: "#fff1f6", soft: "#fff9fc", trail: "#ff8b9b" },
      "crown-shape": { accent: "#ffd44c", core: "#fff0af", extra: "#ff8a44", flash: "#fff4b9", outline: "#fff4ca", soft: "#fffef7", trail: "#ffc265" },
      "clover-shape": { accent: "#74ea72", core: "#dffff0", extra: "#ffd95e", flash: "#5df3d3", outline: "#f1fff0", soft: "#fbfffa", trail: "#8bff8d" },
      "smiley-shape": { accent: "#ffe158", core: "#fff7bf", extra: "#7fe5ff", flash: "#ffb55b", outline: "#fff8d7", soft: "#fffef7", trail: "#ffd775" },
      "trophy-shape": { accent: "#ffd454", core: "#fff0ae", extra: "#85d7ff", flash: "#ff9d48", outline: "#fff3d0", soft: "#fffef8", trail: "#ffcf72" },
      "gift-shape": { accent: "#ff667c", core: "#ffe1e7", extra: "#64deff", flash: "#ffd965", outline: "#fff6fb", soft: "#fffdfd", trail: "#ff8f98" },
      "cake-shape": { accent: "#ff8cc1", core: "#ffe4f0", extra: "#ffd35f", flash: "#7be7ff", outline: "#fff6fb", soft: "#fffefe", trail: "#ffb094" },
      "thumbs-shape": { accent: "#67c7ff", core: "#e6f8ff", extra: "#ffe05a", flash: "#80ffcf", outline: "#f5fcff", soft: "#ffffff", trail: "#8ed8ff" },
      "flower-shape": { accent: "#ff8fc6", core: "#fff2a9", extra: "#7fe6a7", flash: "#8edbff", outline: "#fff6fb", soft: "#fffefe", trail: "#ffadcf" },
      "rainbow-arc": { accent: "#ff6e67", core: "#fff7c6", extra: "#6fe5ff", flash: "#8cff7b", outline: "#fff8df", soft: "#fffef8", trail: "#ffbe5d" },
      "number-3": { accent: "#ff8f58", core: "#fff0d2", extra: "#ffe35c", flash: "#84e4ff", outline: "#fff9ec", soft: "#fffefd", trail: "#ffba78" },
      "number-2": { accent: "#6ee2ff", core: "#eefbff", extra: "#ffd75d", flash: "#7dffca", outline: "#f7fdff", soft: "#ffffff", trail: "#8fdcff" },
      "number-1": { accent: "#ffe161", core: "#fff8c0", extra: "#ff8d63", flash: "#8ddfff", outline: "#fff9e0", soft: "#fffef9", trail: "#ffd978" },
      "countdown-finale": { accent: "#ffd44b", core: "#fff5b8", extra: "#66ecff", flash: "#ff6e64", outline: "#fff8d5", soft: "#fffef9", trail: "#ffc768" },
      "gold-frame": { accent: "#ffd24a", core: "#fff0ab", extra: "#ffef95", flash: "#ffb34f", outline: "#fff5d2", soft: "#fffef9", trail: "#ffd06d" },
      "mega-finale": { accent: "#ffd655", core: "#fff3ba", extra: "#64e7ff", flash: "#ff6fa4", outline: "#fff7d8", soft: "#fffefb", trail: "#ffc96d" },
    },
  };

  return palettes[category][mood];
}

function createContext(definition) {
  const spec = WINK_SPECS[definition.kind];
  const loopSeconds = round(definition.durationMs / 1000);

  return {
    centerX: spec.width / 2,
    centerY: definition.kind === "effect" ? spec.height * 0.52 : spec.height * 0.5,
    definition,
    height: spec.height,
    kind: definition.kind,
    loopSeconds,
    spec,
    width: spec.width,
  };
}

function roundedRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  return [
    `M ${x + r} ${y}`,
    `H ${x + width - r}`,
    `A ${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `A ${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + height - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

function arcBandPath(cx, cy, outerRadius, innerRadius) {
  return [
    `M ${cx - outerRadius} ${cy}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${cx + outerRadius} ${cy}`,
    `L ${cx + innerRadius} ${cy}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${cx - innerRadius} ${cy}`,
    "Z",
  ].join(" ");
}

function fireworkThumbPathData(cx, cy, size) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const scale = size / 100;

  return [
    `M ${x + scale * 35} ${y + scale * 88}`,
    `L ${x + scale * 18} ${y + scale * 88}`,
    `Q ${x + scale * 10} ${y + scale * 88}, ${x + scale * 10} ${y + scale * 80}`,
    `L ${x + scale * 10} ${y + scale * 52}`,
    `Q ${x + scale * 10} ${y + scale * 44}, ${x + scale * 18} ${y + scale * 44}`,
    `L ${x + scale * 34} ${y + scale * 44}`,
    `L ${x + scale * 34} ${y + scale * 18}`,
    `Q ${x + scale * 34} ${y + scale * 10}, ${x + scale * 42} ${y + scale * 10}`,
    `Q ${x + scale * 50} ${y + scale * 10}, ${x + scale * 50} ${y + scale * 18}`,
    `L ${x + scale * 50} ${y + scale * 36}`,
    `L ${x + scale * 76} ${y + scale * 36}`,
    `Q ${x + scale * 90} ${y + scale * 36}, ${x + scale * 90} ${y + scale * 50}`,
    `Q ${x + scale * 90} ${y + scale * 62}, ${x + scale * 80} ${y + scale * 64}`,
    `L ${x + scale * 78} ${y + scale * 64}`,
    `Q ${x + scale * 80} ${y + scale * 74}, ${x + scale * 72} ${y + scale * 80}`,
    `Q ${x + scale * 68} ${y + scale * 86}, ${x + scale * 58} ${y + scale * 86}`,
    `L ${x + scale * 35} ${y + scale * 88}`,
    "Z",
  ].join(" ");
}

function fireworkCrownPathData(cx, cy, width, height) {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height / 2;
  const bottom = cy + height / 2;

  return [
    `M ${left} ${bottom}`,
    `L ${left + width * 0.12} ${cy + height * 0.06}`,
    `L ${left + width * 0.28} ${top + height * 0.18}`,
    `L ${cx} ${cy + height * 0.02}`,
    `L ${right - width * 0.28} ${top + height * 0.18}`,
    `L ${right - width * 0.12} ${cy + height * 0.06}`,
    `L ${right} ${bottom}`,
    `L ${left} ${bottom}`,
    "Z",
  ].join(" ");
}

function fireworkTrophyPathData(cx, cy, width, height) {
  const left = cx - width / 2;
  const right = cx + width / 2;
  const top = cy - height / 2;
  const bowlBottom = cy + height * 0.06;
  const stemTop = cy + height * 0.18;
  const stemBottom = cy + height * 0.34;

  return [
    `M ${left + width * 0.16} ${top + height * 0.08}`,
    `Q ${cx} ${top - height * 0.08}, ${right - width * 0.16} ${top + height * 0.08}`,
    `L ${right - width * 0.22} ${bowlBottom}`,
    `Q ${cx} ${cy + height * 0.18}, ${left + width * 0.22} ${bowlBottom}`,
    "Z",
    `M ${cx - width * 0.08} ${stemTop}`,
    `L ${cx + width * 0.08} ${stemTop}`,
    `L ${cx + width * 0.06} ${stemBottom}`,
    `L ${cx - width * 0.06} ${stemBottom}`,
    "Z",
    `M ${cx - width * 0.22} ${stemBottom}`,
    `L ${cx + width * 0.22} ${stemBottom}`,
    `L ${cx + width * 0.26} ${cy + height * 0.46}`,
    `L ${cx - width * 0.26} ${cy + height * 0.46}`,
    "Z",
  ].join(" ");
}

function createFireworkTextShape(ctx, palette, options) {
  const fontSize = options.fontSize;
  const letterSpacing = options.letterSpacing ?? 0;
  const centerX = options.cx ?? ctx.centerX;
  const centerY = options.cy ?? ctx.centerY;
  const y = centerY + (options.yOffset ?? 0);
  const approxWidth = options.width ?? fontSize * Math.max(1.5, options.text.length * 0.62);
  const bbox = {
    height: fontSize * 1.14,
    width: approxWidth + fontSize * 0.18,
    x: centerX - (approxWidth + fontSize * 0.18) / 2,
    y: y - fontSize * 0.66,
  };
  const common = `x="${centerX}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="'Arial Black', 'Trebuchet MS', 'Segoe UI', sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="${letterSpacing}"`;

  return {
    bbox,
    clipMarkup: `<text ${common}>${escapeXml(options.text)}</text>`,
    dashLen: round(approxWidth * 2.9),
    outlineMarkup: `<text ${common} class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="${Math.max(
      8,
      fontSize * 0.06
    )}" opacity="0.98">${escapeXml(options.text)}</text>`,
    particleRadius: options.particleRadius ?? 6.4,
    particleSpacing: options.particleSpacing ?? 54,
    sparkles: options.sparkles ?? [
      [bbox.x + bbox.width * 0.16, bbox.y + bbox.height * 0.18, 18],
      [bbox.x + bbox.width * 0.84, bbox.y + bbox.height * 0.22, 14],
      [bbox.x + bbox.width * 0.5, bbox.y + bbox.height * 0.82, 16],
    ],
  };
}

function createFireworkShape(ctx, palette, spec) {
  const cx = spec.cx ?? ctx.centerX;
  const cy = spec.cy ?? ctx.centerY;

  switch (spec.kind) {
    case "text":
      return createFireworkTextShape(ctx, palette, spec);
    case "star": {
      const outer = spec.outer ?? 250;
      const inner = spec.inner ?? 112;
      const bbox = { height: outer * 2, width: outer * 2, x: cx - outer, y: cy - outer };
      const points = starPath(cx, cy, outer, inner, 5);
      return {
        bbox,
        clipMarkup: `<polygon points="${points}" />`,
        dashLen: round(outer * 8.2),
        outlineMarkup: `<polygon points="${points}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />`,
        particleRadius: 6.2,
        particleSpacing: 40,
        sparkles: [
          [cx, cy - outer - 40, 20],
          [cx - outer * 0.86, cy + 10, 15],
          [cx + outer * 0.86, cy + 10, 15],
        ],
      };
    }
    case "heart": {
      const width = spec.width ?? 560;
      const height = spec.height ?? 470;
      const bbox = { height, width, x: cx - width / 2, y: cy - height * 0.3 };
      const pathData = heartPath(cx, cy, width, height);
      return {
        bbox,
        clipMarkup: `<path d="${pathData}" />`,
        dashLen: round((width + height) * 2.4),
        outlineMarkup: `<path d="${pathData}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />`,
        particleRadius: 6.1,
        particleSpacing: 42,
        sparkles: [
          [cx - width * 0.18, bbox.y + 30, 14],
          [cx + width * 0.18, bbox.y + 30, 14],
          [cx, bbox.y + height + 10, 18],
        ],
      };
    }
    case "crown": {
      const width = spec.width ?? 620;
      const height = spec.height ?? 330;
      const bbox = { height, width, x: cx - width / 2, y: cy - height / 2 };
      const pathData = fireworkCrownPathData(cx, cy, width, height);
      return {
        bbox,
        clipMarkup: `<path d="${pathData}" />`,
        dashLen: round((width + height) * 2.1),
        outlineMarkup: `<path d="${pathData}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="20" opacity="0.98" />`,
        particleRadius: 6.3,
        particleSpacing: 44,
        sparkles: [
          [cx - width * 0.22, bbox.y + 22, 16],
          [cx, bbox.y - 12, 18],
          [cx + width * 0.22, bbox.y + 22, 16],
        ],
      };
    }
    case "clover": {
      const size = spec.size ?? 126;
      const stemPath = `M ${cx + size * 0.08} ${cy + size * 0.82} C ${cx + size * 0.02} ${cy + size * 1.12}, ${
        cx + size * 0.2
      } ${cy + size * 1.32}, ${cx + size * 0.42} ${cy + size * 1.54}`;
      return {
        bbox: {
          height: size * 2.48,
          width: size * 2.4,
          x: cx - size * 1.18,
          y: cy - size * 1.2,
        },
        clipMarkup: `
          <circle cx="${cx - size * 0.54}" cy="${cy - size * 0.54}" r="${size * 0.54}" />
          <circle cx="${cx + size * 0.54}" cy="${cy - size * 0.54}" r="${size * 0.54}" />
          <circle cx="${cx - size * 0.54}" cy="${cy + size * 0.54}" r="${size * 0.54}" />
          <circle cx="${cx + size * 0.54}" cy="${cy + size * 0.54}" r="${size * 0.54}" />
          <path d="${stemPath}" stroke="#fff" stroke-width="${size * 0.28}" stroke-linecap="round" fill="none" />
        `,
        dashLen: round(size * 15),
        outlineMarkup: `
          <circle cx="${cx - size * 0.54}" cy="${cy - size * 0.54}" r="${size * 0.54}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="16" opacity="0.98" />
          <circle cx="${cx + size * 0.54}" cy="${cy - size * 0.54}" r="${size * 0.54}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="16" opacity="0.98" />
          <circle cx="${cx - size * 0.54}" cy="${cy + size * 0.54}" r="${size * 0.54}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="16" opacity="0.98" />
          <circle cx="${cx + size * 0.54}" cy="${cy + size * 0.54}" r="${size * 0.54}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="16" opacity="0.98" />
          <path d="${stemPath}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="14" opacity="0.98" />
        `,
        particleRadius: 6.4,
        particleSpacing: 40,
        sparkles: [
          [cx, cy - size * 1.24, 16],
          [cx - size * 1.02, cy + size * 0.12, 14],
          [cx + size * 0.96, cy + size * 0.12, 14],
        ],
      };
    }
    case "smiley": {
      const radius = spec.radius ?? 250;
      const smilePath = `M ${cx - radius * 0.44} ${cy + radius * 0.08} Q ${cx} ${cy + radius * 0.52}, ${
        cx + radius * 0.44
      } ${cy + radius * 0.08}`;
      return {
        bbox: { height: radius * 2, width: radius * 2, x: cx - radius, y: cy - radius },
        clipMarkup: `<circle cx="${cx}" cy="${cy}" r="${radius * 0.94}" />`,
        dashLen: round(radius * 7.4),
        outlineMarkup: `
          <circle cx="${cx}" cy="${cy}" r="${radius * 0.94}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <circle cx="${cx - radius * 0.28}" cy="${cy - radius * 0.18}" r="${radius * 0.09}" fill="${palette.outline}" opacity="0.96" />
          <circle cx="${cx + radius * 0.28}" cy="${cy - radius * 0.18}" r="${radius * 0.09}" fill="${palette.outline}" opacity="0.96" />
          <path d="${smilePath}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="16" opacity="0.98" />
        `,
        particleRadius: 6.4,
        particleSpacing: 42,
        sparkles: [
          [cx, cy - radius - 28, 18],
          [cx - radius * 0.76, cy - 10, 14],
          [cx + radius * 0.76, cy - 10, 14],
        ],
      };
    }
    case "trophy": {
      const width = spec.width ?? 520;
      const height = spec.height ?? 460;
      const bbox = { height, width, x: cx - width / 2, y: cy - height / 2 };
      const cupPath = fireworkTrophyPathData(cx, cy, width, height);
      return {
        bbox,
        clipMarkup: `
          <path d="${cupPath}" />
          <path d="M ${cx - width * 0.34} ${cy - height * 0.18} C ${cx - width * 0.5} ${cy - height * 0.12}, ${cx - width * 0.5} ${
          cy + height * 0.06
        }, ${cx - width * 0.32} ${cy + height * 0.08}" stroke="#fff" stroke-width="${width * 0.14}" stroke-linecap="round" fill="none" />
          <path d="M ${cx + width * 0.34} ${cy - height * 0.18} C ${cx + width * 0.5} ${cy - height * 0.12}, ${cx + width * 0.5} ${
          cy + height * 0.06
        }, ${cx + width * 0.32} ${cy + height * 0.08}" stroke="#fff" stroke-width="${width * 0.14}" stroke-linecap="round" fill="none" />
        `,
        dashLen: round((width + height) * 2.3),
        outlineMarkup: `
          <path d="${cupPath}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <path d="M ${cx - width * 0.34} ${cy - height * 0.18} C ${cx - width * 0.5} ${cy - height * 0.12}, ${cx - width * 0.5} ${
          cy + height * 0.06
        }, ${cx - width * 0.32} ${cy + height * 0.08}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <path d="M ${cx + width * 0.34} ${cy - height * 0.18} C ${cx + width * 0.5} ${cy - height * 0.12}, ${cx + width * 0.5} ${
          cy + height * 0.06
        }, ${cx + width * 0.32} ${cy + height * 0.08}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
        `,
        particleRadius: 6.2,
        particleSpacing: 38,
        sparkles: [
          [cx, bbox.y - 10, 20],
          [cx - width * 0.42, cy - height * 0.06, 14],
          [cx + width * 0.42, cy - height * 0.06, 14],
        ],
      };
    }
    case "gift": {
      const width = spec.width ?? 540;
      const height = spec.height ?? 430;
      const boxX = cx - width / 2;
      const boxY = cy - height * 0.18;
      return {
        bbox: { height, width, x: boxX, y: cy - height * 0.46 },
        clipMarkup: `
          <rect x="${boxX + width * 0.08}" y="${boxY}" width="${width * 0.84}" height="${height * 0.46}" rx="${width * 0.08}" />
          <rect x="${boxX}" y="${cy - height * 0.46}" width="${width}" height="${height * 0.2}" rx="${width * 0.08}" />
          <rect x="${cx - width * 0.08}" y="${cy - height * 0.46}" width="${width * 0.16}" height="${height * 0.64}" />
          <rect x="${boxX}" y="${cy + height * 0.02}" width="${width}" height="${height * 0.12}" />
        `,
        dashLen: round((width + height) * 2.3),
        outlineMarkup: `
          <rect x="${boxX + width * 0.08}" y="${boxY}" width="${width * 0.84}" height="${height * 0.46}" rx="${width * 0.08}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <rect x="${boxX}" y="${cy - height * 0.46}" width="${width}" height="${height * 0.2}" rx="${width * 0.08}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <path d="M ${cx} ${cy - height * 0.46} C ${cx - width * 0.08} ${cy - height * 0.66}, ${cx - width * 0.24} ${
          cy - height * 0.64
        }, ${cx - width * 0.18} ${cy - height * 0.42} C ${cx - width * 0.08} ${cy - height * 0.34}, ${
          cx + width * 0.02
        } ${cy - height * 0.38}, ${cx} ${cy - height * 0.46} Z" class="fw-outline" fill="none" stroke="${
          palette.outline
        }" stroke-width="16" opacity="0.98" />
          <path d="M ${cx} ${cy - height * 0.46} C ${cx + width * 0.08} ${cy - height * 0.66}, ${cx + width * 0.24} ${
          cy - height * 0.64
        }, ${cx + width * 0.18} ${cy - height * 0.42} C ${cx + width * 0.08} ${cy - height * 0.34}, ${
          cx - width * 0.02
        } ${cy - height * 0.38}, ${cx} ${cy - height * 0.46} Z" class="fw-outline" fill="none" stroke="${
          palette.outline
        }" stroke-width="16" opacity="0.98" />
        `,
        particleRadius: 6.1,
        particleSpacing: 40,
        sparkles: [
          [cx, cy - height * 0.64, 18],
          [boxX + width * 0.12, cy + height * 0.28, 14],
          [boxX + width * 0.88, cy + height * 0.28, 14],
        ],
      };
    }
    case "cake": {
      const width = spec.width ?? 520;
      const height = spec.height ?? 420;
      return {
        bbox: { height, width, x: cx - width / 2, y: cy - height / 2 },
        clipMarkup: `
          <rect x="${cx - width * 0.34}" y="${cy - height * 0.02}" width="${width * 0.68}" height="${height * 0.26}" rx="${width * 0.08}" />
          <rect x="${cx - width * 0.24}" y="${cy - height * 0.28}" width="${width * 0.48}" height="${height * 0.22}" rx="${width * 0.08}" />
          <rect x="${cx - width * 0.03}" y="${cy - height * 0.44}" width="${width * 0.06}" height="${height * 0.18}" rx="${width * 0.02}" />
          <rect x="${cx - width * 0.18}" y="${cy - height * 0.4}" width="${width * 0.04}" height="${height * 0.16}" rx="${width * 0.02}" />
          <rect x="${cx + width * 0.14}" y="${cy - height * 0.4}" width="${width * 0.04}" height="${height * 0.16}" rx="${width * 0.02}" />
        `,
        dashLen: round((width + height) * 2.2),
        outlineMarkup: `
          <rect x="${cx - width * 0.34}" y="${cy - height * 0.02}" width="${width * 0.68}" height="${height * 0.26}" rx="${width * 0.08}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <rect x="${cx - width * 0.24}" y="${cy - height * 0.28}" width="${width * 0.48}" height="${height * 0.22}" rx="${width * 0.08}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <path d="M ${cx - width * 0.34} ${cy + height * 0.04} Q ${cx - width * 0.26} ${cy + height * 0.14}, ${
          cx - width * 0.18
        } ${cy + height * 0.04} T ${cx - width * 0.02} ${cy + height * 0.04} T ${cx + width * 0.14} ${
          cy + height * 0.04
        } T ${cx + width * 0.3} ${cy + height * 0.04}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="14" opacity="0.98" />
          <path d="M ${cx - width * 0.18} ${cy - height * 0.46} Q ${cx - width * 0.14} ${cy - height * 0.56}, ${cx - width * 0.12} ${cy - height * 0.46}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="12" opacity="0.98" />
          <path d="M ${cx} ${cy - height * 0.5} Q ${cx + width * 0.04} ${cy - height * 0.6}, ${cx + width * 0.06} ${cy - height * 0.5}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="12" opacity="0.98" />
          <path d="M ${cx + width * 0.18} ${cy - height * 0.46} Q ${cx + width * 0.22} ${cy - height * 0.56}, ${cx + width * 0.24} ${cy - height * 0.46}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="12" opacity="0.98" />
        `,
        particleRadius: 6.1,
        particleSpacing: 40,
        sparkles: [
          [cx, cy - height * 0.64, 18],
          [cx - width * 0.26, cy + height * 0.24, 14],
          [cx + width * 0.26, cy + height * 0.24, 14],
        ],
      };
    }
    case "thumbs": {
      const size = spec.size ?? 500;
      const pathData = fireworkThumbPathData(cx, cy, size);
      return {
        bbox: { height: size * 0.9, width: size * 0.86, x: cx - size * 0.45, y: cy - size * 0.42 },
        clipMarkup: `<path d="${pathData}" />`,
        dashLen: round(size * 5.1),
        outlineMarkup: `<path d="${pathData}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />`,
        particleRadius: 6.2,
        particleSpacing: 38,
        sparkles: [
          [cx - size * 0.24, cy - size * 0.34, 14],
          [cx + size * 0.24, cy - size * 0.14, 16],
          [cx + size * 0.1, cy + size * 0.42, 14],
        ],
      };
    }
    case "flower": {
      const radius = spec.radius ?? 240;
      const petals = spec.petals ?? 6;
      return {
        bbox: { height: radius * 2.2, width: radius * 2.2, x: cx - radius * 1.1, y: cy - radius * 1.1 },
        clipMarkup: `
          ${Array.from({ length: petals }, (_, index) => {
            const angle = (360 / petals) * index;
            const px = polarX(cx, radius * 0.72, angle);
            const py = polarY(cy, radius * 0.72, angle);
            return `<ellipse cx="${px}" cy="${py}" rx="${radius * 0.34}" ry="${radius * 0.62}" transform="rotate(${angle} ${px} ${py})" />`;
          }).join("")}
          <circle cx="${cx}" cy="${cy}" r="${radius * 0.42}" />
        `,
        dashLen: round(radius * 10.8),
        outlineMarkup: `
          ${Array.from({ length: petals }, (_, index) => {
            const angle = (360 / petals) * index;
            const px = polarX(cx, radius * 0.72, angle);
            const py = polarY(cy, radius * 0.72, angle);
            return `<ellipse cx="${px}" cy="${py}" rx="${radius * 0.34}" ry="${radius * 0.62}" transform="rotate(${angle} ${px} ${py})" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="15" opacity="0.98" />`;
          }).join("")}
          <circle cx="${cx}" cy="${cy}" r="${radius * 0.42}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="14" opacity="0.98" />
        `,
        particleColors: [palette.accent, palette.flash, palette.extra, palette.soft],
        particleRadius: 6.1,
        particleSpacing: 38,
        sparkles: [
          [cx, cy - radius * 1.12, 16],
          [cx - radius * 0.96, cy, 14],
          [cx + radius * 0.96, cy, 14],
        ],
      };
    }
    case "rainbow": {
      const outer = spec.outer ?? 340;
      const inner = spec.inner ?? 220;
      const colors = ["#ff6f62", "#ff9c4c", "#ffd959", "#78eb7c", "#67ddff", "#7d88ff"];
      return {
        bbox: { height: outer * 1.08, width: outer * 2.1, x: cx - outer * 1.05, y: cy - outer * 1.02 },
        clipMarkup: `<path d="${arcBandPath(cx, cy, outer, inner)}" clip-rule="evenodd" fill-rule="evenodd" />`,
        dashLen: round(outer * 6.5),
        outlineMarkup: `
          ${colors
            .map((color, index) => {
              const radius = outer - index * ((outer - inner) / Math.max(colors.length - 1, 1));
              return `<path d="${rainbowArcPath(cx, cy, radius)}" class="fw-outline" fill="none" stroke="${color}" stroke-width="14" opacity="0.98" />`;
            })
            .join("")}
        `,
        particleColors: colors,
        particleRadius: 6,
        particleSpacing: 36,
        sparkles: [
          [cx - outer * 0.96, cy + 8, 14],
          [cx + outer * 0.96, cy + 8, 14],
          [cx, cy - outer - 16, 18],
        ],
      };
    }
    case "frame": {
      const width = spec.width ?? 980;
      const height = spec.height ?? 560;
      const border = spec.border ?? 120;
      const radius = spec.radius ?? 92;
      const outerPath = roundedRectPath(cx - width / 2, cy - height / 2, width, height, radius);
      const innerPath = roundedRectPath(
        cx - width / 2 + border,
        cy - height / 2 + border,
        width - border * 2,
        height - border * 2,
        Math.max(radius - border * 0.28, 24)
      );
      return {
        bbox: { height, width, x: cx - width / 2, y: cy - height / 2 },
        clipMarkup: `<path d="${outerPath} ${innerPath}" clip-rule="evenodd" fill-rule="evenodd" />`,
        dashLen: round((width + height) * 3.2),
        outlineMarkup: `
          <path d="${outerPath}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="18" opacity="0.98" />
          <path d="${innerPath}" class="fw-outline" fill="none" stroke="${palette.outline}" stroke-width="16" opacity="0.98" />
        `,
        particleColors: [palette.accent, palette.flash, palette.core, palette.soft],
        particleRadius: 5.8,
        particleSpacing: 34,
        sparkles: [
          [cx - width * 0.46, cy - height * 0.46, 14],
          [cx + width * 0.46, cy - height * 0.46, 14],
          [cx - width * 0.46, cy + height * 0.46, 14],
          [cx + width * 0.46, cy + height * 0.46, 14],
        ],
      };
    }
    default:
      throw new Error(`Unsupported firework shape "${spec.kind}".`);
  }
}

function renderFireworkParticleField(ctx, palette, definition, stage, shape, stageIndex, centerX, centerY) {
  const clipId = `${definition.id}-${stage.key}-${stageIndex}-clip`;
  const colors = stage.particleColors ?? shape.particleColors ?? [palette.accent, palette.flash, palette.extra, palette.soft];
  const spacing = shape.particleSpacing;
  const xStart = shape.bbox.x + spacing * 0.34;
  const xEnd = shape.bbox.x + shape.bbox.width - spacing * 0.22;
  const yStart = shape.bbox.y + spacing * 0.28;
  const yEnd = shape.bbox.y + shape.bbox.height - spacing * 0.2;
  const particles = [];
  let rowIndex = 0;

  for (let y = yStart; y <= yEnd; y += spacing) {
    let colIndex = 0;
    for (let x = xStart; x <= xEnd; x += spacing) {
      if ((rowIndex + colIndex) % 2 === 1) {
        colIndex += 1;
        continue;
      }

      const targetX = round(x + (rowIndex % 2 === 0 ? 0 : spacing * 0.34));
      const targetY = round(y + ((colIndex % 3) - 1) * spacing * 0.08);
      const color = colors[(rowIndex + colIndex) % colors.length];
      const radius = round(shape.particleRadius * (0.74 + ((rowIndex + colIndex) % 4) * 0.11));

      particles.push(`
        <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${color}" opacity="0.96" style="transform-origin:${centerX}px ${centerY}px; --tx:${round(
        targetX - centerX
      )}px; --ty:${round(targetY - centerY)}px; animation:fw-particle-${stage.key} ${ctx.loopSeconds}s cubic-bezier(0.18,0.88,0.22,1) infinite;" />
      `);

      colIndex += 1;
    }
    rowIndex += 1;
  }

  return `
    <defs>
      <clipPath id="${clipId}" clipPathUnits="userSpaceOnUse">
        ${shape.clipMarkup}
      </clipPath>
    </defs>
    <g clip-path="url(#${clipId})">
      <ellipse cx="${centerX}" cy="${centerY}" rx="${round(shape.bbox.width * 0.44)}" ry="${round(
    shape.bbox.height * 0.4
  )}" fill="${palette.core}" opacity="0.24" style="transform-origin:${centerX}px ${centerY}px; animation:fw-core-${stage.key} ${ctx.loopSeconds}s ease-out infinite;" />
      ${particles.join("")}
    </g>
  `;
}

function renderFireworkLaunches(ctx, palette, stage, centerX, centerY) {
  const launchers = stage.launchers ?? [centerX];
  const startY = stage.launchY ?? percentY(ctx, 0.88);

  return launchers
    .map((startX, index) => {
      const dx = round(centerX - startX);
      const dy = round(centerY - startY);
      const controlY1 = round(startY - Math.abs(dy) * 0.48);
      const controlY2 = round(centerY - Math.abs(dy) * 0.22);
      const controlX2 = round(centerX - dx * 0.18);
      const pathData = `M ${startX} ${startY} C ${startX} ${controlY1}, ${controlX2} ${controlY2}, ${centerX} ${centerY}`;
      const trailLen = round(Math.hypot(dx, dy) * 1.18);
      const color = index % 2 === 0 ? palette.trail : palette.extra;

      return `
        <path d="${pathData}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" opacity="0.92" style="--trail-len:${trailLen}; animation:fw-trail-${stage.key} ${ctx.loopSeconds}s ease-out infinite;" />
        <g style="transform-origin:${startX}px ${startY}px; --dx:${dx}px; --dy:${dy}px; animation:fw-head-${stage.key} ${ctx.loopSeconds}s ease-out infinite;">
          <circle cx="${startX}" cy="${startY}" r="11" fill="${palette.soft}" opacity="0.98" />
          <circle cx="${startX}" cy="${startY}" r="21" fill="${color}" opacity="0.42" />
        </g>
      `;
    })
    .join("");
}

function renderFireworkBurst(ctx, palette, stage, shape, centerX, centerY) {
  const burstRadius = stage.burstRadius ?? Math.max(shape.bbox.width, shape.bbox.height) * 0.68;
  const rayCount = stage.rays ?? 16;
  const innerRadius = stage.innerBurstRadius ?? Math.max(16, burstRadius * 0.12);

  return `
    <g style="transform-origin:${centerX}px ${centerY}px; animation:fw-burst-${stage.key} ${ctx.loopSeconds}s ease-out infinite;">
      ${Array.from({ length: rayCount }, (_, index) => {
        const angle = -90 + (360 / rayCount) * index;
        const outerRadius = burstRadius * (0.78 + (index % 3) * 0.12);
        const x1 = polarX(centerX, innerRadius, angle);
        const y1 = polarY(centerY, innerRadius, angle);
        const x2 = polarX(centerX, outerRadius, angle);
        const y2 = polarY(centerY, outerRadius, angle);
        const color = [palette.accent, palette.flash, palette.extra, palette.soft][index % 4];
        return `
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${index % 2 === 0 ? 6 : 4}" stroke-linecap="round" opacity="0.92" />
          <circle cx="${x2}" cy="${y2}" r="${index % 2 === 0 ? 5.5 : 4.2}" fill="${color}" opacity="0.94" />
        `;
      }).join("")}
    </g>
  `;
}

function renderFireworkSparkles(ctx, palette, stage, shape) {
  return shape.sparkles
    .map(([x, y, radius], index) => {
      const fill = [palette.soft, palette.flash, palette.extra, palette.accent][index % 4];
      return `<g style="transform-origin:${x}px ${y}px; animation:fw-sparkle-${stage.key} ${ctx.loopSeconds}s ease-out infinite;">${sparkle(
        x,
        y,
        radius,
        fill,
        palette.outline
      )}</g>`;
    })
    .join("");
}

function renderFireworkStage(ctx, palette, definition, stage, stageIndex) {
  const centerX = stage.centerX ?? ctx.centerX;
  const centerY = stage.centerY ?? ctx.centerY;
  const shape = createFireworkShape(ctx, palette, {
    ...stage.shape,
    cx: centerX,
    cy: centerY,
  });

  return `
    ${renderFireworkLaunches(ctx, palette, stage, centerX, centerY)}
    <g style="transform-origin:${centerX}px ${centerY}px; animation:fw-pause-${stage.key} ${ctx.loopSeconds}s ease-out infinite;">
      <circle cx="${centerX}" cy="${centerY}" r="${stage.pauseRadius ?? Math.max(28, Math.min(shape.bbox.width, shape.bbox.height) * 0.08)}" fill="${palette.soft}" opacity="0.16" />
      <circle cx="${centerX}" cy="${centerY}" r="${stage.pauseInnerRadius ?? Math.max(10, Math.min(shape.bbox.width, shape.bbox.height) * 0.03)}" fill="${palette.flash}" opacity="0.92" />
    </g>
    <g style="transform-origin:${centerX}px ${centerY}px; animation:fw-core-${stage.key} ${ctx.loopSeconds}s ease-out infinite;">
      <circle cx="${centerX}" cy="${centerY}" r="${stage.coreRadius ?? Math.max(44, Math.min(shape.bbox.width, shape.bbox.height) * 0.16)}" fill="${palette.core}" opacity="0.36" />
      <circle cx="${centerX}" cy="${centerY}" r="${stage.coreInnerRadius ?? Math.max(18, Math.min(shape.bbox.width, shape.bbox.height) * 0.07)}" fill="${palette.soft}" opacity="0.98" />
    </g>
    ${renderFireworkBurst(ctx, palette, stage, shape, centerX, centerY)}
    ${renderFireworkParticleField(ctx, palette, definition, stage, shape, stageIndex, centerX, centerY)}
    <g style="--dash-len:${shape.dashLen}; animation:fw-outline-${stage.key} ${ctx.loopSeconds}s linear infinite;">
      ${shape.outlineMarkup}
    </g>
    ${renderFireworkSparkles(ctx, palette, stage, shape)}
  `;
}

function fireworkStage(key, shape, overrides = {}) {
  return {
    key,
    shape,
    ...overrides,
  };
}

function buildFireworkStages(ctx, definition) {
  const cx = ctx.centerX;
  const cy = ctx.centerY;
  const mood = definition.mood;
  const tallText = 330;
  const wideText = 270;

  switch (mood) {
    case "bingo-text":
      return {
        ambientPoints: [[0.16, 0.22], [0.84, 0.24], [0.26, 0.72], [0.74, 0.7]],
        stages: [
          fireworkStage("single", { kind: "text", text: "BINGO", fontSize: wideText, letterSpacing: 10, particleRadius: 7, particleSpacing: 46, width: 1160, yOffset: -16 }, {
            burstRadius: 340,
            coreRadius: 86,
            launchers: [cx - 260, cx, cx + 260],
            rays: 22,
          }),
        ],
      };
    case "win-text":
      return {
        ambientPoints: [[0.2, 0.24], [0.8, 0.24], [0.24, 0.68], [0.76, 0.68]],
        stages: [
          fireworkStage("single", { kind: "text", text: "WIN", fontSize: 350, letterSpacing: 14, particleRadius: 7.4, particleSpacing: 50, width: 780, yOffset: -24 }, {
            burstRadius: 300,
            coreRadius: 78,
            launchers: [cx - 170, cx + 170],
            rays: 16,
          }),
        ],
      };
    case "jackpot-text":
      return {
        ambientPoints: [[0.14, 0.22], [0.86, 0.22], [0.2, 0.74], [0.8, 0.74]],
        stages: [
          fireworkStage("single", { kind: "text", text: "JACKPOT", fontSize: 234, letterSpacing: 8, particleRadius: 6.8, particleSpacing: 50, width: 1340, yOffset: -8 }, {
            burstRadius: 410,
            coreRadius: 92,
            launchers: [cx - 340, cx - 110, cx + 110, cx + 340],
            rays: 24,
          }),
        ],
      };
    case "star-shape":
      return { ambientPoints: [[0.17, 0.26], [0.83, 0.26], [0.22, 0.7], [0.78, 0.7]], stages: [fireworkStage("single", { kind: "star", outer: 250, inner: 112 }, { burstRadius: 310, launchers: [cx - 160, cx, cx + 160], rays: 18 })] };
    case "heart-shape":
      return { ambientPoints: [[0.2, 0.24], [0.8, 0.25], [0.32, 0.76], [0.68, 0.76]], stages: [fireworkStage("single", { kind: "heart", width: 540, height: 450 }, { centerY: cy - 10, burstRadius: 320, launchers: [cx - 200, cx + 200], rays: 16 })] };
    case "crown-shape":
      return { ambientPoints: [[0.2, 0.2], [0.8, 0.2], [0.26, 0.72], [0.74, 0.72]], stages: [fireworkStage("single", { kind: "crown", width: 620, height: 320 }, { centerY: cy - 18, burstRadius: 340, launchers: [cx - 220, cx, cx + 220], rays: 20 })] };
    case "clover-shape":
      return { ambientPoints: [[0.18, 0.24], [0.82, 0.24], [0.28, 0.74], [0.72, 0.74]], stages: [fireworkStage("single", { kind: "clover", size: 136 }, { burstRadius: 320, launchers: [cx - 150, cx + 150], rays: 18 })] };
    case "smiley-shape":
      return { ambientPoints: [[0.16, 0.24], [0.84, 0.24], [0.26, 0.74], [0.74, 0.74]], stages: [fireworkStage("single", { kind: "smiley", radius: 248 }, { burstRadius: 330, launchers: [cx - 210, cx, cx + 210], rays: 18 })] };
    case "trophy-shape":
      return { ambientPoints: [[0.18, 0.22], [0.82, 0.22], [0.24, 0.72], [0.76, 0.72]], stages: [fireworkStage("single", { kind: "trophy", width: 540, height: 470 }, { centerY: cy + 10, burstRadius: 340, launchers: [cx - 210, cx + 210], rays: 20 })] };
    case "gift-shape":
      return { ambientPoints: [[0.2, 0.22], [0.8, 0.22], [0.24, 0.72], [0.76, 0.72]], stages: [fireworkStage("single", { kind: "gift", width: 560, height: 440 }, { centerY: cy + 18, burstRadius: 310, launchers: [cx - 170, cx, cx + 170], rays: 18 })] };
    case "cake-shape":
      return { ambientPoints: [[0.18, 0.22], [0.82, 0.22], [0.28, 0.74], [0.72, 0.74]], stages: [fireworkStage("single", { kind: "cake", width: 540, height: 430 }, { centerY: cy + 24, burstRadius: 320, launchers: [cx - 150, cx, cx + 150], rays: 18 })] };
    case "thumbs-shape":
      return { ambientPoints: [[0.18, 0.24], [0.82, 0.24], [0.28, 0.72], [0.72, 0.72]], stages: [fireworkStage("single", { kind: "thumbs", size: 500 }, { centerY: cy + 4, burstRadius: 310, launchers: [cx - 150, cx + 150], rays: 16 })] };
    case "flower-shape":
      return { ambientPoints: [[0.16, 0.22], [0.84, 0.22], [0.24, 0.74], [0.76, 0.74]], stages: [fireworkStage("single", { kind: "flower", radius: 238 }, { burstRadius: 320, launchers: [cx - 180, cx, cx + 180], rays: 18 })] };
    case "rainbow-arc":
      return {
        ambientPoints: [[0.18, 0.18], [0.82, 0.18], [0.22, 0.66], [0.78, 0.66]],
        stages: [fireworkStage("single", { kind: "rainbow", outer: 338, inner: 220 }, {
          centerY: cy + 120,
          burstRadius: 350,
          coreRadius: 74,
          launchers: [cx - 260, cx, cx + 260],
          particleColors: ["#ff6f62", "#ff9c4c", "#ffd959", "#78eb7c", "#67ddff", "#7d88ff"],
          rays: 18,
        })],
      };
    case "number-3":
      return { ambientPoints: [[0.18, 0.22], [0.82, 0.22], [0.24, 0.72], [0.76, 0.72]], stages: [fireworkStage("single", { kind: "text", text: "3", fontSize: tallText, particleRadius: 7.2, particleSpacing: 42, width: 260, yOffset: -18 }, { burstRadius: 250, coreRadius: 70, launchers: [cx - 70, cx + 70], rays: 14 })] };
    case "number-2":
      return { ambientPoints: [[0.18, 0.22], [0.82, 0.22], [0.24, 0.72], [0.76, 0.72]], stages: [fireworkStage("single", { kind: "text", text: "2", fontSize: tallText, particleRadius: 7.2, particleSpacing: 42, width: 260, yOffset: -18 }, { burstRadius: 250, coreRadius: 70, launchers: [cx - 70, cx + 70], rays: 14 })] };
    case "number-1":
      return { ambientPoints: [[0.18, 0.22], [0.82, 0.22], [0.24, 0.72], [0.76, 0.72]], stages: [fireworkStage("single", { kind: "text", text: "1", fontSize: tallText, particleRadius: 7.2, particleSpacing: 40, width: 220, yOffset: -18 }, { burstRadius: 240, coreRadius: 66, launchers: [cx], rays: 12 })] };
    case "countdown-finale":
      return {
        ambientPoints: [[0.14, 0.2], [0.86, 0.2], [0.22, 0.78], [0.78, 0.78]],
        stages: [
          fireworkStage("a", { kind: "text", text: "3", fontSize: 290, particleRadius: 6.8, particleSpacing: 42, width: 250, cx: cx - 300, cy: cy - 14 }, { centerX: cx - 300, centerY: cy - 14, burstRadius: 220, coreRadius: 58, launchers: [cx - 360], rays: 12 }),
          fireworkStage("b", { kind: "text", text: "2", fontSize: 290, particleRadius: 6.8, particleSpacing: 42, width: 250, cx, cy: cy - 28 }, { centerY: cy - 28, burstRadius: 220, coreRadius: 58, launchers: [cx], rays: 12 }),
          fireworkStage("c", { kind: "text", text: "1", fontSize: 290, particleRadius: 6.8, particleSpacing: 40, width: 220, cx: cx + 300, cy: cy - 14 }, { centerX: cx + 300, centerY: cy - 14, burstRadius: 220, coreRadius: 58, launchers: [cx + 360], rays: 12 }),
          fireworkStage("d", { kind: "text", text: "BINGO", fontSize: 248, letterSpacing: 10, particleRadius: 7.2, particleSpacing: 46, width: 1080, cy: cy + 12 }, { centerY: cy + 12, burstRadius: 360, coreRadius: 86, launchers: [cx - 240, cx, cx + 240], rays: 22 }),
        ],
      };
    case "gold-frame":
      return {
        ambientPoints: [[0.14, 0.18], [0.86, 0.18], [0.18, 0.82], [0.82, 0.82]],
        stages: [fireworkStage("single", { kind: "frame", width: 1040, height: 600, border: 126, radius: 98 }, { burstRadius: 390, coreRadius: 82, launchers: [cx - 280, cx, cx + 280], rays: 24 })],
      };
    case "mega-finale":
      return {
        ambientPoints: [[0.12, 0.18], [0.88, 0.18], [0.16, 0.82], [0.84, 0.82]],
        stages: [
          fireworkStage("a", { kind: "star", outer: 170, inner: 76, cx: cx - 310, cy: cy - 34 }, { centerX: cx - 310, centerY: cy - 34, burstRadius: 210, coreRadius: 54, launchers: [cx - 380], rays: 12, particleColors: ["#ffd95f", "#89d8ff", "#fffef8"] }),
          fireworkStage("b", { kind: "heart", width: 360, height: 300, cx: cx + 300, cy: cy - 20 }, { centerX: cx + 300, centerY: cy - 20, burstRadius: 220, coreRadius: 54, launchers: [cx + 380], rays: 12, particleColors: ["#ff6fa7", "#ffd567", "#fff9fc"] }),
          fireworkStage("c", { kind: "clover", size: 92, cx, cy: cy + 34 }, { centerY: cy + 34, burstRadius: 220, coreRadius: 54, launchers: [cx], rays: 12, particleColors: ["#74ea72", "#ffd95e", "#fbfffa"] }),
          fireworkStage("d", { kind: "text", text: "BINGO", fontSize: 250, letterSpacing: 10, particleRadius: 7.2, particleSpacing: 46, width: 1100, cy: cy + 6 }, { centerY: cy + 6, burstRadius: 380, coreRadius: 86, launchers: [cx - 280, cx, cx + 280], rays: 24 }),
        ],
      };
    default:
      throw new Error(`Unsupported firework mood "${definition.mood}".`);
  }
}

function renderFireworksScene(ctx, definition) {
  const palette = scenePalette(definition.category, definition.mood);
  const setup = buildFireworkStages(ctx, definition);
  const ambient = twinkleGroup(ctx, {
    colors: [palette.soft, palette.accent, palette.extra, palette.flash],
    points: setup.ambientPoints,
    radius: unit(ctx, 0.014),
  });

  return `
    <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-pulse ${ctx.loopSeconds}s ease-in-out infinite;">
      <ellipse cx="${ctx.centerX}" cy="${ctx.centerY}" rx="${unit(ctx, 0.28)}" ry="${unit(ctx, 0.16)}" fill="${palette.core}" opacity="0.08" />
    </g>
    ${ambient}
    ${setup.stages.map((stage, index) => renderFireworkStage(ctx, palette, definition, stage, index)).join("")}
  `;
}

function renderCountdownScene(ctx, definition) {
  const countdownModes = {
    "bingo-letter-pop": { type: "bingo", theme: "pop" },
    "bingo-ball-letters": { type: "bingo", theme: "balls" },
    "bingo-confetti-reveal": { type: "bingo", theme: "confetti" },
    "bingo-gold-flash": { type: "bingo", theme: "gold" },
    "bingo-bounce-letters": { bounceLetters: true, type: "bingo", theme: "neon" },
    "bingo-firework-reveal": { type: "bingo", theme: "firework" },
    "bingo-mega-reveal": { mega: true, type: "bingo", theme: "jackpot" },
    "simple-pop": { type: "simple", theme: "pop" },
    "simple-confetti": { type: "simple", theme: "confetti" },
    "simple-firework": { type: "simple", theme: "firework" },
    "simple-gold-burst": { type: "simple", theme: "gold" },
    "simple-party": { type: "simple", theme: "party" },
    pop: { type: "bingo", theme: "pop" },
    balls: { type: "bingo", theme: "balls" },
    confetti: { type: "simple", theme: "confetti" },
    firework: { type: "simple", theme: "firework" },
    neon: { bounceLetters: true, type: "bingo", theme: "neon" },
    gold: { type: "simple", theme: "gold" },
    jackpot: { mega: true, type: "bingo", theme: "jackpot" },
    drop: { type: "bingo", theme: "drop" },
    stars: { type: "simple", theme: "stars" },
    party: { type: "simple", theme: "party" },
  };
  const mode = countdownModes[definition.mood] ?? countdownModes["simple-party"];
  const theme = mode.theme;
  const palette = scenePalette(definition.category, theme);
  const isBingoReveal = mode.type === "bingo";
  const isFeaturedLetterPop = definition.id === "countdown-bingo-letter-pop-effect-wink";
  const prefix = `cd${definition.id.replace(/[^a-z0-9]/gi, "")}`;
  const centerY = round(
    ctx.centerY - unit(ctx, isFeaturedLetterPop ? 0.088 : ctx.kind === "effect" ? 0.018 : 0.012)
  );
  const digitSize = unit(ctx, isFeaturedLetterPop ? 0.232 : ctx.kind === "effect" ? 0.188 : 0.184);
  const letterSize = unit(ctx, isFeaturedLetterPop ? 0.184 : ctx.kind === "effect" ? 0.148 : 0.128);
  const sparkleRadius = unit(ctx, isFeaturedLetterPop ? 0.028 : ctx.kind === "effect" ? 0.022 : 0.026);
  const letterStep = round(letterSize * (isFeaturedLetterPop ? 1.34 : ctx.kind === "effect" ? 1.18 : 1.1));
  const letterY = round(centerY + digitSize * (isFeaturedLetterPop ? 0.92 : 0.1));
  const finalWordY = round(letterY + letterSize * (isFeaturedLetterPop ? 1.34 : 0.88));
  const letterColors = OFFICIAL_BINGO_LETTER_COLORS;
  const digitWindows = isFeaturedLetterPop
    ? [
        { label: "3", start: 0, end: 18 },
        { label: "2", start: 20, end: 38 },
        { label: "1", start: 40, end: 58 },
      ]
    : isBingoReveal
    ? [
        { label: "3", start: 6, end: 16 },
        { label: "2", start: 18, end: 28 },
        { label: "1", start: 30, end: 40 },
      ]
    : [
        { label: "3", start: 8, end: 24 },
        { label: "2", start: 28, end: 44 },
        { label: "1", start: 48, end: 64 },
      ];
  const letterWindows = ["B", "I", "N", "G", "O"].map((label, index) => ({
    label,
    start: isFeaturedLetterPop ? 56 + index * 5 : 44 + index * 8,
    x: round(ctx.centerX + (index - 2) * letterStep),
  }));
  const styles = [];

  const buildStageKeyframes = (
    name,
    {
      start,
      peak = start + 4,
      hold = peak + 8,
      end = hold + 4,
      fromX = 0,
      fromY = digitSize * 0.36,
      startScale = 0.28,
      peakScale = 1.08,
      outScale = 1.12,
      rotate = 0,
      persist = false,
    }
  ) => {
    const hidden = Math.max(start - 4, 0);
    const fadeEnd = persist ? 100 : Math.min(end + 4, 100);
    const holdEnd = persist ? 96 : end;
    const overshootY = fromY < 0 ? 8 : -8;

    return `
      @keyframes ${name} {
        0%, ${hidden}%,
        100% {
          opacity: 0;
          transform: translate(${round(fromX)}px, ${round(fromY)}px) scale(${startScale}) rotate(${rotate}deg);
        }
        ${start}% {
          opacity: 1;
          transform: translate(${round(fromX * 0.35)}px, ${round(fromY * 0.35)}px) scale(0.72) rotate(${round(
      rotate * 0.35
    )}deg);
        }
        ${peak}% {
          opacity: 1;
          transform: translate(0px, ${overshootY}px) scale(${peakScale}) rotate(0deg);
        }
        ${hold}%,
        ${holdEnd}% {
          opacity: 1;
          transform: translate(0px, 0px) scale(1) rotate(0deg);
        }
        ${fadeEnd}% {
          opacity: 0;
          transform: translate(0px, -12px) scale(${outScale}) rotate(0deg);
        }
      }
    `;
  };

  const buildGroupKeyframes = (name, start, hold, end) => `
    @keyframes ${name} {
      0%, ${Math.max(start - 4, 0)}%,
      100% {
        opacity: 0;
        transform: scale(0.22);
      }
      ${start}% {
        opacity: 1;
        transform: scale(0.36);
      }
      ${hold}% {
        opacity: 1;
        transform: scale(1);
      }
      ${end}% {
        opacity: 0;
        transform: scale(1.18);
      }
    }
  `;

  const renderToken = (label, x, y, size, animationName, index, role = "digit") => {
    const fill = role === "letter" ? letterColors[index % letterColors.length] : palette.accent;
    const softFill = role === "letter" ? palette.soft : fill;
    const animation = `transform-origin:${x}px ${y}px; animation:${animationName} ${ctx.loopSeconds}s linear infinite;`;

    switch (theme) {
      case "balls":
      case "drop":
        return `<g style="${animation}">${bingoBall(
          x,
          y,
          size * 0.52,
          fill,
          palette.base,
          label,
          palette.base
        )}</g>`;
      case "neon":
        return `
          <g style="${animation}">
            ${glowCircle(x, y, size * 0.76, fill, 0.14)}
            <rect x="${x - size * 0.66}" y="${y - size * 0.48}" width="${size * 1.32}" height="${size * 0.96}" rx="${size * 0.2}" fill="rgba(7,21,41,0.34)" stroke="${fill}" stroke-width="${Math.max(
          4,
          size * 0.06
        )}" />
            <rect x="${x - size * 0.56}" y="${y - size * 0.38}" width="${size * 1.12}" height="${size * 0.76}" rx="${size * 0.16}" fill="none" stroke="${palette.flash}" stroke-width="${Math.max(
          2,
          size * 0.03
        )}" opacity="0.85" />
            ${outlineText(label, x, y, size * 0.6, softFill, palette.base)}
          </g>
        `;
      case "jackpot":
        return `
          <g style="${animation}">
            <rect x="${x - size * 0.64}" y="${y - size * 0.5}" width="${size * 1.28}" height="${size * 1.0}" rx="${size * 0.18}" fill="${palette.base}" stroke="${fill}" stroke-width="${Math.max(
          4,
          size * 0.055
        )}" />
            <rect x="${x - size * 0.5}" y="${y - size * 0.34}" width="${size * 1.0}" height="${size * 0.68}" rx="${size * 0.12}" fill="rgba(255,255,255,0.08)" />
            ${Array.from({ length: 6 }, (_, lightIndex) => {
              const lx = round(x + (lightIndex - 2.5) * size * 0.21);
              return `<circle cx="${lx}" cy="${round(y - size * 0.58)}" r="${size * 0.05}" fill="${
                lightIndex % 2 === 0 ? palette.flash : palette.extra
              }" />`;
            }).join("")}
            ${outlineText(label, x, y, size * 0.58, palette.soft, palette.base)}
          </g>
        `;
      case "firework":
        return `
          <g style="${animation}">
            ${glowCircle(x, y, size * 0.72, palette.flash, 0.12)}
            <circle cx="${x}" cy="${y}" r="${size * 0.5}" fill="${palette.base}" stroke="${fill}" stroke-width="${Math.max(
          4,
          size * 0.06
        )}" />
            ${Array.from({ length: 8 }, (_, rayIndex) => {
              const angle = -90 + rayIndex * 45;
              const x1 = polarX(x, size * 0.62, angle);
              const y1 = polarY(y, size * 0.62, angle);
              const x2 = polarX(x, size * 0.84, angle);
              const y2 = polarY(y, size * 0.84, angle);
              return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${
                rayIndex % 2 === 0 ? palette.flash : palette.extra
              }" stroke-width="${Math.max(2, size * 0.025)}" stroke-linecap="round" opacity="0.82" />`;
            }).join("")}
            ${outlineText(label, x, y, size * 0.56, palette.soft, palette.base)}
          </g>
        `;
      case "gold":
        return `
          <g style="${animation}">
            ${glowCircle(x, y, size * 0.74, palette.flash, 0.14)}
            <circle cx="${x}" cy="${y}" r="${size * 0.52}" fill="${fill}" stroke="${palette.base}" stroke-width="${Math.max(
          4,
          size * 0.06
        )}" />
            <circle cx="${x}" cy="${y}" r="${size * 0.38}" fill="none" stroke="${palette.soft}" stroke-width="${Math.max(
          2,
          size * 0.028
        )}" opacity="0.82" />
            ${outlineText(label, x, y, size * 0.58, palette.soft, palette.base)}
          </g>
        `;
      case "stars":
        return `
          <g style="${animation}">
            <polygon points="${starPath(x, y, size * 0.72, size * 0.34, 5)}" fill="${fill}" stroke="${palette.base}" stroke-width="${Math.max(
          3,
          size * 0.04
        )}" />
            <circle cx="${x}" cy="${y}" r="${size * 0.34}" fill="${palette.base}" opacity="0.9" />
            ${outlineText(label, x, y, size * 0.5, palette.soft, palette.base)}
          </g>
        `;
      case "party":
        return `
          <g style="${animation}">
            <rect x="${x - size * 0.68}" y="${y - size * 0.44}" width="${size * 1.36}" height="${size * 0.88}" rx="${size * 0.28}" fill="${fill}" stroke="${palette.base}" stroke-width="${Math.max(
          4,
          size * 0.05
        )}" />
            <circle cx="${round(x - size * 0.38)}" cy="${round(y - size * 0.1)}" r="${size * 0.12}" fill="${palette.flash}" opacity="0.84" />
            <circle cx="${round(x + size * 0.3)}" cy="${round(y + size * 0.1)}" r="${size * 0.1}" fill="${palette.extra}" opacity="0.84" />
            ${outlineText(label, x, y, size * 0.55, palette.soft, palette.base)}
          </g>
        `;
      case "confetti":
        return `
          <g style="${animation}">
            <rect x="${x - size * 0.64}" y="${y - size * 0.46}" width="${size * 1.28}" height="${size * 0.92}" rx="${size * 0.16}" fill="${palette.base}" stroke="${fill}" stroke-width="${Math.max(
          4,
          size * 0.05
        )}" />
            <rect x="${x - size * 0.1}" y="${y - size * 0.46}" width="${size * 0.2}" height="${size * 0.92}" fill="${palette.flash}" opacity="0.8" />
            ${outlineText(label, x, y, size * 0.56, palette.soft, palette.base)}
          </g>
        `;
      case "pop":
      default:
        return `
          <g style="${animation}">
            ${glowCircle(x, y, size * 0.72, fill, 0.14)}
            <circle cx="${x}" cy="${y}" r="${size * 0.54}" fill="${fill}" stroke="${palette.base}" stroke-width="${Math.max(
          4,
          size * 0.055
        )}" />
            <circle cx="${round(x - size * 0.18)}" cy="${round(y - size * 0.22)}" r="${size * 0.14}" fill="#fff" opacity="0.22" />
            ${outlineText(label, x, y, size * 0.58, palette.soft, palette.base)}
          </g>
        `;
    }
  };

  const renderBingoBand = (animationName) => {
    const width = round(letterStep * 5.5);
    const height = round(letterSize * 1.24);
    const x = round(ctx.centerX - width / 2);
    const y = round(letterY - height / 2);
    const animation = `transform-origin:${ctx.centerX}px ${letterY}px; animation:${animationName} ${ctx.loopSeconds}s linear infinite;`;

    switch (theme) {
      case "neon":
        return `
          <g style="${animation}">
            <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${round(height * 0.24)}" fill="rgba(7,21,41,0.2)" stroke="${palette.accent}" stroke-width="${Math.max(
          4,
          height * 0.08
        )}" opacity="0.8" />
            <line x1="${x + width * 0.08}" y1="${y + height * 0.88}" x2="${x + width * 0.92}" y2="${y + height * 0.88}" stroke="${palette.flash}" stroke-width="${Math.max(
          3,
          height * 0.05
        )}" stroke-linecap="round" opacity="0.9" />
          </g>
        `;
      case "jackpot":
        return `
          <g style="${animation}">
            <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${round(height * 0.24)}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(
          4,
          height * 0.08
        )}" opacity="0.72" />
            ${Array.from({ length: 10 }, (_, lightIndex) => {
              const lx = round(x + width * 0.08 + lightIndex * (width * 0.84) / 9);
              return `<circle cx="${lx}" cy="${round(y + height * 0.12)}" r="${height * 0.06}" fill="${
                lightIndex % 2 === 0 ? palette.flash : palette.extra
              }" />`;
            }).join("")}
          </g>
        `;
      case "balls":
      case "drop":
        return `
          <g style="${animation}">
            <ellipse cx="${ctx.centerX}" cy="${round(letterY + height * 0.34)}" rx="${round(width * 0.48)}" ry="${round(
          height * 0.18
        )}" fill="#000" opacity="0.12" />
          </g>
        `;
      default:
        return `
          <g style="${animation}">
            <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${round(height * 0.24)}" fill="${palette.base}" opacity="0.18" />
          </g>
        `;
    }
  };

  const renderCelebration = (animationName, scale = 1) => {
    const animation = `transform-origin:${ctx.centerX}px ${centerY}px; animation:${animationName} ${ctx.loopSeconds}s linear infinite;`;
    const ringRadius = round(digitSize * 1.06 * scale);
    const confetti = Array.from({ length: 14 }, (_, index) => {
      const angle = -100 + index * 18;
      const radius = digitSize * scale * (0.62 + (index % 3) * 0.16);
      const x = polarX(ctx.centerX, radius, angle);
      const y = polarY(centerY, radius, angle);
      const width = round(digitSize * 0.1 * scale);
      const height = round(digitSize * 0.2 * scale);
      const color = [palette.accent, palette.flash, palette.extra, palette.soft][index % 4];
      return `<rect x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}" rx="${Math.max(
        2,
        width * 0.18
      )}" fill="${color}" transform="rotate(${index * 26} ${x} ${y})" opacity="0.92" />`;
    }).join("");

    const sparkles = Array.from({ length: 6 }, (_, index) => {
      const angle = -90 + index * 60;
      const x = polarX(ctx.centerX, ringRadius * 0.92, angle);
      const y = polarY(centerY, ringRadius * 0.92, angle);
      return `<g style="transform-origin:${x}px ${y}px; animation:wink-twinkle 1.2s ease-in-out infinite; animation-delay:${round(
        index * 0.08
      )}s;">${sparkle(x, y, sparkleRadius * (index % 2 === 0 ? 1 : 0.82), palette.soft, palette.accent)}</g>`;
    }).join("");

    switch (theme) {
      case "confetti":
        return `
          <g style="${animation}">
            <circle cx="${ctx.centerX}" cy="${centerY}" r="${round(ringRadius * 0.6)}" fill="${palette.flash}" opacity="0.18" />
            ${confetti}
            ${sparkles}
          </g>
        `;
      case "firework":
        return `
          <g style="${animation}">
            <circle cx="${ctx.centerX}" cy="${centerY}" r="${ringRadius}" fill="none" stroke="${palette.flash}" stroke-width="${Math.max(
          4,
          digitSize * 0.03
        )}" opacity="0.9" />
            ${Array.from({ length: 14 }, (_, index) => {
              const angle = -90 + index * (360 / 14);
              const x1 = polarX(ctx.centerX, ringRadius * 0.24, angle);
              const y1 = polarY(centerY, ringRadius * 0.24, angle);
              const x2 = polarX(ctx.centerX, ringRadius * 1.02, angle);
              const y2 = polarY(centerY, ringRadius * 1.02, angle);
              return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${
                index % 2 === 0 ? palette.accent : palette.extra
              }" stroke-width="${Math.max(2, digitSize * 0.022)}" stroke-linecap="round" opacity="0.92" />`;
            }).join("")}
            ${sparkles}
          </g>
        `;
      case "gold":
        return `
          <g style="${animation}">
            <circle cx="${ctx.centerX}" cy="${centerY}" r="${ringRadius}" fill="none" stroke="${palette.accent}" stroke-width="${Math.max(
          4,
          digitSize * 0.034
        )}" opacity="0.94" />
            <circle cx="${ctx.centerX}" cy="${centerY}" r="${round(ringRadius * 0.74)}" fill="none" stroke="${palette.flash}" stroke-width="${Math.max(
          3,
          digitSize * 0.024
        )}" opacity="0.84" />
            ${sparkles}
          </g>
        `;
      case "stars":
        return `
          <g style="${animation}">
            ${Array.from({ length: 8 }, (_, index) => {
              const angle = -90 + index * 45;
              const x = polarX(ctx.centerX, ringRadius * 0.78, angle);
              const y = polarY(centerY, ringRadius * 0.78, angle);
              const size = sparkleRadius * (index % 2 === 0 ? 1.4 : 1);
              return `<polygon points="${starPath(x, y, size, size * 0.44, 5)}" fill="${
                index % 2 === 0 ? palette.accent : palette.flash
              }" stroke="${palette.base}" stroke-width="${Math.max(1.5, size * 0.08)}" opacity="0.94" />`;
            }).join("")}
            ${sparkles}
          </g>
        `;
      case "party":
      default:
        return `
          <g style="${animation}">
            <circle cx="${ctx.centerX}" cy="${centerY}" r="${round(ringRadius * 0.64)}" fill="${palette.flash}" opacity="0.12" />
            ${confetti}
            ${sparkles}
          </g>
        `;
    }
  };

  const renderFinalBingoWord = (animationName) => {
    const width = round(letterStep * 6.1);
    const height = round(letterSize * 1.32);
    const textSize = round(letterSize * 0.78);
    const animation = `transform-origin:${ctx.centerX}px ${finalWordY}px; animation:${animationName} ${ctx.loopSeconds}s linear infinite;`;

    switch (theme) {
      case "balls":
      case "drop":
        return `
          <g style="${animation}">
            ${pillLabel(ctx.centerX, finalWordY, width, height, palette.soft, palette.base, "BINGO", palette.base)}
          </g>
        `;
      case "neon":
        return `
          <g style="${animation}">
            <rect x="${ctx.centerX - width / 2}" y="${finalWordY - height / 2}" width="${width}" height="${height}" rx="${round(
          height * 0.24
        )}" fill="rgba(7,21,41,0.3)" stroke="${palette.accent}" stroke-width="${Math.max(4, height * 0.08)}" />
            <rect x="${ctx.centerX - width * 0.44}" y="${finalWordY - height * 0.18}" width="${width * 0.88}" height="${height * 0.36}" rx="${round(
          height * 0.12
        )}" fill="${palette.base}" opacity="0.18" />
            ${outlineText("BINGO", ctx.centerX, finalWordY, textSize, palette.soft, palette.accent)}
          </g>
        `;
      case "jackpot":
        return `
          <g style="${animation}">
            <rect x="${ctx.centerX - width / 2}" y="${finalWordY - height / 2}" width="${width}" height="${height}" rx="${round(
          height * 0.24
        )}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(4, height * 0.08)}" />
            ${Array.from({ length: 12 }, (_, index) => {
              const lx = round(ctx.centerX - width * 0.42 + (index * width * 0.84) / 11);
              return `<circle cx="${lx}" cy="${round(finalWordY - height * 0.32)}" r="${height * 0.05}" fill="${
                index % 2 === 0 ? palette.flash : palette.extra
              }" />`;
            }).join("")}
            ${outlineText("BINGO", ctx.centerX, finalWordY + height * 0.02, textSize, palette.soft, palette.base)}
          </g>
        `;
      case "firework":
        return `
          <g style="${animation}">
            ${glowCircle(ctx.centerX, finalWordY, width * 0.28, palette.flash, 0.14)}
            ${pillLabel(ctx.centerX, finalWordY, width, height, palette.base, palette.accent, "BINGO", palette.soft)}
          </g>
        `;
      case "gold":
        return `
          <g style="${animation}">
            ${pillLabel(ctx.centerX, finalWordY, width, height, palette.accent, palette.base, "BINGO", palette.base)}
            <rect x="${ctx.centerX - width * 0.36}" y="${finalWordY - height * 0.06}" width="${width * 0.72}" height="${height * 0.12}" rx="${round(
          height * 0.05
        )}" fill="${palette.soft}" opacity="0.24" />
          </g>
        `;
      case "confetti":
      case "party":
      case "pop":
      default:
        return `
          <g style="${animation}">
            ${pillLabel(ctx.centerX, finalWordY, width, height, palette.accent, palette.base, "BINGO", palette.base)}
          </g>
        `;
    }
  };

  digitWindows.forEach((step, index) => {
    const fromY =
      theme === "drop"
        ? -digitSize * 0.9
        : theme === "balls"
          ? digitSize * 0.42
          : theme === "jackpot"
            ? digitSize * 0.22
            : digitSize * 0.34;
    const fromX = theme === "jackpot" ? (index - 1) * digitSize * 0.1 : 0;
    styles.push(
      buildStageKeyframes(`${prefix}digit${index}`, {
        end: step.end,
        fromX,
        fromY: isFeaturedLetterPop ? fromY * 0.82 : fromY,
        hold: step.end - 4,
        peak: step.start + (isFeaturedLetterPop ? 5 : 4),
        peakScale: isFeaturedLetterPop ? 1.22 : mode.bounceLetters ? 1.12 : mode.mega ? 1.14 : 1.08,
        rotate: isFeaturedLetterPop ? -6 : theme === "pop" ? -8 : theme === "party" ? -6 : 0,
        startScale: isFeaturedLetterPop ? 0.7 : 0.28,
        start: step.start,
      })
    );
  });

  if (isBingoReveal) {
    styles.push(
      buildStageKeyframes(`${prefix}band`, {
        end: 94,
        fromY: isFeaturedLetterPop ? digitSize * 0.08 : digitSize * 0.16,
        hold: isFeaturedLetterPop ? 92 : 90,
        peak: isFeaturedLetterPop ? 62 : 54,
        start: isFeaturedLetterPop ? 58 : 46,
        startScale: isFeaturedLetterPop ? 0.56 : 0.22,
      })
    );
    letterWindows.forEach((letter, index) => {
      styles.push(
        buildStageKeyframes(`${prefix}letter${index}`, {
          end: 92,
          fromX: theme === "jackpot" ? (index - 2) * 18 : 0,
          fromY: isFeaturedLetterPop
            ? -digitSize * 0.62
            : theme === "drop"
              ? -digitSize * 0.82
              : theme === "balls"
                ? digitSize * 0.44
                : digitSize * 0.28,
          hold: 88,
          peak: letter.start + 4,
          peakScale: isFeaturedLetterPop ? 1.2 : mode.bounceLetters ? 1.16 : mode.mega ? 1.14 : 1.08,
          rotate: isFeaturedLetterPop ? (index - 2) * 3 : theme === "pop" ? (index - 2) * 4 : 0,
          startScale: isFeaturedLetterPop ? 0.68 : 0.28,
          start: letter.start,
        })
      );
    });
    styles.push(
      buildGroupKeyframes(`${prefix}finalburst`, isFeaturedLetterPop ? 82 : 84, 96, 100),
      buildStageKeyframes(`${prefix}finalword`, {
        start: isFeaturedLetterPop ? 86 : 88,
        peak: isFeaturedLetterPop ? 90 : 92,
        hold: 97,
        end: 100,
        fromY: isFeaturedLetterPop ? letterSize * 0.18 : letterSize * 0.3,
        startScale: isFeaturedLetterPop ? 0.72 : 0.5,
        peakScale: isFeaturedLetterPop ? 1.16 : mode.mega ? 1.14 : 1.08,
        outScale: 1.04,
      })
    );
  } else {
    styles.push(buildGroupKeyframes(`${prefix}celebrate`, 66, 84, 100));
  }

  const digitsMarkup = digitWindows
    .map((step, index) => renderToken(step.label, ctx.centerX, centerY, digitSize, `${prefix}digit${index}`, index))
    .join("");

  const finalMarkup = isBingoReveal
    ? `
      ${renderBingoBand(`${prefix}band`)}
      ${letterWindows
        .map((letter, index) =>
          renderToken(letter.label, letter.x, letterY, letterSize, `${prefix}letter${index}`, index, "letter")
        )
        .join("")}
      ${renderCelebration(`${prefix}finalburst`, mode.mega ? 1.28 : theme === "firework" ? 1.18 : 1.06)}
      ${renderFinalBingoWord(`${prefix}finalword`)}
    `
    : renderCelebration(`${prefix}celebrate`);

  return `
    <style>
      ${styles.join("\n")}
    </style>
    ${glowCircle(ctx.centerX, centerY, digitSize * (isFeaturedLetterPop ? 1.32 : 1.14), palette.accent, isFeaturedLetterPop ? 0.12 : 0.08)}
    ${twinkleGroup(ctx, {
      colors: [palette.soft, palette.accent, palette.extra],
      points: isFeaturedLetterPop
        ? [
            [0.28, 0.18],
            [0.4, 0.12],
            [0.6, 0.12],
            [0.72, 0.18],
            [0.32, 0.72],
            [0.68, 0.72],
          ]
        : [
            [0.22, 0.2],
            [0.36, 0.14],
            [0.64, 0.15],
            [0.78, 0.22],
            [0.22, 0.78],
            [0.78, 0.78],
          ],
      radius: sparkleRadius * (isFeaturedLetterPop ? 0.96 : 0.82),
    })}
    ${digitsMarkup}
    ${finalMarkup}
  `;
}

function birthdayLetterLine(ctx, text, centerX, y, fontSize, palette, options = {}) {
  const letters = Array.from(text);
  const step = fontSize * (options.step ?? 0.7);
  const totalWidth = step * Math.max(letters.length - 1, 0);
  const startX = centerX - totalWidth / 2;
  const animation = options.animation ?? "wink-enter-pop";
  const baseDelay = options.baseDelay ?? 0;
  const delayStep = options.delayStep ?? 0.06;
  const colors = options.colors ?? [palette.soft, palette.flash, palette.extra, palette.accent];
  const stroke = options.stroke ?? palette.base;
  const fill = options.fill ?? palette.soft;
  const fromY = options.fromY ?? 34;

  return letters
    .map((letter, index) => {
      const x = round(startX + step * index);
      const delay = round(baseDelay + index * delayStep);
      const offsetX = round((index - (letters.length - 1) / 2) * fontSize * 0.14);
      const letterFill = fill === "cycle" ? colors[index % colors.length] : fill;
      return `<g style="transform-origin:${x}px ${y}px; --from-x:${offsetX}px; --from-y:${fromY}px; --from-r:${
        index % 2 === 0 ? -10 : 10
      }deg; animation:${animation} ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite; animation-delay:${delay}s;">${outlineText(
        letter,
        x,
        y,
        fontSize,
        letterFill,
        stroke
      )}</g>`;
    })
    .join("");
}

function birthdayTitleGroup(ctx, palette, options = {}) {
  const bannerWidth = options.bannerWidth ?? unit(ctx, ctx.kind === "effect" ? 0.5 : 0.62);
  const bannerHeight = options.bannerHeight ?? unit(ctx, ctx.kind === "effect" ? 0.11 : 0.13);
  const bannerY = options.bannerY ?? percentY(ctx, ctx.kind === "effect" ? 0.18 : 0.16);
  const firstLineY = options.firstLineY ?? bannerY - bannerHeight * 0.1;
  const secondLineY = options.secondLineY ?? bannerY + bannerHeight * 0.86;
  const fontSize = options.fontSize ?? bannerHeight * 0.5;

  return `
    <g>
      ${glowCircle(ctx.centerX, bannerY + bannerHeight * 0.42, bannerWidth * 0.4, palette.accent, 0.12)}
      <rect x="${ctx.centerX - bannerWidth / 2}" y="${bannerY - bannerHeight * 0.74}" width="${bannerWidth}" height="${
        bannerHeight * 2
      }" rx="${bannerHeight * 0.72}" fill="${palette.base}" opacity="0.12" stroke="${palette.soft}" stroke-width="${Math.max(
        2,
        bannerHeight * 0.06
      )}" />
      ${birthdayLetterLine(ctx, "Happy", ctx.centerX, firstLineY, fontSize, palette, {
        animation: options.lineOneAnimation ?? "wink-enter-pop",
        baseDelay: options.lineOneDelay ?? 0,
        delayStep: options.lineOneStep ?? 0.06,
        fill: options.lineOneFill ?? "cycle",
        fromY: options.lineOneFromY ?? 28,
      })}
      ${birthdayLetterLine(ctx, "Birthday", ctx.centerX, secondLineY, fontSize * 0.96, palette, {
        animation: options.lineTwoAnimation ?? "wink-enter-rise",
        baseDelay: options.lineTwoDelay ?? 0.22,
        delayStep: options.lineTwoStep ?? 0.05,
        fill: options.lineTwoFill ?? palette.soft,
        fromY: options.lineTwoFromY ?? 34,
      })}
    </g>
  `;
}

function birthdayBalloonTitleGroup(ctx, palette, options = {}) {
  const balloonWidth = options.balloonWidth ?? unit(ctx, ctx.kind === "effect" ? 0.054 : 0.06);
  const balloonHeight = balloonWidth * 1.36;
  const rowGap = options.rowGap ?? balloonHeight * 1.28;
  const startY = options.startY ?? percentY(ctx, ctx.kind === "effect" ? 0.18 : 0.16);
  const rows = [
    { text: "HAPPY", y: startY },
    { text: "BIRTHDAY", y: startY + rowGap },
  ];
  const colors = [palette.accent, palette.flash, palette.extra, palette.soft];

  return rows
    .map((row, rowIndex) => {
      const letters = Array.from(row.text);
      const step = balloonWidth * 0.84;
      const totalWidth = step * Math.max(letters.length - 1, 0);
      const startX = ctx.centerX - totalWidth / 2;

      return letters
        .map((letter, index) => {
          const x = round(startX + step * index);
          const fill = colors[(rowIndex + index) % colors.length];
          return `
            <g style="transform-origin:${x}px ${row.y}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite; animation-delay:${round(
              rowIndex * 0.1 + index * 0.04
            )}s;">
              <g style="animation:wink-hover-sway ${round(1.5 + index * 0.04)}s ease-in-out infinite ${round(
                0.56 + index * 0.03
              )}s;">
                ${balloon(x, row.y, balloonWidth, balloonHeight, fill, palette.base)}
                ${outlineText(letter, x, row.y - balloonHeight * 0.04, balloonHeight * 0.28, palette.base, palette.soft)}
              </g>
            </g>
          `;
        })
        .join("");
    })
    .join("");
}

function birthdayRibbonTitleGroup(ctx, palette, prefix, options = {}) {
  const barWidth = options.barWidth ?? unit(ctx, ctx.kind === "effect" ? 0.44 : 0.56);
  const barHeight = options.barHeight ?? unit(ctx, ctx.kind === "effect" ? 0.058 : 0.072);
  const topY = options.topY ?? percentY(ctx, ctx.kind === "effect" ? 0.19 : 0.17);

  const renderRibbonBar = (text, y, fill, textColor, delay = 0) => {
    const x = ctx.centerX - barWidth / 2;
    const tail = barHeight * 0.56;
    return `
      <g style="transform-origin:${ctx.centerX}px ${y}px; animation:${prefix}-ribbon ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite; animation-delay:${delay}s;">
        <path d="M ${x - tail} ${y} L ${x} ${y - barHeight * 0.38} L ${x} ${y + barHeight * 0.38} Z" fill="${fill}" opacity="0.9" />
        <rect x="${x}" y="${y - barHeight * 0.38}" width="${barWidth}" height="${barHeight * 0.76}" rx="${barHeight * 0.34}" fill="${fill}" stroke="${palette.base}" stroke-width="${Math.max(
          2,
          barHeight * 0.08
        )}" />
        <path d="M ${x + barWidth + tail} ${y} L ${x + barWidth} ${y - barHeight * 0.38} L ${x + barWidth} ${
          y + barHeight * 0.38
        } Z" fill="${fill}" opacity="0.9" />
        ${outlineText(text, ctx.centerX, y + barHeight * 0.02, barHeight * 0.42, textColor, palette.base)}
      </g>
    `;
  };

  return `
    ${renderRibbonBar("Happy", topY, palette.accent, palette.soft, 0)}
    ${renderRibbonBar("Birthday", topY + barHeight * 1.36, palette.flash, palette.base, 0.12)}
  `;
}

function renderBirthdayScene(ctx, definition) {
  const birthdayMoodMap = {
    "balloon-letter-title": "balloon-cake",
    "cake-slices-assemble": "cake-pop",
    "cupcake-parade-cake": "party-popper",
    "firework-backdrop-cake": "confetti-cake",
    "gold-elegant-birthday": "frosting-write",
    "hat-drop-cake": "gift-cake",
    "mega-party-finale": "mega-party",
    "sparkle-trail-title": "bounce-title",
    "spin-sparkle-cake": "sparkle-cake",
    "wish-blow-title": "candle-light",
  };
  const mood = birthdayMoodMap[definition.mood] ?? definition.mood;
  const palette = scenePalette(definition.category, definition.mood);
  const isFeaturedBalloon = definition.id === "happy-birthday-balloon-cake-effect-wink";
  const isFeaturedCandles = definition.id === "happy-birthday-candle-light-effect-wink";
  const isFeaturedBirthday = isFeaturedBalloon || isFeaturedCandles;
  const badgeSize = unit(ctx, isFeaturedBirthday ? 0.188 : ctx.kind === "effect" ? 0.16 : 0.19);
  const cakeY = percentY(ctx, isFeaturedBirthday ? 0.61 : ctx.kind === "effect" ? 0.58 : 0.6);
  const cakeWidth = badgeSize * (isFeaturedBirthday ? 2.42 : ctx.kind === "effect" ? 2.18 : 2.02);
  const cakeHeight = badgeSize * (isFeaturedBirthday ? 1.9 : ctx.kind === "effect" ? 1.74 : 1.62);
  const confettiColors = [palette.accent, palette.flash, palette.soft, palette.extra];

  const titleOptions = {
    "cake-pop": { lineOneAnimation: "wink-enter-pop", lineTwoAnimation: "wink-enter-pop", lineTwoDelay: 0.26 },
    "candle-light": { lineOneAnimation: "wink-enter-rise", lineTwoAnimation: "wink-enter-rise", lineTwoDelay: 0.2 },
    "confetti-cake": { lineOneAnimation: "wink-enter-pop", lineTwoAnimation: "wink-enter-rise", lineTwoDelay: 0.24 },
    "bounce-title": {
      lineOneAnimation: "wink-enter-rise",
      lineTwoAnimation: "wink-enter-pop",
      lineTwoDelay: 0.18,
      lineOneFromY: 42,
    },
    "gift-cake": { lineOneAnimation: "wink-enter-spin", lineTwoAnimation: "wink-enter-pop", lineTwoDelay: 0.24 },
    "balloon-cake": { lineOneAnimation: "wink-enter-rise", lineTwoAnimation: "wink-enter-pop", lineTwoDelay: 0.22 },
    "sparkle-cake": { lineOneAnimation: "wink-enter-pop", lineTwoAnimation: "wink-enter-spin", lineTwoDelay: 0.2 },
    "party-popper": { lineOneAnimation: "wink-enter-spin", lineTwoAnimation: "wink-enter-pop", lineTwoDelay: 0.18 },
    "frosting-write": {
      lineOneAnimation: "wink-enter-rise",
      lineTwoAnimation: "wink-enter-rise",
      lineTwoDelay: 0.2,
      lineOneFill: palette.soft,
      lineTwoFill: "cycle",
    },
    "mega-party": {
      lineOneAnimation: "wink-enter-spin",
      lineTwoAnimation: "wink-enter-spin",
      lineTwoDelay: 0.24,
      lineOneFill: "cycle",
      lineTwoFill: "cycle",
    },
  };

  const titleMarkup = isFeaturedBalloon
    ? birthdayBalloonTitleGroup(ctx, palette, {
        balloonWidth: unit(ctx, 0.066),
        rowGap: unit(ctx, 0.084),
        startY: percentY(ctx, 0.17),
      })
    : birthdayTitleGroup(ctx, palette, {
        ...(titleOptions[mood] ?? {}),
        bannerWidth: isFeaturedCandles ? unit(ctx, 0.56) : undefined,
        bannerY: isFeaturedCandles ? percentY(ctx, 0.18) : undefined,
        fontSize: isFeaturedCandles ? unit(ctx, 0.056) : undefined,
        lineOneAnimation: isFeaturedCandles ? "wink-featured-pop" : titleOptions[mood]?.lineOneAnimation,
        lineTwoAnimation: isFeaturedCandles ? "wink-featured-pop" : titleOptions[mood]?.lineTwoAnimation,
        lineOneFromY: isFeaturedCandles ? 18 : titleOptions[mood]?.lineOneFromY,
        lineTwoFromY: isFeaturedCandles ? 22 : titleOptions[mood]?.lineTwoFromY,
      });
  const sharedCake = cake(ctx.centerX, cakeY, cakeWidth, cakeHeight, {
    base: palette.accent,
    plate: palette.soft,
    stroke: palette.base,
    top: palette.flash,
  });

  const cakeAnimations = {
    "cake-pop": "wink-enter-pop",
    "candle-light": "wink-enter-rise",
    "confetti-cake": "wink-enter-rise",
    "bounce-title": "wink-enter-pop",
    "gift-cake": "wink-enter-rise",
    "balloon-cake": "wink-enter-rise",
    "sparkle-cake": "wink-enter-spin",
    "party-popper": "wink-enter-pop",
    "frosting-write": "wink-enter-rise",
    "mega-party": "wink-enter-spin",
  };
  const cakeMotion =
    mood === "balloon-cake"
      ? "wink-hover-sway 1.7s ease-in-out infinite 0.6s"
      : "wink-hover-bob 1.45s ease-in-out infinite 0.72s";
  const cakeGroup = `<g style="transform-origin:${ctx.centerX}px ${cakeY}px; animation:${
    isFeaturedBirthday ? "wink-featured-pop" : cakeAnimations[mood] ?? "wink-enter-rise"
  } ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite, ${cakeMotion};">${sharedCake}</g>`;

  const candleGlow = Array.from({ length: 3 }, (_, index) => {
    const candleX = ctx.centerX + (index - 1) * cakeWidth * 0.13;
    const glowY = cakeY - cakeHeight * 0.52;
    const radius = badgeSize * (index === 1 ? 0.2 : 0.16);
    return `<g style="transform-origin:${candleX}px ${glowY}px; animation:wink-twinkle 1.05s ease-in-out infinite; animation-delay:${round(
      index * 0.14
    )}s;">${glowCircle(candleX, glowY, radius, palette.flash, 0.18)}${sparkle(
      candleX,
      glowY,
      radius * 0.7,
      palette.flash,
      palette.soft
    )}</g>`;
  }).join("");

  const balloonCluster = `
    <g style="transform-origin:${ctx.centerX}px ${cakeY - badgeSize * 0.2}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
      <g style="animation:wink-hover-sway 1.76s ease-in-out infinite 0.55s;">${balloon(
        ctx.centerX - cakeWidth * 0.5,
        cakeY - cakeHeight * 1.02,
        badgeSize * 0.72,
        badgeSize * 0.94,
        palette.accent,
        palette.base
      )}</g>
      <g style="animation:wink-hover-sway 1.62s ease-in-out infinite 0.64s;">${balloon(
        ctx.centerX,
        cakeY - cakeHeight * 1.16,
        badgeSize * 0.78,
        badgeSize * 1.02,
        palette.flash,
        palette.base
      )}</g>
      <g style="animation:wink-hover-sway 1.84s ease-in-out infinite 0.6s;">${balloon(
        ctx.centerX + cakeWidth * 0.5,
        cakeY - cakeHeight * 1.02,
        badgeSize * 0.72,
        badgeSize * 0.94,
        palette.extra,
        palette.base
      )}</g>
    </g>
  `;

  const partyPopperBurst = (centerX, centerY, direction) => {
    const coneWidth = badgeSize * 0.54;
    const coneHeight = badgeSize * 0.7;
    const angle = direction === "left" ? -26 : 26;
    const burstX = centerX + (direction === "left" ? coneWidth * 0.55 : -coneWidth * 0.55);
    const burstY = centerY - coneHeight * 0.56;
    return `
      <g style="transform-origin:${centerX}px ${centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite, wink-hover-sway 1.4s ease-in-out infinite 0.72s;">
        <g transform="rotate(${angle} ${centerX} ${centerY})">
          <path d="M ${centerX - coneWidth * 0.46} ${centerY + coneHeight * 0.22} L ${centerX + coneWidth * 0.42} ${
            centerY - coneHeight * 0.14
          } L ${centerX + coneWidth * 0.18} ${centerY + coneHeight * 0.44} Z" fill="${palette.accent}" stroke="${
            palette.base
          }" stroke-width="${Math.max(2, badgeSize * 0.08)}" />
          <path d="M ${centerX - coneWidth * 0.22} ${centerY + coneHeight * 0.1} L ${centerX + coneWidth * 0.04} ${
            centerY + coneHeight * 0.3
          }" stroke="${palette.soft}" stroke-width="${Math.max(2, badgeSize * 0.07)}" stroke-linecap="round" />
        </g>
      </g>
      ${burstGroup(ctx, {
        centerX: burstX,
        centerY: burstY,
        colors: confettiColors,
        count: 11,
        distance: badgeSize * 1.1,
        shape: direction === "left" ? "star" : "confetti",
        size: badgeSize * 0.11,
        startAngle: direction === "left" ? -18 : 198,
      })}
    `;
  };

  const frostingSwirl = `
    <g style="transform-origin:${ctx.centerX}px ${cakeY - cakeHeight * 1.18}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
      <path d="M ${ctx.centerX - cakeWidth * 0.48} ${cakeY - cakeHeight * 1.22} C ${ctx.centerX - cakeWidth * 0.28} ${
        cakeY - cakeHeight * 1.44
      }, ${ctx.centerX - cakeWidth * 0.08} ${cakeY - cakeHeight * 1.02}, ${ctx.centerX + cakeWidth * 0.08} ${
        cakeY - cakeHeight * 1.24
      } S ${ctx.centerX + cakeWidth * 0.34} ${cakeY - cakeHeight * 1.34}, ${ctx.centerX + cakeWidth * 0.48} ${
        cakeY - cakeHeight * 1.12
      }" fill="none" stroke="${palette.soft}" stroke-width="${Math.max(
        4,
        badgeSize * 0.11
      )}" stroke-linecap="round" stroke-dasharray="${cakeWidth * 1.2}" style="--dash:${cakeWidth * 1.2}; animation:wink-draw-path ${
    ctx.loopSeconds
  }s ease-in-out infinite;" />
      <path d="M ${ctx.centerX - cakeWidth * 0.22} ${cakeY - cakeHeight * 0.38} C ${ctx.centerX - cakeWidth * 0.06} ${
        cakeY - cakeHeight * 0.58
      }, ${ctx.centerX + cakeWidth * 0.06} ${cakeY - cakeHeight * 0.18}, ${ctx.centerX + cakeWidth * 0.22} ${
        cakeY - cakeHeight * 0.4
      }" fill="none" stroke="${palette.flash}" stroke-width="${Math.max(
        3,
        badgeSize * 0.08
      )}" stroke-linecap="round" stroke-dasharray="${cakeWidth * 0.45}" style="--dash:${cakeWidth * 0.45}; animation:wink-draw-path ${
    ctx.loopSeconds
  }s ease-in-out infinite 0.22s;" />
    </g>
  `;

  let supportMarkup = "";
  let confettiMarkup = burstGroup(ctx, {
    centerX: ctx.centerX,
    centerY: cakeY - badgeSize * 0.12,
    colors: confettiColors,
    count: 14,
    distance: badgeSize * 1.35,
    shape: "confetti",
    size: badgeSize * 0.12,
  });
  let twinkles = twinkleGroup(ctx, {
    colors: [palette.soft, palette.accent, palette.flash, palette.extra],
  });
  let ring = impactRing(ctx, palette.flash, badgeSize * 1.2);

  switch (definition.mood) {
    case "candle-light":
      supportMarkup = candleGlow;
      confettiMarkup = burstGroup(ctx, {
        centerX: ctx.centerX,
        centerY: cakeY - cakeHeight * 0.5,
        colors: [palette.flash, palette.soft, palette.extra],
        count: 12,
        distance: badgeSize * 0.95,
        shape: "circle",
        size: badgeSize * 0.1,
      });
      break;
    case "confetti-cake":
      confettiMarkup = fallGroup(ctx, {
        colors: confettiColors,
        columns: ctx.kind === "effect" ? 13 : 10,
        shape: "confetti",
        top: percentY(ctx, 0.12),
        spread: ctx.width * 0.74,
        travelY: ctx.height * 0.66,
      });
      supportMarkup = burstGroup(ctx, {
        centerX: ctx.centerX,
        centerY: cakeY - badgeSize * 0.16,
        colors: confettiColors,
        count: 16,
        distance: badgeSize * 1.2,
        shape: "circle",
        size: badgeSize * 0.1,
      });
      break;
    case "bounce-title":
      supportMarkup = `
        <g style="transform-origin:${ctx.centerX}px ${cakeY + cakeHeight * 0.5}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
          ${glowCircle(ctx.centerX, cakeY + cakeHeight * 0.48, cakeWidth * 0.34, palette.extra, 0.14)}
        </g>
      `;
      break;
    case "gift-cake":
      supportMarkup = `
        <g style="transform-origin:${ctx.centerX}px ${cakeY + cakeHeight * 0.18}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
          ${giftBox(ctx.centerX, cakeY + cakeHeight * 0.18, cakeWidth * 0.92, cakeHeight * 1.18, {
            body: palette.accent,
            lid: palette.flash,
            ribbon: palette.soft,
            stroke: palette.base,
          })}
        </g>
      `;
      confettiMarkup = burstGroup(ctx, {
        centerX: ctx.centerX,
        centerY: cakeY - cakeHeight * 0.14,
        colors: confettiColors,
        count: 16,
        distance: badgeSize * 1.2,
        shape: "star",
        size: badgeSize * 0.1,
      });
      break;
    case "balloon-cake":
      supportMarkup = balloonCluster;
      confettiMarkup = burstGroup(ctx, {
        centerX: ctx.centerX,
        centerY: cakeY - cakeHeight * 0.7,
        colors: confettiColors,
        count: 14,
        distance: badgeSize * 1.45,
        shape: "circle",
        size: badgeSize * 0.1,
      });
      break;
    case "sparkle-cake":
      supportMarkup = `
        ${candleGlow}
        ${twinkleGroup(ctx, {
          colors: [palette.soft, palette.flash, palette.extra, palette.accent],
          points: [
            [0.24, 0.28],
            [0.34, 0.21],
            [0.68, 0.22],
            [0.78, 0.3],
            [0.26, 0.68],
            [0.74, 0.7],
          ],
          radius: badgeSize * 0.14,
        })}
      `;
      break;
    case "party-popper":
      supportMarkup = `
        ${partyPopperBurst(percentX(ctx, 0.21), percentY(ctx, 0.66), "left")}
        ${partyPopperBurst(percentX(ctx, 0.79), percentY(ctx, 0.66), "right")}
      `;
      confettiMarkup = fallGroup(ctx, {
        colors: confettiColors,
        columns: ctx.kind === "effect" ? 12 : 9,
        shape: "confetti",
        top: percentY(ctx, 0.16),
        spread: ctx.width * 0.68,
        travelY: ctx.height * 0.58,
      });
      break;
    case "frosting-write":
      supportMarkup = `
        ${frostingSwirl}
        ${candleGlow}
      `;
      confettiMarkup = burstGroup(ctx, {
        centerX: ctx.centerX,
        centerY: cakeY - cakeHeight * 0.38,
        colors: [palette.soft, palette.flash, palette.accent],
        count: 10,
        distance: badgeSize * 0.96,
        shape: "circle",
        size: badgeSize * 0.09,
      });
      break;
    case "mega-party":
      supportMarkup = `
        ${balloonCluster}
        ${candleGlow}
        ${partyPopperBurst(percentX(ctx, 0.18), percentY(ctx, 0.68), "left")}
        ${partyPopperBurst(percentX(ctx, 0.82), percentY(ctx, 0.68), "right")}
      `;
      confettiMarkup = `
        ${fallGroup(ctx, {
          colors: confettiColors,
          columns: ctx.kind === "effect" ? 14 : 11,
          shape: "confetti",
          top: percentY(ctx, 0.1),
          spread: ctx.width * 0.8,
          travelY: ctx.height * 0.68,
        })}
        ${burstGroup(ctx, {
          centerX: ctx.centerX,
          centerY: cakeY - cakeHeight * 0.3,
          colors: confettiColors,
          count: 18,
          distance: badgeSize * 1.5,
          shape: "star",
          size: badgeSize * 0.12,
        })}
      `;
      twinkles = twinkleGroup(ctx, {
        colors: [palette.soft, palette.accent, palette.flash, palette.extra],
        points: [
          [0.2, 0.18],
          [0.31, 0.14],
          [0.42, 0.22],
          [0.58, 0.16],
          [0.7, 0.2],
          [0.8, 0.28],
          [0.23, 0.74],
          [0.77, 0.76],
        ],
        radius: badgeSize * 0.16,
      });
      ring = impactRing(ctx, palette.flash, badgeSize * 1.34, unit(ctx, 0.018));
      break;
    case "cake-pop":
    default:
      supportMarkup = candleGlow;
      break;
  }

  if (isFeaturedCandles) {
    supportMarkup = `
      ${candleGlow}
      <g style="transform-origin:${ctx.centerX}px ${cakeY - cakeHeight * 0.42}px; animation:wink-featured-burst ${ctx.loopSeconds}s ease-out infinite;">
        ${glowCircle(ctx.centerX, cakeY - cakeHeight * 0.42, cakeWidth * 0.26, palette.flash, 0.22)}
      </g>
    `;
    confettiMarkup = burstGroup(ctx, {
      centerX: ctx.centerX,
      centerY: cakeY - cakeHeight * 0.46,
      colors: [palette.flash, palette.soft, palette.extra],
      count: 8,
      distance: badgeSize * 0.98,
      shape: "star",
      size: badgeSize * 0.12,
    });
    twinkles = twinkleGroup(ctx, {
      colors: [palette.soft, palette.flash, palette.extra],
      points: [
        [0.32, 0.18],
        [0.44, 0.14],
        [0.56, 0.14],
        [0.68, 0.18],
        [0.36, 0.66],
        [0.64, 0.66],
      ],
      radius: badgeSize * 0.14,
    });
    ring = impactRing(ctx, palette.flash, badgeSize * 1.3, unit(ctx, 0.018));
  }

  if (isFeaturedBalloon) {
    supportMarkup = balloonCluster;
    confettiMarkup = burstGroup(ctx, {
      centerX: ctx.centerX,
      centerY: cakeY - cakeHeight * 0.72,
      colors: confettiColors,
      count: 8,
      distance: badgeSize * 1.12,
      shape: "circle",
      size: badgeSize * 0.11,
    });
    twinkles = twinkleGroup(ctx, {
      colors: [palette.soft, palette.accent, palette.flash],
      points: [
        [0.26, 0.16],
        [0.38, 0.1],
        [0.62, 0.1],
        [0.74, 0.16],
        [0.3, 0.66],
        [0.7, 0.66],
      ],
      radius: badgeSize * 0.13,
    });
    ring = impactRing(ctx, palette.flash, badgeSize * 1.34, unit(ctx, 0.018));
  }

  return `
    ${titleMarkup}
    ${supportMarkup}
    ${cakeGroup}
    ${ring}
    ${twinkles}
    ${confettiMarkup}
  `;
}

function renderThumbsScene(ctx, definition) {
  const palette = scenePalette(definition.category, definition.mood);
  const isFeaturedThumb =
    definition.id === "thumbs-up-confetti" || definition.id === "thumbs-up-gold-burst";
  const size = unit(ctx, isFeaturedThumb ? 0.236 : ctx.kind === "effect" ? 0.2 : 0.24);
  const titleY = percentY(ctx, ctx.kind === "effect" ? 0.2 : 0.18);
  const accentY = percentY(ctx, ctx.kind === "effect" ? 0.76 : 0.79);

  const motif = (() => {
    switch (definition.mood) {
      case "gold":
        if (isFeaturedThumb) {
          return `
            <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-featured-pop ${ctx.loopSeconds}s cubic-bezier(0.22,1,0.36,1) infinite;">
              ${glowCircle(ctx.centerX, ctx.centerY, size * 1.18, palette.flash, 0.16)}
              <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.98}" fill="${palette.base}" stroke="${palette.flash}" stroke-width="${Math.max(
                5,
                size * 0.06
              )}" />
              <g style="animation:wink-hover-bob 1.18s ease-in-out infinite 0.68s;">${thumbIcon(
                ctx.centerX,
                ctx.centerY,
                size * 1.5,
                palette.accent,
                palette.soft
              )}</g>
            </g>
          `;
        }
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.9}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(4, size * 0.06)}" />
            <g style="animation:wink-hover-bob 1.28s ease-in-out infinite 0.72s;">${thumbIcon(
              ctx.centerX,
              ctx.centerY,
              size * 1.22,
              palette.accent,
              palette.soft
            )}</g>
          </g>
        `;
      case "bounce":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite, wink-hover-bob 1.12s ease-in-out infinite 0.68s;">${thumbIcon(
          ctx.centerX,
          ctx.centerY,
          size * 1.34,
          palette.accent,
          palette.soft
        )}</g>`;
      case "confetti":
        if (isFeaturedThumb) {
          return `
            <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-featured-pop ${ctx.loopSeconds}s cubic-bezier(0.22,1,0.36,1) infinite;">
              ${glowCircle(ctx.centerX, ctx.centerY, size * 1.16, palette.flash, 0.14)}
              <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.94}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(
                5,
                size * 0.055
              )}" />
              ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.48, palette.accent, palette.soft)}
              ${pillLabel(ctx.centerX, ctx.centerY + size * 0.98, size * 2.08, size * 0.38, palette.base, palette.accent, "CHEERS", palette.soft)}
            </g>
          `;
        }
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.24, palette.accent, palette.soft)}
            ${pillLabel(ctx.centerX, ctx.centerY + size * 0.92, size * 1.82, size * 0.36, palette.base, palette.accent, "CHEERS", palette.soft)}
          </g>
        `;
      case "pulse":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.98}" fill="${palette.base}" opacity="0.42" />
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.82}" fill="none" stroke="${palette.flash}" stroke-width="${Math.max(6, size * 0.07)}" opacity="0.9" />
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 1.18}" fill="none" stroke="${palette.extra}" stroke-width="${Math.max(4, size * 0.05)}" opacity="0.65" />
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.3, palette.accent, palette.soft)}
          </g>
        `;
      case "spotlight":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            <path d="M ${ctx.centerX - size * 0.42} 0 L ${ctx.centerX + size * 0.42} 0 L ${ctx.centerX + size * 0.88} ${
              ctx.centerY + size * 1.08
            } L ${ctx.centerX - size * 0.88} ${ctx.centerY + size * 1.08} Z" fill="${palette.soft}" opacity="0.14" />
            <ellipse cx="${ctx.centerX}" cy="${ctx.centerY + size * 0.82}" rx="${size * 0.98}" ry="${size * 0.24}" fill="${palette.flash}" opacity="0.2" />
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.9}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(5, size * 0.06)}" />
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.18, palette.accent, palette.soft)}
          </g>
        `;
      case "seal":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <polygon points="${starPath(ctx.centerX, ctx.centerY - size * 0.04, size * 1.08, size * 0.78, 10)}" fill="${palette.base}" stroke="${palette.flash}" stroke-width="${Math.max(
              5,
              size * 0.05
            )}" />
            <path d="M ${ctx.centerX - size * 0.34} ${ctx.centerY + size * 0.62} L ${ctx.centerX - size * 0.08} ${ctx.centerY + size * 1.18} L ${ctx.centerX + size * 0.06} ${
              ctx.centerY + size * 0.76
            } Z" fill="${palette.accent}" opacity="0.86" />
            <path d="M ${ctx.centerX + size * 0.34} ${ctx.centerY + size * 0.62} L ${ctx.centerX + size * 0.08} ${ctx.centerY + size * 1.18} L ${ctx.centerX - size * 0.06} ${
              ctx.centerY + size * 0.76
            } Z" fill="${palette.extra}" opacity="0.86" />
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.08, palette.accent, palette.soft)}
          </g>
        `;
      case "ribbon":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.88}" fill="${palette.base}" stroke="${palette.flash}" stroke-width="${Math.max(5, size * 0.05)}" />
            <path d="M ${ctx.centerX - size * 0.52} ${ctx.centerY + size * 0.48} L ${ctx.centerX - size * 0.2} ${ctx.centerY + size * 1.26} L ${ctx.centerX} ${
              ctx.centerY + size * 0.72
            } Z" fill="${palette.accent}" opacity="0.9" />
            <path d="M ${ctx.centerX + size * 0.52} ${ctx.centerY + size * 0.48} L ${ctx.centerX + size * 0.2} ${ctx.centerY + size * 1.26} L ${ctx.centerX} ${
              ctx.centerY + size * 0.72
            } Z" fill="${palette.extra}" opacity="0.9" />
            ${thumbIcon(ctx.centerX, ctx.centerY - size * 0.04, size * 1.14, palette.soft, palette.flash)}
          </g>
        `;
      case "flare":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <polygon points="${starPath(ctx.centerX, ctx.centerY, size * 1.18, size * 0.5, 8)}" fill="${palette.base}" stroke="${palette.extra}" stroke-width="${Math.max(
              4,
              size * 0.04
            )}" opacity="0.95" />
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.64}" fill="${palette.flash}" opacity="0.22" />
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.12, palette.accent, palette.soft)}
          </g>
        `;
      case "ring":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.16, palette.accent, palette.soft)}
            ${Array.from({ length: 8 }, (_, index) => {
              const angle = index * 45;
              const cx = polarX(ctx.centerX, size * 0.92, angle);
              const cy = polarY(ctx.centerY, size * 0.92, angle);
              return sparkle(cx, cy, size * 0.12, index % 2 === 0 ? palette.flash : palette.extra, palette.soft);
            }).join("")}
          </g>
        `;
      case "fast":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.14, palette.accent, palette.soft)}
            ${[-1, 1].map((direction, index) => {
              const startX = ctx.centerX + direction * size * 0.78;
              return `<path d="M ${startX} ${ctx.centerY - size * 0.18} L ${startX + direction * size * 0.32} ${
                ctx.centerY - size * 0.18
              } M ${startX} ${ctx.centerY} L ${startX + direction * size * 0.4} ${ctx.centerY} M ${startX} ${
                ctx.centerY + size * 0.18
              } L ${startX + direction * size * 0.28} ${ctx.centerY + size * 0.18}" fill="none" stroke="${
                index === 0 ? palette.flash : palette.extra
              }" stroke-width="${Math.max(3, size * 0.055)}" stroke-linecap="round" opacity="0.85" style="animation:wink-pulse 0.9s ease-in-out infinite; animation-delay:${round(
                index * 0.14
              )}s;" />`;
            }).join("")}
          </g>
        `;
      case "badge":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <polygon points="${starPath(ctx.centerX, ctx.centerY, size * 0.96, size * 0.64, 6)}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(
              4,
              size * 0.05
            )}" />
            ${thumbIcon(ctx.centerX, ctx.centerY, size, palette.accent, palette.soft)}
          </g>
        `;
      case "jackpot":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 1.08, palette.accent, palette.soft)}
            ${pillLabel(ctx.centerX, ctx.centerY + size * 0.9, size * 1.92, size * 0.36, palette.flash, palette.base, "777", palette.soft)}
          </g>
        `;
      case "chat":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            <path d="M ${ctx.centerX - size} ${ctx.centerY - size * 0.42} h ${size * 2} a ${size * 0.2} ${size * 0.2} 0 0 1 ${
              size * 0.2
            } ${size * 0.2} v ${size * 0.82} a ${size * 0.2} ${size * 0.2} 0 0 1 -${size * 0.2} ${
              size * 0.2
            } h -${size * 0.78} l -${size * 0.3} ${size * 0.28} v -${size * 0.28} h -${size * 0.92} a ${
              size * 0.2
            } ${size * 0.2} 0 0 1 -${size * 0.2} -${size * 0.2} v -${size * 0.82} a ${size * 0.2} ${
              size * 0.2
            } 0 0 1 ${size * 0.2} -${size * 0.2} Z" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(
              3,
              size * 0.04
            )}" />
            ${thumbIcon(ctx.centerX, ctx.centerY, size * 0.86, palette.accent, palette.soft)}
          </g>
        `;
      default:
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite, wink-hover-bob 1.26s ease-in-out infinite 0.7s;">${thumbIcon(
          ctx.centerX,
          ctx.centerY,
          size * 1.24,
          palette.accent,
          palette.soft
        )}</g>`;
    }
  })();

  const ring = impactRing(ctx, palette.flash, size * (isFeaturedThumb ? 1.18 : 1.06));
  const twinkles = twinkleGroup(ctx, {
    colors: [palette.soft, palette.accent, palette.flash],
    points: isFeaturedThumb
      ? [
          [0.28, 0.22],
          [0.4, 0.14],
          [0.6, 0.14],
          [0.72, 0.22],
          [0.34, 0.68],
          [0.66, 0.68],
        ]
      : undefined,
    radius: isFeaturedThumb ? unit(ctx, 0.021) : unit(ctx, 0.018),
  });
  const accents =
    definition.mood === "jackpot"
      ? burstGroup(ctx, {
          colors: [palette.flash, palette.accent, palette.soft],
          count: 16,
          distance: unit(ctx, 0.28),
          shape: "coin",
          size: unit(ctx, 0.018),
        })
      : burstGroup(ctx, {
          colors: [palette.flash, palette.accent, palette.extra, palette.soft],
          count: isFeaturedThumb ? 8 : 14,
          distance: unit(ctx, isFeaturedThumb ? 0.22 : 0.26),
          shape:
            isFeaturedThumb && definition.mood === "gold"
              ? "star"
              : definition.mood === "sparkle" ||
                  definition.mood === "ring" ||
                  definition.mood === "pulse" ||
                  definition.mood === "seal" ||
                  definition.mood === "spotlight" ||
                  definition.mood === "flare"
                ? "star"
                : "confetti",
          size: unit(ctx, isFeaturedThumb ? 0.024 : 0.016),
        });

  return `
    ${outlineText(definition.title, ctx.centerX, titleY, size * 0.38, palette.soft, palette.base)}
    ${motif}
    ${ring}
    ${twinkles}
    ${accents}
    <g style="transform-origin:${ctx.centerX}px ${accentY}px; animation:wink-finale ${ctx.loopSeconds}s ease-out infinite;">
      ${pillLabel(ctx.centerX, accentY, size * 1.98, size * 0.34, palette.accent, palette.base, definition.accent, palette.base)}
    </g>
  `;
}

function renderLeprechaunScene(ctx, definition) {
  const palette = scenePalette(definition.category, definition.mood);
  const isFeaturedCoins = definition.id === "leprechaun-gold-coins";
  const size = unit(ctx, isFeaturedCoins ? 0.206 : ctx.kind === "effect" ? 0.18 : 0.22);
  const titleY = percentY(ctx, ctx.kind === "effect" ? 0.2 : 0.18);
  const accentY = percentY(ctx, ctx.kind === "effect" ? 0.76 : 0.8);

  const motif = (() => {
    switch (definition.mood) {
      case "clover":
      case "burst":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite, wink-hover-bob 1.36s ease-in-out infinite 0.7s;">${clover(
          ctx.centerX,
          ctx.centerY,
          size * 0.72,
          palette.accent,
          palette.base
        )}</g>`;
      case "coins":
      case "rain":
        if (isFeaturedCoins && definition.mood === "coins") {
          return `
            <g style="transform-origin:${ctx.centerX}px ${ctx.centerY + size * 0.2}px; animation:wink-featured-pop ${ctx.loopSeconds}s cubic-bezier(0.22,1,0.36,1) infinite;">
              ${glowCircle(ctx.centerX, ctx.centerY + size * 0.14, size * 1.18, palette.flash, 0.14)}
              ${potOfGold(ctx.centerX, ctx.centerY + size * 0.62, size * 2.54, size * 1.94, {
                coin: palette.accent,
                pot: palette.base,
                stroke: palette.soft,
              })}
              ${[
                { x: ctx.centerX - size * 0.56, y: ctx.centerY + size * 0.02, scale: 0.3, delay: 0.1 },
                { x: ctx.centerX, y: ctx.centerY - size * 0.28, scale: 0.36, delay: 0.18 },
                { x: ctx.centerX + size * 0.56, y: ctx.centerY + size * 0.02, scale: 0.3, delay: 0.26 },
              ]
                .map(
                  (coin) => `
                    <g style="transform-origin:${coin.x}px ${coin.y}px; animation:wink-featured-pop ${ctx.loopSeconds}s cubic-bezier(0.22,1,0.36,1) infinite; animation-delay:${coin.delay}s;">
                      ${renderParticleShape("coin", {
                        color: palette.accent,
                        cx: coin.x,
                        cy: coin.y,
                        size: size * coin.scale,
                      })}
                    </g>
                  `
                )
                .join("")}
            </g>
          `;
        }
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${Array.from({ length: 5 }, (_, index) => {
              const x = ctx.centerX + (index - 2) * size * 0.34;
              const y = ctx.centerY + Math.abs(index - 2) * size * 0.08;
              return renderParticleShape("coin", {
                color: palette.accent,
                cx: x,
                cy: y,
                size: size * 0.22,
              });
            }).join("")}
          </g>
        `;
      case "rainbow":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY + size * 0.3}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${["#ff5a79", "#ff9f45", "#ffd84f", "#6cda60", "#5cdcff"].map((color, index) => {
              const radius = size * (1.05 - index * 0.12);
              return `<path d="${rainbowArcPath(ctx.centerX, ctx.centerY + size * 0.46, radius)}" fill="none" stroke="${color}" stroke-width="${Math.max(
                8,
                size * 0.08
              )}" stroke-linecap="round" />`;
            }).join("")}
            ${clover(ctx.centerX, ctx.centerY + size * 0.4, size * 0.22, palette.accent, palette.base)}
          </g>
        `;
      case "hat":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite, wink-hover-sway 1.2s ease-in-out infinite 0.7s;">${leprechaunHat(
          ctx.centerX,
          ctx.centerY,
          size * 1.98,
          size * 1.74,
          {
            band: palette.flash,
            body: palette.base,
            brim: palette.accent,
            buckle: "#ffd85c",
            stroke: palette.soft,
          }
        )}</g>`;
      case "pot":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.22,1) infinite, wink-hover-bob 1.32s ease-in-out infinite 0.7s;">${potOfGold(
          ctx.centerX,
          ctx.centerY,
          size * 2.18,
          size * 1.62,
          {
            coin: palette.accent,
            pot: palette.base,
            stroke: palette.soft,
          }
        )}</g>`;
      case "crown":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY + size * 0.04}" r="${size * 0.92}" fill="${palette.base}" stroke="${palette.flash}" stroke-width="${Math.max(
              5,
              size * 0.055
            )}" />
            ${clover(ctx.centerX, ctx.centerY + size * 0.08, size * 0.44, palette.accent, palette.soft)}
            ${Array.from({ length: 5 }, (_, index) => {
              const x = ctx.centerX + (index - 2) * size * 0.3;
              const y = ctx.centerY - size * 0.74 + Math.abs(index - 2) * size * 0.08;
              return sparkle(x, y, size * 0.14, index % 2 === 0 ? palette.flash : palette.extra, palette.soft);
            }).join("")}
          </g>
        `;
      case "fountain":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY + size * 0.2}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${potOfGold(ctx.centerX, ctx.centerY + size * 0.62, size * 2.34, size * 1.76, {
              coin: palette.accent,
              pot: palette.base,
              stroke: palette.soft,
            })}
            ${[-0.7, -0.34, 0, 0.34, 0.7]
              .map((offset, index) => {
                const coinX = ctx.centerX + size * offset;
                const coinY = ctx.centerY - size * (0.46 + Math.abs(offset) * 0.22);
                return `<g style="transform-origin:${coinX}px ${coinY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.22,1,0.36,1) infinite; animation-delay:${round(
                  index * 0.06
                )}s;">${renderParticleShape("coin", {
                  color: index % 2 === 0 ? palette.accent : palette.flash,
                  cx: coinX,
                  cy: coinY,
                  size: size * 0.28,
                })}</g>`;
              })
              .join("")}
          </g>
        `;
      case "seal":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.92}" fill="${palette.base}" stroke="${palette.flash}" stroke-width="${Math.max(
              5,
              size * 0.055
            )}" />
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.68}" fill="none" stroke="${palette.extra}" stroke-width="${Math.max(
              4,
              size * 0.04
            )}" />
            ${clover(ctx.centerX, ctx.centerY, size * 0.38, palette.accent, palette.soft)}
          </g>
        `;
      case "vault":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY + size * 0.24}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${["#ff6283", "#ffb04f", "#ffe062", "#7ae16d", "#62dfff"].map((color, index) => {
              const radius = size * (1.14 - index * 0.12);
              return `<path d="${rainbowArcPath(ctx.centerX, ctx.centerY + size * 0.5, radius)}" fill="none" stroke="${color}" stroke-width="${Math.max(
                8,
                size * 0.08
              )}" stroke-linecap="round" />`;
            }).join("")}
            ${potOfGold(ctx.centerX, ctx.centerY + size * 0.78, size * 1.96, size * 1.48, {
              coin: palette.flash,
              pot: palette.base,
              stroke: palette.soft,
            })}
            ${renderParticleShape("coin", {
              color: palette.accent,
              cx: ctx.centerX,
              cy: ctx.centerY - size * 0.22,
              size: size * 0.34,
            })}
          </g>
        `;
      case "treasure":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.9}" fill="${palette.accent}" stroke="#b27f00" stroke-width="${Math.max(
              5,
              size * 0.055
            )}" />
            ${clover(ctx.centerX, ctx.centerY, size * 0.3, palette.base, palette.soft)}
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 1.14}" fill="none" stroke="${palette.extra}" stroke-width="${Math.max(
              4,
              size * 0.04
            )}" opacity="0.5" />
          </g>
        `;
      case "spin":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            <circle cx="${ctx.centerX}" cy="${ctx.centerY}" r="${size * 0.86}" fill="${palette.base}" stroke="${palette.accent}" stroke-width="${Math.max(4, size * 0.06)}" />
            ${clover(ctx.centerX, ctx.centerY, size * 0.44, palette.accent, palette.soft)}
          </g>
        `;
      case "magic":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${sparkle(ctx.centerX, ctx.centerY, size * 0.96, palette.accent, palette.soft)}
            ${pillLabel(ctx.centerX, ctx.centerY + size * 0.92, size * 1.74, size * 0.34, palette.base, palette.accent, "LUCKY", palette.soft)}
          </g>
        `;
      case "jackpot":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${pillLabel(ctx.centerX, ctx.centerY - size * 0.16, size * 1.98, size * 0.42, palette.base, palette.accent, "777", palette.soft)}
            ${clover(ctx.centerX, ctx.centerY + size * 0.5, size * 0.34, palette.accent, palette.soft)}
          </g>
        `;
      default:
        return "";
    }
  })();

  const ring = impactRing(ctx, palette.flash, size * (isFeaturedCoins ? 1.22 : 1.08));
  const twinkles = twinkleGroup(ctx, {
    colors: [palette.soft, palette.accent, palette.flash],
    points: isFeaturedCoins
      ? [
          [0.28, 0.18],
          [0.42, 0.14],
          [0.58, 0.14],
          [0.72, 0.18],
          [0.34, 0.68],
          [0.66, 0.68],
        ]
      : undefined,
    radius: isFeaturedCoins ? unit(ctx, 0.02) : unit(ctx, 0.018),
  });
  const accents =
    definition.mood === "rain"
      ? fallGroup(ctx, {
          colors: [palette.accent, palette.flash, palette.soft],
          columns: 10,
          shape: "coin",
          top: percentY(ctx, 0.15),
          travelY: ctx.height * 0.62,
        })
      : burstGroup(ctx, {
          colors: [palette.accent, palette.flash, palette.soft, palette.extra],
          count: isFeaturedCoins ? 8 : 15,
          distance: unit(ctx, isFeaturedCoins ? 0.2 : 0.27),
          shape:
            definition.mood === "clover" ||
            definition.mood === "burst" ||
            definition.mood === "spin" ||
            definition.mood === "crown" ||
            definition.mood === "seal"
              ? "clover"
              : definition.mood === "coins" ||
                  definition.mood === "pot" ||
                  definition.mood === "jackpot" ||
                  definition.mood === "fountain" ||
                  definition.mood === "treasure" ||
                  definition.mood === "vault"
                ? "coin"
                : "star",
          size: unit(ctx, isFeaturedCoins ? 0.022 : 0.016),
        });

  return `
    ${outlineText(definition.title, ctx.centerX, titleY, size * 0.36, palette.soft, palette.base)}
    ${motif}
    ${ring}
    ${twinkles}
    ${accents}
    <g style="transform-origin:${ctx.centerX}px ${accentY}px; animation:wink-finale ${ctx.loopSeconds}s ease-out infinite;">
      ${pillLabel(ctx.centerX, accentY, size * 2.1, size * 0.34, palette.accent, palette.base, definition.accent, palette.base)}
    </g>
  `;
}

function renderFlowersScene(ctx, definition) {
  const palette = scenePalette(definition.category, definition.mood);
  const size = unit(ctx, ctx.kind === "effect" ? 0.18 : 0.22);
  const titleY = percentY(ctx, ctx.kind === "effect" ? 0.2 : 0.18);
  const accentY = percentY(ctx, ctx.kind === "effect" ? 0.76 : 0.8);

  const motif = (() => {
    switch (definition.mood) {
      case "bloom":
      case "soft":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite, wink-hover-bob 1.4s ease-in-out infinite 0.7s;">${flower(
          ctx.centerX,
          ctx.centerY,
          size * 0.74,
          {
            center: palette.flash,
            petal: palette.accent,
            stroke: palette.base,
          },
          8
        )}</g>`;
      case "petals":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${flower(ctx.centerX, ctx.centerY, size * 0.62, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            })}
          </g>
        `;
      case "bouquet":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite, wink-hover-bob 1.34s ease-in-out infinite 0.7s;">${bouquet(
          ctx.centerX,
          ctx.centerY,
          size * 2.1,
          {
            blue: palette.extra,
            pink: palette.accent,
            ribbon: palette.flash,
            stroke: palette.base,
            sun: "#ffd96a",
            wrap: palette.soft,
            yellow: "#ffe88f",
          }
        )}</g>`;
      case "orchid":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${glowCircle(ctx.centerX, ctx.centerY, size * 1.08, palette.extra, 0.18)}
            ${flower(ctx.centerX, ctx.centerY, size * 0.78, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            }, 5)}
          </g>
        `;
      case "crown":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${flower(ctx.centerX - size * 0.54, ctx.centerY + size * 0.18, size * 0.32, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            }, 7)}
            ${flower(ctx.centerX, ctx.centerY - size * 0.18, size * 0.46, {
              center: palette.flash,
              petal: palette.soft,
              stroke: palette.base,
            }, 8)}
            ${flower(ctx.centerX + size * 0.54, ctx.centerY + size * 0.18, size * 0.32, {
              center: palette.flash,
              petal: palette.extra,
              stroke: palette.base,
            }, 7)}
          </g>
        `;
      case "halo":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${flower(ctx.centerX, ctx.centerY, size * 0.62, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            }, 8)}
            ${Array.from({ length: 8 }, (_, index) => {
              const angle = index * 45;
              const haloX = polarX(ctx.centerX, size * 0.98, angle);
              const haloY = polarY(ctx.centerY, size * 0.98, angle);
              return sparkle(haloX, haloY, size * 0.14, index % 2 === 0 ? palette.extra : palette.soft, palette.flash);
            }).join("")}
          </g>
        `;
      case "ribbon":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${bouquet(ctx.centerX, ctx.centerY - size * 0.02, size * 1.94, {
              blue: palette.extra,
              pink: palette.accent,
              ribbon: palette.flash,
              stroke: palette.base,
              sun: "#ffe17d",
              wrap: palette.soft,
              yellow: "#fff0a5",
            })}
            <path d="M ${ctx.centerX - size * 0.22} ${ctx.centerY + size * 0.44} Q ${ctx.centerX - size * 0.58} ${ctx.centerY + size * 0.88}, ${
              ctx.centerX - size * 0.18
            } ${ctx.centerY + size * 1.1}" fill="none" stroke="${palette.flash}" stroke-width="${Math.max(5, size * 0.05)}" stroke-linecap="round" />
            <path d="M ${ctx.centerX + size * 0.22} ${ctx.centerY + size * 0.44} Q ${ctx.centerX + size * 0.58} ${ctx.centerY + size * 0.88}, ${
              ctx.centerX + size * 0.18
            } ${ctx.centerY + size * 1.1}" fill="none" stroke="${palette.extra}" stroke-width="${Math.max(5, size * 0.05)}" stroke-linecap="round" />
          </g>
        `;
      case "fanfare":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${flower(ctx.centerX - size * 0.52, ctx.centerY + size * 0.12, size * 0.34, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            }, 6)}
            ${flower(ctx.centerX + size * 0.52, ctx.centerY + size * 0.12, size * 0.34, {
              center: palette.flash,
              petal: palette.extra,
              stroke: palette.base,
            }, 6)}
            ${sparkle(ctx.centerX, ctx.centerY - size * 0.42, size * 0.32, palette.flash, palette.soft)}
            ${pillLabel(ctx.centerX, ctx.centerY + size * 0.56, size * 1.84, size * 0.34, palette.base, palette.accent, "LUXE", palette.soft)}
          </g>
        `;
      case "rose":
        return `<g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite, wink-hover-bob 1.32s ease-in-out infinite 0.7s;">${rose(
          ctx.centerX,
          ctx.centerY,
          size * 0.72,
          {
            inner: palette.accent,
            outer: palette.base,
            stroke: palette.soft,
          }
        )}</g>`;
      case "spring":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${flower(ctx.centerX - size * 0.54, ctx.centerY + size * 0.1, size * 0.34, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            })}
            ${flower(ctx.centerX, ctx.centerY - size * 0.14, size * 0.42, {
              center: palette.flash,
              petal: palette.extra,
              stroke: palette.base,
            })}
            ${flower(ctx.centerX + size * 0.56, ctx.centerY + size * 0.08, size * 0.34, {
              center: palette.flash,
              petal: "#ffc4dd",
              stroke: palette.base,
            })}
            <path d="M ${ctx.centerX - size * 0.76} ${ctx.centerY + size * 0.48} Q ${ctx.centerX} ${ctx.centerY + size * 0.14}, ${
              ctx.centerX + size * 0.76
            } ${ctx.centerY + size * 0.48}" fill="none" stroke="#50b267" stroke-width="${Math.max(
              4,
              size * 0.05
            )}" stroke-linecap="round" />
          </g>
        `;
      case "heart":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-pop ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            <path d="${heartPath(ctx.centerX, ctx.centerY, size * 1.44, size * 1.28)}" fill="${palette.accent}" stroke="${palette.base}" stroke-width="${Math.max(
              4,
              size * 0.05
            )}" />
            ${flower(ctx.centerX, ctx.centerY + size * 0.08, size * 0.22, {
              center: palette.flash,
              petal: palette.soft,
              stroke: palette.base,
            })}
          </g>
        `;
      case "sparkle":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-rise ${ctx.loopSeconds}s cubic-bezier(0.2,0.9,0.24,1) infinite;">
            ${flower(ctx.centerX, ctx.centerY, size * 0.64, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            })}
            ${sparkle(ctx.centerX, ctx.centerY - size * 0.94, size * 0.2, palette.extra, palette.soft)}
          </g>
        `;
      case "confetti":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${pillLabel(ctx.centerX, ctx.centerY - size * 0.14, size * 2.16, size * 0.42, palette.base, palette.accent, "FLORAL", palette.soft)}
            ${flower(ctx.centerX, ctx.centerY + size * 0.54, size * 0.28, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            })}
          </g>
        `;
      case "mega":
        return `
          <g style="transform-origin:${ctx.centerX}px ${ctx.centerY}px; animation:wink-enter-spin ${ctx.loopSeconds}s cubic-bezier(0.2,0.88,0.24,1) infinite;">
            ${flower(ctx.centerX - size * 0.42, ctx.centerY + size * 0.06, size * 0.28, {
              center: palette.flash,
              petal: palette.accent,
              stroke: palette.base,
            })}
            ${flower(ctx.centerX + size * 0.42, ctx.centerY + size * 0.06, size * 0.28, {
              center: palette.flash,
              petal: palette.extra,
              stroke: palette.base,
            })}
            ${flower(ctx.centerX, ctx.centerY - size * 0.18, size * 0.38, {
              center: palette.flash,
              petal: palette.soft,
              stroke: palette.base,
            })}
          </g>
        `;
      default:
        return "";
    }
  })();

  const accents =
    definition.mood === "petals"
      ? fallGroup(ctx, {
          colors: [palette.accent, palette.soft, palette.extra],
          columns: 11,
          shape: "petal",
          top: percentY(ctx, 0.16),
          travelY: ctx.height * 0.56,
        })
      : burstGroup(ctx, {
          colors: [palette.accent, palette.flash, palette.extra, palette.soft],
          count: 15,
          distance: unit(ctx, 0.27),
          shape:
            definition.mood === "bouquet" ||
            definition.mood === "spring" ||
            definition.mood === "crown" ||
            definition.mood === "ribbon" ||
            definition.mood === "fanfare"
              ? "petal"
              : "star",
          size: unit(ctx, 0.016),
        });

  return `
    ${outlineText(definition.title, ctx.centerX, titleY, size * 0.36, palette.soft, palette.base)}
    ${motif}
    ${impactRing(ctx, palette.flash, size * 1.08)}
    ${twinkleGroup(ctx, { colors: [palette.soft, palette.accent, palette.extra] })}
    ${accents}
    <g style="transform-origin:${ctx.centerX}px ${accentY}px; animation:wink-finale ${ctx.loopSeconds}s ease-out infinite;">
      ${pillLabel(ctx.centerX, accentY, size * 2.04, size * 0.34, palette.accent, palette.base, definition.accent, palette.base)}
    </g>
  `;
}

function renderScene(ctx, definition) {
  switch (definition.category) {
    case "Countdown":
      return renderCountdownScene(ctx, definition);
    case "Happy Birthday":
      return renderBirthdayScene(ctx, definition);
    case "Thumbs Up":
      return renderThumbsScene(ctx, definition);
    case "Leprechaun":
      return renderLeprechaunScene(ctx, definition);
    case "Flowers":
      return renderFlowersScene(ctx, definition);
    case "Fireworks":
      return renderFireworksScene(ctx, definition);
    default:
      throw new Error(`Unsupported category "${definition.category}".`);
  }
}

function renderSvg(definition) {
  const ctx = createContext(definition);
  const body = renderScene(ctx, definition);
  const name = definition.name ?? titleFromId(definition.id);

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${ctx.width}" height="${ctx.height}" viewBox="0 0 ${ctx.width} ${
    ctx.height
  }" preserveAspectRatio="xMidYMid meet" data-wink-name="${escapeXml(name)}" data-wink-category="${escapeXml(
    definition.category
  )}" data-wink-duration="${definition.durationMs}ms" aria-label="${escapeXml(name)}">
  <style>${LOOP_STYLE}${FIREWORK_STAGE_STYLE}</style>
  ${body}
</svg>
`;
}

async function updateEffectMetadata(effectVariants) {
  const metadataPath = path.join(PROJECT_ROOT, "public", "winks", "effect", "metadata.json");
  const existing = JSON.parse(await fs.readFile(metadataPath, "utf8"));
  const nextIds = new Set(effectVariants.map((variant) => variant.id));
  const retiredEffectIds = new Set(
    RETIRED_LIBRARY_VARIANTS.filter((variant) => variant.kind === "effect").map((variant) => variant.id)
  );
  const preserved = Array.isArray(existing.effects)
    ? existing.effects.filter((entry) => !nextIds.has(entry.id) && !retiredEffectIds.has(entry.id))
    : [];
  const nextEntries = effectVariants
    .map((variant) => ({
      aspectRatio: "16:9",
      category: variant.category,
      durationMs: variant.durationMs,
      format: "svg",
      height: 1080,
      id: variant.id,
      name: variant.name ?? titleFromId(variant.id),
      safeArea: "centered",
      transparent: true,
      type: "effect",
      width: 1920,
    }))
    .sort((left, right) => sortIds(left.id, right.id));

  existing.effects = [...preserved, ...nextEntries].sort((left, right) => sortIds(left.id, right.id));
  await fs.writeFile(metadataPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
}

async function main() {
  await cleanupRetiredVariants(RETIRED_LIBRARY_VARIANTS);

  const grouped = new Map();
  for (const variant of VARIANTS) {
    if (!grouped.has(variant.kind)) {
      grouped.set(variant.kind, []);
    }
    grouped.get(variant.kind).push(variant);
  }

  for (const [kind, variants] of grouped.entries()) {
    const paths = await ensureWinkStructure(kind);
    const writtenSvgPaths = [];

    await Promise.all(
      variants.map(async (variant) => {
        const targetPath = path.join(paths.svgDir, `${variant.id}.svg`);
        writtenSvgPaths.push(targetPath);
        await fs.writeFile(targetPath, renderSvg(variant), "utf8");
      })
    );

    await normalizeWinkSvgFiles(kind, writtenSvgPaths);
  }

  await updateEffectMetadata(VARIANTS.filter((variant) => variant.kind === "effect"));

  console.log(
    `Generated ${VARIANTS.length} SVG wink files across ${grouped.get("effect").length} effect entries and ${grouped.get("chat").length} chat entries.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
