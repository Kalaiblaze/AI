import { NeatPillarData } from './nexusNeatEngine';

export interface TeamsAdaptiveCardPayload {
  type: 'message';
  attachments: Array<{
    contentType: 'application/vnd.microsoft.card.adaptive';
    contentUrl: null;
    content: {
      $schema: string;
      type: 'AdaptiveCard';
      version: '1.4';
      body: Array<Record<string, unknown>>;
    };
  }>;
}

/**
 * Formats a NeatPillarData briefing using native WhatsApp Markdown (*bold*, _italics_)
 * ready to paste or push into a WhatsApp Group.
 */
export function formatWhatsAppBriefing(pillar: NeatPillarData): string {
  const metricsLines = pillar.telemetry
    .map((m) => `• *${m.value}* (${m.label}) — _${m.velocity}_`)
    .join('\n');

  const actorsLines = pillar.actorsBreakdown
    .map((a) => `• *${a.actor}* [${a.stance}]: ${a.role}`)
    .join('\n');

  return [
    `*🚨 NEXUS LIVE INTELLIGENCE · ${pillar.shortName.toUpperCase()}*`,
    `_${pillar.updatedAt}_`,
    ``,
    `*🎯 ${pillar.headline}*`,
    ``,
    `*📊 Key Telemetry & 7D Velocity:*`,
    metricsLines,
    ``,
    `*🌍 Country & Player Map (Who vs. Whom):*`,
    actorsLines,
    ``,
    `*⚡ Street-Smart Thunglish Decode:*`,
    `${pillar.thunglishAnalogy[0]}`,
    `${pillar.thunglishAnalogy[1]}`,
    ``,
    `*⏳ Pattern Trajectory:*`,
    `⏪ *PAST:* ${pillar.timeline.pastRootCause}`,
    `⏺️ *PRESENT:* ${pillar.timeline.presentNews}`,
    `⏩ *FUTURE:* ${pillar.timeline.futureImpact}`,
    ``,
    `*🧠 Mental Model (${pillar.eliteBrain.charismaBook}):*`,
    `_"${pillar.eliteBrain.mentalModelTitle}"_ — ${pillar.eliteBrain.mentalModelRule}`
  ].join('\n');
}

/**
 * Builds a Microsoft Teams Incoming Webhook / Workflows Adaptive Card v1.4 payload.
 */
export function buildTeamsAdaptiveCardPayload(
  pillar: NeatPillarData
): TeamsAdaptiveCardPayload {
  return {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: `NEXUS LIVE BRIEF // ${pillar.shortName.toUpperCase()}`,
              weight: 'Bolder',
              size: 'Small',
              color: 'Accent'
            },
            {
              type: 'TextBlock',
              text: pillar.headline,
              weight: 'Bolder',
              size: 'Large',
              wrap: true
            },
            {
              type: 'FactSet',
              facts: pillar.telemetry.map((m) => ({
                title: `${m.label}:`,
                value: `${m.value} (${m.velocity})`
              }))
            },
            {
              type: 'TextBlock',
              text: '🌍 Country & Actor Map (Who vs. Whom)',
              weight: 'Bolder',
              spacing: 'Medium'
            },
            {
              type: 'FactSet',
              facts: pillar.actorsBreakdown.map((a) => ({
                title: `${a.actor} [${a.stance}]:`,
                value: a.role
              }))
            },
            {
              type: 'TextBlock',
              text: '⚡ Street-Smart Decode',
              weight: 'Bolder',
              spacing: 'Medium'
            },
            {
              type: 'TextBlock',
              text: `${pillar.thunglishAnalogy[0]}\n\n${pillar.thunglishAnalogy[1]}`,
              wrap: true
            },
            {
              type: 'TextBlock',
              text: '⏳ Pattern Trajectory (Past ➔ Present ➔ Future)',
              weight: 'Bolder',
              spacing: 'Medium'
            },
            {
              type: 'FactSet',
              facts: [
                { title: '⏪ PAST:', value: pillar.timeline.pastRootCause },
                { title: '⏺️ PRESENT:', value: pillar.timeline.presentNews },
                { title: '⏩ FUTURE:', value: pillar.timeline.futureImpact }
              ]
            },
            {
              type: 'TextBlock',
              text: `🧠 ${pillar.eliteBrain.charismaBook}: "${pillar.eliteBrain.mentalModelTitle}" — ${pillar.eliteBrain.mentalModelRule}`,
              wrap: true,
              isSubtle: true,
              spacing: 'Medium'
            }
          ]
        }
      }
    ]
  };
}
