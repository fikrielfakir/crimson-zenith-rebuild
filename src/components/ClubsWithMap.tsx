import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Settings } from "lucide-react";
import { Club } from "../../shared/schema";

const moroccanCities = [
  { name: "Fes", lat: 34.0181, lon: -5.0078 },
  { name: "Tetouan", lat: 35.5889, lon: -5.3626 },
  { name: "Al hoceima", lat: 35.2517, lon: -3.9317 },
  { name: "Tanger", lat: 35.7595, lon: -5.8340 },
  { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
  { name: "Rabat", lat: 34.0209, lon: -6.8416 },
  { name: "Merrackache", lat: 31.6295, lon: -7.9811 },
];

const ClubsWithMap = () => {
  const [selectedCity, setSelectedCity] = useState("Al hoceima");
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [hoveredClubId, setHoveredClubId] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.2517, lng: -3.9317 });
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
    latitude: parseFloat(club.latitude) || 35.2517,
    longitude: parseFloat(club.longitude) || -3.9317,
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

  useEffect(() => {
    if (displayedClubs.length > 0 && selectedClubId === null) {
      const firstClub = displayedClubs[0];
      setSelectedClubId(firstClub.id);
      const lat = typeof firstClub.latitude === 'number' ? firstClub.latitude : 35.2517;
      const lng = typeof firstClub.longitude === 'number' ? firstClub.longitude : -3.9317;
      setMapCenter({ lat, lng });
    }
  }, [displayedClubs, selectedClubId]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    const cityData = moroccanCities.find(c => c.name === cityName);
    if (cityData) {
      setMapZoom(12);
      setTimeout(() => setMapZoom(14), 400);
      setMapCenter({ lat: cityData.lat, lng: cityData.lon });
    }
    setSelectedClubId(null);
  };

  const handleClubClick = (club: Club) => {
    setSelectedClubId(club.id);
    if (club.latitude && club.longitude) {
      const lat = typeof club.latitude === 'number' ? club.latitude : 35.2517;
      const lng = typeof club.longitude === 'number' ? club.longitude : -3.9317;
      setMapCenter({ lat, lng });
      setMapZoom(15);
    }
  };

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 1, 10));

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
          key={`${mapCenter.lat}-${mapCenter.lng}-${mapZoom}`}
          src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&maptype=satellite`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="brightness-75 transition-all duration-1000 ease-out"
        />
      </div>

      {/* Refined Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(10, 26, 61, 0.95) 0%, rgba(10, 26, 61, 0.6) 50%, rgba(10, 26, 61, 0.2) 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full">
        {/* Header Section - Top Center */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center w-full max-w-4xl px-4">
          <h2 
            className="text-white font-bold mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '48px',
              letterSpacing: '0.5px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            Our Clubs
          </h2>
          <p 
            className="text-white mx-auto"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '20px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '700px',
              marginTop: '12px',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>

        {/* Left Sidebar - City List */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            width: '220px',
            paddingLeft: '60px',
            background: 'rgba(10, 26, 61, 0.95)',
            paddingTop: '40px',
            paddingBottom: '40px'
          }}
        >
          {moroccanCities.map((city) => {
            const isActive = selectedCity === city.name;
            return (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
                className="relative block text-left w-full transition-all duration-400 ease-out group"
                style={{ 
                  fontSize: isActive ? '20px' : '18px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '2.6em'
                }}
              >
                {/* Active Accent Bar */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[60px] w-[2px] h-[60%] animate-fade-in"
                    style={{
                      background: 'linear-gradient(180deg, #FFD54F 0%, #F8B500 100%)'
                    }}
                  />
                )}
                <span className="group-hover:text-white transition-colors duration-300">
                  {city.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map Controls - Right Side */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
          <button
            onClick={() => {}}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 group"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
            <span className="absolute right-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Settings
            </span>
          </button>
          <button
            onClick={handleZoomIn}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 group hover:bg-[rgba(255,255,255,0.25)]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            title="Zoom In"
          >
            <Plus className="w-5 h-5" />
            <span className="absolute right-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Zoom In
            </span>
          </button>
          <button
            onClick={handleZoomOut}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 group hover:bg-[rgba(255,255,255,0.25)]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            title="Zoom Out"
          >
            <Minus className="w-5 h-5" />
            <span className="absolute right-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Zoom Out
            </span>
          </button>
        </div>

        {/* Club Cards - Bottom Center (Higher Position) */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          style={{
            bottom: '30%',
            maxWidth: '90%'
          }}
        >
          {displayedClubs.map((club, index) => {
            const isSelected = selectedClubId === club.id;
            
            return (
              <div
                key={club.id}
                onClick={() => handleClubClick(club)}
                onMouseEnter={() => setHoveredClubId(club.id)}
                onMouseLeave={() => setHoveredClubId(null)}
                className="group relative flex-shrink-0 rounded-[20px] cursor-pointer transition-all duration-300"
                style={{
                  width: '360px',
                  height: isSelected ? '320px' : '220px',
                  background: isSelected 
                    ? 'linear-gradient(180deg, rgba(10,26,61,0.95) 0%, rgba(10,26,61,0.85) 100%)'
                    : 'linear-gradient(180deg, rgba(10,26,61,0.9) 0%, rgba(10,26,61,0.75) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '24px',
                  boxShadow: isSelected 
                    ? '0 0 12px rgba(248,181,0,0.4), 0 8px 16px rgba(0,0,0,0.25)' 
                    : '0 8px 16px rgba(0,0,0,0.25)',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Top Row: Icon & Member Badge */}
                <div className="flex items-start justify-between mb-3">
                  {/* Icon Circle */}
                  <div 
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'radial-gradient(circle, #FFD54F 0%, #F8B500 100%)',
                      boxShadow: '0 4px 8px rgba(248,181,0,0.3)'
                    }}
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                    </svg>
                  </div>

                  {/* Members Badge */}
                  <div 
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: '#F8B500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span className="text-white text-xs font-bold">{club.memberCount || 62}</span>
                  </div>
                </div>

                {/* Club Title */}
                <h3 
                  className="text-white font-bold mb-1 truncate"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '20px'
                  }}
                >
                  {club.name}
                </h3>

                {/* Club Subtitle (Location) */}
                <p 
                  className="text-white/80 line-clamp-1"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px'
                  }}
                >
                  {club.location}
                </p>

                {/* Expanded Content - Only visible when selected */}
                {isSelected && (
                  <div className="mt-4 animate-fade-in">
                    {/* Description */}
                    <p 
                      className="text-white/80 mb-4"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {club.description || '62 Via A, Bokidadan AL Hoceima'}
                    </p>

                    {/* Get More Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/club/${encodeURIComponent(club.name)}`);
                      }}
                      className="rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        width: '120px',
                        height: '40px',
                        background: 'linear-gradient(90deg, #F8B500 0%, #FFDD6E 100%)',
                        color: '#0A1A3D',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      Get More
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
};

export default ClubsWithMap;
