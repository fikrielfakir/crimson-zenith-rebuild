import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Join Us Button */}
          <div className="flex-1 hidden md:flex justify-start">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium">
              Join Us
            </Button>
          </div>
          
          {/* Center Section - Logo with decorative lines */}
          <div className="flex items-center gap-4 mx-auto md:mx-0">
            {/* Left decorative line */}
            <div className="hidden md:block w-24 h-px bg-white/30"></div>
            
            {/* Logo and text */}
            <div className="flex flex-col items-center text-center">
              <img src={logo} alt="The Journey Association" className="h-10 w-auto mb-1" />
              <div className="text-white">
                <div className="text-sm font-semibold tracking-wider">THE JOURNEY</div>
                <div className="text-xs tracking-widest">Association</div>
              </div>
            </div>
            
            {/* Right decorative line */}
            <div className="hidden md:block w-24 h-px bg-white/30"></div>
          </div>
          
          {/* Right Section - Navigation */}
          <nav className="flex-1 hidden md:flex items-center justify-end gap-8">
            <a href="#about" className="text-white hover:text-primary transition-colors font-medium text-sm">
              About
            </a>
            <a href="#events" className="text-white hover:text-primary transition-colors font-medium text-sm">
              Events
            </a>
            <a href="#clubs" className="text-white hover:text-primary transition-colors font-medium text-sm">
              Clubs
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