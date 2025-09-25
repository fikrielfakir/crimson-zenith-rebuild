import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Star, Grid3X3, Map, Filter, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const Discover = () => {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Mock data for adventures
  const adventures = [
    {
      id: 1,
      title: "Atlas Mountains Trek",
      image: "/api/placeholder/400/300",
      difficulty: "Moderate",
      duration: "3 days",
      price: 299,
      rating: 4.8,
      reviews: 124,
      location: "High Atlas",
      description: "Spectacular hiking through Morocco's highest peaks"
    },
    {
      id: 2,
      title: "Sahara Desert Expedition",
      image: "/api/placeholder/400/300",
      difficulty: "Easy",
      duration: "2 days",
      price: 189,
      rating: 4.9,
      reviews: 98,
      location: "Merzouga",
      description: "Camel trekking and overnight camping under the stars"
    },
    {
      id: 3,
      title: "Coastal Surfing Adventure",
      image: "/api/placeholder/400/300",
      difficulty: "Beginner",
      duration: "1 day",
      price: 89,
      rating: 4.6,
      reviews: 76,
      location: "Taghazout",
      description: "Learn to surf on Morocco's beautiful Atlantic coast"
    },
    {
      id: 4,
      title: "Berber Village Experience",
      image: "/api/placeholder/400/300",
      difficulty: "Easy",
      duration: "4 days",
      price: 349,
      rating: 4.7,
      reviews: 156,
      location: "Atlas Villages",
      description: "Immersive cultural experience in traditional Berber communities"
    },
    {
      id: 5,
      title: "Rock Climbing Todra Gorge",
      image: "/api/placeholder/400/300",
      difficulty: "Hard",
      duration: "2 days",
      price: 199,
      rating: 4.5,
      reviews: 45,
      location: "Todra Gorge",
      description: "Challenge yourself on stunning limestone cliffs"
    },
    {
      id: 6,
      title: "Marrakech Food Tour",
      image: "/api/placeholder/400/300",
      difficulty: "Easy",
      duration: "4 hours",
      price: 59,
      rating: 4.9,
      reviews: 203,
      location: "Marrakech",
      description: "Explore the culinary treasures of the Red City"
    }
  ];

  const featuredAdventures = adventures.slice(0, 4);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success";
      case "Moderate": return "bg-warning";
      case "Hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Discover' }]} />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className={`${showFilters ? 'w-1/4' : 'w-0'} transition-all duration-300 overflow-hidden`}>
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Activity Type */}
                    <div>
                      <label className="text-sm font-medium font-body mb-2 block">Activity Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All activities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trekking">Trekking</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="adventure">Adventure Sports</SelectItem>
                          <SelectItem value="food">Food & Culinary</SelectItem>
                          <SelectItem value="desert">Desert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="text-sm font-medium font-body mb-2 block">Difficulty</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-sm font-medium font-body mb-2 block">Duration</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="half-day">Half Day</SelectItem>
                          <SelectItem value="full-day">Full Day</SelectItem>
                          <SelectItem value="2-3-days">2-3 Days</SelectItem>
                          <SelectItem value="week">1 Week+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium font-body mb-2 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        step={50}
                        className="w-full"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium font-body mb-2 block">Minimum Rating</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                          <SelectItem value="4.8">4.8+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" className="w-full">
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Area */}
            <div className={`${showFilters ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
              {/* Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="font-body"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                  <span className="text-sm text-muted-foreground font-body">
                    {adventures.length} adventures found
                  </span>
                </div>
                
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "map")}>
                  <TabsList>
                    <TabsTrigger value="grid">
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="map">
                      <Map className="w-4 h-4 mr-2" />
                      Map
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Adventure Cards Grid */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {adventures.map((adventure) => (
                    <Card key={adventure.id} className="group hover:shadow-glow transition-all duration-300">
                      <div className="relative overflow-hidden rounded-t-card">
                        <img 
                          src={adventure.image} 
                          alt={adventure.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge 
                          className={`absolute top-3 left-3 text-white ${getDifficultyColor(adventure.difficulty)}`}
                        >
                          {adventure.difficulty}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold font-heading mb-2">{adventure.title}</h3>
                        <p className="text-sm text-muted-foreground font-body mb-3">{adventure.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {adventure.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {adventure.duration}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-warning text-warning" />
                            <span className="font-medium">{adventure.rating}</span>
                            <span className="text-sm text-muted-foreground">({adventure.reviews})</span>
                          </div>
                          <div className="text-lg font-bold font-heading text-primary">
                            ${adventure.price}
                          </div>
                        </div>

                        <Button className="w-full bg-secondary hover:bg-secondary/90">
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Map View */}
              {viewMode === "map" && (
                <div className="h-96 bg-muted rounded-card flex items-center justify-center mb-12">
                  <div className="text-center">
                    <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold font-heading mb-2">Interactive Map Coming Soon</h3>
                    <p className="text-muted-foreground font-body">
                      Explore adventures on an interactive map of Morocco
                    </p>
                  </div>
                </div>
              )}

              {/* Featured Adventures */}
              <div>
                <h2 className="text-3xl font-bold font-heading mb-8">Featured Adventures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredAdventures.map((adventure) => (
                    <Card key={adventure.id} className="group hover:shadow-elegant transition-all duration-300">
                      <div className="relative overflow-hidden rounded-t-card">
                        <img 
                          src={adventure.image} 
                          alt={adventure.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 right-2 bg-secondary text-white">
                          Featured
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold font-heading mb-1">{adventure.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 fill-warning text-warning" />
                            {adventure.rating}
                          </div>
                          <div className="font-bold text-primary">${adventure.price}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Discover;