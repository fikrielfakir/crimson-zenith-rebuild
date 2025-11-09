import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, MapPin, MessageCircle, Headset } from "lucide-react";

const Contact = () => {
  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Chat to support",
      subtitle: "Speak to our friendly team.",
      contact: "info@thejourney-ma.com",
    },
    {
      icon: Headset,
      title: "Chat to Select",
      subtitle: "Talk to get advice.",
      contact: "Contact with chatbot",
    },
    {
      icon: MapPin,
      title: "Visit us",
      subtitle: "Visit our office.",
      contact: "Rabat Bouregreg, Morocco",
    },
    {
      icon: Phone,
      title: "Call us",
      subtitle: "Mon–Fri from 8am to 5pm.",
      contact: "+212 686 777 888",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-background scroll-mt-32">
      <div className="container mx-auto px-4" style={{ maxWidth: '1100px' }}>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Contact Options */}
          <div 
            className="bg-white dark:bg-card"
            style={{
              border: '1px solid #E4E4E4',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="space-y-5">
              {contactOptions.map((option, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-lg"
                    style={{ backgroundColor: '#1B1B1B' }}
                  >
                    <option.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="font-semibold mb-1"
                      style={{ 
                        fontSize: '15px',
                        color: '#222',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {option.title}
                    </h3>
                    <p 
                      className="mb-1"
                      style={{ 
                        fontSize: '13px',
                        color: '#666',
                        lineHeight: '1.6'
                      }}
                    >
                      {option.subtitle}
                    </p>
                    <p 
                      style={{ 
                        fontSize: '13px',
                        color: '#444',
                        fontWeight: '500'
                      }}
                    >
                      {option.contact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div 
            className="bg-white dark:bg-card"
            style={{
              border: '1px solid #E4E4E4',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h2 
              className="font-semibold mb-2"
              style={{ 
                fontSize: '24px',
                color: '#222',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.5px'
              }}
            >
              Contact us
            </h2>
            <p 
              className="mb-6"
              style={{ 
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6'
              }}
            >
              Our friendly team would love to hear from you.
            </p>

            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="block mb-2"
                    style={{ 
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#333'
                    }}
                  >
                    First name
                  </label>
                  <Input 
                    placeholder="First name"
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      padding: '12px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label 
                    className="block mb-2"
                    style={{ 
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#333'
                    }}
                  >
                    Last name
                  </label>
                  <Input 
                    placeholder="Last name"
                    style={{
                      height: '48px',
                      borderRadius: '8px',
                      border: '1px solid #E4E4E4',
                      padding: '12px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block mb-2"
                  style={{ 
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#333'
                  }}
                >
                  Email
                </label>
                <Input 
                  type="email"
                  placeholder="you@company.com"
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    padding: '12px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label 
                  className="block mb-2"
                  style={{ 
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#333'
                  }}
                >
                  Phone number
                </label>
                <Input 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    padding: '12px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label 
                  className="block mb-2"
                  style={{ 
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#333'
                  }}
                >
                  Message
                </label>
                <Textarea 
                  placeholder="Leave us a message..."
                  style={{
                    height: '120px',
                    borderRadius: '8px',
                    border: '1px solid #E4E4E4',
                    padding: '12px',
                    fontSize: '14px',
                    resize: 'none'
                  }}
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="privacy" className="mt-1" />
                <label 
                  htmlFor="privacy"
                  style={{ 
                    fontSize: '13px',
                    color: '#555',
                    lineHeight: '1.6',
                    cursor: 'pointer'
                  }}
                >
                  You agree to our friendly privacy policy.
                </label>
              </div>

              <Button 
                type="submit"
                className="w-full transition-all duration-300"
                style={{
                  height: '50px',
                  backgroundColor: '#1B1B1B',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1B1B1B';
                }}
              >
                Send message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;