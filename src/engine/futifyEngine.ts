import {
  NeatPillarId,
  NeatPillarData,
  IncomingWireItem
} from './nexusNeatEngine';
import { AMBIENT_BACKDROP_CATALOG } from './newsEmotionTheme';

export interface SpatialXRayReticle {
  id: string;
  code: '01' | '02' | '03';
  reticleLabel: string;
  xPercent: number;
  yPercent: number;
  leaderDir: 'up-right' | 'down-right' | 'up-left';
  probabilityScore: string;
  confidencePercent: number;
  impactMetric: string;
  horizonWindow: string;
  thunglishExplain: string;
  simpleEverydayMeaning: string;
  actorsInvolved: string;
}

export interface FutifyPosterCard {
  id: string;
  pillarId: NeatPillarId;
  categoryTag: string;
  headline: string;
  subHook: string;
  posterImageUrl: string;
  fallbackUnsplashUrl: string;
  timestampBadge: string;
  probabilityBadge: string;
  keyMetricBadge: string;
  isJustIn: boolean;
  pillarSnapshot: NeatPillarData;
}

export interface FutifySwimlaneRow {
  id: string;
  title: string;
  serifAccent: string;
  subtitle: string;
  cards: FutifyPosterCard[];
}

export const HERO_CONFIDENCE_BY_PILLAR: Record<
  NeatPillarId,
  {
    confidenceBadge: string;
    confidencePercent: number;
    serifHighlight: string;
  }
> = {
  MONEY: {
    confidenceBadge: '⚡ FUTIFY PREDICTION // 98% CONFIDENCE',
    confidencePercent: 98,
    serifHighlight: 'Sovereign Bullion Reset'
  },
  GEOPOLITICS: {
    confidenceBadge: '⚡ FUTIFY PREDICTION // 96% CONFIDENCE',
    confidencePercent: 96,
    serifHighlight: 'The Multi-Aligned Corridor'
  },
  DEFENCE: {
    confidenceBadge: '⚡ FUTIFY PREDICTION // 99% CONFIDENCE',
    confidencePercent: 99,
    serifHighlight: 'Asymmetric Photonics Warfare'
  },
  AEROSPACE: {
    confidenceBadge: '⚡ FUTIFY PREDICTION // 95% CONFIDENCE',
    confidencePercent: 95,
    serifHighlight: 'Orbital Infrastructure Era'
  },
  TECH: {
    confidenceBadge: '⚡ FUTIFY PREDICTION // 97% CONFIDENCE',
    confidencePercent: 97,
    serifHighlight: 'Zero-Copy Silicon Horizon'
  }
};

export const SPATIAL_XRAY_CATALOG: Record<
  NeatPillarId,
  [SpatialXRayReticle, SpatialXRayReticle, SpatialXRayReticle]
