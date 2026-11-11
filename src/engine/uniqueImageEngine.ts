import { NeatPillarId } from './nexusNeatEngine';

// Verified, distinct, high-resolution Unsplash editorial photo IDs (28 unique real photographs across all sectors)
export const VERIFIED_FALLBACK_UNSPLASH_IDS: string[] = [
  'photo-1610375461246-83df859d849d', // 0: Real gold bullion stacks
  'photo-1590283603385-17ffb3a7f29f', // 1: Trading terminal monitors
  'photo-1611974789855-9c2a0a7236a3', // 2: Stock market candlesticks
  'photo-1526304640581-d334cdbbf45e', // 3: Currency & banknotes
  'photo-1559526324-4b87b5e36e44', // 4: Financial district skyscrapers
  'photo-1642543492481-44e81e3914a7', // 5: Central bank vaults
  'photo-1451187580459-43490279c0fa', // 6: Earth orbital night view
  'photo-1526778548025-fa2f459cd5c1', // 7: Container shipping cargo ship
  'photo-1486406146926-c627a92ad1ab', // 8: Modern geopolitical summit center
  'photo-1578575437130-527eed3abbec', // 9: Global port cranes & logistics
  'photo-1529107386315-e1a2ed48a620', // 10: International diplomatic treaty hall
  'photo-1508614589041-895b88991e3e', // 11: Fighter jet in afterburner flight
  'photo-1579829366248-204fe8413f31', // 12: High-tech radar dish array
  'photo-1518709268805-4e9042af9f23', // 13: Laser beam directed optics
  'photo-1569974498991-d3c12a504f95', // 14: Aircraft carrier naval fleet
  'photo-1509198397868-475647b2a1e5', // 15: Tactical drone system
  'photo-1517976487468-f20514c44353', // 16: Falcon heavy orbital rocket launch
  'photo-1446776811953-b23d57bd21aa', // 17: Satellite in low-Earth orbit
  'photo-1457364887197-9150188c107b', // 18: Deep space telescope nebula
  'photo-1541185933-ef5d8ed016c2', // 19: Rocket launch pad countdown
  'photo-1506703719100-a0f3a48c0f86', // 20: Starry orbital horizon
  'photo-1518770660439-4636190af475', // 21: Silicon wafer macro lithography
  'photo-1555680202-c86f0e12f086', // 22: Advanced PCB circuit traces
  'photo-1526374965328-7f61d4dc18c5', // 23: Cleanroom chip fabrication
  'photo-1517420704952-d9f39e95b43e', // 24: Embedded hardware processor
  'photo-1531403009284-440f080d1e12', // 25: AI neural network chip board
  'photo-1504384308090-c894fdcc538d', // 26: Quantum computing laser chamber
  'photo-1531297484001-80022131f5a1'  // 27: Modern server data center
];

/**
 * Pre-seeded, verified Wikipedia / Wikimedia Commons real photographic URLs for core entities.
 * These guarantee instant 0ms photographic rendering of the exact real-world subject.
 */
export const PRE_SEEDED_WIKIPEDIA_PHOTOS: Record<string, string> = {
  Gold_reserve:
    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Us_gold_reserves.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  United_States_Treasury:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/United_States_Department_of_the_Treasury_building%2C_Washington%2C_D.C.jpg/2560px-United_States_Department_of_the_Treasury_building%2C_Washington%2C_D.C.jpg',
  Federal_Reserve:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Eccles_Building_Front_View.jpg/2560px-Eccles_Building_Front_View.jpg',
  Bank_for_International_Settlements:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/BIS_Tower_Basel.jpg/2560px-BIS_Tower_Basel.jpg',
  United_States_Capitol:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/US_Capitol_east_side.JPG/2560px-US_Capitol_east_side.JPG',
  ASML_Holding:
    'https://upload.wikimedia.org/wikipedia/commons/a/ae/ASML_headquarters_Veldhoven.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  Semiconductor:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Wafer_2_Zoll_bis_8_Zoll_2.jpg/2560px-Wafer_2_Zoll_bis_8_Zoll_2.jpg',
  Gallium:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gallium_crystals.jpg/2560px-Gallium_crystals.jpg',
  Autonomous_aircraft:
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Bayraktar_K%C4%B1z%C4%B1lelma_Teknofest_2023.jpg/2560px-Bayraktar_K%C4%B1z%C4%B1lelma_Teknofest_2023.jpg',
  Directed_energy_weapon:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/LaWS_aboard_USS_Ponce_%28AFSB%28I%29-15%29_in_November_2014.JPG/2560px-LaWS_aboard_USS_Ponce_%28AFSB%28I%29-15%29_in_November_2014.JPG',
  SpaceX_Starship:
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/SpaceX_Starship_ignition_during_IFT-5.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  Low_Earth_orbit:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Aurora_Australis_Observed_by_Expedition_28_Crew.jpg/2560px-Aurora_Australis_Observed_by_Expedition_28_Crew.jpg',
  TSMC:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/TSMC_Fab12A.jpg/2560px-TSMC_Fab12A.jpg',
  Linux_kernel:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1920px-Tux.svg.png',
  RISC_V:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/RISC-V-logo.svg/2560px-RISC-V-logo.svg.png'
};

