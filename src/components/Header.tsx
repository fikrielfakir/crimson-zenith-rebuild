import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useState, useEffect } from "react";
import { Globe, Moon, Sun, User } from "lucide-react";

// Utility Bar Component (Top Header)
const UtilityBar = ({ isDarkMode, toggleDarkMode, currentLanguage, toggleLanguage }: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentLanguage: string;
  toggleLanguage: () => void;
}) => {
  return (
    <div className="border-b border-white/10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-end gap-3">
          {/* Language Switcher */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:text-primary hover:bg-white/10 px-3 py-1 text-xs flex items-center gap-1"
          >
            <Globe className="h-3 w-3" />
            {currentLanguage}
          </Button>

          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleDarkMode}
            className="text-white hover:text-primary hover:bg-white/10 px-3 py-1"
          >
            {isDarkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </Button>

          {/* Login Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:text-primary hover:bg-white/10 px-3 py-1 text-xs flex items-center gap-1"
          >
            <User className="h-3 w-3" />
            Login
          </Button>

          {/* Join Button */}
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-xs font-medium rounded-md"
          >
            Join us
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Header Component
const MainHeader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-12">
        {/* Left Section - Navigation with Border */}
        <div className="hidden md:flex items-center justify-end">
          <nav className="flex items-center gap-8 relative">
            <a href="#discover" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              Discover
            </a>
            <a href="#activities" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              Activities
            </a>
            <a href="#membership" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              Membership
            </a>
            {/* Decorative border line under left navigation */}
            <div className="absolute -bottom-4 left-0 right-0 h-px bg-white/40"></div>
          </nav>
        </div>
        
        {/* Center Section - Logo */}
        <div className="col-start-2 justify-self-center flex items-center justify-center">
          {/* Logo */}
          <img src={logo} alt="The Journey Association" className="w-auto brightness-0 invert" style={{height: '135px'}} />
        </div>
        
        {/* Right Section - Navigation with Border */}
        <div className="hidden md:flex items-center justify-start">
          <nav className="flex items-center gap-8 relative">
            <a href="#events" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              Events
            </a>
            <a href="#gallery" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              Gallery
            </a>
            <a href="#news" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              News
            </a>
            <a href="#contact" className="text-white hover:text-white/80 transition-colors font-medium text-base">
              Contact
            </a>
            {/* Decorative border line under right navigation */}
            <div className="absolute -bottom-4 left-0 right-0 h-px bg-white/40"></div>
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <Button variant="ghost" className="col-start-3 justify-self-end md:hidden text-white">
          ☰
        </Button>
      </div>
    </div>
  );
};

// Header Shell Component (Container for both headers)
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Set initial state based on current scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle dark mode class on document
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'EN' ? 'FR' : currentLanguage === 'FR' ? 'AR' : 'EN');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      {/* Top Utility Bar */}
      <UtilityBar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentLanguage={currentLanguage}
        toggleLanguage={toggleLanguage}
      />
      
      {/* Main Header */}
      <MainHeader />
    </header>
  );
};

export default Header;