import {
  NeatPillarData,
  NeatPillarId,
  IncomingWireItem,
  NEAT_PILLARS,
  createCustomTopicPillarData,
  formatISTTimestamp
} from './nexusNeatEngine';
import { FutifyStoryItem, HERO_CONFIDENCE_BY_PILLAR } from './futifyEngine';
import { getUniqueStoryImage } from './uniqueImageEngine';

export interface GroundedSourceLink {
  title: string;
  uri: string;
  domain: string;
}

export interface GroundedHeadlineResult {
  id: string;
  headline: string;
  summary: string;
  pillarId: NeatPillarId;
  thunglishHook: string;
  keyMetric: string;
  impactHorizon: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface GlobalSearchResponse {
  query: string;
  briefSynthesis: string;
  results: GroundedHeadlineResult[];
  sources: GroundedSourceLink[];
  groundedAt: string;
  groundingMethod?: 'Google Search Grounding' | 'Google News Live Index';
}

export const TRENDING_SEARCH_TOPICS: { label: string; query: string }[] = [
  { label: 'TSMC 2nm GAA Yield', query: 'TSMC 2nm GAA semiconductor yield latest news' },
  { label: 'Central Bank Gold', query: 'Central bank gold reserves sovereign debt latest' },
  { label: 'Counter-Drone Lasers', query: 'Directed energy laser air defense military latest' },
  { label: 'Direct-to-Cell LEO', query: 'Starship orbital launch direct to cell satellites latest' },
  { label: 'V4L2 Edge AI', query: 'Embedded Linux V4L2 edge AI robotics silicon latest' }
];

const VALID_PILLARS: NeatPillarId[] = [
  'MONEY',
  'GEOPOLITICS',
  'DEFENCE',
  'AEROSPACE',
  'TECH'
];

export function extractDomainFromUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return 'web-source';
  }
}

export function classifyPillarFromText(text: string): NeatPillarId {
  const lower = (text || '').toLowerCase();

  if (
    /\b(missile|drone|radar|defence|defense|military|navy|army|air force|laser weapon|warfare|nato|cyberwar)\b/.test(
      lower
    )
  ) {
    return 'DEFENCE';
  }
  if (
    /\b(rocket|orbit|orbital|satellite|starship|spacex|isro|nasa|moon|lunar|mars|aerospace|launch vehicle|leo)\b/.test(
      lower
    )
  ) {
    return 'AEROSPACE';
  }
  if (
    /\b(chip|semiconductor|silicon|tsmc|nvidia|intel|amd|risc-v|linux|v4l2|kernel|ai\b|gpu|npu|photonics|2nm|gaa|embedded)\b/.test(
      lower
    )
  ) {
    return 'TECH';
  }
  if (
    /\b(tariff|sanction|treaty|diplomacy|corridor|imec|trade war|geopolit|export control|asml|taiwan|strait|summit|mineral)\b/.test(
      lower
    )
  ) {
    return 'GEOPOLITICS';
  }
  if (
    /\b(gold|treasury|fed|federal reserve|rbi|inflation|bond|yield|debt|currency|cbdc|mbridge|bank|gdp|stock|market|rate)\b/.test(
      lower
    )
  ) {
    return 'MONEY';
  }

  return 'TECH';
}

export function normalizePillarId(
  candidate: unknown,
  fallbackText: string
): NeatPillarId {
  if (typeof candidate === 'string') {
    const upper = candidate.trim().toUpperCase();
    if (VALID_PILLARS.includes(upper as NeatPillarId)) {
      return upper as NeatPillarId;
    }
  }
  return classifyPillarFromText(fallbackText);
}

export function dedupeGroundingSources(chunks: unknown): GroundedSourceLink[] {
  if (!Array.isArray(chunks)) return [];
  const seen = new Set<string>();
  const out: GroundedSourceLink[] = [];

  for (const chunk of chunks) {
    if (!chunk || typeof chunk !== 'object') continue;
    const web = (chunk as { web?: { uri?: unknown; title?: unknown } }).web;
    if (!web || typeof web.uri !== 'string') continue;
    const uri = web.uri.trim();
    if (!/^https?:\/\/.+/i.test(uri) || seen.has(uri)) continue;
    seen.add(uri);
    const title =
      typeof web.title === 'string' && web.title.trim().length > 0
        ? web.title.trim()
        : extractDomainFromUrl(uri);
    out.push({
      title,
      uri,
      domain: extractDomainFromUrl(uri)
    });
  }

  return out;
}

