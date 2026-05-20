import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { 
  Home, 
  ChevronRight, 
  Award, 
  Star,
  MapPin,
  Globe,
  Linkedin,
  CheckCircle2,
  Mail,
  Send
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Expert {
  id: number;
  name: string;
  title: string | null;
  location: string | null;
  image: string | null;
  linkedin_url: string | null;
  contact_email: string | null;
  expertise: string[] | null;
  rating: number;
  projects_count: number;
  years_experience: number;
  languages: string[] | null;
  bio: string | null;
  achievements: string[] | null;
  certifications: string[] | null;
  is_available: boolean;
}

const TalentsExperts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [contactExpert, setContactExpert] = useState<Expert | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: experts = [], isLoading } = useQuery<Expert[]>({
    queryKey: ['experts-public'],
    queryFn: async () => {
      const res = await fetch('/api/experts?status=published&per_page=50');
      if (!res.ok) return [];
      const data = await res.json();
      return data.data ?? data;
    },
  });

  function openContact(expert: Expert) {
    setContactExpert(expert);
    setContactForm({ name: '', email: '', message: '' });
    setContactSent(false);
  }

  function handleSendContact() {
    if (!contactExpert) return;
    const subject = encodeURIComponent(`Enquiry from ${contactForm.name}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`
    );
    if (contactExpert.contact_email) {
      window.open(`mailto:${contactExpert.contact_email}?subject=${subject}&body=${body}`, '_blank');
    }
    setContactSent(true);
  }

  const canSend = contactForm.name.trim() && contactForm.email.trim() && contactForm.message.trim();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

          <div className="relative container mx-auto px-6">
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
            {isLoading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : experts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground max-w-md mx-auto">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">No experts listed yet</p>
                <p className="mt-2">Our expert profiles are coming soon.</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {experts.map((expert) => (
                <Card key={expert.id} className="hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex gap-6 mb-6">
                      <div className="relative">
                        {expert.image ? (
                          <img src={expert.image} alt={expert.name} className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">{expert.name.charAt(0)}</div>
                        )}
                        {expert.is_available && (
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
                            {expert.projects_count} projects
                          </div>
                          <div className="text-muted-foreground">
                            {expert.years_experience} years exp.
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {expert.bio}
                    </p>

                    {expert.expertise && expert.expertise.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {expert.expertise.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {expert.languages && expert.languages.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {expert.languages.map((lang, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />{lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {expert.achievements && expert.achievements.length > 0 && (
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
                    )}

                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        disabled={!expert.is_available}
                        onClick={() => expert.is_available && openContact(expert)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {expert.is_available ? 'Contact Expert' : 'Currently Unavailable'}
                      </Button>
                      {expert.linkedin_url ? (
                        <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="icon" title="View LinkedIn profile">
                            <Linkedin className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" size="icon" disabled title="No LinkedIn profile">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
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

      {/* Contact Expert Modal */}
      <Dialog open={!!contactExpert} onOpenChange={(open) => !open && setContactExpert(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact {contactExpert?.name}
            </DialogTitle>
          </DialogHeader>

          {contactSent ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-semibold text-lg">Message ready to send!</p>
              <p className="text-muted-foreground text-sm">Your email client has opened with the message pre-filled. Send it to get in touch with {contactExpert?.name}.</p>
              <Button className="mt-2 w-full" onClick={() => setContactExpert(null)}>Done</Button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {contactExpert && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {contactExpert.image ? (
                    <img src={contactExpert.image} alt={contactExpert.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{contactExpert.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{contactExpert.name}</p>
                    <p className="text-xs text-muted-foreground">{contactExpert.title}</p>
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Your Name</Label>
                <Input
                  placeholder="Your full name"
                  value={contactForm.name}
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Your Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  rows={4}
                  placeholder="Describe your project or question…"
                  value={contactForm.message}
                  onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setContactExpert(null)}>Cancel</Button>
                <Button className="flex-1" disabled={!canSend} onClick={handleSendContact}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This will open your email client with the message pre-filled.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default TalentsExperts;
