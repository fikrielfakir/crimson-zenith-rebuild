import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Heart, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
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

interface ApplyForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const VolunteersSpontaneous = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<ApplyForm>({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

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

  const applyMutation = useMutation({
    mutationFn: async (payload: ApplyForm & { opportunityTitle: string }) => {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          applicantName: payload.name,
          email: payload.email,
          phone: payload.phone || undefined,
          motivation: `[Volunteer Opportunity: ${payload.opportunityTitle}]\n\n${payload.message}`,
          interests: ['volunteering'],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      setServerError('');
    },
    onError: (err: Error) => {
      setServerError(err.message);
    },
  });

  const openDialog = (opp: Opportunity) => {
    setSelected(opp);
    setSubmitted(false);
    setServerError('');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const closeDialog = () => {
    setSelected(null);
    setSubmitted(false);
    setServerError('');
    applyMutation.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    applyMutation.mutate({ ...form, opportunityTitle: selected.title });
  };

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
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
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
                        {opportunity.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{opportunity.location}</span>
                          </div>
                        )}
                        {opportunity.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{opportunity.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{opportunity.current_participants}/{opportunity.max_participants} volunteers</span>
                        </div>
                      </div>

                      {opportunity.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">{opportunity.description}</p>
                      )}

                      {opportunity.skills && opportunity.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {opportunity.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      )}

                      <Button
                        className="w-full group-hover:scale-105 transition-transform"
                        onClick={() => openDialog(opportunity)}
                        disabled={opportunity.current_participants >= opportunity.max_participants}
                      >
                        {opportunity.current_participants >= opportunity.max_participants
                          ? 'Position Filled'
                          : <>Apply Now <ArrowRight className="ml-2 w-4 h-4" /></>
                        }
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

      {/* Apply Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {submitted ? 'Application Submitted!' : `Apply — ${selected?.title}`}
            </DialogTitle>
            {!submitted && (
              <DialogDescription>
                Fill in your details below and we'll be in touch to confirm your spot.
              </DialogDescription>
            )}
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center gap-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="text-lg font-semibold">Thank you for applying!</p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Your application for <span className="font-medium text-foreground">{selected?.title}</span> has been received. We'll contact you at the email you provided.
              </p>
              <Button className="mt-2 w-full" onClick={closeDialog}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="apply-name">Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="apply-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="apply-email">Email <span className="text-destructive">*</span></Label>
                  <Input
                    id="apply-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="apply-phone">Phone (optional)</Label>
                  <Input
                    id="apply-phone"
                    type="tel"
                    placeholder="+212 6xx xxx xxx"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="apply-message">Why do you want to join? (optional)</Label>
                  <Textarea
                    id="apply-message"
                    placeholder="Tell us a bit about yourself and your motivation..."
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
              </div>

              {serverError && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={applyMutation.isPending}>
                  {applyMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>
                    : 'Submit Application'
                  }
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default VolunteersSpontaneous;
