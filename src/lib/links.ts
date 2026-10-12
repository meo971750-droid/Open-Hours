export interface SectionLocation {
  path: string;
  anchor?: string;
}

export const SECTION_LOCATIONS: Record<string, SectionLocation> = {
  designs: { path: '/', anchor: 'designs' },
  'what-it-does': { path: '/' },
  'how-it-works': { path: '/how-it-works' },
  process: { path: '/how-it-works' },
  'sample-audit': { path: '/how-it-works' },
  'concept-studies': { path: '/our-work' },
  pricing: { path: '/packages' },
  included: { path: '/packages' },
  'why-open-hours': { path: '/packages' },
  compare: { path: '/packages' },
  faq: { path: '/packages' },
  'faq-short': { path: '/' },
  reviews: { path: '/' },
  'video-review': { path: '/about' },
  about: { path: '/about' },
  contact: { path: '/contact' },
};

export function getSectionHref(sectionId: string): string {
  const loc = SECTION_LOCATIONS[sectionId];
  if (!loc) return `#${sectionId}`;
  if (loc.anchor) {
    return `${loc.path}#${loc.anchor}`;
  }
  return loc.path;
}

export function getPackagePagePath(tierId: string): string {
  switch (tierId) {
    case 'first':
      return '/packages/1-page-website';
    case 'starter':
      return '/packages/starter';
    case 'standard':
      return '/packages/standard';
    case 'growth':
      return '/packages/growth';
    default:
      return '/packages';
  }
}
