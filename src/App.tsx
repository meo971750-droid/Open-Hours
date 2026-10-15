import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import DesignsSlider from './sections/DesignsSlider';
import WhatItDoes from './sections/WhatItDoes';
import ConceptStudies from './sections/ConceptStudies';
import VideoReviewSection from './sections/VideoReviewSection';
import HowItWorks from './sections/HowItWorks';
import OurProcess from './sections/OurProcess';
import SampleAudit from './sections/SampleAudit';
import WhatYouGet from './sections/WhatYouGet';
import BuiltFast from './sections/BuiltFast';
import WhyOpenHours from './sections/WhyOpenHours';
import Compare from './sections/Compare';
import Pricing from './sections/Pricing';
import InteractiveFeatures from './sections/InteractiveFeatures';
import SenjaEmbed from './components/SenjaEmbed';
import About from './sections/About';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import CookieBanner from './components/CookieBanner';
import AuditModal from './components/AuditModal';
import StickyBottomBar from './components/StickyBottomBar';
import LegalPage from './pages/LegalPage';
import { TradeName } from './content';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'cookies' | 'terms'>('home');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditEmail, setAuditEmail] = useState('');
  const [auditTrade, setAuditTrade] = useState<string | undefined>(undefined);

  const [auditVariant, setAuditVariant] = useState<'page' | 'feature'>('page');

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section order according to CHANGE REQUEST:
  // 1 Hero (including the mockup and its title block)
  // 2 "Our designs" (id="designs")
  // 3 "Your website handles the first reply" (id="what-it-does")
  // 4 [concept-studies: not built yet, render nothing; id reserved "concept-studies"]
  // 5 "How it works" (id="how-it-works"), slim version
  // 6 "The Way We Deliver" pinned section (id="process")
  // 7 [sample-audit: not built yet, render nothing; id reserved "sample-audit"]
  // 8 "Included in every trade build" (id="included")
  // 9 "Always on, and yours to keep" bento (id="why-open-hours")
  // 10 "Interactive features" (id="interactive-features")
  // 11 Pricing (id="pricing")
  // 11 "Questions to ask any provider" (id="compare")
  // 12 Reviews (id="reviews")
  // 13 About ("A small studio, openly based in Bangladesh") (id="about")
  // 14 FAQ (id="faq")
  // 15 Final CTA (id="final-cta")
  // 16 Footer
  const SECTIONS = [
    {
      id: 'hero',
      component: (
        <Hero
          onOpenPrivacy={() => handleNavigate('privacy')}
          onOpenAudit={(email) => handleOpenAudit(email)}
        />
      ),
    },
    {
      id: 'designs',
      component: (
        <DesignsSlider onOpenAudit={(trade?: TradeName) => handleOpenAudit(undefined, trade)} />
      ),
    },
    {
      id: 'what-it-does',
      component: <WhatItDoes />,
    },
    {
      id: 'concept-studies',
      component: (
        <ConceptStudies onOpenAudit={(trade?: TradeName) => handleOpenAudit(undefined, trade)} />
      ),
    },
    {
      id: 'video-review',
      component: <VideoReviewSection onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'how-it-works',
      component: <HowItWorks />,
    },
    {
      id: 'process',
      component: <OurProcess />,
    },
    {
      id: 'included',
      component: <WhatYouGet />,
    },
    {
      id: 'built-fast',
      component: <BuiltFast onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'why-open-hours',
      component: <WhyOpenHours />,
    },
    {
      id: 'interactive-features',
      component: (
        <InteractiveFeatures
          onOpenAudit={(variant = 'feature') => handleOpenAudit(undefined, undefined, variant)}
        />
      ),
    },
    {
      id: 'pricing',
      component: <Pricing onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'sample-audit',
      component: <SampleAudit onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'compare',
      component: <Compare onOpenAudit={() => handleOpenAudit()} />,
    },
    {
      id: 'reviews',
      component: <SenjaEmbed onOpenPrivacy={() => handleNavigate('privacy')} />,
    },
    {
      id: 'faq',
      component: <FAQ />,
    },
    {
      id: 'about',
      component: <About onOpenPrivacy={() => handleNavigate('privacy')} />,
    },
    {
      id: 'footer',
      component: (
        <Footer
          onNavigatePage={handleNavigate}
          currentPage={currentPage}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F2A35] overflow-x-clip">
      {/* Floating Header / Navbar */}
      <Navbar
        onOpenAudit={() => handleOpenAudit()}
      />

      {currentPage !== 'home' ? (
        <LegalPage
          type={currentPage}
          onBack={() => handleNavigate('home')}
        />
      ) : (
        /* Full-Bleed Page Container */
        <main className="w-full bg-white">
          {SECTIONS.map((sec) => (
            <React.Fragment key={sec.id}>{sec.component}</React.Fragment>
          ))}
        </main>
      )}

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
    </div>
  );
}
