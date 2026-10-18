import React from 'react';
import Hero from '../sections/Hero';
import DesignsSlider from '../sections/DesignsSlider';
import WhatItDoes from '../sections/WhatItDoes';
import PackagesSummary from '../sections/PackagesSummary';
import SenjaEmbed from '../components/SenjaEmbed';
import FAQShort from '../sections/FAQShort';
import FinalCTA from '../sections/FinalCTA';
import { TradeName } from '../content';

interface HomePageProps {
  onOpenAudit: (email?: string, trade?: string) => void;
  onOpenPrivacy: () => void;
}

export default function HomePage({ onOpenAudit, onOpenPrivacy }: HomePageProps) {
  return (
    <div className="w-full">
      {/* 1. Hero with mockup */}
      <Hero
        onOpenPrivacy={onOpenPrivacy}
        onOpenAudit={(email) => onOpenAudit(email)}
      />

      {/* 2. Our designs polaroid (id="designs") */}
      <DesignsSlider
        id="designs"
        onOpenAudit={(trade?: TradeName) => onOpenAudit(undefined, trade)}
      />

      {/* 3. Your website handles the first reply (id="what-it-does") */}
      <WhatItDoes />

      {/* 4. PackagesSummary (new) */}
      <PackagesSummary />

      {/* 6. Reviews (Senja, id="reviews") */}
      <SenjaEmbed onOpenPrivacy={onOpenPrivacy} />

      {/* 7. FAQ SHORT (id="faq-short") */}
      <FAQShort />

      {/* 8. Final CTA panel (from the Layout / page) */}
      <FinalCTA onOpenAudit={() => onOpenAudit()} />
    </div>
  );
}