> = {
  MONEY: [
    {
      id: 'xray-money-01',
      code: '01',
      reticleLabel: '01 // U.S. TREASURY WALL',
      xPercent: 26,
      yPercent: 54,
      leaderDir: 'up-right',
      probabilityScore: '98% PROBABILITY',
      confidencePercent: 98,
      impactMetric: '$9.8T Rollover @ 4.8% Yield',
      horizonWindow: 'Q2 2026 – Q4 2027',
      thunglishExplain:
        'America matrum G7 countries 2021-la 0.5% vattiku vaanguna $9.8 Trillion kadan-ah ippo 4.8% vattiyila renew panna vendiya nilamai—annual interest selave $1.1 Trillion-ah thaanduthu.',
      simpleEverydayMeaning:
        'Like renewing a massive home loan at nearly 5x the original interest rate—forcing central banks to print liquidity or cap bond yields.',
      actorsInvolved: 'US Treasury · Federal Reserve · G7 Bond Desks'
    },
    {
      id: 'xray-money-02',
      code: '02',
      reticleLabel: '02 // MBRIDGE GOLD CORRIDOR',
      xPercent: 52,
      yPercent: 38,
      leaderDir: 'down-right',
      probabilityScore: '94% PROBABILITY',
      confidencePercent: 94,
      impactMetric: '$85B / Mo Direct Settlement',
      horizonWindow: 'ACTIVE NOW · SCALING 31% YoY',
      thunglishExplain:
        'China, UAE, matrum Saudi Arabia ellam Western correspondent bank-ku wait pannama, BIS mBridge network vazhiya direct local currency matrum physical Gold-la oil trade settle panranga.',
      simpleEverydayMeaning:
        'Works like an international UPI built directly between central banks so countries pay each other in seconds without middleman dollar fees.',
      actorsInvolved: 'BIS · UAE Central Bank · PBOC · Saudi Sama'
    },
    {
      id: 'xray-money-03',
      code: '03',
      reticleLabel: '03 // INDO-SINGAPORE FX RAIL',
      xPercent: 74,
      yPercent: 68,
      leaderDir: 'up-left',
      probabilityScore: '96% PROBABILITY',
      confidencePercent: 96,
      impactMetric: '850+ Metric Tons RBI Gold',
      horizonWindow: '2026 – 2028 SOVEREIGN BUFFER',
      thunglishExplain:
        'India RBI matrum Singapore MAS verum paper bond-ah mattum nambama, 24K physical Gold bars-ah domestic vault-la adukki UPI-PayNow bilateral FX rail-ah strong aakuraanga.',
      simpleEverydayMeaning:
        'Protects the Indian Rupee against global currency shocks by backing national reserves with real physical gold inside domestic vaults.',
      actorsInvolved: 'Reserve Bank of India (RBI) · Monetary Authority of Singapore'
    }
  ],

  GEOPOLITICS: [
    {
      id: 'xray-geo-01',
      code: '01',
      reticleLabel: '01 // ASML HIGH-NA EUV LOCK',
      xPercent: 28,
      yPercent: 36,
      leaderDir: 'up-right',
      probabilityScore: '97% PROBABILITY',
      confidencePercent: 97,
      impactMetric: '$380M / Machine Export Control',
      horizonWindow: 'ACTIVE EXPORT REGIME',
      thunglishExplain:
        'America matrum Netherlands senthu ulagathulaye 2nm AI chip print panra ASML EUV laser machine-ah China-ku anuppa koodாது nu strict export lock potutaanga.',
      simpleEverydayMeaning:
        'The world’s most advanced microchip printing press is restricted from being sold to rival fabs, triggering a global semiconductor supply race.',
      actorsInvolved: 'United States · Netherlands (ASML) · Japan'
    },
    {
      id: 'xray-geo-02',
      code: '02',
      reticleLabel: '02 // GALLIUM & GERMANIUM SHIELD',
      xPercent: 68,
      yPercent: 42,
      leaderDir: 'up-left',
      probabilityScore: '93% PROBABILITY',
      confidencePercent: 93,
      impactMetric: '86% Global Refining Monopoly',
      horizonWindow: '2026 RESOURCE COUNTER-LOCK',
      thunglishExplain:
        'Adhuku pathiladia China: "Neenga chip machine thara maatingala? Appo military radar matrum power chip seiya thevayana Gallium mineral-ah naangalum thara maatom!" nu counter-lock potanga.',
      simpleEverydayMeaning:
        'Gallium is the heat-resistant mineral required to build military radars, 5G towers, and EV fast-chargers—and China refines 86% of it.',
      actorsInvolved: 'China Ministry of Commerce · Global Wafer Foundries'
    },
    {
      id: 'xray-geo-03',
      code: '03',
      reticleLabel: '03 // INDO-GULF-EUROPE CORRIDOR',
      xPercent: 48,
      yPercent: 72,
      leaderDir: 'up-right',
      probabilityScore: '95% PROBABILITY',
      confidencePercent: 95,
      impactMetric: '40% Faster Mumbai-to-Europe Transit',
      horizonWindow: '2026 – 2029 IMEC ROLLOUT',
      thunglishExplain:
        'Indha rendu vallarasu sandaikku naduvula India, UAE, Saudi Arabia, matrum Europe senthu IMEC sea-rail corridor matrum Dholera/Sanand chip fab-ah uruvaaki pudhu supply chain king aaguraanga.',
      simpleEverydayMeaning:
        'A new sea-and-rail trade highway linking Mumbai to Dubai, Haifa, and Europe that cuts cargo transit time by 40% while hosting subsea fiber cables.',
      actorsInvolved: 'India · UAE · Saudi Arabia · European Union'
    }
  ],

  DEFENCE: [
    {
      id: 'xray-def-01',
      code: '01',
      reticleLabel: '01 // FIBER-OPTIC SPOOL DRONE',
      xPercent: 30,
      yPercent: 46,
      leaderDir: 'up-right',
      probabilityScore: '99% PROBABILITY',
      confidencePercent: 99,
      impactMetric: '20km Glass-Fiber · 0% RF Jamming',
      horizonWindow: 'ACTIVE FRONTLINE DOCTRINE',
      thunglishExplain:
        'Radio signal-ah jammer vachi cut pannidalam. Aana drone pinnadiye 20km-ku melliya glass fiber-optic wire spool pirinji vandha? Entha electronic jammer-aalayum adha thadukka mudiyaadhu!',
      simpleEverydayMeaning:
        'By flying with a hair-thin glass fiber cable unspooling behind it instead of wireless radio waves, the drone is completely immune to electronic jamming.',
      actorsInvolved: 'Frontline Autonomous Units · Edge AI Vision Guidance'
    },
    {
      id: 'xray-def-02',
      code: '02',
      reticleLabel: '02 // 300KW SOLID-STATE LASER',
      xPercent: 66,
      yPercent: 52,
      leaderDir: 'up-left',
      probabilityScore: '96% PROBABILITY',
      confidencePercent: 96,
      impactMetric: '$14 / Shot vs $2M Missile',
      horizonWindow: '2026 – 2028 NAVAL & AIR DEPLOYMENT',
      thunglishExplain:
        '$1,500 drone-ah sudurathuku $2 Million missile use panna country treasury gaali aagidum. Adhuku badhila $14 electricity selavula 300kW laser beam vachi sky-laye fry panranga.',
      simpleEverydayMeaning:
        'Uses concentrated high-energy light powered by a ship or truck generator to melt incoming drones at the speed of light for just $14 per shot.',
      actorsInvolved: 'US Navy HELIOS · UK DragonFire · India DRDO Kali/Laser'
    },
    {
      id: 'xray-def-03',
      code: '03',
      reticleLabel: '03 // AESA GAN RADAR DOME',
      xPercent: 48,
      yPercent: 28,
      leaderDir: 'down-right',
      probabilityScore: '94% PROBABILITY',
      confidencePercent: 94,
      impactMetric: '360° Multi-Target Micro-Doppler',
      horizonWindow: 'NEXT-GEN AIR DEFENCE SHIELD',
      thunglishExplain:
        'Gallium Nitride (GaN) radar array oru nodiyila nooru chinna drone swarm-oda micro-propeller vibration-ah kandupidichi laser turret-ah automatic-aa lock pannuthu.',
      simpleEverydayMeaning:
        'High-powered solid-state radar that spots tiny low-flying drones miles away and automatically aims the laser interceptor in milliseconds.',
      actorsInvolved: 'DRDO · Bharat Electronics · NATO SHORAD Commands'
    }
  ],

  AEROSPACE: [
    {
      id: 'xray-aero-01',
      code: '01',
      reticleLabel: '01 // ORBITAL CRYO-REFUELING',
      xPercent: 36,
      yPercent: 44,
      leaderDir: 'up-right',
      probabilityScore: '95% PROBABILITY',
      confidencePercent: 95,
      impactMetric: '$2,500 ➔ $180 / kg Launch Cost',
      horizonWindow: '2026 – 2028 ORBITAL LOGISTICS',
      thunglishExplain:
        'Flight-ah oru thadava parandhutu kadalla thooki pota ticket velai eppadi irukum? Ippo reusable heavy rocket + space petrol bunk (orbital cryo-refueling) vandhathala space shipping cost 95% kuraiyuthu!',
      simpleEverydayMeaning:
        'Docking two spacecraft in orbit to transfer super-cold liquid methane & oxygen so heavy cargo ships can fly all the way to the Moon with 100+ tons.',
      actorsInvolved: 'SpaceX Starship · NASA Artemis · ISRO NGLV'
    },
    {
      id: 'xray-aero-02',
      code: '02',
      reticleLabel: '02 // 280KM VLEO LASER MESH',
      xPercent: 68,
      yPercent: 32,
      leaderDir: 'up-left',
      probabilityScore: '97% PROBABILITY',
      confidencePercent: 97,
      impactMetric: '18ms Latency · Direct-to-Cell',
      horizonWindow: 'ACTIVE CONSTELLATION ROLLOUT',
      thunglishExplain:
        '280km Very-Low-Earth-Orbit (VLEO) la parakkura satellite laser mesh namma sadharana 5G mobile phone-ku tower illadha kadal matrum malai kaatulayum direct broadband signal kudukuthu.',
      simpleEverydayMeaning:
        'Satellites flying twice as close to Earth act like cell towers in space, connecting directly to standard smartphones without any special dish.',
      actorsInvolved: 'Starlink Direct-to-Cell · ISRO SSLV · Global Telecoms'
    },
    {
      id: 'xray-aero-03',
      code: '03',
      reticleLabel: '03 // ATMOSPHERIC ION THRUSTER',
      xPercent: 54,
      yPercent: 72,
      leaderDir: 'up-right',
      probabilityScore: '91% PROBABILITY',
      confidencePercent: 91,
      impactMetric: '5-Year VLEO Station-Keeping',
      horizonWindow: '2026 – 2029 RECON & TELECOM',
      thunglishExplain:
        '280km uyarathula mellisaana kaathu satellite-ah keela izhukum; electric ion thruster vachi drag-ah compensate panni sub-10cm clarity imaging edukkuraanga.',
      simpleEverydayMeaning:
        'High-efficiency electric plasma thrusters keep low-flying satellites in orbit for years while capturing crystal-clear Earth imagery.',
      actorsInvolved: 'ISRO · Private Space-Tech Startups · Commercial EO'
    }
  ],

  TECH: [
    {
      id: 'xray-tech-01',
      code: '01',
      reticleLabel: '01 // V4L2 ZERO-COPY DMA-BUF',
      xPercent: 28,
      yPercent: 48,
      leaderDir: 'up-right',
      probabilityScore: '99% PROBABILITY',
      confidencePercent: 99,
      impactMetric: '28ms ➔ 3.4ms Frame Latency',
      horizonWindow: 'PRODUCTION EMBEDDED LINUX',
      thunglishExplain:
        'Embedded Linux camera sensor-la irundhu 4K video edukumbo CPU `memcpy()` panni RAM-la naalu idathula copy panna 28ms waste aagum. V4L2 `DMA-BUF` vachi NPU-ku direct hardware pointer kudutha 3.4ms-la frame ready!',
      simpleEverydayMeaning:
        'Instead of photocopying a heavy 4K video frame 4 times inside memory, the camera and AI chip share the exact same memory address—cutting delay by 88%.',
      actorsInvolved: 'Linux Kernel V4L2 · Edge Robotics · Automotive ADAS'
    },
    {
      id: 'xray-tech-02',
      code: '02',
      reticleLabel: '02 // 2NM BACKSIDE POWER RAIL',
      xPercent: 56,
      yPercent: 36,
      leaderDir: 'down-right',
      probabilityScore: '96% PROBABILITY',
      confidencePercent: 96,
      impactMetric: '-68% Heat · 1.6 Tbps Optical I/O',
      horizonWindow: '2026 – 2027 FOUNDRY RAMP',
      thunglishExplain:
        '2nm wafer-la power lines-ah wafer adiyila (Backside Power Delivery) maathi, chip-ku naduvula copper wire-ku badhila silicon photonics laser waveguide vachathala heat 68% kurainjiduchi.',
      simpleEverydayMeaning:
        'Separating power wires to the bottom of the silicon wafer and using microscopic laser beams instead of copper wires makes AI chips faster and much cooler.',
      actorsInvolved: 'TSMC · Intel Foundry · Co-Packaged Optics Consortia'
    },
    {
      id: 'xray-tech-03',
      code: '03',
      reticleLabel: '03 // RISC-V DETERMINISTIC NPU',
      xPercent: 74,
      yPercent: 66,
      leaderDir: 'up-left',
      probabilityScore: '95% PROBABILITY',
      confidencePercent: 95,
      impactMetric: '45 TOPS @ 5 Watts Edge Power',
      horizonWindow: '2026 – 2028 SOVEREIGN SILICON',
      thunglishExplain:
        'License fee illadha open-standard RISC-V vector core kooda custom NPU accelerator serthu, internet illama drone matrum car-kulleye real-time AI vision run panranga.',
      simpleEverydayMeaning:
        'An open-source chip architecture that lets countries and robotics companies build custom AI processors without foreign licensing restrictions.',
      actorsInvolved: 'India DIR-V (Shakti/Vega) · Global RISC-V Ecosystem'
    }
  ]
};

