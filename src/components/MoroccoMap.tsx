import React, { useState } from 'react';
import { Club } from '../../shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Star } from 'lucide-react';

interface MoroccoMapProps {
  clubs: Club[];
  onClubSelect?: (club: Club) => void;
  selectedClub?: Club | null;
}

const MoroccoMap = ({ clubs, onClubSelect, selectedClub }: MoroccoMapProps) => {
  const [hoveredClub, setHoveredClub] = useState<Club | null>(null);

  const clubsWithCoordinates = clubs.filter(club => 
    club.latitude && club.longitude && 
    !isNaN(parseFloat(club.latitude)) && 
    !isNaN(parseFloat(club.longitude))
  );

  const getMarkerPosition = (lat: string, lng: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    const mapBounds = {
      north: 36.0,
      south: 27.5,
      west: -13.2,
      east: -0.99
    };
    
    const x = ((longitude - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mapBounds.north - latitude) / (mapBounds.north - mapBounds.south)) * 100;
    
    return { x: `${x}%`, y: `${y}%` };
  };

  const handleClubClick = (club: Club) => {
    if (onClubSelect) {
      onClubSelect(club);
    }
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg relative bg-gray-900">
      <img 
        src="/morocco-map.png" 
        alt="Morocco Map" 
        className="w-full h-full object-contain"
      />
      
      {clubsWithCoordinates.map((club) => {
        const position = getMarkerPosition(club.latitude!, club.longitude!);
        const isSelected = selectedClub?.id === club.id;
        const isHovered = hoveredClub?.id === club.id;
        
        return (
          <div
            key={club.id}
            className="absolute"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)',
              zIndex: isSelected || isHovered ? 20 : 10
            }}
          >
            <div
              className={`relative cursor-pointer transition-all duration-300 ${
                isSelected || isHovered ? 'scale-110' : 'scale-100'
              }`}
              onClick={() => handleClubClick(club)}
              onMouseEnter={() => setHoveredClub(club)}
              onMouseLeave={() => setHoveredClub(null)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                isSelected 
                  ? 'bg-orange-600 ring-4 ring-orange-300' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              
              {(isHovered || isSelected) && (
                <Card className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 shadow-xl border-2 border-orange-500 z-30">
                  <CardHeader className="pb-2">
                    {club.image && (
                      <img 
                        src={club.image} 
                        alt={club.name} 
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    )}
                    <CardTitle className="text-sm">{club.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-gray-600">{club.location}</p>
                    <p className="text-xs text-gray-700 line-clamp-2">{club.description}</p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{club.memberCount || 0} members</span>
                      </div>
                      {club.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-600">{club.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
      })}
      
      {clubsWithCoordinates.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-orange-500" />
            <h3 className="text-lg font-semibold mb-2">No Club Locations Available</h3>
            <p className="text-sm text-gray-600">
              Club locations will appear on the map once coordinates are added.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoroccoMap;
