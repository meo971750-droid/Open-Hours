import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { OH_DUR, OH_EASE } from './lib/motion';
import Navbar from './components/Navbar';
import HeroGrew from './sections/HeroGrew';
import ExpandingCards from './sections/ExpandingCards';
import ClientsLoveUs from './sections/ClientsLoveUs';
import DeliverScroll from './sections/DeliverScroll';
import BestInBento from './sections/BestInBento';
import CustomersResults from './sections/CustomersResults';
import OurWorkMarquee from './sections/OurWorkMarquee';
import FrameworkTimeline from './sections/FrameworkTimeline';
import BuiltFast from './sections/BuiltFast';
import Pricing from './sections/Pricing';
import About from './sections/About';
import FAQ from './sections/FAQ';
import WhiteLabel from './sections/WhiteLabel';
import FinalCTA from './sections/FinalCTA';
import Footer from './sections/Footer';
import CookieBanner from './components/CookieBanner';
import AuditModal from './components/AuditModal';
import StickyBottomBar from './components/StickyBottomBar';
import BackToTop from './components/BackToTop';
import FloatingQuestionPill from './components/FloatingQuestionPill';
import SeoManager from './components/SeoManager';
import LegalPage from './pages/LegalPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'cookies' | 'terms'>('home');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditEmail, setAuditEmail] = useState('');
  const [auditTrade, setAuditTrade] = useState<string | undefined>(undefined);
  const [auditVariant, setAuditVariant] = useState<'page' | 'feature'>('page');
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();

  // Reset scroll position smoothly/immediately on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage, location.pathname]);

  // Lightweight desktop-only pointer tracking for dark card radial spotlight & magnetic CTAs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    let activeSpot: HTMLElement | null = null;
    let activeMag: HTMLElement | null = null;
    let rafId = 0;
    let latestEvent: PointerEvent | null = null;

    const flush = () => {
      rafId = 0;
      const e = latestEvent;
      if (!e) return;

      const target = e.target as HTMLElement | null;
      const spotEl = target?.closest<HTMLElement>('[data-spotlight]') || null;
      if (activeSpot && activeSpot !== spotEl) {
        activeSpot.style.removeProperty('--mx');
        activeSpot.style.removeProperty('--my');
      }
      activeSpot = spotEl;
      if (activeSpot) {
        const rect = activeSpot.getBoundingClientRect();
        activeSpot.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(1)}px`);
        activeSpot.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(1)}px`);
      }

      const magEl = target?.closest<HTMLElement>('.oh-magnetic') || null;
      if (activeMag && activeMag !== magEl) {
        activeMag.style.setProperty('--mag-x', '0px');
        activeMag.style.setProperty('--mag-y', '0px');
      }
      activeMag = magEl;
      if (activeMag) {
        const rect = activeMag.getBoundingClientRect();
        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        const clampedX = Math.max(-6, Math.min(6, relX * 6));
        const clampedY = Math.max(-6, Math.min(6, relY * 6));
        activeMag.style.setProperty('--mag-x', `${clampedX.toFixed(1)}px`);
        activeMag.style.setProperty('--mag-y', `${clampedY.toFixed(1)}px`);
      }
    };

    const handleMove = (e: PointerEvent) => {
      latestEvent = e;
      if (!rafId) rafId = window.requestAnimationFrame(flush);
    };

    const handleLeave = () => {
      if (activeMag) {
        activeMag.style.setProperty('--mag-x', '0px');
        activeMag.style.setProperty('--mag-y', '0px');
        activeMag = null;
      }
      if (activeSpot) {
        activeSpot.style.removeProperty('--mx');
        activeSpot.style.removeProperty('--my');
        activeSpot = null;
      }
    };

    document.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleOpenAudit = (
    email?: string,
    trade?: string,
    variant: 'page' | 'feature' = 'page'
  ) => {
    if (email) {
      setAuditEmail(email);
    }
    if (trade) {
      setAuditTrade(trade);
    }
    setAuditVariant(variant);
    setIsAuditModalOpen(true);
  };

  const handleCloseAudit = () => {
    setIsAuditModalOpen(false);
  };

  const handleNavigate = (page: 'home' | 'privacy' | 'cookies' | 'terms') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const SECTIONS = [
    {
      id: 'hero',
      component: (
        <HeroGrew
          onOpenAudit={(email, trade) => handleOpenAudit(email, trade)}
          onOpenPrivacy={() => handleNavigate('privacy')}
        />
      ),
    },
    {
      id: 'services',
      component: <ExpandingCards onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'proof',
      component: <ClientsLoveUs onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'deliver',
      component: <DeliverScroll onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'best-in',
      component: <BestInBento onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'reviews',
      component: <CustomersResults onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'work',
      component: <OurWorkMarquee onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'framework',
      component: <FrameworkTimeline onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'built-fast',
      component: <BuiltFast onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'pricing',
      component: <Pricing onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'contact',
      component: <About onOpenPrivacy={() => handleNavigate('privacy')} />,
    },
    {
      id: 'faq',
      component: <FAQ />,
    },
    {
      id: 'white-label',
      component: <WhiteLabel onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'final-cta',
      component: (
        <FinalCTA
          onOpenAudit={() => handleOpenAudit()}
          onOpenPrivacy={() => handleNavigate('privacy')}
        />
      ),
    },
    {
      id: 'footer',
      component: (
        <Footer
          onNavigatePage={handleNavigate}
          currentPage={currentPage}
          onOpenAudit={() => handleOpenAudit()}
        />
      ),
    },
  ];

  const routeTransitionKey = `${currentPage}:${location.pathname}`;

  return (
    <MotionConfig reducedMotion="user">
      <SeoManager currentPage={currentPage} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#0F4A3E] focus:text-white focus:text-[13px] focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-[#F3F5F3] text-[#0B1B22] overflow-x-clip">
        {/* Floating Header / Navbar */}
        <Navbar
          onOpenAudit={() => handleOpenAudit()}
        />

        <AnimatePresence mode="wait">
          {currentPage !== 'home' ? (
            <motion.div
              key={routeTransitionKey}
              id="main-content"
              tabIndex={-1}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : OH_DUR.fast, ease: OH_EASE }}
              className="outline-none"
            >
              <LegalPage
                type={currentPage}
                onBack={() => handleNavigate('home')}
              />
            </motion.div>
          ) : (
            /* Full-Bleed Page Container */
            <motion.main
              key={routeTransitionKey}
              id="main-content"
              tabIndex={-1}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : OH_DUR.fast, ease: OH_EASE }}
              className="w-full bg-[#F3F5F3] outline-none"
            >
              {SECTIONS.map((sec) => (
                <React.Fragment key={sec.id}>{sec.component}</React.Fragment>
              ))}
            </motion.main>
          )}
        </AnimatePresence>

      {/* Sticky Bottom Bar for Mobile Visitors */}
      {currentPage === 'home' && (
        <StickyBottomBar onOpenAudit={() => handleOpenAudit()} />
      )}

      {/* Interactive Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={handleCloseAudit}
        onOpenPrivacy={() => {
          handleCloseAudit();
          handleNavigate('privacy');
        }}
        initialEmail={auditEmail}
        initialTrade={auditTrade}
        variant={auditVariant}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenCookiesPage={() => handleNavigate('cookies')} />

      {/* Floating Question Pill & Back to Top Button */}
      {currentPage === 'home' && (
        <FloatingQuestionPill
          isModalOpen={isAuditModalOpen}
          onOpenPrivacy={() => handleNavigate('privacy')}
        />
      )}
      <BackToTop />
      </div>
    </MotionConfig>
  );
}
