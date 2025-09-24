import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Globe, Moon, Sun, User, Menu } from "lucide-react";
import logoAtj from "@/assets/logo-atj.png";

// Top Navbar (Utility Bar - Only utilities, no navigation)
const TopNavbar = ({ isDarkMode, toggleDarkMode, currentLanguage, toggleLanguage, isScrolled }: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentLanguage: string;
  toggleLanguage: () => void;
  isScrolled: boolean;
}) => {
  return (
    <div className="w-full bg-transparent transition-all duration-300 overflow-hidden" style={isScrolled ? { maxHeight: '0', opacity: '0' } : { maxHeight: '80px', opacity: '1' }}>
      <div className={`container mx-auto px-6 transition-all duration-300 ${isScrolled ? 'py-0' : 'py-3'}`}>
        <div className="flex items-center justify-end gap-4">
          {/* Language Switcher */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1 rounded-md"
          >
            <Globe className="h-4 w-4" />
            {currentLanguage}
          </Button>

          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleDarkMode}
            className="text-white hover:bg-white/10 px-2 py-2 rounded-md"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Login Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1 rounded-md"
          >
            <User className="h-4 w-4" />
            Login
          </Button>

          {/* Join Button */}
          <Button 
            className="text-white px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: '#112250' }}
          >
            Join Us
          </Button>
        </div>
      </div>
    </div>
  );
};

// Bottom Navbar (Main Navigation with Logo)
const BottomNavbar = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <div className="w-full bg-transparent relative">
      {/* Top Border - breaks around logo */}
      <div className={`relative h-px w-full transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto px-6 flex items-center">
          <div className="flex-1 h-px bg-white/25"></div>
          <div className="w-48"></div> {/* Space for 135px logo with padding */}
          <div className="flex-1 h-px bg-white/25"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6" style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}}>
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-12">
          {/* Left Section - Navigation */}
          <div className="hidden md:flex items-center justify-end">
            <nav className={`flex items-center gap-10 transition-all duration-300 ${isScrolled ? 'relative' : ''}`} style={isScrolled ? {bottom: '1rem'} : {}}>
              <a 
                href="#discover" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                Discover
              </a>
              <a 
                href="#activities" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                Activities
              </a>
              <a 
                href="#membership" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                Membership
              </a>
            </nav>
          </div>
          
          {/* Center Section - Logo (135px height) */}
          <div className="col-start-2 justify-self-center flex items-center justify-center">
            <div className="flex flex-col items-center" style={{position: 'relative', bottom: '100px', height: '0'}}>
              <img 
                src={logoAtj} 
                alt="The Journey Association" 
                className="w-auto object-contain transition-all duration-300"
                style={isScrolled ? {height: '90px', margin: '20px 10px'} : {height: '135px'}}
              />
            </div>
          </div>
          
          {/* Right Section - Navigation */}
          <div className="hidden md:flex items-center justify-start">
            <nav className={`flex items-center gap-10 transition-all duration-300 ${isScrolled ? 'relative' : ''}`} style={isScrolled ? {bottom: '1rem'} : {}}>
              <a 
                href="#events" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                Events
              </a>
              <a 
                href="#gallery" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                Gallery
              </a>
              <a 
                href="#news" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                News
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-white/80 transition-all duration-300 font-normal text-sm tracking-wide"
              >
                Contact
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
      <div className={`relative h-px w-full transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto px-6 flex items-center">
          <div className="flex-1 h-px bg-white/25"></div>
          <div className="w-48"></div> {/* Space for logo - matches top border */}
          <div className="flex-1 h-px bg-white/25"></div>
        </div>
      </div>
    </div>
  );
};

// Header Container (Corrected Dual Navigation Layout)
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
      isScrolled ? 'backdrop-blur-sm' : 'bg-transparent'
    }`} style={isScrolled ? { backgroundColor: '#112250', marginTop: '0' } : { marginTop: '2.5rem' }}>
      {/* Top Navbar - Utility Bar (Language, Theme, Login, Join) */}
      <TopNavbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentLanguage={currentLanguage}
        toggleLanguage={toggleLanguage}
        isScrolled={isScrolled}
      />
      
      {/* Bottom Navbar - Main Navigation with 135px Logo */}
      <BottomNavbar isScrolled={isScrolled} />
    </header>
  );
};

export default Header;