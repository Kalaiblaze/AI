export type PillarId = 'TECH' | 'DEFENCE' | 'MONEY' | 'GEOPOLITICS' | 'AEROSPACE';

export interface PillarMeta {
  id: PillarId;
  name: string;
  shortLabel: string;
  code: string;
  accentHex: string;
  badgeClass: string;
  borderClass: string;
  glowClass: string;
  textClass: string;
  bgSoftClass: string;
  caseStudy: {
    codename: string;
    sectorSummary: string;
    thunglishTakeaway: string;
    successCase: {
      title: string;
      entity: string;
      year: string;
      metric: string;
      breakdown: string;
      strategicLesson: string;
    };
    failureCase: {
      title: string;
      entity: string;
      year: string;
      metric: string;
      breakdown: string;
      autopsyLesson: string;
    };
  };
}

export interface Matrix3D {
  pastRootCause: string;
  presentTrigger: string;
  futurePrediction: string;
}

export interface DotConnectionStep {
  fromPillar: PillarId;
  fromNode: string;
  toPillar: PillarId;
  toNode: string;
  mechanism: string;
  impactDelta: string;
}

export interface CharismaLesson {
  modelName: string;
  bookReference: string;
  author: string;
  lawOrConcept: string;
  thunglishBreakdown: string;
  tacticalAction: string;
}

export interface IntelligenceItem {
  id: string;
  pillar: PillarId;
  code: string;
  timestamp: string;
  headline: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  signalScore: number;
  region: string;
  thunglishBriefing: string;
  everydayAnalogy: string;
  matrix3D: Matrix3D;
  keyMetrics: { label: string; value: string; delta: string }[];
}

export interface IntelligenceBatch {
  batchId: string;
  batchNumber: number;
  codename: string;
  timestampUtc: string;
  threatDefcon: string;
  summaryTagline: string;
  telemetryStream: string[];
  items: IntelligenceItem[];
  dotConnectorWeb: {
    title: string;
    patternSummary: string;
    steps: DotConnectionStep[];
  };
  charismaDojo: CharismaLesson;
}

export const PILLARS: Record<PillarId, PillarMeta> = {
  TECH: {
    id: 'TECH',
    name: 'Technology & Embedded Silicon',
    shortLabel: 'Tech / Silicon',
    code: 'PLR-01',
    accentHex: '#06B6D4',
    badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
    borderClass: 'border-cyan-500/30 hover:border-cyan-400/60',
    glowClass: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.28)]',
    textClass: 'text-cyan-400',
    bgSoftClass: 'bg-cyan-500/10',
    caseStudy: {
      codename: 'SILICON_SOVEREIGNTY_DOSSIER',
      sectorSummary: 'How vertically integrated lithography & edge NPU architectures separate apex predators from legacy chipmakers.',
      thunglishTakeaway: 'Boss, hardware-la yaaru kitchen-ah (Fab) control panrangalo avanga dhaan menu card decide pannuvanga. Веறும் recipe (design) vachukitu hotel nadatha mudiyathu!',
      successCase: {
        title: 'TSMC & Apple M-Series Co-Packaging Monopoly',
        entity: 'TSMC + Apple Silicon Architecture',
        year: '2020–2026',
        metric: '+310% Perf-per-Watt / 62% Gross Margin',
        breakdown: 'Locked up 100% of initial 3nm & 2nm GAA wafer capacity two years before rivals even taped out. By uniting custom ARM cores with CoWoS advanced packaging, they made x86 laptops look like diesel generators.',
        strategicLesson: 'Own the bottleneck layer of the supply chain so competitors fund your R&D just to stay alive.'
      },
      failureCase: {
        title: 'Intel 10nm/7nm Foundry Delays & EUV Hesitation',
        entity: 'Legacy IDM Foundry Strategy',
        year: '2016–2024',
        metric: '-$120B Market Cap Erosion',
        breakdown: 'Delayed High-NA EUV lithography adoption to squeeze extra quarters of margin out of DUV multi-patterning. Yield rates crashed while TSMC sprinted ahead, turning the undisputed silicon king into a catch-up customer.',
        autopsyLesson: 'Never starve cap-ex on next-gen physics to protect quarterly EPS optics.'
      }
    }
  },
  DEFENCE: {
    id: 'DEFENCE',
    name: 'Autonomous Defence & EW',
    shortLabel: 'Defence / EW',
    code: 'PLR-02',
    accentHex: '#F43F5E',
    badgeClass: 'text-rose-300 border-rose-500/40 bg-rose-500/10',
    borderClass: 'border-rose-500/30 hover:border-rose-400/60',
    glowClass: 'shadow-[0_0_25px_-5px_rgba(244,63,94,0.28)]',
    textClass: 'text-rose-400',
    bgSoftClass: 'bg-rose-500/10',
    caseStudy: {
      codename: 'ASYMMETRIC_SWARM_DOCTRINE',
      sectorSummary: 'Why software-defined attritable drones and acoustic-optical EW are obsoleting billion-dollar legacy platforms.',
      thunglishTakeaway: '1000 Kodi rooba battleship-ah, 40,000 rooba FPV fiber-optic drone vachi gaali panra kaalam idhu. Cost-per-kill math puriyama war room-la ukkantha out dhaan!',
      successCase: {
        title: 'Anduril Lattice OS & Attritable Autonomous Interceptors',
        entity: 'Defense-Tech Software-First Prime',
        year: '2022–2026',
        metric: '14x Faster Deployment / 1/20th Unit Cost',
        breakdown: 'Built the sensor-fusion nervous system (Lattice) first using commercial edge GPUs and modular carbon airframes. Iterated firmware weekly in active electronic-warfare zones instead of waiting 9 years for Pentagon spec sheets.',
        strategicLesson: 'Speed of software iteration on cheap hardware beats exquisite, un-replaceable monuments.'
      },
      failureCase: {
        title: 'Zumwalt-Class Stealth Destroyer Gun System (AGS)',
        entity: 'Legacy Cost-Plus Naval Procurement',
        year: '2008–2021',
        metric: '$22.5B Program / $800K Per Single Shell',
        breakdown: 'Engineered a bespoke guided artillery shell so expensive ($800,000 per round) that the Navy cancelled the ammunition entirely, leaving a $7.5B stealth warship with two giant guns that could literally fire nothing.',
        autopsyLesson: 'When unit economics violate battlefield math, the weapon self-neutralizes before firing a shot.'
      }
    }
  },
  MONEY: {
    id: 'MONEY',
    name: 'Sovereign Money & Liquidity',
    shortLabel: 'Money / Macro',
    code: 'PLR-03',
    accentHex: '#10B981',
    badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
    borderClass: 'border-emerald-500/30 hover:border-emerald-400/60',
    glowClass: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.28)]',
    textClass: 'text-emerald-400',
    bgSoftClass: 'bg-emerald-500/10',
    caseStudy: {
      codename: 'LIQUIDITY_PLUMBING_MATRIX',
      sectorSummary: 'Central bank swap lines, gold-settled energy corridors, and duration mismatches in sovereign bond markets.',
      thunglishTakeaway: 'Market-la sentiment ellam verum cinema trailer dhaan; repo rate-um bond yield plumbing-um dhaan real box office collection!',
      successCase: {
        title: 'Singapore GIC & MAS Sovereign Corridor Positioning',
        entity: 'Monetary Authority of Singapore',
        year: '2021–2026',
        metric: '+$410B Private Wealth Inflow / AAA Stability',
        breakdown: 'Managed exchange-rate bands (S$NEER) rather than blunt interest rate hikes while building instant cross-border wholesale CBDC settlement rails (Project mBridge / Ubin), capturing Asian family-office liquidity flight.',
        strategicLesson: 'Neutrality paired with bulletproof settlement plumbing attracts capital during every geopolitical storm.'
      },
      failureCase: {
        title: 'Silicon Valley Bank (SVB) Long-Duration HTM Collapse',
        entity: 'SVB Financial Group Treasury',
        year: '2023',
        metric: '$42B Deposit Flight in 24 Hours',
        breakdown: 'Parked uninsured startup deposits into 10-year Mortgage-Backed Securities yielding 1.56% with zero interest-rate hedges right before the fastest Fed tightening cycle in 40 years. One WhatsApp panic later, game over.',
        autopsyLesson: 'Chasing 40 basis points of extra yield without hedging duration risk is picking up pennies in front of a bullet train.'
      }
    }
  },
  GEOPOLITICS: {
    id: 'GEOPOLITICS',
    name: 'Geopolitics & Chokepoints',
    shortLabel: 'Geopolitics',
    code: 'PLR-04',
    accentHex: '#F59E0B',
    badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
    borderClass: 'border-amber-500/30 hover:border-amber-400/60',
    glowClass: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.28)]',
    textClass: 'text-amber-400',
    bgSoftClass: 'bg-amber-500/10',
    caseStudy: {
      codename: 'CHOKEPOINT_REALPOLITIK',
      sectorSummary: 'Maritime straits, rare-earth refining monopolies, and multi-aligned middle powers rewriting sanctions regimes.',
      thunglishTakeaway: 'Geopolitics-la permanent friends-um illa, permanent enemies-um illa—yaaru kitta Gallium, Lithium, Strait of Malacca saavi irukko avanga dhaan Boss!',
      successCase: {
        title: 'India Multi-Alignment &discounted Urals Refining Arbitrage',
        entity: 'Indian Energy & Diplomatic Corps',
        year: '2022–2026',
        metric: '$18B+ Crude Savings / Top Refined Exporter to EU',
        breakdown: 'Purchased sanctioned Russian Urals crude at steep discounts in non-USD currencies, refined it in Jamnagar at world-scale margins, and legally exported refined diesel and jet fuel directly back to European buyers.',
        strategicLesson: 'Strategic autonomy lets a nation act as the indispensable bridge between rival superpower blocs.'
      },
      failureCase: {
        title: 'European Single-Source Pipeline Dependency (Nord Stream)',
        entity: 'German Industrial Energy Policy',
        year: '2011–2022',
        metric: '3.4x Industrial Electricity Cost Spike',
        breakdown: 'Shut down domestic nuclear baseload while routing 55% of natural gas imports through a single geopolitical supplier with zero LNG regasification terminals as backup, hollowing out chemical and auto manufacturing.',
        autopsyLesson: 'Outsourcing your civilization’s baseload energy to a single geopolitical counterparty is a sovereign margin call.'
      }
    }
  },
  AEROSPACE: {
    id: 'AEROSPACE',
    name: 'Orbital Aerospace & Hypersonics',
    shortLabel: 'Aerospace / Orbit',
    code: 'PLR-05',
    accentHex: '#A855F7',
    badgeClass: 'text-purple-300 border-purple-500/40 bg-purple-500/10',
    borderClass: 'border-purple-500/30 hover:border-purple-400/60',
    glowClass: 'shadow-[0_0_25px_-5px_rgba(168,85,247,0.28)]',
    textClass: 'text-purple-400',
    bgSoftClass: 'bg-purple-500/10',
    caseStudy: {
      codename: 'ORBITAL_MASS_ECONOMICS',
      sectorSummary: 'Reusable methalox heavy lift, VLEO direct-to-cell constellations, and ISRO ultra-lean planetary engineering.',
      thunglishTakeaway: 'Rocket-ah oru thadava parakka vittu kadal-la podurathu, 5-crore Rolls Royce vaangi oru trip Ooty poitu scrap-la podura maadhiri. Reusability + frugal engineering dhaan orbit-oda pudhu rule!',
      successCase: {
        title: 'SpaceX Starship Methalox Catch & ISRO Frugal Deep-Space',
        entity: 'SpaceX / ISRO Orbital Programs',
        year: '2023–2026',
        metric: '$180/kg Launch Cost Target / 88% Global Up-Mass',
        breakdown: 'Rapid booster reuse collapsed cost-to-orbit by 10x, turning space from a government prestige project into a high-margin telecom utility (Starlink + Starshield), while ISRO proved lunar south-pole landing for less than a Hollywood sci-fi movie budget.',
        strategicLesson: 'Drive launch cost per kilogram down an order of magnitude and entire new orbital economies unlock automatically.'
      },
      failureCase: {
        title: 'Boeing Starliner Fixed-Price Program Overruns',
        entity: 'Legacy Aerospace Subcontractor Chain',
        year: '2014–2025',
        metric: '$1.85B+ Write-Downs / Thruster Anomaly Delays',
        breakdown: 'Outsourced fragmented subsystems across dozens of legacy tier-1 vendors without unified hardware-in-the-loop integration testing, resulting in helium leaks, thruster valve degradation, and stranded crew embarrassment.',
        autopsyLesson: 'Spreadsheet management and fragmented subcontracting cannot substitute for integrated physics testing.'
      }
    }
  }
};

