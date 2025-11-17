import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Home, 
  ChevronRight, 
  Heart, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VolunteersSpontaneous = () => {
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

  const benefits = [
    "Make a meaningful impact in Moroccan communities",
    "Gain hands-on experience in sustainable tourism",
    "Connect with like-minded adventurers",
    "Flexible scheduling to fit your travel plans",
    "Free training and support materials",
    "Certificate of volunteer service"
  ];

  const opportunities = [
    {
      id: 1,
      title: "Trail Maintenance - Atlas Mountains",
      location: "Imlil, High Atlas",
      duration: "1-3 days",
      participants: "8/12 volunteers",
      description: "Help maintain hiking trails and support local guides in the High Atlas region.",
      skills: ["Physical fitness", "Teamwork", "Outdoor experience"],
      urgency: "High"
    },
    {
      id: 2,
      title: "Beach Cleanup - Essaouira",
      location: "Essaouira Beach",
      duration: "Half day",
      participants: "15/20 volunteers",
      description: "Join our coastal conservation effort to keep Morocco's beaches pristine.",
      skills: ["Commitment", "Environmental awareness"],
      urgency: "Medium"
    },
    {
      id: 3,
      title: "Community Garden Project",
      location: "Marrakech",
      duration: "Flexible",
      participants: "5/10 volunteers",
      description: "Support local communities in creating sustainable urban gardens.",
      skills: ["Gardening", "Community engagement"],
      urgency: "Low"
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
              backgroundImage: `url('/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png')`,
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
                    Spontaneous
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Spontaneous Volunteers
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Make a difference during your Morocco journey. Join spontaneous volunteer opportunities and contribute to sustainable tourism and community development.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                Volunteer on <span className="text-primary">Your Schedule</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
                Whether you have a few hours or a few days, there's always a way to give back. Our spontaneous volunteer program connects travelers with meaningful community projects across Morocco.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Available Opportunities */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Current Opportunities</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Browse available volunteer positions and sign up for what interests you most
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="group hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        variant={opportunity.urgency === 'High' ? 'destructive' : opportunity.urgency === 'Medium' ? 'default' : 'secondary'}
                      >
                        {opportunity.urgency} Priority
                      </Badge>
                      <Heart className="w-5 h-5 text-muted-foreground hover:text-destructive hover:fill-destructive cursor-pointer transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {opportunity.title}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{opportunity.participants}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">
                      {opportunity.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {opportunity.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full group-hover:scale-105 transition-transform">
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
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
                Ready to Make a Difference?
              </h2>
              <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed">
                Join our community of passionate volunteers and help create positive change in Morocco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-white text-primary hover:bg-white/90 px-12 py-7 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  Sign Up Now
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-12 py-7 rounded-full text-lg font-bold"
                >
                  Learn More
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

export default VolunteersSpontaneous;
