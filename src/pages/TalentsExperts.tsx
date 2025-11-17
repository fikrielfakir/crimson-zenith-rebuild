import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Home, 
  ChevronRight, 
  Award, 
  Star,
  MapPin,
  Globe,
  Linkedin,
  Mail,
  Phone,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TalentsExperts = () => {
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

  const experts = [
    {
      id: 1,
      name: "Dr. Amina Benali",
      title: "Sustainable Tourism Consultant",
      location: "Marrakech, Morocco",
      image: "/api/placeholder/200/200",
      expertise: ["Ecotourism", "Community Development", "Cultural Heritage"],
      rating: 5.0,
      projects: 48,
      years: 15,
      languages: ["English", "French", "Arabic"],
      bio: "Leading expert in sustainable tourism with over 15 years of experience developing eco-friendly tourism initiatives across North Africa.",
      achievements: [
        "UNESCO Heritage Tourism Award 2022",
        "Advisor to Ministry of Tourism",
        "Published 12 research papers on sustainable tourism"
      ],
      certifications: [
        "Certified Sustainable Tourism Professional",
        "PhD in Environmental Management"
      ],
      available: true
    },
    {
      id: 2,
      name: "Hassan El Khoury",
      title: "Mountain Guide & Safety Expert",
      location: "Imlil, High Atlas",
      image: "/api/placeholder/200/200",
      expertise: ["Mountain Guiding", "Safety Training", "First Aid"],
      rating: 4.9,
      projects: 156,
      years: 20,
      languages: ["English", "French", "Arabic", "Berber"],
      bio: "Master mountain guide with two decades of experience in the Atlas Mountains. Specialist in high-altitude trekking and wilderness safety.",
      achievements: [
        "Rescued 23 climbers in emergency situations",
        "Trained over 200 professional guides",
        "First Moroccan to summit K2"
      ],
      certifications: [
        "IFMGA International Mountain Guide",
        "Wilderness First Responder"
      ],
      available: false
    },
    {
      id: 3,
      name: "Fatima Zahra",
      title: "Cultural Heritage Specialist",
      location: "Fes, Morocco",
      image: "/api/placeholder/200/200",
      expertise: ["Historical Sites", "Traditional Crafts", "Heritage Conservation"],
      rating: 4.8,
      projects: 34,
      years: 12,
      languages: ["English", "French", "Arabic"],
      bio: "Passionate about preserving Morocco's rich cultural heritage. Expertise in traditional architecture and artisan craftsmanship.",
      achievements: [
        "Restored 5 historical riads in Fes medina",
        "UNESCO consultant for heritage sites",
        "Published author on Moroccan architecture"
      ],
      certifications: [
        "Master's in Heritage Conservation",
        "Certified Heritage Guide"
      ],
      available: true
    },
    {
      id: 4,
      name: "Omar Benjelloun",
      title: "Adventure Sports Coordinator",
      location: "Dakhla, Morocco",
      image: "/api/placeholder/200/200",
      expertise: ["Kitesurfing", "Water Sports", "Event Management"],
      rating: 4.9,
      projects: 89,
      years: 10,
      languages: ["English", "Spanish", "French", "Arabic"],
      bio: "Elite kitesurfing instructor and adventure tourism entrepreneur. Pioneered Morocco's kitesurfing industry in Dakhla.",
      achievements: [
        "IKO Master Instructor Trainer",
        "Organized 15 international competitions",
        "Built Morocco's largest kite school"
      ],
      certifications: [
        "IKO Level 3 Instructor Trainer",
        "Event Management Professional"
      ],
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
            }}
          />

          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

          {/* Content */}
          <div className="relative container mx-auto px-6">
            {/* Breadcrumb Navigation */}
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
                  <span className="text-white/90">Talents</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    Our Experts
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Our Experts
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Meet our network of seasoned professionals. From mountain guides to cultural specialists, connect with Morocco's finest experts for your projects and adventures.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Expert Professionals</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years Average Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4.9</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Experts Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {experts.map((expert) => (
                <Card key={expert.id} className="hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex gap-6 mb-6">
                      <div className="relative">
                        <img 
                          src={expert.image} 
                          alt={expert.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        {expert.available && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{expert.name}</h3>
                        <p className="text-primary font-semibold mb-2">{expert.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{expert.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{expert.rating}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {expert.projects} projects
                          </div>
                          <div className="text-muted-foreground">
                            {expert.years} years exp.
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {expert.bio}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {expert.expertise.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {expert.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-2 text-sm">Key Achievements</h4>
                      <ul className="space-y-1">
                        {expert.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1" disabled={!expert.available}>
                        {expert.available ? 'Contact Expert' : 'Currently Unavailable'}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <Award className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                Are You an Expert?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                Join our network of professionals and share your expertise with travelers and organizations across Morocco.
              </p>
              <Button
                className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Apply to Join
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TalentsExperts;
