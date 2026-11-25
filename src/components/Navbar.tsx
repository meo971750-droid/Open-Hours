import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { CTA } from '../content';
import { CONFIG } from '../config';
import { subscribeScroll } from '../lib/scrollHub';

const NAV_LINKS = [
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'proof', label: 'Results', href: '#proof' },
  { id: 'deliver', label: 'How We Deliver', href: '#deliver' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

const SECTION_GROUPS: Array<{ navId: string; ids: string[] }> = [
  { navId: 'services', ids: ['services'] },
  { navId: 'proof', ids: ['proof'] },
  { navId: 'deliver', ids: ['deliver', 'best-in', 'reviews'] },
  { navId: 'work', ids: ['work', 'framework', 'built-fast', 'pricing'] },
  { navId: 'faq', ids: ['faq', 'white-label', 'final-cta'] },
];

interface NavbarProps {
  onOpenAudit: () => void;
}

export default function Navbar({ onOpenAudit }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    return subscribeScroll(({ scrollY, winHeight, scrollProgress, getBounds }) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${scrollProgress.toFixed(4)})`;
      }

      const nextScrolled = scrollY > 40;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

      const heroBounds = getBounds('hero');
      const nextPastHero = heroBounds
        ? heroBounds.bottom - scrollY <= 96
        : scrollY > 420;
      setPastHero((prev) => (prev === nextPastHero ? prev : nextPastHero));

      if (scrollY < 220) {
        setActiveSection((prev) => (prev === '' ? prev : ''));
        return;
      }

      const anchorDocY = scrollY + Math.max(120, Math.round(winHeight * 0.34));
      const contactBounds = getBounds('contact');
      if (contactBounds && anchorDocY >= contactBounds.top && anchorDocY <= contactBounds.bottom) {
        setActiveSection((prev) => (prev === '' ? prev : ''));
        return;
      }

      let matched = '';
      for (const group of SECTION_GROUPS) {
        for (const id of group.ids) {
          const b = getBounds(id);
          if (b && anchorDocY >= b.top && anchorDocY <= b.bottom) {
            matched = group.navId;
            break;
          }
        }
        if (matched) break;
      }

      if (matched) {
        setActiveSection((prev) => (prev === matched ? prev : matched));
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id?: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (id) setActiveSection(id);

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
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (CONFIG.bookingUrl && CONFIG.bookingUrl.startsWith('http')) {
      window.location.href = CONFIG.bookingUrl;
    } else {
      onOpenAudit();
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection('');
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ctaLabel = CONFIG.hero?.ctaLabel || CTA.label;

  return (
    <>
      {/* 2px Brand-Green Scroll-Progress Line at Very Top (DOM-ref scaleX, zero React re-renders) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none"
        aria-hidden="true"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left will-change-transform"
          style={{
            background: 'linear-gradient(90deg, #0F4A3E 0%, #14735A 65%, #1E9E6A 100%)',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Fixed Centred Frosted Glass Nav Pill (~63vw width, ~75px height on desktop) */}
      <header className="oh-hero-enter oh-hero-delay-nav fixed top-[14px] lg:top-[20px] left-0 right-0 z-40 px-3 sm:px-6 lg:px-0 flex justify-center pointer-events-none">
        <div
          className={
            'pointer-events-auto w-full lg:w-[63vw] lg:min-w-[820px] lg:max-w-[1180px] h-[60px] lg:h-[75px] rounded-full flex items-center justify-between gap-3 lg:gap-5 px-4 sm:px-6 lg:pl-7 lg:pr-3 transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ' +
            (scrolled
              ? 'border border-white shadow-[0_14px_38px_-10px_rgba(11,27,34,0.16)]'
              : 'border border-white shadow-[0_12px_34px_-10px_rgba(11,27,34,0.10)]')
          }
          style={{
            backgroundColor: pastHero
              ? scrolled
                ? 'rgba(255, 255, 255, 0.96)'
                : 'rgba(255, 255, 255, 0.92)'
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: pastHero ? 'blur(18px)' : 'none',
            WebkitBackdropFilter: pastHero ? 'blur(18px)' : 'none',
          }}
        >
          {/* Left: Open Hours Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center shrink-0 rounded-md cursor-pointer [&_span]:text-[#0B1B22]"
            aria-label="Open Hours Home"
          >
            <Logo size="md" />
          </a>

          {/* Centre: Links (~18px medium, near-black) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 text-[15px] xl:text-[17px] 2xl:text-[18px] font-medium text-[#0B1B22]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={
                    'relative py-1 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] rounded-sm group cursor-pointer whitespace-nowrap shrink-0 ' +
                    (isActive ? 'text-[#0F4A3E] font-semibold' : 'text-[#0B1B22]/90 hover:text-[#14624F]')
                  }
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={
                      'absolute bottom-0 left-0 w-full h-[2px] bg-[#14624F] origin-left transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ' +
                      (isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')
                    }
                  />
                </a>
              );
            })}
          </nav>

          {/* Right: Deep-Green Gradient Pill CTA + Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCtaClick}
              className="hidden lg:inline-flex items-center justify-center h-[52px] px-7 rounded-full text-white text-[16px] xl:text-[17px] font-medium whitespace-nowrap cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #0F4A3E 0%, #14624F 65%, #14735A 100%)',
                boxShadow:
                  'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 24px -6px rgba(63, 209, 165, 0.45)',
              }}
            >
              {ctaLabel}
            </button>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2.5 rounded-full text-[#0B1B22] hover:bg-[#DDF4EA]/60 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98] cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Width Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          className="oh-slide-down-in fixed inset-x-3 top-[82px] z-50 rounded-[24px] p-5 shadow-[0_24px_60px_-14px_rgba(11,27,34,0.22)] border border-white lg:hidden pointer-events-auto"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={
                    'px-4 py-3 text-[17px] font-medium rounded-2xl transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer ' +
                    (isActive
                      ? 'bg-[#DDF4EA] text-[#0F4A3E] font-semibold'
                      : 'text-[#0B1B22] hover:bg-[#F3F5F3]')
                  }
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-3 mt-1 border-t border-[#0B1B22]/8">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full h-[50px] rounded-full text-white text-[16px] font-medium flex items-center justify-center cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #0F4A3E 0%, #14624F 65%, #14735A 100%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 24px -6px rgba(63, 209, 165, 0.45)',
                }}
              >
                {ctaLabel}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
