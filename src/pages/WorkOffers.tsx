import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Home, 
  ChevronRight, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Clock,
  ArrowRight,
  Building2,
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface WorkOffer {
  id: number;
  title: string;
  company: string | null;
  location: string | null;
  type: string | null;
  salary: string | null;
  experience_level: string | null;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  category: string | null;
  created_at: string;
}

const WorkOffers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: jobs = [], isLoading } = useQuery<WorkOffer[]>({
    queryKey: ['work-offers-public'],
    queryFn: async () => {
      const res = await fetch('/api/work-offers?status=published&per_page=50');
      if (!res.ok) return [];
      const data = await res.json();
      return data.data ?? data;
    },
  });


  const filteredJobs = selectedType === "all" 
    ? jobs 
    : jobs.filter(job => job.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time": return "bg-green-500";
      case "Part-time": return "bg-blue-500";
      case "Contract": return "bg-purple-500";
      case "Seasonal": return "bg-orange-500";
      default: return "bg-gray-500";
    }
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
                    Work Offers
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Work Offers
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Explore career opportunities in Morocco's vibrant tourism and adventure industry. Find your dream job and build a meaningful career.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
              >
                All Jobs ({jobs.length})
              </Button>
              <Button 
                variant={selectedType === "Full-time" ? "default" : "outline"}
                onClick={() => setSelectedType("Full-time")}
              >
                Full-time
              </Button>
              <Button 
                variant={selectedType === "Part-time" ? "default" : "outline"}
                onClick={() => setSelectedType("Part-time")}
              >
                Part-time
              </Button>
              <Button 
                variant={selectedType === "Contract" ? "default" : "outline"}
                onClick={() => setSelectedType("Contract")}
              >
                Contract
              </Button>
              <Button 
                variant={selectedType === "Seasonal" ? "default" : "outline"}
                onClick={() => setSelectedType("Seasonal")}
              >
                Seasonal
              </Button>
            </div>
          </div>
        </section>

        {/* Jobs Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground max-w-md mx-auto">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">No work offers available</p>
                <p className="mt-2">{selectedType !== 'all' ? 'Try a different filter.' : 'Check back soon for new opportunities.'}</p>
              </div>
            ) : (
            <div className="grid gap-6 max-w-5xl mx-auto">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getTypeColor(job.type ?? '')} text-white`}>
                            {job.type}
                          </Badge>
                          {job.category && <Badge variant="outline">{job.category}</Badge>}
                        </div>
                        <h3 className="text-2xl font-bold mb-1 hover:text-primary transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          {job.experience_level && <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.experience_level}</span>
                          </div>}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="self-start">
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {job.description}
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 uppercase tracking-wide text-xs">Key Duties</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            {job.responsibilities.slice(0, 3).map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {job.requirements && job.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 uppercase tracking-wide text-xs">Requirements</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            {job.requirements.slice(0, 3).map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 uppercase tracking-wide text-xs">Benefits</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            {job.benefits.slice(0, 3).map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        Apply for this Position
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
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
              <Briefcase className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                Hiring for Your Organization?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                Post your job openings and connect with talented professionals passionate about Morocco's tourism industry.
              </p>
              <Button
                className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Post a Job Opening
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkOffers;
