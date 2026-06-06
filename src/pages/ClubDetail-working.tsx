import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Star, 
  ArrowLeft,
  Heart,
  Share2,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ClubDetailWorking = () => {
  const { clubName } = useParams();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);

  // Fetch real clubs data from API
  const { data: clubsResponse, isLoading, error } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      return response.json();
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading club details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Club</h2>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'Failed to load club information'}
              </p>
              <Button onClick={() => navigate('/clubs')}>
                Back to Clubs
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Find the current club by name from the API data
  const club = clubsResponse?.clubs?.find((c: any) => 
    c.name === decodeURIComponent(clubName || '')
  );

  // Club not found
  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-6 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Club Not Found</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find a club named "{clubName}". It may have been moved or doesn't exist.
              </p>
              <Button onClick={() => navigate('/clubs')}>
                Browse All Clubs
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleJoinClub = () => {
    setIsJoined(!isJoined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card>
              <div className="relative h-64 bg-gradient-to-r from-blue-600 to-orange-600 rounded-t-lg">
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-lg" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
                  <p className="text-lg opacity-90">{club.description}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {club.member_count}+ Members
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {club.rating}/5
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {club.location}
                  </Badge>
                </div>
                
                {club.features && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Features:</h3>
                    <div className="flex flex-wrap gap-2">
                      {club.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {club.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {club.description || "Join our amazing club and discover exciting adventures in Morocco!"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Club Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Join This Club</CardTitle>
                <CardDescription>
                  Become part of our community and start your adventure!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleJoinClub}
                  className={`w-full ${isJoined ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {isJoined ? 'Joined!' : 'Join Club'}
                </Button>
              </CardContent>
            </Card>

            {/* Club Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Club Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-sm text-gray-600">Location</p>
                  <p>{club.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-600">Members</p>
                  <p>{club.member_count}+ active members</p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-600">Rating</p>
                  <p>{club.rating}/5 stars</p>
                </div>
                {club.is_active && (
                  <div>
                    <Badge variant="default" className="bg-green-600">
                      Active Club
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Other Clubs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Clubs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(clubsResponse?.clubs || [])
                  .filter((c: any) => c.name !== club.name)
                  .slice(0, 2)
                  .map((otherClub: any) => (
                    <div 
                      key={otherClub.id} 
                      className="flex gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate(`/club/${encodeURIComponent(otherClub.name)}`)}
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{otherClub.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {otherClub.member_count}+ Members
                        </p>
                      </div>
                    </div>
                  ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={() => navigate('/clubs')}
                >
                  View All Clubs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClubDetailWorking;