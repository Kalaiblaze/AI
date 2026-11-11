export type NeatPillarId =
  | 'MONEY'
  | 'GEOPOLITICS'
  | 'DEFENCE'
  | 'AEROSPACE'
  | 'TECH';

export type NeatSubTabId = 'STORY' | 'DOTS' | 'BRAIN';

export interface SparklinePoint {
  day: string;
  value: number;
}

export interface TelemetryStat {
  value: string;
  label: string;
  subtext: string;
  velocity: string;
  trend7d: SparklinePoint[];
  tone: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export interface ActorBreakdownItem {
  actor: string;
  role: string;
  stance: 'INITIATOR' | 'COUNTER-MOVE' | 'BRIDGE / WINNER';
}

export interface ConnectedDotStep {
  stepNumber: number;
  fromPillar: NeatPillarId;
  fromChip: string;
  fromLabel: string;
  toPillar: NeatPillarId;
  toChip: string;
  toLabel: string;
  thunglishLine: string;
}

export interface NeatPillarData {
  id: NeatPillarId;
  tabLabel: string;
  shortName: string;
  chipLabel: string;
  rssUrl: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  headline: string;
  updatedAt: string;
  telemetry: [TelemetryStat, TelemetryStat, TelemetryStat];
  actorsBreakdown: [ActorBreakdownItem, ActorBreakdownItem, ActorBreakdownItem];
  thunglishAnalogy: [string, string];
  timeline: {
    pastRootCause: string;
    presentNews: string;
    futureImpact: string;
  };
  connectedSteps: ConnectedDotStep[];
  eliteBrain: {
    winnerTitle: string;
    winnerPoints: [string, string];
    failureTitle: string;
    failurePoints: [string, string];
    charismaBook: string;
    charismaAuthor: string;
    mentalModelTitle: string;
    mentalModelRule: string;
    speakingTip: string;
  };
}

export interface IncomingWireItem {
  id: string;
  pillarId: NeatPillarId;
  chipLabel: string;
  timestampIST: string;
  sourceBadge: string;
  headline: string;
  keyMetricBadge: string;
  pillarSnapshot: NeatPillarData;
}

export const PILLAR_ROTATION_ORDER: NeatPillarId[] = [
  'MONEY',
  'GEOPOLITICS',
  'DEFENCE',
  'AEROSPACE',
  'TECH'
];

export function formatCountdown(seconds: number): string {
  const clamped = Math.max(0, Math.min(60, Math.floor(seconds)));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatISTTimestamp(date: Date = new Date()): string {
  try {
    const timeStr = date.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    return `${timeStr} IST`;
  } catch {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss} IST`;
  }
}

export const NEAT_PILLARS: Record<NeatPillarId, NeatPillarData> = {
  MONEY: {
    id: 'MONEY',
    tabLabel: 'Economics & Money',
    shortName: 'Economics & Money',
    chipLabel: '💰 Money',
    rssUrl: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-300',
    borderAccent: 'border-emerald-500/30',
    headline:
      'Sovereign Gold Repo Corridors & The $9.8 Trillion Debt Refinancing Wall',
    updatedAt: 'Macro & Central Bank Desk · Live Signal',
    telemetry: [
      {
        value: '$9.8T',
        label: 'Refinancing Wall',
        subtext: 'Maturing US & G7 sovereign debt rolling over in 2026',
        velocity: '+19.4% 7d velocity',
        trend7d: [
          { day: 'D1', value: 7.4 },
          { day: 'D2', value: 7.8 },
          { day: 'D3', value: 8.1 },
          { day: 'D4', value: 8.5 },
          { day: 'D5', value: 9.0 },
          { day: 'D6', value: 9.4 },
          { day: 'D7', value: 9.8 }
        ],
        tone: 'cyan'
      },
      {
        value: '0.5% ➔ 4.8%',
        label: 'Sovereign Rate Shock',
        subtext: 'Refinancing coupon jump on 3-year US Treasury notes',
        velocity: '+430 bps surge',
        trend7d: [
          { day: 'D1', value: 0.5 },
          { day: 'D2', value: 1.2 },
          { day: 'D3', value: 2.1 },
          { day: 'D4', value: 3.1 },
          { day: 'D5', value: 3.9 },
          { day: 'D6', value: 4.4 },
          { day: 'D7', value: 4.8 }
        ],
        tone: 'amber'
      },
      {
        value: '$85B / mo',
        label: 'Gold Repo Settlement',
        subtext: 'China, UAE & ASEAN oil trade cleared via mBridge rails',
        velocity: '+31.2% 7d flow',
        trend7d: [
          { day: 'D1', value: 52 },
          { day: 'D2', value: 58 },
          { day: 'D3', value: 63 },
          { day: 'D4', value: 69 },
          { day: 'D5', value: 74 },
          { day: 'D6', value: 80 },
          { day: 'D7', value: 85 }
        ],
        tone: 'emerald'
      }
    ],
    actorsBreakdown: [
      {
        actor: '🇺🇸 US Treasury & G7',
        role: 'Must refinance $9.8T of maturing debt at 4.8% interest rates',
        stance: 'INITIATOR'
      },
      {
        actor: '🇨🇳 China, 🇦🇪 UAE & 🇸🇦 Saudi',
        role: 'Settling $85B/mo oil & mineral trade on mBridge + Shanghai/Dubai Gold vaults',
        stance: 'COUNTER-MOVE'
      },
      {
        actor: '🇮🇳 India (RBI) & 🇸🇬 Singapore',
        role: 'Accumulating record physical Gold reserves while linking UPI/PayNow bilateral FX rails',
        stance: 'BRIDGE / WINNER'
      }
    ],
    thunglishAnalogy: [
      'Boss, 🇺🇸 America matrum G7 countries 2021-la 0.5% vattiku vaanguna $9.8 Trillion kadan-ah ippo 4.8% vattiyila renew panna vendiya nilamai—maasa budget-la vattiye defense selava thaanduthu!',
      'Adhanaala 🇮🇳 India (RBI), 🇨🇳 China, 🇸🇬 Singapore, matrum 🇦🇪 UAE central banks verum US paper bond-ah mattum nambama, physical Gold bars vaangi mBridge vazhiya direct local-currency trade settle panranga.'
    ],
    timeline: {
      pastRootCause:
        'During 2020–2022, G7 governments borrowed trillions using short-term 3-year bonds assuming interest rates would stay near zero forever. Freezing $300B of Russian sovereign reserves in 2022 also made Asian central banks rethink paper currency risk.',
      presentNews:
        'Over $9.8 Trillion of US & G7 sovereign debt is maturing right now at 3x higher interest rates, pushing interest payments above defense budgets. Meanwhile, China, UAE, and ASEAN central banks are clearing $85B/month in oil and mineral trade via gold-backed mBridge rails.',
      futureImpact:
        'Over the next 24 months, Western central banks will quietly cap bond yields while real inflation stays sticky. Scarce physical assets—like wafer fabs, power grids, and physical gold—will outperform cash.'
    },
    connectedSteps: [
      {
        stepNumber: 1,
        fromPillar: 'MONEY',
        fromChip: '💰 Money',
        fromLabel: 'High US Bond Yields',
        toPillar: 'GEOPOLITICS',
        toChip: '🌍 Geopolitics',
        toLabel: 'Gold & Local-FX Oil Trade',
        thunglishLine:
          '🇺🇸 Dollar vatti adhigam aanathaala, 🇮🇳 India, 🇦🇪 UAE, matrum 🇨🇳 China ippo oil & mineral trade-ah direct local currency matrum gold-la settle panranga.'
      },
      {
        stepNumber: 2,
        fromPillar: 'GEOPOLITICS',
        fromChip: '🌍 Geopolitics',
        fromLabel: 'Sovereign Subsidies',
        toPillar: 'TECH',
        toChip: '💻 Tech',
        toLabel: 'Domestic 2nm Chip Fabs',
        thunglishLine:
          'Supply chain bayathula 🇺🇸 US, 🇮🇳 India, matrum 🇯🇵 Japan governments $45B+ subsidy kuduthu sondha oorulaye semiconductor chip factory katturanga.'
      },
      {
        stepNumber: 3,
        fromPillar: 'TECH',
        fromChip: '💻 Tech',
        fromLabel: 'Low-Cost Edge Silicon',
        toPillar: 'DEFENCE',
        toChip: '🛡️ Defence',
        toLabel: '$1,500 Autonomous Swarms',
        thunglishLine:
          'Government defense budget-la vatti selavu ekkachakkama ponathaala, $2M missile-ku badhila $1,500 AI drone-ku shift aaguranga.'
      }
    ],
    eliteBrain: {
      winnerTitle: 'Charlie Munger & Singapore MAS Sovereign Architects',
      winnerPoints: [
        'Kept liquid short-term cash reserves ready while owning hard, cash-producing infrastructure that thrives during inflation.',
        'Built neutral, multi-currency instant settlement corridors so global capital flows into their vaults during every crisis.'
      ],
      failureTitle: 'Silicon Valley Bank (SVB) Treasury Collapse',
      failurePoints: [
        'Locked $91 Billion of short-term customer deposits into 10-year bonds paying just 1.56% without any interest-rate protection.',
        'Chased tiny extra yield without asking what happens if interest rates rise by 4%, wiping out the bank in 24 hours.'
      ],
      charismaBook: 'Thinking, Fast and Slow',
      charismaAuthor: 'Daniel Kahneman',
      mentalModelTitle: 'Inversion & Downside Protection First',
      mentalModelRule:
        'Before chasing a 10% gain, calculate what single event could cause a 100% wipeout and remove that fragility first.',
      speakingTip:
        'In high-stakes meetings, speak 15% slower and present the 3 downside risks before pitching your upside—calm realism signals instant authority.'
    }
  },
  GEOPOLITICS: {
    id: 'GEOPOLITICS',
    tabLabel: 'Geopolitics',
    shortName: 'Geopolitics',
    chipLabel: '🌍 Geopolitics',
    rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300',
    borderAccent: 'border-amber-500/30',
    headline:
      'US-Dutch ASML Chip Ban vs. China Gallium Lock & The India-UAE-Europe (IMEC) Corridor',
    updatedAt: 'Strategic Corridors Desk · Live Signal',
    telemetry: [
      {
        value: '86% Share',
        label: 'China Gallium Lock',
        subtext: 'Refined Gallium & 68% Germanium controlled by China',
        velocity: '+28.5% 7d spot premium',
        trend7d: [
          { day: 'D1', value: 68 },
          { day: 'D2', value: 72 },
          { day: 'D3', value: 75 },
          { day: 'D4', value: 79 },
          { day: 'D5', value: 82 },
          { day: 'D6', value: 84 },
          { day: 'D7', value: 86 }
        ],
        tone: 'amber'
      },
      {
        value: '+14 Days',
        label: 'Red Sea Reroute Delay',
        subtext: 'Yemen Houthi chokepoint forcing Cape & IMEC rail routes',
        velocity: '+42% freight velocity',
        trend7d: [
          { day: 'D1', value: 4 },
          { day: 'D2', value: 6 },
          { day: 'D3', value: 8 },
          { day: 'D4', value: 10 },
          { day: 'D5', value: 11 },
          { day: 'D6', value: 13 },
          { day: 'D7', value: 14 }
        ],
        tone: 'rose'
      },
      {
        value: '12 Months',
        label: 'Strategic Buffer Stock',
        subtext: 'US, India & Japan defense wafer mineral stockpiling',
        velocity: '+3.0x inventory build',
        trend7d: [
          { day: 'D1', value: 3 },
          { day: 'D2', value: 4 },
          { day: 'D3', value: 6 },
          { day: 'D4', value: 7 },
          { day: 'D5', value: 9 },
          { day: 'D6', value: 11 },
          { day: 'D7', value: 12 }
        ],
        tone: 'cyan'
      }
    ],
    actorsBreakdown: [
      {
        actor: '🇺🇸 USA & 🇳🇱 Netherlands (ASML)',
        role: 'Blocked exports of EUV extreme-ultraviolet chip-printing machines & AI GPUs to China',
        stance: 'INITIATOR'
      },
      {
        actor: '🇨🇳 China (Ministry of Commerce)',
        role: 'Counter-locked 86% of global refined Gallium & 68% Germanium needed for US/NATO military radars',
        stance: 'COUNTER-MOVE'
      },
      {
        actor: '🇮🇳 India, 🇦🇪 UAE & 🇸🇦 Saudi (IMEC)',
        role: 'Multi-aligned bridge building the India-Middle-East-Europe rail/sea corridor & new chip fabs',
        stance: 'BRIDGE / WINNER'
      }
    ],
    thunglishAnalogy: [
      'Boss, 🇺🇸 America matrum 🇳🇱 Netherlands (ASML company) "naanga ungaluku advanced EUV chip-print panra machine thara maatom" nu 🇨🇳 China mela ban potaanga; udane 🇨🇳 China "appo andha chip-um military AESA radar-um seiya thevayana 86% Gallium & Germanium mineral-ah naangalum 🇺🇸 US/West-ku thara maatom" nu counter-lock potutaanga!',
      'Idhuku naduvula 🇮🇳 India, 🇦🇪 UAE, matrum 🇸🇦 Saudi Arabia maadhiri smart middle-powers entha bloc-layum maatikama, rendu pakkamum business panni pudhu India-Middle-East-Europe (IMEC) trade route-ah uruvaakuraanga.'
    ],
    timeline: {
      pastRootCause:
        'Over the past 20 years, Western nations (US/EU) outsourced messy mineral refining to China to save environmental costs. This concentrated 86% of refined Gallium and 68% of Germanium inside China while the US & Netherlands monopolized ASML lithography machines.',
      presentNews:
        'After the US and Netherlands restricted ASML chip machines to Beijing, China enforced strict export licenses on every kilogram of Gallium and Germanium needed for Western military radars. Simultaneously, Red Sea tensions are pushing cargo toward the India-UAE-Saudi-Europe (IMEC) corridor.',
      futureImpact:
        'Over the next 2 years, defense and chip companies will fund new Gallium refineries in India, Australia, and Canada. Global shipping will split into parallel US-aligned and BRICS-aligned supply networks.'
    },
    connectedSteps: [
      {
        stepNumber: 1,
        fromPillar: 'GEOPOLITICS',
        fromChip: '🌍 Geopolitics',
        fromLabel: '🇨🇳 China Gallium Quotas',
        toPillar: 'DEFENCE',
        toChip: '🛡️ Defence',
        toLabel: '🇺🇸 NATO GaN Naval Radar',
        thunglishLine:
          '🇨🇳 China Gallium export-ah lock pannathaala, 🇺🇸 US & NATO warships-la irukura AESA radar seiya defense companies mineral stockpile panranga.'
      },
      {
        stepNumber: 2,
        fromPillar: 'DEFENCE',
        fromChip: '🛡️ Defence',
        fromLabel: 'Red Sea & Indo-Pacific',
        toPillar: 'AEROSPACE',
        toChip: '🚀 Aerospace',
        toLabel: '280km VLEO Radar Sats',
        thunglishLine:
          '🇮🇳 India-Middle-East (IMEC) matrum Red Sea kadal vazhi trade route-ah kaapatha 280km Low-Orbit radar satellites 24/7 kappalgalai kankaanikkuthu.'
      },
      {
        stepNumber: 3,
        fromPillar: 'AEROSPACE',
        fromChip: '🚀 Aerospace',
        fromLabel: 'Orbital Supply Telemetry',
        toPillar: 'MONEY',
        toChip: '💰 Money',
        toLabel: 'Commodity Buffer Capital',
        thunglishLine:
          'Companies ippo "Just-in-Time" vittutu 12-maasam metal stock vaangi vaikurathaala working capital demand egiruthu.'
      }
    ],
    eliteBrain: {
      winnerTitle: 'Morris Chang (TSMC Taiwan) & India/UAE Multi-Aligned Strategists',
      winnerPoints: [
        'TSMC made Taiwan’s wafer foundry capability so essential that both the US and global tech giants depend on its factories.',
        'India and the UAE kept diplomatic doors open across Washington, Moscow, and Beijing to buy discounted crude and export high-margin tech & refined fuel.'
      ],
      failureTitle: 'Germany Single-Pipeline Energy Dependency (2011–2022)',
      failurePoints: [
        'Shut down domestic nuclear power plants while relying on a single Russian pipeline (Nord Stream) for 55% of industrial natural gas.',
        'Built zero backup LNG terminals until the 2022 crisis hit, forcing German chemical and auto factories to pay 3x higher electricity prices.'
      ],
      charismaBook: 'Zero to One',
      charismaAuthor: 'Peter Thiel',
      mentalModelTitle: 'Own the Irreplaceable Bottleneck',
      mentalModelRule:
        'True leverage never comes from competing in a crowded market; it comes from owning the one critical link (like ASML EUV or Gallium refining) nobody can bypass.',
      speakingTip:
        'Never sound needy when negotiating; calmly state the unique bottleneck your work solves and let silence do the heavy lifting.'
    }
  },
  DEFENCE: {
    id: 'DEFENCE',
    tabLabel: 'Defence',
    shortName: 'Defence',
    chipLabel: '🛡️ Defence',
    rssUrl: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml',
    accentColor: '#F43F5E',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-300',
    borderAccent: 'border-rose-500/30',
    headline:
      'Unjammable Fiber-Optic Drone Swarms & $14-Per-Shot 300kW Solid-State Lasers',
    updatedAt: 'Autonomous Warfare Desk · Live Signal',
    telemetry: [
      {
        value: '$2M vs $1.5K',
        label: 'Asymmetric Cost Ratio',
        subtext: 'US Patriot/SM-2 missile vs $1,500 FPV fiber-optic drone',
        velocity: '-99.9% intercept cost shift',
        trend7d: [
          { day: 'D1', value: 95 },
          { day: 'D2', value: 80 },
          { day: 'D3', value: 62 },
          { day: 'D4', value: 45 },
          { day: 'D5', value: 28 },
          { day: 'D6', value: 15 },
          { day: 'D7', value: 8 }
        ],
        tone: 'rose'
      },
      {
        value: '$14 / Shot',
        label: '300kW Laser Intercept',
        subtext: 'US HELIOS / UK DragonFire / Israeli Iron Beam pulse cost',
        velocity: '+64% deployment velocity',
        trend7d: [
          { day: 'D1', value: 18 },
          { day: 'D2', value: 27 },
          { day: 'D3', value: 39 },
          { day: 'D4', value: 52 },
          { day: 'D5', value: 68 },
          { day: 'D6', value: 84 },
          { day: 'D7', value: 96 }
        ],
        tone: 'emerald'
      },
      {
        value: 'Mach 6 / 20km',
        label: 'Hypersonic & Fiber Link',
        subtext: '20km glass fiber spool immune to Russian/Ukrainian EW jammers',
        velocity: '+38.2% frontline adoption',
        trend7d: [
          { day: 'D1', value: 5 },
          { day: 'D2', value: 8 },
          { day: 'D3', value: 11 },
          { day: 'D4', value: 14 },
          { day: 'D5', value: 16 },
          { day: 'D6', value: 18 },
          { day: 'D7', value: 20 }
        ],
        tone: 'cyan'
      }
    ],
    actorsBreakdown: [
      {
        actor: '🇺🇦 Ukraine & 🇷🇺 Russia Frontline',
        role: 'Pioneered 20km glass fiber-optic tethered FPV drones that completely bypass radio/GPS jammers',
        stance: 'INITIATOR'
      },
      {
        actor: '🇺🇸 US Navy (HELIOS) & 🇬🇧 UK / 🇮🇱 Israel',
        role: 'Deploying 100kW–300kW solid-state lasers (Iron Beam / DragonFire) at $14 per shot instead of $2M missiles',
        stance: 'COUNTER-MOVE'
      },
      {
        actor: '🇮🇳 India (DRDO) & US Defense Tech (Anduril)',
        role: 'Scaling indigenous directed-energy shields & low-cost autonomous Edge-AI swarm interceptors',
        stance: 'BRIDGE / WINNER'
      }
    ],
    thunglishAnalogy: [
      'Boss, Red Sea-la 🇺🇸 US Navy $2 Million Patriot/SM-2 missile-ah vachi $1,500 drone-ah sudurathu—kosuvai adikka thangathala peerangi vaangura maadhiri; naalu naal-la kajaana gaali aagidum!',
      'Adhaan ippo 🇺🇦 Ukraine-🇷🇺 Russia frontline-la radio jammer-aala thadukka mudiyatha 20km fiber-optic wire drones-um, 🇺🇸 US/🇮🇱 Israel/🇮🇳 DRDO pakkam oru shot-ku verum $14 current selavaagura 300kW laser gun-um kalathula irangiruchu.'
    ],
    timeline: {
      pastRootCause:
        'For 30 years, legacy Western defense contractors built slow, billion-dollar weapons assuming wars would be fought against a few expensive targets. Early drones in Ukraine relied on GPS and radio links that Russian electronic warfare (EW) jammers easily blocked.',
      presentNews:
        'Ukrainian and Russian frontline swarms now unspool hair-thin 20km glass fiber-optic cables or use offline AI camera navigation that zero radio jammers can stop. Meanwhile, the US Navy, UK (DragonFire), Israel (Iron Beam), and India (DRDO) are fielding 300kW solid-state lasers at $14 per pulse.',
      futureImpact:
        'Within 3 years, every naval ship and armored vehicle will carry a directed-energy laser shield and its own counter-drone launch bay. Defense software will update every 48 hours like smartphone apps.'
    },
    connectedSteps: [
      {
        stepNumber: 1,
        fromPillar: 'DEFENCE',
        fromChip: '🛡️ Defence',
        fromLabel: '🇺🇦/🇷🇺 GPS-Denied Swarms',
        toPillar: 'TECH',
        toChip: '💻 Tech',
        toLabel: 'Sub-4ms V4L2 Edge Vision',
        thunglishLine:
          'Radio signal cut aanaalum drone parakka, embedded Linux camera sensor-la irundhu NPU-ku 4ms-la image poganum.'
      },
      {
        stepNumber: 2,
        fromPillar: 'TECH',
        fromChip: '💻 Tech',
        fromLabel: 'Solid-State Laser Power',
        toPillar: 'AEROSPACE',
        toChip: '🚀 Aerospace',
        toLabel: '🇺🇸 SDA Orbital IR Tracking',
        thunglishLine:
          'Kappal-la irukura 300kW laser gun correct-ah aim panna, space-la irukura infrared satellite 180ms-la target location anupputhu.'
      },
      {
        stepNumber: 3,
        fromPillar: 'AEROSPACE',
        fromChip: '🚀 Aerospace',
        fromLabel: 'Low-Cost Space Sensors',
        toPillar: 'MONEY',
        toChip: '💰 Money',
        toLabel: '1000x Intercept Deflation',
        thunglishLine:
          'Oru intercept selavu $2 Million-la irundhu $14-ku koranjarathaala, defense budget math full-ah software-first primes pakkam thirumbuthu.'
      }
    ],
    eliteBrain: {
      winnerTitle: 'Palmer Luckey (Anduril US) & John Boyd (OODA Loop)',
      winnerPoints: [
        'Used commercial AI chips and modular carbon frames to build working autonomous drones years before government paperwork finished.',
        'Focused on software iteration speed and unit cost so defenders can afford 10,000 interceptors instead of 10.'
      ],
      failureTitle: 'USS Zumwalt Stealth Destroyer Gun System (AGS)',
      failurePoints: [
        'Designed a custom guided artillery shell so complex that each single bullet cost $800,000 to manufacture.',
        'The US Navy had to cancel the ammunition completely, leaving a $7.5 Billion warship with two giant guns that could fire nothing.'
      ],
      charismaBook: 'The Charisma Myth',
      charismaAuthor: 'Olivia Fox Cabane',
      mentalModelTitle: 'OODA Loop Tempo (Observe–Orient–Decide–Act)',
      mentalModelRule:
        'You do not need to be bigger than your competitor if you observe reality and iterate twice as fast as they hold meetings.',
      speakingTip:
        'When answering tough questions, pause for 2 full seconds, maintain warm eye contact, and give a crisp 1-sentence bottom line first.'
    }
  },
  AEROSPACE: {
    id: 'AEROSPACE',
    tabLabel: 'Aerospace',
    shortName: 'Aerospace',
    chipLabel: '🚀 Aerospace',
    rssUrl: 'https://spacenews.com/feed/',
    accentColor: '#A855F7',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-300',
    borderAccent: 'border-purple-500/30',
    headline:
      'Orbital Cryo-Refueling Depots & 280km Very-Low-Earth-Orbit (VLEO) Laser Satellites',
    updatedAt: 'Orbital & Deep-Space Desk · Live Signal',
    telemetry: [
      {
        value: '$2.5K ➔ $180',
        label: 'Launch Cost / kg',
        subtext: '14x cost collapse via SpaceX Mechazilla caught boosters',
        velocity: '-92.8% cost/kg trajectory',
        trend7d: [
          { day: 'D1', value: 2500 },
          { day: 'D2', value: 1800 },
          { day: 'D3', value: 1200 },
          { day: 'D4', value: 780 },
          { day: 'D5', value: 450 },
          { day: 'D6', value: 260 },
          { day: 'D7', value: 180 }
        ],
        tone: 'emerald'
      },
      {
        value: '280 km',
        label: 'VLEO Skimming Orbit',
        subtext: '4x sharper optical/SAR resolution & sub-4ms latency',
        velocity: '+48% VLEO shell filings',
        trend7d: [
          { day: 'D1', value: 550 },
          { day: 'D2', value: 500 },
          { day: 'D3', value: 440 },
          { day: 'D4', value: 390 },
          { day: 'D5', value: 340 },
          { day: 'D6', value: 300 },
          { day: 'D7', value: 280 }
        ],
        tone: 'cyan'
      },
      {
        value: '120 Tons',
        label: 'Refueled Deep Payload',
        subtext: 'Full Starship lunar capacity after orbital cryo transfer',
        velocity: '+6.0x lunar mass jump',
        trend7d: [
          { day: 'D1', value: 20 },
          { day: 'D2', value: 35 },
          { day: 'D3', value: 52 },
          { day: 'D4', value: 70 },
          { day: 'D5', value: 88 },
          { day: 'D6', value: 105 },
          { day: 'D7', value: 120 }
        ],
        tone: 'amber'
      }
    ],
    actorsBreakdown: [
      {
        actor: '🇺🇸 SpaceX (Starbase Texas) & NASA',
        role: 'Catching Super Heavy boosters with Mechazilla chopsticks & testing 400km orbital cryogenic propellant transfer',
        stance: 'INITIATOR'
      },
      {
        actor: '🇨🇳 CNSA (China) & Guowang VLEO',
        role: 'Launching reusable methane rockets (Zhuque-3/Long March 10) & 280km VLEO laser-linked constellations',
        stance: 'COUNTER-MOVE'
      },
      {
        actor: '🇮🇳 ISRO (India) & Frugal Space Startups',
        role: 'Proving ultra-low-cost lunar south pole missions (Chandrayaan) & Next-Gen Reusable Launch Vehicles (NGLV)',
        stance: 'BRIDGE / WINNER'
      }
    ],
    thunglishAnalogy: [
      'Boss, Chennai-la irundhu Delhi-ku car-la pogumbothu 1,000 liter petrol barrel-ah vandi melaye kattitu pona paadhi petrol andha baaratha thookurathey gaali aagidum!',
      'Adhaan ippo 🇺🇸 SpaceX (Elon Musk) 400km space orbit-la oru "Space Petrol Bunk" (Cryogenic Refueling Depot) vachutaanga—Starship rocket mela poitu tank full pannitu 120-ton cargo-voda Moon south pole-ku poguthu, adhey samayam 🇮🇳 ISRO frugal engineering-la record padaikkuthu!'
    ],
    timeline: {
      pastRootCause:
        'Throwing away multi-million-dollar rocket boosters in the US, Europe, and Russia after a single flight kept launch costs above $2,500 per kilogram for decades. Satellites also had to fly high at 550km+ where camera resolution and radio latency suffered.',
      presentNews:
        'SpaceX catching heavy methalox boosters in Texas with launch-tower arms and refueling upper stages in orbit drops launch cost toward $180/kg. Simultaneously, US, Chinese, and Indian operators are deploying aerodynamic satellites at 280km (VLEO) using 100Gbps laser links.',
      futureImpact:
        'Over the next 3 years, ultra-cheap launch mass unlocks permanent US/India/China lunar south-pole mining rigs and direct-to-phone satellite broadband everywhere on Earth.'
    },
    connectedSteps: [
      {
        stepNumber: 1,
        fromPillar: 'AEROSPACE',
        fromChip: '🚀 Aerospace',
        fromLabel: '280km VLEO Satellites',
        toPillar: 'TECH',
        toChip: '💻 Tech',
        toLabel: 'Rad-Hard RISC-V Avionics',
        thunglishLine:
          '280km orbit-la parakura satellites-ku triple-redundant RISC-V embedded flight computers matrum optical laser modems thevai.'
      },
      {
        stepNumber: 2,
        fromPillar: 'TECH',
        fromChip: '💻 Tech',
        fromLabel: '12cm All-Weather SAR',
        toPillar: 'GEOPOLITICS',
        toChip: '🌍 Geopolitics',
        toLabel: 'Zero Ocean Blind-Spots',
        thunglishLine:
          'Boomiku romba pakkathula satellite parakurathaala, megam moodiyirundhaalum Indo-Pacific kadal-la pora kappalgalai 12cm thulliyama padam pidikkuthu.'
      },
      {
        stepNumber: 3,
        fromPillar: 'GEOPOLITICS',
        fromChip: '🌍 Geopolitics',
        fromLabel: 'Direct-to-Cell Mesh',
        toPillar: 'MONEY',
        toChip: '💰 Money',
        toLabel: 'Orbital Cash Flywheel',
        thunglishLine:
          'Rocket-ah thirumba thirumba use panrathaala michamaagura billion dollar panam neradiya global satellite internet varumaanama maaruthu.'
      }
    ],
    eliteBrain: {
      winnerTitle: 'Elon Musk (SpaceX US) & ISRO (India) Frugal Engineers',
      winnerPoints: [
        'SpaceX replaced expensive carbon-fiber with weldable 304L stainless steel and caught 20-story boosters with mechanical chopsticks.',
        'ISRO proved frugal systems engineering by landing Chandrayaan-3 on the lunar south pole for less than the budget of a Hollywood movie.'
      ],
      failureTitle: 'Boeing Starliner Fixed-Price Program Delays',
      failurePoints: [
        'Outsourced subsystems across dozens of disconnected subcontractors without running full end-to-end hardware-in-the-loop tests early.',
        'Suffered helium leaks, thruster valve issues, and over $1.85 Billion in financial write-downs while SpaceX flew routine missions.'
      ],
      charismaBook: 'Zero to One',
      charismaAuthor: 'Peter Thiel',
      mentalModelTitle: 'The 5-Step First-Principles Engineering Algorithm',
      mentalModelRule:
        'Never optimize or automate a part that should be deleted; question every requirement starting from the laws of physics.',
      speakingTip:
        'When your team is stuck in complexity, ask one clear question: "If we had to ship this in 2 weeks with half the parts, what would we delete?"'
    }
  },
  TECH: {
    id: 'TECH',
    tabLabel: 'Tech & Embedded',
    shortName: 'Tech & Embedded',
    chipLabel: '💻 Tech',
    rssUrl: 'https://hnrss.org/frontpage',
    accentColor: '#06B6D4',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-300',
    borderAccent: 'border-cyan-500/30',
    headline:
      'Embedded Linux V4L2 Zero-Copy DMA-BUF Camera Pipelines & 2nm Backside-Power Silicon',
    updatedAt: 'Kernel & Silicon Architecture Desk · Live Signal',
    telemetry: [
      {
        value: '28ms ➔ 3.4ms',
        label: 'V4L2 DMA-BUF Latency',
        subtext: 'Zero-copy MIPI CSI-2 to Edge NPU frame pipeline',
        velocity: '-87.8% latency drop',
        trend7d: [
          { day: 'D1', value: 28.0 },
          { day: 'D2', value: 22.4 },
          { day: 'D3', value: 16.8 },
          { day: 'D4', value: 11.2 },
          { day: 'D5', value: 7.5 },
          { day: 'D6', value: 4.8 },
          { day: 'D7', value: 3.4 }
        ],
        tone: 'cyan'
      },
      {
        value: '-24% Heat',
        label: '2nm Backside Power',
        subtext: 'TSMC N2 / Intel 18A BSPDN wafer routing drops IR drop',
        velocity: '+24% thermal efficiency',
        trend7d: [
          { day: 'D1', value: 6 },
          { day: 'D2', value: 9 },
          { day: 'D3', value: 13 },
          { day: 'D4', value: 16 },
          { day: 'D5', value: 19 },
          { day: 'D6', value: 22 },
          { day: 'D7', value: 24 }
        ],
        tone: 'emerald'
      },
      {
        value: '0 CPU Copies',
        label: 'Direct FD Sharing',
        subtext: 'Eliminates user-space memcpy across 4K60 vision streams',
        velocity: '100% zero-copy DMA',
        trend7d: [
          { day: 'D1', value: 35 },
          { day: 'D2', value: 48 },
          { day: 'D3', value: 62 },
          { day: 'D4', value: 75 },
          { day: 'D5', value: 86 },
          { day: 'D6', value: 94 },
          { day: 'D7', value: 100 }
        ],
        tone: 'amber'
      }
    ],
    actorsBreakdown: [
      {
        actor: '🇺🇸 NVIDIA (Jetson Thor) & Qualcomm',
        role: 'Unified Edge SoC memory controllers sharing V4L2 DMA-BUF file descriptors directly with NPU tensor cores',
        stance: 'INITIATOR'
      },
      {
        actor: '🇹🇼 TSMC (Taiwan 2nm) & 🇯🇵 Sony Sensors',
        role: 'Manufacturing 2nm Backside-Power (BSPDN) silicon & high-speed 4-lane MIPI CSI-2 global shutter sensors',
        stance: 'COUNTER-MOVE'
      },
      {
        actor: '🐧 Linux Kernel (V4L2/Rust) & 🇮🇳 Edge R&D Centers',
        role: 'Writing zero-copy V4L2_MEMORY_DMABUF & Rust kernel drivers in Bengaluru, Chennai, and global robotics labs',
        stance: 'BRIDGE / WINNER'
      }
    ],
    thunglishAnalogy: [
      'Boss, 🇯🇵 Sony MIPI camera sensor-la irundhu varra frame-ah ARM CPU-ku copy eduthu (memcpy), appuram NPU-ku thallurathu—meen market-la irundhu meen-ah moonu auto maathi veetuku kondu varra maadhiri; 28ms late aagi drone crash aagidum!',
      'Aana ippo Linux V4L2 DMA-BUF zero-copy + 🇺🇸 NVIDIA/🇹🇼 TSMC 2nm chip vachi, 4-lane MIPI CSI-2 camera frame-ah orey memory pointer vazhiya direct-ah NPU-ku anupurom—CPU-ve thodama 3.4ms-la AI vision parakkuthu!'
    ],
    timeline: {
      pastRootCause:
        'Older embedded Linux cameras used V4L2 MMAP buffers that forced the ARM CPU to copy every 4K frame in RAM (`memcpy`). Above 60fps, this choked memory bandwidth, heated the chip, and caused 28ms lag.',
      presentNews:
        'Modern robotics SoCs (NVIDIA Jetson, Qualcomm, TI) link a Sony 4-lane MIPI CSI-2 sensor through the ISP into Linux V4L2 using `V4L2_MEMORY_DMABUF` zero-copy file descriptors. Meanwhile, TSMC 2nm chips move power wires to the backside of the wafer (BSPDN) to cut heat by 24%.',
      futureImpact:
        'Over the next 2 years, zero-copy DMA-BUF + Rust kernel drivers and sub-2nm Edge NPUs will power every autonomous drone, surgical robot, and smart car without needing cloud servers.'
    },
    connectedSteps: [
      {
        stepNumber: 1,
        fromPillar: 'TECH',
        fromChip: '💻 Tech',
        fromLabel: 'Sub-4ms V4L2 DMA-BUF',
        toPillar: 'DEFENCE',
        toChip: '🛡️ Defence',
        toLabel: '180km/h Optical Seekers',
        thunglishLine:
          'CPU copy lag illama 3.4ms-la NPU frame process panrathaala, autonomous interceptor drones vegama pora target-ah thulliyama lock pannuthu.'
      },
      {
        stepNumber: 2,
        fromPillar: 'DEFENCE',
        fromChip: '🛡️ Defence',
        fromLabel: 'Tamper-Proof Edge SoC',
        toPillar: 'AEROSPACE',
        toChip: '🚀 Aerospace',
        toLabel: 'Autonomous Orbital Docking',
        thunglishLine:
          'Spacecraft docking-layum lunar landing-layum MIPI CSI-2 camera + zero-copy DMA pipeline dhaan pilot illama navigate pannuthu.'
      },
      {
        stepNumber: 3,
        fromPillar: 'AEROSPACE',
        fromChip: '🚀 Aerospace',
        fromLabel: 'Edge Silicon Volume',
        toPillar: 'MONEY',
        toChip: '💰 Money',
        toLabel: '62% BOM Cost Deflation',
        thunglishLine:
          'Periya GPU vaangurathuku badhila $18 Embedded SoC-laye zero-copy NPU otturathaala robotics manufacturing selavu 62% koraiyuthu.'
      }
    ],
    eliteBrain: {
      winnerTitle: 'Jensen Huang (NVIDIA US) & Lisa Su (AMD) / TSMC (Taiwan)',
      winnerPoints: [
        'Designed unified memory and zero-copy DMA paths so sensors, ISP hardware, and AI tensor cores share physical RAM with zero bus bottlenecks.',
        'Split giant monolithic chips into modular chiplets with backside power delivery, keeping yields high and thermal throttling low.'
      ],
      failureTitle: 'Legacy Monolithic Foundry Delays & Bloated Camera Stacks',
      failurePoints: [
        'Early robotics startups stacked slow Python/OpenCV frame copies on top of CPU memory, causing 85°C overheating and 150ms braking lag.',
        'Legacy chipmakers delayed EUV lithography to squeeze short-term profits, losing 5 years of leadership to TSMC.'
      ],
      charismaBook: 'Thinking, Fast and Slow',
      charismaAuthor: 'Daniel Kahneman',
      mentalModelTitle: 'Zero-Copy Communication (Eliminate Translation Loss)',
      mentalModelRule:
        'Every time information is copied through an extra layer—whether in RAM or corporate management—latency rises and fidelity drops.',
      speakingTip:
        'When presenting technical solutions, skip abstract buzzwords: show the exact bottleneck metric before and after ("28ms down to 3.4ms").'
    }
  }
};

// High-signal rotating dispatches for the 60-second real-time polling engine
const LIVE_MINUTE_ROTATION_BANK: Record<
  NeatPillarId,
  Array<{
    headline: string;
    telemetry: [TelemetryStat, TelemetryStat, TelemetryStat];
    thunglishAnalogy: [string, string];
    timeline: {
      pastRootCause: string;
      presentNews: string;
      futureImpact: string;
    };
  }>
> = {
  MONEY: [
    {
      headline:
        'BRICS+ Central Banks Clear $112B in Gold-Backed Instant Repo Channels Outside SWIFT',
      telemetry: [
        {
          value: '$112B / mo',
          label: 'Direct FX + Gold Clearing',
          subtext: 'China, UAE, India & ASEAN bilateral commodity settlement',
          velocity: '+34.8% 7d velocity',
          trend7d: [
            { day: 'D1', value: 78 },
            { day: 'D2', value: 84 },
            { day: 'D3', value: 90 },
            { day: 'D4', value: 96 },
            { day: 'D5', value: 102 },
            { day: 'D6', value: 108 },
            { day: 'D7', value: 112 }
          ],
          tone: 'emerald'
        },
        {
          value: '3,140 Tons',
          label: 'Sovereign Bullion Vaults',
          subtext: 'Record physical gold accumulation across RBI, PBoC & MAS',
          velocity: '+14.2% 7d vault inflow',
          trend7d: [
            { day: 'D1', value: 2750 },
            { day: 'D2', value: 2820 },
            { day: 'D3', value: 2890 },
            { day: 'D4', value: 2960 },
            { day: 'D5', value: 3030 },
            { day: 'D6', value: 3090 },
            { day: 'D7', value: 3140 }
          ],
          tone: 'amber'
        },
        {
          value: '4.92% Yield',
          label: '10Y Treasury Term Premium',
          subtext: 'Bond vigilantes demanding higher yield for US fiscal deficits',
          velocity: '+38 bps 7d climb',
          trend7d: [
            { day: 'D1', value: 4.54 },
            { day: 'D2', value: 4.61 },
            { day: 'D3', value: 4.68 },
            { day: 'D4', value: 4.75 },
            { day: 'D5', value: 4.81 },
            { day: 'D6', value: 4.87 },
            { day: 'D7', value: 4.92 }
          ],
          tone: 'cyan'
        }
      ],
      thunglishAnalogy: [
        'Boss, munnaadi ellam 🇮🇳 India-vo 🇦🇪 UAE-vo pakkathu naatuku oil panam anuppanum na kooda 🇺🇸 New York bank vazhiya dhaan suthi poganum, adhuku dollar conversion commission vera!',
        'Ippo 🇮🇳 RBI, 🇦🇪 UAE, matrum 🇨🇳 Asian central banks direct-ah QR code scan panra maadhiri local currency + Gold bar guarantee vachi seconds-la oil bill-ah mudikiraanga.'
      ],
      timeline: {
        pastRootCause:
          'Decades of single-currency USD trade invoicing created heavy friction and sanctions exposure for Asian energy importers and sovereign wealth funds.',
        presentNews:
          'Central bank digital ledger bridges across UAE, China, Singapore, and India now clear $112B monthly in crude oil, copper, and lithium trades backed by vaulted gold.',
        futureImpact:
          'Global corporate treasuries will maintain dual-rail liquidity pools—holding both US Treasury bills and physical commodity-linked repo lines.'
      }
    }
  ],
  GEOPOLITICS: [
    {
      headline:
        'India-Middle-East-Europe (IMEC) High-Speed Freight & Subsea Fiber Corridor Locks $38B Sovereign Backing',
      telemetry: [
        {
          value: '-40% Transit',
          label: 'Mumbai-to-Piraeus Speed',
          subtext: 'India-UAE-Saudi-Greece rail + sea corridor cuts Suez delay',
          velocity: '+40% faster transit',
          trend7d: [
            { day: 'D1', value: 18 },
            { day: 'D2', value: 22 },
            { day: 'D3', value: 26 },
            { day: 'D4', value: 30 },
            { day: 'D5', value: 34 },
            { day: 'D6', value: 37 },
            { day: 'D7', value: 40 }
          ],
          tone: 'cyan'
        },
        {
          value: '$38B Committed',
          label: 'Sovereign Port & Rail CapEx',
          subtext: 'Joint India, UAE, Saudi Arabia & EU logistics infrastructure',
          velocity: '+$12B 7d commitments',
          trend7d: [
            { day: 'D1', value: 26 },
            { day: 'D2', value: 28 },
            { day: 'D3', value: 30 },
            { day: 'D4', value: 32 },
            { day: 'D5', value: 34 },
            { day: 'D6', value: 36 },
            { day: 'D7', value: 38 }
          ],
          tone: 'emerald'
        },
        {
          value: '99.999%',
          label: 'Terrestrial Fiber Uptime',
          subtext: 'Overland Gulf rail-side optical cables immune to Red Sea cuts',
          velocity: '+5x route resilience',
          trend7d: [
            { day: 'D1', value: 92 },
            { day: 'D2', value: 94 },
            { day: 'D3', value: 96 },
            { day: 'D4', value: 97 },
            { day: 'D5', value: 98 },
            { day: 'D6', value: 99 },
            { day: 'D7', value: 100 }
          ],
          tone: 'amber'
        }
      ],
      thunglishAnalogy: [
        'Boss, orey oru main road-la traffic jam aana total city-um stymie aagura maadhiri dhaan Red Sea / Suez Canal route-la adikadi prachana varuthu!',
        'Adhaan ippo 🇮🇳 India (Mundra/Mumbai Port)-la irundhu 🇦🇪 UAE Dubai port poitu, anga irundhu 🇸🇦 Saudi Arabia train vazhiya direct 🇬🇷 Europe pora pudhu VIP express highway + fiber cable ready aaguthu.'
      ],
      timeline: {
        pastRootCause:
          'Over 30% of global container traffic and 90% of Europe-Asia data cables were squeezed through a single narrow maritime chokepoint in the Red Sea.',
        presentNews:
          'India, the UAE, Saudi Arabia, and the EU have locked $38B into trans-Arabian freight rail links paired with overland low-latency optical fiber.',
        futureImpact:
          'Within 24 months, semiconductor and defense cargo between India and Europe will route through IMEC rail corridors, slashing insurance premiums by 55%.'
      }
    }
  ],
  DEFENCE: [
    {
      headline:
        'Mach 6 Scramjet Glide Interceptors & Acoustic AI Mesh Counters Low-Altitude Swarm Attacks',
      telemetry: [
        {
          value: 'Mach 6.2',
          label: 'Glide Phase Intercept',
          subtext: 'US/Japan GPI & India DRDO hypersonic defense layer',
          velocity: '+22.4% test velocity',
          trend7d: [
            { day: 'D1', value: 5.0 },
            { day: 'D2', value: 5.2 },
            { day: 'D3', value: 5.4 },
            { day: 'D4', value: 5.7 },
            { day: 'D5', value: 5.9 },
            { day: 'D6', value: 6.1 },
            { day: 'D7', value: 6.2 }
          ],
          tone: 'rose'
        },
        {
          value: '$14 / Pulse',
          label: '300kW Naval Laser',
          subtext: 'US HELIOS & Israeli Iron Beam directed-energy shield',
          velocity: '-99% cost per intercept',
          trend7d: [
            { day: 'D1', value: 45 },
            { day: 'D2', value: 38 },
            { day: 'D3', value: 30 },
            { day: 'D4', value: 24 },
            { day: 'D5', value: 19 },
            { day: 'D6', value: 16 },
            { day: 'D7', value: 14 }
          ],
          tone: 'emerald'
        },
        {
          value: '180 ms',
          label: 'Sensor-to-Shooter Loop',
          subtext: 'Autonomous target handoff from VLEO satellite to deck turret',
          velocity: '-65% kill-chain lag',
          trend7d: [
            { day: 'D1', value: 520 },
            { day: 'D2', value: 440 },
            { day: 'D3', value: 360 },
            { day: 'D4', value: 290 },
            { day: 'D5', value: 240 },
            { day: 'D6', value: 205 },
            { day: 'D7', value: 180 }
          ],
          tone: 'cyan'
        }
      ],
      thunglishAnalogy: [
        'Boss, Mach 6 vegathula varra hypersonic target-ah paathu human operator button amukurathukulla adhu ooraiye thaandi poidum!',
        'Adhaan ippo 🇺🇸 US, 🇯🇵 Japan, matrum 🇮🇳 India (DRDO) space infrared camera-vum ship-la irukura AI computer-um 180 milliseconds-la pesi, laser matrum interceptor-ah automatic-ah lock pannuthu.'
      ],
      timeline: {
        pastRootCause:
          'Traditional radar horizons cannot see maneuvering low-altitude hypersonic gliders or terrain-hugging fiber-optic drones until the final 40 seconds.',
        presentNews:
          'Proliferated low-orbit infrared tracking satellites now fuse directly with US, Japanese, Israeli, and Indian AI fire-control loops in under 180 milliseconds.',
        futureImpact:
          'Next-generation air defense will operate as an automated distributed mesh combining $14 laser pulses for swarms and kinetic interceptors for Mach 6 threats.'
      }
    }
  ],
  AEROSPACE: [
    {
      headline:
        '100Gbps Optical Inter-Satellite Laser Mesh & Nuclear-Electric Deep-Space Tugs Cleared for Orbit',
      telemetry: [
        {
          value: '100 Gbps',
          label: 'Vacuum Laser Backbone',
          subtext: 'SpaceX Starlink V3 & SDA optical mesh linking VLEO sats',
          velocity: '+42% optical throughput',
          trend7d: [
            { day: 'D1', value: 40 },
            { day: 'D2', value: 52 },
            { day: 'D3', value: 64 },
            { day: 'D4', value: 75 },
            { day: 'D5', value: 84 },
            { day: 'D6', value: 92 },
            { day: 'D7', value: 100 }
          ],
          tone: 'cyan'
        },
        {
          value: '$180 / kg',
          label: 'Reusable Heavy Lift',
          subtext: 'SpaceX Texas booster catch + orbital methalox transfer',
          velocity: '-92.8% launch cost drop',
          trend7d: [
            { day: 'D1', value: 950 },
            { day: 'D2', value: 720 },
            { day: 'D3', value: 540 },
            { day: 'D4', value: 390 },
            { day: 'D5', value: 280 },
            { day: 'D6', value: 220 },
            { day: 'D7', value: 180 }
          ],
          tone: 'emerald'
        },
        {
          value: '42% Faster',
          label: 'Vacuum Light Routing',
          subtext: 'Laser light in space travels 42% faster than subsea glass fiber',
          velocity: '-31ms London-Tokyo ping',
          trend7d: [
            { day: 'D1', value: 24 },
            { day: 'D2', value: 28 },
            { day: 'D3', value: 31 },
            { day: 'D4', value: 35 },
            { day: 'D5', value: 38 },
            { day: 'D6', value: 40 },
            { day: 'D7', value: 42 }
          ],
          tone: 'amber'
        }
      ],
      thunglishAnalogy: [
        'Boss, kadal adiyila pogura glass fiber cable-la light pogumbothu speed 30% koranjidum, aana space vacuum-la laser light thadaiye illama rocket vegathula parakkum!',
        'Adhaan ippo 🇺🇸 SpaceX matrum 🇮🇳 ISRO satellites onnuku onnu laser torch adichi 100Gbps speed-la data-va London-la irundhu Tokyo/Mumbai-ku bumiku mela vazhiyave anupputhu.'
      ],
      timeline: {
        pastRootCause:
          'Satellites used to act as simple "bent pipes" that had to bounce signals immediately back down to expensive ground stations.',
        presentNews:
          'New VLEO satellites carry gimbaled 100Gbps laser transceivers that route terabits of data across space faster than subsea fiber-optic cables.',
        futureImpact:
          'High-frequency financial trading, sovereign defense comms, and global direct-to-cell broadband will migrate onto orbital laser backbones.'
      }
    }
  ],
  TECH: [
    {
      headline:
        'Rust Linux Kernel V4L2 Zero-Copy DMA-BUF Drivers & 1.4nm Glass-Substrate AI Chiplets Hit Production',
      telemetry: [
        {
          value: '3.1 ms',
          label: 'MIPI CSI-2 to NPU Loop',
          subtext: 'Memory-safe Rust V4L2 DMA-BUF zero-copy camera pipeline',
          velocity: '-88.9% frame latency',
          trend7d: [
            { day: 'D1', value: 28.0 },
            { day: 'D2', value: 19.5 },
            { day: 'D3', value: 13.2 },
            { day: 'D4', value: 8.4 },
            { day: 'D5', value: 5.6 },
            { day: 'D6', value: 3.9 },
            { day: 'D7', value: 3.1 }
          ],
          tone: 'cyan'
        },
        {
          value: '10x Interconnect',
          label: 'Glass Core Substrate',
          subtext: 'TSMC / Intel / Samsung ultra-flat glass packaging replaces organic PCB',
          velocity: '+10x trace density',
          trend7d: [
            { day: 'D1', value: 2.0 },
            { day: 'D2', value: 3.4 },
            { day: 'D3', value: 4.8 },
            { day: 'D4', value: 6.2 },
            { day: 'D5', value: 7.6 },
            { day: 'D6', value: 8.9 },
            { day: 'D7', value: 10.0 }
          ],
          tone: 'emerald'
        },
        {
          value: '0 Kernel Panics',
          label: 'Compile-Time DMA Safety',
          subtext: 'Rust ownership eliminates use-after-free buffer bugs',
          velocity: '100% memory safety',
          trend7d: [
            { day: 'D1', value: 60 },
            { day: 'D2', value: 70 },
            { day: 'D3', value: 78 },
            { day: 'D4', value: 85 },
            { day: 'D5', value: 92 },
            { day: 'D6', value: 97 },
            { day: 'D7', value: 100 }
          ],
          tone: 'amber'
        }
      ],
      thunglishAnalogy: [
        'Boss, C driver-la camera DMA pointer konjam miss aanaalum total drone kernel panic aagi keezhe vizhundhudum!',
        'Ippo Linux kernel-la Rust V4L2 DMA-BUF driver + 🇹🇼 TSMC/🇺🇸 NVIDIA glass-substrate chiplet vachi ezhuthurathaala, compiler-ey memory leak-ah thaduthuduthu—3.1ms zero-copy speed-oda 100% crash-free safety kidaikuthu!'
      ],
      timeline: {
        pastRootCause:
          'Legacy C-based camera and GPU drivers suffered from pointer race conditions and thermal warping on organic silicon substrates above 800W.',
        presentNews:
          'Mainline Linux now integrates memory-safe Rust bindings for V4L2 DMA-BUF zero-copy pipelines while TSMC, Intel, and Samsung shift to ultra-flat glass substrates.',
        futureImpact:
          'Every mission-critical surgical robot, aerospace flight computer, and edge AI camera will mandate Rust zero-copy kernel drivers by 2027.'
      }
    }
  ]
};

export function createCustomTopicPillarData(
  rawTopic: string,
  targetPillar: NeatPillarId
): NeatPillarData {
  const base = NEAT_PILLARS[targetPillar];
  const cleaned = rawTopic.trim();
  const shortTitle =
    cleaned.length > 96 ? `${cleaned.slice(0, 93)}...` : cleaned;
  const nowStr = formatISTTimestamp();

  return {
    ...base,
    headline: shortTitle,
    updatedAt: `Synced ${nowStr} · Live Intelligence`,
    telemetry: [
      {
        value: '2.4x Faster',
        label: 'Cycle Compression',
        subtext: `First-principles shift across ${base.shortName}`,
        velocity: '+140% 7d velocity',
        trend7d: [
          { day: 'D1', value: 1.0 },
          { day: 'D2', value: 1.2 },
          { day: 'D3', value: 1.5 },
          { day: 'D4', value: 1.8 },
          { day: 'D5', value: 2.0 },
          { day: 'D6', value: 2.2 },
          { day: 'D7', value: 2.4 }
        ],
        tone: 'cyan'
      },
      {
        value: '-40% Cost',
        label: 'Unit Economics',
        subtext: 'Eliminating legacy middle-layer overhead',
        velocity: '-40% BOM trajectory',
        trend7d: [
          { day: 'D1', value: 100 },
          { day: 'D2', value: 90 },
          { day: 'D3', value: 82 },
          { day: 'D4', value: 74 },
          { day: 'D5', value: 68 },
          { day: 'D6', value: 63 },
          { day: 'D7', value: 60 }
        ],
        tone: 'emerald'
      },
      {
        value: '24-Mo Window',
        label: 'Inflection Horizon',
        subtext: 'Lead-time advantage for early architectural adopters',
        velocity: '+3.2x adoption rate',
        trend7d: [
          { day: 'D1', value: 12 },
          { day: 'D2', value: 18 },
          { day: 'D3', value: 26 },
          { day: 'D4', value: 35 },
          { day: 'D5', value: 46 },
          { day: 'D6', value: 58 },
          { day: 'D7', value: 72 }
        ],
        tone: 'amber'
      }
    ],
    thunglishAnalogy: [
      `Boss, indha "${shortTitle.slice(0, 58)}" vishayatha melottama paartha saadharana news maadhiri theriyum, aana ulley poi paartha idhu dhaan ${base.shortName} industry-oda pressure cooker valve!`,
      `Yaaru indha core bottleneck-ah first-principles vachi ippo control panrangalo, avanga dhaan adutha 2 varushathula market leader aavanga.`
    ],
    timeline: {
      pastRootCause: `Over the past 3 years, legacy systems in ${base.shortName} accumulated hidden bottlenecks because teams optimized for short-term cost instead of structural resilience.`,
      presentNews: `Today's live trigger ("${shortTitle}") forces engineering and strategy leaders to immediately upgrade their architecture and supply chains.`,
      futureImpact: `Within 24 months, early adopters of this shift in ${base.shortName} will cut latency and unit costs by 40%, leaving slow incumbents behind.`
    }
  };
}

