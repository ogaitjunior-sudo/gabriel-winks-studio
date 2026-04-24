import type { ComponentType } from "react";

import { FireworksBurst } from "@/effects/fireworks/FireworksBurst";
import { FireworksGrandFinale } from "@/effects/fireworks/FireworksGrandFinale";
import { FireworksCenterBlast } from "@/effects/fireworks/FireworksCenterBlast";
import { FireworksSparkleRain } from "@/effects/fireworks/FireworksSparkleRain";
import { FireworksRing } from "@/effects/fireworks/FireworksRing";
import { FireworksComets } from "@/effects/fireworks/FireworksComets";
import { FireworksDoubleBloom } from "@/effects/fireworks/FireworksDoubleBloom";
import { FireworksSkyShow } from "@/effects/fireworks/FireworksSkyShow";
import { FireworksWillow } from "@/effects/fireworks/FireworksWillow";
import { FireworksHeart } from "@/effects/fireworks/FireworksHeart";
import { FireworksChrysanthemum } from "@/effects/fireworks/FireworksChrysanthemum";
import { FireworksCascade } from "@/effects/fireworks/FireworksCascade";
import { FireworksDoubleRing } from "@/effects/fireworks/FireworksDoubleRing";
import { FireworksPalmTree } from "@/effects/fireworks/FireworksPalmTree";
import { FireworksDiamond } from "@/effects/fireworks/FireworksDiamond";
import { FireworksFanSweep } from "@/effects/fireworks/FireworksFanSweep";
import { FireworksHaloPulse } from "@/effects/fireworks/FireworksHaloPulse";
import { FireworksPrismBurst } from "@/effects/fireworks/FireworksPrismBurst";
import { FireworksEpicGrandFinale } from "@/effects/fireworks/FireworksEpicGrandFinale";
import { FireworksTripleBuildUpBlast } from "@/effects/fireworks/FireworksTripleBuildUpBlast";
import { FireworksGoldenCrownFinale } from "@/effects/fireworks/FireworksGoldenCrownFinale";
import { FireworksSpiralChargeExplosion } from "@/effects/fireworks/FireworksSpiralChargeExplosion";
import { FireworksRisingCometFinale } from "@/effects/fireworks/FireworksRisingCometFinale";
import { FireworksStarburstOverload } from "@/effects/fireworks/FireworksStarburstOverload";
import { FireworksRingShockwave } from "@/effects/fireworks/FireworksRingShockwave";
import { FireworksCascadeFinale } from "@/effects/fireworks/FireworksCascadeFinale";
import { FireworksMeteorImpact } from "@/effects/fireworks/FireworksMeteorImpact";
import { FireworksUltimateCelebrationBlast } from "@/effects/fireworks/FireworksUltimateCelebrationBlast";

