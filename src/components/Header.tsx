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
            className="text-white hover:text-primary hover:bg-white/10 px-3 py-1 text-xs"
          >
            <Globe className="h-3 w-3 mr-1" />
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
            className="text-white hover:text-primary hover:bg-white/10 px-3 py-1 text-xs"
          >
            <User className="h-3 w-3 mr-1" />
            Login
          </Button>

          {/* Join Button */}
          <Button 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-1 text-xs font-medium"
          >
            Join Us
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Header Component (Bottom Header)
const MainHeader = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
        {/* Left Section - Navigation */}
        <nav className="hidden md:flex items-center justify-start gap-8">
          <a href="#discover" className="text-white hover:text-primary transition-colors font-medium text-sm">
            Discover
          </a>
          <a href="#activities" className="text-white hover:text-primary transition-colors font-medium text-sm">
            Activities
          </a>
          <a href="#membership" className="text-white hover:text-primary transition-colors font-medium text-sm">
            Membership
          </a>
        </nav>
        
        {/* Center Section - Logo with decorative lines */}
        <div className="flex items-center gap-4">
          {/* Left decorative line */}
          <div className="hidden md:block w-24 h-px bg-white/30"></div>
          
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="The Journey Association" className="w-auto" style={{height: '100px'}} />
          </div>
          
          {/* Right decorative line */}
          <div className="hidden md:block w-24 h-px bg-white/30"></div>
        </div>
        
        {/* Right Section - Navigation */}
        <nav className="hidden md:flex items-center justify-end gap-8">
          <a href="#events" className="text-white hover:text-primary transition-colors font-medium text-sm">
            Events
          </a>
          <a href="#gallery" className="text-white hover:text-primary transition-colors font-medium text-sm">
            Gallery
          </a>
          <a href="#news" className="text-white hover:text-primary transition-colors font-medium text-sm">
            News
          </a>
          <a href="#contact" className="text-white hover:text-primary transition-colors font-medium text-sm">
            Contact
          </a>
        </nav>
        
        {/* Mobile menu button */}
        <Button variant="ghost" className="md:hidden justify-self-end text-white">
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
      isScrolled ? 'bg-[hsl(225,70%,20%)] shadow-md' : 'bg-black/20'
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