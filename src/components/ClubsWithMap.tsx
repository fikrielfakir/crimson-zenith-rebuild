import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Locate } from "lucide-react";
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

  // Create free satellite map style (Esri World Imagery - Free Alternative)
  useEffect(() => {
    const satelliteStyle = {
      version: 8,
      name: "Free Satellite Map",
      sources: {
        "satellite-tiles": {
          type: "raster",
          tiles: [
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
          maxzoom: 19,
        },
        "labels": {
          type: "raster",
          tiles: [
            "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "satellite-base",
          type: "raster",
          source: "satellite-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: "satellite-labels",
          type: "raster",
          source: "labels",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    setMapStyleUrl(satelliteStyle as any);
    console.log("Using free Esri satellite imagery with labels");
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

  // Initialize map with free Esri satellite imagery
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
      {/* Satellite Map Background with Filters */}
      <div
        ref={mapContainer}
        id="clubs-map"
        className="absolute inset-0 z-0"
        style={{
          height: "100vh",
          width: "100%",
          position: "absolute",
          filter: "brightness(0.85) contrast(1.1)",
        }}
      />

      {/* Left Gradient Overlay (30% width, fades right) */}
      <div
        className="absolute top-0 left-0 h-full z-10 pointer-events-none gradient-left"
        style={{
          width: "30%",
          background:
            "linear-gradient(90deg, rgba(11, 26, 82, 0.8) 0%, transparent 100%)",
        }}
      />

      {/* Right Gradient Overlay (30% width, fades left) */}
      <div
        className="absolute top-0 right-0 h-full z-10 pointer-events-none gradient-right"
        style={{
          width: "30%",
          background:
            "linear-gradient(270deg, rgba(11, 26, 82, 0.75) 0%, transparent 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full">
        {/* Title and Subtitle - Top-Center */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 text-center w-full max-w-4xl px-4"
          style={{ top: "120px" }}
        >
          <h2
            className="text-white title-main"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "50px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              marginBottom: "8px",
            }}
          >
            Our Clubs
          </h2>
          <p
            className="mx-auto subtitle-text"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "#d6d6d6",
              letterSpacing: "0.3px",
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>

        {/* Sidebar (Cities List) - Left Side, Transparent Background */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 sidebar-cities"
          style={{
            width: "260px",
            padding: "60px 40px",
            background: "transparent",
            fontFamily: "Poppins, sans-serif",
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
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "#ffffff" : "#c8c8c8",
                  marginBottom: "20px",
                  fontFamily: "Poppins, sans-serif",
                  borderLeft: isActive ? "3px solid #ffd54a" : "3px solid transparent",
                  paddingLeft: "16px",
                  transition: "all 0.2s ease-in-out",
                  textShadow: isActive ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
                }}
                whileHover={{ 
                  scale: 1.05,
                  color: "#ffffff"
                }}
                transition={{ duration: 0.2 }}
              >
                {city.name}
              </motion.button>
            );
          })}
        </div>

        {/* Map Controls (Zoom / Locate) - Right Center */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 map-controls">
          <button
            onClick={() => {
              if (map.current && selectedClubId) {
                const selectedClub = displayedClubs.find(
                  (club) => club.id === selectedClubId
                );
                if (selectedClub?.latitude && selectedClub?.longitude) {
                  setMapCenter({
                    lat: typeof selectedClub.latitude === "number" ? selectedClub.latitude : 35.2517,
                    lng: typeof selectedClub.longitude === "number" ? selectedClub.longitude : -3.9317,
                  });
                  setMapZoom(15);
                }
              }
            }}
            className="rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              width: "45px",
              height: "45px",
              background: "#ffffff",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffd54a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
            title="Locate Selected Club"
          >
            <Locate className="w-5 h-5" style={{ color: "#0b1a52" }} />
          </button>
          <button
            onClick={handleZoomIn}
            className="rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              width: "45px",
              height: "45px",
              background: "#ffffff",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffd54a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
            title="Zoom In"
          >
            <Plus className="w-5 h-5" style={{ color: "#0b1a52" }} />
          </button>
          <button
            onClick={handleZoomOut}
            className="rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              width: "45px",
              height: "45px",
              background: "#ffffff",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffd54a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
            title="Zoom Out"
          >
            <Minus className="w-5 h-5" style={{ color: "#0b1a52" }} />
          </button>
        </div>

        {/* Bottom Club Cards - Glassmorphism Design */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 flex gap-10 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2 club-cards-container"
          style={{
            bottom: "60px",
            maxWidth: "80%",
            justifyContent: "center",
            gap: "40px",
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
                  className="relative flex-shrink-0 cursor-pointer flex items-center gap-3 transition-all duration-300 club-card"
                  style={{
                    width: "250px",
                    height: "110px",
                    background: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
                    borderRadius: "18px",
                    backdropFilter: "blur(12px)",
                    padding: "18px 22px",
                    boxShadow: isHovered ? "0 0 10px rgba(255, 213, 74, 0.6)" : "none",
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
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
                  {/* Club Icon - White circle with yellow bird */}
                  <div
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      width: "56px",
                      height: "56px",
                      background: "#ffffff",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <img
                      src={birdLogo}
                      alt="Club Icon"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                        filter: "brightness(0) saturate(100%) invert(73%) sepia(78%) saturate(471%) hue-rotate(3deg) brightness(102%) contrast(101%)",
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Club Name */}
                    <h3
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#ffffff",
                        marginBottom: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {club.name}
                    </h3>

                    {/* Address/Location */}
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#d6d6d6",
                        marginBottom: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {club.location}
                    </p>

                    {/* City */}
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#bfbfbf",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {selectedCity}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Scrollbar Styles & Responsive Design */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
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

        /* Responsive Adjustments - Tablet (max-width 1024px) */
        @media (max-width: 1024px) {
          #clubs .gradient-left,
          #clubs .gradient-right {
            width: 25% !important;
          }
          
          #clubs .sidebar-cities {
            width: 200px !important;
            padding: 40px 30px !important;
          }
          
          #clubs .title-main {
            font-size: 40px !important;
          }
          
          #clubs .club-cards-container {
            flex-wrap: wrap;
            justify-content: center;
            max-width: 95% !important;
          }
          
          #clubs .club-card {
            width: calc(50% - 20px) !important;
          }
        }

        /* Responsive Adjustments - Mobile (max-width 768px) */
        @media (max-width: 768px) {
          #clubs .gradient-left,
          #clubs .gradient-right {
            width: 20% !important;
          }
          
          #clubs .sidebar-cities {
            display: none !important;
          }
          
          #clubs .title-main {
            font-size: 32px !important;
          }
          
          #clubs .subtitle-text {
            font-size: 16px !important;
          }
          
          #clubs .map-controls button {
            width: 36px !important;
            height: 36px !important;
          }
          
          #clubs .map-controls button svg {
            width: 16px !important;
            height: 16px !important;
          }
          
          #clubs .club-cards-container {
            overflow-x: auto;
            flex-wrap: nowrap;
            max-width: 95% !important;
            padding-bottom: 10px;
          }
          
          #clubs .club-card {
            width: 250px !important;
            min-width: 250px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ClubsWithMap;
