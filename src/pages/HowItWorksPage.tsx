import React from 'react';
import PageHeader from '../components/PageHeader';
import HowItWorks from '../sections/HowItWorks';
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
        sub="From first look to live site, step by step."
      />

      {/* 2. The slim timeline (id="how-it-works") */}
      <HowItWorks />

      {/* 3. "The Way We Deliver" pinned Process section (id="process") */}
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
