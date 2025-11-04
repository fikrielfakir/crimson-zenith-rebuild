import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Home, ChevronRight, MapPin, Users, Calendar, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Projects = () => {
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

  const projects = [
    {
      id: 1,
      title: "Sustainable Tourism Initiative",
      description: "Partnering with local communities to develop eco-friendly tourism experiences that preserve Morocco's natural beauty while supporting local economies.",
      category: "Sustainability",
      status: "Active",
      location: "Atlas Mountains",
      participants: 45,
      startDate: "2024-01",
      image: "/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png",
      impact: "Supporting 15 local families",
      goals: ["Eco-tourism development", "Community empowerment", "Cultural preservation"]
    },
    {
      id: 2,
      title: "Youth Education Program",
      description: "Providing educational workshops and mentorship programs for Moroccan youth interested in tourism, hospitality, and cultural heritage preservation.",
      category: "Education",
      status: "Active",
      location: "Tangier & Tetouan",
      participants: 120,
      startDate: "2023-09",
      image: "/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png",
      impact: "250+ students reached",
      goals: ["Skills development", "Career guidance", "Cultural awareness"]
    },
    {
      id: 3,
      title: "Coastal Conservation Project",
      description: "Beach cleanup initiatives and marine life protection programs along Morocco's Mediterranean and Atlantic coastlines.",
      category: "Environment",
      status: "Active",
      location: "Al Hoceima & Essaouira",
      participants: 80,
      startDate: "2024-03",
      image: "/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png",
      impact: "5 tons of waste removed",
      goals: ["Beach preservation", "Marine protection", "Community awareness"]
    },
    {
      id: 4,
      title: "Artisan Marketplace Development",
      description: "Creating platforms and marketplaces for local artisans to showcase and sell their traditional crafts to international audiences.",
      category: "Economic",
      status: "Planning",
      location: "Chefchaouen & Fes",
      participants: 35,
      startDate: "2024-06",
      image: "/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png",
      impact: "30+ artisans supported",
      goals: ["Market access", "Fair trade", "Traditional craft preservation"]
    },
    {
      id: 5,
      title: "Cultural Heritage Documentation",
      description: "Documenting and preserving Morocco's rich cultural heritage through photography, video, and oral history projects.",
      category: "Culture",
      status: "Active",
      location: "Multiple Cities",
      participants: 25,
      startDate: "2023-12",
      image: "/attached_assets/generated_images/Tetouan_medina_panorama_b1f6dcbc.png",
      impact: "500+ stories recorded",
      goals: ["Heritage preservation", "Digital archiving", "Cultural education"]
    },
    {
      id: 6,
      title: "Community Wellness Centers",
      description: "Establishing wellness and sports facilities in underserved communities to promote health and social connection.",
      category: "Health",
      status: "Planning",
      location: "Rural Areas",
      participants: 60,
      startDate: "2024-08",
      image: "/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png",
      impact: "3 communities served",
      goals: ["Health promotion", "Social cohesion", "Youth engagement"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Planning": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Completed": return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Sustainability": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      "Education": "bg-blue-500/10 text-blue-700 border-blue-500/20",
      "Environment": "bg-teal-500/10 text-teal-700 border-teal-500/20",
      "Economic": "bg-amber-500/10 text-amber-700 border-amber-500/20",
      "Culture": "bg-purple-500/10 text-purple-700 border-purple-500/20",
      "Health": "bg-rose-500/10 text-rose-700 border-rose-500/20",
    };
    return colors[category] || "bg-gray-500/10 text-gray-700 border-gray-500/20";
  };

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
              backgroundImage: `url('/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.5) contrast(1.1) saturate(1.2)',
            }}
          />

          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
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
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    Projects
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Our Projects
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Making a difference through meaningful initiatives that empower communities and preserve Morocco's rich heritage.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                Building a <span className="text-primary">better future</span> together
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Our projects focus on sustainable development, cultural preservation, and community empowerment. 
                Each initiative is designed to create lasting positive impact while celebrating Morocco's unique heritage and natural beauty.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className={`overflow-hidden hover:shadow-2xl transition-all duration-300 group border-border/50 hover:border-primary/30 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Project Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${getCategoryColor(project.category)} border font-medium`}>
                        {project.category}
                      </Badge>
                      <Badge className={`${getStatusColor(project.status)} border font-medium`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Project Content */}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Project Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{project.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Since {project.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                        <Target className="w-4 h-4 text-primary" />
                        <span>{project.impact}</span>
                      </div>
                    </div>

                    {/* Project Goals */}
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Key Goals:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.goals.map((goal, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learn More Button */}
                    <Button
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold transition-all duration-300 group/btn"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                Want to Get Involved?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                Join us in making a positive impact. Whether you want to volunteer, partner with us, or support our initiatives, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 px-10 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                >
                  <Link to="/join">
                    Join Our Community
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 rounded-full text-lg font-bold transition-all duration-300"
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
