import React from 'react';

interface AccentProps {
  children: React.ReactNode;
  className?: string;
}

export default function Accent({ children, className = '' }: AccentProps) {
  return (
    <em
      className={`font-serif italic font-normal tracking-[-0.01em] ${className}`}
      style={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: '1.08em',
        letterSpacing: '-0.01em',
        color: 'inherit',
      }}
    >
      {children}
    </em>
  );
}
