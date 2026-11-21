import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { setConsent } from '../lib/consent';
import { config } from '../config';
import { CONTACT } from '../content';

interface FooterProps {
  onNavigatePage?: (page: 'home' | 'privacy' | 'cookies' | 'terms') => void;
  currentPage?: string;
  onOpenAudit?: () => void;
}

export default function Footer({ onNavigatePage }: FooterProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
      if (href.includes('#')) {
        const [path, hash] = href.split('#');
        if (location.pathname === path) {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate(path);
          window.setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      } else {
        if (location.pathname === href) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate(href);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    if (href.startsWith('#')) {
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleBackToTop = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  };

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How We Deliver', href: '#deliver' },
    { label: 'Work', href: '#work' },
    { label: 'FAQ', href: '#faq' },
  ];

  const legalItems = [
    config.legalLinks?.terms
      ? { label: 'Terms', type: 'terms' as const, href: config.legalLinks.terms }
      : null,
    config.legalLinks?.privacy
      ? { label: 'Privacy Policy', type: 'privacy' as const, href: config.legalLinks.privacy }
      : null,
    config.legalLinks?.cookies
      ? { label: 'Cookie settings', type: 'cookies' as const, href: config.legalLinks.cookies }
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

  const cleanPhone = (() => {
    const candidate = config.phone || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const cleanAddress = (() => {
    const candidate = config.companyAddress || '';
    if (!candidate || candidate.includes('[')) return '';
    return candidate.trim();
  })();

  const cleanRegistration = (config.registrationNumber || '').trim();
  const cleanLegalName = (config.legalName || '').trim();

  // Social links strictly from config.socials — hide any empty URL
  const socialLinks = [
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
      id: 'x',
      label: 'X',
      url: config.socials?.x?.trim() || '',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.url));

  const year = 2026;
  const studioName = config.studioName || 'Open Hours';

  return (
    <footer className="oh-cv-auto relative w-full bg-[#050E0D] p-4 text-white overflow-x-clip">
      {/* Large 16px-Inset Rounded Container */}
      <div
        className="relative z-10 w-full rounded-[28px] overflow-hidden border border-white/[0.09] bg-[#050E0D]"
        style={{
          background:
            'radial-gradient(ellipse 95% 58% at 55% 106%, rgba(63, 209, 165, 0.45) 0%, rgba(15, 74, 62, 0.56) 38%, rgba(10, 58, 48, 0.65) 66%, #050E0D 100%)',
        }}
      >
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-4">
          {/* Top Row: Left Navigation + Right Socials & Contact */}
          <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-8 mb-14 sm:mb-20">
            {/* Left: Primary Nav Links + Smaller Legal Links */}
            <div className="flex flex-col">
              <nav aria-label="Footer navigation">
                <ul className="grid grid-cols-2 sm:flex sm:flex-col gap-x-6 gap-y-3 list-none p-0 m-0">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="oh-link-sweep inline-block text-[18px] sm:text-[22px] font-normal tracking-[-0.015em] text-white/92 hover:text-[#A8EBD3] transition-colors cursor-pointer rounded-xs"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {legalItems.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-white/75">
                  {legalItems.map((item) =>
                    item.type === 'cookies' ? (
                      <button
                        key={item.type}
                        type="button"
                        onClick={(e) => handleLegalClick(e, item.type, item.href)}
                        className="hover:text-[#A8EBD3] underline-offset-4 hover:underline transition-colors cursor-pointer rounded-xs"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <a
                        key={item.type}
                        href={item.href}
                        onClick={(e) => handleLegalClick(e, item.type, item.href)}
                        className="hover:text-[#A8EBD3] underline-offset-4 hover:underline transition-colors cursor-pointer rounded-xs"
                      >
                        {item.label}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Right: Social Buttons (from config.socials only) + Contact Info */}
            <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2.5 mb-5">
                  {socialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.label}
                      className="w-9 h-9 rounded-full border border-white/22 bg-white/[0.04] hover:bg-[#14624F] hover:border-[#6FD6B0]/50 hover:text-white active:scale-[0.98] text-white/90 flex items-center justify-center transition-[background-color,border-color,color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              )}

              <div className="space-y-1.5 text-[14px] sm:text-[15px] text-white/75 leading-relaxed">
                {cleanEmail && (
                  <p>
                    E-mail:{' '}
                    <a
                      href={`mailto:${cleanEmail}`}
                      className="oh-link-sweep text-white/92 hover:text-[#A8EBD3] transition-colors rounded-xs"
                    >
                      {cleanEmail}
                    </a>
                  </p>
                )}

                {cleanPhone && (
                  <p>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="oh-link-sweep text-white/88 hover:text-[#A8EBD3] transition-colors rounded-xs"
                    >
                      {cleanPhone}
                    </a>
                  </p>
                )}

                {cleanAddress && <p className="text-white/75">{cleanAddress}</p>}
              </div>
            </div>
          </div>

          {/* Copyright Row + High-Contrast Scroll-to-Top Control */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[12.5px] sm:text-[13px] text-white/75 pb-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="tabular-nums">
                &copy; {year} {studioName}. All rights reserved
              </span>
              {cleanLegalName && cleanLegalName !== studioName && (
                <>
                  <span aria-hidden="true" className="opacity-45">
                    &middot;
                  </span>
                  <span>{cleanLegalName}</span>
                </>
              )}
              {cleanRegistration && (
                <>
                  <span aria-hidden="true" className="opacity-45">
                    &middot;
                  </span>
                  <span className="tabular-nums">Reg. {cleanRegistration}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4A3E] hover:bg-[#14624F] active:scale-[0.98] text-white border border-[#6FD6B0]/35 text-[12.5px] font-medium transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#A8EBD3]" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Giant Low-Opacity Green-Teal Wordmark Cropped at Bottom Edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none w-full flex justify-center overflow-hidden px-3"
        >
          <span
            className="font-heading font-bold tracking-[-0.04em] leading-[0.8] whitespace-nowrap block text-transparent bg-clip-text translate-y-[14%]"
            style={{
              fontSize: 'clamp(3.6rem, 16.5vw, 17.5rem)',
              backgroundImage:
                'linear-gradient(180deg, rgba(168, 235, 211, 0.34) 0%, rgba(111, 214, 176, 0.2) 68%, rgba(63, 209, 165, 0.08) 100%)',
              textShadow: '0 0 36px rgba(63, 209, 165, 0.16)',
            }}
          >
            Open Hours
          </span>
        </div>
      </div>
    </footer>
  );
}
