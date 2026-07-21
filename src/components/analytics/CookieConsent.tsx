'use client';

import { useEffect, useState } from 'react';
import { useConsentStore } from '@/lib/analytics/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const { hasConsented, acceptAll, rejectNonEssential, consent, setConsent } = useConsentStore();
  const [mounted, setMounted] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Local state for preferences modal
  const [prefs, setPrefs] = useState({
    analytics: consent.analytics,
    marketing: consent.marketing,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (hasConsented && !showPreferences) return null;

  const handleSavePreferences = () => {
    setConsent({
      essential: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    });
    setShowPreferences(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#121317]/95 p-6 shadow-2xl backdrop-blur-xl">
          {!showPreferences ? (
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-5 w-5 text-[#c41e5c]" />
                  <h3 className="font-display text-lg tracking-wider">WE VALUE YOUR PRIVACY</h3>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Preferences
                </button>
                <button
                  onClick={rejectNonEssential}
                  className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="rounded-full bg-[#c41e5c] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#a0184b] hover:shadow-[0_0_15px_rgba(196,30,92,0.5)]"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-display text-xl tracking-wider text-white">Cookie Preferences</h3>
                <button onClick={() => setShowPreferences(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                {/* Essential */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">Essential Cookies</h4>
                    <p className="text-xs text-gray-400">Required for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#c41e5c]">
                    <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">Analytics Cookies</h4>
                    <p className="text-xs text-gray-400">Help us understand how visitors interact with the website (GA4, GTM, Clarity).</p>
                  </div>
                  <button
                    onClick={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs.analytics ? 'bg-[#c41e5c]' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${prefs.analytics ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">Marketing Cookies</h4>
                    <p className="text-xs text-gray-400">Used to track visitors across websites for targeted advertising (Meta Pixel).</p>
                  </div>
                  <button
                    onClick={() => setPrefs({ ...prefs, marketing: !prefs.marketing })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs.marketing ? 'bg-[#c41e5c]' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${prefs.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="rounded-full bg-[#c41e5c] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#a0184b]"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
