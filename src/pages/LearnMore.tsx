import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Award, 
  Users, 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  CheckCircle,
  FileText,
  Headphones,
  MessageCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const LearnMore = () => {
  const [activeTab, setActiveTab] = useState("about");

  // Certification badges data
  const certifications = [
    {
      name: "ISO 14001",
      description: "Environmental Management",
      icon: "🌱",
      authority: "International Standards Organization"
    },
    {
      name: "UIAGM",
      description: "Mountain Guide Certification", 
      icon: "⛰️",
      authority: "International Federation of Mountain Guides"
    },
    {
      name: "IATA",
      description: "Travel Industry Standards",
      icon: "✈️", 
      authority: "International Air Transport Association"
    },
    {
      name: "Adventure Travel",
      description: "Sustainable Tourism",
      icon: "🎯",
      authority: "Adventure Travel Trade Association"
    }
  ];

  // Team members data
  const teamMembers = [
    {
      name: "Rachid Benali",
      role: "Founder & Lead Guide",
      image: "/api/placeholder/150/150",
      experience: "15+ years",
      specialization: "Atlas Mountains"
    },
    {
      name: "Aicha Mansouri", 
      role: "Safety Director",
      image: "/api/placeholder/150/150",
      experience: "12+ years",
      specialization: "Risk Management"
    },
    {
      name: "Omar El-Fassi",
      role: "Operations Manager",
      image: "/api/placeholder/150/150", 
      experience: "10+ years",
      specialization: "Logistics"
    },
    {
      name: "Fatima Zerouali",
      role: "Community Relations",
      image: "/api/placeholder/150/150",
      experience: "8+ years", 
      specialization: "Cultural Programs"
    }
  ];

  // FAQ data
  const faqData = [
    {
      category: "Safety",
      questions: [
        {
          question: "What safety measures do you have in place?",
          answer: "We maintain comprehensive safety protocols including certified guides, emergency communication systems, first aid equipment, weather monitoring, and 24/7 support. All our guides are trained in wilderness first aid and carry satellite communication devices."
        },
        {
          question: "What happens in case of emergency?",
          answer: "We have a 24/7 emergency response system with direct contacts to local rescue services, medical facilities, and evacuation services. Every adventure includes emergency evacuation insurance and our guides carry GPS beacons for immediate location tracking."
        },
        {
          question: "Are your guides certified?",
          answer: "Yes, all our guides hold internationally recognized certifications including UIAGM mountain guide credentials, wilderness first aid, and local guide licenses. They undergo annual safety training and assessments."
        }
      ]
    },
    {
      category: "Booking",
      questions: [
        {
          question: "How far in advance should I book?",
          answer: "We recommend booking at least 4-6 weeks in advance, especially for peak season (October-April) and popular adventures. Some exclusive routes have limited capacity and may require earlier booking."
        },
        {
          question: "What's your cancellation policy?",
          answer: "Cancellations made 30+ days before departure receive full refunds. 15-29 days: 50% refund. Less than 15 days: no refund unless due to weather or safety concerns. Travel insurance is recommended."
        },
        {
          question: "Can I modify my booking?",
          answer: "Yes, modifications are possible subject to availability. Changes made 21+ days before departure are free. Later changes may incur fees. We'll do our best to accommodate your needs."
        }
      ]
    },
    {
      category: "Equipment",
      questions: [
        {
          question: "What equipment is included?",
          answer: "Basic camping gear, safety equipment, and group items are included. Personal items like clothing, footwear, and individual gear are your responsibility. We provide detailed packing lists and rental options."
        },
        {
          question: "Can I rent equipment locally?",
          answer: "Yes, we partner with local outfitters to provide quality rental equipment. Items can be reserved during booking or arranged upon arrival. Rental fees vary by item and duration."
        },
        {
          question: "How do I know what to bring?",
          answer: "Each adventure includes a detailed packing list customized for the season, activity, and difficulty level. We also provide gear recommendations and links to trusted suppliers."
        }
      ]
    },
    {
      category: "Travel",
      questions: [
        {
          question: "Do you arrange transportation?",
          answer: "Yes, most adventures include transportation from designated meeting points. Airport transfers and accommodation can be arranged for an additional fee. We work with reliable local transport partners."
        },
        {
          question: "Where do we meet?",
          answer: "Meeting points vary by adventure but are typically in major cities like Marrakech, Casablanca, or specific regional centers. Exact locations and times are provided 1 week before departure."
        },
        {
          question: "What about accommodation?",
          answer: "Accommodation varies by adventure - from mountain huts and camps to traditional guesthouses and hotels. All options are carefully selected for comfort, safety, and cultural authenticity."
        }
      ]
    }
  ];

  const contactMethods = [
    {
      type: "Emergency Hotline",
      value: "+212 600 123 456",
      availability: "24/7",
      icon: Phone,
      description: "Immediate emergency assistance"
    },
    {
      type: "General Inquiries", 
      value: "info@journeyassociation.com",
      availability: "1-2 hours response",
      icon: Mail,
      description: "Questions and information"
    },
    {
      type: "Booking Support",
      value: "+212 524 123 789", 
      availability: "9 AM - 6 PM GMT",
      icon: Headphones,
      description: "Booking assistance and modifications"
    },
    {
      type: "WhatsApp",
      value: "+212 600 123 456",
      availability: "9 AM - 9 PM GMT", 
      icon: MessageCircle,
      description: "Quick questions and updates"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Learn More' }]} />

      {/* Navigation Tabs */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="about">About Us</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* About Us Tab */}
            <TabsContent value="about" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Story</h2>
                <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto">
                  Founded in 2010, Journey Association began with a simple mission: to share Morocco's incredible beauty while supporting local communities and preserving natural heritage.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold font-heading mb-2">Our Mission</h3>
                    <p className="text-muted-foreground font-body">
                      To provide authentic, safe, and sustainable adventure experiences that connect travelers with Morocco's culture and nature.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold font-heading mb-2">Our Values</h3>
                    <p className="text-muted-foreground font-body">
                      Safety first, cultural respect, environmental stewardship, and building meaningful connections between people and places.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="text-center hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold font-heading mb-2">Our Impact</h3>
                    <p className="text-muted-foreground font-body">
                      Supporting 50+ local communities, protecting fragile ecosystems, and creating employment for 200+ local guides and families.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Team Section */}
              <div>
                <h3 className="text-2xl font-bold font-heading text-center mb-8">Meet Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                      <CardContent className="p-6">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h4 className="font-semibold font-heading mb-1">{member.name}</h4>
                        <p className="text-sm text-primary font-body mb-2">{member.role}</p>
                        <p className="text-xs text-muted-foreground font-body">{member.experience} • {member.specialization}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Safety Standards Tab */}
            <TabsContent value="safety" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Safety Standards</h2>
                <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto">
                  Our comprehensive safety protocols ensure your adventure is both thrilling and secure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {certifications.map((cert, index) => (
                  <Card key={index} className="text-center hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3">{cert.icon}</div>
                      <h3 className="font-semibold font-heading mb-2">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground font-body mb-1">{cert.description}</p>
                      <p className="text-xs text-muted-foreground font-body">{cert.authority}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Safety Protocols</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "Pre-adventure safety briefings",
                      "Certified guide accompaniment", 
                      "Emergency communication systems",
                      "First aid and rescue equipment",
                      "Weather monitoring and route adjustment",
                      "Medical screening and fitness assessment"
                    ].map((protocol, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="font-body">{protocol}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Emergency Procedures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "24/7 emergency hotline support",
                      "GPS tracking and location monitoring", 
                      "Immediate medical evacuation access",
                      "Direct contact with rescue services",
                      "Comprehensive insurance coverage",
                      "Regular safety equipment inspections"
                    ].map((procedure, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-body">{procedure}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Get in Touch</h2>
                <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto">
                  We're here to help with any questions about your adventure or our services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="hover:shadow-elegant transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold font-heading mb-1">{method.type}</h3>
                          <p className="text-lg text-primary font-body mb-1">{method.value}</p>
                          <p className="text-sm text-muted-foreground font-body mb-2">{method.description}</p>
                          <Badge variant="outline">{method.availability}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Find answers to common questions about our adventures, safety, and services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="Safety" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                {faqData.map((category) => (
                  <TabsTrigger key={category.category} value={category.category}>
                    {category.category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {faqData.map((category) => (
                <TabsContent key={category.category} value={category.category}>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-card px-6">
                        <AccordionTrigger className="font-heading text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;