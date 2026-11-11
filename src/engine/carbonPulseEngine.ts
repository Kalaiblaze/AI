export type CarbonPillarId =
  | 'MONEY'
  | 'GEOPOLITICS'
  | 'DEFENCE'
  | 'AEROSPACE'
  | 'TECH_EMBEDDED';

export interface ConnectedDot {
  target_pillar: CarbonPillarId;
  node_label: string;
  causal_chain: string;
  telemetry_delta: string;
}

export interface TitanVsFailure {
  titan_name: string;
  titan_victory: string;
  failure_entity: string;
  failure_autopsy: string;
  engineering_root_lesson: string;
}

export interface CharismaDojo {
  mental_model: string;
  book_citation: string;
  author: string;
  communication_rule: string;
  tactical_execution: string;
}

export interface CarbonBriefingItem {
  id: string;
  code: string;
  timestamp: string;
  source_tag: string;
  // 1. headline & pillar
  headline: string;
  pillar: CarbonPillarId;
  // 2. thunglish_analogy
  thunglish_analogy: string;
  // 3. past_root_cause
  past_root_cause: string;
  // 4. present_reality
  present_reality: string;
  // 5. future_projection
  future_projection: string;
  // 6. connected_dots
  connected_dots: ConnectedDot[];
  // 7. titan_vs_failure
  titan_vs_failure: TitanVsFailure;
  // 8. charisma_dojo
  charisma_dojo: CharismaDojo;
}

export interface CarbonPillarConfig {
  id: CarbonPillarId;
  indexNumber: number;
  label: string;
  shortTag: string;
  accentHex: string;
  textClass: string;
  borderClass: string;
  bgSoftClass: string;
}

export const CARBON_PILLARS: Record<CarbonPillarId, CarbonPillarConfig> = {
  MONEY: {
    id: 'MONEY',
    indexNumber: 1,
    label: '[1] Economics & Money',
    shortTag: 'ECON / LIQUIDITY',
    accentHex: '#10B981',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/40',
    bgSoftClass: 'bg-emerald-500/10'
  },
  GEOPOLITICS: {
    id: 'GEOPOLITICS',
    indexNumber: 2,
    label: '[2] Geopolitics',
    shortTag: 'GEOPOLITICS',
    accentHex: '#F59E0B',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    bgSoftClass: 'bg-amber-500/10'
  },
  DEFENCE: {
    id: 'DEFENCE',
    indexNumber: 3,
    label: '[3] Defence',
    shortTag: 'DEFENCE / EW',
    accentHex: '#F43F5E',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/40',
    bgSoftClass: 'bg-rose-500/10'
  },
  AEROSPACE: {
    id: 'AEROSPACE',
    indexNumber: 4,
    label: '[4] Aerospace',
    shortTag: 'AEROSPACE / ORBIT',
    accentHex: '#A855F7',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/40',
    bgSoftClass: 'bg-purple-500/10'
  },
  TECH_EMBEDDED: {
    id: 'TECH_EMBEDDED',
    indexNumber: 5,
    label: '[5] Tech & Embedded Systems',
    shortTag: 'TECH / EMBEDDED',
    accentHex: '#06B6D4',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/40',
    bgSoftClass: 'bg-cyan-500/10'
  }
};

