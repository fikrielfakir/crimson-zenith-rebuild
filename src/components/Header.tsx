import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Left spacer */}
        <div className="flex-1 hidden md:block">
          <Button variant="hero" className="ml-auto">
            Join Us
          </Button>
        </div>
        
        {/* Centered Logo */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <img src={logo} alt="The Journey Association" className="h-8 w-auto" />
          <span className="text-xl font-bold text-foreground">The Journey</span>
        </div>
        
        {/* Right navigation */}
        <nav className="flex-1 hidden md:flex items-center justify-center gap-8">
          <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </a>
          <a href="#events" className="text-foreground hover:text-primary transition-colors font-medium">
            Events
          </a>
          <a href="#clubs" className="text-foreground hover:text-primary transition-colors font-medium">
            Clubs
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
            Contact
          </a>
        </nav>
        
        {/* Mobile menu button */}
        <Button variant="ghost" className="md:hidden ml-auto">
          ☰
        </Button>
      </div>
    </header>
  );
};

export default Header;