export const INTELLIGENCE_BATCHES: IntelligenceBatch[] = [
  {
    batchId: 'BATCH-ALPHA-01',
    batchNumber: 1,
    codename: 'SILICON_CHOKEPOINT_OMEGA',
    timestampUtc: '2026-11-11T07:40:00Z',
    threatDefcon: 'DEFCON-2 // SILICON & SWARM ESCALATION',
    summaryTagline: 'Sub-2nm Backside Power Chip Export Curbs Trigger Autonomous Drone Swarm Pivots & Sovereign Gold-Repo Hedges',
    telemetryStream: [
      'ASML HIGH-NA EUV THROUGHPUT: 94.2% [LOCKED]',
      'STRAIT OF TAIWAN AIS TRANSPONDER DENSITY: -18.4% ANOMALY',
      'SHANGHAI GOLD EXCHANGE PREMIUM OVER LBMA: +$34.80/OZ',
      'VLEO LASER CROSS-LINK PACKET LATENCY: 11.3ms NOMINAL',
      'BRENT-DUBAI CRUDE SPREAD SETTLEMENT IN CNY/AED: 41.6%'
    ],
    items: [
      {
        id: 'NX9-101',
        pillar: 'TECH',
        code: 'SIG-TECH-209',
        timestamp: '07:38:12 UTC',
        headline: 'Sub-2nm Backside Power Delivery (BSPDN) & High-NA EUV Firmware Geofencing Activated',
        severity: 'CRITICAL',
        signalScore: 98,
        region: 'Hsinchu / Veldhoven',
        thunglishBriefing: 'Scene enna na, 2-nanometer chip-la power supply wiring-ah chip-oda back-side-ku maathirukanga (BSPDN). Idhanaala heat koranju AI speed double aaguthu. Aana US & Dutch regulators ippo scanner machine-la remote "Kill-Switch" firmware update potachu—unauthorized military chip print panna try panna machine automatic-ah sleep mode poirum!',
        everydayAnalogy: 'Namma oorla meter-ah thirupi vitta EB board smart-meter remote-la irunthe fuse-ah pudungura maadhiri, ippo $380M chip lithography machine-laye cloud lock potutanga!',
        matrix3D: {
          pastRootCause: 'Cloud-scale AI clusters hit a brutal thermal wall at 3nm where copper interconnects melted under 1200W TDP loads.',
          presentTrigger: 'Mandatory cryptographic telemetry heartbeats injected into High-NA EUV laser controllers globally.',
          futurePrediction: 'By late 2028, bifurcated "Clean-Room Bloc" vs "RISC-V Chiplets Bloc" splits global electronics into two incompatible hardware stacks.'
        },
        keyMetrics: [
          { label: 'Node Density', value: '230M Tr/mm²', delta: '+38% vs 3nm' },
          { label: 'Power Drop', value: '-24% IR Drop', delta: 'Backside Rail' },
          { label: 'Geofence Lock', value: '24hr Heartbeat', delta: 'Cryptographic' }
        ]
      },
      {
        id: 'NX9-102',
        pillar: 'DEFENCE',
        code: 'SIG-DEF-411',
        timestamp: '07:35:44 UTC',
        headline: 'Edge-NPU Optical Navigation Swarms Bypass GPS Spoofing in Red Sea & Eastern Flank',
        severity: 'CRITICAL',
        signalScore: 95,
        region: 'Indo-Pacific / Red Sea',
        thunglishBriefing: 'munnadi ellam drone parakkana GPS signal venum, jammer potta drone confuse aagi vizhundhurum. Ippo pudhu silicon NPU chips vachi drone-ku "Offline Google Maps" maadhiri terrain-matching camera vision kuduthutanga. Zero radio signal, zero GPS—verum starlight + ground terrain paathe target-ah exact-ah lock pannuthu!',
        everydayAnalogy: 'Phone signal cut aanalum, Chennai auto driver-ku Mylapore sandhu pondhu ellam kanna mooditu theriyura maadhiri, drone ippo satellite illamaye local landmark paathu parakkuthu!',
        matrix3D: {
          pastRootCause: 'Electronic Warfare (EW) spoofing rendered 72% of first-gen GPS-guided munitions blind within 15km of frontline jammers.',
          presentTrigger: 'Deployment of 8-watt neuromorphic vision chips inside $1,800 attritable interceptor drones.',
          futurePrediction: 'Traditional RF jamming becomes obsolete by 2028; high-energy microwave (HPM) and kinetic laser point-defense become the only viable shield.'
        },
        keyMetrics: [
          { label: 'RF Emission', value: '0.0 dBm (Dark)', delta: '100% Passive' },
          { label: 'Terminal CEP', value: '0.4 Meters', delta: 'Optical Lock' },
          { label: 'Unit Cost', value: '$1,850', delta: '-89% vs Missile' }
        ]
      },
      {
        id: 'NX9-103',
        pillar: 'GEOPOLITICS',
        code: 'SIG-GEO-802',
        timestamp: '07:31:05 UTC',
        headline: 'Rare-Earth Germanium & Gallium Export Quotas Linked Directly to Semiconductor Tool Access',
        severity: 'HIGH',
        signalScore: 92,
        region: 'Beijing / Brussels / Tokyo',
        thunglishBriefing: 'Neenga chip machine-ku lock potta, naanga andha chip-um military radar-um seiya thevayana Gallium & Germanium-ku tap-ah mooduvom nu counter-strike! Global supply chain ippo tit-for-tat chess game aagiruchu.',
        everydayAnalogy: 'Neenga enaku Borewell motor thara maatingala? Appo naan unga veetu tank-ku varra water pipe valve-ah mooduren nu pakkathu veetukaaran solra exact panchayathu!',
        matrix3D: {
          pastRootCause: 'Over 86% of global refined Gallium and 68% of Germanium processing was consolidated in a single nation over two decades of environmental offshoring.',
          presentTrigger: 'Customs clearance now requires end-user defense-exclusion certificates for every kilogram exported.',
          futurePrediction: 'Australian, African, and Indian processing refineries receive $45B in fast-tracked defense subsidies over the next 24 months.'
        },
        keyMetrics: [
          { label: 'Refining Share', value: '86.4% Monopolized', delta: 'Critical Chokepoint' },
          { label: 'Spot Gallium', value: '$790/kg', delta: '+42% YoY' },
          { label: 'Buffer Stock', value: '4.2 Months', delta: 'NATO Average' }
        ]
      },
      {
        id: 'NX9-104',
        pillar: 'MONEY',
        code: 'SIG-MON-519',
        timestamp: '07:26:19 UTC',
        headline: 'Central Banks Accelerate Physical Gold & Tokenized Commodity Repo Lines Amid Sanctions Risk',
        severity: 'HIGH',
        signalScore: 90,
        region: 'Zurich / Singapore / Riyadh',
        thunglishBriefing: 'Supply chain sandai perusaaga perusaaga, central banks ellam US Treasury bonds-la mattum kaasai vaiykkama, physical Gold bars-ah thamizhan T. Nagar-la vaangura maadhiri tonne kanakkula vaangi soththu சேர்க்கிறாங்க. Plus, oil trade-ah instant blockchain ledger-la settle panna start pannitanga!',
        everydayAnalogy: 'Bank server mela sandhegam vantha udane amma locker-la irukura Thanga Kasu maalai-ah veliya edukura maadhiri, ulaga central banks ippo physical gold-ku shift aaguthu!',
        matrix3D: {
          pastRootCause: 'Freezing of $300B in sovereign FX reserves in 2022 woke up every Global South treasury director to custodial counterparty risk.',
          presentTrigger: 'mBridge cross-border wholesale settlement volume crosses $85B/month tied to vaulted bullion collateral.',
          futurePrediction: 'Gold becomes a Tier-1 intraday repo collateral asset across Asian and Gulf clearinghouses by Q4 2028.'
        },
        keyMetrics: [
          { label: 'CB Gold Buying', value: '1,180 Tonnes/Yr', delta: 'Record Pace' },
          { label: 'Non-USD Oil', value: '28.4% Volume', delta: '+6.1% YoY' },
          { label: '10Y Term Premia', value: '+64 bps', delta: 'Fiscal Supply' }
        ]
      },
      {
        id: 'NX9-105',
        pillar: 'AEROSPACE',
        code: 'SIG-AERO-304',
        timestamp: '07:20:51 UTC',
        headline: 'Very-Low-Earth-Orbit (VLEO) Optical Mesh Satellites Deployed at 280km Altitude',
        severity: 'ELEVATED',
        signalScore: 89,
        region: 'Vandenberg / Sriharikota',
        thunglishBriefing: 'Normal satellites 550km mela parakkum. Ippo pudhusa 280km height-la (VLEO) ion-thruster vachi satellites irakkirukanga. Earth-ku romba pakkathula irukurathaala camera resolution crystal clear-ah irukum, laser communication fiber-cable-ah vida fast-ah pogum!',
        everydayAnalogy: 'Gallery top row-la irunthu binoculars-la match paakurathukum, boundary rope pakkathulaye VIP chair-la ukkanthu paakurathukum ulla difference dhaan VLEO orbit!',
        matrix3D: {
          pastRootCause: 'Standard LEO orbits (550km) became congested and vulnerable to ground-based cyber-jamming of Ku/Ka radio bands.',
          presentTrigger: 'Air-breathing electric propulsion (ABEP) allows satellites to skim upper atmosphere at 280km without burning fuel.',
          futurePrediction: 'Sub-10cm real-time synthetic aperture radar (SAR) imaging from VLEO eliminates naval stealth cover worldwide within 24 months.'
        },
        keyMetrics: [
          { label: 'Orbital Altitude', value: '280 km VLEO', delta: '-49% vs LEO' },
          { label: 'Optical Link', value: '100 Gbps Laser', delta: 'Zero RF Footprint' },
          { label: 'Image Res', value: '12 cm Ground', delta: 'All-Weather SAR' }
        ]
      }
    ],
    dotConnectorWeb: {
      title: 'PATTERN ALPHA // SILICON-TO-BULLION CAUSAL CHAIN',
      patternSummary: 'How a 2nm semiconductor firmware lock in Europe triggers drone autonomy in the Red Sea and gold accumulation in Singapore.',
      steps: [
        {
          fromPillar: 'TECH',
          fromNode: '2nm EUV Firmware Lock',
          toPillar: 'DEFENCE',
          toNode: 'Edge-NPU Offline Drones',
          mechanism: 'Chip scarcity forces military engineers to optimize compact 8W neuromorphic vision chips that need zero cloud or GPS.',
          impactDelta: '10x EW Resilience'
        },
        {
          fromPillar: 'DEFENCE',
          fromNode: 'Edge-NPU Offline Drones',
          toPillar: 'GEOPOLITICS',
          toNode: 'Gallium & Strait Quotas',
          mechanism: 'Proliferation of unstoppable autonomous swarms prompts immediate export quotas on Gallium/Germanium radar metals.',
          impactDelta: '+42% Metal Spike'
        },
        {
          fromPillar: 'GEOPOLITICS',
          fromNode: 'Gallium & Strait Quotas',
          toPillar: 'MONEY',
          toNode: 'Gold-Backed mBridge Repo',
          mechanism: 'Resource weaponization drives commodity exporters to settle trade outside SWIFT using vaulted physical bullion rails.',
          impactDelta: '$85B/mo Non-USD'
        },
        {
          fromPillar: 'MONEY',
          fromNode: 'Gold-Backed mBridge Repo',
          toPillar: 'AEROSPACE',
          toNode: '280km VLEO Laser Mesh',
          mechanism: 'Sovereign wealth funds recycle commodity surpluses into private VLEO laser constellations to guarantee sanction-proof data links.',
          impactDelta: '11ms Dark Mesh'
        }
      ]
    },
    charismaDojo: {
      modelName: 'CONTROL THE CHOKEPOINT, NOT THE NOISE',
      bookReference: 'The 48 Laws of Power & Thinking, Fast and Slow',
      author: 'Robert Greene / Daniel Kahneman',
      lawOrConcept: 'Law 11: Learn to Keep People Dependent on You + System 2 Bottleneck Mapping',
      thunglishBreakdown: 'Room-la ellarum satham potu pesumbothu, intelligent leader epovume silent-ah "Lever" enga iruku nu paapan. ASML machine illana chip illa; Gallium illana radar illa. Un career-layum sari, business-layum sari—easy-ah replace panna mudiyatha "Core Chokepoint Skill" un kitta iruntha, ulagame unna thedi varum!',
      tacticalAction: 'Audit your workflow today: Stop competing on commodity volume. Identify the 1 technical or strategic bottleneck your team fears losing, and master it 100%.'
    }
  },
  {
    batchId: 'BATCH-BETA-02',
    batchNumber: 2,
    codename: 'GRID_DOMINANCE_NUCLEAR_AI',
    timestampUtc: '2026-11-11T08:15:00Z',
    threatDefcon: 'DEFCON-3 // GIGAWATT COMPUTE & ARCTIC CORRIDORS',
    summaryTagline: 'Hyperscalers Acquire Small Modular Nuclear Reactors (SMRs) While Arctic Sea Lanes & Submarine Cable Defense Escalate',
    telemetryStream: [
      'PJM INTERCONNECTION DATA CENTER QUEUE LOAD: +34.8 GW',
      'URANIUM U3O8 SPOT CONTRACT: $104.50/LB [BULLISH BREAKOUT]',
      'SUBSEA FIBER ACOUSTIC SENSOR ARRAY (GIUK GAP): ACTIVE ALERT',
      'NORTHERN SEA ROUTE ICEBREAKER LNG TRANSITS: +62% YoY',
      'SOLID-STATE SILICON-ANODE BATTERY DENSITY: 450 Wh/kg VERIFIED'
    ],
    items: [
      {
        id: 'NX9-201',
        pillar: 'TECH',
        code: 'SIG-TECH-774',
        timestamp: '08:14:02 UTC',
        headline: 'Hyperscalers Bypass Public Power Grids with Dedicated Co-Located 300MW Modular Nuclear Reactors',
        severity: 'CRITICAL',
        signalScore: 97,
        region: 'Virginia / Osaka / Kalpakkam',
        thunglishBriefing: 'AI training clusters ippo oru chinna city alavuku current (2 Gigawatts!) kudikkuthu. Public EB grid-la ivlo load தாங்காது nu terinju, tech giants ippo direct-ah nuclear power plant-aye (SMR) data center compound ulla katti mudikkiranga. No transformer cut, 24/7 pure atomic baseload!',
        everydayAnalogy: 'Summer-la AC poda voltage pathala nu veetu motta maadila solar podura kaalam pochu—ippo factory-kullaye mini Koodankulam nuclear reactor vaikura level-ku AI vandhuruchu!',
        matrix3D: {
          pastRootCause: 'Transformer lead times stretched to 48 months while frontier AI clusters scaled from 100MW to 2,000MW per campus.',
          presentTrigger: 'Three 300MW Generation-IV Pebble-Bed SMRs sign 20-year behind-the-meter power purchase agreements directly with silicon clusters.',
          futurePrediction: 'By 2028, "Compute-per-Megawatt-Hour" replaces dollar capital as the primary currency of sovereign AI power.'
        },
        keyMetrics: [
          { label: 'Campus Load', value: '1.8 Gigawatts', delta: '+400% vs 2023' },
          { label: 'SMR Uptime', value: '99.98% Baseload', delta: 'Zero Grid Lag' },
          { label: 'Cooling Loop', value: 'Direct Liquid', delta: '45°C Reuse' }
        ]
      },
      {
        id: 'NX9-202',
        pillar: 'DEFENCE',
        code: 'SIG-DEF-618',
        timestamp: '08:11:30 UTC',
        headline: 'Autonomous Uncrewed Underwater Vehicles (UUVs) Patrol Trans-Oceanic Subsea Fiber Cables',
        severity: 'CRITICAL',
        signalScore: 94,
        region: 'North Atlantic / Luzon Strait',
        thunglishBriefing: 'Ulaga internet & daily $10 Trillion bank transfer ellame satellite-la pola, kadaluku adiyila pora 550 hair-thin fiber optic cable vazhiya dhaan poguthu! Ippo andha cables-ah anchor pottu cut panra sabotage adhigam aanathaala, AI robotic mini-submarines (UUVs) 24/7 kadal adiyila ரோந்து சுத்துது.',
        everydayAnalogy: 'IPL final match nadakkumbothu yaarachum street cable wire-ah cut pannida koodathu nu dog squad vachi kaval kaakura maadhiri, ippo samudhiram adiyila robo-submarines காவல் காக்குது!',
        matrix3D: {
          pastRootCause: '98% of global intercontinental data and SWIFT financial messaging traverses fewer than 600 vulnerable undersea cables.',
          presentTrigger: 'Deployment of persistent hydrogen-fuel-cell UUVs with synthetic aperture sonar along critical continental shelf landing stations.',
          futurePrediction: 'Naval warfare budgets shift 30% from surface aircraft carriers to seabed infrastructure warfare by 2028.'
        },
        keyMetrics: [
          { label: 'Data At Risk', value: '$10.4T / Day', delta: 'Subsea Clearing' },
          { label: 'UUV Endurance', value: '90 Days', delta: 'Autonomous Patrol' },
          { label: 'Depth Rating', value: '6,000 Meters', delta: 'Titanium Hull' }
        ]
      },
      {
        id: 'NX9-203',
        pillar: 'MONEY',
        code: 'SIG-MON-881',
        timestamp: '08:08:15 UTC',
        headline: 'Uranium Enriched Fuel Trusts & Grid Copper Futures Outperform Sovereign Tech Equities',
        severity: 'HIGH',
        signalScore: 91,
        region: 'London / Toronto / Mumbai',
        thunglishBriefing: 'Ellarum AI software stocks pinnadi ஓடும்போது, smart institutional money silent-ah Uranium fuel, High-Voltage Copper cables, matrum Transformer steel manufacturers-ah வாங்கி குவிச்சிட்டாங்க. Gold rush-la மண்வெட்டி வித்தவன் தான் பணக்காரன் ஆவான்!',
        everydayAnalogy: 'Biryani kadai-la kootam alluthu nu paathutu, kadai-la share vaangama, andha ஊருக்கே Basmati arisi-yum vengayamum supply panra wholesale godown-ah vaangura chanakya thanam!',
        matrix3D: {
          pastRootCause: 'A decade of underinvestment in physical mining and nuclear enrichment created a structural 40M-pound annual uranium deficit.',
          presentTrigger: 'Sovereign wealth funds lock in 10-year physical off-take contracts from Kazakhstan, Canada, and Namibia.',
          futurePrediction: 'Physical energy-backed tokens and industrial metal reserves become standard portfolio hedges against software deflation by 2028.'
        },
        keyMetrics: [
          { label: 'HALEU Deficit', value: '-34% Supply', delta: 'Critical Gap' },
          { label: 'Grid Copper', value: '$11,840/t', delta: '+29% YoY' },
          { label: 'Transformer Wait', value: '46 Months', delta: 'Order Backlog' }
        ]
      },
      {
        id: 'NX9-204',
        pillar: 'GEOPOLITICS',
        code: 'SIG-GEO-509',
        timestamp: '08:04:49 UTC',
        headline: 'Northern Sea Route (Arctic Corridor) Cuts Asia-Europe Maritime Transit Time by 40%',
        severity: 'HIGH',
        signalScore: 89,
        region: 'Murmansk / Bering Strait / Vladivostok',
        thunglishBriefing: 'Suez Canal pakkam Red Sea tension-aala கப்பல் சுத்திட்டு போனா 14 naal extra aaguthu. Ippo nuclear icebreaker கப்பல் துணையோட Arctic பனி கடல் வழியா Asia-to-Europe shortcut route full-year open aagiruchu. Shipping map-eh thalaikizha maari pochu!',
        everydayAnalogy: 'Anna Salai-la peak hour traffic block aana udane, local rider Kotturpuram river bank shortcut eduthu 20 nimishathula reach aagura maadhiri, global cargo ships Arctic shortcut edukkuthu!',
        matrix3D: {
          pastRootCause: 'Simultaneous chokepoint disruptions at Suez/Bab el-Mandeb and Panama Canal drought limits spiked container insurance 400%.',
          presentTrigger: 'Eight nuclear-powered Arktika-class icebreakers maintain a year-round navigable channel across the Russian Arctic shelf.',
          futurePrediction: 'Arctic port cities and Bering Strait radar stations become the most contested geopolitical real estate of 2027–2028.'
        },
        keyMetrics: [
          { label: 'Transit Saved', value: '-14 Days', delta: 'Asia-Rotterdam' },
          { label: 'Fuel Savings', value: '-38% Bunker', delta: 'Per Voyage' },
          { label: 'Arctic Cargo', value: '78M Tonnes', delta: '+62% YoY' }
        ]
      },
      {
        id: 'NX9-205',
        pillar: 'AEROSPACE',
        code: 'SIG-AERO-912',
        timestamp: '08:01:10 UTC',
        headline: 'Orbital Cryogenic Propellant Depots Validated for Cislunar Heavy-Lift Refueling',
        severity: 'ELEVATED',
        signalScore: 88,
        region: 'Boca Chica / Kennedy / Lunar Transfer',
        thunglishBriefing: 'Earth-la irunthu kelambumbothey full tank fuel thookitu pona, paadhi fuel Earth gravity-ah தாண்டுறதுக்கே காலி ஆகிரும். Ippo Low-Earth Orbit-la oru "Space Petrol Bunk" (Cryogenic Depot) vachitanga! Rocket orbit poitu anga tank full pannitu, 100-ton cargo-voda straight-ah Moon-ku poguthu!',
        everydayAnalogy: 'Chennai-la irunthu Delhi porathuku car-la 1000 liter petrol barrel katti eduthutu pogama, highway-la varra bunk-la tank full panra simple logic dhaan Orbital Refueling!',
        matrix3D: {
          pastRootCause: 'The Tsiolkovsky rocket equation limited single-launch deep-space payloads to less than 4% of liftoff mass.',
          presentTrigger: 'Successful zero-boiloff liquid methane & oxygen transfer between two docked upper stages in 400km orbit.',
          futurePrediction: 'Enables permanent lunar south-pole ice-mining rigs and high-delta-V maneuverable defense satellites by 2028.'
        },
        keyMetrics: [
          { label: 'Lunar Payload', value: '120 Tonnes', delta: '10x Apollo Era' },
          { label: 'Boiloff Loss', value: '<0.04% / Day', delta: 'Active Cryo-Cool' },
          { label: 'Transfer Rate', value: '450 kg / Min', delta: 'Microgravity' }
        ]
      }
    ],
    dotConnectorWeb: {
      title: 'PATTERN BETA // GIGAWATT-TO-ARCTIC INFRASTRUCTURE MATRIX',
      patternSummary: 'How AI’s insatiable power hunger rewires nuclear fuel markets, Arctic shipping lanes, and seabed military doctrines.',
      steps: [
        {
          fromPillar: 'TECH',
          fromNode: '2GW AI Campus Load',
          toPillar: 'MONEY',
          toNode: 'Uranium & Grid Copper Rush',
          mechanism: 'Hyperscaler behind-the-meter nuclear PPAs trigger an institutional supercycle in enriched uranium and high-voltage copper.',
          impactDelta: '$104/lb U3O8'
        },
        {
          fromPillar: 'MONEY',
          fromNode: 'Uranium & Grid Copper Rush',
          toPillar: 'GEOPOLITICS',
          toNode: 'Arctic Corridor Transit',
          mechanism: 'Bulk critical minerals and LNG require faster, sanction-insulated maritime corridors via nuclear-icebreaker Arctic lanes.',
          impactDelta: '-40% Transit Time'
        },
        {
          fromPillar: 'GEOPOLITICS',
          fromNode: 'Arctic Corridor Transit',
          toPillar: 'DEFENCE',
          toNode: 'Subsea UUV Cable Patrols',
          mechanism: 'New polar shipping lanes cross directly over critical trans-Arctic and North Atlantic fiber cables, forcing autonomous UUV patrols.',
          impactDelta: '6,000m Seabed Guard'
        },
        {
          fromPillar: 'DEFENCE',
          fromNode: 'Subsea UUV Cable Patrols',
          toPillar: 'AEROSPACE',
          toNode: 'Orbital Cryo-Depots',
          mechanism: 'Vulnerability of undersea cables accelerates high-power cislunar and orbital backup communication nodes refueled in space.',
          impactDelta: '120T Deep Orbit'
        }
      ]
    },
    charismaDojo: {
      modelName: 'SECOND-ORDER PICK-AND-SHOVEL THINKING',
      bookReference: 'Antifragile & The Most Important Thing',
      author: 'Nassim Nicholas Taleb / Howard Marks',
      lawOrConcept: 'Second-Order Thinking + Physical Infrastructure Convexity',
      thunglishBreakdown: 'First-level thinker "AI semmaya valaruthu, endha chatbot app best?" nu yosippan. Second-order thinker "Entha AI model jeichalum adhuku 2 Gigawatt current-um cooling-um venume, yaaru transformer & nuclear fuel vikkira?" nu yosippan. Crowd epovume front stage lights-ah paakum; neenga back-stage generator-ah கவனியுங்க!',
      tacticalAction: 'In every project or career move, ask "What is the physical or operational prerequisite that EVERY winner in this space must buy?" Position yourself there.'
    }
  },
  {
    batchId: 'BATCH-GAMMA-03',
    batchNumber: 3,
    codename: 'QUANTUM_LEDGER_HYPERSONIC',
    timestampUtc: '2026-11-11T08:50:00Z',
    threatDefcon: 'DEFCON-2 // POST-QUANTUM & HYPERSONIC SHIELD',
    summaryTagline: 'NIST Post-Quantum Lattice Migration Hits Banking Rails as Mach-9 Sodium-Cooled Hypersonics & Solid-State Robotics Scale',
    telemetryStream: [
      'POST-QUANTUM KYBER-1024 TLS HANDSHAKE ADOPTION: 64.8% TIER-1 BANKS',
      'SOVEREIGN DEBT ROLLOVER WALL (G7 2027 MATURITY): $9.8 TRILLION',
      'HYPERSONIC GLIDE THERMAL TRACKING (IR SATELLITE LAYER): LOCKED',
      'HUMANOID ACTUATOR HARMONIC DRIVE COST: $390/UNIT [-58% YoY]',
      'INDIAN OCEAN DEEP-SEA POLYMETALLIC NODULE EXTRACTION: PHASE-3'
    ],
    items: [
      {
        id: 'NX9-301',
        pillar: 'TECH',
        code: 'SIG-TECH-903',
        timestamp: '08:48:33 UTC',
        headline: 'Emergency Post-Quantum Lattice Cryptography (ML-KEM) Deployed Against "Harvest Now, Decrypt Later"',
        severity: 'CRITICAL',
        signalScore: 99,
        region: 'Global Financial & Defense Backbones',
        thunglishBriefing: 'Hackers ippo enna panranga na, innaiku encrypt aagi pora bank & military secrets-ah decrypt panna mudiyala nalum, hard disk-la copy panni vachikiranga ("Harvest Now, Decrypt Later"). Innum 3 varushathula Quantum computer vandha udane pazhaya RSA lock-ah 5 second-la udachiduvanga! Adhaan ippo உலகமே Lattice-based Post-Quantum lock-ku emergency-ah maaruthu.',
        everydayAnalogy: 'Innaiku unga veetu old Godrej poottai thirudanaala udaika mudiyala nalum, avan poottoda photo eduthu vachikitu, adutha varusham laser cutter vandha udane thiruda plan podura maadhiri!',
        matrix3D: {
          pastRootCause: 'RSA-2048 and ECC encryption rely on prime factorization math that logical quantum qubits can shatter via Shor’s algorithm.',
          presentTrigger: 'Central banks mandate 100% ML-KEM lattice post-quantum encryption on all wholesale settlement trunks before Q1 2027.',
          futurePrediction: 'Legacy un-upgraded satellites, IoT firmware, and old crypto wallets face a sudden "Y2Q" cryptographic obsolescence cliff by 2028.'
        },
        keyMetrics: [
          { label: 'Cipher Standard', value: 'ML-KEM-1024', delta: 'Quantum Resistant' },
          { label: 'Archived Traffic', value: '4.2 Exabytes', delta: 'At Risk Globally' },
          { label: 'Migration SLA', value: '180 Days', delta: 'Central Bank Mandate' }
        ]
      },
      {
        id: 'NX9-302',
        pillar: 'AEROSPACE',
        code: 'SIG-AERO-640',
        timestamp: '08:44:18 UTC',
        headline: 'Mach-9 Scramjet Thermal-Barrier Ceramic Composites Enable Reusable Hypersonic Flight',
        severity: 'CRITICAL',
        signalScore: 95,
        region: 'Edwards / Chitradurga / Woomera',
        thunglishBriefing: 'Mach-9 speed-la (11,000 km/hr) parakkumbothu kaathu உரசுற சூட்டுல (2,200°C) சாதாரண titanium-eh உருகிடும்! Ippo pudhu Ultra-High Temperature Ceramics (UHTC) + liquid sodium transpirational cooling கண்டுபிடிச்சிட்டாங்க—மனுஷன் வேர்த்து உடம்ப குளிர்விக்கிற மாதிரி, rocket wing-eh வேர்த்து தன்னைத்தானே cool பண்ணிக்குது!',
        everydayAnalogy: 'Veyil-la ஓடும்போது நம்ம தோல் வழியா வேர்வை வந்து உடம்பு சூட்டை தணிக்கிற மாதிரி, Mach-9 விமானம் தன் மேல் தோல் வழியா liquid coolant-அ கசிய விட்டு 2200°C நெருப்புலயும் உருகாம பறக்குது!',
        matrix3D: {
          pastRootCause: 'First-generation hypersonic vehicles were single-use missiles because ablative heat shields burned away during a single flight.',
          presentTrigger: 'Transpiration-cooled Hafnium-Carbide leading edges survive 45 minutes of sustained Mach-9 atmospheric cruise.',
          futurePrediction: 'Reusable hypersonic reconnaissance aircraft render static ground radar networks obsolete within 24 months.'
        },
        keyMetrics: [
          { label: 'Cruise Speed', value: 'Mach 9.2', delta: '11,200 km/h' },
          { label: 'Skin Temp', value: '2,250 °C', delta: 'Zero Ablation' },
          { label: 'Turnaround', value: '4 Hours', delta: 'Reusable Frame' }
        ]
      },
      {
        id: 'NX9-303',
        pillar: 'DEFENCE',
        code: 'SIG-DEF-890',
        timestamp: '08:40:05 UTC',
        headline: 'Space-Based Infrared Tracking Layer & Solid-State 300kW Directed Energy Interceptors Go Live',
        severity: 'HIGH',
        signalScore: 93,
        region: 'Low Earth Orbit / Indo-Pacific',
        thunglishBriefing: 'Mach-9 hypersonic missile வளைஞ்சு நெளிஞ்சு வர்றதால தரை ரேடாரால (Ground Radar) பூமி வளைவு காரணமா லேட்டாதான் பாக்க முடியும். Adhaan ippo space-la irunthe Infrared heat signature-ah track panni, கீழ இருக்குற கப்பல்ல இருக்குற 300kW Laser gun-க்கு target coordinates அனுப்பி, speed of light-ல சுட்டு வீழ்த்துறாங்க!',
        everydayAnalogy: 'Cricket ground-la boundary-la நிக்கிற ಫீல்டருக்கு பந்து எங்க வருதுன்னு தெரியாட்டியும், மேல Spider-Cam-ல இருந்து பாத்துட்டு வாக்கி-டாக்கில சொல்லி கரெக்டா பிடிக்க வைக்கிற மாதிரி!',
        matrix3D: {
          pastRootCause: 'Earth curvature hides low-flying hypersonic glide vehicles from ground radar until less than 90 seconds before impact.',
          presentTrigger: 'Mesh of 140 wide-field overhead persistent infrared (OPIR) satellites hands off target tracks directly to shipboard solid-state lasers.',
          futurePrediction: 'Cost per intercept drops from $4.2M (kinetic missile) to $14 (electrical pulse) across fleet air defense by 2028.'
        },
        keyMetrics: [
          { label: 'Laser Output', value: '300 kW Solid', delta: 'Speed of Light' },
          { label: 'Shot Cost', value: '$14.00', delta: '-99.9% vs SAM' },
          { label: 'Track Latency', value: '180 ms', delta: 'Orbit-to-Shooter' }
        ]
      },
      {
        id: 'NX9-304',
        pillar: 'MONEY',
        code: 'SIG-MON-942',
        timestamp: '08:36:50 UTC',
        headline: '$9.8 Trillion G7 Sovereign Debt Rollover Wall Forces Yield-Curve Control & Real-Asset Rotation',
        severity: 'HIGH',
        signalScore: 92,
        region: 'Washington / Tokyo / Frankfurt',
        thunglishBriefing: 'COVID time-la 0.5% வட்டிக்கு வாங்குன அரசாங்க கடனெல்லாம் (Sovereign Debt) இப்போ mature ஆகி திருப்பி கட்ட வேண்டிய நேரம் வந்தாச்சு. ஆனா இப்போ வட்டி 4.5% மேல இருக்கு! பழைய கடனை அடைக்க புது கடன் வாங்கினா பட்ஜெட்ல வட்டி மட்டுமே முதல் இடத்துக்கு வந்துரும். So central banks மறைமுகமா பாண்ட் வாங்கி வட்டியை அமுக்க (Yield Curve Control) தயாராகுறாங்க!',
        everydayAnalogy: 'பழைய கிரெடிட் கார்டு பில்லை கட்ட இன்னொரு புது கிரெடிட் கார்டு தேய்க்கிற மாதிரி—வட்டி குறையலைன்னா மத்திய வங்கியே புது நோட்டு அடிச்சு வாங்க வேண்டிய கட்டாயம்!',
        matrix3D: {
          pastRootCause: 'Governments locked in short-term Treasury bills during 2022–2025 assuming inflation and rates would rapidly return to zero.',
          presentTrigger: '$9.8T in sovereign maturities hits the auction block simultaneously alongside record defense and industrial capex deficits.',
          futurePrediction: 'Financial repression (keeping interest rates artificially below real inflation) drives institutional capital into scarce productive equity, land, and compute through 2028.'
        },
        keyMetrics: [
          { label: 'Maturity Wall', value: '$9.8 Trillion', delta: '12-Month Roll' },
          { label: 'Interest/Tax', value: '21.4% Revenue', delta: 'Crowding Out' },
          { label: 'Real Asset Flow', value: '+$1.4T Inflow', delta: 'Hard Hedge' }
        ]
      },
      {
        id: 'NX9-305',
        pillar: 'GEOPOLITICS',
        code: 'SIG-GEO-715',
        timestamp: '08:31:12 UTC',
        headline: 'Deep-Sea Polymetallic Nodule Mining Starts in Indian Ocean & Clarion-Clipperton Zone',
        severity: 'ELEVATED',
        signalScore: 88,
        region: 'Central Indian Ocean Basin / Pacific',
        thunglishBriefing: 'நிலத்துல சுரங்கம் தோண்டுனா 12 வருஷம் அனுமதி வாங்கணும். ஆனா 4,500 மீட்டர் கடலுக்கு அடியில உருளைக்கிழங்கு சைஸ்ல கிடக்குற கற்கள்ல (Polymetallic Nodules) Nickel, Cobalt, Copper, Manganese எல்லாமே கொட்டிக் கிடக்கு! இப்போ ஆழ்கடல் ரோபோ ஹார்வெஸ்டர் இறக்கி நிலத்து சுரங்க ஏகபோகத்தை உடைக்கிறாங்க!',
        everydayAnalogy: 'காய்கறி மார்க்கெட்ல எல்லா கடையிலயும் விலை ஏத்திட்டாங்கன்னு, கடலுக்கு அடியில இயற்கையாவே விளைஞ்சு கிடக்குற புதையலை ரோபோ வச்சு அள்ளுற மாஸ்டர் பிளான்!',
        matrix3D: {
          pastRootCause: 'Terrestrial high-grade nickel and cobalt mines are geographically concentrated and face 15-year permitting bottlenecks.',
          presentTrigger: 'Deep-sea riser vessels begin commercial harvesting of 4,500m abyssal plain nodules rich in battery & aerospace alloys.',
          futurePrediction: 'Maritime Exclusive Economic Zones (EEZs) and deep-sea mining licenses become top-tier diplomatic bargaining chips by 2028.'
        },
        keyMetrics: [
          { label: 'Abyssal Depth', value: '4,500 Meters', delta: 'Robotic Collector' },
          { label: 'Ore Grade', value: '4x Terrestrial', delta: 'Ni-Co-Cu-Mn' },
          { label: 'Refining Yield', value: '99.1% Zero-Tail', delta: 'Closed Loop' }
        ]
      }
    ],
    dotConnectorWeb: {
      title: 'PATTERN GAMMA // QUANTUM-HYPERSONIC-DEBT NEXUS',
      patternSummary: 'How Mach-9 physics and quantum decryption force a sovereign fiscal reset and deep-ocean mineral rush.',
      steps: [
        {
          fromPillar: 'AEROSPACE',
          fromNode: 'Mach-9 Ceramic Hypersonics',
          toPillar: 'DEFENCE',
          toNode: 'OPIR Space Layer + 300kW Laser',
          mechanism: 'Atmospheric Mach-9 maneuverability forces defense ministries to move target tracking to space and interception to speed-of-light lasers.',
          impactDelta: '$14/Shot Laser'
        },
        {
          fromPillar: 'DEFENCE',
          fromNode: 'OPIR Space Layer + 300kW Laser',
          toPillar: 'TECH',
          toNode: 'Post-Quantum Lattice Locks',
          mechanism: 'Orbital laser fire-control links require quantum-proof ML-KEM encryption so adversaries cannot hijack command uplinks.',
          impactDelta: '100% PQC Mandate'
        },
        {
          fromPillar: 'TECH',
          fromNode: 'Post-Quantum Lattice Locks',
          toPillar: 'MONEY',
          toNode: '$9.8T Debt Rollover & YCC',
          mechanism: 'Massive defense + grid + quantum re-industrialization spending collides with the $9.8T sovereign debt wall, forcing covert Yield Curve Control.',
          impactDelta: 'Real Asset Surge'
        },
        {
          fromPillar: 'MONEY',
          fromNode: '$9.8T Debt Rollover & YCC',
          toPillar: 'GEOPOLITICS',
          toNode: '4,500m Deep-Sea Nodules',
          mechanism: 'Fiat debasement and terrestrial mineral cartels drive sovereign wealth into deep-ocean robotic harvesting of Cobalt and Nickel.',
          impactDelta: '4x Ore Grade'
        }
      ]
    },
    charismaDojo: {
      modelName: 'ASYMMETRIC TEMPO & OODA LOOP COMPRESSION',
      bookReference: 'The Art of Strategy & Boyd: The Fighter Pilot Who Changed the Art of War',
      author: 'Robert Coram / Avinash Dixit',
      lawOrConcept: 'Boyd’s OODA Loop (Observe-Orient-Decide-Act) + Asymmetric Cost Ratios',
      thunglishBreakdown: 'போட்டியாளரை ஜெயிக்க அவனை விட பெருசா இருக்கணும்னு அவசியம் இல்ல—அவன் யோசிச்சு முடிவெடுக்குறதுக்குள்ள (OODA Loop) நீங்க அடுத்த 2 ஸ்டெப் போயிடணும்! 4 மில்லியன் டாலர் ஏவுகணையை 14 டாலர் லேசர் வச்சு அடிக்கிற மாதிரி, உங்க எனர்ஜியை கம்மியா செலவு பண்ணி எதிராளியை அதிகமா செலவு பண்ண வைக்கிறதுதான் உச்சகட்ட சாணக்கியத்தனம்!',
      tacticalAction: 'Compress your decision latency: When new data arrives today, separate reversible decisions from irreversible ones. Execute reversible moves in <15 minutes.'
    }
  }
];

