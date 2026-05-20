import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

interface Opportunity {
  id: number;
  title: string;
  location: string | null;
  duration: string | null;
  max_participants: number;
  current_participants: number;
  description: string | null;
  skills: string[] | null;
  urgency: 'high' | 'medium' | 'low';
  status: string;
}

const VolunteersSpontaneous = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: opportunities = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ['volunteer-opportunities-public'],
    queryFn: async () => {
      const res = await fetch('/api/volunteer-opportunities?status=published&per_page=50');
      if (!res.ok) return [];
      const data = await res.json();
      return data.data ?? data;
    },
  });

  const benefits = [
    "Make a meaningful impact in Moroccan communities",
    "Gain hands-on experience in sustainable tourism",
    "Connect with like-minded adventurers",
    "Flexible scheduling to fit your travel plans",
    "Free training and support materials",
    "Certificate of volunteer service"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        <PageHero
          pageKey="volunteers"
          scrollY={scrollY}
          breadcrumbs={[
            { label: "Talents", href: "/talents" },
            { label: "Volunteers" },
            { label: "Spontaneous" },
          ]}
          defaultTitle="Spontaneous Volunteers"
          defaultSubtitle="Make a difference during your Morocco journey. Join spontaneous volunteer opportunities and contribute to sustainable tourism and community development."
          defaultImage="/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png"
        />

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

            {isLoading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">No opportunities available right now</p>
                <p className="mt-2">Check back soon for new volunteer calls.</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="group hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        variant={opportunity.urgency === 'high' ? 'destructive' : opportunity.urgency === 'medium' ? 'default' : 'secondary'}
                      >
                        {opportunity.urgency.charAt(0).toUpperCase() + opportunity.urgency.slice(1)} Priority
                      </Badge>
                      <Heart className="w-5 h-5 text-muted-foreground hover:text-destructive hover:fill-destructive cursor-pointer transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {opportunity.title}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      {opportunity.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{opportunity.location}</span></div>}
                      {opportunity.duration && <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{opportunity.duration}</span></div>}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{opportunity.current_participants}/{opportunity.max_participants} volunteers</span>
                      </div>
                    </div>

                    {opportunity.description && <p className="text-muted-foreground mb-4">{opportunity.description}</p>}

                    {opportunity.skills && opportunity.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {opportunity.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    )}

                    <Button className="w-full group-hover:scale-105 transition-transform">
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
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
