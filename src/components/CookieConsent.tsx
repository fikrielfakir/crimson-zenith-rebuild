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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-4 sm:items-center">
      <Card className="w-full max-w-lg shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-300">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cookie className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Cookie Settings</h3>
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
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-gray-700 leading-relaxed">
                  We use cookies to enhance your experience on Morocco Clubs. Our cookies help us remember your preferences, 
                  analyze site traffic, and provide personalized content.
                </p>
                <p className="text-xs text-gray-500">
                  Essential cookies are always active. You can customize your preferences below.
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
            <div className="space-y-3 pt-4">
              {!showDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-medium"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={handleCustomize}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
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
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <Link to="/privacy-policy" className="hover:text-orange-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/cookie-policy" className="hover:text-orange-600 transition-colors">
                  Cookie Policy
                </Link>
                <Link to="/terms-of-service" className="hover:text-orange-600 transition-colors">
                  Terms of Service
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