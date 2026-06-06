import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from '@/lib/apiFetch';

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

const DEFAULT_SETTINGS: CookieSettingsData = {
  enabled: true,
  delay: 1500,
  title: '🍪 We use cookies to enhance your experience',
  description: 'Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. Essential cookies are always active.',
  categories: [
    { key: 'necessary', label: 'Necessary Cookies', description: 'Required for basic site functionality', enabled: true, locked: true },
    { key: 'functional', label: 'Functional Cookies', description: 'Remember your preferences and settings', enabled: true, locked: false },
    { key: 'analytics', label: 'Analytics Cookies', description: 'Help us understand how our website is being used', enabled: true, locked: false },
    { key: 'marketing', label: 'Marketing Cookies', description: 'Personalized content and ads', enabled: true, locked: false },
  ],
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [categoryPrefs, setCategoryPrefs] = useState<Record<string, boolean>>({});

  const { data: settings } = useQuery<CookieSettingsData>({
    queryKey: ['/api/cms/cookie-settings'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/api/cms/cookie-settings');
        if (!res.ok) return DEFAULT_SETTINGS;
        return res.json();
      } catch {
        return DEFAULT_SETTINGS;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const activeSettings = settings ?? DEFAULT_SETTINGS;

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
  }, [activeSettings]);

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
                <h3 className="font-semibold text-base">{activeSettings.title}</h3>
              </div>
              <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <p className="text-sm text-gray-700 leading-relaxed">{activeSettings.description}</p>
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
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Always Active</div>
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
                    Accept All
                  </Button>
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant="outline"
                    className="px-4 hover:bg-slate-50"
                    style={{ borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary))' }}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'hsl(var(--primary))' }}
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center pt-2 border-t">
              <div className="flex justify-center space-x-3 text-xs text-gray-500">
                <Link to="/privacy-policy" className="hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--primary))' }}>Privacy</Link>
                <Link to="/cookie-policy" className="hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--primary))' }}>Cookies</Link>
                <Link to="/terms-of-service" className="hover:opacity-80 transition-opacity" style={{ color: 'hsl(var(--primary))' }}>Terms</Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
