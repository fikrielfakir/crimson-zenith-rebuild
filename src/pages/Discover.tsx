import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Home, ChevronRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Discover = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cities = [
    {
      id: 1,
      name: "Tangier",
      title: "Gateway Between Continents",
      description: "Tangier, Morocco's gateway between Africa and Europe, is a captivating city where cultures converge at the crossroads of the Mediterranean Sea and the Atlantic Ocean. This historic port city has long been a melting pot of civilizations, attracting artists, writers, and travelers from around the world. Explore the vibrant medina with its maze of narrow streets, visit the historic Kasbah overlooking the Strait of Gibraltar, and experience the city's unique blend of Moroccan, Spanish, and French influences. From the legendary Café Hafa where literary giants once gathered to the pristine beaches along the coast, Tangier offers an unforgettable journey through Morocco's cosmopolitan soul.",
      image: "/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png",
      highlights: ["Historic Kasbah", "Café Hafa", "Strait of Gibraltar", "American Legation Museum"]
    },
    {
      id: 2,
      name: "Tetouan",
      title: "The White Dove",
      description: "Nestled in the Rif Mountains, Tetouan is known as 'The White Dove' for its stunning whitewashed buildings that cascade down the mountainside. This UNESCO World Heritage site boasts one of Morocco's best-preserved medinas, where Andalusian architecture tells the story of its Spanish-Moorish heritage. The city's rich cultural tapestry is woven from centuries of cross-Mediterranean influence, visible in its intricate zellige tilework, ornate wooden doors, and vibrant souks. Tetouan serves as an excellent base for exploring the nearby Rif Mountains and Mediterranean beaches, offering visitors a perfect blend of mountain air, coastal beauty, and authentic Moroccan traditions.",
      image: "/attached_assets/generated_images/Tetouan_medina_panorama_b1f6dcbc.png",
      highlights: ["UNESCO Medina", "Royal Palace", "Archaeological Museum", "Rif Mountains"]
    },
    {
      id: 3,
      name: "Al Hoceima",
      title: "Mediterranean Paradise",
      description: "Al Hoceima is Morocco's hidden gem on the Mediterranean coast, a pristine paradise known for its crystal-clear turquoise waters and dramatic mountainous coastline. This charming coastal city offers some of the most beautiful beaches in Morocco, including the famous Plage Quemado and the protected Al Hoceima National Park. The region's natural beauty is complemented by warm Berber hospitality and fresh Mediterranean cuisine featuring the day's catch. Al Hoceima provides an authentic escape from the tourist crowds, where visitors can enjoy water sports, hiking in the nearby Rif Mountains, or simply relaxing on secluded beaches while taking in breathtaking coastal vistas.",
      image: "/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png",
      highlights: ["Plage Quemado", "National Park", "Peñón de Alhucemas", "Rif Mountain Trails"]
    },
    {
      id: 4,
      name: "Chefchaouen",
      title: "The Blue Pearl",
      description: "Chefchaouen, affectionately known as the 'Blue Pearl' of Morocco, is a mesmerizing mountain town where every corner reveals a new shade of blue. Founded in 1471 as a fortress to fight Portuguese invasions, this picturesque city in the Rif Mountains has become one of Morocco's most photographed destinations. The tradition of painting buildings in varying shades of blue is said to have been introduced by Jewish refugees in the 1930s, symbolizing heaven and spirituality. Today, wandering through Chefchaouen's azure-hued streets feels like stepping into a living work of art, where traditional Moroccan craftsmanship meets stunning natural mountain scenery.",
      image: "/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png",
      highlights: ["Blue Medina", "Spanish Mosque", "Ras El Maa Waterfall", "Traditional Crafts"]
    },
    {
      id: 5,
      name: "Fes",
      title: "Spiritual & Cultural Heart",
      description: "Fes el-Bali, the ancient walled city of Fes, is the world's largest car-free urban area and one of the best-preserved medieval cities in the Arab world. Founded in the 9th century, Fes served as Morocco's capital for over 400 years and remains the country's spiritual and cultural heart. The medina's labyrinthine alleys lead to architectural treasures, including the University of Al Quaraouiyine, recognized by UNESCO as the oldest continuously operating university in the world. The famous tanneries, where leather has been processed using medieval techniques for centuries, create one of the city's most iconic scenes. Fes offers an immersive journey into authentic Moroccan traditions, craftsmanship, and Islamic scholarship.",
      image: "/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png",
      highlights: ["Al Quaraouiyine University", "Chouara Tannery", "Bou Inania Madrasa", "Royal Palace Gates"]
    },
    {
      id: 6,
      name: "Essaouira",
      title: "Wind City of Africa",
      description: "Essaouira, Morocco's 'Wind City of Africa,' is a laid-back coastal gem where Atlantic breezes sweep through whitewashed and blue-shuttered streets. This former Portuguese trading post, now a UNESCO World Heritage site, perfectly balances bohemian charm with historical grandeur. The city's impressive fortifications, designed by European engineers in the 18th century, protect a medina filled with art galleries, music venues, and workshops of talented craftsmen. Essaouira is renowned for its fresh seafood, vibrant gnaoua music scene, and as a world-class destination for windsurfing and kitesurfing. The city's relaxed atmosphere, coupled with its rich artistic heritage, makes it a favorite among artists, musicians, and travelers seeking an authentic yet cosmopolitan Moroccan experience.",
      image: "/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png",
      highlights: ["Skala de la Ville", "Fishing Port", "Gnaoua Festival", "Windsurfing"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Cinematic Design */}
        <section className="relative h-[75vh] min-h-[600px] w-full overflow-hidden" style={{ marginTop: '5rem' }}>
          {/* Parallax Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-slate-800"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            {/* Overlay Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }} />
            </div>
          </div>

          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

          {/* Content Container */}
          <div className="relative h-full flex flex-col justify-between container mx-auto px-6 py-8">
            {/* Top Section: Back Button & Breadcrumb */}
            <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl mb-6 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>

              <nav>
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <Link 
                      to="/" 
                      className="flex items-center text-white/80 hover:text-white transition-colors duration-300 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30"
                    >
                      <Home className="w-3.5 h-3.5 mr-1.5" />
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1 text-white/50" />
                    <span className="text-white font-semibold bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                      Discover
                    </span>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Center Section: Main Heading */}
            <div className="flex-1 flex items-center justify-center">
              <div className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                  Discover
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light tracking-wide drop-shadow-lg">
                  Embark on a journey through Morocco's most enchanting destinations
                </p>
              </div>
            </div>

            {/* Bottom Section: Scroll Indicator */}
            <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex flex-col items-center gap-2 text-white/70">
                <span className="text-sm font-medium tracking-wider">SCROLL TO EXPLORE</span>
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                  <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                Morocco, a melting pot of <span className="text-primary">dynasties and cultures</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                From the northern coastal cities touching the Mediterranean to the ancient imperial cities steeped in history, Morocco offers an incredible tapestry of experiences. Each city tells its own unique story, shaped by centuries of diverse cultural influences, from Berber traditions to Arab, Andalusian, and European heritage. Discover the soul of Morocco through its most captivating cities, where ancient medinas meet modern vitality, and every street corner reveals a new chapter in this nation's rich cultural narrative.
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
                } gap-10 md:gap-16 items-center mb-32 last:mb-16 transition-all duration-700 hover:transform`}
              >
                {/* Image Container */}
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                    {/* Image */}
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-[450px] md:h-[500px] object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* City Name Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="text-5xl font-bold text-white drop-shadow-2xl">
                        {city.name}
                      </h3>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full" />
                  </div>
                </div>

                {/* Content Container */}
                <div className="w-full md:w-1/2 space-y-6">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <h3 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                      {city.name}
                    </h3>
                    <p className="text-xl md:text-2xl text-primary font-semibold italic border-l-4 border-primary pl-4">
                      {city.title}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {city.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {city.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-secondary/10 text-secondary text-sm font-medium rounded-full border border-secondary/20 hover:bg-secondary/20 hover:border-secondary/40 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="mt-8 bg-gradient-to-r from-[#1a9b8e] to-[#158074] hover:from-[#158074] hover:to-[#0f5f56] text-white px-10 py-7 rounded-full text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-2 border-[#1a9b8e]/20"
                  >
                    <Link to={`/city/${city.id}`}>
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
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                Join us to explore these magnificent cities and create unforgettable memories in Morocco.
              </p>
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              >
                <Link to="/join-us">
                  JOIN THE JOURNEY
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
