import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Globe, Moon, Sun, User, TreePine, Menu } from "lucide-react";

// Top Navbar (Utility Bar)
const TopNavbar = ({ isDarkMode, toggleDarkMode, currentLanguage, toggleLanguage }: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentLanguage: string;
  toggleLanguage: () => void;
}) => {
  return (
    <div className="w-full bg-transparent">
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
            className="bg-primary hover:bg-primary/90 text-white px-4 py-1 text-xs font-medium rounded-md"
          >
            Join us
          </Button>
        </div>
      </div>
    </div>
  );
};

// Bottom Navbar (Main Navigation)
const BottomNavbar = () => {
  return (
    <div className="w-full bg-transparent relative">
      {/* Border above */}
      <div className="w-full h-px bg-white/40"></div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
          {/* Left Section - Navigation */}
          <div className="hidden md:flex items-center justify-end">
            <nav className="flex items-center gap-6">
              <a 
                href="#discover" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                Discover
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#activities" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                Activities
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#membership" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                Membership
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          
          {/* Center Section - Logo */}
          <div className="col-start-2 justify-self-center flex items-center justify-center">
            <div className="flex flex-col items-center">
              <TreePine className="w-8 h-8 text-white mb-2" />
              <div className="text-lg sm:text-xl font-semibold tracking-wide text-white">
                THE JOURNEY
              </div>
              <div className="text-sm tracking-widest uppercase text-white/80">
                Association
              </div>
            </div>
          </div>
          
          {/* Right Section - Navigation */}
          <div className="hidden md:flex items-center justify-start">
            <nav className="flex items-center gap-6">
              <a 
                href="#events" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                Events
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#gallery" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#news" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                News
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-white/80 transition-all duration-300 font-medium text-base relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          
          {/* Mobile menu button */}
          <Button variant="ghost" className="col-start-3 justify-self-end md:hidden text-white p-2">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
      
      {/* Border below */}
      <div className="w-full h-px bg-white/40"></div>
    </div>
  );
};

// Header Container (Dual Navigation)
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'EN' ? 'FR' : currentLanguage === 'FR' ? 'AR' : 'EN');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      {/* Top Navbar - Utility Bar */}
      <TopNavbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentLanguage={currentLanguage}
        toggleLanguage={toggleLanguage}
      />
      
      {/* Bottom Navbar - Main Navigation */}
      <BottomNavbar />
    </header>
  );
};

export default Header;