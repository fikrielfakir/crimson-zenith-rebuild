import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Activities = () => {
  // Function to create URL-friendly slugs
  const createSlug = (title: string) => {
    const slugMap: { [key: string]: string } = {
      "Atlas Mountains Trek": "atlas-mountains",
      "Sahara Desert Adventure": "sahara-desert",
      "Coastal Surfing Experience": "atlantique",
      "Cultural City Tour": "cultural-city-tour",
      "Rock Climbing Adventure": "rock-climbing",
      "Photography Workshop": "photography-workshop"
    };
    return slugMap[title] || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const activities = [
    {
      title: "Atlas Mountains Trek",
      description: "Experience breathtaking views and traditional Berber culture in Morocco's highest peaks",
      image: "🏔️",
      duration: "3 days",
      difficulty: "Moderate",
      groupSize: "8-12 people",
      rating: 4.8,
      price: "From $299"
    },
    {
      title: "Sahara Desert Adventure",
      description: "Camel trekking and camping under the stars in the world's largest hot desert",
      image: "🐪",
      duration: "2 days",
      difficulty: "Easy",
      groupSize: "6-10 people", 
      rating: 4.9,
      price: "From $189"
    },
    {
      title: "Coastal Surfing Experience",
      description: "Learn to surf on Morocco's pristine Atlantic coastline with expert instructors",
      image: "🏄‍♂️",
      duration: "1 day",
      difficulty: "Beginner",
      groupSize: "4-8 people",
      rating: 4.6,
      price: "From $89"
    },
    {
      title: "Cultural City Tour",
      description: "Explore ancient medinas, souks, and architectural wonders with local guides",
      image: "🕌",
      duration: "Half day",
      difficulty: "Easy",
      groupSize: "10-15 people",
      rating: 4.7,
      price: "From $45"
    },
    {
      title: "Rock Climbing Adventure",
      description: "Challenge yourself on spectacular limestone cliffs in Todra Gorge",
      image: "🧗‍♂️",
      duration: "2 days",
      difficulty: "Hard",
      groupSize: "4-6 people",
      rating: 4.5,
      price: "From $199"
    },
    {
      title: "Photography Workshop",
      description: "Capture Morocco's stunning landscapes and vibrant culture with pro photographers",
      image: "📸",
      duration: "4 days",
      difficulty: "Easy",
      groupSize: "6-8 people",
      rating: 4.8,
      price: "From $349"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section id="activities" className="py-20 bg-gradient-subtle scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Activities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover unforgettable adventures and authentic experiences across Morocco's diverse landscapes and rich cultural heritage
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <Card 
              key={activity.title} 
              className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="text-4xl mb-3 text-center">
                  {activity.image}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors text-center">
                  {activity.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {activity.groupSize}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{activity.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <span className="text-lg font-bold text-primary">
                    {activity.price}
                  </span>
                  <Link to={`/activities/${createSlug(activity.title)}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events">
            <Button size="lg" className="px-8 py-3">
              Explore All Activities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Activities;