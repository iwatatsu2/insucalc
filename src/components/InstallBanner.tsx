import { useState, useEffect, useRef } from 'react';

const DISMISS_KEY = 'install-banner-dismissed';
const DISMISS_DAYS = 7;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

function isDismissed() {
  const val = localStorage.getItem(DISMISS_KEY);
  if (!val) return false;
  const ts = parseInt(val, 10);
  if (isNaN(ts)) return false;
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isIOS() {
  return /iP(hone|od|ad)/.test(navigator.userAgent) && !(window as any).MSStream;
}

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    // iOS: show banner directly
    if (isIOS()) {
      setVisible(true);
      return;
    }

    // Android/Chrome: wait for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const result = await deferredPrompt.current.userChoice;
      if (result.outcome === 'accepted') {
        setVisible(false);
      }
      deferredPrompt.current = null;
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* iOS guide overlay */}
      {showIOSGuide && (
        <div
          onClick={() => setShowIOSGuide(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, padding: '28px 24px',
              maxWidth: 340, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B', marginBottom: 16, textAlign: 'center' }}>
              ホーム画面に追加する方法
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { step: '1', icon: '⬆️', text: '下の共有ボタン（□↑）をタップ' },
                { step: '2', icon: '➕', text: '「ホーム画面に追加」を選択' },
                { step: '3', icon: '✓', text: '右上の「追加」をタップ' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    background: '#2563EB', color: '#fff', borderRadius: '50%',
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900, flexShrink: 0,
                  }}>{s.step}</span>
                  <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
                    {s.icon} {s.text}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              style={{
                marginTop: 20, width: '100%', padding: '12px',
                background: '#2563EB', color: '#fff', border: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div style={{
        position: 'fixed',
        bottom: 96, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 448,
        background: '#fff',
        border: '1.5px solid #E2E8F0',
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: '-0.3px' }}>IC</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>
            ホーム画面に追加
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
            アプリのようにすぐ起動できます
          </div>
        </div>
        <button
          onClick={handleInstall}
          style={{
            padding: '8px 14px', background: '#2563EB', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
          }}
        >
          追加
        </button>
        <button
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94A3B8', fontSize: 18, lineHeight: 1, padding: '4px',
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}