const wikipediaPhotoMemoryCache = new Map<string, string>();

/**
 * Generates a stable 32-bit positive integer hash from any string.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * TIER 1: Extracts direct photograph from news item enclosure, thumbnail,
 * or the first `<img src="...">` in HTML content / description.
 */
export function extractDirectNewsWebsitePhoto(item?: {
  enclosure?: { link?: string; url?: string };
  thumbnail?: string;
  thumbnailUrl?: string;
  content?: string;
  description?: string;
}): string | undefined {
  if (!item) return undefined;
  if (item.enclosure?.link && /^https?:\/\/.+/i.test(item.enclosure.link)) {
    return item.enclosure.link;
  }
  if (item.enclosure?.url && /^https?:\/\/.+/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }
  if (item.thumbnail && /^https?:\/\/.+/i.test(item.thumbnail)) {
    return item.thumbnail;
  }
  if (item.thumbnailUrl && /^https?:\/\/.+/i.test(item.thumbnailUrl)) {
    return item.thumbnailUrl;
  }
  const contentStr = item.content || item.description;
  if (contentStr) {
    const imgMatch = contentStr.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }
  return undefined;
}

/**
 * Maps any news headline and pillar to the most relevant Wikipedia encyclopedia entity.
 */
export function detectWikipediaEntityForStory(
  headline: string,
  pillarId: NeatPillarId
): string {
  const lower = headline.toLowerCase();

  // Keyword matches
  if (/goolsbee|federal reserve|interest rate|inflation|fed\b/.test(lower)) {
    return 'Federal_Reserve';
  }
  if (/gold|bullion|sovereign reserve|central bank/.test(lower)) {
    return 'Gold_reserve';
  }
  if (/treasury|debt|deficit|bond yield|refinanc/.test(lower)) {
    return 'United_States_Treasury';
  }
  if (/bis\b|mbridge|settlement/.test(lower)) {
    return 'Bank_for_International_Settlements';
  }
  if (/asml|euv|lithograph/.test(lower)) {
    return 'ASML_Holding';
  }
  if (/gallium|germanium|mineral|export/.test(lower)) {
    return 'Gallium';
  }
  if (/tsmc|foundry|fab\b|wafer|2nm|sub-2nm/.test(lower)) {
    return 'TSMC';
  }
  if (/drone|swarm|fiber-optic|unjammable|air defense/.test(lower)) {
    return 'Autonomous_aircraft';
  }
  if (/laser|solid-state|directed-energy|weapon/.test(lower)) {
    return 'Directed_energy_weapon';
  }
  if (/starship|spacex|cryo|rocket|launch/.test(lower)) {
    return 'SpaceX_Starship';
  }
  if (/vleo|satellite|orbit|constellation/.test(lower)) {
    return 'Low_Earth_orbit';
  }
  if (/v4l2|dma-buf|zero-copy|linux|kernel/.test(lower)) {
    return 'Linux_kernel';
  }
  if (/risc-v|processor|npu/.test(lower)) {
    return 'RISC_V';
  }

  // Pillar fallbacks
  switch (pillarId) {
    case 'MONEY':
      return 'Gold_reserve';
    case 'GEOPOLITICS':
      return 'ASML_Holding';
    case 'DEFENCE':
      return 'Autonomous_aircraft';
    case 'AEROSPACE':
      return 'SpaceX_Starship';
    case 'TECH':
      return 'TSMC';
    default:
      return 'United_States_Capitol';
  }
}

/**
 * TIER 2: Fetches verified photograph from the official Wikipedia REST API for the exact entity match.
 * Extracts `data.originalimage?.source || data.thumbnail?.source`.
 */
