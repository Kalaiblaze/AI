import { NeatPillarId, NeatPillarData } from './nexusNeatEngine';

export interface MediaHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  actorFlag: string;
  label: string;
  detail: string;
}

export interface VideoChapter {
  timecode: string;
  progressPercent: number;
  title: string;
  thunglishCaption: string;
  telemetryCallout: string;
}

export interface BroadcastVideoRef {
  id: string;
  title: string;
  channel: string;
  trustedSourceDomain: string;
  verifiedReportUrl: string;
  youtubeEmbedId: string;
  duration: string;
  summary: string;
  thunglishSummary: string;
}

export interface SimpleTermDecode {
  term: string;
  everydayMeaning: string;
  whyItMattersToYou: string;
}

export interface TrustedSourceCitation {
  outlet: string;
  domain: string;
  url: string;
  verificationNote: string;
}

export interface PillarMediaAsset {
  pillarId: NeatPillarId;
  primaryImageUrl: string;
  secondaryImageUrl: string;
  photoCredit: string;
  locationBadge: string;
  reconTimestamp: string;
  imageCaption: string;
  trustedCitations: [TrustedSourceCitation, TrustedSourceCitation];
  hotspots: [MediaHotspot, MediaHotspot, MediaHotspot];
  videoChapters: [VideoChapter, VideoChapter, VideoChapter];
  simpleEverydayTerms: [SimpleTermDecode, SimpleTermDecode, SimpleTermDecode];
  relatedBroadcasts: [BroadcastVideoRef, BroadcastVideoRef];
}

