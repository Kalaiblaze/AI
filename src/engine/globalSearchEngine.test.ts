import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyPillarFromText,
  dedupeGroundingSources,
  parseGroundedSearchPayload,
  parseGoogleNewsRssToPayload,
  buildStoryFromGroundedHeadline
} from './globalSearchEngine';

test('classifyPillarFromText routes keywords to accurate intelligence pillars', () => {
  assert.equal(
    classifyPillarFromText('TSMC 2nm GAA silicon wafer yield improves'),
    'TECH'
  );
  assert.equal(
    classifyPillarFromText('Central bank physical gold reserves and Treasury yield shock'),
    'MONEY'
  );
  assert.equal(
    classifyPillarFromText('SpaceX Starship orbital booster catch and LEO satellite link'),
    'AEROSPACE'
  );
  assert.equal(
    classifyPillarFromText('Directed energy laser missile defense counter drone radar'),
    'DEFENCE'
  );
  assert.equal(
    classifyPillarFromText('ASML EUV export control and IMEC trade corridor tariffs'),
    'GEOPOLITICS'
  );
});

test('dedupeGroundingSources removes duplicates and invalid URLs cleanly', () => {
  const chunks = [
    { web: { uri: 'https://www.reuters.com/tech/chips', title: 'Reuters Chips' } },
    { web: { uri: 'https://www.reuters.com/tech/chips', title: 'Duplicate Reuters' } },
    { web: { uri: 'not-a-valid-url', title: 'Bad Link' } },
    { web: { uri: 'https://spectrum.ieee.org/2nm', title: 'IEEE Spectrum' } }
  ];

  const sources = dedupeGroundingSources(chunks);
  assert.equal(sources.length, 2);
  assert.equal(sources[0].domain, 'reuters.com');
  assert.equal(sources[1].domain, 'spectrum.ieee.org');
});

test('parseGroundedSearchPayload parses fenced JSON and binds grounding sources', () => {
  const raw = `\`\`\`json
  {
    "briefSynthesis": "2nm GAA production is accelerating with higher yields.",
    "results": [
      {
        "headline": "TSMC reaches 70% trial yield on 2nm GAA nanosheet wafers",
        "summary": "Pilot production stays on track for flagship AI accelerators.",
        "pillarId": "TECH",
        "thunglishHook": "Boss, 2nm gate-all-around yield jump panna udane next-gen AI chips heat kuraiyum.",
        "keyMetric": "70% 2nm Yield",
        "impactHorizon": "Q4 2026"
      }
    ]
  }
  \`\`\``;

  const chunks = [
    { web: { uri: 'https://www.reuters.com/technology/tsmc-2nm', title: 'Reuters Tech' } }
  ];

  const parsed = parseGroundedSearchPayload(raw, 'TSMC 2nm yield', chunks);
  assert.equal(parsed.results.length, 1);
  assert.equal(parsed.results[0].pillarId, 'TECH');
  assert.equal(parsed.results[0].sourceUrl, 'https://www.reuters.com/technology/tsmc-2nm');
  assert.equal(parsed.sources.length, 1);
  assert.equal(parsed.briefSynthesis, '2nm GAA production is accelerating with higher yields.');
});

test('parseGroundedSearchPayload falls back cleanly on plain markdown bullet responses', () => {
  const raw = `- India RBI adds 12 tonnes of physical gold bullion reserves in Q3 2026.\n- Global sovereign bond yields climb on debt refinancing pressure.`;
  const chunks = [
    { web: { uri: 'https://www.bis.org/gold', title: 'BIS Report' } }
  ];

  const parsed = parseGroundedSearchPayload(raw, 'RBI gold reserves', chunks);
  assert.equal(parsed.results.length, 2);
  assert.equal(parsed.results[0].pillarId, 'MONEY');
  assert.equal(parsed.sources[0].domain, 'bis.org');
});

test('buildStoryFromGroundedHeadline produces valid FutifyStoryItem and NeatPillarData', () => {
  const { story, wireItem, pillarData } = buildStoryFromGroundedHeadline(
    {
      id: 'g-1',
      headline: 'Starship V3 completes orbital cryo propellant transfer demo',
      summary: 'Enables heavy lunar and deep-space cargo cadence.',
      pillarId: 'AEROSPACE',
      thunglishHook: 'Boss, space-la petrol bunk maadhiri cryo fuel refill pannitaanga!',
      keyMetric: '100T Payload',
      impactHorizon: '2027',
      sourceTitle: 'SpaceNews',
      sourceUrl: 'https://spacenews.com/starship-demo'
    },
    'Starship cryo transfer'
  );

  assert.equal(story.pillarId, 'AEROSPACE');
  assert.equal(story.trustedArticle?.articleUrl, 'https://spacenews.com/starship-demo');
  assert.equal(wireItem.pillarId, 'AEROSPACE');
  assert.equal(pillarData.headline, story.headline);
  assert.equal(pillarData.thunglishAnalogy[0], 'Boss, space-la petrol bunk maadhiri cryo fuel refill pannitaanga!');
});

test('parseGoogleNewsRssToPayload extracts real external items, pillars, and source links', () => {
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <item>
      <title>TSMC 2nm GAA wafer yields pass 70% milestone - IEEE Spectrum</title>
      <link>https://news.google.com/rss/articles/test123</link>
      <pubDate>Thu, 02 Jul 2026 21:06:13 GMT</pubDate>
      <source url="https://spectrum.ieee.org">IEEE Spectrum</source>
    </item>
    <item>
      <title>Central banks accelerate physical gold purchases amid bond volatility - Reuters</title>
      <link>https://news.google.com/rss/articles/test456</link>
      <pubDate>Thu, 02 Jul 2026 18:00:00 GMT</pubDate>
      <source url="https://www.reuters.com">Reuters</source>
    </item>
  </channel></rss>`;

  const payload = parseGoogleNewsRssToPayload(sampleXml, 'TSMC 2nm yield');
  assert.equal(payload.groundingMethod, 'Google News Live Index');
  assert.equal(payload.results.length, 2);
  assert.equal(payload.results[0].headline, 'TSMC 2nm GAA wafer yields pass 70% milestone');
  assert.equal(payload.results[0].pillarId, 'TECH');
  assert.equal(payload.results[0].sourceTitle, 'IEEE Spectrum');
  assert.equal(payload.sources.length, 2);
  assert.equal(payload.sources[0].domain, 'spectrum.ieee.org');
});
