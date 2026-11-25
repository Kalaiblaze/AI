# FUTIFY // Global Intelligence Terminal

A React + Express PWA that tracks five intelligence pillars (Money, Geopolitics, Defence, Aerospace, Embedded & Tech) using live RSS feeds, with optional Gemini-powered mentor chat, grounded web search, and Thunglish voice narration.

## Requirements

- Node.js 20+ (npm) or Bun

## Setup

```bash
npm install          # or: bun install
cp .env.example .env # then set GEMINI_API_KEY (optional, see below)
```

## Scripts

| Command         | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `npm run dev`   | Express + Vite dev server on http://localhost:3000             |
| `npm run build` | Production build into `dist/`                                  |
| `npm start`     | Serve the production build from `dist/` (run `build` first) |
| `npm run lint`  | Type-check with `tsc --noEmit`                                 |
| `npm test`      | Run the engine unit tests (`node:test` via `tsx`)              |

## Gemini API key

`GEMINI_API_KEY` enables the AI Mentor chat, Gemini TTS voices, and Google Search-grounded results. Without it the app still works: news comes from RSS, global search falls back to Google News RSS, and voice uses the browser's speech synthesis. You can override model names with `GEMINI_CHAT_MODEL`, `GEMINI_SEARCH_MODEL`, and `GEMINI_TTS_MODELS` (comma-separated fallback list).

## API

| Endpoint                 | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| `GET /api/health`        | Health check                             |
| `POST /api/live-sync`    | Latest trusted RSS article for a pillar  |
| `POST /api/global-search`| Grounded search (RSS fallback)           |
| `POST /api/chat`         | AI Mentor chat (needs key)               |
| `POST /api/tts-briefing` | Gemini TTS narration (needs key)         |
| `POST /api/voice-anchor` | Emotional news-anchor TTS (needs key)    |
| `POST /api/broadcast`    | Send a briefing to a Teams/WhatsApp webhook |
