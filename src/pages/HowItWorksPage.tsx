import React from 'react';
import PageHeader from '../components/PageHeader';
import OurProcess from '../sections/OurProcess';
import SampleAudit from '../sections/SampleAudit';
import NeedFromYou from '../sections/NeedFromYou';
import FinalCTA from '../sections/FinalCTA';

interface HowItWorksPageProps {
  onOpenAudit: () => void;
}

export default function HowItWorksPage({ onOpenAudit }: HowItWorksPageProps) {
  return (
    <div className="w-full">
      {/* 1. PageHeader */}
      <PageHeader
        pill="How it works"
        h1="How we build your trade website"
        sub="The complete process from first consultation to live launch."
      />

      {/* 2. "The Way We Deliver" pinned Process section (id="process") */}
      <OurProcess />

      {/* 4. Sample audit section (id="sample-audit") */}
      <SampleAudit onOpenAudit={onOpenAudit} />

      {/* 5. NeedFromYou (new) */}
      <NeedFromYou />

      {/* 6. Final CTA */}
      <FinalCTA onOpenAudit={onOpenAudit} />
    </div>
  );
}
