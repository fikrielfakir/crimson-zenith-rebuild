import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Club } from "../../shared/schema";
import birdLogo from "@/assets/attached_assets/Group 288941_1762708813825.png";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const moroccanCities = [
  { name: "Fes", lat: 34.0181, lon: -5.0078 },
  { name: "Tetouan", lat: 35.5889, lon: -5.3626 },
  { name: "Al Hoceima", lat: 35.2517, lon: -3.9317 },
  { name: "Tanger", lat: 35.7595, lon: -5.834 },
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
  const [mapStyleUrl, setMapStyleUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  const { data: clubsResponse, isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs");
      if (!response.ok) {
        throw new Error("Failed to fetch clubs");
      }
      return response.json();
    },
  });

  const clubs: Club[] =
    clubsResponse?.clubs?.map((club: any) => ({
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

  const filteredClubs = clubs.filter((club) =>
    club.location.toLowerCase().includes(selectedCity.toLowerCase()),
  );

  const displayedClubs =
    filteredClubs.length > 0 ? filteredClubs : clubs.slice(0, 3);

  // Create satellite map style
  useEffect(() => {
    const satelliteStyle = {
      version: 8,
      name: "Satellite",
      sources: {
        "esri-satellite": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          ],
          tileSize: 256,
          attribution: "© Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community"
        }
      },
      layers: [
        {
          id: "satellite",
          type: "raster",
          source: "esri-satellite",
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };
    
    setMapStyleUrl(satelliteStyle as any);
    console.log('Using satellite imagery');
  }, []);

  // Debug map initialization
  useEffect(() => {
    console.log("Map container:", mapContainer.current);
    console.log("Map style URL:", mapStyleUrl);
  }, [mapStyleUrl]);

  useEffect(() => {
    if (displayedClubs.length > 0 && selectedClubId === null) {
      const firstClub = displayedClubs[0];
      setSelectedClubId(firstClub.id);
      const lat =
        typeof firstClub.latitude === "number" ? firstClub.latitude : 35.2517;
      const lng =
        typeof firstClub.longitude === "number" ? firstClub.longitude : -3.9317;
      setMapCenter({ lat, lng });
    }
  }, [displayedClubs, selectedClubId]);

  // Initialize map with MapTiler satellite imagery
  useEffect(() => {
    if (map.current || !mapContainer.current || !mapStyleUrl) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyleUrl,
      center: [mapCenter.lng, mapCenter.lat],
      zoom: mapZoom,
      attributionControl: false,
      crossSourceCollisions: false,
    });

    // Disable default controls
    map.current.scrollZoom.disable();
    map.current.dragPan.disable();
    map.current.touchZoomRotate.disable();
    map.current.doubleClickZoom.disable();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapStyleUrl]);

  // Update map center and zoom
  useEffect(() => {
    if (!map.current) return;

    map.current.flyTo({
      center: [mapCenter.lng, mapCenter.lat],
      zoom: mapZoom,
      duration: 1000,
      essential: true,
    });
  }, [mapCenter, mapZoom]);

  // Update markers for displayed clubs
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add marker for selected club
    const selectedClub = displayedClubs.find(
      (club) => club.id === selectedClubId,
    );
    if (selectedClub && selectedClub.latitude && selectedClub.longitude) {
      const el = document.createElement("div");
      el.className = "club-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.backgroundImage =
        "radial-gradient(circle, #FFD645 0%, #FFB800 100%)";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 4px 12px rgba(255, 214, 69, 0.6)";
      el.style.cursor = "pointer";

      const lng =
        typeof selectedClub.longitude === "number"
          ? selectedClub.longitude
          : parseFloat(String(selectedClub.longitude));
      const lat =
        typeof selectedClub.latitude === "number"
          ? selectedClub.latitude
          : parseFloat(String(selectedClub.latitude));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current);

      markers.current.push(marker);
    }
  }, [displayedClubs, selectedClubId]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    const cityData = moroccanCities.find((c) => c.name === cityName);
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
      const lat = typeof club.latitude === "number" ? club.latitude : 35.2517;
      const lng = typeof club.longitude === "number" ? club.longitude : -3.9317;
      setMapCenter({ lat, lng });
      setMapZoom(15);
    }
  };

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 10));

  if (isLoading) {
    return (
      <section
        id="clubs"
        className="relative w-full h-screen flex items-center justify-center bg-[#0A1845]"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading clubs...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="clubs"
      className="relative w-full h-screen overflow-hidden scroll-mt-0"
    >
      {/* Satellite Map Background */}
      <div
        ref={mapContainer}
        id="clubs-map"
        className="absolute inset-0 z-0"
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
      />

      {/* Map Blur & Brightness Overlay */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          backdropFilter: "blur(2px) brightness(75%)",
          WebkitBackdropFilter: "blur(2px) brightness(75%)",
        }}
      />

      {/* Gradient Overlay - Horizontal Left-to-Right (Exact Figma Spec) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, #0A1A3D 0%, rgba(10, 26, 61, 0.4) 60%, transparent 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full">
        {/* Header Section - Top Center with Exact Typography */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 text-center w-full max-w-4xl px-4"
          style={{ top: "60px" }}
        >
          <h2
            className="text-white mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            }}
          >
            Our Clubs
          </h2>
          <p
            className="mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              color: "#FFFFFFCC",
              maxWidth: "700px",
              marginBottom: "40px",
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>

        {/* Left Sidebar - City List with Exact Specs */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{
            fontFamily: "Poppins, sans-serif",
            width: "240px",
            paddingLeft: "80px",
            paddingTop: "40px",
            paddingBottom: "40px",
            background: "rgba(10, 26, 61, 0.3)",
            // backdropFilter: "blur(2px)",
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
                  fontSize: "18px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#FFFFFF" : "#FFFFFF99",
                  marginBottom: "20px",
                  fontFamily: "Poppins, sans-serif",
                }}
                whileHover={{ color: "#FFFFFF" }}
                transition={{ duration: 0.3 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[60px] w-[3px] h-[24px]"
                    style={{
                      background:
                        "linear-gradient(180deg, #FFD645 0%, #FFB800 100%)",
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
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomIn}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 group hover:bg-[rgba(255,255,255,0.25)]"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            title="Zoom In"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 group hover:bg-[rgba(255,255,255,0.25)]"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
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
            bottom: "120px",
            maxWidth: "90%",
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
                  className="relative flex-shrink-0 cursor-pointer"
                  style={{
                    width: "300px",
                    minHeight: "auto",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.1,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Club Icon - White circle with yellow bird */}
                    <div
                      className="flex-shrink-0 rounded-full flex items-center justify-center border-2 border-white"
                      style={{
                        width: "64px",
                        height: "64px",
                        background: "#FFFFFF",
                      }}
                    >
                      <img
                        src={birdLogo}
                        alt="Club Icon"
                        className="w-10 h-10 object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Club Name */}
                      <h3
                        className="text-white mb-1 group-hover:text-yellow-400 transition-colors"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "18px",
                          fontWeight: 700,
                        }}
                      >
                        {club.name}
                      </h3>

                      {/* Club Location */}
                      <p
                        className="mb-0.5"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#FFFFFFB3",
                        }}
                      >
                        {club.location}
                      </p>

                      {/* Member Count */}
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#FFFFFF99",
                        }}
                      >
                        {club.memberCount || "62"}
                      </p>
                    </div>
                  </div>
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
