import React from 'react';
import PageHeader from '../components/PageHeader';
import PackageGuide from '../sections/PackageGuide';
import Pricing from '../sections/Pricing';
import WhatYouGet from '../sections/WhatYouGet';
import WhyOpenHours from '../sections/WhyOpenHours';
import Compare from '../sections/Compare';
import FAQ from '../sections/FAQ';
import FinalCTA from '../sections/FinalCTA';

interface PackagesPageProps {
  onOpenAudit: () => void;
}

export default function PackagesPage({ onOpenAudit }: PackagesPageProps) {
  return (
    <div className="w-full">
      {/* 1. PageHeader */}
      <PageHeader
        pill="Packages"
        h1="Packages and pricing"
        sub="Start with a 1-page website at no cost, then grow only if it makes sense."
      />

      {/* 2. PackageGuide (new) */}
      <PackageGuide />

      {/* 3. Pricing (id="pricing") */}
      <Pricing onOpenAudit={onOpenAudit} />

      {/* 4. "Included in every trade build" (id="included") */}
      <WhatYouGet />

      {/* 5. Bento (id="why-open-hours") */}
      <WhyOpenHours />

      {/* 6. Comparison (id="compare") */}
      <Compare onOpenAudit={onOpenAudit} />

      {/* 7. Full FAQ (id="faq") */}
      <FAQ />

      {/* 8. Final CTA */}
      <FinalCTA onOpenAudit={onOpenAudit} />
    </div>
  );
}
