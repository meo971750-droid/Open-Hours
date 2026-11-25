const CLOUDINARY_HOST = 'res.cloudinary.com';

const LOCAL_RESPONSIVE_BASE: Record<string, string> = {
  '/roofing-sites/1-xyz-roofing.png': '/roofing-sites/1-xyz-roofing',
  '/roofing-sites/3-alex-roofing.png': '/roofing-sites/3-alex-roofing',
  '/roofing-sites/4-roofen.png': '/roofing-sites/4-roofen',
  '/roofing-sites/5-atlantic-slate-roofing.png': '/roofing-sites/5-atlantic-slate-roofing',
};

const LOCAL_RESPONSIVE_WIDTHS = [320, 640, 960, 1280] as const;

const AVATAR_LOCAL_84_MAP: Array<[string, string]> = [
  ['f88983ee-9bb7-48cc-9717-707810658a41', '/clients/1.webp'],
  ['4e081c92-8a77-4a6f-b2c0-f4b0d76e7b25', '/clients/2.webp'],
  ['7afb3abc-92ea-4b52-b4ca-6b3bafc02fb8', '/clients/3.webp'],
  ['454e4e70-b56b-4de0-8e0a-2f1266182cb0', '/clients/4.webp'],
  ['7fcdb1d4-6c52-4722-9a22-1ba1e04d0803', '/clients/5.webp'],
];

const preloadedUrls = new Set<string>();

export function optimizeImageUrl(
  url: string,
  width?: number,
  quality: 'auto' | 'good' | 'best' = 'good'
): string {
  if (!url || !url.includes(CLOUDINARY_HOST) || !url.includes('/image/upload/')) {
    return url;
  }

  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const prefix = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);
  const parts = rest.split('/');
  // Never compress below q_auto:good
  const qParam = quality === 'best' ? 'q_auto:best' : 'q_auto:good';
  const transformParams = ['f_auto', qParam, 'dpr_auto'];
  if (width && Number.isFinite(width) && width > 0) {
    transformParams.push(`w_${Math.round(width)}`);
  }
  const transformSegment = transformParams.join(',');

  // Replace existing optimization segment if present, otherwise prepend right after /image/upload/
  if (parts.length > 1 && (/^f_auto|^q_auto|^dpr_auto|^w_\d+|^c_/.test(parts[0]))) {
    return `${prefix}${transformSegment}/${parts.slice(1).join('/')}`;
  }

  return `${prefix}${transformSegment}/${rest}`;
}

export function getResponsiveImageProps(
  src: string,
  widths: number[] = [320, 640, 960, 1280],
  sizes = '100vw',
  quality: 'auto' | 'good' | 'best' = 'good'
): { src: string; srcSet?: string; sizes?: string } {
  if (!src) return { src };

  const localBase = LOCAL_RESPONSIVE_BASE[src];
  if (localBase) {
    const allowed = new Set(LOCAL_RESPONSIVE_WIDTHS);
    const requested = Array.from(
      new Set(
        widths
          .map((w) => LOCAL_RESPONSIVE_WIDTHS.find((lw) => lw >= w) ?? 1280)
          .filter((w) => allowed.has(w))
      )
    ).sort((a, b) => a - b);
    const finalWidths = requested.length > 0 ? requested : [640, 960];
    const fallbackWidth = finalWidths.includes(960)
      ? 960
      : finalWidths[finalWidths.length - 1];
    return {
      src: `${localBase}-${fallbackWidth}w.webp`,
      srcSet: finalWidths.map((w) => `${localBase}-${w}w.webp ${w}w`).join(', '),
      sizes,
    };
  }

  if (src.includes(CLOUDINARY_HOST) && src.includes('/image/upload/')) {
    const cleanWidths = Array.from(new Set(widths.filter((w) => w > 0))).sort((a, b) => a - b);
    const defaultWidth = cleanWidths[cleanWidths.length - 1] ?? 960;
    const srcSet = cleanWidths.map((w) => `${optimizeImageUrl(src, w, quality)} ${w}w`).join(', ');
    return {
      src: optimizeImageUrl(src, defaultWidth, quality),
      srcSet,
      sizes,
    };
  }

  return { src };
}

/**
 * Resolves tiny <=84px avatar photos to lightweight local 84x84 WebP thumbnails when available,
 * falling back to the optimized original URL for any newly added reviewer photos.
 */
export function getSmallAvatarSrc(url?: string, explicitLocalSrc?: string): string {
  if (explicitLocalSrc) return explicitLocalSrc;
  if (!url) return '';
  for (const [needle, localPath] of AVATAR_LOCAL_84_MAP) {
    if (url.includes(needle)) return localPath;
  }
  return optimizeImageUrl(url, 96, 'good');
}

export function preloadResponsiveImage(
  src: string,
  widths: number[] = [320, 640, 960],
  sizes = '(max-width: 767px) 92vw, 640px'
): void {
  if (typeof window === 'undefined' || !src) return;
  const props = getResponsiveImageProps(src, widths, sizes, 'good');
  const key = `${props.src}|${props.srcSet || ''}`;
  if (preloadedUrls.has(key)) return;
  preloadedUrls.add(key);

  const img = new Image();
  img.decoding = 'async';
  if (props.sizes) img.sizes = props.sizes;
  if (props.srcSet) img.srcset = props.srcSet;
  img.src = props.src;
}
