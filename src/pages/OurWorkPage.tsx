import React from 'react';
import PageHeader from '../components/PageHeader';
import DesignsSlider from '../sections/DesignsSlider';
import ConceptStudies from '../sections/ConceptStudies';
import { TradeName } from '../content';

interface OurWorkPageProps {
  onOpenAudit: (email?: string, trade?: string) => void;
}

export default function OurWorkPage({ onOpenAudit }: OurWorkPageProps) {
  return (
    <div className="w-full">
      {/* 1. PageHeader */}
      <PageHeader
        pill="Our work"
        h1="Recent trade websites and concept studies"
        sub="Real client projects and concept studies for Irish and Maltese building trades."
      />

      {/* 2. Polaroid carousel (id="designs-gallery") */}
      <DesignsSlider
        id="designs-gallery"
        onOpenAudit={(trade?: TradeName) => onOpenAudit(undefined, trade)}
      />

      {/* 3. Concept studies (id="concept-studies") */}
      <ConceptStudies
        onOpenAudit={(trade?: TradeName) => onOpenAudit(undefined, trade)}
      />
    </div>
  );
}
