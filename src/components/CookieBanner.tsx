import { useState, useEffect, useCallback } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConsentState } from '@/lib/analytics';
import { DEFAULT_CONSENT, getStoredConsent, setStoredConsent } from '@/lib/analytics';

interface CookieBannerProps {
  theme: 'light' | 'dark';
  onConsentChange: (consent: ConsentState) => void;
  initialShowSettings?: boolean;
}

export function CookieBanner({ theme, onConsentChange, initialShowSettings = false }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(initialShowSettings);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      setShowBanner(initialShowSettings);
    } else {
      setShowBanner(true);
    }
  }, [initialShowSettings]);

  useEffect(() => {
    if (initialShowSettings) {
      setShowBanner(true);
      setShowSettings(true);
    }
  }, [initialShowSettings]);

  const toggleConsent = useCallback((key: keyof ConsentState) => {
    setConsent((prev) => ({
      ...prev,
      [key]: prev[key] === 'granted' ? 'denied' : 'granted',
    }));
  }, []);

  const persistAndClose = useCallback((next: ConsentState) => {
    setStoredConsent(next);
    onConsentChange(next);
    setConsent(next);
    setShowBanner(false);
    setShowSettings(false);
  }, [onConsentChange]);

  const handleAcceptAll = useCallback(() => {
    const next: ConsentState = {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    };
    persistAndClose(next);
  }, [persistAndClose]);

  const handleRejectAll = useCallback(() => {
    const next: ConsentState = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    };
    persistAndClose(next);
  }, [persistAndClose]);

  const handleSaveSettings = useCallback(() => {
    persistAndClose(consent);
  }, [consent, persistAndClose]);

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 px-4 py-4 md:px-8',
        theme === 'light' ? 'bg-white border-t border-slate-200' : 'bg-slate-900/95 border-t border-slate-800'
      )}
    >
      <div className="max-w-6xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Cookie
                className={cn(
                  'w-5 h-5 mt-0.5 flex-shrink-0',
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                )}
              />
              <div>
                <p
                  className={cn(
                    'text-sm font-medium',
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  )}
                >
                  我们使用 Cookie 和分析工具
                </p>
                <p
                  className={cn(
                    'text-xs mt-1 max-w-md',
                    theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                  )}
                >
                  为了提升您的体验，我们使用 Google Analytics 和 Microsoft Clarity 来分析网站流量和用户行为。
                  <a
                    href="/privacy"
                    onClick={() => setShowBanner(false)}
                    className={cn('underline underline-offset-2', theme === 'light' ? 'text-blue-600' : 'text-blue-400')}
                  >
                    了解更多
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                <Settings className="w-3.5 h-3.5" />
                偏好设置
              </button>
              <button
                onClick={handleRejectAll}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                全部拒绝
              </button>
              <button
                onClick={handleAcceptAll}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                )}
              >
                全部接受
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={cn(
                    'text-sm font-semibold',
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  )}
                >
                  分析与广告偏好设置
                </h3>
                <button
                  onClick={() => {
                    if (!initialShowSettings) {
                      setShowBanner(false);
                    }
                    setShowSettings(false);
                  }}
                  className={cn(
                    'p-1 rounded transition-colors',
                    theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                  )}
                >
                  <X className={cn('w-4 h-4', theme === 'light' ? 'text-slate-500' : 'text-slate-400')} />
                </button>
              </div>
              <div className="space-y-3">
                {([
                  { key: 'analytics_storage' as const, label: '分析存储', desc: '允许收集网站访问数据以优化体验' },
                  { key: 'ad_storage' as const, label: '广告存储', desc: '允许展示个性化广告' },
                  { key: 'ad_user_data' as const, label: '广告用户数据', desc: '允许使用用户数据进行广告投放' },
                  { key: 'ad_personalization' as const, label: '广告个性化', desc: '允许基于用户行为展示个性化广告' },
                ]).map((item) => (
                  <label
                    key={item.key}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                      theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-800'
                    )}
                  >
                    <div>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          theme === 'light' ? 'text-slate-800' : 'text-white'
                        )}
                      >
                        {item.label}
                      </span>
                      <p
                        className={cn(
                          'text-xs mt-0.5',
                          theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                        )}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleConsent(item.key);
                      }}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors',
                        consent[item.key] === 'granted'
                          ? theme === 'light' ? 'bg-blue-600' : 'bg-blue-500'
                          : theme === 'light' ? 'bg-slate-300' : 'bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all',
                          consent[item.key] === 'granted' ? 'left-6' : 'left-0.5'
                        )}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRejectAll}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                全部拒绝
              </button>
              <button
                onClick={handleSaveSettings}
                className={cn(
                  'px-4 py-2 text-xs font-medium rounded-lg transition-colors',
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                )}
              >
                保存设置
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
