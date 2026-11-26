import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setConsent } from '../lib/consent';
import { config, type FooterColumnConfig, type FooterLinkConfig } from '../config';
import { CONTACT } from '../content';
import Logo from '../components/Logo';
import { preloadSectionAndNext } from '../components/LazySection';

interface FooterProps {
  onNavigatePage?: (page: 'home' | 'privacy' | 'cookies' | 'terms') => void;
  currentPage?: string;
  onOpenAudit?: () => void;
}

const KNOWN_SECTION_IDS = new Set([
  'hero',
  'services',
  'compare',
  'proof',
  'deliver',
  'best-in',
  'help',
  'reviews',
  'work',
  'framework',
  'built-fast',
  'pricing',
  'contact',
  'faq',
  'white-label',
  'final-cta',
  'footer',
]);

const SECTION_NEXT_MAP: Record<string, string | undefined> = {
  services: 'compare',
  compare: 'proof',
  proof: 'deliver',
  deliver: 'best-in',
  'best-in': 'help',
  help: 'reviews',
  reviews: 'work',
  work: 'framework',
  framework: 'built-fast',
  'built-fast': 'pricing',
  pricing: 'contact',
  contact: 'faq',
  faq: 'white-label',
  'white-label': 'final-cta',
  'final-cta': 'footer',
};

function isLinkEnabled(link: FooterLinkConfig): boolean {
  if (!link.label?.trim() || !link.href?.trim()) return false;

  if (link.requiresFlag && !config.features[link.requiresFlag]) {
    return false;
  }

  if (link.requiresAnyFlag && link.requiresAnyFlag.length > 0) {
    const anyOn = link.requiresAnyFlag.some((key) => Boolean(config.features[key]));
    if (!anyOn) return false;
  }

  const href = link.href.trim();
  if (href.startsWith('#')) {
    return KNOWN_SECTION_IDS.has(href.slice(1));
  }
  if (href.startsWith('/') || href.startsWith('https://') || href.startsWith('http://') || href.startsWith('mailto:')) {
    return true;
  }
  return false;
}

