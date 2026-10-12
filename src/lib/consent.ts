import { useSyncExternalStore } from 'react';

export interface ConsentState {
  version: 1;
  decided: boolean;
  accepted: boolean;
  thirdPartyReviews: boolean;
  at: string;
}

const STORAGE_KEY = 'oh_consent_v1';

export const DEFAULT_CONSENT: ConsentState = {
  version: 1,
  decided: false,
  accepted: false,
  thirdPartyReviews: false,
  at: new Date().toISOString(),
};

let memoryState: ConsentState = DEFAULT_CONSENT;

function readStorage(): ConsentState {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.version === 1) {
        return {
          version: 1,
          decided: Boolean(parsed.decided),
          accepted: Boolean(parsed.accepted),
          thirdPartyReviews: Boolean(parsed.thirdPartyReviews),
          at: typeof parsed.at === 'string' ? parsed.at : new Date().toISOString(),
        };
      }
    }
  } catch {
    // LocalStorage blocked or error
  }
  return memoryState;
}

function writeStorage(state: ConsentState): void {
  memoryState = state;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // LocalStorage blocked or error
  }
}

// Module cache for referential stability in getConsent()
let currentState: ConsentState = readStorage();
memoryState = currentState;

const listeners = new Set<() => void>();

export function getConsent(): ConsentState {
  return currentState;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore listener error
    }
  });
}

export function setConsent(partial: Partial<ConsentState>): void {
  const next: ConsentState = {
    ...currentState,
    ...partial,
    version: 1,
    at: partial.at ?? new Date().toISOString(),
  };
  currentState = next;
  writeStorage(next);
  notify();
}

// Synchronize changes across multiple tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      currentState = readStorage();
      notify();
    }
  });
}

export function useConsent(): ConsentState {
  return useSyncExternalStore(
    subscribe,
    getConsent,
    () => DEFAULT_CONSENT
  );
}
