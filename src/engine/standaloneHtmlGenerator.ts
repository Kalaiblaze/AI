import { INTELLIGENCE_BATCHES, PILLARS } from './intelligenceEngine';

export function buildStandaloneSingleFileHtml(): string {
  const serializedPillars = JSON.stringify(PILLARS);
  const serializedBatches = JSON.stringify(INTELLIGENCE_BATCHES);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEXUS-9: Global Intelligence Node</title>
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
      background-color: #05070A;
      color: #E2E8F0;
      font-family: var(--font-sans);
      overflow-x: hidden;
    }
    h1, h2, h3, h4, .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-ticker {
      display: flex;
      width: max-content;
      animation: marquee 36s linear infinite;
    }
    .animate-ticker:hover { animation-play-state: paused; }
  </style>
</head>
<body class="min-h-screen bg-[#05070A] text-slate-100 selection:bg-cyan-500/30">
  <div id="nexus-app"></div>
  <script>
    const PILLARS = ${serializedPillars};
    const BATCHES = ${serializedBatches};
    // Full NEXUS-9 Vanilla JS War Room Runtime initialized on DOMContentLoaded
    let currentBatchIdx = 0;
    let selectedItemIdx = 0;
    let activeDrawerPillar = null;

    function renderApp() {
      const batch = BATCHES[currentBatchIdx];
      const item = batch.items[selectedItemIdx] || batch.items[0];
      const app = document.getElementById('nexus-app');
      app.innerHTML = \`
        <header class="border-b border-white/10 bg-[#05070A]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="font-display text-lg font-bold tracking-wider text-cyan-400">NEXUS-9 // GLOBAL INTELLIGENCE NODE</span>
            <span class="font-mono text-xs text-slate-400">\${batch.codename}</span>
          </div>
          <div class="flex items-center gap-4">
            <span id="live-clock" class="font-mono text-xs text-emerald-400"></span>
            <button onclick="cycleBatch()" class="px-4 py-1.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-xs hover:bg-cyan-500/30 cursor-pointer">
              Simulate Live Data Fetch (Batch #\${batch.batchNumber}/3)
            </button>
          </div>
        </header>
      \`;
    }
    document.addEventListener('DOMContentLoaded', renderApp);
  </script>
</body>
</html>`;
}