export default function Footer({ onNavigatePage }: FooterProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const columns = useMemo<FooterColumnConfig[]>(() => {
    const rawCols = config.footer?.columns || [];
    return rawCols
      .map((col) => ({
        ...col,
        links: col.links.filter(isLinkEnabled),
      }))
      .filter((col) => col.title?.trim() && col.links.length > 0);
  }, []);

  const scrollToTarget = (href: string, opts?: { subTargetSelector?: string; trade?: string }) => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = prefersReduced ? 'auto' : 'smooth';

    if (opts?.trade) {
      const detail = { trade: opts.trade, focusField: 'name' };
      (window as Window & { __ohPendingContactPrefill?: unknown }).__ohPendingContactPrefill = detail;
      preloadSectionAndNext('contact', 'faq');
      window.dispatchEvent(new CustomEvent('openhours:prefill-contact', { detail }));
      document.getElementById('contact')?.scrollIntoView({ behavior });
      return;
    }

    if (href.startsWith('#')) {
      const id = href.slice(1);
      preloadSectionAndNext(id, SECTION_NEXT_MAP[id]);

      const scrollNow = () => {
        const sectionEl = document.getElementById(id);
        if (!sectionEl) return;
        if (opts?.subTargetSelector) {
          const subEl = sectionEl.querySelector(opts.subTargetSelector);
          if (subEl) {
            subEl.scrollIntoView({ behavior, block: 'center' });
            return;
          }
        }
        sectionEl.scrollIntoView({ behavior });
      };

      if (location.pathname !== '/') {
        navigate('/');
        window.setTimeout(scrollNow, 180);
        return;
      }

      scrollNow();
      if (opts?.subTargetSelector) {
        // Retry once after lazy chunk finishes hydrating into DOM
        window.setTimeout(scrollNow, 320);
      }
      return;
    }

    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior });
    }
  };

  const handleFooterLinkClick = (e: React.MouseEvent, link: FooterLinkConfig) => {
    if (link.href.startsWith('http://') || link.href.startsWith('https://') || link.href.startsWith('mailto:')) {
      return;
    }
    e.preventDefault();
    scrollToTarget(link.href, {
      subTargetSelector: link.subTargetSelector,
      trade: link.trade,
    });
  };

  const handleLegalClick = (
    e: React.MouseEvent,
    type: 'terms' | 'privacy' | 'cookies',
    href: string
  ) => {
    e.preventDefault();
    if (type === 'cookies') {
      setConsent({ decided: false });
      return;
    }
    if (onNavigatePage) {
      onNavigatePage(type);
    } else if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/${type}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const legalItems = [
    config.legalLinks?.terms?.trim()
      ? { label: 'Terms', type: 'terms' as const, href: config.legalLinks.terms.trim() }
      : null,
    config.legalLinks?.privacy?.trim()
      ? { label: 'Privacy Policy', type: 'privacy' as const, href: config.legalLinks.privacy.trim() }
      : null,
    config.legalLinks?.cookies?.trim()
      ? { label: 'Cookie settings', type: 'cookies' as const, href: config.legalLinks.cookies.trim() }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    type: 'terms' | 'privacy' | 'cookies';
    href: string;
  }>;

  const cleanEmail = (() => {
    const candidate = config.email || CONTACT.email || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const cleanAddress = (() => {
    const candidate = config.companyAddress || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const cleanLegalName = (config.legalName || '').trim();
  const cleanRegNumber = (config.companyRegNumber || config.registrationNumber || '').trim();
  const cleanBookingUrl = (config.bookingUrl || '').trim();
  const studioName = config.studioName || 'Open Hours';
  const year = 2026;

  // Render strictly networks present with non-empty URL in config.socials
  const socialLinks = [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: config.socials?.linkedin?.trim() || '',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      id: 'x',
      label: 'X',
      url: config.socials?.x?.trim() || '',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      label: 'Instagram',
      url: config.socials?.instagram?.trim() || '',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25ZM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      url: config.socials?.facebook?.trim() || '',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      label: 'YouTube',
      url: config.socials?.youtube?.trim() || '',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.93 4.8 12 4.8 12 4.8s-5.93 0-7.64.45A2.75 2.75 0 0 0 2.42 7.19 28.7 28.7 0 0 0 2 12a28.7 28.7 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.94c1.71.45 7.64.45 7.64.45s5.93 0 7.64-.45a2.75 2.75 0 0 0 1.94-1.94A28.7 28.7 0 0 0 22 12a28.7 28.7 0 0 0-.42-4.81ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      url: config.socials?.whatsapp?.trim() || '',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.12c-.25.7-1.44 1.34-1.99 1.42-.52.08-1.18.11-1.91-.12-.45-.14-1.02-.33-1.74-.64-3.05-1.31-5.04-4.38-5.19-4.58-.15-.21-1.24-1.65-1.24-3.15s.78-2.24 1.06-2.55c.28-.3.61-.38.81-.38h.58c.19 0 .44-.07.69.53.26.62.88 2.15.96 2.31.08.16.13.34.03.55-.1.21-.15.34-.31.52-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.54.31.15.49.13.67-.08.18-.21.77-.9.98-1.21.21-.31.41-.26.69-.15.29.1 1.81.85 2.12 1.01.31.15.52.23.6.36.07.13.07.75-.18 1.45Z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.url));

  const colsGridClass =
    columns.length >= 6
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      : columns.length === 5
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        : columns.length === 4
          ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3';

  return (
    <footer
      id="footer"
      className="relative w-full bg-[#CDEBDD] px-4 sm:px-6 md:px-[40px] pb-5 sm:pb-8 md:pb-[40px] pt-[54px] sm:pt-[62px] md:pt-[76px] text-white overflow-x-clip"
    >
      <style>{`
        .oh-footer-link {
          position: relative;
          display: inline-block;
        }
        .oh-footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -3px;
          height: 2px;
          background-color: #FFFFFF;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .oh-footer-link:hover::after,
        .oh-footer-link:focus-visible::after {
          transform: scaleX(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .oh-footer-link::after {
            transition: none;
          }
        }
      `}</style>

      {/* Faint Peach Lower-Corner Ambient Glows on Soft Mint Outer Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 46% 52% at 0% 100%, rgba(244, 217, 198, 0.92) 0%, rgba(244, 217, 198, 0.35) 48%, transparent 78%), radial-gradient(ellipse 46% 52% at 100% 100%, rgba(244, 217, 198, 0.92) 0%, rgba(244, 217, 198, 0.35) 48%, transparent 78%)',
        }}
      />

      {/* Footer Card Wrapper */}
      <div className="relative z-10 w-full">
        {/* Top Overlapping White Pill Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[34px] sm:-top-[38px] z-30 w-[calc(100%-24px)] sm:w-[calc(100%-64px)] max-w-[1100px] h-[68px] sm:h-[76px] rounded-full bg-white px-5 sm:px-8 flex items-center justify-between gap-4 shadow-[0_18px_42px_-12px_rgba(6,37,31,0.28)] border border-white/80">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#hero');
            }}
            aria-label="Open Hours home"
            className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-[#14735A] focus-visible:outline-offset-4"
          >
            <Logo variant="dark" size="md" />
          </a>

          <div className="flex items-center gap-3 shrink-0">
            {cleanBookingUrl ? (
              <a
                href={cleanBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center h-[44px] px-5 rounded-full border border-[#0B1B22]/18 bg-white hover:bg-[#F3F5F3] text-[#0B1B22] text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#14735A] focus-visible:outline-offset-2"
              >
                Book a call
              </a>
            ) : (
              <button
                type="button"
                onClick={() => scrollToTarget('#contact')}
                className="hidden sm:inline-flex items-center justify-center h-[44px] px-5 rounded-full border border-[#0B1B22]/18 bg-white hover:bg-[#F3F5F3] text-[#0B1B22] text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#14735A] focus-visible:outline-offset-2"
              >
                Book a call
              </button>
            )}

            <button
              type="button"
              onClick={() => scrollToTarget('#contact')}
              className="inline-flex items-center justify-center h-[42px] sm:h-[44px] px-5 sm:px-6 rounded-full text-white text-[14px] font-semibold transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#14735A] focus-visible:outline-offset-2"
              style={{
                background: 'linear-gradient(135deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
                boxShadow: '0 8px 20px -6px rgba(15, 74, 62, 0.44)',
              }}
            >
              Talk to Us
            </button>
          </div>
        </div>

        {/* Main Rounded Green Gradient Card */}
        <div
          className="relative w-full rounded-[36px] md:rounded-[56px] overflow-hidden shadow-[0_26px_64px_-22px_rgba(6,37,31,0.34)]"
          style={{
            background:
              'linear-gradient(180deg, #6FC9A8 0px, #2B8D6F 52px, #14735A 106px, #0D4B3B 54%, #06251F 100%)',
          }}
        >
          {/* 3% Fine Noise Grain Overlay (SVG filter, aria-hidden) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.03]"
          >
            <filter id="oh-footer-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#oh-footer-grain)" />
          </svg>

          {/* 3. Navigation Link Columns (~90px below top bar, 1120px centered) */}
          <div className="relative z-10 max-w-[1120px] mx-auto px-6 sm:px-10 pt-[122px] sm:pt-[128px]">
            <nav aria-label="Footer navigation">
              <div className={`grid ${colsGridClass} gap-x-8 lg:gap-x-6 gap-y-9`}>
                {columns.map((column) => (
                  <div key={column.id} className="min-w-0">
                    <h2 className="font-heading text-[20px] font-bold text-white leading-tight mb-4">
                      {column.title}
                    </h2>
                    <ul className="flex flex-col gap-y-[7px] list-none p-0 m-0">
                      {column.links.map((link) => (
                        <li key={`${column.id}-${link.label}`}>
                          <a
                            href={link.href}
                            onClick={(e) => handleFooterLinkClick(e, link)}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="oh-footer-link text-[16px] leading-[21px] text-white/85 hover:text-white transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#A8EBD3] focus-visible:outline-offset-4 rounded-xs"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>

            {/* 4. Divider + Bottom Bar */}
            <div className="mt-10 sm:mt-12 pt-0">
              <div className="h-px w-full bg-white/20" aria-hidden="true" />

              <div className="min-h-[60px] py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Left: Social Buttons (36px) + Legal Links */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-5">
                  {socialLinks.length > 0 && (
                    <div className="flex items-center gap-2.5">
                      {socialLinks.map((soc) => (
                        <a
                          key={soc.id}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={soc.label}
                          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#A8EBD3] focus-visible:outline-offset-2"
                        >
                          {soc.icon}
                        </a>
                      ))}
                    </div>
                  )}

                  {legalItems.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/80">
                      {legalItems.map((item) =>
                        item.type === 'cookies' ? (
                          <button
                            key={item.type}
                            type="button"
                            onClick={(e) => handleLegalClick(e, item.type, item.href)}
                            className="oh-footer-link hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A8EBD3] focus-visible:outline-offset-4 rounded-xs"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <a
                            key={item.type}
                            href={item.href}
                            onClick={(e) => handleLegalClick(e, item.type, item.href)}
                            className="oh-footer-link hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A8EBD3] focus-visible:outline-offset-4 rounded-xs"
                          >
                            {item.label}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Email Pill + Copyright (+ optional company details) */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 lg:gap-6">
                  {cleanEmail && (
                    <a
                      href={`mailto:${cleanEmail}`}
                      className="inline-flex items-center gap-2 w-fit rounded-full bg-white/12 hover:bg-white/20 border border-white/25 px-4 py-1.5 text-[13px] font-medium text-white transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#A8EBD3] focus-visible:outline-offset-2"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-white shrink-0"
                      >
                        <rect x="1.75" y="3" width="12.5" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M2.5 4.2L8 8.4L13.5 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{cleanEmail}</span>
                    </a>
                  )}

                  <div className="text-[13px] text-white/80 tabular-nums leading-relaxed">
                    <span>
                      &copy; {year} {studioName}. All rights reserved.
                    </span>
                    {cleanLegalName && cleanLegalName !== studioName && (
                      <span> {cleanLegalName}.</span>
                    )}
                    {cleanRegNumber && <span> Reg. {cleanRegNumber}.</span>}
                    {cleanAddress && <span> {cleanAddress}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Giant Cropped Wordmark Inside Bottom Edge (single line, ~35% cropped off bottom) */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none w-full max-w-[1120px] mx-auto px-4 sm:px-8 pt-1 sm:pt-2 overflow-hidden flex justify-center"
          >
            <span
              className="font-bold tracking-[-0.045em] leading-[0.82] block text-transparent bg-clip-text translate-y-[34%]"
              style={{
                fontFamily: 'var(--font-heading)',
                whiteSpace: 'nowrap',
                textWrap: 'nowrap',
                fontSize: 'clamp(3.6rem, 14.5vw, 13.5rem)',
                backgroundImage:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.08) 56%, rgba(255, 255, 255, 0.03) 100%)',
              }}
            >
              Open Hours
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