export function synthesizeLiveWireDispatch(
  pillarId: NeatPillarId,
  cycleIndex: number,
  liveHeadline?: string,
  sourceBadge: string = 'LIVE 60s AUTO-SYNC'
): { updatedPillar: NeatPillarData; wireItem: IncomingWireItem } {
  const base = NEAT_PILLARS[pillarId];
  const bank = LIVE_MINUTE_ROTATION_BANK[pillarId];
  const preset = bank[cycleIndex % bank.length];
  const timestampIST = formatISTTimestamp();

  const finalHeadline =
    liveHeadline && liveHeadline.trim().length > 12
      ? liveHeadline.trim()
      : preset.headline;

  const updatedPillar: NeatPillarData = {
    ...base,
    headline: finalHeadline,
    updatedAt: `Live Sync · ${timestampIST}`,
    telemetry: preset.telemetry,
    thunglishAnalogy:
      liveHeadline && liveHeadline.trim().length > 12
        ? [
            `Boss, ippo vandha live breaking signal ("${finalHeadline.slice(0, 62)}") saadharana news kidaiyaathu—idhu ${base.shortName} sector-la (${base.actorsBreakdown[0].actor} vs ${base.actorsBreakdown[1].actor}) core bottleneck-ah neradiya shake pannuthu!`,
            preset.thunglishAnalogy[1]
          ]
        : preset.thunglishAnalogy,
    timeline: {
      pastRootCause: preset.timeline.pastRootCause,
      presentNews:
        liveHeadline && liveHeadline.trim().length > 12
          ? `LIVE SIGNAL (${timestampIST}): ${finalHeadline}. ${preset.timeline.presentNews}`
          : preset.timeline.presentNews,
      futureImpact: preset.timeline.futureImpact
    }
  };

  const wireItem: IncomingWireItem = {
    id: `wire-${pillarId}-${Date.now()}-${cycleIndex}`,
    pillarId,
    chipLabel: base.chipLabel,
    timestampIST,
    sourceBadge,
    headline: finalHeadline,
    keyMetricBadge: `${preset.telemetry[0].value} · ${preset.telemetry[0].label}`,
    pillarSnapshot: updatedPillar
  };

  return { updatedPillar, wireItem };
}

export function getInitialIncomingWire(): IncomingWireItem[] {
  const now = Date.now();
  return PILLAR_ROTATION_ORDER.map((pid, index) => {
    const p = NEAT_PILLARS[pid];
    const pastDate = new Date(now - index * 60_000);
    const ts = formatISTTimestamp(pastDate);
    return {
      id: `seed-${pid}-${index}`,
      pillarId: pid,
      chipLabel: p.chipLabel,
      timestampIST: ts,
      sourceBadge: index === 0 ? 'LIVE FEED' : `${index}m AGO`,
      headline: p.headline,
      keyMetricBadge: `${p.telemetry[0].value} · ${p.telemetry[0].label}`,
      pillarSnapshot: p
    };
  });
}
