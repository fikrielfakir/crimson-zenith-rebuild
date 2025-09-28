import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MoroccoMap from "./MoroccoMap";
import { Club } from "../../shared/schema";
import marrakechImg from "@/assets/marrakech-club.jpg";
import fezImg from "@/assets/fez-club.jpg";
import casablancaImg from "@/assets/casablanca-club.jpg";

const ClubsWithMap = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
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

  // Transform API data to match component expectations, preserving coordinates
  const rawClubs: Club[] = clubsResponse?.clubs?.map((club: any) => ({
    id: club.id,
    name: club.name,
    description: club.description,
    location: club.location,
    memberCount: club.member_count,
    rating: club.rating,
    image: club.image,
    features: club.features,
    isActive: club.is_active,
    latitude: club.latitude,
    longitude: club.longitude,
    established: club.established,
    contactEmail: club.contact_email,
    contactPhone: club.contact_phone,
    createdAt: club.created_at ? new Date(club.created_at) : undefined,
    updatedAt: club.updated_at ? new Date(club.updated_at) : undefined,
  })) || [];

  // Transform for display in cards, with fallback images
  const displayClubs = rawClubs.map((club: Club, index: number) => {
    const fallbackImages = [marrakechImg, fezImg, casablancaImg];
    const fallbackImage = fallbackImages[index % fallbackImages.length];
    
    return {
      ...club,
      image: club.image || fallbackImage,
      members: `${club.memberCount}+ Members`,
      features: club.features || [],
    };
  });

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(Math.floor((displayClubs.length - 1) / clubsPerPage), prev + 1));
  };

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
  };

  if (isLoading) {
    return (
      <section id="clubs" className="py-20 bg-gradient-subtle scroll-mt-32">
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
    <section id="clubs" className="py-20 bg-gradient-subtle scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Clubs
          </h2>
          <p className="text-xl text-muted-foreground">
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Map Section - Always on Left */}
          <div className="animate-fade-in order-1">
            <Card className="border-border/20 shadow-xl bg-white/95 backdrop-blur-sm h-[700px] rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Morocco Clubs Map
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Discover our club locations across Morocco
                </p>
              </CardHeader>
              <CardContent className="p-0 h-[600px]">
                <MoroccoMap 
                  clubs={rawClubs}
                  onClubSelect={handleClubSelect}
                  selectedClub={selectedClub}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Clubs Section - Always on Right */}
          <div className="order-2">
            <Card className="border-border/20 shadow-xl bg-white/95 backdrop-blur-sm h-[700px] rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Featured Clubs
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explore amazing communities across Morocco
                </p>
              </CardHeader>
              <CardContent className="p-4 h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <div className="space-y-4">
                  {displayClubs.slice(currentPage * clubsPerPage, (currentPage + 1) * clubsPerPage).map((club, index) => (
                    <Card 
                      key={club.name} 
                      className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-scale-in border-border/20 overflow-hidden bg-gradient-to-br from-white to-primary/5 rounded-xl"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex">
                        <div className="w-24 flex-shrink-0">
                          <img 
                            src={club.image} 
                            alt={club.name}
                            className="w-full h-24 object-cover rounded-l-xl"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {club.name}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {club.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {club.members}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
                            {club.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {Array.isArray(club.features) && club.features.slice(0, 2).map((feature) => (
                              <span 
                                key={feature} 
                                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                            {Array.isArray(club.features) && club.features.length > 2 && (
                              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                                +{club.features.length - 2}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="px-3 py-1 text-xs flex-1 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                              onClick={() => navigate(`/club/${encodeURIComponent(club.name)}`)}
                            >
                              Discover
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="px-2 py-1 text-xs rounded-full border-primary/20 hover:bg-primary/10"
                              onClick={() => handleClubSelect(club)}
                              title="Show on map"
                            >
                              <MapPin className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {currentPage * clubsPerPage + 1}-{Math.min((currentPage + 1) * clubsPerPage, displayClubs.length)} of {displayClubs.length}
                    </span>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/clubs')}
                      className="flex items-center gap-2 text-primary hover:text-primary rounded-full"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      View All
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.floor((displayClubs.length - 1) / clubsPerPage)}
                    className="flex items-center gap-2 rounded-full"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubsWithMap;