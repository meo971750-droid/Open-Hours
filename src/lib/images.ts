const CLOUDINARY_HOST = 'res.cloudinary.com';

export function optimizeImageUrl(url: string, width?: number): string {
  if (!url || !url.includes(CLOUDINARY_HOST) || !url.includes('/image/upload/')) {
    return url;
  }

  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const prefix = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);
  const parts = rest.split('/');
  const transformParams = ['f_auto', 'q_auto'];
  if (width && Number.isFinite(width) && width > 0) {
    transformParams.push(`w_${Math.round(width)}`);
  }
  const transformSegment = transformParams.join(',');

  // Replace existing optimization segment if present, otherwise prepend right after /image/upload/
  if (parts.length > 1 && (/^f_auto|^q_auto|^w_\d+|^c_/.test(parts[0]))) {
    return `${prefix}${transformSegment}/${parts.slice(1).join('/')}`;
  }

  return `${prefix}${transformSegment}/${rest}`;
}

export function getResponsiveImageProps(
  src: string,
  widths: number[] = [320, 640, 960, 1280],
  sizes = '100vw'
): { src: string; srcSet?: string; sizes?: string } {
  if (!src) return { src };

  if (src.includes(CLOUDINARY_HOST) && src.includes('/image/upload/')) {
    const cleanWidths = Array.from(new Set(widths.filter((w) => w > 0))).sort((a, b) => a - b);
    const defaultWidth = cleanWidths[cleanWidths.length - 1] ?? 960;
    const srcSet = cleanWidths.map((w) => `${optimizeImageUrl(src, w)} ${w}w`).join(', ');
    return {
      src: optimizeImageUrl(src, defaultWidth),
      srcSet,
      sizes,
    };
  }

  return { src };
}
