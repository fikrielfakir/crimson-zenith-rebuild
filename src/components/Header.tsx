import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  Moon,
  Sun,
  User,
  Menu,
  ChevronDown,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoAtj from "@/assets/logo-atj.png";
import { useNavbarSettings } from "@/hooks/useCMS";
import { moroccoCities } from "@/lib/citiesData";
import useEmblaCarousel from "embla-carousel-react";
import DonateDrawer from "./DonateDrawer";

interface NavLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

const CitiesDropdown = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="absolute left-0 top-full mt-2 w-[700px] max-w-[90vw] bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-border/20">
      <div className="p-6">
        <div className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
          TOP CITIES MOROCCO
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {moroccoCities.map((city) => (
                <div key={city.id} className="flex-[0_0_32%] min-w-0">
                  <Link
                    to={{
                      pathname: "/discover/cities",
                      search: `?city=${city.slug}`,
                    }}
                    className="block group/card"
                  >
                    <div className="relative h-32 rounded-lg overflow-hidden transition-all duration-300 ease-in-out group-hover/card:scale-105 group-hover/card:shadow-xl">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wide drop-shadow-lg">
                          {city.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Previous cities"
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>

          <button
            onClick={scrollNext}
            aria-label="Next cities"
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div
          className="flex justify-center gap-2 mt-4"
          role="tablist"
          aria-label="City carousel navigation"
        >
          {Array.from({ length: moroccoCities.length }).map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === selectedIndex}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === selectedIndex ? "bg-primary w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Talents Dropdown Component
const TalentsDropdown = () => {
  const [volunteersOpen, setVolunteersOpen] = useState(false);

  return (
    <div className="absolute left-0 top-full mt-2 w-64 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-border/20">
      <div className="p-4">
        <div className="flex flex-col gap-1">
          {/* Volunteers with sub-menu */}
          <div
            className="relative group/volunteers"
            onMouseEnter={() => setVolunteersOpen(true)}
            onMouseLeave={() => setVolunteersOpen(false)}
          >
            <div className="flex items-center justify-between px-4 py-3 text-foreground hover:bg-secondary/10 rounded-lg transition-colors cursor-pointer">
              <span className="font-medium text-sm">Volunteers</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            {/* Volunteers submenu */}
            <div
              className={`absolute left-full top-0 ml-2 w-48 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl border border-border/20 transition-all duration-300 ${volunteersOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              <div className="p-2">
                <Link
                  to="/talents/volunteers/spontaneous"
                  className="block px-4 py-2 text-foreground hover:bg-secondary/10 rounded-lg transition-colors text-sm"
                >
                  Spontaneous
                </Link>
                <Link
                  to="/talents/volunteers/posts"
                  className="block px-4 py-2 text-foreground hover:bg-secondary/10 rounded-lg transition-colors text-sm"
                >
                  Available posts
                </Link>
              </div>
            </div>
          </div>

          {/* Our Experts */}
          <Link
            to="/talents/experts"
            className="block px-4 py-3 text-foreground hover:bg-secondary/10 rounded-lg transition-colors font-medium text-sm"
          >
            Our Experts
          </Link>

          {/* Work offers */}
          <Link
            to="/talents/work-offers"
            className="block px-4 py-3 text-foreground hover:bg-secondary/10 rounded-lg transition-colors font-medium text-sm"
          >
            Work offers
          </Link>
        </div>
      </div>
    </div>
  );
};

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
  joinButtonStyle,
  onDonateClick,
  textColor,
  hoverColor,
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
  onDonateClick: () => void;
  textColor: string;
  hoverColor: string;
}) => {
  const [heartAnimate, setHeartAnimate] = useState(false);

  const handleDonateHover = () => {
    setHeartAnimate(true);
    setTimeout(() => setHeartAnimate(false), 600);
  };

  return (
    <div
      className="w-full bg-transparent transition-all duration-300 overflow-hidden"
      style={
        isScrolled
          ? { maxHeight: "65px", opacity: "0", height: "65px" }
          : { maxHeight: "80px", opacity: "1" }
      }
    >
      <div
        className={`container mx-auto px-6 transition-all duration-300 ${isScrolled ? "py-0" : "py-3"}`}
      >
        <div className="flex items-center justify-end gap-4">
          {/* Language Switcher */}
          {showLanguageSwitcher && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="px-3 py-2 text-xs flex items-center gap-1 rounded-button font-body"
              style={{ color: textColor }}
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
              className="px-2 py-2 rounded-button"
              style={{ color: textColor }}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Login Button */}
          {showLoginButton && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="px-3 py-2 text-xs flex items-center gap-1 rounded-button font-body"
              style={{ color: textColor }}
            >
              <Link to={loginButtonLink}>
                <User className="h-4 w-4" />
                {loginButtonText}
              </Link>
            </Button>
          )}

          {/* Donate Button */}
          {showJoinButton && (
            <Button
              onClick={onDonateClick}
              className="text-white font-medium flex items-center gap-2 border-0 cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.03]"
              style={{
                background: "linear-gradient(90deg, #d45151 0%, #c04040 100%)",
                fontSize: "16px",
                fontWeight: "500",
                borderRadius: "30px",
                padding: "12px 28px",
                height: "44px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#b03a3a";
                handleDonateHover();
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #d45151 0%, #c04040 100%)";
              }}
            >
              <Heart
                className="h-[18px] w-[18px] transition-transform origin-center"
                fill="white"
                style={{
                  animation: heartAnimate
                    ? "heartBeatWarp 0.8s ease-in-out"
                    : "none",
                  transformOrigin: "center center",
                }}
              />
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  @keyframes heartBeatWarp {
                    0% {
                      transform: scale(1) skew(0deg, 0deg);
                    }
                    10% {
                      transform: scale(1.15) skew(-2deg, 1deg);
                    }
                    20% {
                      transform: scale(1.4) skew(3deg, -2deg) rotate(-8deg);
                    }
                    30% {
                      transform: scale(1.6) skew(-4deg, 3deg) rotate(5deg);
                    }
                    40% {
                      transform: scale(1.8) skew(5deg, -4deg) rotate(-10deg);
                    }
                    50% {
                      transform: scale(1.5) skew(-3deg, 2deg) rotate(7deg);
                    }
                    60% {
                      transform: scale(1.7) skew(4deg, -3deg) rotate(-5deg);
                    }
                    70% {
                      transform: scale(1.4) skew(-2deg, 2deg) rotate(3deg);
                    }
                    80% {
                      transform: scale(1.2) skew(1deg, -1deg) rotate(-2deg);
                    }
                    90% {
                      transform: scale(1.05) skew(-0.5deg, 0.5deg) rotate(1deg);
                    }
                    100% {
                      transform: scale(1) skew(0deg, 0deg) rotate(0deg);
                    }
                  }
                `,
                }}
              />
              {joinButtonText}
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
  logoUrl,
  logoSize,
  logoLink,
  logoType,
  logoText,
  textColor,
  hoverColor,
  navHeight,
}: {
  isScrolled: boolean;
  navigationLinks: NavLink[];
  logoUrl: string;
  logoSize: number;
  logoLink: string;
  logoType: "image" | "text";
  logoText: string;
  textColor: string;
  hoverColor: string;
  navHeight: number;
}) => {
  const midpoint = Math.ceil(navigationLinks.length / 2);
  const leftLinks = navigationLinks.slice(0, midpoint);
  const rightLinks = navigationLinks.slice(midpoint);

  return (
    <div className="w-full bg-transparent relative">
      {/* Top Border - breaks around logo */}
      <div
        className={`relative h-px w-full transition-opacity duration-300 ${isScrolled ? "opacity-0" : "opacity-100"}`}
      >
        <div className="container mx-auto px-6 flex items-center">
          <div className="flex-1 h-px bg-white/25"></div>
          <div className="w-48"></div>
          <div className="flex-1 h-px bg-white/25"></div>
        </div>
      </div>

      <div
        className="container mx-auto px-6"
        style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}
      >
        <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] items-center gap-12">
          {/* Left Section - Navigation */}
          <div className="hidden md:flex items-center justify-end">
            <nav
              className={`flex items-center gap-10 transition-all duration-300 ${isScrolled ? "relative" : ""}`}
              style={isScrolled ? { bottom: "1rem" } : {}}
            >
              {leftLinks.map((link, index) => {
                if (link.label === "Discover" && !link.isExternal) {
                  return (
                    <div key={index} className="relative group">
                      <span
                        className="transition-all duration-300 font-normal text-sm tracking-wide font-body flex items-center gap-1 cursor-pointer group"
                        style={{ color: textColor }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = hoverColor)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = textColor)
                        }
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
                      </span>
                      <CitiesDropdown />
                    </div>
                  );
                }

                if (link.label === "Talents" && !link.isExternal) {
                  return (
                    <div key={index} className="relative group">
                      <span
                        className="transition-all duration-300 font-normal text-sm tracking-wide font-body flex items-center gap-1 cursor-pointer group"
                        style={{ color: textColor }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = hoverColor)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = textColor)
                        }
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
                      </span>
                      <TalentsDropdown />
                    </div>
                  );
                }

                return link.isExternal ? (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 font-normal text-sm tracking-wide font-body"
                    style={{ color: textColor }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = hoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = textColor)
                    }
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={link.url}
                    className="transition-all duration-300 font-normal text-sm tracking-wide font-body"
                    style={{ color: textColor }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = hoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = textColor)
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center Section - Logo */}
          <div className="col-start-2 justify-self-center flex items-center justify-center">
            <Link
              to={logoLink}
              className="flex flex-col items-center"
              style={{
                position: "relative",
                bottom: `${logoSize * 0.7}px`,
                height: "0",
              }}
            >
              {logoType === "image" ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-auto object-contain transition-all duration-300 cursor-pointer hover:opacity-90"
                  style={
                    isScrolled
                      ? { height: `${logoSize * 0.67}px`, margin: "20px 10px" }
                      : { height: `${logoSize}px` }
                  }
                />
              ) : (
                <span
                  className="font-bold transition-all duration-300 cursor-pointer hover:opacity-90"
                  style={
                    isScrolled
                      ? {
                          fontSize: `${logoSize * 0.15}px`,
                          margin: "20px 10px",
                          color: textColor,
                        }
                      : { fontSize: `${logoSize * 0.2}px`, color: textColor }
                  }
                >
                  {logoText}
                </span>
              )}
            </Link>
          </div>

          {/* Right Section - Navigation */}
          <div className="hidden md:flex items-center justify-start">
            <nav
              className={`flex items-center gap-10 transition-all duration-300 ${isScrolled ? "relative" : ""}`}
              style={isScrolled ? { bottom: "1rem" } : {}}
            >
              {rightLinks.map((link, index) => {
                if (link.label === "Discover" && !link.isExternal) {
                  return (
                    <div key={index} className="relative group">
                      <span
                        className="transition-all duration-300 font-normal text-sm tracking-wide font-body flex items-center gap-1 cursor-pointer group"
                        style={{ color: textColor }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = hoverColor)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = textColor)
                        }
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
                      </span>
                      <CitiesDropdown />
                    </div>
                  );
                }

                if (link.label === "Talents" && !link.isExternal) {
                  return (
                    <div key={index} className="relative group">
                      <span
                        className="transition-all duration-300 font-normal text-sm tracking-wide font-body flex items-center gap-1 cursor-pointer group"
                        style={{ color: textColor }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = hoverColor)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = textColor)
                        }
                      >
                        {link.label}
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
                      </span>
                      <TalentsDropdown />
                    </div>
                  );
                }

                return link.isExternal ? (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 font-normal text-sm tracking-wide font-body"
                    style={{ color: textColor }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = hoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = textColor)
                    }
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={link.url}
                    className="transition-all duration-300 font-normal text-sm tracking-wide font-body"
                    style={{ color: textColor }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = hoverColor)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = textColor)
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="col-start-3 justify-self-end md:hidden text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Border - breaks around logo */}
      <div
        className={`relative h-px w-full transition-opacity duration-300 ${isScrolled ? "opacity-0" : "opacity-100"}`}
      >
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
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const [isDonateDrawerOpen, setIsDonateDrawerOpen] = useState(false);

  const defaultNavigationLinks: NavLink[] = [
    { label: "Discover", url: "/discover" },
    { label: "Activities", url: "/#events" },
    { label: "Projects", url: "/projects" },
    { label: "Clubs", url: "/#clubs" },
    { label: "Gallery", url: "/gallery" },
    { label: "Blog", url: "/news" },
    { label: "Talents", url: "/talents" },
    { label: "Contact", url: "/contact" },
  ];

  const navigationLinks =
    navbarSettings?.navigationLinks &&
    Array.isArray(navbarSettings.navigationLinks) &&
    navbarSettings.navigationLinks.length > 0
      ? (navbarSettings.navigationLinks as NavLink[])
      : defaultNavigationLinks;

  const availableLanguages =
    navbarSettings?.availableLanguages &&
    Array.isArray(navbarSettings.availableLanguages) &&
    navbarSettings.availableLanguages.length > 0
      ? (navbarSettings.availableLanguages as string[])
      : ["EN", "FR", "AR"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleLanguage = () => {
    const currentIndex = availableLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    setCurrentLanguage(availableLanguages[nextIndex]);
  };

  const logoUrl =
    navbarSettings?.logoType === "image" && navbarSettings?.logoImageId
      ? `/api/cms/media/${navbarSettings.logoImageId}`
      : logoAtj;

  // Extract styling settings with defaults
  const bgColor = navbarSettings?.backgroundColor || "#112250";
  const textColor = navbarSettings?.textColor || "#ffffff";
  const hoverColor = navbarSettings?.hoverColor || "#D8C18D";
  const fontFamily = navbarSettings?.fontFamily || "Inter";
  const fontSize = navbarSettings?.fontSize || "14px";
  const navHeight = navbarSettings?.height || 80;
  const isSticky = navbarSettings?.isSticky ?? true;
  const isTransparent = navbarSettings?.isTransparent ?? true;

  const transparentBg = navbarSettings?.transparentBg || "rgb(0 0 0 / 0%)";
  const scrolledBg = navbarSettings?.scrolledBg || bgColor;
  const logoSize = navbarSettings?.logoSize || 135;
  const logoLink = navbarSettings?.logoLink || "/";

  // Compute navbar background color based on scroll state and settings
  const getNavbarBg = () => {
    if (isScrolled) {
      return scrolledBg;
    }
    // When not scrolled
    if (isTransparent) {
      return transparentBg; // e.g., "rgba(0,0,0,0.3)" or "transparent"
    }
    return transparentBg;
  };
  return (
    <>
      <header
        className={`${isSticky ? "fixed" : "absolute"} top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-sm" : ""
        }`}
        style={{
          backgroundColor: getNavbarBg(),
          marginTop: isScrolled ? "0" : "2.5rem",
          fontFamily: fontFamily,
          fontSize: fontSize,
          color: textColor,
        }}
      >
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
          joinButtonText={navbarSettings?.joinButtonText || "Donate"}
          joinButtonLink={navbarSettings?.joinButtonLink || "/join"}
          joinButtonStyle={navbarSettings?.joinButtonStyle || "secondary"}
          onDonateClick={() => setIsDonateDrawerOpen(true)}
          textColor={textColor}
          hoverColor={hoverColor}
        />

        {/* Bottom Navbar - Main Navigation */}
        <BottomNavbar
          isScrolled={isScrolled}
          navigationLinks={navigationLinks}
          logoUrl={logoUrl}
          logoSize={logoSize}
          logoLink={logoLink}
          logoType={navbarSettings?.logoType || "image"}
          logoText={navbarSettings?.logoText || ""}
          textColor={textColor}
          hoverColor={hoverColor}
          navHeight={navHeight}
        />
      </header>

      <DonateDrawer
        open={isDonateDrawerOpen}
        onOpenChange={setIsDonateDrawerOpen}
      />
    </>
  );
};

export default Header;
