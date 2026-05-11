import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Home, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { moroccoCities } from "@/lib/citiesData";

interface City {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
}

interface DiscoverSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  intro_heading: string;
  intro_description: string;
  cta_heading: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

const defaultSettings: DiscoverSettings = {
  hero_title: 'Discover',
  hero_subtitle: "Embark on a journey through Morocco's most enchanting destinations. From ancient medinas to coastal paradises, discover the soul of this magnificent country.",
  hero_bg_image: '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png',
  intro_heading: 'Morocco, a melting pot of dynasties and cultures',
  intro_description: "From the northern coastal cities touching the Mediterranean to the ancient imperial cities steeped in history, Morocco offers an incredible tapestry of experiences. Each city tells its own unique story, shaped by centuries of diverse cultural influences, from Berber traditions to Arab, Andalusian, and European heritage. Discover the soul of Morocco through its most captivating cities, where ancient medinas meet modern vitality, and every street corner reveals a new chapter in this nation's rich cultural narrative.",
  cta_heading: 'Ready to Start Your Journey?',
  cta_description: 'Join us to explore these magnificent cities and create unforgettable memories in Morocco.',
  cta_button_text: 'JOIN THE JOURNEY',
  cta_button_link: '/join-us',
};

async function fetchCities(): Promise<City[]> {
  const res = await apiFetch('/api/cities');
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

async function fetchDiscoverSettings(): Promise<DiscoverSettings> {
  const res = await apiFetch('/api/cms/discover');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

const Discover = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: apiCities, isError: citiesError } = useQuery({
    queryKey: ['public-cities'],
    queryFn: fetchCities,
    retry: 1,
  });

  const { data: settingsData } = useQuery({
    queryKey: ['discover-settings-public'],
    queryFn: fetchDiscoverSettings,
    retry: 1,
  });

  const settings: DiscoverSettings = settingsData ?? defaultSettings;

  const cities: City[] = (!citiesError && apiCities && apiCities.length > 0)
    ? apiCities
    : moroccoCities.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        title: c.title,
        description: c.description,
        image: c.image,
        highlights: c.highlights,
      }));

  const heroBg = settings.hero_bg_image || defaultSettings.hero_bg_image;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${heroBg}')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

          <div className="relative container mx-auto px-6">
            <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link 
                    to="/" 
                    className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
                  >
                    <Home className="w-4 h-4 mr-1.5" />
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    Discover
                  </span>
                </li>
              </ol>
            </nav>

            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                {settings.hero_title || defaultSettings.hero_title}
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                {settings.hero_subtitle || defaultSettings.hero_subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                {settings.intro_heading
                  ? settings.intro_heading.split(' of ').length > 1
                    ? (
                      <>
                        {settings.intro_heading.split(' of ')[0]} of{' '}
                        <span className="text-primary">{settings.intro_heading.split(' of ').slice(1).join(' of ')}</span>
                      </>
                    )
                    : settings.intro_heading
                  : (
                    <>Morocco, a melting pot of <span className="text-primary">dynasties and cultures</span></>
                  )
                }
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {settings.intro_description || defaultSettings.intro_description}
              </p>
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            {cities.map((city, index) => (
              <div
                key={city.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-10 md:gap-16 items-center mb-32 last:mb-16 transition-all duration-700`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-[450px] md:h-[500px] object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="text-5xl font-bold text-white drop-shadow-2xl">
                        {city.name}
                      </h3>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full" />
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                      {city.name}
                    </h3>
                    <p className="text-xl md:text-2xl text-primary font-semibold italic border-l-4 border-primary pl-4">
                      {city.title}
                    </p>
                  </div>

                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {city.description}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {(city.highlights || []).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-secondary/10 text-secondary text-sm font-medium rounded-full border border-secondary/20 hover:bg-secondary/20 hover:border-secondary/40 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <Button
                    asChild
                    className="mt-8 bg-gradient-to-r from-[#1a9b8e] to-[#158074] hover:from-[#158074] hover:to-[#0f5f56] text-white px-10 py-7 rounded-full text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-[#1a9b8e]/20"
                  >
                    <Link to={`/discover/cities?city=${city.slug}`}>
                      DISCOVER MORE
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                {settings.cta_heading || defaultSettings.cta_heading}
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                {settings.cta_description || defaultSettings.cta_description}
              </p>
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                <Link to={settings.cta_button_link || defaultSettings.cta_button_link}>
                  {settings.cta_button_text || defaultSettings.cta_button_text}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
