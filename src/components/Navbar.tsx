import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { NAV_LINKS, CTA } from '../content';

interface NavbarProps {
  onOpenAudit: () => void;
}

export default function Navbar({ onOpenAudit }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    // After 40px, add glass blur & soft shadow
    setScrolled(latest > 40);

    // Hide when scrolling down, show when scrolling up
    if (latest > 120 && diff > 10) {
      setHidden(true);
    } else if (diff < -8 || latest <= 120) {
      setHidden(false);
    }
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

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
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -90, opacity: 0 },
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-0 right-0 z-40 px-6 md:px-10 max-w-[1200px] mx-auto pointer-events-none"
      >
        <div
          className={
            'pointer-events-auto w-full flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 ' +
            (scrolled
              ? 'bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(15,42,53,0.08)] border border-[rgba(15,42,53,0.08)]'
              : 'bg-white/95 border border-[rgba(15,42,53,0.05)] shadow-sm')
          }
        >
          {/* Zone 1: Logo Wordmark */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] rounded-md cursor-pointer"
            aria-label="Open Hours Home"
          >
            <Logo size="md" />
          </a>

          {/* Zone 2: Navigation Links (desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-[#5E6F77]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative py-1 text-[#5E6F77] hover:text-[#0F2A35] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] rounded-sm group cursor-pointer"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1E4A5C] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary CTA */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAudit}
              className="group relative inline-flex items-center gap-2 bg-[#0F2A35] text-white text-[14px] font-medium h-[42px] sm:h-[48px] px-4 sm:px-5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] focus-visible:ring-offset-2 cursor-pointer"
            >
              <span>{CTA.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#0F2A35] hover:bg-[#EEF3F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A5C] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 top-20 z-50 bg-white rounded-3xl p-6 shadow-2xl border border-[rgba(15,42,53,0.1)] md:hidden max-w-[420px] mx-auto pointer-events-auto"
          >
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider text-[#5E6F77] font-semibold px-2">
                Navigation
              </span>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="px-4 py-3 text-lg font-medium text-[#0F2A35] hover:bg-[#EEF3F4] rounded-xl transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-2 border-[rgba(15,42,53,0.08)]" />
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAudit();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0F2A35] text-white font-medium h-[48px] rounded-full shadow-md cursor-pointer"
              >
                <span>{CTA.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