const KEYWORD_PILLAR_MAP: Record<PillarId, string[]> = {
  TECH: ['chip', 'ai', 'silicon', 'quantum', 'gpu', 'semiconductor', 'nvidia', 'tsmc', 'software', 'cyber', 'code', 'npu', 'data', 'robot', 'compute'],
  DEFENCE: ['drone', 'military', 'missile', 'war', 'navy', 'defence', 'defense', 'laser', 'radar', 'weapon', 'army', 'swarm', 'submarine', 'security'],
  MONEY: ['bank', 'gold', 'dollar', 'fed', 'rate', 'bond', 'inflation', 'market', 'debt', 'liquidity', 'crypto', 'treasury', 'economy', 'rupee', 'yuan', 'tax'],
  GEOPOLITICS: ['sanction', 'china', 'india', 'russia', 'usa', 'europe', 'oil', 'strait', 'trade', 'tariff', 'border', 'treaty', 'arctic', 'mineral', 'export'],
  AEROSPACE: ['space', 'orbit', 'satellite', 'rocket', 'lunar', 'moon', 'hypersonic', 'starlink', 'isro', 'spacex', 'aviation', 'flight', 'mach']
};

export function detectPrimaryPillar(rawText: string): PillarId {
  const lower = rawText.toLowerCase();
  let bestPillar: PillarId = 'TECH';
  let maxHits = 0;

  (Object.keys(KEYWORD_PILLAR_MAP) as PillarId[]).forEach((pillar) => {
    const hits = KEYWORD_PILLAR_MAP[pillar].reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    );
    if (hits > maxHits) {
      maxHits = hits;
      bestPillar = pillar;
    }
  });

  return bestPillar;
}

