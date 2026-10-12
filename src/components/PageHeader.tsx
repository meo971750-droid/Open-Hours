import React from 'react';
import Container from './Container';

interface PageHeaderProps {
  pill?: string;
  h1: React.ReactNode;
  sub?: string;
  className?: string;
}

export default function PageHeader({ pill, h1, sub, className = '' }: PageHeaderProps) {
  return (
    <header className={`w-full bg-[#FFFFFF] pt-32 sm:pt-40 pb-12 sm:pb-16 text-center ${className}`}>
      <Container>
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          {pill && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[rgba(15,42,53,0.08)] shadow-xs mb-4 text-[12px] sm:text-[13px] font-semibold text-[#1E4A5C] tracking-wide uppercase">
              <span>{pill}</span>
            </div>
          )}
          <h1 className="text-[32px] sm:text-[46px] md:text-[54px] font-normal tracking-[-0.03em] leading-[1.08] text-[#0F2A35] mb-4">
            {h1}
          </h1>
          {sub && (
            <p className="text-[16px] sm:text-[18px] text-[#5E6F77] max-w-2xl leading-relaxed">
              {sub}
            </p>
          )}
        </div>
      </Container>
    </header>
  );
}
