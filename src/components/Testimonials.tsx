import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Aisha",
      date: "June 15, 2024",
      rating: 5,
      text: "The Journey Association provided an unforgettable experience connecting with Morocco's rich culture and breathtaking landscapes. Highly recommend for conscious travelers!",
      avatar: "👩🏽",
    },
    {
      name: "Karim", 
      date: "May 28, 2024",
      rating: 5,
      text: "I loved the focus on authentic tourism and the opportunity to give back to the community through the amazing cultural experiences. Great work!",
      avatar: "👨🏽",
    },
    {
      name: "Fatima",
      date: "April 10, 2024", 
      rating: 5,
      text: "This cultural experience was incredible and this excellent team was top-notch! I can't wait to participate in more events with such passionate organizers. Thank you!",
      avatar: "👩🏻",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section id="gallery" className="py-20 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Member Testimonials
          </h2>
          <p className="text-xl text-muted-foreground">
            Hear from our community of adventurers and culture enthusiasts
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50 relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {testimonial.date}
                    </div>
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;