import { GoldStarsPop } from "@/effects/goldStars/GoldStarsPop";
import { GoldStarsTrail } from "@/effects/goldStars/GoldStarsTrail";
import { GoldStarsTwinkle } from "@/effects/goldStars/GoldStarsTwinkle";
import { GoldStarsSwirl } from "@/effects/goldStars/GoldStarsSwirl";
import { GoldStarsShower } from "@/effects/goldStars/GoldStarsShower";
import { GoldStarsBurst } from "@/effects/goldStars/GoldStarsBurst";
import { GoldStarsConstellation } from "@/effects/goldStars/GoldStarsConstellation";
import { GoldStarsRain } from "@/effects/goldStars/GoldStarsRain";
import { GoldStarsHalo } from "@/effects/goldStars/GoldStarsHalo";
import { GoldStarsBigStar } from "@/effects/goldStars/GoldStarsBigStar";
import { GoldStarsFountain } from "@/effects/goldStars/GoldStarsFountain";
import { GoldStarsRibbon } from "@/effects/goldStars/GoldStarsRibbon";
import { GoldStarsExplode } from "@/effects/goldStars/GoldStarsExplode";
import { GoldStarsGalaxy } from "@/effects/goldStars/GoldStarsGalaxy";
import { GoldStarsCrown } from "@/effects/goldStars/GoldStarsCrown";
import { GoldStarsAurora } from "@/effects/goldStars/GoldStarsAurora";
import { GoldStarsPinwheel } from "@/effects/goldStars/GoldStarsPinwheel";
import { GoldStarsCometArc } from "@/effects/goldStars/GoldStarsCometArc";
import { GoldStarsPopDeluxe } from "@/effects/goldStars/GoldStarsPopDeluxe";
import { GoldStarsRadiantBurst } from "@/effects/goldStars/GoldStarsRadiantBurst";
import { GoldStarsTwinkleField } from "@/effects/goldStars/GoldStarsTwinkleField";
import { GoldStarsTrailArc } from "@/effects/goldStars/GoldStarsTrailArc";
import { GoldStarsSwirlCrown } from "@/effects/goldStars/GoldStarsSwirlCrown";
import { GoldStarsShowerPremium } from "@/effects/goldStars/GoldStarsShowerPremium";
import { GoldStarsHaloRing } from "@/effects/goldStars/GoldStarsHaloRing";
import { GoldStarsOrbitShine } from "@/effects/goldStars/GoldStarsOrbitShine";
import { GoldStarsExplosionBloom } from "@/effects/goldStars/GoldStarsExplosionBloom";
import { GoldStarsSpiralRain } from "@/effects/goldStars/GoldStarsSpiralRain";
import { GoldStarsMagicCrossSpark } from "@/effects/goldStars/GoldStarsMagicCrossSpark";
import { GoldStarsWaveSweep } from "@/effects/goldStars/GoldStarsWaveSweep";
import { GoldStarsHeartOfLight } from "@/effects/goldStars/GoldStarsHeartOfLight";
import { GoldStarsGrandFinale } from "@/effects/goldStars/GoldStarsGrandFinale";
import { GoldStarsRibbonTrail } from "@/effects/goldStars/GoldStarsRibbonTrail";
import { GoldStarsMirrorBurst } from "@/effects/goldStars/GoldStarsMirrorBurst";
import { GoldStarsFloatingDust } from "@/effects/goldStars/GoldStarsFloatingDust";
import { GoldStarsSunflarePulse } from "@/effects/goldStars/GoldStarsSunflarePulse";
import { GoldStarsCelebrationCascade } from "@/effects/goldStars/GoldStarsCelebrationCascade";
import { GoldStarsEternalGlow } from "@/effects/goldStars/GoldStarsEternalGlow";

