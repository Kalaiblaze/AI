import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Plus,
  Check,
  X,
  Loader2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { NeatPillarId, NEAT_PILLARS } from '../engine/nexusNeatEngine';
import {
  GlobalSearchResponse,
  GroundedHeadlineResult,
  TRENDING_SEARCH_TOPICS
} from '../engine/globalSearchEngine';

interface GlobalSearchBarProps {
  activePillar: NeatPillarId;
  onPullGroundedHeadline: (item: GroundedHeadlineResult, query: string) => void;
}

const PILLAR_BADGE_COLORS: Record<NeatPillarId, string> = {
  MONEY: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
  GEOPOLITICS: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40',
  DEFENCE: 'bg-rose-500/15 text-rose-300 border-rose-400/40',
  AEROSPACE: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/40',
  TECH: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40'
};

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  activePillar,
  onPullGroundedHeadline
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [validationHint, setValidationHint] = useState<string>('');
  const [searchResult, setSearchResult] = useState<GlobalSearchResponse | null>(
    null
  );
  const [pulledIds, setPulledIds] = useState<Set<string>>(() => new Set());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      abortRef.current?.abort();
    };
  }, []);

  const executeGroundedSearch = async (rawQuery: string) => {
    const cleanQuery = rawQuery.trim();
    if (!cleanQuery) {
      setValidationHint('Enter a topic or headline to search the live web.');
      setIsOpen(true);
      return;
    }

    setValidationHint('');
    setErrorMsg('');
    setIsOpen(true);
    setIsSearching(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/global-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleanQuery,
          activePillar
        }),
        signal: controller.signal
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Search failed (HTTP ${res.status})`);
      }

      setSearchResult(data as GlobalSearchResponse);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach Google Search grounding service.';
      setErrorMsg(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void executeGroundedSearch(query);
  };

  const handleSelectTrending = (topicQuery: string) => {
    setQuery(topicQuery);
    void executeGroundedSearch(topicQuery);
  };

  const handlePullItem = (item: GroundedHeadlineResult) => {
    onPullGroundedHeadline(item, searchResult?.query || query);
    setPulledIds((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
  };

  return (
    <div ref={containerRef} className="relative w-full lg:w-[500px] xl:w-[560px] shrink-0">
      <form
        role="search"
        aria-label="Global web intelligence search"
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 rounded-xl bg-white/[0.06] border border-white/15 focus-within:border-cyan-400/70 focus-within:bg-black/80 px-3 py-1.5 transition-all"
      >
        <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (validationHint) setValidationHint('');
          }}
          placeholder="Search global headlines & trends (e.g. TSMC 2nm, Gold)..."
          aria-label="Search live web intelligence"
          data-testid="global-search-input"
          className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            aria-label="Clear search query"
            onClick={() => {
              setQuery('');
              setValidationHint('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          disabled={isSearching}
          data-testid="global-search-submit"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-[11px] font-bold cursor-pointer disabled:opacity-60 shrink-0 transition-colors"
        >
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          <span>{isSearching ? 'Searching' : 'Search Web'}</span>
        </button>
      </form>

      {/* Grounded Results & Trending Popover Panel */}
      {isOpen && (
        <div
          role="region"
          aria-label="Google Search Grounding Results"
          data-testid="global-search-panel"
          className="absolute left-0 right-0 sm:min-w-[560px] mt-2 rounded-2xl bg-[#090C15]/95 backdrop-blur-2xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50 overflow-hidden max-h-[75vh] flex flex-col"
        >
          {/* Panel Header */}
          <div className="px-4 py-2.5 border-b border-white/10 bg-black/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                {searchResult?.groundingMethod || 'Google Search Grounding'}
              </span>
              {searchResult && !isSearching && (
                <span className="text-slate-400 hidden sm:inline">
                  · {searchResult.results.length} headlines · Grounded{' '}
                  {searchResult.groundedAt}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label="Close search results"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4">
            {/* Validation Hint */}
            {validationHint && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200 font-mono">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{validationHint}</span>
              </div>
            )}

            {/* Quick Trending External Queries */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                <TrendingUp className="w-3 h-3 text-rose-400" />
                <span>Trending Global Signals</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_SEARCH_TOPICS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => handleSelectTrending(t.query)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 font-mono text-[11px] text-slate-200 hover:text-cyan-200 cursor-pointer transition-colors"
                  >
                    <span>{t.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div
                data-testid="global-search-loading"
                className="p-5 rounded-xl bg-white/[0.03] border border-cyan-400/20 flex items-center gap-3 text-xs font-mono text-cyan-200"
              >
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                <span>
                  Querying live Google Search index &amp; mapping signals to the
                  5 pillars...
                </span>
              </div>
            )}

            {/* Error State */}
            {errorMsg && !isSearching && (
              <div
                data-testid="global-search-error"
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-400/40 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-200"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void executeGroundedSearch(query)}
                  className="px-3 py-1 rounded-lg bg-rose-500/25 hover:bg-rose-500/35 border border-rose-400/50 font-mono text-[11px] font-bold text-white cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Grounded Results List */}
            {searchResult && !isSearching && !errorMsg && (
              <div className="space-y-4">
                {searchResult.briefSynthesis && (
                  <div className="p-3.5 rounded-xl bg-cyan-500/[0.07] border border-cyan-400/25 space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-bold">
                      Live Grounded Synthesis · “{searchResult.query}”
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                      {searchResult.briefSynthesis}
                    </p>
                  </div>
                )}

                {searchResult.results.length > 0 ? (
                  <div className="space-y-2.5">
                    {searchResult.results.map((item) => {
                      const isPulled = pulledIds.has(item.id);
                      const pillarInfo = NEAT_PILLARS[item.pillarId];
                      return (
                        <article
                          key={item.id}
                          data-testid="grounded-result-card"
                          className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 space-y-2 transition-colors"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold ${
                                  PILLAR_BADGE_COLORS[item.pillarId]
                                }`}
                              >
                                {pillarInfo?.shortName || item.pillarId}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 font-mono text-[10px] text-slate-300">
                                {item.keyMetric}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {item.impactHorizon}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handlePullItem(item)}
                              data-testid="pull-grounded-headline-btn"
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                                isPulled
                                  ? 'bg-emerald-500/25 border border-emerald-400/60 text-emerald-200'
                                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_-3px_rgba(244,63,94,0.5)]'
                              }`}
                            >
                              {isPulled ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Pulled to Feed</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Pull to Feed</span>
                                </>
                              )}
                            </button>
                          </div>

                          <h3 className="font-display text-sm font-bold text-white leading-snug">
                            {item.headline}
                          </h3>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.summary}
                          </p>

                          <p className="text-[11px] font-mono text-cyan-200/90 bg-black/40 border-l-2 border-cyan-400/60 pl-2.5 py-1 rounded-r">
                            {item.thunglishHook}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs font-mono text-slate-400">
                    No structured headlines returned for this query. Try another
                    keyword or select a trending signal above.
                  </p>
                )}

                {/* Grounding Citations */}
                {searchResult.sources.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                      Verified Google Search Sources ({searchResult.sources.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.sources.map((src) => (
                        <a
                          key={src.uri}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 font-mono text-[11px] text-emerald-200 transition-colors"
                        >
                          <span className="truncate max-w-[200px]">
                            {src.title}
                          </span>
                          <span className="text-emerald-400/75 text-[10px]">
                            ({src.domain})
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
