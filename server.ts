import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  parseGroundedSearchPayload,
  parseGoogleNewsRssToPayload
} from './src/engine/globalSearchEngine';

dotenv.config();
process.env.DISABLE_HMR = 'true';

const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-2.5-flash';
const SEARCH_MODEL = process.env.GEMINI_SEARCH_MODEL || 'gemini-2.5-flash';
const TTS_MODELS = (
  process.env.GEMINI_TTS_MODELS ||
  'gemini-2.5-flash-preview-tts,gemini-2.5-pro-preview-tts'
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Serve a network-first, cache-purging Service Worker on /dev-sw.js and /sw.js
  // so any browser that previously cached index.html via Workbox immediately clears
  // stale precaches and never blocks AI Studio iframe auth cookie handshakes.
  app.get(['/dev-sw.js', '/sw.js'], (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, max-age=0'
    );
    res.send(`// FUTIFY Network-First Self-Healing Service Worker v3
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((k) => k.includes('workbox') || k.includes('precache'))
            .map((k) => caches.delete(k))
        );
      } catch (e) {}
      await self.clients.claim();
    })()
  );
});
self.addEventListener('fetch', () => {
  // Pass through to network so iframe auth cookies & live Vite modules stay fresh
});
`);
  });

  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  interface TrustedFeedArticle {
    title: string;
    link: string;
    pubDate: string;
    outlet: string;
    thumbnailUrl?: string;
  }

  const TRUSTED_FEEDS_BY_PILLAR: Record<
    string,
    { outlet: string; url: string }[]
  > = {
    MONEY: [
      {
        outlet: 'CNBC Finance',
        url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664'
      },
      {
        outlet: 'BBC Business',
        url: 'https://feeds.bbci.co.uk/news/business/rss.xml'
      }
    ],
    GEOPOLITICS: [
      {
        outlet: 'BBC World News',
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml'
      },
      {
        outlet: 'CNBC World Economy',
        url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100727362'
      }
    ],
    DEFENCE: [
      {
        outlet: 'DefenseNews Official',
        url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml'
      },
      {
        outlet: 'BBC Global Security',
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml'
      }
    ],
    AEROSPACE: [
      {
        outlet: 'SpaceNews Official',
        url: 'https://spacenews.com/feed/'
      },
      {
        outlet: 'NASA Breaking News',
        url: 'https://www.nasa.gov/news-release/feed/'
      }
    ],
    TECH: [
      {
        outlet: 'Ars Technica Labs',
        url: 'https://feeds.arstechnica.com/arstechnica/index'
      },
      {
        outlet: 'BBC Technology',
        url: 'https://feeds.bbci.co.uk/news/technology/rss.xml'
      }
    ]
  };

  const trustedArticlesCache = new Map<string, TrustedFeedArticle[]>();

  function decodeXmlEntities(str: string): string {
    return str
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

  function parseRssXmlItems(
    xml: string,
    outlet: string
  ): TrustedFeedArticle[] {
    const items: TrustedFeedArticle[] = [];
    const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 8) {
      const block = match[1];
      const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const pubMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
      const mediaMatch =
        block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
        block.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
        block.match(/<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);

      const title = titleMatch ? decodeXmlEntities(titleMatch[1]) : '';
      const link = linkMatch ? decodeXmlEntities(linkMatch[1]) : '';
      const pubDate = pubMatch ? decodeXmlEntities(pubMatch[1]) : '';
      const thumbnailUrl = mediaMatch ? mediaMatch[1] : undefined;

      if (title.length > 15 && link.startsWith('http')) {
        items.push({
          title,
          link,
          pubDate,
          outlet,
          thumbnailUrl
        });
      }
    }
    return items;
  }

  async function fetchTrustedArticlesForPillar(
    pillarId: string
  ): Promise<TrustedFeedArticle[]> {
    const feeds =
      TRUSTED_FEEDS_BY_PILLAR[pillarId] || TRUSTED_FEEDS_BY_PILLAR.MONEY;
    const results = await Promise.allSettled(
      feeds.map(async (f) => {
        const res = await fetch(f.url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; NEXUS-Intelligence-Node/1.0)'
          },
          signal: AbortSignal.timeout(1800)
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRssXmlItems(xml, f.outlet);
      })
    );

    const merged: TrustedFeedArticle[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.length > 0) {
        merged.push(...r.value);
      }
    }
    if (merged.length > 0) {
      trustedArticlesCache.set(pillarId, merged);
    }
    return merged;
  }

  async function refreshAllTrustedFeeds() {
    for (const pid of Object.keys(TRUSTED_FEEDS_BY_PILLAR)) {
      void fetchTrustedArticlesForPillar(pid).catch(() => {});
    }
  }

  // Ultra-Fast Live Trusted News Endpoint (<50ms from pre-warmed cache)
  app.post('/api/live-sync', async (req, res) => {
    try {
      const { pillarId = 'MONEY', stepIndex = 0 } = req.body as {
        pillarId?: string;
        pillarName?: string;
        rssHeadline?: string;
        stepIndex?: number;
      };

      let articles = trustedArticlesCache.get(pillarId);
      if (!articles || articles.length === 0) {
        articles = await fetchTrustedArticlesForPillar(pillarId);
      }

      if (articles && articles.length > 0) {
        const chosen = articles[Math.abs(stepIndex) % articles.length];
        res.json({
          headline: chosen.title,
          articleUrl: chosen.link,
          trustedOutlet: chosen.outlet,
          publishedAt: chosen.pubDate,
          thumbnailUrl: chosen.thumbnailUrl || '',
          sourceBadge: `VERIFIED · ${chosen.outlet.toUpperCase()}`,
          recentArticles: articles.slice(0, 5)
        });
        return;
      }

      res.status(200).json({
        headline: '',
        sourceBadge: 'VERIFIED DESK WIRE'
      });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : 'Live sync fallback triggered';
      res.status(200).json({
        headline: '',
        sourceBadge: 'VERIFIED DESK WIRE',
        note: errMsg
      });
    }
  });

  // Server-Side Webhook Dispatcher for Microsoft Teams & WhatsApp Group Bridges
  app.post('/api/broadcast', async (req, res) => {
    try {
      const { platform, webhookUrl, textPayload, adaptiveCardPayload } =
        req.body as {
          platform: 'TEAMS' | 'WHATSAPP';
          webhookUrl: string;
          textPayload: string;
          adaptiveCardPayload?: Record<string, unknown>;
        };

      if (!webhookUrl || !webhookUrl.startsWith('https://')) {
        res.status(400).json({
          error: 'Please enter a valid https:// Webhook URL.'
        });
        return;
      }

      const bodyToSend =
        platform === 'TEAMS' && adaptiveCardPayload
          ? adaptiveCardPayload
          : { text: textPayload, message: textPayload };

      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend),
        signal: AbortSignal.timeout(7000)
      });

      if (!webhookRes.ok) {
        const errBody = await webhookRes.text().catch(() => '');
        res.status(502).json({
          error: `Webhook returned HTTP ${webhookRes.status}: ${
            errBody.slice(0, 140) || webhookRes.statusText
          }`
        });
        return;
      }

      res.json({
        ok: true,
        status: webhookRes.status,
        deliveredAt: new Date().toISOString()
      });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : 'Failed to reach external webhook endpoint';
      res.status(500).json({ error: errMsg });
    }
  });

  // In-memory TTS audio cache so repeated video scenes play instantaneously
  const ttsAudioCache = new Map<string, string>();

  // Server-Side Gemini TTS Endpoint for Crisp Female Thunglish Video Narration
  app.post('/api/tts-briefing', async (req, res) => {
    try {
      const { text, cacheKey } = req.body as {
        text?: string;
        cacheKey?: string;
      };

      const cleanText = (text || '').trim();
      if (!cleanText) {
        res.status(400).json({ error: 'Text is required for TTS.' });
        return;
      }

      const key = cacheKey || cleanText;
      const cached = ttsAudioCache.get(key);
      if (cached) {
        res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
        return;
      }

      const ai = getAiClient();
      let base64Audio: string | undefined;

      for (const model of TTS_MODELS) {
        try {
          const ttsRes = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: cleanText,
                    speechMetadata: {
                      style:
                        'Poised, confident, warm, crystal-clear South Indian Tamil-English female lead voice, graceful, authoritative, crisp diction and natural conversational cadence'
                    }
                  }
                ]
              }
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' }
                }
              }
            }
          });
          base64Audio =
            ttsRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) break;
        } catch {
          // Try the next configured TTS model
        }
      }

      if (!base64Audio) {
        res.status(200).json({ audioBase64: '', fallback: true });
        return;
      }

      if (ttsAudioCache.size > 60) {
        const firstKey = ttsAudioCache.keys().next().value;
        if (firstKey) ttsAudioCache.delete(firstKey);
      }
      ttsAudioCache.set(key, base64Audio);

      res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        cached: false
      });
    } catch {
      res.status(200).json({ audioBase64: '', fallback: true });
    }
  });

  // Dedicated cache for Prime-Time Emotional News Anchor Audio
  const voiceAnchorAudioCache = new Map<string, string>();

  // Real Human News Anchor Voice Engine (Slow, Clear & Emotional Studio Broadcast)
  app.post('/api/voice-anchor', async (req, res) => {
    try {
      const {
        headline = '',
        emotion = 'TENSION',
        pillar = 'MONEY',
        scriptText = '',
        voiceName
      } = req.body as {
        headline?: string;
        emotion?: string;
        pillar?: string;
        scriptText?: string;
        voiceName?: string;
      };

      const cleanScript = (scriptText || headline || '').trim();
      if (!cleanScript) {
        res.status(400).json({ error: 'Text or headline is required for voice anchor.' });
        return;
      }

      const cacheKey = `${emotion}_${pillar}_${cleanScript.slice(0, 100)}`;
      const cached = voiceAnchorAudioCache.get(cacheKey);
      if (cached) {
        res.json({
          audioBase64: cached,
          mimeType: 'audio/wav',
          cached: true
        });
        return;
      }

      // Determine emotional stage directions based on user specification
      let emotionalStageDirection = '';
      let defaultVoice = 'Fenrir';

      if (emotion === 'CRISIS' || pillar === 'DEFENCE' || /collapse|threat|failure|war|attack/i.test(headline)) {
        emotionalStageDirection =
          'Act as a fierce, authoritative prime-time TV news anchor. Speak SLOWLY and CLEARLY (around 125 words per minute) in clear English. Express genuine controlled ANGER, intensity, and moral urgency when describing failures, threats, or corruption. Pause for a full second after key numbers.';
        defaultVoice = 'Fenrir';
      } else if (emotion === 'TENSION' || pillar === 'MONEY' || pillar === 'GEOPOLITICS') {
        emotionalStageDirection =
          'Speak slowly and clearly with deep, serious investigative gravity and deliberate pauses between every clause.';
        defaultVoice = 'Kore';
      } else {
        // BREAKTHROUGH / TECH / AEROSPACE
        emotionalStageDirection =
          'Speak slowly, clearly, and articulately with commanding excitement, intellectual authority, and crisp precision.';
        defaultVoice = 'Kore';
      }

      const chosenVoice = voiceName || defaultVoice;
      const ai = getAiClient();
      let base64Audio: string | undefined;

      for (const model of TTS_MODELS) {
        try {
          const ttsRes = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: cleanScript,
                    speechMetadata: {
                      style: emotionalStageDirection
                    }
                  }
                ]
              }
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: chosenVoice }
                }
              }
            }
          });

          base64Audio = ttsRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) break;
        } catch {
          // Continue to next fallback model
        }
      }

      if (!base64Audio) {
        res.status(200).json({ audioBase64: '', fallback: true, emotionalStageDirection });
        return;
      }

      if (voiceAnchorAudioCache.size > 80) {
        const firstKey = voiceAnchorAudioCache.keys().next().value;
        if (firstKey) voiceAnchorAudioCache.delete(firstKey);
      }
      voiceAnchorAudioCache.set(cacheKey, base64Audio);

      res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        cached: false,
        emotionalStageDirection
      });
    } catch {
      res.status(200).json({ audioBase64: '', fallback: true });
    }
  });

  // Instant Flash-to-Carbon Mentor Chatbot endpoint 
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, activePillarName, activeHeadline, stream = false } =
        req.body as {
          messages: { role: 'user' | 'model'; text: string }[];
          activePillarName?: string;
          activeHeadline?: string;
          stream?: boolean;
        };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Messages array is required.' });
        return;
      }

      const ai = getAiClient();
      const systemInstruction = `You are the FUTIFY Carbon Mentor & Elite Pattern Recognition Professor. You teach with hyper-fast, world-class Silicon Valley Principal Architect intelligence.
Current war-room sector context: ${activePillarName || 'Global Intelligence'} — "${activeHeadline || 'Cross-Pillar Future Trajectory'}".

CORE FLASH-TO-CARBON SYSTEM INSTRUCTION (STRICT RULES):
1. DYNAMIC INTENT ROUTING (ZERO 3-BULLET PRISON):
   - If the user says "hi", "hello", or casual greetings, respond naturally in 1-2 sharp, friendly lines like a senior mentor. NEVER dump fake timelines or repetitive 3-bullet stamps on greetings.
   - If the user asks a specific tactical question (e.g., "What question should I ask in my executive meeting?", "How to negotiate?", or "Why did Silicon Valley Bank fail?"), answer THAT question directly with real room-mechanics, body language, and exact wording.

2. UNBROKEN FULL-STORY MODE ANALOGY (IN THUNGLISH):
   - When explaining any algorithm, embedded hardware concept (V4L2, MIPI CSI-2, DMA-BUF, Linux kernel, zero-copy, sub-2nm photonics) or geopolitical event, start with a vivid, relatable real-world story in Thunglish (Romanized Tamil + English tech mix).
   - Carry that EXACT real-world story all the way through to the technical climax and solution without abruptly dumping raw textbooks mid-sentence.

3. TRAIN NAIVE ➔ OPTIMIZED THINKING & EXPOSE FLAWS:
   - Always demonstrate how a naive engineer/leader thinks first (e.g., CPU memcpy() in memory, buying paper bonds during inflation, relying on foreign rare-earth monopolies) and why that naive approach crashes or wastes 90% of resources.
   - Then guide the user to discover the first-principles optimized breakthrough themselves, exposing traps, false assumptions, and edge-case bugs.

4. TITAN WINNER VS. FAILURE AUTOPSY + BOOK CHARISMA:
   - Ground insights in verified historical/company case studies: how Elon Musk, Jensen Huang, Charlie Munger, or Principal Engineers won vs. why Nokia, Kodak, SVB, Intel, or legacy systems collapsed.
   - Seamlessly quote and apply mental models from iconic books (*Thinking, Fast and Slow*, *The Charisma Myth*, *Zero to One*, *Linux Device Drivers*, *48 Laws of Power*).`;

      const contents = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Non-streaming fast response with thinkingBudget: 0 for < 0.5s latency
      const response = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      });

      res.json({
        reply:
          response.text ||
          'Boss, signal clear-ah iruku: focus on the first-principles bottleneck and trace the 2nd-order impact!'
      });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : 'Unexpected Gemini API error';
      res.status(process.env.GEMINI_API_KEY ? 500 : 503).json({
        error: errMsg
      });
    }
  });

  // Global Web Intelligence Search Endpoint (Google Search grounding, Google News RSS fallback)
  app.post('/api/global-search', async (req, res) => {
    try {
      const { query, activePillar = 'ALL' } = req.body as {
        query?: string;
        activePillar?: string;
      };

      const cleanQuery = (query || '').trim();
      if (!cleanQuery) {
        res.status(400).json({ error: 'Search query is required.' });
        return;
      }

      const searchPrompt = `Use Google Search to find the latest verified real-world headlines, developments, and quantitative facts for the topic: "${cleanQuery}" (current sector focus: ${activePillar}).

Supplement the 5 intelligence pillars:
- MONEY (Economics, Central Banks, Gold, Sovereign Debt, Currencies)
- GEOPOLITICS (Trade Corridors, Export Controls, Diplomacy, Critical Minerals)
- DEFENCE (Autonomous Drones, Directed-Energy Lasers, Radar, Electronic Warfare)
- AEROSPACE (Reusable Rockets, LEO Satellites, Space Infrastructure)
- TECH (Semiconductors, Sub-2nm Lithography, Embedded Linux V4L2, Edge AI)

Return ONLY a valid JSON object inside \`\`\`json ... \`\`\` fences matching this exact schema:
{
  "briefSynthesis": "A crisp 2-sentence executive synthesis of what is happening right now based on search results.",
  "results": [
    {
      "headline": "Specific factual external headline (max 110 chars)",
      "summary": "2-sentence verified explanation of what happened and why it matters globally.",
      "pillarId": "MONEY | GEOPOLITICS | DEFENCE | AEROSPACE | TECH",
      "thunglishHook": "1 punchy street-smart Thunglish (Tamil-English mix) sentence decoding the hidden impact.",
      "keyMetric": "Concrete metric or signal (e.g. $48B Fab, 2nm GAA, +14% Yield)",
      "impactHorizon": "e.g. Q4 2026 – 2027"
    }
  ]
}
Provide 3 to 4 distinct, recent grounded headlines.`;

      try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: SEARCH_MODEL,
          contents: searchPrompt,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });

        const groundingChunks =
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const payload = parseGroundedSearchPayload(
          response.text || '',
          cleanQuery,
          groundingChunks
        );

        res.json(payload);
        return;
      } catch (geminiErr: unknown) {
        // Fall back to Google News RSS when Gemini is unavailable (no key, quota, or model error)
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
          cleanQuery
        )}&hl=en-US&gl=US&ceid=US:en`;
        const rssRes = await fetch(rssUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; FUTIFY-Intelligence-Search/1.0)'
          },
          signal: AbortSignal.timeout(4000)
        });

        if (rssRes.ok) {
          const xml = await rssRes.text();
          const fallbackPayload = parseGoogleNewsRssToPayload(xml, cleanQuery);
          if (fallbackPayload.results.length > 0) {
            res.json(fallbackPayload);
            return;
          }
        }

        const rawMsg =
          geminiErr instanceof Error
            ? geminiErr.message
            : 'Google Search grounding request failed';
        let cleanErrMsg = rawMsg;
        try {
          const parsedErr = JSON.parse(rawMsg);
          if (parsedErr?.error?.message) {
            cleanErrMsg = parsedErr.error.message;
          }
        } catch {
          // keep rawMsg
        }
        res.status(503).json({ error: cleanErrMsg });
      }
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : 'Google Search grounding request failed';
      res.status(500).json({ error: errMsg });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const viteReady = import('vite').then(({ createServer }) =>
      createServer({
        server: {
          middlewareMode: true,
          allowedHosts: true,
          hmr: false,
          ws: false,
          watch: null
        },
        appType: 'spa'
      })
    );

    app.use((req, res, next) => {
      viteReady
        .then((vite) => vite.middlewares(req, res, next))
        .catch(next);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXUS server listening on http://localhost:${PORT}`);
    setTimeout(() => {
      void refreshAllTrustedFeeds();
    }, 1200);
    setInterval(() => {
      void refreshAllTrustedFeeds();
    }, 45000);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