import { BouncingBingoBallsClassic } from "@/effects/bingoBalls/BouncingBingoBallsClassic";
import { BingoBallsBounceIn } from "@/effects/bingoBalls/BingoBallsBounceIn";
import { BingoBallsScatter } from "@/effects/bingoBalls/BingoBallsScatter";
import { BingoBallsPopUp } from "@/effects/bingoBalls/BingoBallsPopUp";
import { BingoBallsOrbit } from "@/effects/bingoBalls/BingoBallsOrbit";
import { BingoBallsCelebration } from "@/effects/bingoBalls/BingoBallsCelebration";
import { BingoBallsWave } from "@/effects/bingoBalls/BingoBallsWave";
import { BingoBallsSpin } from "@/effects/bingoBalls/BingoBallsSpin";
import { BingoBallsConfetti } from "@/effects/bingoBalls/BingoBallsConfetti";
import { BingoBallsDrumroll } from "@/effects/bingoBalls/BingoBallsDrumroll";
import { BingoBallsJackpot } from "@/effects/bingoBalls/BingoBallsJackpot";
import { BingoBallsRoulette } from "@/effects/bingoBalls/BingoBallsRoulette";
import { BingoBallsSlot } from "@/effects/bingoBalls/BingoBallsSlot";
import { BingoBallsRain } from "@/effects/bingoBalls/BingoBallsRain";
import { BingoBallsTilt } from "@/effects/bingoBalls/BingoBallsTilt";
import { BingoBallsParade } from "@/effects/bingoBalls/BingoBallsParade";
import { BingoBallsSpotlight } from "@/effects/bingoBalls/BingoBallsSpotlight";
import { BingoBallsCrownArc } from "@/effects/bingoBalls/BingoBallsCrownArc";
import { BingoBallsCollisionBurst } from "@/effects/bingoBalls/BingoBallsCollisionBurst";
import { BingoBallsBounceStorm } from "@/effects/bingoBalls/BingoBallsBounceStorm";
import { BingoBallsSpiralCollapse } from "@/effects/bingoBalls/BingoBallsSpiralCollapse";
import { BingoBallsExplosionToFormation } from "@/effects/bingoBalls/BingoBallsExplosionToFormation";
import { BingoBallsOrbitImpact } from "@/effects/bingoBalls/BingoBallsOrbitImpact";
import { BingoBallsPopChain } from "@/effects/bingoBalls/BingoBallsPopChain";
import { BingoBallsRocketDrop } from "@/effects/bingoBalls/BingoBallsRocketDrop";
import { BingoBallsScatterRing } from "@/effects/bingoBalls/BingoBallsScatterRing";
import { BingoBallsPinballChaos } from "@/effects/bingoBalls/BingoBallsPinballChaos";
import { BingoBallsGrandCelebration } from "@/effects/bingoBalls/BingoBallsGrandCelebration";
import { BingoBallsCountdownBounce } from "@/effects/bingoBalls/BingoBallsCountdownBounce";
import { BingoBallsSpiralSnap } from "@/effects/bingoBalls/BingoBallsSpiralSnap";
import { BingoBallsCollisionExplosion } from "@/effects/bingoBalls/BingoBallsCollisionExplosion";
import { BingoBallsWaveSequence } from "@/effects/bingoBalls/BingoBallsWaveSequence";
import { BingoBallsJackpotShimmer } from "@/effects/bingoBalls/BingoBallsJackpotShimmer";
import { ConfettiExplosionBurst } from "@/effects/confetti/ConfettiExplosionBurst";
import { ConfettiCannonLeftRight } from "@/effects/confetti/ConfettiCannonLeftRight";
import { ConfettiRainCelebration } from "@/effects/confetti/ConfettiRainCelebration";
import { ConfettiSpiralBlast } from "@/effects/confetti/ConfettiSpiralBlast";
import { ConfettiPopParty } from "@/effects/confetti/ConfettiPopParty";
import { ConfettiGrandFinale } from "@/effects/confetti/ConfettiGrandFinale";
import { ConfettiWaveSweep } from "@/effects/confetti/ConfettiWaveSweep";
import { ConfettiHeartBurst } from "@/effects/confetti/ConfettiHeartBurst";
import { ConfettiStarMix } from "@/effects/confetti/ConfettiStarMix";
import { ConfettiVictoryShower } from "@/effects/confetti/ConfettiVictoryShower";
import { ConfettiFireworkBurst } from "@/effects/confetti/ConfettiFireworkBurst";
import { ConfettiMegaExplosion } from "@/effects/confetti/ConfettiMegaExplosion";
import { ConfettiDoubleCannonBlast } from "@/effects/confetti/ConfettiDoubleCannonBlast";
import { ConfettiTriplePopCelebration } from "@/effects/confetti/ConfettiTriplePopCelebration";
import { ConfettiGrandFinaleStorm } from "@/effects/confetti/ConfettiGrandFinaleStorm";
import { ConfettiSpiralFirework } from "@/effects/confetti/ConfettiSpiralFirework";
import { ConfettiRainExplosion } from "@/effects/confetti/ConfettiRainExplosion";
import { ConfettiWaveBlast } from "@/effects/confetti/ConfettiWaveBlast";
import { ConfettiVolcanoBurst } from "@/effects/confetti/ConfettiVolcanoBurst";
import { ConfettiStarCelebration } from "@/effects/confetti/ConfettiStarCelebration";
import { ConfettiRibbonStorm } from "@/effects/confetti/ConfettiRibbonStorm";
import { ConfettiGalaxySwirl } from "@/effects/confetti/ConfettiGalaxySwirl";
import { ConfettiHeartFestival } from "@/effects/confetti/ConfettiHeartFestival";
import { ConfettiVictoryBlast } from "@/effects/confetti/ConfettiVictoryBlast";
import { ConfettiCelebrationTunnel } from "@/effects/confetti/ConfettiCelebrationTunnel";
import { ConfettiShockwaveRing } from "@/effects/confetti/ConfettiShockwaveRing";
import { ConfettiFirecrackerChain } from "@/effects/confetti/ConfettiFirecrackerChain";
import { ConfettiColorBloom } from "@/effects/confetti/ConfettiColorBloom";
import { ConfettiCarnivalBlast } from "@/effects/confetti/ConfettiCarnivalBlast";
import { ConfettiUltimatePartyFinale } from "@/effects/confetti/ConfettiUltimatePartyFinale";

