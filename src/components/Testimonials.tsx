import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTestimonials } from "@/hooks/useCMS";
import { useTranslatedList } from "@/hooks/useContentTranslation";

const TESTIMONIAL_FIELDS = ["name", "role", "feedback"];

const Testimonials = () => {
  const { t } = useTranslation();
  const { data: dbTestimonials, isLoading, isError } = useTestimonials();
  const translatedTestimonials = useTranslatedList(
    dbTestimonials ?? [],
    "testimonial",
    TESTIMONIAL_FIELDS
  );

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

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-background scroll-mt-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="w-8 h-8 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !dbTestimonials || translatedTestimonials.length === 0) {
    return null;
  }

  const displayTestimonials = translatedTestimonials;

  return (
    <section id="gallery" className="py-20 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("testimonials.title")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial: any, index: number) => (
            <Card
              key={testimonial.id || index}
              className="group hover:shadow-elegant transition-all duration-300 animate-scale-in border-border/50 relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.feedback || testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-2xl overflow-hidden">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    {testimonial.role && (
                      <div className="text-sm text-muted-foreground mb-1">
                        {testimonial.role}
                      </div>
                    )}
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating || 5)}
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
