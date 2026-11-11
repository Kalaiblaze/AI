import { NeatPillarData } from './nexusNeatEngine';

export type MentorIntent =
  | 'CASUAL_GREETING'
  | 'MEETING_OR_CAREER_QUESTION'
  | 'FAILURE_OR_WINNER_QUESTION'
  | 'DOMAIN_DEEP_DIVE';

export const MENTOR_SYSTEM_INSTRUCTION = `You are an elite, street-smart Pattern Recognition Mentor and Global Intelligence Analyst who speaks in natural, engaging Thunglish (Romanized Tamil + English tech mix).

CRITICAL ANTI-ROBOTIC RULE (NEVER REPEAT THE SAME TEMPLATE):
- You are STRICTLY FORBIDDEN from using the same fixed bullet points (like "1. Crisp Thunglish Analogy / 2. Past-Present-Future / 3. Elite Mental Model") on every message!
- Read the user's exact intent and respond dynamically like a real, hyper-intelligent human mentor:

1. IF THE USER SAYS "HI", "HELLO", "VANAKKAM", OR CASUAL CHAT:
   - Respond naturally in 1-2 conversational sentences like a sharp mentor welcoming a friend. Do NOT dump random news or bullet points.

2. IF THE USER ASKS A SPECIFIC QUESTION (e.g., "Give me a question to ask in meetings", "How does this connect to career & engineering skills?", or "Why did X fail?"):
   - Answer THAT exact question directly and deeply. Give practical variations, real psychological mechanics (how people react in a room), and exact examples. Do NOT force a fake "Past -> Present -> Future" timeline when it doesn't belong.

3. IF THE USER ASKS FOR A DOMAIN DEEP-DIVE OR NEWS (Aerospace, Defence, Geopolitics, Money, Tech/Embedded, Physics):
   - NEVER give generic textbook lines like "rockets use escape velocity."
   - Dive straight into specific, high-signal real-world engineering and market mechanics (e.g., actual chip architectures, V4L2 zero-copy DMA-BUF, supply chain bottlenecks like rare-earth Yttrium/Scandium/Gallium shortages, DARPA/SpaceX/NVIDIA moves, sovereign debt repo mechanics).
   - Naturally weave in how the past led to today's trigger, where it's heading next, which companies won vs. crashed (and why), and relevant mental models from legendary books—using organic headings or flowing conversation, NEVER a repetitive 3-bullet stamp.

TONE & DEPTH:
- Be sharp, candid, and technically rich. Use everyday Tamil-English analogies only when explaining a genuinely complex mechanism, not as a forced label.`;

export function classifyUserIntent(userMessage: string): MentorIntent {
  const clean = userMessage.trim().toLowerCase();

  // 1. Casual greeting or short check-in
  if (
    /^(hi|hello|hey|vanakkam|yo|sup|good morning|good evening|epdi iruka|eppadi irukinga|boss|nanba|bro)[!?.,\s]*$/i.test(
      clean
    ) ||
    (clean.length <= 18 &&
      /\b(hi|hello|hey|vanakkam|sup|epdi)\b/i.test(clean))
  ) {
    return 'CASUAL_GREETING';
  }

  // 2. Specific question about meetings, career, skills, or communication
  if (
    clean.includes('meeting') ||
    clean.includes('career') ||
    clean.includes('question to ask') ||
    clean.includes('skill') ||
    clean.includes('interview') ||
    clean.includes('speak') ||
    clean.includes('charisma') ||
    clean.includes('boss') && clean.includes('ask')
  ) {
    return 'MEETING_OR_CAREER_QUESTION';
  }

  // 3. Specific question about why a company failed or won
  if (
    clean.includes('why did') ||
    clean.includes('fail') ||
    clean.includes('crash') ||
    clean.includes('mistake') ||
    clean.includes('winner') ||
    clean.includes('nokia') ||
    clean.includes('intel') ||
    clean.includes('kodak') ||
    clean.includes('boeing') ||
    clean.includes('svb')
  ) {
    return 'FAILURE_OR_WINNER_QUESTION';
  }

  // 4. Default to rich, organic domain deep-dive
  return 'DOMAIN_DEEP_DIVE';
}

export function generateDynamicMentorFallback(
  userMessage: string,
  pillar: NeatPillarData
): string {
  const intent = classifyUserIntent(userMessage);
  const lower = userMessage.toLowerCase();

  if (intent === 'CASUAL_GREETING') {
    return `Vanakkam Boss! Semma timing—ippo dhaan ${pillar.shortName} desk-la varra pudhu engineering & market signals-ah decode pannitu irundhen. Sollunga, innaiku endha tech bottleneck illa strategy angle-ah pirichu meiyalaam?`;
  }

  if (intent === 'MEETING_OR_CAREER_QUESTION') {
    if (lower.includes('meeting') || lower.includes('question')) {
      return `Meeting-la ellarum surface-level features pathi pesumbothu, neenga calm-ah oru 2-second pause vittu indha 3 First-Principles questions-la onnu kelunga—room-oda total focus unga pakkam thirumbidum:

• **The Bottleneck Probe:** *"Wait—if our volume scales 10x next quarter, which exact hardware or supply-chain link breaks first, and do we own that vendor relationship?"* (Idhu ketta udane bluff panravanga silent aagiduvaanga, real engineers respect pannuvaanga.)

• **The Deletion Test (Elon’s Rule):** *"Which 30% of this spec exists only because of a legacy assumption from two years ago that we can delete right now?"*

• **The Pre-Mortem Inversion (Kahneman):** *"Suppose it's 12 months from today and this rollout failed completely—what was the single blind spot we ignored in this room today?"*`;
    }

    return `Career & engineering angle-la paathingana Boss, crowd epovume "shiny wrapper" pinnadi odum (like writing another generic API wrapper). Aana real leverage & compensation enga iruku na **irreplaceable low-level bottlenecks**-la dhaan:

In **${pillar.shortName}**, don't just learn high-level dashboards. Go one layer deeper where others are scared to touch—like kernel-level V4L2 \`DMA-BUF\` zero-copy memory plumbing, GaN power electronics thermal design, or sovereign liquidity risk modeling. Namma oorla solluvaangale: *"Auto ooturavanuku route theriyum, aana engine-ah pirichu maatravanuku dhaan workshop-eh sondham"*—be the engineer who understands the underlying physics!`;
  }

  if (intent === 'FAILURE_OR_WINNER_QUESTION') {
    return `Oru giant company crash aagurathuku kaaranam talent kamiya irukurathu illa Boss—**Institutional Complacency & Sunk-Cost Ego** dhaan:

Take **${pillar.eliteBrain.failureTitle}** as a textbook case. ${pillar.eliteBrain.failurePoints[0]} ${pillar.eliteBrain.failurePoints[1]} Inside their boardrooms, engineers who raised early red flags were treated as "not team players" because leadership wanted to protect quarterly optics.

Contrast that with **${pillar.eliteBrain.winnerTitle}**: ${pillar.eliteBrain.winnerPoints[0]} As Andrew Grove wrote in *Only the Paranoid Survive*, the moment a company protects its legacy cash-cow instead of cannibalizing itself with next-gen physics, the countdown to irrelevance starts.`;
  }

  // DOMAIN_DEEP_DIVE: Organic, deeply technical narrative without a fixed 3-bullet stamp
  return `Let's cut straight past the surface headlines on **${pillar.shortName}** (${pillar.headline}).

${pillar.thunglishAnalogy[0]} ${pillar.thunglishAnalogy[1]}

**The Real Engineering & Supply-Chain Mechanics**
What most analysts miss is the physical constraint layer underneath: ${pillar.timeline.pastRootCause} Right now, ${pillar.timeline.presentNews} Whether it's Sc/Yttrium-stabilized thermal barrier coatings in high-Mach turbines, CoWoS-L interposer wafer allocation, or IOMMU scatter-gather tables in embedded Linux, you cannot print physical capacity overnight with central bank liquidity.

**Where the Smart Money & Talent Move Next**
${pillar.timeline.futureImpact} Notice how this immediately triggers a chain reaction: ${pillar.connectedSteps[0].fromLabel} forces a shift in ${pillar.connectedSteps[0].toLabel}—${pillar.connectedSteps[0].thunglishLine} Keep Peter Thiel's *Zero to One* rule in mind here: ignore the noisy competition at the application layer and position yourself right on the physical bottleneck that every player is forced to pay toll to.`;
}