export type EffectCategory = "Fireworks" | "Gold Stars" | "Bouncing Bingo Balls" | "Confetti";

export interface EffectMeta {
  id: string;
  name: string;
  category: EffectCategory;
  duration: string;
  Component: ComponentType<{ playing: boolean }>;
}

export const EFFECTS: EffectMeta[] = [
  // Fireworks
  { id: "fw-burst",    name: "Fireworks Burst",         category: "Fireworks", duration: "2.4s", Component: FireworksBurst },
  { id: "fw-finale",   name: "Fireworks Grand Finale",  category: "Fireworks", duration: "3.6s", Component: FireworksGrandFinale },
  { id: "fw-center",   name: "Fireworks Center Blast",  category: "Fireworks", duration: "2.8s", Component: FireworksCenterBlast },
  { id: "fw-sparkle",  name: "Fireworks Sparkle Rain",  category: "Fireworks", duration: "3.2s", Component: FireworksSparkleRain },
  { id: "fw-ring",     name: "Fireworks Ring",          category: "Fireworks", duration: "2.6s", Component: FireworksRing },
  { id: "fw-comets",   name: "Fireworks Comets",        category: "Fireworks", duration: "3.0s", Component: FireworksComets },
  { id: "fw-double",   name: "Fireworks Double Bloom",  category: "Fireworks", duration: "2.6s", Component: FireworksDoubleBloom },
  { id: "fw-sky",      name: "Fireworks Sky Show",      category: "Fireworks", duration: "3.0s", Component: FireworksSkyShow },
  { id: "fw-willow",   name: "Fireworks Willow",        category: "Fireworks", duration: "3.2s", Component: FireworksWillow },
  { id: "fw-heart",    name: "Fireworks Heart",         category: "Fireworks", duration: "2.8s", Component: FireworksHeart },
  { id: "fw-chrys",    name: "Fireworks Chrysanthemum", category: "Fireworks", duration: "3.0s", Component: FireworksChrysanthemum },
  { id: "fw-cascade",  name: "Fireworks Cascade",       category: "Fireworks", duration: "2.6s", Component: FireworksCascade },
  { id: "fw-dring",    name: "Fireworks Double Ring",   category: "Fireworks", duration: "2.8s", Component: FireworksDoubleRing },
  { id: "fw-palm",     name: "Fireworks Palm Tree",     category: "Fireworks", duration: "3.0s", Component: FireworksPalmTree },
  { id: "fw-diamond",  name: "Fireworks Diamond",       category: "Fireworks", duration: "2.6s", Component: FireworksDiamond },
  { id: "fw-fansweep", name: "Fireworks Fan Sweep",     category: "Fireworks", duration: "3.4s", Component: FireworksFanSweep },
  { id: "fw-halo",     name: "Fireworks Halo Pulse",    category: "Fireworks", duration: "3.2s", Component: FireworksHaloPulse },
  { id: "fw-prism",    name: "Fireworks Prism Burst",   category: "Fireworks", duration: "3.0s", Component: FireworksPrismBurst },
  { id: "fw-epic",     name: "Fireworks Epic Grand Finale", category: "Fireworks", duration: "4.2s", Component: FireworksEpicGrandFinale },
  { id: "fw-triple",   name: "Fireworks Triple Build-Up Blast", category: "Fireworks", duration: "4.0s", Component: FireworksTripleBuildUpBlast },
  { id: "fw-crownf",   name: "Fireworks Golden Crown Finale", category: "Fireworks", duration: "4.2s", Component: FireworksGoldenCrownFinale },
  { id: "fw-spiralc",  name: "Fireworks Spiral Charge Explosion", category: "Fireworks", duration: "3.8s", Component: FireworksSpiralChargeExplosion },
  { id: "fw-risingc",  name: "Fireworks Rising Comet Finale", category: "Fireworks", duration: "4.0s", Component: FireworksRisingCometFinale },
  { id: "fw-starover", name: "Fireworks Starburst Overload", category: "Fireworks", duration: "3.8s", Component: FireworksStarburstOverload },
  { id: "fw-shock",    name: "Fireworks Ring Shockwave", category: "Fireworks", duration: "3.9s", Component: FireworksRingShockwave },
  { id: "fw-cascadef", name: "Fireworks Cascade Finale", category: "Fireworks", duration: "4.4s", Component: FireworksCascadeFinale },
  { id: "fw-meteor",   name: "Fireworks Meteor Impact", category: "Fireworks", duration: "4.0s", Component: FireworksMeteorImpact },
  { id: "fw-ultimate", name: "Fireworks Ultimate Celebration Blast", category: "Fireworks", duration: "4.8s", Component: FireworksUltimateCelebrationBlast },

  // Gold Stars
  { id: "gs-pop",      name: "Gold Stars Pop",          category: "Gold Stars", duration: "2.4s", Component: GoldStarsPop },
  { id: "gs-trail",    name: "Gold Stars Trail",        category: "Gold Stars", duration: "3.0s", Component: GoldStarsTrail },
  { id: "gs-twinkle",  name: "Gold Stars Twinkle",      category: "Gold Stars", duration: "2.8s", Component: GoldStarsTwinkle },
  { id: "gs-swirl",    name: "Gold Stars Swirl",        category: "Gold Stars", duration: "3.2s", Component: GoldStarsSwirl },
  { id: "gs-shower",   name: "Gold Stars Shower",       category: "Gold Stars", duration: "3.4s", Component: GoldStarsShower },
  { id: "gs-burst",    name: "Gold Stars Burst",        category: "Gold Stars", duration: "2.6s", Component: GoldStarsBurst },
  { id: "gs-const",    name: "Gold Stars Constellation",category: "Gold Stars", duration: "3.0s", Component: GoldStarsConstellation },
  { id: "gs-rain",     name: "Gold Stars Rain",         category: "Gold Stars", duration: "3.0s", Component: GoldStarsRain },
  { id: "gs-halo",     name: "Gold Stars Halo",         category: "Gold Stars", duration: "2.4s", Component: GoldStarsHalo },
  { id: "gs-big",      name: "Gold Stars Big Star",     category: "Gold Stars", duration: "2.8s", Component: GoldStarsBigStar },
  { id: "gs-fountain", name: "Gold Stars Fountain",     category: "Gold Stars", duration: "2.4s", Component: GoldStarsFountain },
  { id: "gs-ribbon",   name: "Gold Stars Ribbon",       category: "Gold Stars", duration: "3.2s", Component: GoldStarsRibbon },
  { id: "gs-explode",  name: "Gold Stars Explode",      category: "Gold Stars", duration: "2.6s", Component: GoldStarsExplode },
  { id: "gs-galaxy",   name: "Gold Stars Galaxy",       category: "Gold Stars", duration: "6.0s", Component: GoldStarsGalaxy },
  { id: "gs-crown",    name: "Gold Stars Crown",        category: "Gold Stars", duration: "2.8s", Component: GoldStarsCrown },
  { id: "gs-aurora",   name: "Gold Stars Aurora",       category: "Gold Stars", duration: "3.8s", Component: GoldStarsAurora },
  { id: "gs-pinwheel", name: "Gold Stars Pinwheel",     category: "Gold Stars", duration: "3.4s", Component: GoldStarsPinwheel },
  { id: "gs-cometarc", name: "Gold Stars Comet Arc",    category: "Gold Stars", duration: "3.2s", Component: GoldStarsCometArc },
  { id: "gs-popdeluxe", name: "Gold Stars Pop Deluxe",  category: "Gold Stars", duration: "3.0s", Component: GoldStarsPopDeluxe },
  { id: "gs-radiant",  name: "Gold Stars Radiant Burst", category: "Gold Stars", duration: "3.2s", Component: GoldStarsRadiantBurst },
  { id: "gs-field",    name: "Gold Stars Twinkle Field", category: "Gold Stars", duration: "2.8s", Component: GoldStarsTwinkleField },
  { id: "gs-trailarc", name: "Gold Stars Trail Arc",    category: "Gold Stars", duration: "3.2s", Component: GoldStarsTrailArc },
  { id: "gs-scrown",   name: "Gold Stars Swirl Crown",  category: "Gold Stars", duration: "3.3s", Component: GoldStarsSwirlCrown },
  { id: "gs-showerp",  name: "Gold Stars Shower Premium", category: "Gold Stars", duration: "3.2s", Component: GoldStarsShowerPremium },
  { id: "gs-halo-ring", name: "Gold Stars Halo Ring",   category: "Gold Stars", duration: "3.4s", Component: GoldStarsHaloRing },
  { id: "gs-orbitshine", name: "Gold Stars Orbit Shine", category: "Gold Stars", duration: "3.4s", Component: GoldStarsOrbitShine },
  { id: "gs-bloom",    name: "Gold Stars Explosion Bloom", category: "Gold Stars", duration: "3.1s", Component: GoldStarsExplosionBloom },
  { id: "gs-spiralrain", name: "Gold Stars Spiral Rain", category: "Gold Stars", duration: "3.4s", Component: GoldStarsSpiralRain },
  { id: "gs-crossspark", name: "Gold Stars Magic Cross Spark", category: "Gold Stars", duration: "3.0s", Component: GoldStarsMagicCrossSpark },
  { id: "gs-wavesweep", name: "Gold Stars Wave Sweep",  category: "Gold Stars", duration: "3.2s", Component: GoldStarsWaveSweep },
  { id: "gs-heartlight", name: "Gold Stars Heart of Light", category: "Gold Stars", duration: "3.4s", Component: GoldStarsHeartOfLight },
  { id: "gs-grandfinale", name: "Gold Stars Grand Finale", category: "Gold Stars", duration: "3.8s", Component: GoldStarsGrandFinale },
  { id: "gs-ribbontrail", name: "Gold Stars Ribbon Trail", category: "Gold Stars", duration: "3.4s", Component: GoldStarsRibbonTrail },
  { id: "gs-mirror",   name: "Gold Stars Mirror Burst", category: "Gold Stars", duration: "3.2s", Component: GoldStarsMirrorBurst },
  { id: "gs-dust",     name: "Gold Stars Floating Dust", category: "Gold Stars", duration: "3.2s", Component: GoldStarsFloatingDust },
  { id: "gs-sunflare", name: "Gold Stars Sunflare Pulse", category: "Gold Stars", duration: "3.1s", Component: GoldStarsSunflarePulse },
  { id: "gs-cascade",  name: "Gold Stars Celebration Cascade", category: "Gold Stars", duration: "3.5s", Component: GoldStarsCelebrationCascade },
  { id: "gs-eternal",  name: "Gold Stars Eternal Glow", category: "Gold Stars", duration: "3.6s", Component: GoldStarsEternalGlow },

  // Bingo
  { id: "bb-classic",  name: "Bouncing Bingo Balls Classic", category: "Bouncing Bingo Balls", duration: "3.0s", Component: BouncingBingoBallsClassic },
  { id: "bb-bouncein", name: "Bingo Balls Bounce In",   category: "Bouncing Bingo Balls", duration: "2.8s", Component: BingoBallsBounceIn },
  { id: "bb-scatter",  name: "Bingo Balls Scatter",     category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsScatter },
  { id: "bb-popup",    name: "Bingo Balls Pop Up",      category: "Bouncing Bingo Balls", duration: "2.6s", Component: BingoBallsPopUp },
  { id: "bb-orbit",    name: "Bingo Balls Orbit",       category: "Bouncing Bingo Balls", duration: "3.6s", Component: BingoBallsOrbit },
  { id: "bb-celebr",   name: "Bingo Balls Celebration", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsCelebration },
  { id: "bb-wave",     name: "Bingo Balls Wave",        category: "Bouncing Bingo Balls", duration: "1.4s", Component: BingoBallsWave },
  { id: "bb-spin",     name: "Bingo Balls Spin",        category: "Bouncing Bingo Balls", duration: "3.0s", Component: BingoBallsSpin },
  { id: "bb-confetti", name: "Bingo Balls Confetti",    category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsConfetti },
  { id: "bb-drumroll", name: "Bingo Balls Drumroll",    category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsDrumroll },
  { id: "bb-jackpot",  name: "Bingo Balls Jackpot",     category: "Bouncing Bingo Balls", duration: "2.4s", Component: BingoBallsJackpot },
  { id: "bb-roulette", name: "Bingo Balls Roulette",    category: "Bouncing Bingo Balls", duration: "7.0s", Component: BingoBallsRoulette },
  { id: "bb-slot",     name: "Bingo Balls Slot",        category: "Bouncing Bingo Balls", duration: "2.8s", Component: BingoBallsSlot },
  { id: "bb-rain",     name: "Bingo Balls Rain",        category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsRain },
  { id: "bb-tilt",     name: "Bingo Balls Tilt",        category: "Bouncing Bingo Balls", duration: "2.0s", Component: BingoBallsTilt },
  { id: "bb-parade",   name: "Bingo Balls Parade",      category: "Bouncing Bingo Balls", duration: "2.4s", Component: BingoBallsParade },
  { id: "bb-spot",     name: "Bingo Balls Spotlight",   category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsSpotlight },
  { id: "bb-crown",    name: "Bingo Balls Crown Arc",   category: "Bouncing Bingo Balls", duration: "3.0s", Component: BingoBallsCrownArc },
  { id: "bb-collision",name: "Bingo Balls Collision Burst", category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsCollisionBurst },
  { id: "bb-storm",    name: "Bingo Balls Bounce Storm", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsBounceStorm },
  { id: "bb-spiral",   name: "Bingo Balls Spiral Collapse", category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsSpiralCollapse },
  { id: "bb-explodeform", name: "Bingo Balls Explosion to Formation", category: "Bouncing Bingo Balls", duration: "3.3s", Component: BingoBallsExplosionToFormation },
  { id: "bb-impact",   name: "Bingo Balls Orbit Impact", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsOrbitImpact },
  { id: "bb-popchain", name: "Bingo Balls Pop Chain",   category: "Bouncing Bingo Balls", duration: "3.2s", Component: BingoBallsPopChain },
  { id: "bb-rocket",   name: "Bingo Balls Rocket Drop", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsRocketDrop },
  { id: "bb-ring",     name: "Bingo Balls Scatter Ring", category: "Bouncing Bingo Balls", duration: "3.5s", Component: BingoBallsScatterRing },
  { id: "bb-pinball",  name: "Bingo Balls Pinball Chaos", category: "Bouncing Bingo Balls", duration: "3.3s", Component: BingoBallsPinballChaos },
  { id: "bb-grand",    name: "Bingo Balls Grand Celebration", category: "Bouncing Bingo Balls", duration: "3.8s", Component: BingoBallsGrandCelebration },
  { id: "bouncing-bingo-countdown", name: "Countdown Bounce Bingo", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsCountdownBounce },
  { id: "bouncing-bingo-spiral", name: "Spiral Bingo Balls", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsSpiralSnap },
  { id: "bouncing-bingo-collision", name: "Collision Explosion Bingo", category: "Bouncing Bingo Balls", duration: "3.3s", Component: BingoBallsCollisionExplosion },
  { id: "bouncing-bingo-wave", name: "Wave Bounce Bingo", category: "Bouncing Bingo Balls", duration: "3.0s", Component: BingoBallsWaveSequence },
  { id: "bouncing-bingo-jackpot", name: "Jackpot Bingo Balls", category: "Bouncing Bingo Balls", duration: "3.4s", Component: BingoBallsJackpotShimmer },

  // Confetti
  { id: "cf-explosion", name: "Confetti Explosion Burst", category: "Confetti", duration: "3.2s", Component: ConfettiExplosionBurst },
  { id: "cf-cannon",    name: "Confetti Cannon Left Right", category: "Confetti", duration: "3.6s", Component: ConfettiCannonLeftRight },
  { id: "cf-rain",      name: "Confetti Rain Celebration", category: "Confetti", duration: "3.4s", Component: ConfettiRainCelebration },
  { id: "cf-spiral",    name: "Confetti Spiral Blast", category: "Confetti", duration: "3.6s", Component: ConfettiSpiralBlast },
  { id: "cf-pop",       name: "Confetti Pop Party", category: "Confetti", duration: "3.8s", Component: ConfettiPopParty },
  { id: "cf-finale",    name: "Confetti Grand Finale", category: "Confetti", duration: "4.4s", Component: ConfettiGrandFinale },
  { id: "cf-wave",      name: "Confetti Wave Sweep", category: "Confetti", duration: "3.4s", Component: ConfettiWaveSweep },
  { id: "cf-heart",     name: "Confetti Heart Burst", category: "Confetti", duration: "3.6s", Component: ConfettiHeartBurst },
  { id: "cf-star",      name: "Confetti Star Mix", category: "Confetti", duration: "3.2s", Component: ConfettiStarMix },
  { id: "cf-victory",   name: "Confetti Victory Shower", category: "Confetti", duration: "4.0s", Component: ConfettiVictoryShower },
  { id: "cf-firework",  name: "Confetti Firework Burst", category: "Confetti", duration: "3.6s", Component: ConfettiFireworkBurst },
  { id: "cf-mega",      name: "Confetti Mega Explosion", category: "Confetti", duration: "4.0s", Component: ConfettiMegaExplosion },
  { id: "cf-double",    name: "Confetti Double Cannon Blast", category: "Confetti", duration: "3.8s", Component: ConfettiDoubleCannonBlast },
  { id: "cf-triple",    name: "Confetti Triple Pop Celebration", category: "Confetti", duration: "3.6s", Component: ConfettiTriplePopCelebration },
  { id: "cf-storm",     name: "Confetti Grand Finale Storm", category: "Confetti", duration: "4.6s", Component: ConfettiGrandFinaleStorm },
  { id: "cf-spiralfw",  name: "Confetti Spiral Firework", category: "Confetti", duration: "3.8s", Component: ConfettiSpiralFirework },
  { id: "cf-rainx",     name: "Confetti Rain Explosion", category: "Confetti", duration: "4.0s", Component: ConfettiRainExplosion },
  { id: "cf-waveblast", name: "Confetti Wave Blast", category: "Confetti", duration: "3.8s", Component: ConfettiWaveBlast },
  { id: "cf-volcano",   name: "Confetti Volcano Burst", category: "Confetti", duration: "3.8s", Component: ConfettiVolcanoBurst },
  { id: "cf-starcel",   name: "Confetti Star Celebration", category: "Confetti", duration: "3.4s", Component: ConfettiStarCelebration },
  { id: "cf-ribbon",    name: "Confetti Ribbon Storm", category: "Confetti", duration: "3.8s", Component: ConfettiRibbonStorm },
  { id: "cf-galaxy",    name: "Confetti Galaxy Swirl", category: "Confetti", duration: "4.0s", Component: ConfettiGalaxySwirl },
  { id: "cf-heartfest", name: "Confetti Heart Festival", category: "Confetti", duration: "3.8s", Component: ConfettiHeartFestival },
  { id: "cf-victoryb",  name: "Confetti Victory Blast", category: "Confetti", duration: "4.0s", Component: ConfettiVictoryBlast },
  { id: "cf-tunnel",    name: "Confetti Celebration Tunnel", category: "Confetti", duration: "3.8s", Component: ConfettiCelebrationTunnel },
  { id: "cf-shockring", name: "Confetti Shockwave Ring", category: "Confetti", duration: "3.4s", Component: ConfettiShockwaveRing },
  { id: "cf-firechain", name: "Confetti Firecracker Chain", category: "Confetti", duration: "4.0s", Component: ConfettiFirecrackerChain },
  { id: "cf-bloom",     name: "Confetti Color Bloom", category: "Confetti", duration: "3.6s", Component: ConfettiColorBloom },
  { id: "cf-carnival",  name: "Confetti Carnival Blast", category: "Confetti", duration: "4.0s", Component: ConfettiCarnivalBlast },
  { id: "cf-ultimatep", name: "Confetti Ultimate Party Finale", category: "Confetti", duration: "4.8s", Component: ConfettiUltimatePartyFinale },
];

export const CATEGORY_COLORS: Record<EffectCategory, string> = {
  "Fireworks": "from-rose-500/20 to-amber-500/20 text-amber-300 border-amber-500/40",
  "Gold Stars": "from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/40",
  "Bouncing Bingo Balls": "from-sky-500/20 to-violet-500/20 text-sky-300 border-sky-500/40",
  "Confetti": "from-fuchsia-500/20 to-cyan-400/20 text-pink-200 border-fuchsia-400/40",
};
