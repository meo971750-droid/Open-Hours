import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroGrew from './sections/HeroGrew';
import LazySection, { preloadSectionAndNext } from './components/LazySection';
import CookieBanner from './components/CookieBanner';
import StickyBottomBar from './components/StickyBottomBar';
import BackToTop from './components/BackToTop';
import FloatingQuestionPill from './components/FloatingQuestionPill';
import SeoManager from './components/SeoManager';
import { config } from './config';

// Route & modal chunks loaded strictly on interaction
const AuditModal = React.lazy(() => import('./components/AuditModal'));
const LegalPage = React.lazy(() => import('./pages/LegalPage'));

// Below-hero section loaders (preloaded 1200px ahead by LazySection)
const loadServices = () => import('./sections/ExpandingCards');
const loadProof = () => import('./sections/ClientsLoveUs');
const loadDeliver = () => import('./sections/DeliverScroll');
const loadBestIn = () => import('./sections/BestInBento');
const loadReviews = () => import('./sections/CustomersResults');
const loadWork = () => import('./sections/OurWorkMarquee');
const loadFramework = () => import('./sections/FrameworkTimeline');
const loadBuiltFast = () => import('./sections/BuiltFast');
const loadPricing = () => import('./sections/Pricing');
const loadAbout = () => import('./sections/About');
const loadFaq = () => import('./sections/FAQ');
const loadWhiteLabel = () => import('./sections/WhiteLabel');
const loadFinalCta = () => import('./sections/FinalCTA');
const loadFooter = () => import('./sections/Footer');

const ExpandingCards = React.lazy(loadServices);
const ClientsLoveUs = React.lazy(loadProof);
const DeliverScroll = React.lazy(loadDeliver);
const BestInBento = React.lazy(loadBestIn);
const CustomersResults = React.lazy(loadReviews);
const OurWorkMarquee = React.lazy(loadWork);
const FrameworkTimeline = React.lazy(loadFramework);
const BuiltFast = React.lazy(loadBuiltFast);
const Pricing = React.lazy(loadPricing);
const About = React.lazy(loadAbout);
const FAQ = React.lazy(loadFaq);
const WhiteLabel = React.lazy(loadWhiteLabel);
const FinalCTA = React.lazy(loadFinalCta);
const Footer = React.lazy(loadFooter);

const PROOF_FIRST_IMAGES = [
  {
    src: 'https://i.ibb.co.com/VcbcTXH9/ac6245a6-13a2-4716-bdfa-79220b85865b.png',
    type: 'responsive' as const,
    widths: [480],
    sizes: '480px',
  },
  ...(config.testimonials?.[0]?.photo
    ? [{ src: config.testimonials[0].photo, type: 'avatar' as const }]
    : []),
];

const BEST_IN_FIRST_IMAGES = (config.portfolio || [])
  .slice(0, 2)
  .filter((item) => Boolean(item.image))
  .map((item) => ({
    src: item.image,
    type: 'responsive' as const,
    widths: [320, 640],
    sizes: '260px',
  }));

