import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+212 686 777 888", "Available 9 AM - 6 PM"],
    },
    {
      icon: Mail,
      title: "Email", 
      details: ["info@thejourney-ma.com", "Quick response guaranteed"],
    },
    {
      icon: MapPin,
      title: "Head Office",
      details: ["Rabat Bouregreg, Morocco", "Visit us anytime"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9 AM - 6 PM", "Saturday: 10 AM - 4 PM"],
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-background scroll-mt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
            Contact Information
          </h2>
          <p className="text-lg text-gray-400">
            Ready to start your journey? Get in touch with our team
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-5">
            {contactInfo.map((info, index) => (
              <Card 
                key={info.title} 
                className="border-0 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in bg-white dark:bg-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-5">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      <info.icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#2C3E50' }}>
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className={i === 0 ? "text-gray-600 dark:text-gray-400 font-medium" : "text-gray-400 text-sm mt-1"}>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Contact Form */}
          <Card className="border-0 shadow-sm bg-white dark:bg-card animate-slide-up">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold" style={{ color: '#2C3E50' }}>
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: '#2C3E50' }}>
                    First Name
                  </label>
                  <Input 
                    placeholder="Your first name" 
                    className="h-11 border-gray-200 focus:border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: '#2C3E50' }}>
                    Last Name
                  </label>
                  <Input 
                    placeholder="Your last name" 
                    className="h-11 border-gray-200 focus:border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#2C3E50' }}>
                  Email
                </label>
                <Input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className="h-11 border-gray-200 focus:border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#2C3E50' }}>
                  Subject
                </label>
                <Input 
                  placeholder="What's this about?" 
                  className="h-11 border-gray-200 focus:border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#2C3E50' }}>
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us about your travel dreams and how we can help make them reality..."
                  rows={5}
                  className="border-gray-200 focus:border-gray-300 rounded-lg resize-none"
                />
              </div>
              
              <Button 
                className="w-full h-12 text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: '#1E3A5F',
                  color: 'white'
                }}
                size="lg"
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;