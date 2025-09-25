import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie, Shield, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }));
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  const handleSavePreferences = () => {
    // For now, just accept all - in a real app, you'd have checkboxes
    handleAcceptAll();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 text-white p-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cookie className="w-4 h-4" />
                <h3 className="font-semibold text-base">🍪 We use cookies to enhance your experience</h3>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. 
                  Essential cookies are always active.
                </p>
              </div>
            </div>

            {showDetails && (
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Necessary Cookies</h4>
                      <p className="text-xs text-gray-500">Required for basic site functionality</p>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Always Active
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Functional Cookies</h4>
                      <p className="text-xs text-gray-500">Remember your preferences and settings</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Analytics Cookies</h4>
                      <p className="text-xs text-gray-500">Help us understand site usage</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Marketing Cookies</h4>
                      <p className="text-xs text-gray-500">Personalized content and ads</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!showDetails ? (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-medium px-6"
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
                    onClick={handleCustomize}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 px-4"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-medium"
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

            {/* Footer Links */}
            <div className="text-center pt-2 border-t">
              <div className="flex justify-center space-x-3 text-xs text-gray-500">
                <Link to="/privacy-policy" className="hover:text-orange-600 transition-colors">
                  Privacy
                </Link>
                <Link to="/cookie-policy" className="hover:text-orange-600 transition-colors">
                  Cookies
                </Link>
                <Link to="/terms-of-service" className="hover:text-orange-600 transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;