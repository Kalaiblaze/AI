import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
process.env.DISABLE_HMR = 'true';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  // Pre-warm cache immediately on startup and refresh every 45 seconds
  void refreshAllTrustedFeeds();
  setInterval(() => {
    void refreshAllTrustedFeeds();
  }, 45000);

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

  // Server-Side Gemini 3.8 TTS Endpoint for Crisp Female Thunglish Video Narration
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

      try {
        const ttsRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
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
      } catch {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style:
                      'Poised, warm, crystal-clear South Indian Tamil-English female voice with crisp diction'
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
          fallbackRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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

  // Multi-turn Gemini Mentor Chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, activePillarName, activeHeadline } = req.body as {
        messages: { role: 'user' | 'model'; text: string }[];
        activePillarName?: string;
        activeHeadline?: string;
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Messages array is required.' });
        return;
      }

      const ai = getAiClient();
      const systemInstruction = `You are an elite, street-smart Pattern Recognition Mentor and Global Intelligence Analyst who speaks in natural, engaging Thunglish (Romanized Tamil + English tech mix).
Current active desk context: ${activePillarName || 'Global Intelligence'} — "${activeHeadline || 'Cross-Pillar Pattern Analysis'}".

CRITICAL ANTI-ROBOTIC RULE (NEVER REPEAT THE SAME TEMPLATE):
- You are STRICTLY FORBIDDEN from using the same fixed bullet points (like "Crisp Thunglish Analogy / Past-Present-Future / Elite Mental Model") on every message!
- Read the user's exact intent and respond dynamically like a real, hyper-intelligent human mentor:

1. IF THE USER SAYS "HI" OR CASUAL CHAT:
   - Respond naturally in 1-2 conversational sentences like a sharp mentor welcoming a friend. Do NOT dump random news or bullet points.

2. IF THE USER ASKS A SPECIFIC QUESTION (e.g., "Give me a question to ask in meetings" or "Why did X fail?"):
   - Answer THAT exact question directly and deeply. Give practical variations, real psychological mechanics (how people react in a room), and exact examples. Do NOT force a fake "Past -> Present -> Future" timeline when it doesn't belong.

3. IF THE USER ASKS FOR A DOMAIN DEEP-DIVE OR NEWS (Aerospace, Defence, Geopolitics, Money, Tech/Embedded, Physics):
   - NEVER give generic textbook lines like "rockets use escape velocity."
   - Dive straight into specific, high-signal real-world engineering and market mechanics (e.g., actual chip architectures, V4L2 zero-copy DMA-BUF, supply chain bottlenecks like rare-earth Yttrium/Scandium/Gallium shortages, DARPA/SpaceX/NVIDIA moves, sovereign debt mechanics).
   - Naturally weave in how the past led to today's trigger, where it's heading next, which companies won vs. crashed (and why), and relevant mental models from legendary books—using organic headings or flowing conversation, NEVER a repetitive 3-bullet stamp.

TONE & DEPTH:
- Be sharp, candid, and technically rich. Use everyday Tamil-English analogies only when explaining a genuinely complex mechanism, not as a forced label.`;

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const latestUserMessage = messages[messages.length - 1].text;

      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        history,
        config: {
          systemInstruction
        }
      });

      const response = await chat.sendMessage({
        message: latestUserMessage
      });

      res.json({
        reply:
          response.text ||
          'Boss, signal clear-ah iruku: focus on the first-principles bottleneck and trace the 2nd-order impact!'
      });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : 'Unexpected Gemini API error';
      res.status(500).json({
        error: errMsg
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: null
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXUS server listening on http://localhost:${PORT}`);
  });
}

startServer();
