import React from 'react';
import PageHeader from '../components/PageHeader';
import About from '../sections/About';
import VideoReviewSection from '../sections/VideoReviewSection';
import FinalCTA from '../sections/FinalCTA';

interface AboutPageProps {
  onOpenAudit: () => void;
}

export default function AboutPage({ onOpenAudit }: AboutPageProps) {
  return (
    <div className="w-full">
      {/* 1. PageHeader */}
      <PageHeader
        pill="About"
        h1="A small studio, openly based in Bangladesh"
        sub="Working in Irish and Maltese hours. No middlemen, no jargon."
      />

      {/* 2. The About section (heading is "Who we are") */}
      <About />

      {/* 3. Video review (id="video-review") */}
      <VideoReviewSection onOpenAudit={onOpenAudit} />

      {/* 4. Final CTA */}
      <FinalCTA onOpenAudit={onOpenAudit} />
    </div>
  );
}
