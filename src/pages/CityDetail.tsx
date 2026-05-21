import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { moroccoCities } from "@/lib/citiesData";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Home, ChevronRight, Compass, UtensilsCrossed, Calendar, Plane, Lightbulb, CheckCircle2, Map, Mountain, Coffee, Waves, Sun } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

interface CityActivity {
  name: string;
  icon: string;
  description: string;
}

interface CuisineDish {
  name: string;
  description: string;
}

type HighlightItem = string | { text: string; image?: string };

interface City {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  heroType: string;
  heroVideo: string;
  heroOverlay: number;
  highlights: HighlightItem[];
  culture: { title: string; description: string; highlights: HighlightItem[] } | null;
  cuisine: { title: string; dishes: CuisineDish[] } | null;
  activities: CityActivity[];
  bestTime: { season: string; months: string; description: string; temperature: string } | null;
  gettingThere: { airport: string; transport: string[]; localTransport: string } | null;
  travelTips: string[];
}

async function fetchCityBySlug(slug: string): Promise<City> {
  const res = await apiFetch(`/api/cities/${slug}`);
  if (!res.ok) throw new Error('City not found');
  const data = await res.json();
  return {
    ...data,
    heroType:    data.hero_type    ?? data.heroType    ?? 'image',
    heroVideo:   data.hero_video   ?? data.heroVideo   ?? '',
    heroOverlay: data.hero_overlay ?? data.heroOverlay ?? 50,
    bestTime: data.best_time ?? data.bestTime ?? null,
    gettingThere: data.getting_there ?? data.gettingThere ?? null,
    travelTips: data.travel_tips ?? data.travelTips ?? [],
  };
}

const CityDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [city, setCity] = useState<City | null>(null);
  const [allCities, setAllCities] = useState<City[]>([]);

  const { data: pageHeroData } = useQuery({
    queryKey: ["page-hero", "city-detail"],
    queryFn: async () => {
      try {
        const res = await apiFetch("/api/cms/page-hero/city-detail");
        if (!res.ok) return null;
        return res.json();
      } catch { return null; }
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const citySlug = searchParams.get('city');
    
    if (!citySlug) {
      navigate('/discover');
      return;
    }

    fetchCityBySlug(citySlug)
      .then(data => setCity(data))
      .catch(() => {
        const fallback = moroccoCities.find(c => c.slug === citySlug);
        if (fallback) {
          setCity({
            id: fallback.id,
            name: fallback.name,
            slug: fallback.slug,
            title: fallback.title,
            description: fallback.description,
            image: fallback.image,
            heroType:    'image',
            heroVideo:   '',
            heroOverlay: 50,
            highlights: fallback.highlights,
            culture: fallback.culture ?? null,
            cuisine: fallback.cuisine ?? null,
            activities: fallback.activities ?? [],
            bestTime: fallback.bestTime ?? null,
            gettingThere: fallback.gettingThere ?? null,
            travelTips: fallback.travelTips ?? [],
          });
        } else {
          navigate('/discover');
        }
      });

    apiFetch('/api/cities')
      .then(r => r.json())
      .then(data => setAllCities(Array.isArray(data) ? data : []))
      .catch(() => {
        setAllCities(moroccoCities.map(c => ({
          id: c.id, name: c.name, slug: c.slug, title: c.title,
          description: c.description, image: c.image, highlights: c.highlights,
          culture: null, cuisine: null, activities: [], bestTime: null,
          gettingThere: null, travelTips: [],
        })));
      });
  }, [location.search, navigate]);

  // City's own hero takes priority; fall back to page-hero CMS setting
  const heroBgType: string = city?.heroType || pageHeroData?.backgroundType || "image";
  const heroVideoUrl: string = city?.heroVideo || pageHeroData?.backgroundVideoUrl || "";
  const isVideoHero = heroBgType === "video" && !!heroVideoUrl;
  const overlayOpacity = Math.min(90, Math.max(0, city?.heroOverlay ?? 50)) / 100;

  if (!city) {
    return null;
  }

  const otherCities = allCities.filter(c => c.slug !== city.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full min-h-screen overflow-hidden" style={{ height: '100svh' }}>
        {isVideoHero ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay loop muted playsInline
          >
            <source src={heroVideoUrl} type="video/mp4" />
            <source src={heroVideoUrl} type="video/webm" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-700 ease-out"
            style={{
              backgroundImage: `url(${city.image})`,
              backgroundAttachment: 'fixed'
            }}
          />
        )}
        {/* Configurable dark overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} />
        {/* Edge gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-50">
          <Header />
        </div>
        
        <div className="relative z-40 mt-40 md:mt-48">
          <div className="w-full">
            <div className="container mx-auto px-6 md:px-8 py-3">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-white/80 text-sm">
                  <li>
                    <Link to="/" className="flex items-center hover:text-white transition-all duration-300 group">
                      <Home className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1.5 text-white/50" />
                    <Link to="/discover" className="hover:text-white transition-all duration-300 font-medium hover:underline underline-offset-4">
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
        
        <div className="relative z-30 flex items-center h-[calc(100vh-16rem)] md:h-[calc(100vh-18rem)]">
          <div className="container mx-auto px-6 md:px-8">
            <Button
              onClick={() => navigate('/discover')}
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full mb-8 px-5 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>

            <div className="flex items-center gap-3 mb-6 animate-fade-in opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-white text-base font-semibold tracking-wide">Morocco</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-6 tracking-tight leading-none animate-fade-in opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {city.name}
            </h1>
            
            <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-secondary font-light italic tracking-wide mb-8 animate-fade-in opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]" style={{ fontFamily: 'Georgia, Cambria, serif', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {city.title}
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-secondary to-transparent rounded-full animate-fade-in opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards] shadow-lg" />
          </div>
        </div>

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

              {(city.highlights || []).length > 0 && (
                <div className="mb-20">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                    Highlights & Must-See Attractions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {city.highlights.map((highlight, index) => {
                      const text = typeof highlight === 'string' ? highlight : highlight.text;
                      const image = typeof highlight === 'object' ? highlight.image : undefined;
                      return (
                        <div key={index} className={`flex items-center gap-4 ${image ? 'rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm' : ''}`}>
                          {image ? (
                            <>
                              <img src={image} alt={text} className="w-24 h-20 object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              <h4 className="text-lg font-semibold text-foreground pr-4">{text}</h4>
                            </>
                          ) : (
                            <>
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                                <span className="text-secondary font-bold text-sm">{index + 1}</span>
                              </div>
                              <h4 className="text-lg font-semibold text-foreground">{text}</h4>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
                {(city.culture.highlights || []).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {city.culture.highlights.map((item, index) => {
                      const text = typeof item === 'string' ? item : item.text;
                      const image = typeof item === 'object' ? item.image : undefined;
                      return (
                      <div key={index} className="flex items-start gap-3 p-6 bg-card rounded-lg border border-border/50 shadow-sm">
                        {image && <img src={image} alt={text} className="w-16 h-12 object-cover rounded flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        {!image && <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />}
                        <p className="text-foreground">{text}</p>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Activities & Experiences Section */}
        {(city.activities || []).length > 0 && (
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
                        <h4 className="text-lg font-bold text-foreground mb-2">{activity.name}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
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
                  {(city.cuisine.dishes || []).map((dish, index) => (
                    <div key={index} className="p-6 bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-lg transition-shadow">
                      <h4 className="text-xl font-bold text-foreground mb-2">{dish.name}</h4>
                      <p className="text-muted-foreground">{dish.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Best Time to Visit & Getting There */}
        {(city.bestTime || city.gettingThere) && (
          <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {city.bestTime && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-8 h-8 text-secondary" />
                        <h2 className="text-3xl font-bold text-foreground">Best Time to Visit</h2>
                      </div>
                      <div className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20">
                        <div className="flex items-center gap-2 mb-4">
                          <Sun className="w-6 h-6 text-secondary" />
                          <h3 className="text-2xl font-bold text-foreground">{city.bestTime.season}</h3>
                        </div>
                        <p className="text-lg font-semibold text-foreground mb-3">{city.bestTime.months}</p>
                        <p className="text-muted-foreground mb-4">{city.bestTime.description}</p>
                        <div className="inline-block px-4 py-2 bg-white/50 rounded-lg">
                          <p className="text-sm font-semibold text-foreground">{city.bestTime.temperature}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {city.gettingThere && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Plane className="w-8 h-8 text-secondary" />
                        <h2 className="text-3xl font-bold text-foreground">Getting There</h2>
                      </div>
                      <div className="space-y-6">
                        <div className="p-6 bg-card rounded-xl border border-border/50">
                          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <Plane className="w-5 h-5 text-secondary" />
                            Airport
                          </h4>
                          <p className="text-muted-foreground">{city.gettingThere.airport}</p>
                        </div>
                        {(city.gettingThere.transport || []).length > 0 && (
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
                        )}
                        {city.gettingThere.localTransport && (
                          <div className="p-6 bg-card rounded-xl border border-border/50">
                            <h4 className="font-bold text-foreground mb-3">Local Transport</h4>
                            <p className="text-muted-foreground">{city.gettingThere.localTransport}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Travel Tips Section */}
        {(city.travelTips || []).length > 0 && (
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
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  <Link to="/join">Join Our Community</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full border-2 hover:bg-secondary/10">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Explore More Cities */}
        {otherCities.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Explore More Moroccan Cities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {otherCities.map((otherCity) => (
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
                        <h4 className="text-2xl font-bold text-white mb-1">{otherCity.name}</h4>
                        <p className="text-white/80 text-sm italic">{otherCity.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CityDetail;
