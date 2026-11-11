import { NEAT_PILLARS } from './nexusNeatEngine';

export function buildStandaloneSingleFileHtml(): string {
  const serializedPillars = JSON.stringify(NEAT_PILLARS, null, 2);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEXUS // Global Intelligence & Pattern Briefing</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      background-color: #06070A;
      color: #F1F5F9;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    h1, h2, h3, h4, .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body class="bg-[#06070A] text-slate-100 min-h-screen">
  <header class="border-b border-white/[0.07] bg-[#06070A]/90 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-8 py-4 space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="font-display text-xl font-bold text-white">NEXUS · Global Intelligence Briefing</div>
        <button id="btn-open-modal" type="button" class="px-4 py-2 rounded-lg bg-[#0D1017] border border-white/[0.07] text-xs font-semibold text-cyan-300 cursor-pointer whitespace-nowrap">
          + Paste Custom Topic
        </button>
      </div>
      <nav id="pillar-tabs" class="flex items-center gap-2.5 overflow-x-auto"></nav>
    </div>
  </header>

  <main id="bento-grid-container" class="max-w-7xl mx-auto px-8 py-8 space-y-6"></main>

  <script>
    const PILLARS = ${serializedPillars};
    let activePillar = 'MONEY';

    function renderAll() {
      const nav = document.getElementById('pillar-tabs');
      nav.innerHTML = Object.keys(PILLARS).map(key => {
        const p = PILLARS[key];
        const isSel = key === activePillar;
        return '<button data-pillar="' + key + '" class="pillar-btn px-4 py-2.5 rounded-xl text-sm font-semibold border whitespace-nowrap cursor-pointer ' +
          (isSel ? 'bg-[#0D1017] text-white border-cyan-400/50' : 'bg-[#0D1017]/60 text-slate-400 border-white/[0.07] hover:text-white') + '">' +
          p.tabLabel + '</button>';
      }).join('');
      nav.querySelectorAll('.pillar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activePillar = btn.getAttribute('data-pillar');
          renderAll();
        });
      });

      const p = PILLARS[activePillar];
      document.getElementById('bento-grid-container').innerHTML =
        '<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">' +
          '<section class="lg:col-span-8 rounded-2xl bg-[#0D1017] border border-white/[0.07] p-8 space-y-6">' +
            '<div class="text-xs font-mono text-cyan-300">' + p.chipLabel + ' · ' + p.updatedAt + '</div>' +
            '<h1 class="font-display text-3xl font-bold text-white leading-tight">' + p.headline + '</h1>' +
            '<div class="rounded-xl bg-[#06070A] border border-white/[0.07] border-l-4 border-l-cyan-400 p-6 space-y-2">' +
              '<div class="font-display text-sm font-bold text-cyan-300">⚡ Street-Smart Decode</div>' +
              '<p class="text-base text-white">' + p.thunglishAnalogy[0] + '</p>' +
              '<p class="text-sm text-slate-300">' + p.thunglishAnalogy[1] + '</p>' +
            '</div>' +
          '</section>' +
          '<section class="lg:col-span-4 rounded-2xl bg-[#0D1017] border border-white/[0.07] p-7 space-y-4">' +
            '<h2 class="font-display text-base font-bold text-white">Key Telemetry &amp; Numbers</h2>' +
            p.telemetry.map(s =>
              '<div class="rounded-xl bg-[#06070A] border border-white/[0.07] p-4">' +
                '<div class="font-display text-2xl font-bold text-cyan-300">' + s.value + '</div>' +
                '<div class="text-xs font-mono text-slate-300">' + s.label + '</div>' +
                '<div class="text-xs text-slate-400 mt-1">' + s.subtext + '</div>' +
              '</div>'
            ).join('') +
          '</section>' +
        '</div>';
    }
    renderAll();
  </script>
</body>
</html>`;
}