function tryExtractJsonObject(rawText: string): Record<string, unknown> | null {
  const trimmed = (rawText || '').trim();
  if (!trimmed) return null;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;

  try {
    const parsed = JSON.parse(candidate);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        const sliced = JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
        if (sliced && typeof sliced === 'object' && !Array.isArray(sliced)) {
          return sliced as Record<string, unknown>;
        }
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function parseGroundedSearchPayload(
  rawText: string,
  query: string,
  groundingChunks?: unknown
): GlobalSearchResponse {
  const sources = dedupeGroundingSources(groundingChunks);
  const parsed = tryExtractJsonObject(rawText);
  const nowStr = formatISTTimestamp();

  if (parsed && Array.isArray(parsed.results)) {
    const normalizedResults: GroundedHeadlineResult[] = [];
    for (let i = 0; i < parsed.results.length; i++) {
      const item = parsed.results[i];
      if (!item || typeof item !== 'object') continue;
      const obj = item as Record<string, unknown>;
      const headline =
        typeof obj.headline === 'string' && obj.headline.trim().length > 3
          ? obj.headline.trim()
          : '';
      if (!headline) continue;

      const summary =
        typeof obj.summary === 'string' && obj.summary.trim().length > 0
          ? obj.summary.trim()
          : `Live grounded development connected to ${query}.`;
      const combinedText = `${query} ${headline} ${summary}`;
      const pillarId = normalizePillarId(obj.pillarId, combinedText);
      const sourceMatch = sources[i] || sources[0];

      normalizedResults.push({
        id: `grounded-${pillarId}-${i}-${Date.now()}`,
        headline,
        summary,
        pillarId,
        thunglishHook:
          typeof obj.thunglishHook === 'string' && obj.thunglishHook.trim().length > 0
            ? obj.thunglishHook.trim()
            : `Boss, "${headline.slice(0, 64)}" direct-aa ${NEAT_PILLARS[pillarId].shortName} bottleneck-ah impact pannuthu!`,
        keyMetric:
          typeof obj.keyMetric === 'string' && obj.keyMetric.trim().length > 0
            ? obj.keyMetric.trim()
            : 'LIVE WEB SIGNAL',
        impactHorizon:
          typeof obj.impactHorizon === 'string' && obj.impactHorizon.trim().length > 0
            ? obj.impactHorizon.trim()
            : '6–18 Months',
        sourceTitle:
          typeof obj.sourceTitle === 'string' && obj.sourceTitle.trim().length > 0
            ? obj.sourceTitle.trim()
            : sourceMatch?.title,
        sourceUrl:
          typeof obj.sourceUrl === 'string' && /^https?:\/\//i.test(obj.sourceUrl)
            ? obj.sourceUrl.trim()
            : sourceMatch?.uri
      });
    }

    const briefSynthesis =
      typeof parsed.briefSynthesis === 'string' && parsed.briefSynthesis.trim().length > 0
        ? parsed.briefSynthesis.trim()
        : `Live web intelligence grounded across ${sources.length || normalizedResults.length} signals for "${query}".`;

    if (normalizedResults.length > 0) {
      return {
        query,
        briefSynthesis,
        results: normalizedResults,
        sources,
        groundedAt: nowStr,
        groundingMethod: 'Google Search Grounding'
      };
    }
  }

  // Fallback parser if the model returned prose or markdown bullets instead of JSON
  const cleanedLines = (rawText || '')
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').replace(/\*\*/g, '').trim())
    .filter((line) => line.length >= 20);

  const fallbackResults: GroundedHeadlineResult[] = cleanedLines
    .slice(0, 4)
    .map((line, idx) => {
      const pillarId = classifyPillarFromText(`${query} ${line}`);
      const sourceMatch = sources[idx] || sources[0];
      return {
        id: `grounded-${pillarId}-${idx}-${Date.now()}`,
        headline: line.length > 110 ? `${line.slice(0, 107)}...` : line,
        summary: line,
        pillarId,
        thunglishHook: `Boss, live web signal shows direct shift in ${NEAT_PILLARS[pillarId].shortName}: "${line.slice(0, 56)}..."`,
        keyMetric: sourceMatch ? sourceMatch.domain.toUpperCase() : 'LIVE WEB SIGNAL',
        impactHorizon: '12 Months',
        sourceTitle: sourceMatch?.title,
        sourceUrl: sourceMatch?.uri
      };
    });

  if (fallbackResults.length === 0 && sources.length > 0) {
    sources.slice(0, 4).forEach((src, idx) => {
      const pillarId = classifyPillarFromText(`${query} ${src.title}`);
      fallbackResults.push({
        id: `grounded-${pillarId}-${idx}-${Date.now()}`,
        headline: src.title,
        summary: `External web report from ${src.domain} covering ${query}.`,
        pillarId,
        thunglishHook: `Boss, ${src.domain} report reveals key developments around "${query}".`,
        keyMetric: src.domain.toUpperCase(),
        impactHorizon: 'Near-Term',
        sourceTitle: src.title,
        sourceUrl: src.uri
      });
    });
  }

  return {
    query,
    briefSynthesis:
      cleanedLines[0] ||
      `Grounded web synthesis for "${query}" across ${sources.length} external sources.`,
    results: fallbackResults,
    sources,
    groundedAt: nowStr,
    groundingMethod: 'Google Search Grounding'
  };
}

function decodeRssText(str: string): string {
  return (str || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function parseGoogleNewsRssToPayload(
  xml: string,
  query: string
): GlobalSearchResponse {
  const nowStr = formatISTTimestamp();
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  const results: GroundedHeadlineResult[] = [];
  const sources: GroundedSourceLink[] = [];
  const seenUrls = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml || '')) !== null && results.length < 4) {
    const block = match[1];
    const titleRaw = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '';
    const linkRaw = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '';
    const pubRaw = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || '';
    const sourceMatch = block.match(
      /<source(?:\s+url=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/source>/i
    );

    const decodedTitle = decodeRssText(titleRaw);
    const link = decodeRssText(linkRaw);
    const outlet = sourceMatch?.[2] ? decodeRssText(sourceMatch[2]) : '';
    const publisherUrl = sourceMatch?.[1] || '';

    if (!decodedTitle || !/^https?:\/\//i.test(link)) continue;

    // Strip trailing " - Outlet Name" commonly appended by Google News RSS
    const cleanHeadline =
      outlet && decodedTitle.endsWith(` - ${outlet}`)
        ? decodedTitle.slice(0, -(outlet.length + 3)).trim()
        : decodedTitle;

    const pillarId = classifyPillarFromText(`${query} ${cleanHeadline}`);
    const outletLabel = outlet || extractDomainFromUrl(publisherUrl || link);
    const domain = extractDomainFromUrl(publisherUrl || link);

    let publishedLabel = 'LIVE WIRE';
    if (pubRaw) {
      const dt = new Date(decodeRssText(pubRaw));
      if (!Number.isNaN(dt.getTime())) {
        publishedLabel = dt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    }

    results.push({
      id: `gnews-${pillarId}-${results.length}-${Date.now()}`,
      headline: cleanHeadline,
      summary: `Live external dispatch via ${outletLabel} (${publishedLabel}) tracking "${query}". Pull into feed for deep pillar analysis.`,
      pillarId,
      thunglishHook: `Boss, ${outletLabel} fresh live report "${cleanHeadline.slice(0, 62)}" directly hits ${NEAT_PILLARS[pillarId].shortName} trajectory!`,
      keyMetric: outletLabel.slice(0, 22).toUpperCase(),
      impactHorizon: publishedLabel,
      sourceTitle: outletLabel,
      sourceUrl: link
    });

    if (!seenUrls.has(link)) {
      seenUrls.add(link);
      sources.push({
        title: `${outletLabel} — ${cleanHeadline.slice(0, 42)}`,
        uri: link,
        domain
      });
    }
  }

  return {
    query,
    briefSynthesis:
      results.length > 0
        ? `Live Google News web index returned ${results.length} verified external reports matching "${query}". Select any headline to pull it into your 5-pillar stage.`
        : `No live external headlines found for "${query}". Try broader technical or macro keywords.`,
    results,
    sources,
    groundedAt: nowStr,
    groundingMethod: 'Google News Live Index'
  };
}

export function buildStoryFromGroundedHeadline(
  item: GroundedHeadlineResult,
  query: string
): {
  story: FutifyStoryItem;
  wireItem: IncomingWireItem;
  pillarData: NeatPillarData;
} {
  const nowIST = formatISTTimestamp();
  const baseData = createCustomTopicPillarData(item.headline, item.pillarId);

  const enrichedPillarData: NeatPillarData = {
    ...baseData,
    updatedAt: `Web Grounded · ${nowIST}`,
    thunglishAnalogy: [item.thunglishHook, item.summary],
    timeline: {
      ...baseData.timeline,
      presentNews: `WEB GROUNDED ("${query}"): ${item.headline} — ${item.summary}`
    }
  };

  const uniqueId = `web-${item.pillarId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const resolvedImg = getUniqueStoryImage(
    item.headline,
    item.pillarId,
    undefined,
    uniqueId
  );

  const conf = HERO_CONFIDENCE_BY_PILLAR[item.pillarId];

  const wireItem: IncomingWireItem = {
    id: uniqueId,
    pillarId: item.pillarId,
    chipLabel: `${baseData.chipLabel} · WEB`,
    timestampIST: nowIST,
    sourceBadge: item.sourceTitle
      ? `WEB GROUNDED · ${item.sourceTitle.slice(0, 24).toUpperCase()}`
      : 'GOOGLE SEARCH GROUNDED',
    headline: item.headline,
    keyMetricBadge: `${item.keyMetric} · ${item.impactHorizon}`,
    pillarSnapshot: enrichedPillarData
  };

  const story: FutifyStoryItem = {
    id: uniqueId,
    pillarId: item.pillarId,
    categoryTag: `${baseData.chipLabel} · WEB`,
    headline: item.headline,
    subHook: item.summary,
    posterImageUrl: resolvedImg.primaryUrl,
    fallbackUnsplashUrl: resolvedImg.fallbackUnsplashUrl,
    timestampBadge: nowIST,
    probabilityBadge: `${conf.confidencePercent}% PROBABILITY`,
    keyMetricBadge: `${item.keyMetric} · ${item.impactHorizon}`,
    isJustIn: true,
    pillarSnapshot: enrichedPillarData,
    trustedArticle: item.sourceUrl
      ? {
          articleUrl: item.sourceUrl,
          trustedOutlet: item.sourceTitle || extractDomainFromUrl(item.sourceUrl),
          publishedAt: nowIST
        }
      : undefined
  };

  return {
    story,
    wireItem,
    pillarData: enrichedPillarData
  };
}
