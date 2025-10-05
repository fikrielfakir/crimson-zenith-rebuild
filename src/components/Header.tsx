import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Globe, Moon, Sun, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logoAtj from "@/assets/logo-atj.png";
import { useNavbarSettings } from "@/hooks/useCMS";

interface NavLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

// Top Navbar (Utility Bar - Only utilities, no navigation)
const TopNavbar = ({ 
  isDarkMode, 
  toggleDarkMode, 
  currentLanguage, 
  toggleLanguage, 
  isScrolled,
  showLanguageSwitcher,
  showDarkModeToggle,
  showLoginButton,
  loginButtonText,
  loginButtonLink,
  showJoinButton,
  joinButtonText,
  joinButtonLink,
  joinButtonStyle
}: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentLanguage: string;
  toggleLanguage: () => void;
  isScrolled: boolean;
  showLanguageSwitcher: boolean;
  showDarkModeToggle: boolean;
  showLoginButton: boolean;
  loginButtonText: string;
  loginButtonLink: string;
  showJoinButton: boolean;
  joinButtonText: string;
  joinButtonLink: string;
  joinButtonStyle: string;
}) => {
  return (
    <div className="w-full bg-transparent transition-all duration-300 overflow-hidden" style={isScrolled ? { maxHeight: '65px', opacity: '0', height: '65px' } : { maxHeight: '80px', opacity: '1' }}>
      <div className={`container mx-auto px-6 transition-all duration-300 ${isScrolled ? 'py-0' : 'py-3'}`}>
        <div className="flex items-center justify-end gap-4">
          {/* Language Switcher */}
          {showLanguageSwitcher && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1 rounded-button font-body"
            >
              <Globe className="h-4 w-4" />
              {currentLanguage}
            </Button>
          )}

          {/* Dark Mode Toggle */}
          {showDarkModeToggle && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleDarkMode}
              className="text-white hover:bg-white/10 px-2 py-2 rounded-button"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {/* Login Button */}
          {showLoginButton && (
            <Button 
              asChild
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1 rounded-button font-body"
            >
              <Link to={loginButtonLink}>
                <User className="h-4 w-4" />
                {loginButtonText}
              </Link>
            </Button>
          )}

          {/* Join Button */}
          {showJoinButton && (
            <Button 
              asChild
              className={joinButtonStyle === 'secondary' 
                ? "bg-secondary hover:bg-secondary/90 text-white px-6 py-2 text-sm font-medium rounded-button transition-all duration-300 shadow-elegant hover:shadow-glow"
                : "bg-primary hover:bg-primary/90 text-white px-6 py-2 text-sm font-medium rounded-button transition-all duration-300 shadow-elegant hover:shadow-glow"
              }
            >
              <Link to={joinButtonLink}>{joinButtonText}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Bottom Navbar (Main Navigation with Logo)
const BottomNavbar = ({ 
  isScrolled,
  navigationLinks,
  logoUrl
}: { 
  isScrolled: boolean;
  navigationLinks: NavLink[];
  logoUrl: string;
}) => {
  const midpoint = Math.ceil(navigationLinks.length / 2);
  const leftLinks = navigationLinks.slice(0, midpoint);
  const rightLinks = navigationLinks.slice(midpoint);

  return (
    <div className="w-full bg-transparent relative">
      {/* Top Border - breaks around logo */}
      <div className={`relative h-px w-full transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto px-6 flex items-center">
          <div className="flex-1 h-px bg-white/25"></div>
          <div className="w-48"></div>
          <div className="flex-1 h-px bg-white/25"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6" style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}}>
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-12">
          {/* Left Section - Navigation */}
          <div className="hidden md:flex items-center justify-end">
            <nav className={`flex items-center gap-10 transition-all duration-300 ${isScrolled ? 'relative' : ''}`} style={isScrolled ? {bottom: '1rem'} : {}}>
              {leftLinks.map((link, index) => (
                link.isExternal ? (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-secondary transition-all duration-300 font-normal text-sm tracking-wide font-body"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={index}
                    to={link.url} 
                    className="text-white hover:text-secondary transition-all duration-300 font-normal text-sm tracking-wide font-body"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>
          
          {/* Center Section - Logo (135px height) */}
          <div className="col-start-2 justify-self-center flex items-center justify-center">
            <Link to="/" className="flex flex-col items-center" style={{position: 'relative', bottom: '100px', height: '0'}}>
              <img 
                src={logoUrl} 
                alt="The Journey Association" 
                className="w-auto object-contain transition-all duration-300 cursor-pointer hover:opacity-90"
                style={isScrolled ? {height: '90px', margin: '20px 10px'} : {height: '135px'}}
              />
            </Link>
          </div>
          
          {/* Right Section - Navigation */}
          <div className="hidden md:flex items-center justify-start">
            <nav className={`flex items-center gap-10 transition-all duration-300 ${isScrolled ? 'relative' : ''}`} style={isScrolled ? {bottom: '1rem'} : {}}>
              {rightLinks.map((link, index) => (
                link.isExternal ? (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-secondary transition-all duration-300 font-normal text-sm tracking-wide font-body"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={index}
                    to={link.url} 
                    className="text-white hover:text-secondary transition-all duration-300 font-normal text-sm tracking-wide font-body"
                  >
                    {link.label}
                  </Link>
                )
              ))}
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
          <div className="w-48"></div>
          <div className="flex-1 h-px bg-white/25"></div>
        </div>
      </div>
    </div>
  );
};

// Header Container (Corrected Dual Navigation Layout)
const Header = () => {
  const { data: navbarSettings } = useNavbarSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  const defaultNavigationLinks: NavLink[] = [
    { label: "Discover", url: "/discover" },
    { label: "Activities", url: "/#activities" },
    { label: "Membership", url: "/#membership" },
    { label: "Clubs", url: "/#clubs" },
    { label: "Events", url: "/#events" },
    { label: "Gallery", url: "/gallery" },
    { label: "News", url: "/news" },
    { label: "Contact", url: "/contact" },
  ];

  const navigationLinks = navbarSettings?.navigationLinks && Array.isArray(navbarSettings.navigationLinks) && navbarSettings.navigationLinks.length > 0
    ? navbarSettings.navigationLinks as NavLink[]
    : defaultNavigationLinks;

  const availableLanguages = navbarSettings?.availableLanguages && Array.isArray(navbarSettings.availableLanguages) && navbarSettings.availableLanguages.length > 0
    ? navbarSettings.availableLanguages as string[]
    : ['EN', 'FR', 'AR'];

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
    const currentIndex = availableLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    setCurrentLanguage(availableLanguages[nextIndex]);
  };

  const logoUrl = navbarSettings?.logoType === 'image' && navbarSettings?.logoImageId
    ? `/api/cms/media/${navbarSettings.logoImageId}`
    : logoAtj;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'backdrop-blur-sm' : 'bg-transparent'
    }`} style={isScrolled ? { backgroundColor: 'hsl(var(--primary))', marginTop: '0' } : { marginTop: '2.5rem' }}>
      {/* Top Navbar - Utility Bar (Language, Theme, Login, Join) */}
      <TopNavbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        currentLanguage={currentLanguage}
        toggleLanguage={toggleLanguage}
        isScrolled={isScrolled}
        showLanguageSwitcher={navbarSettings?.showLanguageSwitcher !== false}
        showDarkModeToggle={navbarSettings?.showDarkModeToggle !== false}
        showLoginButton={navbarSettings?.showLoginButton !== false}
        loginButtonText={navbarSettings?.loginButtonText || "Login"}
        loginButtonLink={navbarSettings?.loginButtonLink || "/admin/login"}
        showJoinButton={navbarSettings?.showJoinButton !== false}
        joinButtonText={navbarSettings?.joinButtonText || "Join Us"}
        joinButtonLink={navbarSettings?.joinButtonLink || "/join"}
        joinButtonStyle={navbarSettings?.joinButtonStyle || "secondary"}
      />
      
      {/* Bottom Navbar - Main Navigation with 135px Logo */}
      <BottomNavbar 
        isScrolled={isScrolled} 
        navigationLinks={navigationLinks}
        logoUrl={logoUrl}
      />
    </header>
  );
};

export default Header;
