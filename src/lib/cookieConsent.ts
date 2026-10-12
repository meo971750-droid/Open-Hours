/**
 * Cookie Consent Manager & Analytics Gate
 * Unified with lib/consent.ts
 */

import { getConsent, setConsent } from './consent';

export type ConsentStatus = 'accepted' | 'rejected' | 'undecided';

export function getStoredConsent(): ConsentStatus {
  const state = getConsent();
  if (!state.decided) return 'undecided';
  return state.accepted ? 'accepted' : 'rejected';
}

export function setStoredConsent(status: 'accepted' | 'rejected'): void {
  if (status === 'accepted') {
    setConsent({ decided: true, accepted: true, thirdPartyReviews: true });
  } else {
    setConsent({ decided: true, accepted: false, thirdPartyReviews: false });
  }
}

export function loadConsentedAnalytics(): void {
  const current = getStoredConsent();
  if (current !== 'accepted') {
    return;
  }
}
