import { useState, useEffect } from "react";
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

const VolunteersPosts = () => {
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

  const posts = [
    {
      id: 1,
      title: "Community Tourism Coordinator",
      location: "Chefchaouen, Rif Mountains",
      type: "Long-term",
      duration: "6 months",
      commitment: "Full-time",
      startDate: "March 2025",
      deadline: "January 15, 2025",
      description: "Lead community-based tourism initiatives in the beautiful blue city. Work with local artisans and guides to develop sustainable tourism experiences.",
      responsibilities: [
        "Coordinate with local communities",
        "Develop tourism programs",
        "Train local guides",
        "Organize cultural events"
      ],
      requirements: [
        "Fluent in English and French",
        "Experience in tourism or community development",
        "Cultural sensitivity",
        "Strong organizational skills"
      ],
      benefits: [
        "Accommodation provided",
        "Monthly stipend",
        "Cultural immersion",
        "Professional development"
      ],
      category: "Tourism"
    },
    {
      id: 2,
      title: "Environmental Education Volunteer",
      location: "Al Hoceima National Park",
      type: "Medium-term",
      duration: "3 months",
      commitment: "Part-time",
      startDate: "February 2025",
      deadline: "December 30, 2024",
      description: "Support environmental education programs in Morocco's stunning coastal national park. Help raise awareness about marine conservation.",
      responsibilities: [
        "Conduct educational workshops",
        "Create awareness materials",
        "Assist in research projects",
        "Organize beach cleanups"
      ],
      requirements: [
        "Background in environmental science",
        "Good communication skills",
        "Passion for conservation",
        "Basic Arabic helpful"
      ],
      benefits: [
        "Shared accommodation",
        "Training provided",
        "Certificate of service",
        "Network opportunities"
      ],
      category: "Environment"
    },
    {
      id: 3,
      title: "Digital Skills Trainer",
      location: "Tangier",
      type: "Short-term",
      duration: "1 month",
      commitment: "Full-time",
      startDate: "January 2025",
      deadline: "December 20, 2024",
      description: "Teach digital literacy and online marketing skills to local youth and entrepreneurs looking to expand their businesses.",
      responsibilities: [
        "Conduct training sessions",
        "Develop course materials",
        "Mentor participants",
        "Assess progress"
      ],
      requirements: [
        "Digital marketing expertise",
        "Teaching experience",
        "English proficiency",
        "Patient and adaptive"
      ],
      benefits: [
        "Accommodation support",
        "Local transport",
        "Cultural activities",
        "Recommendation letter"
      ],
      category: "Education"
    },
    {
      id: 4,
      title: "Sustainable Agriculture Advisor",
      location: "Ouarzazate Region",
      type: "Long-term",
      duration: "12 months",
      commitment: "Full-time",
      startDate: "April 2025",
      deadline: "February 1, 2025",
      description: "Support local farmers in implementing sustainable agricultural practices and improving crop yields in the desert region.",
      responsibilities: [
        "Provide technical guidance",
        "Organize farmer workshops",
        "Monitor project progress",
        "Document best practices"
      ],
      requirements: [
        "Agriculture or agronomy degree",
        "2+ years field experience",
        "Willingness to work rurally",
        "French or Arabic speaking"
      ],
      benefits: [
        "Full room and board",
        "Monthly allowance",
        "Transport provided",
        "Professional references"
      ],
      category: "Agriculture"
    }
  ];

  const getCategoryColor = (category: string) => {
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
                        <div className="text-sm">
                          <div className="text-muted-foreground">Starts</div>
                          <div className="font-semibold">{post.startDate}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Apply by</div>
                          <div className="font-semibold text-destructive">{post.deadline}</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
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
