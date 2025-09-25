import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MoroccoMap from "./MoroccoMap";
import marrakechImg from "@/assets/marrakech-club.jpg";
import fezImg from "@/assets/fez-club.jpg";
import casablancaImg from "@/assets/casablanca-club.jpg";

const ClubsWithMap = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const clubsPerPage = 3;
  const navigate = useNavigate();

  // Fetch real clubs data from API
  const { data: clubsResponse, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      return response.json();
    },
  });

  // Transform API data to match component expectations, with fallback images
  const clubs = clubsResponse?.clubs?.map((club: any, index: number) => {
    const fallbackImages = [marrakechImg, fezImg, casablancaImg];
    const fallbackImage = fallbackImages[index % fallbackImages.length];
    
    return {
      name: club.name,
      description: club.description,
      image: club.image || fallbackImage,
      members: `${club.member_count}+ Members`,
      location: club.location,
      features: club.features || [],
    };
  }) || [];

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(Math.floor((clubs.length - 1) / clubsPerPage), prev + 1));
  };

  if (isLoading) {
    return (
      <section id="activities" className="py-20 bg-gradient-subtle scroll-mt-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Clubs
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-600">Loading clubs...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-20 bg-gradient-subtle scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Clubs
          </h2>
          <p className="text-xl text-muted-foreground">
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map Section - Always on Left */}
          <div className="animate-fade-in order-1">
            <Card className="border-border/20 shadow-sm h-[600px]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Morocco Clubs Map
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Discover our club locations across Morocco
                </p>
              </CardHeader>
              <CardContent className="p-0 h-[500px]">
                <MoroccoMap />
              </CardContent>
            </Card>
          </div>
          
          {/* Clubs Section - Always on Right */}
          <div className="space-y-4 order-2">
            {/* Clubs Display */}
            <div className="space-y-4">
              {clubs.slice(currentPage * clubsPerPage, (currentPage + 1) * clubsPerPage).map((club, index) => (
              <Card 
                key={club.name} 
                className="group hover:shadow-lg transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-background"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {club.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {club.members}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                      {club.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {club.features.map((feature) => (
                        <span 
                          key={feature} 
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="px-4 py-1 text-sm w-full"
                      onClick={() => navigate(`/club/${encodeURIComponent(club.name)}`)}
                    >
                      Discover
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentPage * clubsPerPage + 1}-{Math.min((currentPage + 1) * clubsPerPage, clubs.length)} of {clubs.length} clubs
                  </span>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/clubs')}
                    className="flex items-center gap-2 text-primary hover:text-primary"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    More Clubs
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= Math.floor((clubs.length - 1) / clubsPerPage)}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubsWithMap;