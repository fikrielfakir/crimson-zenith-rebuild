import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHeroSettings } from "@/hooks/useCMS";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  const { data: heroSettings, isLoading } = useHeroSettings();
  
  const defaultTaglines = [
    { text: "Where Adventure Meets\nTransformation", twoLines: true },
    { text: "Where Journey Meets\nDiscovery", twoLines: true },
    { text: "Where Exploration Meets\nInspiration", twoLines: true },
    { text: "Where Travel Meets\nPurpose", twoLines: true },
    { text: "Journey Within,\nExplore Without", twoLines: true },
    { text: "Where Journeys Become\nTransformations", twoLines: true },
    { text: "Adventure Towards\nInner Discovery", twoLines: true },
    { text: "Where Soul Meets\nAdventure", twoLines: true },
    { text: "Discover. Transform.\nJourney.", twoLines: true },
    { text: "Explore Beyond\nthe Horizon", twoLines: true },
    { text: "Journey Towards\nSelf-Discovery", twoLines: true },
    { text: "Where Dreams Meet\nAdventure", twoLines: true },
    { text: "Your Path to\nExtraordinary Journeys", twoLines: true },
    { text: "Creating Meaningful\nAdventures", twoLines: true },
    { text: "Where Travelers Become\nExplorers", twoLines: true },
    { text: "Exceptional Journeys for\nExtraordinary People", twoLines: true }
  ];

  const taglines = heroSettings?.typewriterTexts && heroSettings.typewriterTexts.length > 0
    ? heroSettings.typewriterTexts
    : defaultTaglines;

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const currentText = taglines[currentTaglineIndex].text;
    
    if (isTyping && charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else if (charIndex >= currentText.length) {
      const timer = setTimeout(() => {
        setIsTyping(false);
        setCharIndex(0);
        setDisplayedText('');
        setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
        setFadeKey(prev => prev + 1);
        setTimeout(() => setIsTyping(true), 100);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [charIndex, isTyping, currentTaglineIndex, taglines]);

  const backgroundUrl = heroSettings?.backgroundMediaId
    ? `/api/cms/media/${heroSettings.backgroundMediaId}`
    : heroBackground;

  const overlayColor = heroSettings?.backgroundOverlayColor || 'rgba(26, 54, 93, 0.7)';
  const title = heroSettings?.title || "Where Adventure Meets\nTransformation";
  const subtitle = heroSettings?.subtitle || "Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.";
  const primaryButtonText = heroSettings?.primaryButtonText || "Start Your Journey";
  const primaryButtonLink = heroSettings?.primaryButtonLink || "/join";
  const secondaryButtonText = heroSettings?.secondaryButtonText || "Explore Clubs";
  const secondaryButtonLink = heroSettings?.secondaryButtonLink || "/clubs";
  const titleFontSize = heroSettings?.titleFontSize || "65px";
  const titleColor = heroSettings?.titleColor || "#ffffff";
  const subtitleFontSize = heroSettings?.subtitleFontSize || "20px";
  const subtitleColor = heroSettings?.subtitleColor || "#ffffff";
  const enableTypewriter = heroSettings?.enableTypewriter !== false;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image or Video */}
      {heroSettings?.backgroundType === 'video' && heroSettings?.backgroundMediaId ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0" style={{ background: overlayColor }} />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/30" />
      
      {/* Content - Fixed Layout Structure */}
      <div className="relative z-10 text-center px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto hero-content-wrapper">
        {/* ABSOLUTE FIXED HEIGHT for H1 - Accommodates 3 Lines */}
        <div className="h1-fixed-container">
          <div className="h1-inner-wrapper">
            <h1 className="hero-title" style={{ color: titleColor }}>
              {enableTypewriter ? (
                <span className="hero-text-wrapper" key={fadeKey}>
                  {(() => {
                    const lines = displayedText.split('\n');
                    
                    return lines.map((line, lineIndex) => (
                      <span key={lineIndex} className="hero-line">
                        {line}
                        {lineIndex < lines.length - 1 && <br />}
                        {lineIndex === lines.length - 1 && isTyping && (
                          <span className="typewriter-cursor-new">|</span>
                        )}
                      </span>
                    ));
                  })()}
                </span>
              ) : (
                <span className="hero-text-wrapper">
                  {title.split('\n').map((line, i) => (
                    <span key={i} className="hero-line">
                      {line}
                      {i < title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              )}
            </h1>
          </div>
        </div>
        
        {/* FIXED POSITION Subtitle - Always starts at same Y position */}
        <div className="subtitle-fixed-container">
          <p className="hero-subtitle" style={{ color: subtitleColor }}>
            {subtitle}
          </p>
        </div>
        
        {/* FIXED POSITION Buttons - Always at same Y position */}
        <div className="buttons-fixed-container">
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to={primaryButtonLink}>
              <Button 
                className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-primary text-base px-10 py-4 h-14 rounded-button font-medium transition-all duration-300 shadow-elegant hover:shadow-glow hover:scale-105 border-0"
              >
                {primaryButtonText}
              </Button>
            </Link>
            <Link to={secondaryButtonLink}>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto text-white border-white/70 hover:bg-white/10 hover:border-white hover:backdrop-blur-sm text-base px-10 py-4 h-14 rounded-button font-medium transition-all duration-300 bg-transparent/10 backdrop-blur-sm border-2 hover:scale-105"
              >
                {secondaryButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Pattern at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-auto z-10 pointer-events-none">
        <img 
          src="/attached_assets/pattern 002_1762097803637.png" 
          alt="" 
          className="w-full h-auto object-cover opacity-80"
        />
      </div>
      
      {/* Simple Mouse Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <Mouse className="w-6 h-6 text-white/60 animate-bounce" />
      </div>

      {/* Enhanced Styles with Better Typography */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Import Cinzel Font for Elegant Display Typography */
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
          
          /* Main Content Wrapper */
          .hero-content-wrapper {
            margin-top: 3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          /* CRITICAL: Fixed Height Container for H1 - Prevents ANY Layout Shift */
          .h1-fixed-container {
            width: 100%;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0;
            position: relative;
          }
          
          .h1-inner-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          
          /* Hero Title - Elegant Cinzel Display Font */
          .hero-title {
            font-family: 'Cinzel', 'Cormorant Garamond', 'Playfair Display', 'Georgia', serif;
            font-size: clamp(2.5rem, 8vw, 4.5rem);
            font-weight: 700;
            line-height: 1.25;
            letter-spacing: 0.02em;
            text-align: center;
            text-transform: uppercase;
            margin: 0;
            padding: 0;
            position: relative;
          }
          
          /* Text Wrapper with Smooth Fade */
          .hero-text-wrapper {
            display: inline-block;
            animation: fadeInTitle 0.6s ease-out;
          }
          
          /* Elegant Gradient Text Effect */
          .hero-line {
            display: inline;
            background: linear-gradient(180deg, 
              #ffffff 0%, 
              #f8f8f8 50%, 
              #eeeeee 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 
              0 6px 25px rgba(0, 0, 0, 0.4),
              0 3px 12px rgba(0, 0, 0, 0.3),
              0 1px 4px rgba(0, 0, 0, 0.2);
            filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.25));
          }
          
          /* Single Clean Cursor */
          .typewriter-cursor-new {
            display: inline-block;
            width: 4px;
            height: 0.85em;
            background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
            margin-left: 6px;
            animation: cursorBlink 1s infinite;
            vertical-align: baseline;
            position: relative;
            top: 0.08em;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
          }
          
          /* FIXED POSITION Subtitle Container */
          .subtitle-fixed-container {
            width: 100%;
            max-width: 48rem;
            margin: 1.5rem auto 0;
            padding: 0 1rem;
          }
          
          /* Refined Subtitle Typography */
          .hero-subtitle {
            font-family: 'Cormorant Garamond', 'Georgia', serif;
            font-size: clamp(1rem, 2.5vw, 1.2rem);
            font-weight: 400;
            line-height: 1.75;
            letter-spacing: 0.02em;
            color: #f5e6d3;
            opacity: 0.96;
            text-shadow: 
              0 3px 12px rgba(0, 0, 0, 0.3),
              0 1px 4px rgba(0, 0, 0, 0.2);
            margin: 0;
          }
          
          /* FIXED POSITION Buttons Container */
          .buttons-fixed-container {
            margin-top: 2rem;
            width: 100%;
          }
          
          /* Smooth Fade In Animation */
          @keyframes fadeInTitle {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Cursor Blink */
          @keyframes cursorBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          /* ===== RESPONSIVE BREAKPOINTS ===== */
          
          /* Mobile: 320px - 640px */
          @media (max-width: 640px) {
            .hero-content-wrapper {
              margin-top: 2rem;
            }
            
            .h1-fixed-container {
              height: 160px;
            }
            
            .hero-title {
              font-size: clamp(2rem, 8vw, 2.8rem);
              line-height: 1.2;
            }
            
            .subtitle-fixed-container {
              margin-top: 1.25rem;
            }
            
            .hero-subtitle {
              font-size: clamp(0.95rem, 4vw, 1.05rem);
              line-height: 1.7;
            }
            
            .buttons-fixed-container {
              margin-top: 1.75rem;
            }
          }
          
          /* Tablet: 641px - 1024px */
          @media (min-width: 641px) and (max-width: 1024px) {
            .hero-content-wrapper {
              margin-top: 2.5rem;
            }
            
            .h1-fixed-container {
              height: 170px;
            }
            
            .hero-title {
              font-size: clamp(3rem, 8vw, 4rem);
            }
            
            .subtitle-fixed-container {
              margin-top: 1.35rem;
            }
            
            .buttons-fixed-container {
              margin-top: 1.85rem;
            }
          }
          
          /* Desktop: 1025px+ */
          @media (min-width: 1025px) {
            .hero-content-wrapper {
              margin-top: 3rem;
            }
            
            .h1-fixed-container {
              height: 190px;
            }
            
            .hero-title {
              font-size: clamp(4rem, 8vw, 5rem);
              letter-spacing: 0.02em;
            }
            
            .subtitle-fixed-container {
              margin-top: 1.5rem;
              max-width: 50rem;
            }
            
            .hero-subtitle {
              font-size: 1.5rem;
              line-height: 1.2;
            }
            
            .buttons-fixed-container {
              margin-top: 2.25rem;
            }
          }
          
          /* Ultra-wide: 1400px+ */
          @media (min-width: 1400px) {
            .h1-fixed-container {
              height: 200px;
            }
            
            .hero-title {
              font-size: 55px;
            }
          }
          
          /* Mouse Indicator */
          .w-6 { width: 2.5rem; }
          .h-6 { height: 2.5rem; }
        `
      }} />
    </section>
  );
};

export default Hero;
