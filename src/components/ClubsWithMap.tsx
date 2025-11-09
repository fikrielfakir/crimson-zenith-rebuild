import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Club } from "../../shared/schema";
import birdLogo from "@/assets/attached_assets/Group 288941_1762708813825.png";

const moroccanCities = [
  { name: "Fes", lat: 34.0181, lon: -5.0078 },
  { name: "Tetouan", lat: 35.5889, lon: -5.3626 },
  { name: "Al Hoceima", lat: 35.2517, lon: -3.9317 },
  { name: "Tanger", lat: 35.7595, lon: -5.8340 },
  { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
  { name: "Rabat", lat: 34.0209, lon: -6.8416 },
  { name: "Marrakech", lat: 31.6295, lon: -7.9811 },
];

const ClubsWithMap = () => {
  const [selectedCity, setSelectedCity] = useState("Al Hoceima");
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
      <section id="clubs" className="relative w-full h-screen flex items-center justify-center bg-[#0A1845]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading clubs...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="clubs" className="relative w-full h-screen overflow-hidden scroll-mt-0">
      {/* Satellite Map Background with Blur */}
      <div className="absolute inset-0 z-0">
        {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
          <iframe
            key={`${mapCenter.lat}-${mapCenter.lng}-${mapZoom}`}
            src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&maptype=satellite`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'blur(2px)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="brightness-75 transition-all duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#0A1845] flex items-center justify-center">
            <p className="text-white/60 text-center px-4">
              Map requires Google Maps API key.<br />
              Please configure VITE_GOOGLE_MAPS_API_KEY in environment variables.
            </p>
          </div>
        )}
      </div>

      {/* Gradient Overlay - Exact Figma Spec */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(180deg, #0A1845 0%, rgba(10, 24, 69, 0.9) 100%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full">
        {/* Header Section - Top Center with Exact Typography */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-full max-w-4xl px-4" style={{ top: '60px' }}>
          <h2 
            className="text-white mb-3"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '48px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            Our Clubs
          </h2>
          <p 
            className="mx-auto"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontSize: '20px',
              fontWeight: 500,
              color: '#FFFFFFCC',
              maxWidth: '700px',
              marginBottom: '40px',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>

        {/* Left Sidebar - City List with Exact Specs */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            width: '240px',
            paddingLeft: '60px',
            background: 'rgba(10, 24, 69, 0.6)',
            paddingTop: '40px',
            paddingBottom: '40px',
            backdropFilter: 'blur(10px)'
          }}
        >
          {moroccanCities.map((city) => {
            const isActive = selectedCity === city.name;
            return (
              <motion.button
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
                className="relative block text-left w-full group"
                style={{ 
                  fontSize: '18px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : '#FFFFFF99',
                  marginBottom: '20px',
                  fontFamily: 'Poppins, sans-serif'
                }}
                whileHover={{ color: '#FFFFFF' }}
                transition={{ duration: 0.3 }}
              >
                {isActive && (
                  <motion.div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[60px] w-[3px] h-[24px]"
                    style={{
                      background: 'linear-gradient(180deg, #FFD645 0%, #FFB800 100%)'
                    }}
                    layoutId="activeIndicator"
                  />
                )}
                {city.name}
              </motion.button>
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
          </button>
        </div>

        {/* Club Cards - Bottom Center with Exact Figma Specs */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 flex gap-6 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2"
          style={{
            bottom: '120px',
            maxWidth: '90%'
          }}
        >
          <AnimatePresence mode="popLayout">
            {displayedClubs.map((club, index) => {
              const isSelected = selectedClubId === club.id;
              const isHovered = hoveredClubId === club.id;
              
              return (
                <motion.div
                  key={club.id}
                  onClick={() => handleClubClick(club)}
                  onMouseEnter={() => setHoveredClubId(club.id)}
                  onMouseLeave={() => setHoveredClubId(null)}
                  className="relative flex-shrink-0 cursor-pointer overflow-hidden"
                  style={{
                    width: '330px',
                    minHeight: '160px',
                    background: 'rgba(11, 24, 74, 0.8)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: isSelected ? '1px solid rgba(255, 214, 69, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: isSelected ? 1.05 : (isHovered ? 1.03 : 1),
                  }}
                  whileHover={{
                    boxShadow: '0 0 10px rgba(255, 214, 69, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.1 
                  }}
                >
                  {/* Top Row: Icon & Member Badge */}
                  <div className="flex items-start justify-between mb-3">
                    {/* Club Icon - 48x48px with Gradient Background */}
                    <div 
                      className="flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #FFD645 0%, #FFB800 100%)',
                        boxShadow: '0 2px 8px rgba(248, 181, 0, 0.4)'
                      }}
                    >
                      <img 
                        src={birdLogo} 
                        alt="Club Icon" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>

                    {/* Members Badge - 28x28px */}
                    <div 
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: '28px',
                        height: '28px',
                        background: '#FFD645',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <span 
                        className="text-white font-semibold"
                        style={{ 
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      >
                        {club.memberCount || 62}
                      </span>
                    </div>
                  </div>

                  {/* Club Name - Poppins SemiBold, 18px */}
                  <h3 
                    className="text-white truncate mb-1"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '18px',
                      fontWeight: 600
                    }}
                  >
                    {club.name}
                  </h3>

                  {/* Club Location - Poppins Regular, 14px, #FFFFFFB3 */}
                  <p 
                    className="line-clamp-1 mb-3"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#FFFFFFB3'
                    }}
                  >
                    {club.location}
                  </p>

                  {/* Expanded Content - Only visible when selected */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {/* Club Image */}
                        {club.image && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <img 
                              src={club.image} 
                              alt={club.name}
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/330/128';
                              }}
                            />
                          </div>
                        )}

                        {/* Description */}
                        <p 
                          className="mb-4"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            fontWeight: 400,
                            lineHeight: '1.5',
                            color: '#FFFFFFB3',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {club.description || 'Explore the vibrant culture and community'}
                        </p>

                        {/* Get More Button - Exact Figma Gradient */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/club/${encodeURIComponent(club.name)}`);
                          }}
                          className="rounded-xl font-semibold"
                          style={{
                            background: 'linear-gradient(90deg, #FFD645 0%, #FFB800 100%)',
                            color: '#FFFFFF',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            padding: '10px 20px',
                            borderRadius: '12px'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          Get More
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
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

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800&display=swap');
      `}</style>
    </section>
  );
};

export default ClubsWithMap;
