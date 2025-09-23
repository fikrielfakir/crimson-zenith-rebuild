import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Globe, Moon, Sun, User, TreePine, Menu } from "lucide-react";

// Top Navbar (Main Navigation)
const TopNavbar = ({ isDarkMode, toggleDarkMode, currentLanguage, toggleLanguage }: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentLanguage: string;
  toggleLanguage: () => void;
}) => {
  return (
    <div className="w-full bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
          {/* Left Section - Navigation */}
          <div className="hidden md:flex items-center justify-start">
            <nav className="flex items-center gap-8">
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
          
          {/* Right Section - Navigation + Utilities */}
          <div className="hidden md:flex items-center justify-end">
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
              
              {/* Separator */}
              <div className="w-px h-6 bg-white/30 mx-2"></div>
              
              {/* Language Switcher */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:text-primary hover:bg-white/10 px-3 py-1 text-sm flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                {currentLanguage}
              </Button>

              {/* Dark Mode Toggle */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleDarkMode}
                className="text-white hover:text-primary hover:bg-white/10 px-3 py-1"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Login Button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:text-primary hover:bg-white/10 px-3 py-1 text-sm flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                Login
              </Button>

              {/* Join Button */}
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded-md transition-all duration-300"
              >
                Join Us
              </Button>
            </nav>
          </div>
          
          {/* Mobile menu button */}
          <Button variant="ghost" className="col-start-3 justify-self-end md:hidden text-white p-2">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Bottom Navbar (Secondary Navigation with special borders)
const BottomNavbar = () => {
  return (
    <div className="w-full bg-transparent relative">
      {/* Top Border - breaks around logo */}
      <div className="relative h-px">
        <div className="flex items-center">
          <div className="flex-1 h-px bg-white/40"></div>
          <div className="w-32"></div> {/* Space for logo - matches logo width */}
          <div className="flex-1 h-px bg-white/40"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
          {/* Left Section - Navigation */}
          <div className="hidden md:flex items-center justify-end">
            <nav className="flex items-center gap-6">
              <a 
                href="#discover" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
              >
                Discover
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#activities" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
              >
                Activities
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#membership" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
              >
                Membership
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
          </div>
          
          {/* Center Section - Empty space for logo visibility */}
          <div className="col-start-2 justify-self-center">
            <div className="w-32 h-1"></div> {/* Invisible spacer */}
          </div>
          
          {/* Right Section - Navigation */}
          <div className="hidden md:flex items-center justify-start">
            <nav className="flex items-center gap-6">
              <a 
                href="#events" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
              >
                Events
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#gallery" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#news" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
              >
                News
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#contact" 
                className="text-white/80 hover:text-white transition-all duration-300 font-light text-sm relative group"
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
      
      {/* Bottom Border - breaks around logo */}
      <div className="relative h-px">
        <div className="flex items-center">
          <div className="flex-1 h-px bg-white/40"></div>
          <div className="w-32"></div> {/* Space for logo - matches logo width */}
          <div className="flex-1 h-px bg-white/40"></div>
        </div>
      </div>
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
      {/* Top Navbar - Main Navigation */}
      <TopNavbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentLanguage={currentLanguage}
        toggleLanguage={toggleLanguage}
      />
      
      {/* Bottom Navbar - Secondary Navigation with Special Borders */}
      <BottomNavbar />
    </header>
  );
};

export default Header;