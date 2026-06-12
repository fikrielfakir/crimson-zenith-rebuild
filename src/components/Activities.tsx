import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";
import { apiFetch, resolveStorageUrl } from "@/lib/apiFetch";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiEvent {
  id: number | string;
  title: string;
  description?: string;
  duration?: string;
  category?: string;
  groupSize?: string;
  maxParticipants?: number;
  rating?: number;
  price?: number;
  image?: string;
  status?: string;
  isActive?: boolean;
}

interface ActivityCard {
  id: number | string;
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: string;
  groupSize: string;
  rating: number;
  price: string;
  href: string;
}

const FALLBACK_ACTIVITIES: ActivityCard[] = [
  {
    id: "atlas-mountains",
    title: "Atlas Mountains Trek",
    description: "Experience breathtaking views and traditional Berber culture in Morocco's highest peaks",
    image: "🏔️",
    duration: "3 days",
    difficulty: "Moderate",
    groupSize: "8-12 people",
    rating: 4.8,
    price: "From $299",
    href: "/activities/atlas-mountains",
  },
  {
    id: "sahara-desert",
    title: "Sahara Desert Adventure",
    description: "Camel trekking and camping under the stars in the world's largest hot desert",
    image: "🐪",
    duration: "2 days",
    difficulty: "Easy",
    groupSize: "6-10 people",
    rating: 4.9,
    price: "From $189",
    href: "/activities/sahara-desert",
  },
  {
    id: "atlantique",
    title: "Coastal Surfing Experience",
    description: "Learn to surf on Morocco's pristine Atlantic coastline with expert instructors",
    image: "🏄‍♂️",
    duration: "1 day",
    difficulty: "Beginner",
    groupSize: "4-8 people",
    rating: 4.6,
    price: "From $89",
    href: "/activities/atlantique",
  },
  {
    id: "cultural-city-tour",
    title: "Cultural City Tour",
    description: "Explore ancient medinas, souks, and architectural wonders with local guides",
    image: "🕌",
    duration: "Half day",
    difficulty: "Easy",
    groupSize: "10-15 people",
    rating: 4.7,
    price: "From $45",
    href: "/activities/cultural-city-tour",
  },
  {
    id: "rock-climbing",
    title: "Rock Climbing Adventure",
    description: "Challenge yourself on spectacular limestone cliffs in Todra Gorge",
    image: "🧗‍♂️",
    duration: "2 days",
    difficulty: "Hard",
    groupSize: "4-6 people",
    rating: 4.5,
    price: "From $199",
    href: "/activities/rock-climbing",
  },
  {
    id: "photography-workshop",
    title: "Photography Workshop",
    description: "Capture Morocco's stunning landscapes and vibrant culture with pro photographers",
    image: "📸",
    duration: "4 days",
    difficulty: "Easy",
    groupSize: "6-8 people",
    rating: 4.8,
    price: "From $349",
    href: "/activities/photography-workshop",
  },
];

function detectDifficulty(category: string, title: string): string {
  const text = `${category} ${title}`.toLowerCase();
  if (text.includes("beginner") || text.includes("easy") || text.includes("family") || text.includes("cultural") || text.includes("photo")) return "Easy";
  if (text.includes("advanced") || text.includes("expert") || text.includes("hard") || text.includes("climb")) return "Hard";
  if (text.includes("trek") || text.includes("hik") || text.includes("desert") || text.includes("surf")) return "Moderate";
  return "Moderate";
}

function categoryEmoji(category?: string, title?: string): string {
  const text = `${category ?? ""} ${title ?? ""}`.toLowerCase();
  if (text.includes("trek") || text.includes("mountain") || text.includes("hik")) return "🏔️";
  if (text.includes("desert") || text.includes("sahara") || text.includes("camel")) return "🐪";
  if (text.includes("surf") || text.includes("beach") || text.includes("water") || text.includes("ocean")) return "🏄‍♂️";
  if (text.includes("cultur") || text.includes("medina") || text.includes("city") || text.includes("tour")) return "🕌";
  if (text.includes("climb") || text.includes("rock")) return "🧗‍♂️";
  if (text.includes("photo") || text.includes("camera")) return "📸";
  if (text.includes("food") || text.includes("cook") || text.includes("culinar")) return "🍽️";
  return "⛺";
}

function mapEventToActivity(event: ApiEvent): ActivityCard {
  const difficulty = detectDifficulty(event.category ?? "", event.title);
  const group = event.groupSize
    ?? (event.maxParticipants ? `Up to ${event.maxParticipants} people` : "Small group");

  return {
    id: event.id,
    title: event.title,
    description: event.description ?? "An unforgettable Moroccan experience.",
    image: event.image ?? categoryEmoji(event.category, event.title),
    duration: event.duration ?? "Full day",
    difficulty,
    groupSize: group,
    rating: event.rating ?? 4.7,
    price: event.price != null ? `From $${event.price}` : "Contact us",
    href: `/book?event=${event.id}`,
  };
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "bg-green-100 text-green-800 border-green-200";
    case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Hard": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const Activities = () => {
  const [activities, setActivities] = useState<ActivityCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiFetch("/api/booking/events");
        if (res.ok) {
          const data = await res.json();
          const events: ApiEvent[] = data.events ?? data.data ?? [];
          const active = events.filter(
            (e) => e.isActive !== false && e.status !== "cancelled"
          );
          if (active.length > 0) {
            setActivities(active.slice(0, 6).map(mapEventToActivity));
            return;
          }
        }
      } catch {
        // silently fall through to fallback
      }
      setActivities(FALLBACK_ACTIVITIES);
    };

    fetchActivities().finally(() => setIsLoading(false));
  }, []);

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
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <Skeleton className="h-10 w-10 mx-auto rounded-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            : activities.map((activity, index) => (
                <Card
                  key={activity.id}
                  className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="text-4xl mb-3 text-center">
                      {activity.image.startsWith("http") || activity.image.startsWith("/")
                        ? (
                            <img
                              src={resolveStorageUrl(activity.image) ?? "/placeholder.svg"}
                              alt={activity.title}
                              className="w-16 h-16 object-cover rounded-full mx-auto"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          )
                        : activity.image}
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
                      <Link to={activity.href}>
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
          <Link to="/discover">
            <Button size="lg" className="px-8 py-3">
              Explore All Cities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Activities;
