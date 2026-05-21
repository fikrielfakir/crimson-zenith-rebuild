import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateDrawer from "@/components/DonateDrawer";
import { ArrowRight, MapPin, Users, Calendar, Target, Filter, ArrowUp, ChevronLeft, Mail, Leaf, GraduationCap, Palmtree, Heart, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHero from "@/components/PageHero";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  image: string | null;
  progress: number;
  funding_goal: number | null;
  current_funding: number | null;
  participants_count: number;
  impact_people: number;
  impact_description: string | null;
  is_featured: boolean;
  is_published: boolean;
  achievements: string[];
}

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isDonateDrawerOpen, setIsDonateDrawerOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: projectsData = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects-public'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      return data.data ?? data;
    },
  });

  const categories = ["All", "Environment", "Education", "Culture", "Community", "Tourism"];

  const highlightedProjects = projectsData.filter(p => p.is_featured).slice(0, 4);
  const allProjects = projectsData;

  const successStories = [
    {
      id: 1,
      title: "Transforming Lives in the Atlas Mountains",
      quote: "This project brought sustainable tourism to our village, creating jobs and preserving our culture.",
      author: "Ahmed, Local Guide",
      region: "Imlil, Atlas Mountains",
      impact: "50 families empowered",
      image: "/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png"
    },
    {
      id: 2,
      title: "Youth Finding Their Path",
      quote: "The education program gave me skills and confidence to start my own tourism business.",
      author: "Fatima, Entrepreneur",
      region: "Tangier",
      impact: "120 students graduated",
      image: "/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png"
    },
    {
      id: 3,
      title: "Protecting Our Coastal Heritage",
      quote: "Our beaches are cleaner and marine life is thriving thanks to community efforts.",
      author: "Hassan, Fisherman",
      region: "Al Hoceima",
      impact: "8 beaches restored",
      image: "/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png"
    }
  ];

  const filteredProjects = selectedCategory === "All" 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Ongoing": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Planning":
      case "Upcoming": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Completed": return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...routeSEO["/projects"]} />
      <Header />
      
      <main className="relative">
        <PageHero
          pageKey="projects"
          scrollY={scrollY}
          breadcrumbs={[{ label: "Projects" }]}
          defaultTitle="Our Projects"
          defaultSubtitle="Making a difference through meaningful initiatives that empower communities and preserve Morocco's rich heritage."
          defaultImage="/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png"
        />

        {/* Highlighted Projects Overview */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Highlighting our most impactful initiatives across Morocco
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : highlightedProjects.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No featured projects yet.</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlightedProjects.map((project, index) => (
                <Card 
                  key={project.id}
                  className={`overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/30 hover:-translate-y-2 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center"><Building className="w-12 h-12 text-primary/40" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(project.status)} border font-medium`}>
                      {project.status}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{project.location}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Progress</span>
                        <span className="text-primary">{project.progress ?? 0}%</span>
                      </div>
                      <Progress value={project.progress ?? 0} className="h-2" />
                    </div>

                    <Button className="w-full mt-2 rounded-full text-sm group/btn">
                      Learn More
                      <ArrowRight className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Filter and Category Bar */}
        <section className="sticky top-[80px] z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select className="text-sm border border-border rounded-full px-4 py-2 bg-background">
                  <option>Sort by Date</option>
                  <option>Sort by Impact</option>
                  <option>Sort by Location</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Projects Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground max-w-md mx-auto">
                <Building className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">{selectedCategory !== 'All' ? `No ${selectedCategory} projects yet` : 'No projects available'}</p>
                <p className="mt-2">Check back soon for updates.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/30"
                >
                  <div className="relative h-56 overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center"><Building className="w-12 h-12 text-primary/40" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${getStatusColor(project.status)} border font-medium`}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{project.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                      <div className="text-center">
                        <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs font-semibold">{project.impact_people ?? 0}</p>
                        <p className="text-xs text-muted-foreground">People</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{project.participants_count ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Participants</p>
                      </div>
                      <div className="text-center">
                        <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{project.progress ?? 0}%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>

                    <Button className="w-full rounded-full group/btn">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-primary to-slate-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
              <p className="text-lg text-white/80">Creating lasting change across Morocco</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="mb-4 inline-block p-4 bg-white/10 rounded-full">
                  <Target className="w-12 h-12 text-secondary" />
                </div>
                <h3 className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform">200+</h3>
                <p className="text-xl text-white/80">Projects Completed</p>
              </div>

              <div className="text-center group">
                <div className="mb-4 inline-block p-4 bg-white/10 rounded-full">
                  <Users className="w-12 h-12 text-secondary" />
                </div>
                <h3 className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform">80+</h3>
                <p className="text-xl text-white/80">Communities Empowered</p>
              </div>

              <div className="text-center group">
                <div className="mb-4 inline-block p-4 bg-white/10 rounded-full">
                  <Heart className="w-12 h-12 text-secondary" />
                </div>
                <h3 className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform">1M+</h3>
                <p className="text-xl text-white/80">Visitors Impacted</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Carousel */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground">Real impact, real people, real change</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <Card className="overflow-hidden border-2">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={successStories[currentStoryIndex].image}
                      alt={successStories[currentStoryIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
                  </div>

                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {successStories[currentStoryIndex].title}
                    </h3>
                    <blockquote className="text-lg text-muted-foreground italic mb-6 border-l-4 border-primary pl-4">
                      "{successStories[currentStoryIndex].quote}"
                    </blockquote>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">
                        — {successStories[currentStoryIndex].author}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {successStories[currentStoryIndex].region}
                      </p>
                      <Badge className="bg-green-500/10 text-green-700 border-green-500/20 border">
                        {successStories[currentStoryIndex].impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevStory}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  {successStories.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStoryIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentStoryIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextStory}
                  className="rounded-full"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
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
                Join Us in Shaping Morocco's Sustainable Future
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                Be part of the change. Your support helps us create lasting impact in communities across Morocco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 px-10 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                >
                  <Link to="/join">
                    Volunteer
                    <Users className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
                <Button
                  onClick={() => setIsDonateDrawerOpen(true)}
                  className="bg-secondary hover:bg-secondary/90 text-white px-10 py-7 rounded-full text-lg font-bold shadow-2xl transition-all duration-300 group"
                >
                  <Heart className="mr-3 w-6 h-6" />
                  Donate
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 rounded-full text-lg font-bold transition-all duration-300"
                >
                  <Link to="/contact">
                    Partner With Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to our newsletter for the latest project updates and success stories
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 rounded-full px-6"
                />
                <Button className="h-12 px-8 rounded-full font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </main>
      
      <Footer />
      
      <DonateDrawer 
        open={isDonateDrawerOpen}
        onOpenChange={setIsDonateDrawerOpen}
      />
    </div>
  );
};

export default Projects;