/**
 * Builds the 4 Netflix / Apple TV+ horizontal poster swimlane rows
 * from the live 60s incoming wire and the 5 intelligence pillars.
 */
export function buildFutifySwimlanes(
  pillarsMap: Record<NeatPillarId, NeatPillarData>,
  incomingWire: IncomingWireItem[],
  rssImageMap: Partial<Record<NeatPillarId, string>> = {}
): FutifySwimlaneRow[] {
  const toPosterCard = (
    item: IncomingWireItem,
    idx: number
  ): FutifyPosterCard => {
    const backdrop =
      AMBIENT_BACKDROP_CATALOG[item.pillarId] || AMBIENT_BACKDROP_CATALOG.MONEY;
    const customImg = rssImageMap[item.pillarId];
    const conf = HERO_CONFIDENCE_BY_PILLAR[item.pillarId];
    return {
      id: item.id,
      pillarId: item.pillarId,
      categoryTag: item.chipLabel,
      headline: item.headline,
      subHook: item.pillarSnapshot.thunglishAnalogy[0],
      posterImageUrl:
        customImg && /^https?:\/\/.+/i.test(customImg)
          ? customImg
          : backdrop.bgImage,
      fallbackUnsplashUrl: backdrop.unsplashBgUrl,
      timestampBadge: item.timestampIST,
      probabilityBadge: `${conf.confidencePercent}% CONFIDENCE`,
      keyMetricBadge: item.keyMetricBadge,
      isJustIn: idx < 2 || item.sourceBadge !== 'INITIAL SEED',
      pillarSnapshot: item.pillarSnapshot
    };
  };

  const pillarToCard = (
    pid: NeatPillarId,
    variantSuffix: string,
    customHeadline?: string,
    useUnsplashPrimary = false
  ): FutifyPosterCard => {
    const p = pillarsMap[pid];
    const backdrop =
      AMBIENT_BACKDROP_CATALOG[pid] || AMBIENT_BACKDROP_CATALOG.MONEY;
    const conf = HERO_CONFIDENCE_BY_PILLAR[pid];
    return {
      id: `swimlane-${pid}-${variantSuffix}`,
      pillarId: pid,
      categoryTag: p.chipLabel,
      headline: customHeadline || p.headline,
      subHook: p.thunglishAnalogy[0],
      posterImageUrl: useUnsplashPrimary
        ? backdrop.unsplashBgUrl
        : rssImageMap[pid] || backdrop.bgImage,
      fallbackUnsplashUrl: backdrop.unsplashBgUrl,
      timestampBadge: p.updatedAt,
      probabilityBadge: `${conf.confidencePercent}% PROBABILITY`,
      keyMetricBadge: `${p.telemetry[0].value} · ${p.telemetry[0].label}`,
      isJustIn: false,
      pillarSnapshot: p
    };
  };

  const topLiveCards = incomingWire.slice(0, 6).map(toPosterCard);

  return [
    {
      id: 'row-live-shifts',
      title: 'Top Future Shifts',
      serifAccent: 'Right Now',
      subtitle: 'Live 60-Second Incoming Telemetry Wire · Real-Time Global Signals',
      cards: topLiveCards
    },
    {
      id: 'row-silicon-embedded',
      title: 'Embedded Systems &',
      serifAccent: 'Silicon Wars',
      subtitle: 'Zero-Copy Linux Kernel Pipelines · Sub-2nm Photonics · Export Locks',
      cards: [
        pillarToCard('TECH', 'primary'),
        pillarToCard('GEOPOLITICS', 'primary'),
        pillarToCard(
          'TECH',
           'v4l2-deep',
          'Zero-Copy V4L2 DMA-BUF & Open RISC-V Vector NPU Architecture',
          true
        ),
        pillarToCard(
          'DEFENCE',
          'edge-vision',
          'Edge AI Optical Navigation for Unjammable Autonomous Swarms',
          true
        )
      ]
    },
    {
      id: 'row-aerospace-defence',
      title: 'Aerospace & Defense',
      serifAccent: 'Horizon',
      subtitle: 'Orbital Cryo-Refueling · 280km VLEO Satellites · Directed-Energy Lasers',
      cards: [
        pillarToCard('AEROSPACE', 'primary'),
        pillarToCard('DEFENCE', 'primary'),
        pillarToCard(
          'AEROSPACE',
          'vleo-mesh',
          '280km VLEO Direct-to-Cell Laser Satellite Constellations',
          true
        ),
        pillarToCard(
          'DEFENCE',
          'laser-shield',
          '$14-Per-Shot 300kW Solid-State Directed-Energy Air Defense',
          true
        )
      ]
    },
    {
      id: 'row-money-geopolitics',
      title: 'Sovereign Money &',
      serifAccent: 'Geopolitics',
      subtitle: '$9.8T Debt Refinancing Wall · BIS mBridge Gold Corridors · IMEC Trade Route',
      cards: [
        pillarToCard('MONEY', 'primary'),
        pillarToCard('GEOPOLITICS', 'imec'),
        pillarToCard(
          'MONEY',
          'gold-repo',
          'Central Bank Physical Bullion Accumulation & Bilateral FX Rails',
          true
        ),
        pillarToCard(
          'GEOPOLITICS',
          'mineral-shield',
          'India-UAE-Europe (IMEC) Sea-Rail Corridor & Semiconductor Fabs',
          true
        )
      ]
    }
  ];
}

