import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Settings } from "lucide-react";
import { Club } from "../../shared/schema";

const moroccanCities = [
  { name: "Fes", lat: 34.0181, lon: -5.0078 },
  { name: "Tetouan", lat: 35.5889, lon: -5.3626 },
  { name: "Al Hoceima", lat: 35.2517, lon: -3.9317 },
  { name: "Tanger", lat: 35.7595, lon: -5.8340 },
  { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
  { name: "Rabat", lat: 34.0209, lon: -6.8416 },
  { name: "Merrackache", lat: 31.6295, lon: -7.9811 },
];

const ClubsWithMap = () => {
  const [selectedCity, setSelectedCity] = useState("Al Hoceima");
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState(14);
  const navigate = useNavigate();

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

  const clubs: Club[] = clubsResponse?.clubs?.map((club: any) => ({
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

  const filteredClubs = clubs.filter(club => 
    club.location.toLowerCase().includes(selectedCity.toLowerCase())
  );

  const displayedClubs = filteredClubs.length > 0 ? filteredClubs : clubs.slice(0, 3);

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 1, 10));

  const selectedCityData = moroccanCities.find(city => city.name === selectedCity) || moroccanCities[2];

  if (isLoading) {
    return (
      <section id="clubs" className="relative w-full h-screen flex items-center justify-center bg-[#0A1A3D]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading clubs...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="clubs" className="relative w-full h-screen overflow-hidden scroll-mt-0">
      {/* Satellite Map Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${selectedCityData.lat},${selectedCityData.lon}&zoom=${mapZoom}&maptype=satellite`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="brightness-75"
        />
      </div>

      {/* Dark Blue Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, #0A1A3D 0%, rgba(10, 26, 61, 0.4) 60%, transparent 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full">
        {/* Top Title Area */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center w-full max-w-4xl px-4">
          <h2 
            className="text-5xl font-bold text-white mb-3"
            style={{ 
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Our Clubs
          </h2>
          <p 
            className="text-xl text-white"
            style={{ 
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
              maxWidth: '70%',
              margin: '0 auto'
            }}
          >
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>

        {/* Left City List */}
        <div 
          className="absolute left-20 top-1/2 transform -translate-y-1/2"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {moroccanCities.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
              className={`block text-left py-2 transition-all duration-300 ${
                selectedCity === city.name
                  ? 'text-white font-semibold text-2xl'
                  : 'text-white/70 text-lg hover:text-white/90'
              }`}
              style={{ lineHeight: '40px' }}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Map Controls (Right Side) */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
          <button
            onClick={() => {}}
            className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomIn}
            className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
            title="Zoom In"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
            title="Zoom Out"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Club Cards (Bottom Overlay) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 px-4 max-w-6xl overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {displayedClubs.map((club, index) => (
            <div
              key={club.id}
              onClick={() => setSelectedClubId(selectedClubId === club.id ? null : club.id)}
              className={`group relative flex-shrink-0 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                selectedClubId === club.id
                  ? 'scale-105 bg-gradient-to-b from-[rgba(10,26,61,0.9)] to-[rgba(255,255,255,0.1)]'
                  : 'bg-[rgba(10,26,61,0.8)] hover:bg-[rgba(10,26,61,0.9)]'
              }`}
              style={{
                boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
                minWidth: '320px',
                maxWidth: '320px'
              }}
            >
              {/* Club Icon & Info */}
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-white bg-gradient-to-br from-[#F8B500] to-[#FFDA7A] flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">
                    {club.name}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {club.location}
                  </p>
                  
                  {/* Member Count Badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8B500] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{club.memberCount || 23}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {selectedClubId === club.id && (
                <div className="mt-4 animate-fade-in">
                  {/* Location Image */}
                  {club.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={club.image} 
                        alt={club.name}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-white/90 mb-4 line-clamp-3">
                    {club.description}
                  </p>

                  {/* Get More Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/club/${encodeURIComponent(club.name)}`);
                    }}
                    className="w-full px-5 py-2.5 rounded-lg text-white font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(90deg, #F8B500 0%, #FFDA7A 100%)'
                    }}
                  >
                    Get More
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubsWithMap;
