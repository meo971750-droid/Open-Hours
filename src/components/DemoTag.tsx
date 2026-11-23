import React from 'react';
import { config } from '../config';

export type DemoTagVariant = 'demo' | 'disclaimer' | 'concept' | 'concept-badge';
export type DemoTagTone = 'light' | 'dark' | 'warm' | 'inherit';

interface DemoTagProps {
  variant?: DemoTagVariant;
  tone?: DemoTagTone;
  text?: string;
  className?: string;
}

const TONE_COLOR: Record<DemoTagTone, string> = {
  light: 'text-[#0B1B22]',
  dark: 'text-white',
  warm: 'text-[#E3B896]',
  inherit: 'text-current',
};

/**
 * Single shared control for all demo tags, result disclaimers, and concept-design notes.
 * - `demo` (Tier B): Controlled by `config.ui.demoLabels` (defaults true). Renders quiet
 *   "Demo" text at 10-11px, regular case, 60% opacity, with no border.
 * - `disclaimer`: Short visible disclaimer under sample result views.
 * - `concept`: Short visible footer/caption note for concept designs (stays visible even if demoLabels is false).
 * - `concept-badge`: Small "Concept design" corner/modal tag for non-client portfolio items.
 */
export default function DemoTag({
  variant = 'demo',
  tone = 'light',
  text,
  className = '',
}: DemoTagProps) {
  const showDemoLabels = config.ui?.demoLabels ?? true;

  if (variant === 'demo') {
    if (!showDemoLabels) return null;
    return (
      <span
        className={`inline-block text-[10.5px] font-normal normal-case tracking-normal leading-none opacity-60 border-0 select-none pointer-events-none shrink-0 ${TONE_COLOR[tone]} ${className}`}
      >
        {text || 'Demo'}
      </span>
    );
  }

  if (variant === 'disclaimer') {
    return (
      <span className={className}>
        {text || "Demo data. Not a real client's results."}
      </span>
    );
  }

  if (variant === 'concept') {
    return (
      <span className={className}>
        {text || config.work?.conceptFooterNote || 'Sample layouts. Not client projects.'}
      </span>
    );
  }

  if (variant === 'concept-badge') {
    return (
      <span className={className}>
        {text || 'Sample layout'}
      </span>
    );
  }

  return null;
}
