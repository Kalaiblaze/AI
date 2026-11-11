import { CARBON_PILLARS, INITIAL_CARBON_DATASET } from './carbonPulseEngine';

export function buildStandaloneSingleFileHtml(): string {
  const pillarsJson = JSON.stringify(CARBON_PILLARS, null, 2);
  const datasetJson = JSON.stringify(INITIAL_CARBON_DATASET, null, 2);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CARBON-PULSE // Global & Embedded Intelligence Terminal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --font-display: 'Space Grotesk', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-sans: 'Plus Jakarta Sans', sans-serif;
    }
    body {
      background-color: #06080D;
      background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
      background-size: 20px 20px;
      color: #E2E8F0;
      font-family: var(--font-sans);
    }
    h1, h2, h3, h4, .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
    .hud-panel {
      background: rgba(11, 15, 24, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  </style>
</head>
<body class="lg:h-screen lg:overflow-hidden flex flex-col bg-[#06080D] text-slate-100">
  <!-- TOP HUD BAR -->
  <header class="px-5 py-3 border-b border-white/10 bg-[#06080D]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0">
    <div class="flex items-center gap-3">
      <span class="font-display text-base md:text-lg font-bold tracking-tight text-white">CARBON-PULSE // Global & Embedded Intelligence Terminal</span>
      <span id="feed-status-badge" class="font-mono text-xs text-emerald-400">ONLINE // 6 CORE NODES</span>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <span id="dual-clock" class="font-mono text-xs text-cyan-300 tabular-nums"></span>
      <button id="btn-fetch-rss" type="button" class="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-semibold cursor-pointer">
        Fetch Live Global RSS News
      </button>
      <button id="btn-open-drawer" type="button" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 font-mono text-xs font-semibold cursor-pointer">
        + Inject Custom Topic/News
      </button>
    </div>
  </header>

  <!-- MAIN SPLIT-SCREEN COMMAND HUD (35% Left / 65% Right) -->
  <main class="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
    <aside class="w-full lg:w-[35%] border-r border-white/10 flex flex-col lg:h-full lg:overflow-hidden p-4 gap-3">
      <div id="pillar-filter-bar" class="flex flex-wrap gap-1.5 shrink-0"></div>
      <div id="feed-list-container" class="flex-1 overflow-y-auto space-y-2.5 pr-1"></div>
    </aside>
    <section id="jit-inspector-stage" class="w-full lg:w-[65%] lg:h-full overflow-y-auto p-5 space-y-4"></section>
  </main>

  <!-- SLIDE-OUT DRAWER FOR CUSTOM TOPIC / GEMINI HOOK -->
  <div id="inject-drawer" class="hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
    <div class="w-full max-w-lg bg-[#070A10] border-l border-white/15 h-full p-6 flex flex-col justify-between">
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 class="font-display text-lg font-bold text-white">+ Inject Custom Topic / Breaking News</h2>
          <button id="btn-close-drawer" class="text-slate-400 hover:text-white font-mono text-xs cursor-pointer">[ESC / CLOSE]</button>
        </div>
        <textarea id="raw-topic-input" rows="5" placeholder="Paste breaking news or embedded systems topic..." class="w-full rounded-lg bg-[#05070B] border border-white/15 p-3 text-sm text-white"></textarea>
        <button id="btn-submit-topic" class="w-full py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold cursor-pointer">Synthesize 5-Pillar Briefing & Save to localStorage</button>
      </div>
    </div>
  </div>

  <script>
    const CARBON_PILLARS = ${pillarsJson};
    const INITIAL_DATASET = ${datasetJson};
    const STORAGE_KEY = 'carbon_pulse_custom_items_v1';

    let customItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let allItems = [...customItems, ...INITIAL_DATASET];
    let activePillarFilter = 'ALL';
    let selectedId = allItems[0].id;

    function updateClock() {
      const now = new Date();
      const utc = now.toISOString().slice(11, 19) + ' UTC';
      const istTime = new Date(now.getTime() + (5.5 * 3600 * 1000)).toISOString().slice(11, 19) + ' IST';
      document.getElementById('dual-clock').textContent = utc + ' // ' + istTime;
    }
    setInterval(updateClock, 1000);
    updateClock();

    function renderFilters() {
      const bar = document.getElementById('pillar-filter-bar');
      const keys = ['ALL', ...Object.keys(CARBON_PILLARS)];
      bar.innerHTML = keys.map(k => {
        const label = k === 'ALL' ? 'ALL PILLARS (' + allItems.length + ')' : CARBON_PILLARS[k].label;
        const active = activePillarFilter === k;
        return '<button data-pillar="' + k + '" class="pillar-btn px-2.5 py-1 rounded text-xs font-mono border cursor-pointer ' +
          (active ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white') + '">' + label + '</button>';
      }).join('');
      bar.querySelectorAll('.pillar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activePillarFilter = btn.getAttribute('data-pillar');
          renderFilters();
          renderFeedList();
        });
      });
    }

    function renderFeedList() {
      const container = document.getElementById('feed-list-container');
      const filtered = activePillarFilter === 'ALL' ? allItems : allItems.filter(i => i.pillar === activePillarFilter);
      container.innerHTML = filtered.map(item => {
        const p = CARBON_PILLARS[item.pillar];
        const isSel = item.id === selectedId;
        return '<div data-id="' + item.id + '" class="feed-card hud-panel p-3.5 rounded-xl cursor-pointer transition-all ' +
          (isSel ? 'border-cyan-400 bg-white/10' : 'hover:border-white/25') + '">' +
          '<div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">' +
          '<span class="font-bold" style="color:' + p.accentHex + '">' + p.label + '</span>' +
          '<span>' + item.code + '</span></div>' +
          '<h3 class="font-display text-sm font-bold text-white leading-snug">' + item.headline + '</h3>' +
          '<div class="mt-2 text-[11px] font-mono text-slate-400 flex justify-between"><span>' + item.source_tag + '</span><span>' + item.connected_dots.length + ' Dots Linked</span></div>' +
          '</div>';
      }).join('');
      container.querySelectorAll('.feed-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedId = card.getAttribute('data-id');
          renderFeedList();
          renderInspector();
        });
      });
    }

    function renderInspector() {
      const stage = document.getElementById('jit-inspector-stage');
      const item = allItems.find(i => i.id === selectedId) || allItems[0];
      const p = CARBON_PILLARS[item.pillar];
      stage.innerHTML = '<div class="hud-panel rounded-xl p-5 space-y-4">' +
        '<div class="flex items-center justify-between border-b border-white/10 pb-3">' +
        '<span class="font-mono text-xs font-bold" style="color:' + p.accentHex + '">' + p.label + ' · ' + item.code + '</span>' +
        '<span class="font-mono text-xs text-slate-400">' + item.timestamp + '</span></div>' +
        '<h1 class="font-display text-xl md:text-2xl font-bold text-white">' + item.headline + '</h1>' +
        '<div class="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/30"><div class="font-mono text-xs text-cyan-400 mb-1">THUNGLISH STREET-SMART ANALOGY</div><p class="text-sm text-slate-100 leading-relaxed">' + item.thunglish_analogy + '</p></div>' +
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
        '<div class="p-3.5 rounded-lg bg-black/40 border border-amber-500/30"><div class="font-mono text-xs text-amber-400 mb-1">[⏪ PAST: ROOT CAUSE]</div><p class="text-xs text-slate-200 leading-relaxed">' + item.past_root_cause + '</p></div>' +
        '<div class="p-3.5 rounded-lg bg-black/40 border border-cyan-500/40"><div class="font-mono text-xs text-cyan-300 mb-1">[⏺️ PRESENT: REALITY]</div><p class="text-xs text-white leading-relaxed">' + item.present_reality + '</p></div>' +
        '<div class="p-3.5 rounded-lg bg-black/40 border border-emerald-500/40"><div class="font-mono text-xs text-emerald-400 mb-1">[⏩ FUTURE: PROJECTION]</div><p class="text-xs text-slate-200 leading-relaxed">' + item.future_projection + '</p></div>' +
        '</div>' +
        '<div class="p-4 rounded-lg bg-black/50 border border-white/10 space-y-2"><div class="font-mono text-xs text-purple-300">TITAN VS. FAILURE CASE STUDY // ' + item.titan_vs_failure.titan_name + '</div>' +
        '<p class="text-xs text-emerald-300"><strong>Titan Win:</strong> ' + item.titan_vs_failure.titan_victory + '</p>' +
        '<p class="text-xs text-rose-300"><strong>Failure (' + item.titan_vs_failure.failure_entity + '):</strong> ' + item.titan_vs_failure.failure_autopsy + '</p>' +
        '<p class="text-xs text-slate-300"><strong>Root Lesson:</strong> ' + item.titan_vs_failure.engineering_root_lesson + '</p></div>' +
        '<div class="p-4 rounded-lg bg-amber-500/10 border border-amber-400/40 space-y-1"><div class="font-mono text-xs text-amber-300">CHARISMA & MENTAL MODEL DOJO // ' + item.charisma_dojo.book_citation + '</div>' +
        '<div class="font-display text-sm font-bold text-white">' + item.charisma_dojo.mental_model + '</div>' +
        '<p class="text-xs text-slate-200">' + item.charisma_dojo.communication_rule + '</p>' +
        '<p class="text-xs text-amber-200 font-medium">Action: ' + item.charisma_dojo.tactical_execution + '</p></div>' +
        '</div>';
    }

    async function fetchLiveNews() {
      const badge = document.getElementById('feed-status-badge');
      badge.textContent = 'FETCHING LIVE RSS STREAM...';
      try {
        const rssUrl = encodeURIComponent('https://hnrss.org/frontpage');
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + rssUrl);
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const top = data.items[0];
          const newItem = {
            ...INITIAL_DATASET[0],
            id: 'CP-RSS-' + Date.now(),
            code: 'LIVE-RSS-NODE',
            headline: top.title,
            source_tag: 'LIVE RSS // HNRSS'
          };
          allItems = [newItem, ...allItems];
          selectedId = newItem.id;
          renderFilters();
          renderFeedList();
          renderInspector();
          badge.textContent = 'LIVE RSS UPDATED // ' + allItems.length + ' NODES';
        }
      } catch (e) {
        badge.textContent = 'RSS FALLBACK ACTIVE // ' + allItems.length + ' NODES';
      }
    }

    document.getElementById('btn-fetch-rss').addEventListener('click', fetchLiveNews);
    document.getElementById('btn-open-drawer').addEventListener('click', () => {
      document.getElementById('inject-drawer').classList.remove('hidden');
    });
    document.getElementById('btn-close-drawer').addEventListener('click', () => {
      document.getElementById('inject-drawer').classList.add('hidden');
    });

    renderFilters();
    renderFeedList();
    renderInspector();
  </script>
</body>
</html>`;
}