const WORK_FIRST_IMAGES = (config.work?.rows?.[0]?.items || [])
  .slice(0, 2)
  .filter((item) => Boolean(item.poster))
  .map((item) => ({
    src: item.poster!,
    type: 'responsive' as const,
    widths: [640, 960],
    sizes: '(max-width: 1023px) 80vw, 36vw',
  }));

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'cookies' | 'terms'>('home');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [hasOpenedAuditModal, setHasOpenedAuditModal] = useState(false);
  const [auditEmail, setAuditEmail] = useState('');
  const [auditTrade, setAuditTrade] = useState<string | undefined>(undefined);
  const [auditVariant, setAuditVariant] = useState<'page' | 'feature'>('page');
  const location = useLocation();

  // Reset scroll position immediately on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage, location.pathname]);

  // Warm the first below-hero section chunk on idle once the above-fold hero is painted
  useEffect(() => {
    if (currentPage !== 'home') return;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleId: number | undefined;
    let timerId: number | undefined;
    const warm = () => preloadSectionAndNext('services', 'proof');

    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(warm, { timeout: 1200 });
    } else {
      timerId = window.setTimeout(warm, 200);
    }

    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [currentPage]);

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

      const target = e.target instanceof Element ? e.target : null;
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
      const target = e.target instanceof Element ? e.target : null;
      const hitsInteractive =
        Boolean(activeSpot || activeMag) ||
        Boolean(target?.closest('[data-spotlight], .oh-magnetic'));
      if (!hitsInteractive) return;
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
    if (email) setAuditEmail(email);
    if (trade) setAuditTrade(trade);
    setAuditVariant(variant);
    setHasOpenedAuditModal(true);
    setIsAuditModalOpen(true);
  };

  const handleCloseAudit = () => {
    setIsAuditModalOpen(false);
  };

  const handleNavigate = (page: 'home' | 'privacy' | 'cookies' | 'terms') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const routeTransitionKey = `${currentPage}:${location.pathname}`;

  return (
    <>
      <SeoManager currentPage={currentPage} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#0F4A3E] focus:text-white focus:text-[13px] focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-[#EEF3F0] text-[#0B1B22] overflow-x-clip">
        <Navbar onOpenAudit={() => handleOpenAudit()} />

        {currentPage !== 'home' ? (
          <div key={routeTransitionKey} id="main-content" tabIndex={-1} className="oh-fade-in outline-none">
            <Suspense fallback={<div className="min-h-screen bg-[#EEF3F0]" />}>
              <LegalPage type={currentPage} onBack={() => handleNavigate('home')} />
            </Suspense>
          </div>
        ) : (
          <main key={routeTransitionKey} id="main-content" tabIndex={-1} className="w-full outline-none">
            <HeroGrew
              onOpenAudit={(email, trade) => handleOpenAudit(email, trade)}
              onOpenPrivacy={() => handleNavigate('privacy')}
            />

            <LazySection
              id="services"
              nextId="proof"
              loadChunk={loadServices}
              placeholderClassName="min-h-[1298px] lg:min-h-[1135px] bg-[#F3F5F3]"
            >
              <ExpandingCards onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="proof"
              nextId="deliver"
              loadChunk={loadProof}
              firstImages={PROOF_FIRST_IMAGES}
              placeholderClassName="min-h-[3204px] lg:min-h-[1679px] bg-[#E9ECEA]"
            >
              <ClientsLoveUs onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="deliver"
              nextId="best-in"
              loadChunk={loadDeliver}
              placeholderClassName="min-h-[4520px] lg:min-h-[4527px] bg-[#F3F5F3]"
            >
              <DeliverScroll onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="best-in"
              nextId="reviews"
              loadChunk={loadBestIn}
              firstImages={BEST_IN_FIRST_IMAGES}
              placeholderClassName="min-h-[2464px] lg:min-h-[1350px] bg-[#E9ECEA]"
            >
              <BestInBento onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="reviews"
              nextId="work"
              loadChunk={loadReviews}
              placeholderClassName="min-h-[776px] lg:min-h-[922px] bg-[#050E0D]"
            >
              <CustomersResults onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="work"
              nextId="framework"
              loadChunk={loadWork}
              firstImages={WORK_FIRST_IMAGES}
              placeholderClassName="min-h-[835px] lg:min-h-[1214px] bg-[#E9ECEA]"
            >
              <OurWorkMarquee onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="framework"
              nextId="built-fast"
              loadChunk={loadFramework}
              placeholderClassName="min-h-[2211px] lg:min-h-[3009px] bg-[#F3F5F3]"
            >
              <FrameworkTimeline onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="built-fast"
              nextId="pricing"
              loadChunk={loadBuiltFast}
              placeholderClassName="min-h-[1906px] lg:min-h-[1166px] bg-[#050E0D]"
            >
              <BuiltFast onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="pricing"
              nextId="contact"
              loadChunk={loadPricing}
              placeholderClassName="min-h-[8772px] lg:min-h-[4838px] bg-[#F3F5F3]"
            >
              <Pricing onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="contact"
              nextId="faq"
              loadChunk={loadAbout}
              placeholderClassName="min-h-[1628px] lg:min-h-[1170px] bg-[#050E0D]"
            >
              <About onOpenPrivacy={() => handleNavigate('privacy')} />
            </LazySection>

            <LazySection
              id="faq"
              nextId="white-label"
              loadChunk={loadFaq}
              placeholderClassName="min-h-[1360px] lg:min-h-[1440px] bg-[#F3F5F3]"
            >
              <FAQ />
            </LazySection>

            <LazySection
              id="white-label"
              nextId="final-cta"
              loadChunk={loadWhiteLabel}
              firstImages={BEST_IN_FIRST_IMAGES}
              placeholderClassName="min-h-[909px] lg:min-h-[860px] bg-[#F3F5F3]"
            >
              <WhiteLabel onOpenAudit={() => handleOpenAudit()} />
            </LazySection>

            <LazySection
              id="final-cta"
              nextId="footer"
              loadChunk={loadFinalCta}
              placeholderClassName="min-h-[1087px] lg:min-h-[976px] bg-[#050E0D]"
            >
              <FinalCTA
                onOpenAudit={() => handleOpenAudit()}
                onOpenPrivacy={() => handleNavigate('privacy')}
              />
            </LazySection>

            <LazySection
              id="footer"
              loadChunk={loadFooter}
              placeholderClassName="min-h-[488px] lg:min-h-[648px] bg-[#050E0D]"
            >
              <Footer
                onNavigatePage={handleNavigate}
                currentPage={currentPage}
                onOpenAudit={() => handleOpenAudit()}
              />
            </LazySection>
          </main>
        )}

        {currentPage === 'home' && (
          <StickyBottomBar onOpenAudit={() => handleOpenAudit()} />
        )}

        {(hasOpenedAuditModal || isAuditModalOpen) && (
          <Suspense fallback={null}>
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
          </Suspense>
        )}

        <CookieBanner onOpenCookiesPage={() => handleNavigate('cookies')} />

        {currentPage === 'home' && (
          <FloatingQuestionPill
            isModalOpen={isAuditModalOpen}
            onOpenPrivacy={() => handleNavigate('privacy')}
          />
        )}
        <BackToTop />
      </div>
    </>
  );
}
