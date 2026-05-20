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
  Calendar,
  Clock,
  Users,
  ArrowRight,
  BookmarkPlus
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface VolunteerPost {
  id: number;
  title: string;
  location: string | null;
  type: string | null;
  duration: string | null;
  commitment: string | null;
  start_date: string | null;
  deadline: string | null;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  category: string | null;
  status: string;
}

const VolunteersPosts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: posts = [], isLoading } = useQuery<VolunteerPost[]>({
    queryKey: ['volunteer-posts-public'],
    queryFn: async () => {
      const res = await fetch('/api/volunteer-posts?status=published&per_page=50');
      if (!res.ok) return [];
      const data = await res.json();
      return data.data ?? data;
    },
  });

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "Tourism": return "bg-primary";
      case "Environment": return "bg-green-500";
      case "Education": return "bg-blue-500";
      case "Agriculture": return "bg-amber-500";
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
              backgroundImage: `url('/attached_assets/generated_images/Tetouan_medina_panorama_b1f6dcbc.png')`,
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
                  <span className="text-white/90">Volunteers</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    Available Posts
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Available Volunteer Posts
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Find structured volunteer positions across Morocco. Make a lasting impact while gaining valuable experience in your field of interest.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">All Posts</Button>
              <Button variant="outline">Tourism</Button>
              <Button variant="outline">Environment</Button>
              <Button variant="outline">Education</Button>
              <Button variant="outline">Agriculture</Button>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground max-w-md mx-auto">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">No volunteer posts available</p>
                <p className="mt-2">Check back soon for new structured volunteer positions.</p>
              </div>
            ) : (
            <div className="grid gap-8 max-w-5xl mx-auto">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={`${getCategoryColor(post.category)} text-white`}>
                            {post.category}
                          </Badge>
                          <Badge variant="outline">{post.type}</Badge>
                        </div>
                        <h3 className="text-3xl font-bold mb-2 hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{post.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{post.commitment}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {post.start_date && <div className="text-sm">
                          <div className="text-muted-foreground">Starts</div>
                          <div className="font-semibold">{new Date(post.start_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div>
                        </div>}
                        {post.deadline && <div className="text-sm">
                          <div className="text-muted-foreground">Apply by</div>
                          <div className="font-semibold text-destructive">{new Date(post.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        </div>}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      {post.responsibilities && post.responsibilities.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Responsibilities</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {post.responsibilities.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {post.requirements && post.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Requirements</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {post.requirements.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {post.benefits && post.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide">Benefits</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {post.benefits.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <Button variant="outline">
                        <BookmarkPlus className="w-4 h-4" />
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                Don't See the Perfect Fit?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                We're always looking for talented individuals. Send us your CV and let us know your interests.
              </p>
              <Button
                className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Submit General Application
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

export default VolunteersPosts;
