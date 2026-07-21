import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalyticsConsent } from './types';

interface ConsentState {
  hasConsented: boolean;
  consent: AnalyticsConsent;
  setConsent: (consent: AnalyticsConsent) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
}

const DEFAULT_CONSENT: AnalyticsConsent = {
  essential: true,
  analytics: false,
  marketing: false,
};

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasConsented: false,
      consent: DEFAULT_CONSENT,
      setConsent: (consent: AnalyticsConsent) => set({ consent, hasConsented: true }),
      acceptAll: () =>
        set({
          consent: { essential: true, analytics: true, marketing: true },
          hasConsented: true,
        }),
      rejectNonEssential: () =>
        set({
          consent: { essential: true, analytics: false, marketing: false },
          hasConsented: true,
        }),
    }),
    {
      name: 'protibae-cookie-consent',
    }
  )
);
