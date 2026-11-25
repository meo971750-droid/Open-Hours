export type AllowedVideoHost =
  | 'youtube'
  | 'vimeo'
  | 'loom'
  | 'wistia'
  | 'bunny'
  | 'cloudflare'
  | 'streamable';

export interface ParsedVideoEmbed {
  allowed: boolean;
  hostKind: AllowedVideoHost | null;
  rawSrc: string | null;
  embedSrc: string | null;
  origin: string | null;
  youtubeId: string | null;
  streamableId: string | null;
  reason?: string;
}

const warmedOrigins = new Set<string>();

/**
 * Extract only the iframe `src` attribute from raw pasted embed HTML without touching the DOM
 * or executing any markup. Falls back to raw URL input if no iframe tag is present.
 */
export function extractIframeSrc(embedCodeOrUrl?: string): string | null {
  if (!embedCodeOrUrl || typeof embedCodeOrUrl !== 'string') return null;
  const trimmed = embedCodeOrUrl.trim();
  if (!trimmed) return null;

  const iframeMatch = trimmed.match(
    /<iframe\b[^>]*\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
  );
  if (iframeMatch) {
    const candidate = (iframeMatch[1] ?? iframeMatch[2] ?? iframeMatch[3] ?? '').trim();
    return candidate || null;
  }

  // If raw URL was supplied without iframe markup
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function extractYouTubeId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') {
    return segments[0] || null;
  }

  if (url.pathname === '/watch') {
    return url.searchParams.get('v') || null;
  }

  if (
    segments[0] === 'embed' ||
    segments[0] === 'shorts' ||
    segments[0] === 'live'
  ) {
    return segments[1] || null;
  }

  return null;
}

function extractStreamableId(url: URL): string | null {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  if ((segments[0] === 'e' || segments[0] === 'o') && segments[1]) {
    return segments[1];
  }
  return segments[0] || null;
}

function classifyAllowedHost(hostname: string): AllowedVideoHost | null {
  const h = hostname.toLowerCase();

  if (
    h === 'youtube.com' ||
    h === 'www.youtube.com' ||
    h === 'm.youtube.com' ||
    h === 'youtube-nocookie.com' ||
    h === 'www.youtube-nocookie.com' ||
    h === 'youtu.be'
  ) {
    return 'youtube';
  }

  if (h === 'vimeo.com' || h === 'www.vimeo.com' || h === 'player.vimeo.com') {
    return 'vimeo';
  }

  if (h === 'loom.com' || h === 'www.loom.com') {
    return 'loom';
  }

  if (
    h === 'wistia.com' ||
    h === 'www.wistia.com' ||
    h === 'fast.wistia.net' ||
    h === 'fast.wistia.com' ||
    h.endsWith('.wistia.com') ||
    h.endsWith('.wistia.net')
  ) {
    return 'wistia';
  }

  if (h === 'iframe.mediadelivery.net') {
    return 'bunny';
  }

  if (
    h === 'iframe.cloudflarestream.com' ||
    h === 'videodelivery.net' ||
    h.endsWith('.cloudflarestream.com')
  ) {
    return 'cloudflare';
  }

  if (h === 'streamable.com' || h === 'www.streamable.com') {
    return 'streamable';
  }

  return null;
}

