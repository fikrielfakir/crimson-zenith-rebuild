import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Set initial state based on current scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[hsl(225,70%,20%)]' : 'bg-black/20'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation */}
          <nav className="flex-1 hidden md:flex items-center justify-start gap-8">
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
          <div className="flex items-center gap-4 mx-auto md:mx-0">
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
          <nav className="flex-1 hidden md:flex items-center justify-end gap-8">
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
          <Button variant="ghost" className="md:hidden ml-auto text-white">
            ☰
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;