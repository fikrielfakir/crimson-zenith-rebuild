import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Discover = () => {
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
      
      <main>
        <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-primary/90" style={{ marginTop: '10rem' }}>
          <div className="container mx-auto px-6">
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-white/70 text-sm">
                <li>
                  <Link to="/" className="flex items-center hover:text-white transition-colors">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/40" />
                  <span className="text-white font-medium">Discover</span>
                </li>
              </ol>
            </nav>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Discover
            </h1>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Morocco, a melting pot of dynasties and cultures
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From the northern coastal cities touching the Mediterranean to the ancient imperial cities steeped in history, Morocco offers an incredible tapestry of experiences. Each city tells its own unique story, shaped by centuries of diverse cultural influences, from Berber traditions to Arab, Andalusian, and European heritage. Discover the soul of Morocco through its most captivating cities, where ancient medinas meet modern vitality, and every street corner reveals a new chapter in this nation's rich cultural narrative. These destinations are not just places to visit—they are living museums where Morocco's past and present dance together in perfect harmony.
              </p>
            </div>

            {cities.map((city, index) => (
              <div
                key={city.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 md:gap-12 items-center mb-24 pb-24 border-b border-border/30 last:border-0`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                      {city.name}
                    </h3>
                    <p className="text-xl text-primary font-semibold mb-4 italic">
                      {city.title}
                    </p>
                  </div>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {city.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {city.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full border border-secondary/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <Button
                    className="mt-6 bg-[#1a9b8e] hover:bg-[#158074] text-white px-8 py-6 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    DISCOVER MORE
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
