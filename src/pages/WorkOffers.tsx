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
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  Building2,
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WorkOffers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const jobs = [
    {
      id: 1,
      title: "Senior Tour Operations Manager",
      company: "Journey Association",
      location: "Marrakech, Morocco",
      type: "Full-time",
      salary: "Competitive",
      experience: "5+ years",
      posted: "2 days ago",
      description: "Lead our tour operations team and develop innovative travel experiences across Morocco. Perfect for someone passionate about sustainable tourism.",
      responsibilities: [
        "Oversee daily tour operations",
        "Develop new tour packages",
        "Manage tour guide team",
        "Ensure quality standards"
      ],
      requirements: [
        "5+ years in tour operations",
        "Strong leadership skills",
        "Fluent in English and French",
        "Knowledge of Moroccan tourism"
      ],
      benefits: [
        "Health insurance",
        "Performance bonuses",
        "Travel opportunities",
        "Professional development"
      ],
      category: "Management"
    },
    {
      id: 2,
      title: "Mountain Trekking Guide",
      company: "Atlas Adventures",
      location: "Imlil, High Atlas",
      type: "Full-time",
      salary: "MAD 8,000 - 12,000/month",
      experience: "3+ years",
      posted: "1 week ago",
      description: "Join our team of professional mountain guides. Lead trekking expeditions in the stunning Atlas Mountains.",
      responsibilities: [
        "Guide trekking groups safely",
        "Provide cultural insights",
        "Ensure client satisfaction",
        "Maintain safety standards"
      ],
      requirements: [
        "Certified mountain guide",
        "First aid certification",
        "Excellent physical fitness",
        "Multiple language skills"
      ],
      benefits: [
        "Equipment provided",
        "Accommodation support",
        "Training opportunities",
        "Seasonal bonuses"
      ],
      category: "Guiding"
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      company: "Morocco Tourism Board",
      location: "Casablanca, Morocco",
      type: "Full-time",
      salary: "MAD 10,000 - 15,000/month",
      experience: "2+ years",
      posted: "3 days ago",
      description: "Drive our digital marketing initiatives to promote Morocco as a premier travel destination worldwide.",
      responsibilities: [
        "Manage social media campaigns",
        "Create content strategy",
        "Analyze marketing metrics",
        "Coordinate with agencies"
      ],
      requirements: [
        "Digital marketing experience",
        "SEO/SEM knowledge",
        "Creative content creation",
        "Data analysis skills"
      ],
      benefits: [
        "Remote work options",
        "Health coverage",
        "Learning budget",
        "Team retreats"
      ],
      category: "Marketing"
    },
    {
      id: 4,
      title: "Hospitality Coordinator",
      company: "Riad Heritage Group",
      location: "Fes, Morocco",
      type: "Full-time",
      salary: "MAD 7,000 - 10,000/month",
      experience: "2+ years",
      posted: "5 days ago",
      description: "Coordinate operations across our collection of traditional riads. Ensure exceptional guest experiences.",
      responsibilities: [
        "Oversee riad operations",
        "Train hospitality staff",
        "Handle guest relations",
        "Maintain quality standards"
      ],
      requirements: [
        "Hospitality background",
        "Customer service excellence",
        "Multilingual abilities",
        "Cultural sensitivity"
      ],
      benefits: [
        "Accommodation benefits",
        "Meal allowances",
        "Career progression",
        "Staff discounts"
      ],
      category: "Hospitality"
    },
    {
      id: 5,
      title: "Surf Instructor",
      company: "Taghazout Surf School",
      location: "Taghazout, Morocco",
      type: "Seasonal",
      salary: "MAD 6,000 - 9,000/month",
      experience: "1+ years",
      posted: "1 day ago",
      description: "Teach surfing to students of all levels in Morocco's premier surf destination. Season runs October to April.",
      responsibilities: [
        "Conduct surf lessons",
        "Ensure ocean safety",
        "Maintain equipment",
        "Promote surf culture"
      ],
      requirements: [
        "Surf instructor certification",
        "Strong swimming skills",
        "English proficiency",
        "Positive attitude"
      ],
      benefits: [
        "Free accommodation",
        "Equipment access",
        "Flexible schedule",
        "Beach lifestyle"
      ],
      category: "Sports"
    },
    {
      id: 6,
      title: "Cultural Heritage Officer",
      company: "UNESCO Morocco Office",
      location: "Rabat, Morocco",
      type: "Contract",
      salary: "Competitive",
      experience: "4+ years",
      posted: "1 week ago",
      description: "Support preservation and promotion of Morocco's UNESCO World Heritage Sites. 12-month renewable contract.",
      responsibilities: [
        "Monitor heritage sites",
        "Coordinate conservation",
        "Develop educational programs",
        "Liaise with stakeholders"
      ],
      requirements: [
        "Heritage management degree",
        "UNESCO experience preferred",
        "Research capabilities",
        "Report writing skills"
      ],
      benefits: [
        "International exposure",
        "Competitive package",
        "Professional network",
        "Meaningful impact"
      ],
      category: "Conservation"
    }
  ];

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
            <div className="grid gap-6 max-w-5xl mx-auto">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getTypeColor(job.type)} text-white`}>
                            {job.type}
                          </Badge>
                          <Badge variant="outline">{job.category}</Badge>
                          <span className="text-xs text-muted-foreground">{job.posted}</span>
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
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </div>
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
                      <div>
                        <h4 className="font-semibold mb-2 uppercase tracking-wide text-xs">Key Duties</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {job.responsibilities.slice(0, 3).map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 uppercase tracking-wide text-xs">Requirements</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {job.requirements.slice(0, 3).map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 uppercase tracking-wide text-xs">Benefits</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {job.benefits.slice(0, 3).map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
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