export const PILLAR_MEDIA_CATALOG: Record<NeatPillarId, PillarMediaAsset> = {
  MONEY: {
    pillarId: 'MONEY',
    primaryImageUrl: '/images/pillars/money.jpg',
    secondaryImageUrl: '/images/pillars/geopolitics.jpg',
    photoCredit: 'Verified Desk · BIS mBridge & Sovereign Bullion Data',
    locationBadge: '📍 Mumbai · Dubai · Singapore · Shanghai',
    reconTimestamp: 'VERIFIED DATA · BIS & RBI REPORTS',
    imageCaption:
      'Sovereign physical gold bullion reserves paired with BIS Project mBridge cross-border settlement corridors and US Treasury refinancing data.',
    trustedCitations: [
      {
        outlet: 'Bank for International Settlements (BIS)',
        domain: 'bis.org',
        url: 'https://www.bis.org/about/bisih/topics/cbdc/mcbdc_bridge.htm',
        verificationNote: 'Official Project mBridge multi-CBDC cross-border settlement documentation'
      },
      {
        outlet: 'Reuters Markets & Sovereign Debt',
        domain: 'reuters.com',
        url: 'https://www.reuters.com/markets/rates-bonds/',
        verificationNote: 'Verified G7 & US Treasury refinancing maturity schedule and central bank gold buying'
      }
    ],
    hotspots: [
      {
        id: 'money-hs-1',
        xPercent: 48,
        yPercent: 42,
        actorFlag: '🇮🇳🇦🇪🇨🇳',
        label: 'mBridge Direct Payment App for Central Banks',
        detail:
          'Like an international UPI for central banks—UAE, China, Saudi Arabia, and Asian partners pay each other directly for oil & goods without middleman bank delays.'
      },
      {
        id: 'money-hs-2',
        xPercent: 72,
        yPercent: 74,
        actorFlag: '🏦',
        label: 'Physical Gold Vaults (Real Hard Collateral)',
        detail:
          'Instead of holding only foreign paper IOUs, central banks like India RBI store real 24K gold bars in domestic vaults.'
      },
      {
        id: 'money-hs-3',
        xPercent: 24,
        yPercent: 58,
        actorFlag: '🇺🇸',
        label: '$9.8 Trillion Loan Renewal Shock',
        detail:
          'Old sovereign loans taken at 0.5% low interest must now be renewed at 4.8% interest—pushing annual interest payments above $1 Trillion.'
      }
    ],
    videoChapters: [
      {
        timecode: '00:00 / 00:45',
        progressPercent: 22,
        title: 'Part 1 · Simple Analogy: The Loan EMI Shock',
        thunglishCaption:
          'Idha romba simple-aa purinjikalam: America 2021-la kammi vattiku vaanguna 9.8 Trillion dollar kadana, ippo adhigamaana 4.8 percent vattiyila renew panna vendiya nilamai vandhuruchu.',
        telemetryCallout: 'INTEREST JUMP: 0.5% ➔ 4.8% (+430 bps)'
      },
      {
        timecode: '00:16 / 00:45',
        progressPercent: 58,
        title: 'Part 2 · What is mBridge? (International UPI for Countries)',
        thunglishCaption:
          'Adhanaala China, UAE, matrum Saudi Arabia ellam dollar bank-ku wait pannama, namma oor UPI maadhiri mBridge network vazhiya direct-aa local currency matrum thangathula business settle panranga.',
        telemetryCallout: 'DIRECT TRADE FLOW: $85B / MONTH'
      },
      {
        timecode: '00:32 / 00:45',
        progressPercent: 95,
        title: 'Part 3 · How India RBI Protects Everyday Value',
        thunglishCaption:
          'Namma India RBI matrum Singapore verum paper bond-ah mattum nambama, real Gold bars-ah sondha vault-la adukki namma rupee value-va strong-aa paathukuraanga.',
        telemetryCallout: 'SAFETY SHIELD: PHYSICAL GOLD + UPI/PAYNOW'
      }
    ],
    simpleEverydayTerms: [
      {
        term: 'Debt Refinancing Wall ($9.8T)',
        everydayMeaning:
          'Like taking a home loan at 1% interest 3 years ago, and today the bank says you must renew the entire loan at nearly 5% interest.',
        whyItMattersToYou:
          'Keeps global loan & EMI interest rates higher for longer and makes physical gold prices climb steadily.'
      },
      {
        term: 'mBridge Settlement Rail',
        everydayMeaning:
          'Think of it like Google Pay or UPI, but built directly between Central Banks so countries can trade oil and goods in seconds without extra dollar conversion fees.',
        whyItMattersToYou:
          'Reduces foreign currency conversion costs on imported fuel, electronics, and fertilizers.'
      },
      {
        term: 'Sovereign Gold Reserves',
        everydayMeaning:
          'Real 24-karat gold bars stored inside RBI and central bank vaults as permanent, inflation-proof national wealth.',
        whyItMattersToYou:
          'Protects the Indian Rupee during global financial shocks and keeps gold a reliable family asset.'
      }
    ],
    relatedBroadcasts: [
      {
        id: 'money-clip-1',
        title: 'BIS Project mBridge: Multi-CBDC Cross-Border Payments Explained',
        channel: 'Bank for International Settlements (BIS)',
        trustedSourceDomain: 'bis.org',
        verifiedReportUrl: 'https://www.bis.org/about/bisih/topics/cbdc/mcbdc_bridge.htm',
        youtubeEmbedId: 'd3Z3Z-5Z-5k',
        duration: '03:45',
        summary:
          'Official breakdown of how central banks connect directly on a shared ledger to settle cross-border trade in seconds.',
        thunglishSummary:
          'Central banks epdi middleman bank illama direct-aa Seconds-la panam matrum oil trade settle panranga nu kaatum video.'
      },
      {
        id: 'money-clip-2',
        title: 'Why Central Banks Are Buying Record Tonnages of Physical Gold',
        channel: 'CNBC / World Gold Council Report',
        trustedSourceDomain: 'cnbc.com',
        verifiedReportUrl: 'https://www.cnbc.com/gold/',
        youtubeEmbedId: 'p7HKvqRI_Bo',
        duration: '05:20',
        summary:
          'Verified data on RBI, China PBoC, Singapore MAS, and central bank gold reserve accumulation against sovereign debt inflation.',
        thunglishSummary:
          'India RBI matrum ulaga central banks yen paper currency-ah vida physical Gold bars-ah adhigama vaangi vaikiraanga?'
      }
    ]
  },

  GEOPOLITICS: {
    pillarId: 'GEOPOLITICS',
    primaryImageUrl: '/images/pillars/geopolitics.jpg',
    secondaryImageUrl: '/images/pillars/tech.jpg',
    photoCredit: 'Verified Desk · ASML EUV & IMEC Corridor Report',
    locationBadge: '📍 Veldhoven (NL) · Beijing · Mundra–Haifa IMEC Corridor',
    reconTimestamp: 'VERIFIED DATA · REUTERS & ASML',
    imageCaption:
      'Inside the 2nm EUV semiconductor laser machine standoff between US/Dutch export rules, China Gallium mineral counters, and the India–Middle East–Europe (IMEC) trade highway.',
    trustedCitations: [
      {
        outlet: 'ASML Official Technology Press',
        domain: 'asml.com',
        url: 'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made',
        verificationNote: 'Official High-NA EUV lithography specifications and wafer manufacturing process'
      },
      {
        outlet: 'Reuters Geopolitics & Supply Chain',
        domain: 'reuters.com',
        url: 'https://www.reuters.com/technology/',
        verificationNote: 'Verified export control filings on EUV systems, Gallium/Germanium customs data, and IMEC port agreements'
      }
    ],
    hotspots: [
      {
        id: 'geo-hs-1',
        xPercent: 34,
        yPercent: 62,
        actorFlag: '🇺🇸🇳🇱',
        label: 'ASML EUV Chip Printing Machine ($380M)',
        detail:
          'Think of this as a microscopic laser camera made in the Netherlands that prints billions of circuits onto phone & AI chips.'
      },
      {
        id: 'geo-hs-2',
        xPercent: 68,
        yPercent: 38,
        actorFlag: '🇮🇳🇦🇪',
        label: 'IMEC Ship + Train Shortcut (India ➔ UAE ➔ Europe)',
        detail:
          'A new fast shipping highway from Mumbai/Mundra to Dubai, Saudi by rail, and straight to Europe—40% faster than old routes.'
      },
      {
        id: 'geo-hs-3',
        xPercent: 86,
        yPercent: 68,
        actorFlag: '🇨🇳',
        label: 'Gallium Mineral (The Heat-Proof Chip Metal)',
        detail:
          'China refines 98% of Gallium—a special metal needed so fast chargers, 5G towers, and military radars do not melt from heat.'
      }
    ],
    videoChapters: [
      {
        timecode: '00:00 / 00:45',
        progressPercent: 22,
        title: 'Part 1 · What is an ASML EUV Machine? (The Microscopic Printer)',
        thunglishCaption:
          'Idhu romba simple: namma phone matrum AI chip-ah print panra ulagathoda ore laser printing machine Netherlands-la irukura ASML company kitta mattum dhaan iruku. America andha machine-ah China-ku thara koodathu nu block panniduchu.',
        telemetryCallout: 'CHIP PRINTER LOCK: $380M / MACHINE'
      },
      {
        timecode: '00:17 / 00:45',
        progressPercent: 56,
        title: 'Part 2 · China’s Counter-Move: Blocking Gallium Metal',
        thunglishCaption:
          'Adhuku pathilaa China enna pannanga na, radar matrum fast-charging chip urugaama iruka thevayana Gallium metal-ah naangalum veliya thara maatom nu counter-lock potanga.',
        telemetryCallout: 'GALLIUM METAL SHARE: 98% CHINA CONTROL'
      },
      {
        timecode: '00:33 / 00:45',
        progressPercent: 95,
        title: 'Part 3 · How India Wins with the IMEC Trade Highway',
        thunglishCaption:
          'Indha rendu naadu sandaiyila maatikama, India, UAE, matrum Saudi Arabia serndhu Mumbai-la irundhu Dubai vazhiya Europe-ku 40 percent vegama pora pudhu kappal matrum rail route-ah uruvaakuraanga.',
        telemetryCallout: 'IMEC HIGHWAY: 40% FASTER DELIVERY'
      }
    ],
    simpleEverydayTerms: [
      {
        term: 'ASML EUV Lithography',
        everydayMeaning:
          'A $380 Million laser projector that prints microscopic lines thinner than a virus onto silicon to make iPhone and AI chips.',
        whyItMattersToYou:
          'Whoever controls this machine controls who can build the fastest smartphones, laptops, and AI servers.'
      },
      {
        term: 'Gallium & Germanium',
        everydayMeaning:
          'Special heat-resistant metals (98% refined in China) that allow chips to handle high voltage without overheating.',
        whyItMattersToYou:
          'Used inside your compact laptop GaN fast-charger, electric car inverters, 5G towers, and defense radars.'
      },
      {
        term: 'IMEC Trade Corridor',
        everydayMeaning:
          'A direct Ship + High-Speed Freight Train expressway linking India (Mundra/Mumbai) ➔ UAE ➔ Saudi Arabia ➔ Europe.',
        whyItMattersToYou:
          'Cuts delivery time for Indian exports by 40% and brings new electronics & chip packaging factories to India.'
      }
    ],
    relatedBroadcasts: [
      {
        id: 'geo-clip-1',
        title: 'Inside ASML’s High-NA EUV Lithography Cleanroom',
        channel: 'ASML / Reuters Tech Documentary',
        trustedSourceDomain: 'asml.com',
        verifiedReportUrl: 'https://www.asml.com/en/news',
        youtubeEmbedId: 'iSVHp6CAyQ8',
        duration: '04:55',
        summary:
          'Verified look inside Veldhoven, Netherlands where 13.5nm extreme ultraviolet laser mirrors print sub-2nm silicon chips.',
        thunglishSummary:
          'Netherlands-la irukura ASML factory-kulla $380 Million laser machine epdi 2nm chip-ah print pannuthu nu neradiya kaatum video.'
      },
      {
        id: 'geo-clip-2',
        title: 'The India–Middle East–Europe Economic Corridor (IMEC) Explained',
        channel: 'Global Trade & Maritime Desk',
        trustedSourceDomain: 'reuters.com',
        verifiedReportUrl: 'https://www.reuters.com/world/india/',
        youtubeEmbedId: '4x7_bN8N8dE',
        duration: '05:10',
        summary:
          'How India, UAE, Saudi Arabia, and the EU are linking ports and rail networks to create a resilient supply chain highway.',
        thunglishSummary:
          'Mumbai port-la irundhu Dubai matrum Saudi train vazhiya Europe-ku pora pudhu IMEC trade route epdi work aaguthu?'
      }
    ]
  },

  DEFENCE: {
    pillarId: 'DEFENCE',
    primaryImageUrl: '/images/pillars/defence.jpg',
    secondaryImageUrl: '/images/pillars/aerospace.jpg',
    photoCredit: 'Verified Desk · Counter-UAS & Directed Energy Report',
    locationBadge: '📍 High-Altitude Tactical Sector · Edge-AI Test Range',
    reconTimestamp: 'VERIFIED DATA · DEFENSENEWS & DRDO',
    imageCaption:
      'Mobile solid-state Gallium Nitride (GaN) radar truck tracking an autonomous camera-guided drone swarm that flies without GPS or radio signals.',
    trustedCitations: [
      {
        outlet: 'DefenseNews Unmanned & EW Desk',
        domain: 'defensenews.com',
        url: 'https://www.defensenews.com/unmanned/',
        verificationNote: 'Verified reports on optical-navigation drones, fiber-optic FPVs, and directed-energy laser interceptors'
      },
      {
        outlet: 'IEEE Spectrum Defense Robotics',
        domain: 'spectrum.ieee.org',
        url: 'https://spectrum.ieee.org/topic/robotics/',
        verificationNote: 'Technical verification of edge-NPU visual odometry and solid-state GaN AESA radar arrays'
      }
    ],
    hotspots: [
      {
        id: 'def-hs-1',
        xPercent: 32,
        yPercent: 48,
        actorFlag: '🇮🇳🇺🇸🇮🇱',
        label: 'GaN Radar + $1.20/Shot Laser Shield',
        detail:
          'Instead of firing a $2 Million missile at a cheap drone, this system uses a high-power electric laser beam that costs just $1.20 per shot.'
      },
      {
        id: 'def-hs-2',
        xPercent: 64,
        yPercent: 26,
        actorFlag: '🇺🇦🇷🇺',
        label: '$1,500 Smart Camera Drone (No GPS Needed)',
        detail:
          'Even if enemy jammers block GPS and radio signals, the drone uses its own camera + phone-sized AI chip to read hills and roads by sight.'
      },
      {
        id: 'def-hs-3',
        xPercent: 41,
        yPercent: 68,
        actorFlag: '⚡',
        label: 'Mobile Generator-Powered Defense Truck',
        detail:
          'As long as the truck has diesel/electric power, the laser shield never runs out of ammunition.'
      }
    ],
    videoChapters: [
      {
        timecode: '00:00 / 00:45',
        progressPercent: 22,
        title: 'Part 1 · The Math Problem: $1,500 Drone vs. $2 Million Missile',
        thunglishCaption:
          'Yosichi paarunga: verum aayirathi ainnooru dollar vilai ulla chinna drone-ah sudurathuku, rendu million dollar vilai ulla periya missile-ah use panna endha naadume thaangaadhu.',
        telemetryCallout: 'COST GAP: $1,500 DRONE vs $2.1M MISSILE'
      },
      {
        timecode: '00:19 / 00:45',
        progressPercent: 58,
        title: 'Part 2 · How Drones Fly Without GPS (Like Human Eyes)',
        thunglishCaption:
          'Ippo vara pudhu drones GPS illamale, namma manushan kannala vazhiya paathu nadakura maadhiri, camera matrum chinna AI chip vachi malaigalaiyum road-aiyum paathu auto-pilot-la parakkuthu.',
        telemetryCallout: 'ZERO GPS NEEDED: ONBOARD CAMERA AI'
      },
      {
        timecode: '00:35 / 00:45',
        progressPercent: 95,
        title: 'Part 3 · The Solution: $1.20 Electric Laser Beams',
        thunglishCaption:
          'Adhanaala India DRDO, America, matrum Israel ippo costly missile-ku badhila, oru shot-uku verum 100 rooba selavaagura high-power electric laser beam vachi drone swarm-ah vaanilaye azhikiraanga.',
        telemetryCallout: 'LASER SHIELD: $1.20 PER SHOT'
      }
    ],
    simpleEverydayTerms: [
      {
        term: 'RF-Silent Optical Navigation',
        everydayMeaning:
          'Flying a drone with its radio and GPS turned completely OFF—it looks at buildings, rivers, and hills through a camera just like a human driver.',
        whyItMattersToYou:
          'Makes traditional radio jammers useless and powers next-gen autonomous delivery drones and self-driving vehicles.'
      },
      {
        term: 'Directed-Energy Laser (DEW)',
        everydayMeaning:
          'An ultra-powerful focused light beam powered by electricity that melts incoming drone propellers in 2 seconds for the cost of a cup of tea ($1.20).',
        whyItMattersToYou:
          'Saves billions in national defense budgets that would otherwise be wasted firing expensive missiles at cheap drones.'
      },
      {
        term: 'GaN AESA Radar',
        everydayMeaning:
          'A digital radar made with Gallium Nitride chips that scans the entire sky thousands of times per second without any moving mechanical dish.',
        whyItMattersToYou:
          'Can spot tiny carbon-fiber drones hidden between mountain valleys and guides airport weather/safety systems.'
      }
    ],
    relatedBroadcasts: [
      {
        id: 'def-clip-1',
        title: 'Directed-Energy Laser Air Defense vs. Drone Swarms',
        channel: 'DefenseNews / Tactical Systems',
        trustedSourceDomain: 'defensenews.com',
        verifiedReportUrl: 'https://www.defensenews.com/land/',
        youtubeEmbedId: 'tyUh_xSjvW8',
        duration: '04:18',
        summary:
          'Verified test footage showing solid-state high-energy lasers tracking and neutralizing unmanned aerial targets at $1.20 per shot.',
        thunglishSummary:
          'High-power electric laser beam epdi 2 second-la drone-ah vaanilaye suttu veezhthuthu nu kaatum real defense video.'
      },
      {
        id: 'def-clip-2',
        title: 'How Computer-Vision Drones Navigate Without GPS',
        channel: 'IEEE Spectrum Robotics',
        trustedSourceDomain: 'spectrum.ieee.org',
        verifiedReportUrl: 'https://spectrum.ieee.org/robotics',
        youtubeEmbedId: 'fH4VwTgfyrQ',
        duration: '05:05',
        summary:
          'Engineering breakdown of onboard visual odometry and edge neural processors that let drones fly through jammed environments.',
        thunglishSummary:
          'GPS matrum radio signal cut aanaalum, drone epdi thannoda camera kannu vachi vazhiya kandupidichi parakkuthu?'
      }
    ]
  },

  AEROSPACE: {
    pillarId: 'AEROSPACE',
    primaryImageUrl: '/images/pillars/aerospace.jpg',
    secondaryImageUrl: '/images/pillars/defence.jpg',
    photoCredit: 'Verified Desk · Orbital Launch & VLEO Telemetry',
    locationBadge: '📍 280 km Very Low Earth Orbit (VLEO) · Direct-to-Mobile',
    reconTimestamp: 'VERIFIED DATA · SPACENEWS & ISRO',
    imageCaption:
      'Reusable stainless-steel rocket deploying low-flying 280 km satellites that connect directly to ordinary 5G smartphones without any dish antenna.',
    trustedCitations: [
      {
        outlet: 'SpaceNews Launch & Satellite Wire',
        domain: 'spacenews.com',
        url: 'https://spacenews.com/segment/launch/',
        verificationNote: 'Verified orbital launch cost per kg, VLEO direct-to-cell constellation filings, and ISRO SSLV missions'
      },
      {
        outlet: 'ISRO Official Mission Portal',
        domain: 'isro.gov.in',
        url: 'https://www.isro.gov.in/',
        verificationNote: 'Official Indian Space Research Organisation SSLV and commercial launch vehicle specifications'
      }
    ],
    hotspots: [
      {
        id: 'aero-hs-1',
        xPercent: 38,
        yPercent: 36,
        actorFlag: '🇺🇸',
        label: 'Reusable Rocket (Works Like a Commercial Airplane)',
        detail:
          'Instead of throwing away a $100M rocket after one flight, it lands back and flies again—cutting space shipping cost from $10,000/kg to $150/kg.'
      },
      {
        id: 'aero-hs-2',
        xPercent: 76,
        yPercent: 64,
        actorFlag: '🛰️',
        label: '280 km Low-Flying Satellites (Cell Towers in Space)',
        detail:
          'Flying twice as close to Earth (280 km height) so your normal pocket smartphone gets 5G signal even in the middle of the ocean or forest.'
      },
      {
        id: 'aero-hs-3',
        xPercent: 58,
        yPercent: 78,
        actorFlag: '🇮🇳🇯🇵',
        label: 'ISRO SSLV & Space Laser Wi-Fi Mesh',
        detail:
          'Satellites beam internet to each other using laser light in space—40% faster than undersea cables.'
      }
    ],
    videoChapters: [
      {
        timecode: '00:00 / 00:45',
        progressPercent: 22,
        title: 'Part 1 · Why Space Got 95% Cheaper (Airplane-Style Rockets)',
        thunglishCaption:
          'Munnadi ellam oru rocket-ah oru thadava launch pannitu kadal-la thooki potruvaanga. Ippo flight maadhiri thirumba land panni reuse panrathaala, oru kilo porula space-ku anuppa verum 150 dollar dhaan aaguthu.',
        telemetryCallout: 'LAUNCH COST DROP: $10,000 ➔ $150 / KG'
      },
      {
        timecode: '00:18 / 00:45',
        progressPercent: 58,
        title: 'Part 2 · What is 280 km VLEO? (Cell Towers in the Sky)',
        thunglishCaption:
          'Boomiku romba pakkathula, verum 280 kilometer uyarathula satellites parakkurathaala, entha dish antenna-vum illama unga kaiyila irukura normal 5G phone-ke kadal naduvulayum direct-aa internet signal kidaikum.',
        telemetryCallout: 'DIRECT TO PHONE: 280 KM · 18ms SPEED'
      },
      {
        timecode: '00:34 / 00:45',
        progressPercent: 95,
        title: 'Part 3 · India ISRO & Private Space Startups Opportunity',
        thunglishCaption:
          'Namma ISRO SSLV matrum Skyroot, Agnikul maadhiri Indian startups kammi selavula small satellites-ah launch panni global space market-ah pudikiraanga.',
        telemetryCallout: 'INDIA SPACE EDGE: LOW-COST RAPID LAUNCH'
      }
    ],
    simpleEverydayTerms: [
      {
        term: 'VLEO (Very Low Earth Orbit - 280 km)',
        everydayMeaning:
          'Flying satellites twice as close to Earth (280 km high instead of 600+ km) so they act like nearby mobile towers in the sky.',
        whyItMattersToYou:
          'Zero dead zones—your regular phone will have signal on highways, mountains, flights, and oceans without extra hardware.'
      },
      {
        term: 'Hall-Effect Ion Thruster',
        everydayMeaning:
          'A solar-powered electric engine that shoots glowing blue gas ions to gently push the satellite forward so it never falls down.',
        whyItMattersToYou:
          'Keeps internet satellites flying in low orbit for years using almost no heavy fuel.'
      },
      {
        term: 'Optical Inter-Satellite Laser Link',
        everydayMeaning:
          'Beaming internet data from one satellite to another in space using invisible laser light instead of slow undersea wires.',
        whyItMattersToYou:
          'Delivers faster video calls, gaming, and financial transactions between India, Europe, and the US.'
      }
    ],
    relatedBroadcasts: [
      {
        id: 'aero-clip-1',
        title: 'Reusable Heavy-Lift Rocket Booster Catch & Orbital Deployment',
        channel: 'SpaceNews / Launch Telemetry',
        trustedSourceDomain: 'spacenews.com',
        verifiedReportUrl: 'https://spacenews.com/',
        youtubeEmbedId: 'hI9HQfCAw64',
        duration: '04:40',
        summary:
          'Verified orbital flight footage showing full booster recovery and deployment of direct-to-cell low-earth-orbit satellites.',
        thunglishSummary:
          'Rocket epdi space-ku poitu thirumba flight maadhiri padhrama land aagi selavai 95 percent koraikuthu nu kaatum video.'
      },
      {
        id: 'aero-clip-2',
        title: 'How Direct-to-Cell Satellites Connect to Normal Phones',
        channel: 'Orbital Communications Desk',
        trustedSourceDomain: 'isro.gov.in',
        verifiedReportUrl: 'https://www.isro.gov.in/',
        youtubeEmbedId: 'U9kK6n6_0_A',
        duration: '03:55',
        summary:
          'Simple visual guide on how phased-array antennas in 280 km orbit act like cell towers in space for standard LTE/5G phones.',
        thunglishSummary:
          '280 km uyarathula irukura satellite epdi entha dish-um illama namma pocket phone-ku direct signal kudukuthu?'
      }
    ]
  },

  TECH: {
    pillarId: 'TECH',
    primaryImageUrl: '/images/pillars/tech.jpg',
    secondaryImageUrl: '/images/pillars/geopolitics.jpg',
    photoCredit: 'Verified Desk · IEEE Spectrum Silicon Photonics Lab',
    locationBadge: '📍 Hsinchu (TW) · Santa Clara · Bengaluru Chip Design Hub',
    reconTimestamp: 'VERIFIED DATA · IEEE SPECTRUM & LINUX KERNEL',
    imageCaption:
      'Replacing overheating copper wires inside AI chips with microscopic laser light fibers (Silicon Photonics) and zero-delay camera memory pipelines.',
    trustedCitations: [
      {
        outlet: 'IEEE Spectrum Semiconductors',
        domain: 'spectrum.ieee.org',
        url: 'https://spectrum.ieee.org/topic/semiconductors/',
        verificationNote: 'Verified peer-reviewed coverage of 1.6T co-packaged silicon photonics and HBM4 3D packaging'
      },
      {
        outlet: 'Linux Kernel V4L2 DMA-BUF Documentation',
        domain: 'docs.kernel.org',
        url: 'https://docs.kernel.org/driver-api/dma-buf.html',
        verificationNote: 'Official Linux kernel zero-copy DMA-BUF shared memory architecture used in embedded edge AI'
      }
    ],
    hotspots: [
      {
        id: 'tech-hs-1',
        xPercent: 46,
        yPercent: 38,
        actorFlag: '🇺🇸🇹🇼',
        label: '3D Stacked Memory + AI Brain (HBM4)',
        detail:
          'Instead of placing memory far away on the board, 16 layers of memory are stacked like an apartment building right next to the AI processor.'
      },
      {
        id: 'tech-hs-2',
        xPercent: 68,
        yPercent: 56,
        actorFlag: '🔬',
        label: 'Silicon Photonics (Laser Light Inside the Chip)',
        detail:
          'Copper wires get hot when carrying huge AI data; these glowing blue optical fibers carry data using light with 68% less heat!'
      },
      {
        id: 'tech-hs-3',
        xPercent: 28,
        yPercent: 72,
        actorFlag: '🇮🇳🇸🇬',
        label: 'Zero-Copy Camera Pipeline & RISC-V Chip Design',
        detail:
          'Engineered in Bengaluru & Chennai labs: lets a robot or car camera send video straight to the AI chip in 3.4ms without copying files 4 times.'
      }
    ],
    videoChapters: [
      {
        timecode: '00:00 / 00:45',
        progressPercent: 22,
        title: 'Part 1 · Why Copper Wires Inside Chips Overheat',
        thunglishCaption:
          'Namma phone matrum AI computer-la data vegama pogumpodhu, sadharana copper wire romba soodaagi 40 percent current-ah heat-aave waste panniduthu.',
        telemetryCallout: 'COPPER PROBLEM: 40% POWER LOST AS HEAT'
      },
      {
        timecode: '00:18 / 00:45',
        progressPercent: 58,
        title: 'Part 2 · What is Silicon Photonics? (Laser Light Instead of Copper)',
        thunglishCaption:
          'Adhanaala NVIDIA matrum TSMC enna panranga na, copper wire-ku badhila chip-kullaye chinna laser light fiber-ah sorugi, 68 percent current-ah micham panni soodaagama data anuppuraanga.',
        telemetryCallout: 'LASER CHIP I/O: 68% LESS HEAT & POWER'
      },
      {
        timecode: '00:34 / 00:45',
        progressPercent: 95,
        title: 'Part 3 · What is Zero-Copy DMA-BUF? (Direct Express Pass)',
        thunglishCaption:
          'Adhe maadhiri self-driving car camera edukkura photo-va 4 idathula copy panni time waste pannama, Zero-Copy DMA-BUF vazhiya ore second-la direct-aa AI chip-ku kaatrom. Idha Bengaluru matrum Chennai chip engineers dhaan design panranga!',
        telemetryCallout: 'CAMERA SPEED: 28ms ➔ 3.4ms (ZERO-COPY)'
      }
    ],
    simpleEverydayTerms: [
      {
        term: 'Silicon Photonics (Optical I/O)',
        everydayMeaning:
          'Replacing tiny metal copper wires inside a computer chip with microscopic laser light tubes—so data travels at the speed of light without heating up.',
        whyItMattersToYou:
          'Makes AI data centers, laptops, and future smartphones run cooler and use 68% less electricity.'
      },
      {
        term: 'Zero-Copy DMA-BUF Pipeline',
        everydayMeaning:
          'Instead of photocopying a camera photo 4 times between different memory folders, the camera and AI chip look at the exact same original photo in one shared room.',
        whyItMattersToYou:
          'Cuts camera reaction time from 28ms to 3.4ms—critical so self-driving cars and drones brake instantly.'
      },
      {
        term: 'RISC-V Open Chip Architecture',
        everydayMeaning:
          'Think of it like "Android for Hardware Chips"—an open, royalty-free chip blueprint that Indian startups and global labs can customize freely.',
        whyItMattersToYou:
          'Allows Indian engineers in Bengaluru, Chennai, and Hyderabad to build indigenous processors without paying foreign license fees.'
      }
    ],
    relatedBroadcasts: [
      {
        id: 'tech-clip-1',
        title: 'How Silicon Photonics Replaces Copper Wires with Laser Light',
        channel: 'IEEE Spectrum / Semiconductor Engineering',
        trustedSourceDomain: 'spectrum.ieee.org',
        verifiedReportUrl: 'https://spectrum.ieee.org/silicon-photonics',
        youtubeEmbedId: 'ca2A3kL_c2I',
        duration: '04:30',
        summary:
          'Visual explanation of how optical waveguides inside AI processors transmit 1.6 Terabits/sec while cutting heat by 68%.',
        thunglishSummary:
          'Chip-kulla soodaagura copper wire-ku badhila laser light fiber epdi data-va vegama matrum cool-aa kondu poguthu?'
      },
      {
        id: 'tech-clip-2',
        title: 'Inside 2nm Wafer Fabrication & 3D HBM4 Chip Stacking',
        channel: 'TSMC / Chip Architecture Desk',
        trustedSourceDomain: 'docs.kernel.org',
        verifiedReportUrl: 'https://docs.kernel.org/driver-api/dma-buf.html',
        youtubeEmbedId: 'dX9CGRZwD-w',
        duration: '05:15',
        summary:
          'Step-by-step animation showing how billions of transistors and 16-layer memory stacks are bonded into a single processor.',
        thunglishSummary:
          'Oru chinna AI chip-kulla 16 adukku memory-um kodi kanakkana transistor-um epdi adukki vaikiraanga nu easy-aa puriya vaikum video.'
      }
    ]
  }
};

export function getMediaForPillar(
  pillarData: NeatPillarData,
  liveRssImageUrl?: string
): PillarMediaAsset & { activeDisplayImageUrl: string; isLiveRssImage: boolean } {
  const base = PILLAR_MEDIA_CATALOG[pillarData.id] || PILLAR_MEDIA_CATALOG.MONEY;
  const cleanRssImg =
    liveRssImageUrl && /^https?:\/\/.+/i.test(liveRssImageUrl.trim())
      ? liveRssImageUrl.trim()
      : '';

  return {
    ...base,
    activeDisplayImageUrl: cleanRssImg || base.primaryImageUrl,
    isLiveRssImage: Boolean(cleanRssImg)
  };
}
