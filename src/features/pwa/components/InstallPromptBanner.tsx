'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, Smartphone, PlusSquare, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed & opened as PWA)
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error - iOS navigator property
      Boolean(window.navigator.standalone) ||
      document.referrer.includes('android-app://');

    if (isInStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if user already dismissed banner in this session
    const dismissed = localStorage.getItem('muhasabah_pwa_dismissed');
    if (!dismissed) {
      setIsDismissed(false);
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
    if (isIphoneOrIpad) {
      setIsIOS(true);
    }

    // 4. Capture beforeinstallprompt event for Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Expose to window for sidebar / manual trigger button
      (window as unknown as Record<string, unknown>).__muhasabahDeferredPrompt = e;
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstalledSuccessfully(true);
      setIsStandalone(true);
      localStorage.setItem('muhasabah_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Retrieve deferred prompt from state or window
    const promptEvent = deferredPrompt || (window as unknown as Record<string, BeforeInstallPromptEvent>).__muhasabahDeferredPrompt;

    if (!promptEvent) {
      // Fallback instructions for generic browser
      alert('To install Muhasabah on your home screen, open your browser menu (...) and select "Add to Home screen" or "Install App".');
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setInstalledSuccessfully(true);
      setDeferredPrompt(null);
      (window as unknown as Record<string, unknown>).__muhasabahDeferredPrompt = null;
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('muhasabah_pwa_dismissed', 'true');
  };

  // Don't render banner if app is already standalone or user dismissed
  if (isStandalone || isDismissed) {
    if (!showIOSModal) return null;
  }

  return (
    <>
      {/* Floating Bottom Install Banner */}
      {!isDismissed && !installedSuccessfully && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            left: '24px',
            maxWidth: '460px',
            margin: '0 auto',
            backgroundColor: 'var(--c-surface-container-high, #161d2a)',
            border: '1px solid var(--c-primary, #d4af37)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            backdropFilter: 'blur(12px)',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          {/* Logo Icon */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#090d16',
              border: '1px solid var(--c-outline-variant, #2a3447)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '28px', height: '28px' }}>
              <path d="M 50 10 A 40 40 0 1 0 90 50 A 32 32 0 1 1 50 10 Z" fill="url(#pwaBannerGold)" />
              <path d="M 62 28 Q 62 38 72 38 Q 62 38 62 48 Q 62 38 52 38 Q 62 38 62 28 Z" fill="url(#pwaBannerGoldLight)" />
              <defs>
                <linearGradient id="pwaBannerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bf9129" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
                <linearGradient id="pwaBannerGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#f3e5ab" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Banner Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--c-on-surface, #ffffff)' }}>
              Add Muhasabah to Home Screen
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--c-on-surface-variant, #94a3b8)', lineHeight: 1.3 }}>
              Access faster like a native app without opening your browser!
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: 'var(--c-primary, #d4af37)',
                color: '#000000',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Download size={15} />
              <span>Install</span>
            </button>

            <button
              onClick={handleDismiss}
              aria-label="Close install prompt"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--c-on-surface-variant, #94a3b8)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* iOS Installation Guidance Modal */}
      {showIOSModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--c-surface-container-high, #161d2a)',
              border: '1px solid var(--c-outline-variant, #2a3447)',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowIOSModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--c-on-surface-variant, #94a3b8)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37' }}>
                <Smartphone size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Install on iPhone / iPad</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Follow 2 easy steps in Safari</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--c-primary, #d4af37)', color: '#000000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
                  1
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Tap the <strong>Share</strong> button <Share size={16} color="#007aff" />
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Located in Safari toolbar (bottom or top bar)</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--c-primary, #d4af37)', color: '#000000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
                  2
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Select <strong>Add to Home Screen</strong> <PlusSquare size={16} color="#d4af37" />
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Scroll down the share menu list to find it</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              style={{
                width: '100%',
                backgroundColor: 'var(--c-primary, #d4af37)',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Check size={18} />
              <span>Got it!</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
