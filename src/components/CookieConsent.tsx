import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from '@/lib/apiFetch';

interface ContentTranslation {
  entityType: string;
  entityId: string;
  field: string;
  language: string;
  value: string;
}

interface CookieCategory {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  locked: boolean;
}

interface CookieSettingsData {
  enabled: boolean;
  delay: number;
  title: string;
  description: string;
  categories: CookieCategory[];
}

const CookieConsent = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [categoryPrefs, setCategoryPrefs] = useState<Record<string, boolean>>({});

  const defaultSettings = useMemo<CookieSettingsData>(() => ({
    enabled: true,
    delay: 1500,
    title: t('cookieConsent.title'),
    description: t('cookieConsent.description'),
    categories: [
      { key: 'necessary', label: t('cookieConsent.categories.necessary.label'), description: t('cookieConsent.categories.necessary.description'), enabled: true, locked: true },
      { key: 'functional', label: t('cookieConsent.categories.functional.label'), description: t('cookieConsent.categories.functional.description'), enabled: true, locked: false },
      { key: 'analytics', label: t('cookieConsent.categories.analytics.label'), description: t('cookieConsent.categories.analytics.description'), enabled: true, locked: false },
      { key: 'marketing', label: t('cookieConsent.categories.marketing.label'), description: t('cookieConsent.categories.marketing.description'), enabled: true, locked: false },
    ],
  }), [t]);

  const { data: settings } = useQuery<CookieSettingsData>({
    queryKey: ['/api/cms/cookie-settings'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/api/cms/cookie-settings');
        if (!res.ok) return defaultSettings;
        return res.json();
      } catch {
        return defaultSettings;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: bannerTranslations } = useQuery<ContentTranslation[]>({
    queryKey: ['/api/translations/cookie_settings/banner'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/api/translations/cookie_settings/banner');
        if (!res.ok) return [];
        return res.json();
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const activeSettings = settings ?? defaultSettings;

  const translatedTitle = useMemo(() => {
    if (!bannerTranslations?.length) return activeSettings.title;
    const lang = i18n.language?.split('-')[0] || 'en';
    const match = bannerTranslations.find(
      (tr) => tr.field === 'title' && tr.language === lang
    );
    return match?.value || activeSettings.title;
  }, [bannerTranslations, activeSettings.title, i18n.language]);

  const translatedDescription = useMemo(() => {
    if (!bannerTranslations?.length) return activeSettings.description;
    const lang = i18n.language?.split('-')[0] || 'en';
    const match = bannerTranslations.find(
      (tr) => tr.field === 'description' && tr.language === lang
    );
    return match?.value || activeSettings.description;
  }, [bannerTranslations, activeSettings.description, i18n.language]);

  useEffect(() => {
    if (!activeSettings.enabled) return;
    const consent = localStorage.getItem('cookieConsent');
    if (consent) return;

    const prefs: Record<string, boolean> = {};
    for (const cat of activeSettings.categories) {
      prefs[cat.key] = cat.enabled;
    }
    setCategoryPrefs(prefs);

    const timer = setTimeout(() => setIsVisible(true), activeSettings.delay ?? 1500);
    return () => clearTimeout(timer);
  }, [activeSettings.enabled, activeSettings.delay, activeSettings.categories]);

  const saveConsent = (prefs: Record<string, boolean>, type: string) => {
    localStorage.setItem('cookieConsent', type);
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const prefs: Record<string, boolean> = {};
    for (const cat of activeSettings.categories) prefs[cat.key] = true;
    saveConsent(prefs, 'accepted');
  };

  const handleAcceptNecessary = () => {
    const prefs: Record<string, boolean> = {};
    for (const cat of activeSettings.categories) prefs[cat.key] = cat.locked;
    saveConsent(prefs, 'necessary');
  };

  const handleSavePreferences = () => {
    saveConsent(categoryPrefs, 'custom');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-0">
          <div className="text-white p-3 rounded-t-lg" style={{ backgroundColor: 'hsl(var(--primary))' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cookie className="w-4 h-4" />
                <h3 className="font-semibold text-base">{translatedTitle || t('cookieConsent.title')}</h3>
              </div>
              <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <p className="text-sm text-gray-700 leading-relaxed">{translatedDescription || t('cookieConsent.description')}</p>
            </div>

            {showDetails && (
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  {activeSettings.categories.map((cat) => (
                    <div key={cat.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{cat.label}</h4>
                        <p className="text-xs text-gray-500">{cat.description}</p>
                      </div>
                      {cat.locked ? (
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{t('cookieConsent.alwaysActive')}</div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={categoryPrefs[cat.key] ?? cat.enabled}
                          onChange={(e) => setCategoryPrefs((prev) => ({ ...prev, [cat.key]: e.target.checked }))}
                          className="w-4 h-4"
                          style={{ accentColor: 'hsl(var(--primary))' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {!showDetails ? (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={handleAcceptAll}
                    className="text-white font-medium px-6 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                  >
                    {t('cookieConsent.acceptAll')}
                  </Button>
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4"
                  >
                    {t('cookieConsent.necessaryOnly')}
                  </Button>
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant="outline"
                    className="px-4 hover:bg-slate-50"
                    style={{ borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary))' }}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    {t('cookieConsent.customize')}
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                  >
                    {t('cookieConsent.savePreferences')}
                  </Button>
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {t('cookieConsent.cancel')}
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center pt-2 border-t">
              <div className="flex justify-center space-x-3 text-xs text-gray-500">
                <Link to="/privacy-policy" className="hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--primary))' }}>{t('cookieConsent.privacy')}</Link>
                <Link to="/cookie-policy" className="hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--primary))' }}>{t('cookieConsent.cookies')}</Link>
                <Link to="/terms-of-service" className="hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--primary))' }}>{t('cookieConsent.terms')}</Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