let hasUserGestureOccurred = false;
if (typeof window !== 'undefined') {
  const markInteracted = () => {
    hasUserGestureOccurred = true;
  };
  window.addEventListener('pointerdown', markInteracted, { passive: true });
  window.addEventListener('keydown', markInteracted, { passive: true });
}

/**
 * Synthesizes the signature FUTIFY "TA-DUM" deep sub-bass double impact
 * followed by a futuristic crystalline harmonic shimmer chord using native Web Audio API.
 */
export function playFutifyTaDumSonic(forceFromClick = false): void {
  if (typeof window === 'undefined') return;
  const userActivationActive =
    forceFromClick ||
    hasUserGestureOccurred ||
    Boolean(
      (
        navigator as Navigator & {
          userActivation?: { hasBeenActive?: boolean };
        }
      ).userActivation?.hasBeenActive
    );

  // If browser has not yet received a user gesture, play automatically on first pointerdown/keydown
  if (!userActivationActive) {
    const playOnFirstGesture = () => {
      hasUserGestureOccurred = true;
      window.removeEventListener('pointerdown', playOnFirstGesture);
      window.removeEventListener('keydown', playOnFirstGesture);
      playFutifyTaDumSonic(true);
    };
    window.addEventListener('pointerdown', playOnFirstGesture, { once: true });
    window.addEventListener('keydown', playOnFirstGesture, { once: true });
    return;
  }

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Master compressor-like gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.42, now);
    master.connect(ctx.destination);

    // 1. First "TA" Punch (t = 0.05s)
    const oscTa = ctx.createOscillator();
    const gainTa = ctx.createGain();
    oscTa.type = 'sine';
    oscTa.frequency.setValueAtTime(110, now + 0.05);
    oscTa.frequency.exponentialRampToValueAtTime(42, now + 0.32);
    gainTa.gain.setValueAtTime(0.001, now);
    gainTa.gain.linearRampToValueAtTime(0.85, now + 0.06);
    gainTa.gain.exponentialRampToValueAtTime(0.01, now + 0.36);
    oscTa.connect(gainTa);
    gainTa.connect(master);
    oscTa.start(now + 0.05);
    oscTa.stop(now + 0.38);

    // 2. Second Deep "DUM" Sub-Bass Impact (t = 0.36s)
    const oscDum = ctx.createOscillator();
    const gainDum = ctx.createGain();
    oscDum.type = 'triangle';
    oscDum.frequency.setValueAtTime(92, now + 0.36);
    oscDum.frequency.exponentialRampToValueAtTime(36.7, now + 1.85);
    gainDum.gain.setValueAtTime(0.001, now + 0.35);
    gainDum.gain.linearRampToValueAtTime(0.95, now + 0.4);
    gainDum.gain.exponentialRampToValueAtTime(0.001, now + 2.3);
    oscDum.connect(gainDum);
    gainDum.connect(master);
    oscDum.start(now + 0.36);
    oscDum.stop(now + 2.35);

    // 3. Futuristic Crystalline Shimmer Chord (Dmaj9 / A9 cosmic voicing)
    const shimmerFreqs = [146.83, 220.0, 277.18, 329.63, 440.0, 659.25];
    shimmerFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.38);
      osc.detune.setValueAtTime((idx - 2.5) * 4, now + 0.38);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now + 0.38);
      filter.frequency.exponentialRampToValueAtTime(3400, now + 1.1);
      filter.frequency.exponentialRampToValueAtTime(900, now + 2.5);

      gain.gain.setValueAtTime(0.0001, now + 0.38);
      gain.gain.linearRampToValueAtTime(0.14 / (idx * 0.35 + 1), now + 0.65);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now + 0.38);
      osc.stop(now + 2.65);
    });

    setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 2900);
  } catch {
    // Ignore if browser blocks un-interacted audio context
  }
}

/**
 * Subtle spatial HUD reticle selection chime.
 */
export function playSpatialReticleChime(): void {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.11);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 250);
  } catch {
    // Ignore
  }
}
