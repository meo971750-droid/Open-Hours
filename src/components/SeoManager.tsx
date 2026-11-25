import { useEffect } from 'react';
import { config } from '../config';

export type SeoPageKey = 'home' | 'privacy' | 'cookies' | 'terms';

interface SeoManagerProps {
  currentPage: SeoPageKey;
}

const SITE_ORIGIN = 'https://openhours.studio';

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export default function SeoManager({ currentPage }: SeoManagerProps) {
  useEffect(() => {
    const lowestSetupTier = config.pricing.tiers[0];
    const startingPriceCopy = lowestSetupTier
      ? `Packages from €${lowestSetupTier.price.toLocaleString('en-IE')} set-up + €${lowestSetupTier.monthlyPrice.toLocaleString('en-IE')}/month.`
      : '';

    const routeMap: Record<SeoPageKey, { title: string; description: string; path: string }> = {
      home: {
        title: `${config.studioName} | Websites built to catch inquiries`,
        description: `${config.studioName} builds websites built to catch inquiries, local SEO and AI lead handling. ${startingPriceCopy}`.trim(),
        path: '/',
      },
      privacy: {
        title: `Privacy Policy | ${config.studioName}`,
        description: `How ${config.legalName || config.studioName} handles enquiry details, contact forms, and website privacy.`,
        path: '/#privacy',
      },
      cookies: {
        title: `Cookie Notice | ${config.studioName}`,
        description: `Cookie preferences and strictly necessary browser storage used on ${config.studioName}.`,
        path: '/#cookies',
      },
      terms: {
        title: `Terms of Service | ${config.studioName}`,
        description: `Website build, monthly care, and service terms for ${config.legalName || config.studioName}.`,
        path: '/#terms',
      },
    };

    const meta = routeMap[currentPage];
    const canonicalUrl = `${SITE_ORIGIN}${meta.path === '/' ? '/' : meta.path}`;
    const rawSocialImg = config.socialImage || config.portfolio[0]?.image || '/roofing-sites/1-xyz-roofing.png';
    const socialImageUrl = rawSocialImg.startsWith('http') ? rawSocialImg : `${SITE_ORIGIN}${rawSocialImg}`;

    document.title = meta.title;
    upsertCanonical(canonicalUrl);
    upsertMetaTag('name', 'description', meta.description);
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:site_name', config.studioName);
    upsertMetaTag('property', 'og:image', socialImageUrl);
    upsertMetaTag('property', 'og:image:alt', `${config.studioName} website showcase`);
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', meta.description);
    upsertMetaTag('name', 'twitter:image', socialImageUrl);

    const offerCatalogItems = config.pricing.tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: `${tier.outcome} From €${tier.price.toLocaleString('en-IE')} set-up, plus €${tier.monthlyPrice.toLocaleString('en-IE')} per month.`,
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Set-up from',
          price: String(tier.price),
          priceCurrency: 'EUR',
        },
        {
          '@type': 'UnitPriceSpecification',
          name: 'Monthly plan from',
          price: String(tier.monthlyPrice),
          priceCurrency: 'EUR',
          unitCode: 'MON',
        },
      ],
    }));

    const orgSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.legalName || config.studioName,
      url: SITE_ORIGIN,
      image: socialImageUrl,
      description:
        'Fast, enquiry-focused websites, Google Business Profile setups and AI lead handling for builders and home-improvement trades in Ireland and Malta.',
      ...(config.email
        ? {
            contactPoint: {
              '@type': 'ContactPoint',
              email: config.email,
              contactType: 'customer service',
            },
          }
        : {}),
      ...(config.companyAddress && config.companyAddress.trim().length > 0
        ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: config.companyAddress.trim(),
            },
          }
        : {}),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${config.studioName} Website & Growth Packages`,
        itemListElement: offerCatalogItems,
      },
    };

    let script = document.getElementById('oh-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'oh-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(orgSchema);
  }, [currentPage]);

  return null;
}
