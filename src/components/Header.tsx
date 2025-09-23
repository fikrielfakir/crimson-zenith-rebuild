import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="The Journey Association" className="h-8 w-auto" />
          <span className="text-xl font-bold text-foreground">The Journey</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#about" className="text-foreground hover:text-primary transition-colors">
            About
          </a>
          <a href="#events" className="text-foreground hover:text-primary transition-colors">
            Events
          </a>
          <a href="#clubs" className="text-foreground hover:text-primary transition-colors">
            Clubs
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
        
        <Button variant="hero" className="hidden sm:inline-flex">
          Join Us
        </Button>
      </div>
    </header>
  );
};

export default Header;