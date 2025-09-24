import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  const taglines = [
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

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const currentText = taglines[currentTaglineIndex].text;
    
    const timer = setTimeout(() => {
      if (!isErasing && charIndex < currentText.length) {
        // Typing
        setDisplayedText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isErasing && charIndex >= currentText.length) {
        // Finished typing, wait then start erasing
        setTimeout(() => setIsErasing(true), 2000);
      } else if (isErasing && charIndex > 0) {
        // Erasing
        setDisplayedText(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isErasing && charIndex === 0) {
        // Finished erasing, move to next tagline
        setIsErasing(false);
        setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
      }
    }, isErasing ? 50 : 100); // Faster erasing, slower typing

    return () => clearTimeout(timer);
  }, [charIndex, isErasing, currentTaglineIndex, taglines]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Enhanced Navy Gradient Overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(26, 54, 93, 0.7)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/30" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto" style={{ marginTop: '10rem' }}>
        <h1 
          className="hero-h1-responsive leading-[1.1] tracking-tight font-heading"
          style={{ 
            fontSize: '65px', 
            marginBottom: '2rem',
          }}
        >
          <span className="hero-heading-gradient hero-heading-typewriter">
            {(() => {
              // Split the text by lines first
              const lines = displayedText.split('\n');
              const totalLines = lines.length;
              
              return lines.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line}
                  {/* Add cursor after the last character if this is the last line */}
                  {lineIndex === totalLines - 1 && (
                    <span className="typewriter-cursor">|</span>
                  )}
                  {/* Add line break if not the last line */}
                  {lineIndex < totalLines - 1 && <br />}
                </span>
              ));
            })()}
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 sm:mb-14 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-body font-normal tracking-wide">
          Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/discover">
            <Button 
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white text-base px-10 py-4 h-14 rounded-button font-medium transition-all duration-300 shadow-elegant hover:shadow-glow hover:scale-105 border-0"
            >
              Start Your Journey
            </Button>
          </Link>
          <Link to="/clubs">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto text-white border-white/70 hover:bg-white/10 hover:border-white hover:backdrop-blur-sm text-base px-10 py-4 h-14 rounded-button font-medium transition-all duration-300 bg-transparent/10 backdrop-blur-sm border-2 hover:scale-105"
            >
              Explore Clubs
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Simple Mouse Scroll Indicator */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <Mouse className="w-6 h-6 text-white/60 animate-bounce" />
      </div>

      {/* Add responsive styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (min-width: 640px) {
            .hero-h1-responsive {
              margin-bottom: 1.5rem !important;
            }
            .sm\\:bottom-12 {
              bottom: 1rem;
            }
          }
          @media (min-width: 768px) {
            .md\\:text-2xl {
              font-size: 20px;
              line-height: 25px;
            }
          }
          @media (min-width: 1024px) {
            .lg\\:mb-16 {
              margin-bottom: 2rem;
            }
          }
          .w-6 {
            width: 2.5rem;
          }
          .h-6 {
            height: 2.5rem;
          }
          .typewriter-cursor {
            animation: blink 1s infinite;
            color: white;
            font-weight: normal;
            display: inline-block;
            line-height: 1.1;
            vertical-align: baseline;
            font-size: inherit;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `
      }} />
    </section>
  );
};

export default Hero;