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
        className="relative w-full min-h-[100vh] bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: `url(${city.image})`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        
        {/* Header (Navbar) */}
        <div className="relative z-50">
          <Header />
        </div>
        
        {/* Breadcrumb Section - Separated from Navbar with same background */}
        <div className="relative z-40" style={{ marginTop: '10rem' }}>
          <div className="w-full border-b border-white/10" style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            paddingTop: '12px',
            paddingBottom: '12px'
          }}>
            <div className="container mx-auto px-6">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-white/70 text-xs md:text-sm">
                  <li>
                    <Link
                      to="/"
                      className="flex items-center hover:text-white transition-colors duration-200"
                    >
                      <Home className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 mx-1 text-white/40" />
                    <Link
                      to="/discover"
                      className="hover:text-white transition-colors duration-200 font-medium"
                    >
                      Discover
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 mx-1 text-white/40" />
                    <span className="text-white font-semibold">{city.name}</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-30 w-full py-16 md:py-24">
          <div className="container mx-auto px-6">
            <Button
              onClick={() => navigate('/discover')}
              variant="ghost"
              className="text-white hover:bg-white/10 mb-6 px-3 py-2 animate-fade-in"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>

            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <MapPin className="w-6 h-6 text-secondary drop-shadow-lg" />
              <span className="text-white/90 text-lg font-medium drop-shadow-md">Morocco</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fade-in drop-shadow-2xl">
              {city.name}
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-secondary font-semibold italic animate-fade-in drop-shadow-lg">
              {city.title}
            </p>
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
                      className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <span className="text-secondary font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-foreground mb-2">
                          {highlight}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Explore this remarkable destination
                        </p>
                      </div>
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
