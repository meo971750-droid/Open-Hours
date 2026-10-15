import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Facebook, ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/Container';
import Logo from '../components/Logo';
import { FOOTER_CONTENT } from '../content';
import { setConsent } from '../lib/consent';
import { CONFIG } from '../config';

interface FooterProps {
  onNavigatePage?: (page: 'home' | 'privacy' | 'cookies' | 'terms') => void;
  currentPage?: string;
}

interface LetterDef {
  char: string;
  weight: number;
  x: number;
  hasDot?: boolean;
}

const WORDMARK_LETTERS: LetterDef[] = [
  { char: 'O', weight: 300, x: 12 },
  { char: 'p', weight: 300, x: 126 },
  { char: 'e', weight: 300, x: 224 },
  { char: 'n', weight: 300, x: 318 },
  { char: 'H', weight: 700, x: 428 },
  { char: 'o', weight: 700, x: 556, hasDot: true },
  { char: 'u', weight: 700, x: 672 },
  { char: 'r', weight: 700, x: 784 },
  { char: 's', weight: 700, x: 872 },
];

export default function Footer({ onNavigatePage, currentPage }: FooterProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="w-full bg-white pt-16 sm:pt-20 select-none"
      style={{
        paddingBottom: 'calc(44px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <Container>
        {/* Top Area: Logo, tagline, and link columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[rgba(15,42,53,0.08)]">
          {/* Brand info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <a
              href="/"
              onClick={handleLogoClick}
              className="mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] rounded-sm cursor-pointer"
              aria-label="Open Hours Home"
            >
              <Logo size="lg" />
            </a>
            <p className="text-[15px] leading-relaxed text-[#5E6F77] max-w-sm mb-6">
              {FOOTER_CONTENT.tagline}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={FOOTER_CONTENT.columns[2].links[1].href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Open Hours on LinkedIn"
                className="w-10 h-10 rounded-full bg-[#EEF3F4] text-[#0F2A35] flex items-center justify-center hover:bg-[#DCE9EC] hover:text-[#1E4A5C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Open Hours on Facebook"
                className="w-10 h-10 rounded-full bg-[#EEF3F4] text-[#0F2A35] flex items-center justify-center hover:bg-[#DCE9EC] hover:text-[#1E4A5C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C]"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_CONTENT.columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#0F2A35] mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[14px] text-[#5E6F77] hover:text-[#0F2A35] transition-colors inline-flex items-center gap-1 group"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className="text-[14px] text-[#5E6F77] hover:text-[#0F2A35] transition-colors inline-block"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Company line */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5E6F77]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()} {CONFIG.legalName ? CONFIG.legalName : CONFIG.studioName}. All rights reserved.
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => setConsent({ decided: false })}
              className="text-[#5E6F77] hover:text-[#0F2A35] underline cursor-pointer"
            >
              Cookie settings
            </button>
          </div>
          {CONFIG.companyAddress ? (
            <div>{CONFIG.companyAddress}</div>
          ) : null}
        </div>

        {/* FULL UN-CROPPED OpenHours Wordmark:
            - Spans full width of content container (max 1200px)
            - 32px (mobile) / 48px (desktop) space above
            - 44px + env(safe-area-inset-bottom) below
            - Entire word visible: every letter complete, including "p" descender and peach dot inside "o"
            - 40ms stagger per letter (transform and opacity only)
            - Static on prefers-reduced-motion
            - No negative margins, no translateY crops, no overflow: hidden clipping */}
        <div className="mt-8 sm:mt-12 w-full pt-2">
          <svg
            viewBox="0 0 990 180"
            className="w-full h-auto block"
            fill="none"
            aria-label="Open Hours wordmark"
          >
            <defs>
              <linearGradient id="footerWordmarkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E4A5C" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1E4A5C" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {WORDMARK_LETTERS.map((item, idx) => (
              <motion.g
                key={item.char + idx}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <text
                  x={item.x}
                  y={124}
                  fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
                  fontSize={138}
                  fontWeight={item.weight}
                  fill="url(#footerWordmarkGrad)"
                  stroke="rgba(30,74,92,0.10)"
                  strokeWidth={1}
                  letterSpacing="-0.03em"
                >
                  {item.char}
                </text>
                {item.hasDot && (
                  <circle
                    cx={614}
                    cy={90}
                    r={10.5}
                    fill="#E3B896"
                    fillOpacity={0.6}
                  />
                )}
              </motion.g>
            ))}
          </svg>
        </div>
      </Container>
    </footer>
  );
}
