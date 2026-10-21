import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setConsent } from '../lib/consent';
import { CONFIG } from '../config';
import { CONTACT } from '../content';

interface FooterProps {
  onNavigatePage?: (page: 'home' | 'privacy' | 'cookies' | 'terms') => void;
  currentPage?: string;
  onOpenAudit?: () => void;
}

export default function Footer({ onNavigatePage, currentPage, onOpenAudit }: FooterProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
      if (href.includes('#')) {
        const [path, hash] = href.split('#');
        if (location.pathname === path) {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate(path);
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
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
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Platform', href: '#what-it-does' },
    { label: 'Use Cases', href: '#designs' },
    { label: 'Resources', href: '#interactive-features' },
    { label: 'Services', href: '#why-open-hours' },
    { label: 'About', href: '#about' },
  ];

  const email =
    CONTACT.email && !CONTACT.email.includes('[')
      ? CONTACT.email
      : 'hello@openhours.studio';

  // Highlighted dot positions for the left and right schematics
  const leftHighlightedDots = new Set(['1-2', '3-5', '5-1', '2-7', '4-4']);
  const rightHighlightedDots = new Set(['2-1', '4-3', '1-6', '5-5', '3-7']);

  return (
    <footer
      className="relative w-full overflow-hidden select-none"
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #F5FAF6 18%, #D8EFE0 42%, #95CFAB 72%, #4E9B6C 100%)',
      }}
    >
      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 sm:pt-28 md:pt-32">
        {/* Main 3-Column Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center pb-20 sm:pb-28">
          {/* Left Column: Social icons, email, physical address */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            {/* Social Icons (Facebook, LinkedIn, X) matching reference */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#0F2A35]/30 flex items-center justify-center text-[#0F2A35] hover:bg-[#0F2A35] hover:text-white transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-lg border border-[#0F2A35]/30 flex items-center justify-center text-[#0F2A35] hover:bg-[#0F2A35] hover:text-white transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X"
                className="w-10 h-10 rounded-lg border border-[#0F2A35]/30 flex items-center justify-center text-[#0F2A35] hover:bg-[#0F2A35] hover:text-white transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Email Address */}
            <div>
              <a
                href={`mailto:${email}`}
                className="text-xl sm:text-2xl font-bold text-[#0F2A35] hover:text-[#184831] transition-colors tracking-tight"
              >
                {email}
              </a>
            </div>

            {/* Physical Address */}
            <div className="text-[14px] sm:text-[15px] text-[#2D543F] leading-relaxed">
              <p>Harju maakond, Tallinn,</p>
              <p>Kesklinna linnaosa,</p>
              <p>Vesivärava tn 50-201, 10152</p>
            </div>
          </div>

          {/* Center Column: Schematic Brackets + Dot Matrix + "Get a Demo [FREE]" Button */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="flex items-center">
              {/* Left Schematic: Dot Matrix & Bracket */}
              <div className="relative w-28 sm:w-36 h-28 hidden sm:block">
                {/* Dot Matrix Grid (7 cols x 9 rows) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 110">
                  {Array.from({ length: 7 }).map((_, c) =>
                    Array.from({ length: 9 }).map((_, r) => {
                      const isHighlighted = leftHighlightedDots.has(`${c}-${r}`);
                      return (
                        <circle
                          key={`l-${c}-${r}`}
                          cx={c * 13 + 12}
                          cy={r * 11 + 10}
                          r={isHighlighted ? 2.2 : 1.2}
                          fill={isHighlighted ? '#10B981' : 'rgba(38, 92, 62, 0.28)'}
                          className={isHighlighted ? 'animate-pulse' : ''}
                        />
                      );
                    })
                  )}
                  {/* Left Bracket with connector to button */}
                  <path
                    d="M 24 8 L 96 8 Q 106 8 106 18 L 106 92 Q 106 102 96 102 L 24 102"
                    fill="none"
                    stroke="rgba(38, 92, 62, 0.45)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                  <line
                    x1="106"
                    y1="55"
                    x2="120"
                    y2="55"
                    stroke="rgba(38, 92, 62, 0.55)"
                    strokeWidth="1.25"
                  />
                </svg>
              </div>

              {/* Center Pill Button: "Talk to Us [FREE]" */}
              <button
                type="button"
                onClick={() => onOpenAudit?.()}
                className="relative z-20 mx-1 inline-flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#131719] hover:bg-black text-white text-[14px] sm:text-[15px] font-medium shadow-[0_12px_32px_rgba(0,0,0,0.3)] border border-white/15 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Talk to Us</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-400/20 text-[#4ADE80] border border-emerald-400/30">
                  FREE
                </span>
              </button>

              {/* Right Schematic: Bracket & Dot Matrix */}
              <div className="relative w-28 sm:w-36 h-28 hidden sm:block">
                {/* Dot Matrix Grid (7 cols x 9 rows) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 110">
                  {/* Right Bracket with connector to button */}
                  <line
                    x1="0"
                    y1="55"
                    x2="14"
                    y2="55"
                    stroke="rgba(38, 92, 62, 0.55)"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M 96 8 L 24 8 Q 14 8 14 18 L 14 92 Q 14 102 24 102 L 96 102"
                    fill="none"
                    stroke="rgba(38, 92, 62, 0.45)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                  {Array.from({ length: 7 }).map((_, c) =>
                    Array.from({ length: 9 }).map((_, r) => {
                      const isHighlighted = rightHighlightedDots.has(`${c}-${r}`);
                      return (
                        <circle
                          key={`r-${c}-${r}`}
                          cx={c * 13 + 26}
                          cy={r * 11 + 10}
                          r={isHighlighted ? 2.2 : 1.2}
                          fill={isHighlighted ? '#10B981' : 'rgba(38, 92, 62, 0.28)'}
                          className={isHighlighted ? 'animate-pulse' : ''}
                        />
                      );
                    })
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Navigation Links matching reference */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end space-y-3 sm:space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg sm:text-[21px] font-medium text-[#0F2A35] hover:text-[#184831] transition-colors cursor-pointer tracking-tight"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Sub-Footer Row: Terms and conditions, Copyright, Privacy Policy */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-6 text-[13px] sm:text-[14px] text-[#1E4A34] font-medium border-t border-[#1E4A34]/20">
          <div>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigatePage) onNavigatePage('terms');
                else navigate('/terms');
              }}
              className="hover:text-[#0F2A35] hover:underline transition-colors"
            >
              Terms and conditions
            </a>
          </div>

          <div className="text-center">
            <span>
              © {new Date().getFullYear()} {CONFIG.studioName || 'Open Hours'}. All Rights Reserved
            </span>
            <span className="mx-2 opacity-40">·</span>
            <button
              type="button"
              onClick={() => setConsent({ decided: false })}
              className="hover:text-[#0F2A35] underline cursor-pointer"
            >
              Cookie settings
            </button>
          </div>

          <div>
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigatePage) onNavigatePage('privacy');
                else navigate('/privacy');
              }}
              className="hover:text-[#0F2A35] hover:underline transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      {/* Giant Bottom Watermark Wordmark ("open hours") matching reference */}
      <div className="w-full flex justify-center overflow-hidden -mb-6 sm:-mb-12 md:-mb-16 select-none pointer-events-none">
        <span
          className="font-extrabold tracking-tighter leading-none text-white/35 block whitespace-nowrap"
          style={{
            fontSize: 'clamp(5rem, 17vw, 20rem)',
            transform: 'translateY(12%)',
          }}
        >
          open hours
        </span>
      </div>
    </footer>
  );
}