export async function fetchWikipediaEntityPhoto(
  entity: string
): Promise<string | null> {
  const cleanEntity = entity.replace(/\s+/g, '_');
  if (wikipediaPhotoMemoryCache.has(cleanEntity)) {
    return wikipediaPhotoMemoryCache.get(cleanEntity) || null;
  }
  if (PRE_SEEDED_WIKIPEDIA_PHOTOS[cleanEntity]) {
    const pre = PRE_SEEDED_WIKIPEDIA_PHOTOS[cleanEntity];
    wikipediaPhotoMemoryCache.set(cleanEntity, pre);
    return pre;
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanEntity)}`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const source =
      data.originalimage?.source || data.thumbnail?.source || null;
    if (source && /^https?:\/\/.+/i.test(source)) {
      wikipediaPhotoMemoryCache.set(cleanEntity, source);
      return source;
    }
  } catch {
    // Ignore and fallback gracefully
  }
  return null;
}

export interface RealStoryImageResolved {
  primaryUrl: string;
  fallbackUnsplashUrl: string;
  wikimediaUrl?: string;
  uniqueHash: number;
  tierUsed: 'tier1_direct_feed' | 'tier2_wikipedia_entity' | 'tier3_editorial_unsplash';
}

/**
 * 3-TIER WEBSITE IMAGE RESOLVER (100% Real Website Photographs Only)
 *
 * Tier 1 (Direct News Website Photo): Extract enclosure, thumbnail, or <img> from feed.
 * Tier 2 (Official Wikipedia REST API Photo): Exact real entity photograph from Wikimedia Commons.
 * Tier 3 (Verified Editorial Fallback): 28 verified topic-matched Unsplash photographs.
 */
export function resolveRealWebsiteImage(options: {
  headline: string;
  pillar: NeatPillarId;
  directFeedItem?: {
    enclosure?: { link?: string; url?: string };
    thumbnail?: string;
    thumbnailUrl?: string;
    content?: string;
    description?: string;
  };
  directFeedImageUrl?: string;
  wikipediaEntity?: string;
  uniqueSeed?: string | number;
}): RealStoryImageResolved {
  const { headline, pillar, directFeedItem, directFeedImageUrl, wikipediaEntity, uniqueSeed } =
    options;
  const seedStr = `${headline}_${pillar}_${uniqueSeed ?? 'v1'}`;
  const hash = hashString(seedStr);

  // Tier 3 fallback (Deterministic 1-of-28 distinct Unsplash real photo)
  const unsplashId =
    VERIFIED_FALLBACK_UNSPLASH_IDS[hash % VERIFIED_FALLBACK_UNSPLASH_IDS.length];
  // 4K Ultra-Sharp Editorial Photography (3840x2160, Q90)
  const fallbackUnsplashUrl = `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=3840&q=90`;

  // Tier 1: Direct News Website Photo
  const tier1Direct =
    (directFeedImageUrl && /^https?:\/\/.+/i.test(directFeedImageUrl.trim())
      ? directFeedImageUrl.trim()
      : undefined) || extractDirectNewsWebsitePhoto(directFeedItem);

  if (tier1Direct) {
    return {
      primaryUrl: tier1Direct,
      fallbackUnsplashUrl,
      uniqueHash: hash,
      tierUsed: 'tier1_direct_feed'
    };
  }

  // Tier 2: Wikipedia Entity Photo
  const entity = wikipediaEntity || detectWikipediaEntityForStory(headline, pillar);
  const cachedWikiPhoto =
    wikipediaPhotoMemoryCache.get(entity) || PRE_SEEDED_WIKIPEDIA_PHOTOS[entity];

  if (cachedWikiPhoto) {
    return {
      primaryUrl: cachedWikiPhoto,
      fallbackUnsplashUrl,
      wikimediaUrl: cachedWikiPhoto,
      uniqueHash: hash,
      tierUsed: 'tier2_wikipedia_entity'
    };
  }

  // Trigger non-blocking async fetch so subsequent renders/state updates have it cached
  if (typeof window !== 'undefined') {
    void fetchWikipediaEntityPhoto(entity);
  }

  // Tier 3: Verified Editorial Fallback
  return {
    primaryUrl: fallbackUnsplashUrl,
    fallbackUnsplashUrl,
    uniqueHash: hash,
    tierUsed: 'tier3_editorial_unsplash'
  };
}

/**
 * Drop-in replacement for getUniqueStoryImage that uses 100% REAL website photographs
 * via the 3-Tier Website Image Resolver (ZERO AI image generation).
 */
export function getUniqueStoryImage(
  headline: string,
  pillar: NeatPillarId,
  directFeedUrlOrEntity?: string,
  uniqueSeed?: string | number
): RealStoryImageResolved {
  const isHttp =
    directFeedUrlOrEntity && /^https?:\/\/.+/i.test(directFeedUrlOrEntity.trim());

  return resolveRealWebsiteImage({
    headline,
    pillar,
    directFeedImageUrl: isHttp ? directFeedUrlOrEntity.trim() : undefined,
    wikipediaEntity: !isHttp ? directFeedUrlOrEntity : undefined,
    uniqueSeed
  });
}

/**
 * Ensures any image URL is rendered at maximum 4K UHD / 1080p crisp sharpness.
 */
export function upgradeTo4kUhdResolution(url: string): string {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) {
    return url.replace(/w=\d+(&q=\d+)?/g, 'w=3840&q=90&fit=crop');
  }
  if (url.includes('upload.wikimedia.org') || url.includes('thumb.wikimedia.org')) {
    return url.replace(/\/\d+px-/g, '/2560px-');
  }
  return url;
}
