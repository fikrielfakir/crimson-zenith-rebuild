import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { moroccoCities } from "@/lib/citiesData";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Home, ChevronRight, Compass, UtensilsCrossed, Calendar, Plane, Lightbulb, CheckCircle2, Map, Mountain, Coffee, Waves, Sun, Train, Ship } from "lucide-react";

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
        <div className="relative z-40 mt-40 md:mt-48">
          <div className="w-full">
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
        {/* About Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  About {city.name}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {city.description}
                </p>
              </div>

              <div className="mb-20">
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
            </div>
          </div>
        </section>

        {/* Culture & Heritage Section */}
        {city.culture && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Compass className="w-8 h-8 text-secondary" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {city.culture.title}
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {city.culture.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {city.culture.highlights.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-6 bg-card rounded-lg border border-border/50 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                      <p className="text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Activities & Experiences Section */}
        {city.activities && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Compass className="w-8 h-8 text-secondary" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Activities & Experiences
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-12">
                  Discover the best things to do in {city.name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {city.activities.map((activity, index) => {
                    const IconComponent = activity.icon === "map" ? Map : 
                                         activity.icon === "mountain" ? Mountain :
                                         activity.icon === "coffee" ? Coffee : Waves;
                    return (
                      <div key={index} className="group p-6 bg-card rounded-xl border border-border/50 hover:border-secondary/50 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-secondary" />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          {activity.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Local Cuisine Section */}
        {city.cuisine && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <UtensilsCrossed className="w-8 h-8 text-secondary" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {city.cuisine.title}
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-12">
                  Savor the authentic flavors of {city.name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {city.cuisine.dishes.map((dish, index) => (
                    <div key={index} className="p-6 bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-lg transition-shadow">
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        {dish.name}
                      </h4>
                      <p className="text-muted-foreground">
                        {dish.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Best Time to Visit & Getting There Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Best Time to Visit */}
                {city.bestTime && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-8 h-8 text-secondary" />
                      <h2 className="text-3xl font-bold text-foreground">
                        Best Time to Visit
                      </h2>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Sun className="w-6 h-6 text-secondary" />
                        <h3 className="text-2xl font-bold text-foreground">
                          {city.bestTime.season}
                        </h3>
                      </div>
                      <p className="text-lg font-semibold text-foreground mb-3">
                        {city.bestTime.months}
                      </p>
                      <p className="text-muted-foreground mb-4">
                        {city.bestTime.description}
                      </p>
                      <div className="inline-block px-4 py-2 bg-white/50 rounded-lg">
                        <p className="text-sm font-semibold text-foreground">
                          {city.bestTime.temperature}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Getting There */}
                {city.gettingThere && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Plane className="w-8 h-8 text-secondary" />
                      <h2 className="text-3xl font-bold text-foreground">
                        Getting There
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 bg-card rounded-xl border border-border/50">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <Plane className="w-5 h-5 text-secondary" />
                          Airport
                        </h4>
                        <p className="text-muted-foreground">{city.gettingThere.airport}</p>
                      </div>
                      <div className="p-6 bg-card rounded-xl border border-border/50">
                        <h4 className="font-bold text-foreground mb-3">Transportation Options</h4>
                        <ul className="space-y-2">
                          {city.gettingThere.transport.map((option, index) => (
                            <li key={index} className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-card rounded-xl border border-border/50">
                        <h4 className="font-bold text-foreground mb-3">Local Transport</h4>
                        <p className="text-muted-foreground">{city.gettingThere.localTransport}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Travel Tips Section */}
        {city.travelTips && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-8 h-8 text-secondary" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Travel Tips & Things to Know
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-12">
                  Insider advice for making the most of your visit
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {city.travelTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-5 bg-card rounded-lg border border-border/50 hover:border-secondary/30 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to explore {city.name}?
              </h3>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join us on an unforgettable journey to discover the beauty, culture, and heritage of this amazing Moroccan city.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/join">Join Our Community</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-2 hover:bg-secondary/10"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
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
