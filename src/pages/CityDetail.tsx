import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { moroccoCities } from "@/lib/citiesData";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Home, ChevronRight } from "lucide-react";

const CityDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [city, setCity] = useState<typeof moroccoCities[0] | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const citySlug = searchParams.get('city');
    
    if (citySlug) {
      const foundCity = moroccoCities.find(c => c.slug === citySlug);
      if (foundCity) {
        setCity(foundCity);
      } else {
        navigate('/discover');
      }
    } else {
      navigate('/discover');
    }
  }, [location.search, navigate]);

  if (!city) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image - Includes Navbar, Breadcrumb, and Title */}
      <section 
        className="relative w-full h-screen overflow-hidden" 
      >
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700 ease-out"
          style={{ 
            backgroundImage: `url(${city.image})`,
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        
        {/* Header (Navbar) */}
        <div className="relative z-50">
          <Header />
        </div>
        
        {/* Breadcrumb Section */}
        <div className="relative z-40 mt-32 md:mt-40">
          <div className="w-full backdrop-blur-md bg-black/20 border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-6 md:px-8 py-3">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-white/80 text-sm">
                  <li>
                    <Link
                      to="/"
                      className="flex items-center hover:text-white transition-all duration-300 group"
                    >
                      <Home className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1.5 text-white/50" />
                    <Link
                      to="/discover"
                      className="hover:text-white transition-all duration-300 font-medium hover:underline underline-offset-4"
                    >
                      Discover
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1.5 text-white/50" />
                    <span className="text-white font-semibold">{city.name}</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-30 flex items-center h-[calc(100vh-16rem)] md:h-[calc(100vh-18rem)]">
          <div className="container mx-auto px-6 md:px-8">
            {/* Back Button with Premium Styling */}
            <Button
              onClick={() => navigate('/discover')}
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full mb-8 px-5 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>

            {/* Location Badge */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-white text-base font-semibold tracking-wide">Morocco</span>
              </div>
            </div>
            
            {/* Main Title - Bold Sans-Serif */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-6 tracking-tight leading-none animate-fade-in opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {city.name}
            </h1>
            
            {/* Subtitle - Elegant Accent Font */}
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-secondary font-light italic tracking-wide mb-8 animate-fade-in opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]" style={{ fontFamily: 'Georgia, Cambria, serif', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {city.title}
            </p>

            {/* Decorative Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-secondary to-transparent rounded-full animate-fade-in opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards] shadow-lg" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      <main>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  About {city.name}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {city.description}
                </p>
              </div>

              <div className="mb-16">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Highlights & Must-See Attractions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {city.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                        <span className="text-secondary font-bold text-sm">{index + 1}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {highlight}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Ready to explore {city.name}?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join us on an unforgettable journey to discover the beauty, culture, and heritage of this amazing Moroccan city.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg"
                  >
                    <Link to="/join">Join Our Community</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg"
                  >
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Explore More Moroccan Cities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {moroccoCities
                .filter(c => c.id !== city.id)
                .slice(0, 3)
                .map((otherCity) => (
                  <Link
                    key={otherCity.id}
                    to={{ pathname: '/discover/cities', search: `?city=${otherCity.slug}` }}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="aspect-video relative">
                      <img
                        src={otherCity.image}
                        alt={otherCity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h4 className="text-2xl font-bold text-white mb-1">
                          {otherCity.name}
                        </h4>
                        <p className="text-white/80 text-sm italic">
                          {otherCity.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CityDetail;