export const INITIAL_CARBON_DATASET: CarbonBriefingItem[] = [
  {
    id: 'CP-001',
    code: 'NODE-EMB-V4L2',
    timestamp: '2026-11-11 07:45 UTC',
    source_tag: 'KERNEL / SILICON PIPELINE',
    headline:
      'Embedded Linux V4L2 Zero-Copy DMA-BUF Pipeline Unlocks Sub-4ms Edge-AI NPU Vision over 4-Lane MIPI CSI-2',
    pillar: 'TECH_EMBEDDED',
    thunglish_analogy:
      'Boss, saadharana camera sensor-la irundhu varra frame-ah CPU-ku copy eduthu (memcpy), appuram RAM-la irundhu NPU-ku thallurathu—Kasimedu fish market-la irundhu meen-ah moonu auto maathi veetuku kondu varra maadhiri; vazhiyilaye ice urugi late aagidum! Aana ippo V4L2 VIDIOC_EXPBUF + DMA-BUF zero-copy vachi, 4-lane MIPI CSI-2 camera frame-ah orey physical memory pointer vazhiya direct-ah NPU-ku anupurom—pipeline-la oru millisecond kooda CPU-ve thodama 120 FPS jet speed-la parakkuthu!',
    past_root_cause:
      'Between 2018 and 2023, legacy embedded Linux vision stacks relied on V4L2 MMAP buffers where user-space applications performed expensive CPU memcpy operations to move 4K RAW10/NV12 frames from the ISP into neural accelerator memory. On quad-core ARM Cortex-A55/A76 SoCs, memory bandwidth saturation above 60fps caused 45% CPU cache thrashing and 28ms frame-to-tensor latency, making autonomous obstacle avoidance dangerously sluggish.',
    present_reality:
      'Modern edge robotics SoCs now chain a 4-lane MIPI CSI-2 D-PHY receiver (2.5 Gbps/lane) directly through the hardware Image Signal Processor (ISP) into a Linux V4L2 subdev graph using VIDIOC_QBUF with V4L2_MEMORY_DMABUF file descriptors. The neural processing unit (8-TOPS INT8 NPU) maps the exact physical CMA (Contiguous Memory Allocator) scatter-gather pages directly via IOMMU, achieving 3.4ms glass-to-inference latency with less than 4% ARM CPU utilization.',
    future_projection:
      'Over the next 24 to 48 months, zero-copy DMA-BUF + Rust-based V4L2 media controller drivers will become mandatory across all defense FPV interceptors, surgical endoscopy rigs, and automotive ADAS tier-1 cameras. Cloud-dependent vision APIs will be completely displaced at the edge by deterministic sub-5ms neuromorphic event-camera (DVS) + MIPI C-PHY embedded pipelines.',
    connected_dots: [
      {
        target_pillar: 'DEFENCE',
        node_label: 'GPS-Denied Optical Seeker Locks',
        causal_chain:
          'Sub-4ms DMA-BUF camera-to-NPU pipelines allow $1,500 attritable drones to track moving armored targets at 180 km/h with zero radio or GPS emissions.',
        telemetry_delta: '-84% Frame Latency'
      },
      {
        target_pillar: 'AEROSPACE',
        node_label: 'Star-Tracker Onboard Attitude Control',
        causal_chain:
          'Radiation-tolerant embedded Linux flight computers use MIPI CSI-2 global-shutter sensors and zero-copy DMA to run autonomous orbital docking vision.',
        telemetry_delta: '120Hz Star Lock'
      },
      {
        target_pillar: 'MONEY',
        node_label: 'Edge Silicon CapEx Deflation',
        causal_chain:
          'Eliminating power-hungry discrete GPUs in favor of $18 embedded SoCs with DMA-BUF NPUs cuts industrial robotics BOM cost by 62%.',
        telemetry_delta: '-62% Unit BOM'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Jensen Huang (NVIDIA Jetson Orin / Holoscan) & Linux Media Architects',
      titan_victory:
        'Engineered unified memory architectures and GPUDirect/DMA-BUF zero-copy pipelines so camera sensors, ISP hardware, and tensor cores share physical RAM without redundant bus copies.',
      failure_entity: 'Early Autonomous Delivery Startups & Legacy Consumer IP-Camera OEMs',
      failure_autopsy:
        'Stacked bloated Python/OpenCV user-space frame copies on top of non-DMA V4L2 buffers, causing thermal throttling at 85°C and catastrophic 150ms braking delays in real-world street tests.',
      engineering_root_lesson:
        'In embedded systems, memory bandwidth and zero-copy DMA paths—not raw TOPS on a marketing datasheet—determine whether your real-time deadline lives or dies.'
    },
    charisma_dojo: {
      mental_model: 'ZERO-COPY COGNITION (ELIMINATING MIDDLEMAN TRANSLATION LOSS)',
      book_citation: 'Thinking, Fast and Slow & High Output Management',
      author: 'Daniel Kahneman / Andrew S. Grove',
      communication_rule:
        'Just as CPU memcpy destroys throughput between sensor and NPU, layers of corporate middle-management dilute raw engineering truth before it reaches the decision-maker.',
      tactical_execution:
        'In technical reviews today, bypass filtered slide decks: inspect the raw telemetry log, kernel dmesg trace, or customer failure video directly ("DMA-BUF to ground truth").'
    }
  },
  {
    id: 'CP-002',
    code: 'NODE-ECON-REPO',
    timestamp: '2026-11-11 07:32 UTC',
    source_tag: 'SOVEREIGN TREASURY / BIS',
    headline:
      '$9.8 Trillion G7 Sovereign Debt Rollover Collides with mBridge Gold-Backed Repo Corridors & High-NA Foundry CapEx',
    pillar: 'MONEY',
    thunglish_analogy:
      'Boss, 2021-la 0.5% vattiku vaanguna home loan-ah ippo 4.8% vattiyila renew panna sonna maasa budget eppadi puncture aagumo, adhey nilamai dhaan ippo G7 governments-ku! Idhuku naduvula Asian central banks ellam US dollar bond-ah vithutu, namma ooru T. Nagar-la thanga chain vaangi locker-la vaikura maadhiri tonne kanakkula physical Gold bars vaangi sovereign vault-la adukkuraanga!',
    past_root_cause:
      'Following the 2020–2022 fiscal expansion and the February 2022 immobilization of $300B in Russian sovereign FX reserves, sovereign treasury ministries heavily weighted issuance toward short-duration 2-to-5 year bills while Global South central banks quietly began rotating out of unhedged Western sovereign duration.',
    present_reality:
      'A $9.8 Trillion maturity wall of G7 sovereign debt must be refinanced over the next 14 months at yields 320 basis points higher than issuance, pushing net interest outlays past defense budgets. Simultaneously, Project mBridge cross-border wholesale CBDC corridors and Shanghai/Dubai physical gold settlement nodes are clearing over $85B monthly in bilateral energy and semiconductor mineral trade outside traditional SWIFT correspondent banking.',
    future_projection:
      'Between 2027 and 2030, major central banks will resort to stealth Yield Curve Control (YCC) and regulatory liquidity ratios to cap long-end Treasury yields, resulting in structural financial repression. Hard productive assets—specifically sub-2nm wafer fabs, gigawatt nuclear baseload, and vaulted bullion—will command a permanent scarcity premium over fiat fixed-income paper.',
    connected_dots: [
      {
        target_pillar: 'GEOPOLITICS',
        node_label: 'Non-USD Energy & Mineral Clearing',
        causal_chain:
          'Bilateral local-currency and gold-repo settlement insulates bilateral crude and rare-earth trade from secondary financial sanctions.',
        telemetry_delta: '28.4% Non-USD Oil'
      },
      {
        target_pillar: 'TECH_EMBEDDED',
        node_label: '$45B High-NA Lithography Subsidies',
        causal_chain:
          'Sovereign industrial policy funnels printed fiscal deficits directly into domestic semiconductor fabs and edge-AI packaging plants.',
        telemetry_delta: '$380M / EUV Tool'
      },
      {
        target_pillar: 'DEFENCE',
        node_label: 'Defense Industrial Base Crowding',
        causal_chain:
          'Rising sovereign debt service costs force ministries of defense to cancel $2B legacy platforms in favor of $2,000 autonomous systems.',
        telemetry_delta: '21.4% Tax to Interest'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Charlie Munger & Singapore GIC / MAS Sovereign Architects',
      titan_victory:
        'Protected purchasing power by pairing short-duration liquidity buffers with ownership of irreplaceable cash-flowing infrastructure and physical commodity settlement rails.',
      failure_entity: 'Silicon Valley Bank (SVB) Treasury Desk & Unhedged LDI Funds',
      failure_autopsy:
        'Locked $91B of flighty startup deposits into unhedged 10-year 1.56% fixed-rate bonds out of pure yield-reaching complacency, suffering instant insolvency when rates normalized.',
      engineering_root_lesson:
        'Never mismatch short-term callable liabilities against long-duration illiquid assets without an explicit, stress-tested convexity hedge.'
    },
    charisma_dojo: {
      mental_model: 'INVERSION & ASYMMETRIC SURVIVAL (AVOIDING RUIN FIRST)',
      book_citation: 'Poor Charlie’s Almanack & The Psychology of Money',
      author: 'Charlie Munger / Morgan Housel',
      communication_rule:
        'High-status executives never project manic optimism during a liquidity squeeze; they project calm, mathematically grounded downside protection ("Tell me where I’m going to die so I never go there").',
      tactical_execution:
        'Before pitching upside ROI on your next engineering or capital proposal, open the meeting by explicitly stating the 3 failure modes and how your architecture caps maximum drawdown.'
    }
  },
  {
    id: 'CP-003',
    code: 'NODE-GEO-GALLIUM',
    timestamp: '2026-11-11 07:18 UTC',
    source_tag: 'CUSTOMS / CHOKEPOINT INTEL',
    headline:
      'Gallium, Germanium & Antimony Export Licensing Tightens as Multi-Aligned Maritime Corridors Reprice Strait Risk',
    pillar: 'GEOPOLITICS',
    thunglish_analogy:
      'Boss, neenga enaku latest chip print panra EUV machine thara maatingala? Appo andha chip-um, military AESA radar-um, night-vision camera-vum seiya thevayana Gallium matrum Germanium mineral-ah naangalum thara maatom nu counter lock poduraanga! Pallavaram sandhai-la oruthan tharasu edaiya pudicha, innoruthan godown saaviya pudikira asal supply-chain panchayathu!',
    past_root_cause:
      'From 1998 to 2022, Western and Japanese industrial conglomerates shut down domestic smelting of byproduct critical minerals due to environmental compliance costs, allowing 86% of global refined Gallium and 68% of Germanium refining capacity to consolidate inside a single sovereign jurisdiction.',
    present_reality:
      'Strict item-by-item end-user export licenses now govern Gallium Nitride (GaN) RF wafers, Germanium infrared optics, and Antimony flame-retardant/primer compounds, creating a $190/kg spot price premium between Rotterdam and Shanghai warehouses. Simultaneously, middle powers like India and the UAE are executing multi-aligned energy arbitrage—refining discounted crude and routing container traffic via hybrid rail-maritime corridors (IMEC & INSTC).',
    future_projection:
      'Over the next 1 to 4 years, semiconductor and defense primes will sign direct equity off-take agreements with zinc/bauxite refineries in Australia, India, and Canada to build sovereign byproduct extraction loops. Global trade will permanently operate on two parallel bill-of-lading and insurance regimes.',
    connected_dots: [
      {
        target_pillar: 'DEFENCE',
        node_label: 'GaN AESA Radar & Thermal Sights',
        causal_chain:
          'Gallium Nitride (GaN) amplifiers and Germanium lenses are non-negotiable physical inputs for active electronically scanned array (AESA) naval radars and tank thermal optics.',
        telemetry_delta: '+42% Spot Gallium'
      },
      {
        target_pillar: 'TECH_EMBEDDED',
        node_label: 'Wide-Bandgap Power Electronics',
        causal_chain:
          'GaN and SiC power FETs inside EV inverters and 48V AI server racks face 36-week allocation lead times.',
        telemetry_delta: '36-Wk Wafer Lead'
      },
      {
        target_pillar: 'MONEY',
        node_label: 'Strategic Stockpile Working Capital',
        causal_chain:
          'OEMs abandon Just-In-Time (JIT) inventory for 12-month Just-In-Case physical metal buffers, tying up billions in working capital.',
        telemetry_delta: '4.2x Buffer CapEx'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Morris Chang (TSMC) & Indian Strategic Refining Planners',
      titan_victory:
        'Turned geopolitical positioning into an indispensable structural shield—either by becoming the world’s neutral silicon foundry or by arbitraging discounted energy across rival blocs.',
      failure_entity: '2011–2022 European Single-Pipeline Industrial Energy Policy',
      failure_autopsy:
        'Decommissioned domestic nuclear plants while routing 55% of industrial gas dependency through a single geopolitical counterparty with zero LNG regasification backup.',
      engineering_root_lesson:
        'A system with a single point of failure (SPOF) in its foundational energy or material inputs is one diplomatic telegram away from shutdown.'
    },
    charisma_dojo: {
      mental_model: 'LEVERAGE THROUGH IRREPLACEABLE BOTTLENECKS',
      book_citation: 'Zero to One & The 48 Laws of Power',
      author: 'Peter Thiel / Robert Greene',
      communication_rule:
        'Law 11: Power never comes from begging for consensus; it comes from owning the critical dependency that no one else in the room can replicate.',
      tactical_execution:
        'Map your organization’s dependency graph today: become the sole owner of the hardest cross-disciplinary interface (e.g., hardware-firmware bringup or regulatory signoff).'
    }
  },
  {
    id: 'CP-004',
    code: 'NODE-DEF-SWARM',
    timestamp: '2026-11-11 07:05 UTC',
    source_tag: 'EW / DIRECTED ENERGY',
    headline:
      'Fiber-Optic Unjammable FPV Interceptors & 300kW Shipboard Solid-State Lasers Shatter Legacy Missile Cost Math',
    pillar: 'DEFENCE',
    thunglish_analogy:
      'Boss, $2 Million madhippulla SAM missile-ah vachi $1,500 drone-ah sudurathu—kosuvai adikka thangathala senja peerangiya vaangura maadhiri; naalu naal-la kajaana gaali aagidum! Adhaan ippo radio jammer-aala thadukkave mudiyatha 20km glass fiber-optic spool drones-um, oru shot-ku verum $14 current mattume selavaagura 300kW solid-state laser gun-um kalathula irangiruchu!',
    past_root_cause:
      'Decades of post-1991 cost-plus defense procurement optimized for exquisite, low-volume platforms (such as $2M surface-to-air interceptors and $13B naval groups) while assuming adversaries would never field tens of thousands of cheap autonomous munitions simultaneously.',
    present_reality:
      'Across active conflict theaters in 2025–2026, wideband electronic warfare (EW) jammers blank out 90% of RF/GPS frequencies, forcing combatants to deploy ultrathin 0.25mm fiber-optic spool drones and onboard edge-NPU optical terrain-matching seekers. In response, naval and air-defense commands are integrating 300kW solid-state spectral-beam-combined laser weapons paired with overhead infrared satellite cueing, dropping cost-per-intercept from $2.1M to $14 of electrical power.',
    future_projection:
      'Within 36 months, every armored vehicle and naval corvette will carry an active short-range High-Power Microwave (HPM) + 100kW laser hard-kill dome alongside an automated launch bay of counter-swarm interceptor drones. Defense software update cadence will shift from 5-year block upgrades to 48-hour over-the-air neural weight patches.',
    connected_dots: [
      {
        target_pillar: 'TECH_EMBEDDED',
        node_label: '8W Neuromorphic Optical Navigation',
        causal_chain:
          'When RF links are severed, autonomous terminal guidance depends entirely on embedded Linux V4L2 camera pipelines and quantized INT4 vision models.',
        telemetry_delta: '0.0 dBm RF Dark'
      },
      {
        target_pillar: 'AEROSPACE',
        node_label: 'LEO Infrared Hypersonic Tracking',
        causal_chain:
          'Shipboard directed-energy lasers require sub-200ms target handoff vectors from low-earth-orbit infrared tracking constellations.',
        telemetry_delta: '180ms Track Handoff'
      },
      {
        target_pillar: 'GEOPOLITICS',
        node_label: 'Naval Chokepoint Denial Economics',
        causal_chain:
          'Low-cost autonomous sea drones and coastal anti-ship swarms allow smaller littoral states to contest narrow maritime straits.',
        telemetry_delta: '1:1400 Cost Ratio'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Palmer Luckey (Anduril Industries) & John Boyd (OODA Loop Strategist)',
      titan_victory:
        'Built software-defined, mass-manufacturable autonomous systems using commercial silicon and private R&D capital years before slow government requirement documents were even drafted.',
      failure_entity: 'USS Zumwalt Advanced Gun System (AGS) & Legacy Cost-Plus Primes',
      failure_autopsy:
        'Engineered a custom guided artillery projectile that cost $800,000 per single round, forcing the Navy to cancel the ammunition completely and leave a $7.5B stealth destroyer with unusable guns.',
      engineering_root_lesson:
        'If your defense architecture places you on the wrong side of the cost-exchange ratio, your adversary will bankrupt your magazine depth before noon.'
    },
    charisma_dojo: {
      mental_model: 'BOYD’S OODA LOOP COMPRESSION & ASYMMETRIC TEMPO',
      book_citation: 'The Art of War & Boyd: The Fighter Pilot Who Changed the Art of War',
      author: 'Sun Tzu / Robert Coram',
      communication_rule:
        'Speed of orientation beats size of organization: the leader who observes raw reality, updates their mental model, and acts in 10 minutes dominates the committee that debates for 10 weeks.',
      tactical_execution:
        'Cut your team’s feedback loop in half today: replace weekly status meetings with a live 15-minute hardware/code bench demo where broken assumptions are exposed immediately.'
    }
  },
  {
    id: 'CP-005',
    code: 'NODE-AERO-VLEO',
    timestamp: '2026-11-11 06:50 UTC',
    source_tag: 'ORBITAL TELEMETRY / VLEO',
    headline:
      'Orbital Methalox Cryo-Refueling & 280km VLEO Optical Laser Constellations Collapse Up-Mass Cost below $200/kg',
    pillar: 'AEROSPACE',
    thunglish_analogy:
      'Boss, Chennai-la irundhu Delhi-ku car-la pogumbothu 1,000 liter petrol barrel-ah vandiku melaye kattitu pona vandi nagaruma? Paadhi petrol andha baaratha thookurathey gaali aagidum! Adhaan ippo 400km Low-Earth Orbit-la oru "Space Petrol Bunk" (Cryogenic Propellant Depot) vachutaanga—rocket mela poitu tank full pannitu 120-ton cargo-voda jammunu Moon-ku poguthu!',
    past_root_cause:
      'For 65 years, the Tsiolkovsky rocket equation and expendable stage disposal locked launch prices between $10,000/kg and $2,500/kg, forcing satellite engineers to spend 7 years building fragile, $500M gold-plated spacecraft that could never be serviced or upgraded.',
    present_reality:
      'Full-flow staged combustion methalox boosters caught by mechanical launch-tower arms, combined with orbital zero-boiloff cryogenic propellant transfer, are driving marginal launch cost toward $180/kg. Concurrently, satellites equipped with air-breathing electric propulsion (ABEP) and 100Gbps optical inter-satellite lasers are operating in Very-Low-Earth-Orbit (280km VLEO), delivering sub-12cm synthetic aperture radar (SAR) imaging and 11ms direct-to-device connectivity.',
    future_projection:
      'By 2028–2030, orbital data centers cooled by deep-space radiative panels and cislunar heavy logistics will turn low-earth and lunar orbits into an industrial extension of terrestrial cloud and defense infrastructure.',
    connected_dots: [
      {
        target_pillar: 'TECH_EMBEDDED',
        node_label: 'Rad-Tolerant RISC-V Flight Avionics',
        causal_chain:
          'Mass-produced VLEO satellite shells require triple-modular-redundant (TMR) RISC-V + FPGA flight controllers running real-time Linux.',
        telemetry_delta: '100Gbps Laser Link'
      },
      {
        target_pillar: 'DEFENCE',
        node_label: '12cm All-Weather SAR Maritime Tracking',
        causal_chain:
          'Operating at 280km altitude halves the radar link budget distance, exposing dark-fleet vessels and mobile missile launchers through thick cloud cover.',
        telemetry_delta: '12cm Ground Res'
      },
      {
        target_pillar: 'MONEY',
        node_label: 'Orbital Telecom Cash-Flow Monopoly',
        causal_chain:
          'Owning reusable launch capacity creates a self-funding capital flywheel where internal satellite broadband revenue pays for deep-space R&D.',
        telemetry_delta: '88% Global Up-Mass'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Elon Musk (SpaceX Starship/Starlink) & ISRO Frugal Systems Engineers',
      titan_victory:
        'Attacked the fundamental physics multiplier—full rapid reusability and first-principles stainless-steel manufacturing—while ISRO proved world-class lunar south-pole precision on a $75M budget.',
      failure_entity: 'Boeing Starliner Fixed-Price Program & Legacy Expendable Launch Alliances',
      failure_autopsy:
        'Relied on fragmented multi-tier subcontracting and paper verification instead of integrated hardware-rich testing, resulting in thruster valve anomalies and $1.85B+ in write-downs.',
      engineering_root_lesson:
        'Question every requirement, delete unnecessary parts, and test integrated flight hardware early—spreadsheet compliance never survives Mach 25 reentry.'
    },
    charisma_dojo: {
      mental_model: 'THE 5-STEP FIRST-PRINCIPLES ENGINEERING ALGORITHM',
      book_citation: 'The Charisma Myth & Zero to One',
      author: 'Olivia Fox Cabane / Peter Thiel',
      communication_rule:
        'True executive presence combines warmth with uncompromising intellectual clarity: never optimize a component that should not exist in the first place.',
      tactical_execution:
        'In your next architecture review, ask the room: "If we were forced to deliver this system in 30 days at 1/5th the BOM cost, which 40% of the spec would we delete right now?"'
    }
  },
  {
    id: 'CP-006',
    code: 'NODE-TECH-2NMGAA',
    timestamp: '2026-11-11 06:35 UTC',
    source_tag: 'FOUNDRY / CRYPTOGRAPHY',
    headline:
      'Sub-2nm Gate-All-Around (GAA) Backside Power Silicon & NIST Post-Quantum Lattice Encryption Reshape Compute Security',
    pillar: 'TECH_EMBEDDED',
    thunglish_analogy:
      'Boss, oru apartment building-la (2nm Chip) thanni pipe-um (Data Signals) high-voltage current wire-um (Power Delivery) orey kurugiya sandhula pona short-circuit aagi soodagidumla? Adhaan ippo current wire-ah muzhusa chip-oda adi-pakkathuku (Backside Power Delivery - BSPDN) maathitu, mela verum data signal-ah mattum 4-side Gate (GAA Nanosheet) vazhiya parakka viduraanga—heat-um koranjiruchu, speed-um 30% egiriduchu!',
    past_root_cause:
      'FinFET transistor architecture hit its atomic electrostatic scaling limit at 3nm as gate leakage currents surged and front-side copper power routing consumed over 25% of routing tracks, while classical RSA-2048 encryption became vulnerable to "Harvest Now, Decrypt Later" state-sponsored interception.',
    present_reality:
      'Leading-edge foundries are ramping 2nm Gate-All-Around (GAA) nanosheet transistors paired with Backside Power Delivery Networks (BSPDN / PowerVia), reducing IR voltage drop by 24% and boosting logic density by 30% for hyperscale and edge-AI accelerators. Simultaneously, financial clearinghouses and embedded HSM (Hardware Security Module) vendors are flashing firmware upgrades to NIST-standardized ML-KEM (Kyber) and ML-DSA (Dilithium) lattice-based post-quantum cryptography.',
    future_projection:
      'Between 2027 and 2030, backside optical interconnects (co-packaged silicon photonics) will merge with 1.4nm GAA chiplets, while any embedded IoT, automotive ECU, or satellite transceiver lacking hardware-accelerated Post-Quantum Cryptography (PQC) secure boot will be barred from sovereign infrastructure networks.',
    connected_dots: [
      {
        target_pillar: 'MONEY',
        node_label: 'Quantum-Safe SWIFT & CBDC Ledgers',
        causal_chain:
          'Central banks mandate hardware-level ML-KEM lattice cryptography across all interbank settlement trunks to prevent retroactive quantum decryption.',
        telemetry_delta: '100% PQC Mandate'
      },
      {
        target_pillar: 'GEOPOLITICS',
        node_label: 'High-NA EUV Lithography Geofencing',
        causal_chain:
          'Sub-2nm GAA fabrication requires $380M High-NA EUV scanners subject to strict sovereign export controls and remote telemetry verification.',
        telemetry_delta: '0.55 NA Optics'
      },
      {
        target_pillar: 'DEFENCE',
        node_label: 'Tamper-Proof Secure-Boot Drone SoCs',
        causal_chain:
          'Military embedded systems integrate Physically Unclonable Functions (PUFs) and post-quantum lattice signatures into ROM bootloaders so captured hardware cannot be reverse-engineered.',
        telemetry_delta: 'Zero Key Extraction'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Dr. Lisa Su (AMD Chiplet Architecture) & TSMC CoWoS/GAA Teams',
      titan_victory:
        'Pioneered modular chiplet disaggregation and relentless node execution, turning packaging and backside power physics into an insurmountable moat.',
      failure_entity: '2016–2021 Legacy Monolithic Die Delays & Un-Upgraded RSA-1024 Vendors',
      failure_autopsy:
        'Delayed EUV adoption while betting on monolithic multi-patterning yields, losing five years of process leadership and hundreds of billions in data-center market share.',
      engineering_root_lesson:
        'Modular chiplet disaggregation and cryptographic agility always beat brittle monolithic designs when physical scaling walls arrive.'
    },
    charisma_dojo: {
      mental_model: 'STRUCTURAL SEPARATION OF CONCERNS (POWER VS. SIGNAL)',
      book_citation: 'Thinking, Fast and Slow & The Design of Everyday Things',
      author: 'Daniel Kahneman / Don Norman',
      communication_rule:
        'Just as Backside Power Delivery separates noisy power rails from delicate logic signals, elite leaders separate emotional politics ("power routing") from objective technical truth ("signal routing").',
      tactical_execution:
        'When a technical debate gets heated today, draw two columns on the whiteboard: "Physics & Measurable Telemetry" vs. "Ego & Legacy Preferences"—and only fund the first column.'
    }
  }
];

const KEYWORD_TO_CARBON_PILLAR: Record<CarbonPillarId, string[]> = {
  MONEY: [
    'bank',
    'gold',
    'fed',
    'rate',
    'bond',
    'debt',
    'dollar',
    'treasury',
    'market',
    'economy',
    'liquidity',
    'inflation',
    'fund',
    'invest',
    'stock',
    'capex',
    'currency',
    'finance'
  ],
  GEOPOLITICS: [
    'china',
    'india',
    'russia',
    'usa',
    'europe',
    'sanction',
    'tariff',
    'trade',
    'strait',
    'oil',
    'export',
    'mineral',
    'gallium',
    'treaty',
    'border',
    'arctic',
    'supply chain',
    'diplomat'
  ],
  DEFENCE: [
    'drone',
    'military',
    'missile',
    'navy',
    'defence',
    'defense',
    'laser',
    'radar',
    'weapon',
    'swarm',
    'war',
    'security',
    'cyber',
    'pentagon',
    'hypersonic',
    'jammer',
    'submarine'
  ],
  AEROSPACE: [
    'space',
    'orbit',
    'satellite',
    'rocket',
    'lunar',
    'moon',
    'starship',
    'spacex',
    'isro',
    'nasa',
    'vleo',
    'flight',
    'aviation',
    'propulsion',
    'mars',
    'payload'
  ],
  TECH_EMBEDDED: [
    'linux',
    'v4l2',
    'mipi',
    'csi',
    'dma',
    'npu',
    'gpu',
    'chip',
    'silicon',
    'kernel',
    'rust',
    'embedded',
    'quantum',
    'ai',
    'semiconductor',
    'tsmc',
    'arm',
    'risc-v',
    'firmware',
    'camera',
    'sensor'
  ]
};

export function classifyCarbonPillar(text: string): CarbonPillarId {
  const lower = text.toLowerCase();
  let winner: CarbonPillarId = 'TECH_EMBEDDED';
  let bestScore = 0;

  (Object.keys(KEYWORD_TO_CARBON_PILLAR) as CarbonPillarId[]).forEach((pillar) => {
    const score = KEYWORD_TO_CARBON_PILLAR[pillar].reduce(
      (acc, kw) => acc + (lower.includes(kw.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      winner = pillar;
    }
  });

  return winner;
}

export function synthesizeCustomBriefing(
  rawTopicOrNews: string,
  sourceTag = 'LIVE SYNTHESIS // INJECTED'
): CarbonBriefingItem {
  const cleaned = rawTopicOrNews.trim();
  const pillar = classifyCarbonPillar(cleaned);
  const firstLine = cleaned.split(/[.!?\n]/)[0]?.trim() || 'Global Strategic Signal';
  const headline =
    firstLine.length > 105 ? `${firstLine.slice(0, 102)}...` : firstLine;

  const secondaryMap: Record<CarbonPillarId, [CarbonPillarId, CarbonPillarId, CarbonPillarId]> = {
    TECH_EMBEDDED: ['DEFENCE', 'MONEY', 'AEROSPACE'],
    MONEY: ['GEOPOLITICS', 'TECH_EMBEDDED', 'DEFENCE'],
    GEOPOLITICS: ['MONEY', 'DEFENCE', 'TECH_EMBEDDED'],
    DEFENCE: ['TECH_EMBEDDED', 'GEOPOLITICS', 'AEROSPACE'],
    AEROSPACE: ['DEFENCE', 'TECH_EMBEDDED', 'MONEY']
  };

  const [link1, link2, link3] = secondaryMap[pillar];
  const pillarMeta = CARBON_PILLARS[pillar];

  return {
    id: `CP-LIVE-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 90 + 10)}`,
    code: `NODE-LIVE-${pillar.slice(0, 4)}`,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
    source_tag: sourceTag,
    headline: headline.length >= 8 ? headline : `Strategic Intercept: ${cleaned.slice(0, 75)}`,
    pillar,
    thunglish_analogy: `Boss, indha "${headline.slice(0, 65)}" vishayatha melottama paartha saadharana news maadhiri theriyum; aana ulley poi paartha namma ooru Biryani dum podumbothu pressure cooker valve-ah correct-ah control panra maadhiri, ${pillarMeta.shortTag} sector-oda motha power valve-um ingey dhaan lock aagiruku! Yaaru indha bottleneck-ah mudhalla pudikirangalo avanga dhaan adutha 3 varushathuku market Raja!`,
    past_root_cause: `Between 2021 and 2025, legacy architectural debt and concentrated supply-chain bottlenecks inside ${pillarMeta.label} built up massive hidden fragility. Institutions optimized for short-term quarterly margins while ignoring physical hardware, bandwidth, and sovereign resource constraints.`,
    present_reality: `Active trigger detected: "${cleaned.slice(0, 220)}${cleaned.length > 220 ? '...' : ''}". Engineering and treasury desks are now forced to re-architect their stacks in real time as ${pillarMeta.shortTag} constraints spill directly into ${CARBON_PILLARS[link1].shortTag} and ${CARBON_PILLARS[link2].shortTag}.`,
    future_projection: `Over the next 12 to 36 months, this shift will bifurcate ${pillarMeta.label} into vertically integrated sovereign winners vs. high-latency legacy players, driving a +35% capital reallocation into ${CARBON_PILLARS[link1].shortTag} and ${CARBON_PILLARS[link2].shortTag}.`,
    connected_dots: [
      {
        target_pillar: link1,
        node_label: `${CARBON_PILLARS[link1].shortTag} Contagion Vector`,
        causal_chain: `Direct structural shockwave from "${headline.slice(0, 45)}..." forces immediate re-pricing and capability hardening across ${CARBON_PILLARS[link1].label}.`,
        telemetry_delta: '1st-Order Impact'
      },
      {
        target_pillar: link2,
        node_label: `${CARBON_PILLARS[link2].shortTag} Chokepoint Shift`,
        causal_chain: `Secondary feedback loop alters supply-chain allocations and strategic posture across ${CARBON_PILLARS[link2].label} within 90 days.`,
        telemetry_delta: '2nd-Order Pivot'
      },
      {
        target_pillar: link3,
        node_label: `${CARBON_PILLARS[link3].shortTag} Capital Rotation`,
        causal_chain: `Long-horizon institutional and engineering talent rotates into ${CARBON_PILLARS[link3].label} to capture the 3-year structural bottleneck.`,
        telemetry_delta: '36-Mo Convexity'
      }
    ],
    titan_vs_failure: {
      titan_name: 'Jensen Huang / Elon Musk / Morris Chang (First-Principles Integrators)',
      titan_victory: `Anticipated the ${pillarMeta.shortTag} bottleneck years ahead of consensus by vertically integrating the critical hardware/financial layer and eliminating middleman latency.`,
      failure_entity: 'Nokia Symbian Bureaucracy / Legacy Cost-Plus Incumbents',
      failure_autopsy: `Treated structural physics and architectural shifts inside ${pillarMeta.shortTag} as temporary PR problems, protecting legacy product margins until sudden market obsolescence.`,
      engineering_root_lesson: `When a foundational constraint shifts in ${pillarMeta.shortTag}, incremental patches fail—only zero-copy architectural redesign survives.`
    },
    charisma_dojo: {
      mental_model: 'SIGNAL-TO-NOISE INVERSION & SECOND-ORDER CAUSALITY',
      book_citation: 'Thinking, Fast and Slow & Zero to One',
      author: 'Daniel Kahneman / Peter Thiel',
      communication_rule:
        'When breaking news hits, low-status actors repeat the headline with emotion; high-status commanders calmly trace the 3-step Past-Present-Future causal chain across adjacent domains.',
      tactical_execution: `In your next briefing on "${headline.slice(0, 40)}...", speak 15% slower, pause before key numbers, and anchor your recommendation on the 2-year second-order bottleneck.`
    }
  };
}

export interface RssFeedRawItem {
  title?: string;
  description?: string;
  pubDate?: string;
  link?: string;
}

export function mapRssItemsToBriefings(
  rssItems: RssFeedRawItem[],
  feedLabel = 'LIVE RSS STREAM'
): CarbonBriefingItem[] {
  return rssItems
    .filter((item) => item && typeof item.title === 'string' && item.title.trim().length > 5)
    .slice(0, 5)
    .map((item, idx) => {
      const title = (item.title || '').trim();
      const desc = (item.description || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const combined = desc.length > 20 ? `${title}. ${desc.slice(0, 200)}` : title;
      const synthesized = synthesizeCustomBriefing(combined, `${feedLabel} #${idx + 1}`);
      return {
        ...synthesized,
        headline: title
      };
    });
}
