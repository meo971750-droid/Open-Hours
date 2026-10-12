import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={'shrink-0 ' + className}
      aria-label="Open Hours symbol"
    >
      {/* Outer rounded container */}
      <rect width="32" height="32" rx="8" fill="#1E4A5C" />
      {/* The letter 'o' circle */}
      <circle cx="16" cy="16" r="6.5" stroke="#FFFFFF" strokeWidth="2.5" />
      {/* Peach inner dot */}
      <circle cx="16" cy="16" r="2.2" fill="#E3B896" />
    </svg>
  );
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={'inline-flex items-center gap-2 select-none tracking-tight ' + className}>
      <span className={'font-heading ' + textSizes[size] + ' text-[#1E4A5C] flex items-center leading-none'}>
        <span className="font-light tracking-tight mr-0.5">Open</span>
        <span className="font-bold tracking-tight inline-flex items-center">
          H
          <span className="relative inline-flex items-center justify-center mx-[1px]">
            <span className="inline-block w-[0.62em] h-[0.62em] rounded-full border-[2.2px] border-[#1E4A5C]" />
            <span className="absolute w-[0.24em] h-[0.24em] rounded-full bg-[#E3B896]" />
          </span>
          urs
        </span>
      </span>
    </div>
  );
}