export function synthesizeRawNews(rawText: string): {
  item: IntelligenceItem;
  dotWeb: IntelligenceBatch['dotConnectorWeb'];
  charisma: CharismaLesson;
} {
  const cleaned = rawText.trim();
  const primaryPillar = detectPrimaryPillar(cleaned);
  const firstSentence = cleaned.split(/[.!?\n]/)[0]?.trim() || 'Unclassified Global Signal Intercepted';
  const headline =
    firstSentence.length > 96 ? `${firstSentence.slice(0, 93)}...` : firstSentence;

  const secondaryOrder: Record<PillarId, [PillarId, PillarId, PillarId]> = {
    TECH: ['DEFENCE', 'GEOPOLITICS', 'MONEY'],
    DEFENCE: ['GEOPOLITICS', 'MONEY', 'AEROSPACE'],
    MONEY: ['GEOPOLITICS', 'TECH', 'DEFENCE'],
    GEOPOLITICS: ['MONEY', 'DEFENCE', 'TECH'],
    AEROSPACE: ['DEFENCE', 'TECH', 'GEOPOLITICS']
  };

  const [p2, p3, p4] = secondaryOrder[primaryPillar];

  const analogyBank: Record<PillarId, string> = {
    TECH: 'Namma oorla express highway-la toll gate-ah yaaru control panrangalo avanga dhaan traffic speed decide panra maadhiri, indha tech layer ippo total industry bottleneck-ah control pannuthu!',
    DEFENCE: 'Pazhaya kaalathu Kottai madhil-ah nambi ukkanthurukumbothu, mela vazhiya drone-la parcel podura maadhiri—asymmetric warfare rules full-ah maari pochu Boss!',
    MONEY: 'Kalyana veetula பந்தி நடக்கும்போது சமையல்காரன் பின்னாடி அரிசி மூட்டை கணக்கை பாக்குறவன் தான் உண்மையான கில்லாடி—headline பின்னாடி இருக்குற liquidity flow-அ பாருங்க!',
    GEOPOLITICS: 'Chess board-la రాణి-யை காட்டுற மாதிரி காட்டிட்டு, பின்னாடி சிப்பாயை வச்சு செக் வைக்கிற சாணக்கிய மூவ் இது—supply chain saavi yaaru kitta iruko avanga dhaan ராஜா!',
    AEROSPACE: 'ஊருக்கு மேல உயரமான வாட்ச் டவர் கட்டுனவன் தான் அடுத்த 10 ஊர்ல என்ன நடக்குதுன்னு முதல்ல பார்ப்பான்—Low-Orbit control தான் அடுத்த சூப்பர்பவர் சீக்ரெட்!'
  };

  const item: IntelligenceItem = {
    id: `NX9-RAW-${Date.now().toString().slice(-4)}`,
    pillar: primaryPillar,
    code: `SIG-SYNTH-${primaryPillar.slice(0, 3)}`,
    timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
    headline: headline.length >= 8 ? headline : `Strategic Intercept: ${cleaned.slice(0, 60)}`,
    severity: 'CRITICAL',
    signalScore: 96,
    region: 'GLOBAL INTERCEPT // LIVE SYNTHESIS',
    thunglishBriefing: `Boss, indha raw signal-oda core pattern enna solluthu na: "${cleaned.slice(0, 180)}${cleaned.length > 180 ? '...' : ''}". Веறும் surface news-ah paakathinga—idhu ${PILLARS[primaryPillar].shortLabel} sector-la irunthu start aagi, direct-ah ${PILLARS[p2].shortLabel} matrum ${PILLARS[p3].shortLabel} equations-ah maatha poguthu. Smart players ippo headline-ku react pannama, 2nd-order bottleneck-ah lock panranga!`,
    everydayAnalogy: analogyBank[primaryPillar],
    matrix3D: {
      pastRootCause: `Structural dependency & legacy concentration inside ${PILLARS[primaryPillar].name} created a hidden pressure cooker over the last 36 months.`,
      presentTrigger: `Immediate catalyst detected: "${headline}" — forcing institutional and sovereign actors to re-price risk overnight.`,
      futurePrediction: `Within 24 months, ${PILLARS[p2].shortLabel} and ${PILLARS[p3].shortLabel} will bifurcate into sovereign-backed corridors with +35% higher entry barriers.`
    },
    keyMetrics: [
      { label: 'Primary Vector', value: PILLARS[primaryPillar].shortLabel, delta: '96% Confidence' },
      { label: 'Contagion Speed', value: '< 72 Hours', delta: `Hits ${PILLARS[p2].shortLabel}` },
      { label: '2Yr Structural Shift', value: 'High Convexity', delta: 'Tier-1 Signal' }
    ]
  };

  const dotWeb: IntelligenceBatch['dotConnectorWeb'] = {
    title: `LIVE SYNTHESIS // ${primaryPillar} ➔ ${p2} ➔ ${p3} CAUSAL WEB`,
    patternSummary: `Automated cross-pillar contagion trace extracted from your raw intelligence intercept.`,
    steps: [
      {
        fromPillar: primaryPillar,
        fromNode: headline.slice(0, 28) + (headline.length > 28 ? '…' : ''),
        toPillar: p2,
        toNode: `${PILLARS[p2].shortLabel} Re-Allocation`,
        mechanism: `Shockwave in ${PILLARS[primaryPillar].shortLabel} forces immediate capability hardening in ${PILLARS[p2].name}.`,
        impactDelta: '1st-Order Shock'
      },
      {
        fromPillar: p2,
        fromNode: `${PILLARS[p2].shortLabel} Re-Allocation`,
        toPillar: p3,
        toNode: `${PILLARS[p3].shortLabel} Policy Shift`,
        mechanism: `Escalation triggers sovereign regulatory quotas and strategic corridor realignments across ${PILLARS[p3].shortLabel}.`,
        impactDelta: '2nd-Order Pivot'
      },
      {
        fromPillar: p3,
        fromNode: `${PILLARS[p3].shortLabel} Policy Shift`,
        toPillar: p4,
        toNode: `${PILLARS[p4].shortLabel} Capital Surge`,
        mechanism: `Capital and engineering talent rotate aggressively into ${PILLARS[p4].name} to front-run the 2-year bottleneck.`,
        impactDelta: '24-Mo Alpha'
      }
    ]
  };

  const charisma: CharismaLesson = {
    modelName: 'FIRST-PRINCIPLES SIGNAL EXTRACTION',
    bookReference: 'Thinking, Fast and Slow & The 48 Laws of Power',
    author: 'Daniel Kahneman / Robert Greene',
    lawOrConcept: 'Law 35: Master the Art of Timing + Signal-to-Noise Inversion',
    thunglishBreakdown: `Breaking news vandha udane 99% per panic aagi சத்தம் போடுவாங்க. Aana War Room Commander epovume 3 கேள்விதான் கேப்பான்: (1) Idhu edhanaala vandhuchu [PAST]? (2) Ippo yaaru pressure-la iruka [PRESENT]? (3) Adutha 2 varushathula yaaru kitta saavi pogum [FUTURE]? Indha calmness dhaan unga real executive charisma!`,
    tacticalAction: `When briefing stakeholders on "${headline.slice(0, 40)}...", speak 20% slower, skip the emotional drama, and present only the 3-step Past-Present-Future causal chain.`
  };

  return { item, dotWeb, charisma };
}