export function parseVideoEmbed(
  embedCode?: string,
  embedUrl?: string
): ParsedVideoEmbed {
  const rawSrc = extractIframeSrc(embedCode) ?? extractIframeSrc(embedUrl);

  if (!rawSrc) {
    return {
      allowed: false,
      hostKind: null,
      rawSrc: null,
      embedSrc: null,
      origin: null,
      youtubeId: null,
      streamableId: null,
      reason: 'Missing embed URL or iframe src',
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawSrc);
  } catch {
    return {
      allowed: false,
      hostKind: null,
      rawSrc,
      embedSrc: null,
      origin: null,
      youtubeId: null,
      streamableId: null,
      reason: 'Invalid URL',
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      allowed: false,
      hostKind: null,
      rawSrc,
      embedSrc: null,
      origin: null,
      youtubeId: null,
      streamableId: null,
      reason: 'Non-HTTPS video URL',
    };
  }

  const hostKind = classifyAllowedHost(parsed.hostname);
  if (!hostKind) {
    return {
      allowed: false,
      hostKind: null,
      rawSrc,
      embedSrc: null,
      origin: null,
      youtubeId: null,
      streamableId: null,
      reason: `Unrecognised host: ${parsed.hostname}`,
    };
  }

  let embedSrc = parsed.toString();
  let origin = parsed.origin;
  let youtubeId: string | null = null;
  let streamableId: string | null = null;

  if (hostKind === 'youtube') {
    youtubeId = extractYouTubeId(parsed);
    if (youtubeId) {
      const targetOrigin = 'https://www.youtube-nocookie.com';
      const normalized = new URL(`${targetOrigin}/embed/${encodeURIComponent(youtubeId)}`);
      // Preserve benign params such as start/si if present
      parsed.searchParams.forEach((value, key) => {
        if (key !== 'v' && key !== 'autoplay') {
          normalized.searchParams.set(key, value);
        }
      });
      embedSrc = normalized.toString();
      origin = normalized.origin;
    }
  } else if (hostKind === 'vimeo' && parsed.hostname.toLowerCase() !== 'player.vimeo.com') {
    const id = parsed.pathname.split('/').filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) {
      const normalized = new URL(`https://player.vimeo.com/video/${id}`);
      embedSrc = normalized.toString();
      origin = normalized.origin;
    }
  } else if (hostKind === 'loom') {
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments[0] === 'share' && segments[1]) {
      const normalized = new URL(`https://www.loom.com/embed/${encodeURIComponent(segments[1])}`);
      embedSrc = normalized.toString();
      origin = normalized.origin;
    }
  } else if (hostKind === 'streamable') {
    streamableId = extractStreamableId(parsed);
    if (streamableId) {
      const normalized = new URL(`https://streamable.com/e/${encodeURIComponent(streamableId)}`);
      parsed.searchParams.forEach((value, key) => {
        if (key !== 'autoplay') {
          normalized.searchParams.set(key, value);
        }
      });
      embedSrc = normalized.toString();
      origin = normalized.origin;
    }
  }

  return {
    allowed: true,
    hostKind,
    rawSrc,
    embedSrc,
    origin,
    youtubeId,
    streamableId,
  };
}

export function buildHoverPlayEmbedSrc(
  embedSrc: string,
  hostKind: AllowedVideoHost | null
): string {
  try {
    const url = new URL(embedSrc);
    url.searchParams.set('autoplay', '1');
    if (hostKind === 'streamable') {
      url.searchParams.set('muted', '1');
      url.searchParams.set('nocontrols', '1');
      url.searchParams.set('loop', '1');
    } else if (hostKind === 'youtube') {
      url.searchParams.set('mute', '1');
      url.searchParams.set('controls', '0');
      url.searchParams.set('playsinline', '1');
    } else {
      url.searchParams.set('muted', '1');
    }
    return url.toString();
  } catch {
    return embedSrc;
  }
}

export function buildModalPlayEmbedSrc(
  embedSrc: string,
  hostKind: AllowedVideoHost | null,
  options?: { muted?: boolean; nocontrols?: boolean }
): string {
  try {
    const url = new URL(embedSrc);
    url.searchParams.set('autoplay', '1');
    if (hostKind === 'streamable') {
      url.searchParams.set('muted', options?.muted === false ? '0' : '1');
      if (options?.nocontrols !== false) {
        url.searchParams.set('nocontrols', '1');
      }
    } else if (hostKind === 'youtube') {
      url.searchParams.set('playsinline', '1');
      if (options?.muted) {
        url.searchParams.set('mute', '1');
      }
      if (!url.searchParams.has('rel')) {
        url.searchParams.set('rel', '0');
      }
    } else if (options?.muted) {
      url.searchParams.set('muted', '1');
    }
    return url.toString();
  } catch {
    return embedSrc;
  }
}

export function deriveStreamablePosterUrl(streamableId: string): string {
  return `https://cdn-cf-east.streamable.com/image/${encodeURIComponent(streamableId)}.jpg`;
}

export function deriveYouTubePosterUrls(youtubeId: string): {
  primary: string;
  fallback: string;
} {
  const safeId = encodeURIComponent(youtubeId);
  return {
    primary: `https://i.ytimg.com/vi/${safeId}/maxresdefault.jpg`,
    fallback: `https://i.ytimg.com/vi/${safeId}/hqdefault.jpg`,
  };
}

export function warmVideoOrigin(origin: string | null): void {
  if (!origin || typeof document === 'undefined') return;
  if (warmedOrigins.has(origin)) return;
  warmedOrigins.add(origin);

  const existing = document.head.querySelector(
    `link[rel="preconnect"][href="${origin}"]`
  );
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  document.head.appendChild(link);
}
