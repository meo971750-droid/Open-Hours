/**
 * Cookie Consent Manager & Analytics Gate
 * Strict GDPR compliance: No tracking scripts or analytics load until explicit user opt-in.
 */

const STORAGE_KEY = 'open_hours_cookie_consent_v1';

export type ConsentStatus = 'accepted' | 'rejected' | 'undecided';

export function getStoredConsent(): ConsentStatus {
  if (typeof window === 'undefined') return 'undecided';
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'accepted' || val === 'rejected') {
      return val;
    }
  } catch (err) {
    console.warn('LocalStorage inaccessible for consent', err);
  }
  return 'undecided';
}

export function setStoredConsent(status: 'accepted' | 'rejected'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, status);
  } catch (err) {
    console.warn('Could not persist consent', err);
  }

  if (status === 'accepted') {
    loadConsentedAnalytics();
  }
}

/**
 * Gatekeeper for analytics and third-party tracking scripts.
 * Only executes if explicit consent was granted.
 */
export function loadConsentedAnalytics(): void {
  const current = getStoredConsent();
  if (current !== 'accepted') {
    return;
  }

  // PLACEHOLDER: Insert future privacy-focused analytics snippet here
  // (e.g. Plausible, self-hosted telemetry, or Google Analytics 4)
  // Example:
  // if (!window.hasInitializedAnalytics) {
  //   window.hasInitializedAnalytics = true;
  //   console.info('[Open Hours Consent Gate] Analytics initialized after opt-in.');
  // }
}
