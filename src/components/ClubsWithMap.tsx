import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Locate, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Club } from "../../shared/schema";
import birdLogo from "@/assets/attached_assets/Group 288941_1762708813825.png";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const moroccanCities = [
  { name: "All Cities", lat: 31.7917, lon: -7.0926 },
  { name: "Fes", lat: 34.0181, lon: -5.0078 },
  { name: "Tetouan", lat: 35.5889, lon: -5.3626 },
  { name: "Al Hoceima", lat: 35.2517, lon: -3.9317 },
  { name: "Tanger", lat: 35.7595, lon: -5.834 },
  { name: "Casablanca", lat: 33.5731, lon: -7.5898 },
  { name: "Rabat", lat: 34.0209, lon: -6.8416 },
  { name: "Marrakech", lat: 31.6295, lon: -7.9811 },
  { name: "Chefchaouen", lat: 35.1689, lon: -5.2636 },
  { name: "Essaouira", lat: 31.5125, lon: -9.7738 },
  { name: "Agadir", lat: 30.4278, lon: -9.5981 },
  { name: "Meknes", lat: 33.8935, lon: -5.5473 },
  { name: "Ouarzazate", lat: 30.9335, lon: -6.937 },
  { name: "Merzouga", lat: 31.0801, lon: -4.0142 },
  { name: "Ifrane", lat: 33.5228, lon: -5.1107 },
  { name: "Azrou", lat: 33.4342, lon: -5.2214 },
];

// Generate unique club coordinates for each city with slight offsets
const generateClubCoordinates = (cityName: string, clubIndex: number) => {
  const city = moroccanCities.find((c) => c.name === cityName);
  if (!city) return { lat: 35.2517, lon: -3.9317 };

  // Add small offset based on club index (0.01 degrees ≈ 1km)
  const offsetLat = ((clubIndex % 3) - 1) * 0.015; // -0.015, 0, 0.015
  const offsetLon = ((Math.floor(clubIndex / 3) % 3) - 1) * 0.015;

  return {
    lat: city.lat + offsetLat,
    lon: city.lon + offsetLon,
  };
};

const ClubsWithMap = () => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [hoveredClubId, setHoveredClubId] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 31.7917, lng: -7.0926 });
  const [mapZoom, setMapZoom] = useState(6);
  const [mapStyleUrl, setMapStyleUrl] = useState<string | null>(null);
  const [cityScrollIndex, setCityScrollIndex] = useState(0);
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  const CITIES_PER_PAGE = 8;
  const visibleCities = moroccanCities.slice(
    cityScrollIndex,
    cityScrollIndex + CITIES_PER_PAGE,
  );
  const canScrollUp = cityScrollIndex > 0;
  const canScrollDown =
    cityScrollIndex + CITIES_PER_PAGE < moroccanCities.length;

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
    clubsResponse?.clubs?.map((club: any, index: number) => {
      // Generate coordinates based on club's city
      const clubCoords = generateClubCoordinates(club.location, index);

      return {
        id: club.id,
        name: club.name,
        description: club.description,
        location: club.location,
        memberCount: club.member_count,
        rating: club.rating,
        image: club.image,
        features: club.features,
        isActive: club.is_active,
        latitude: parseFloat(club.latitude) || clubCoords.lat,
        longitude: parseFloat(club.longitude) || clubCoords.lon,
        established: club.established,
        contactEmail: club.contact_email,
        contactPhone: club.contact_phone,
        createdAt: club.created_at ? new Date(club.created_at) : undefined,
        updatedAt: club.updated_at ? new Date(club.updated_at) : undefined,
      };
    }) || [];

  const filteredClubs = selectedCity === "All Cities" 
    ? clubs 
    : clubs.filter((club) =>
        club.location.toLowerCase().includes(selectedCity.toLowerCase()),
      );

  const displayedClubs =
    filteredClubs.length > 0 ? filteredClubs : clubs.slice(0, 3);

  // Create satellite map style using Esri World Imagery
  useEffect(() => {
    const satelliteStyle = {
      version: 8,
      name: "Satellite Map",
      sources: {
        satellite: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri",
          maxzoom: 18,
        },
        labels: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 18,
        },
      },
      layers: [
        {
          id: "satellite-layer",
          type: "raster",
          source: "satellite",
          minzoom: 0,
          maxzoom: 18,
        },
        {
          id: "labels-layer",
          type: "raster",
          source: "labels",
          minzoom: 0,
          maxzoom: 18,
          paint: {
            "raster-opacity": 0.8,
          },
        },
      ],
    };

    setMapStyleUrl(satelliteStyle as any);
    console.log("Using Esri World Imagery satellite tiles");
  }, []);

  useEffect(() => {
    if (selectedCity !== "All Cities" && displayedClubs.length > 0 && selectedClubId === null) {
      const firstClub = displayedClubs[0];
      setSelectedClubId(firstClub.id);
      const lat =
        typeof firstClub.latitude === "number" ? firstClub.latitude : 35.2517;
      const lng =
        typeof firstClub.longitude === "number" ? firstClub.longitude : -3.9317;
      setMapCenter({ lat, lng });
    }
  }, [displayedClubs, selectedClubId, selectedCity]);

  // Initialize map with free Esri satellite imagery
  useEffect(() => {
    if (map.current || !mapStyleUrl) return;

    let retryCount = 0;
    const maxRetries = 10;

    const tryInitMap = () => {
      if (!mapContainer.current) {
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(
            `Map container not ready, retry ${retryCount}/${maxRetries}`,
          );
          setTimeout(tryInitMap, 100);
        } else {
          console.error(
            "Failed to initialize map: container not available after retries",
          );
        }
        return;
      }

      console.log("Initializing map with container:", mapContainer.current);

      try {
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: mapStyleUrl,
          center: [mapCenter.lng, mapCenter.lat],
          zoom: mapZoom,
          attributionControl: false,
          crossSourceCollisions: false,
        });

        // Enable interactive map controls
        map.current.scrollZoom.enable();
        map.current.dragPan.enable();
        map.current.touchZoomRotate.enable();
        map.current.doubleClickZoom.enable();

        map.current.on("load", () => {
          console.log("✅ Map loaded successfully with satellite tiles!");
        });

        map.current.on("error", (e) => {
          console.error("❌ Map error:", e);
        });
      } catch (error) {
        console.error("❌ Failed to create map:", error);
      }
    };

    // Start trying to initialize
    const initTimeout = setTimeout(tryInitMap, 100);

    return () => {
      clearTimeout(initTimeout);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
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
      if (cityName === "All Cities") {
        setMapZoom(6);
        setMapCenter({ lat: cityData.lat, lng: cityData.lon });
      } else {
        setMapZoom(11);
        setTimeout(() => setMapZoom(13), 400);
        setMapCenter({ lat: cityData.lat, lng: cityData.lon });
      }
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
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 6));

  const handleCityScrollUp = () => {
    if (canScrollUp) {
      setCityScrollIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleCityScrollDown = () => {
    if (canScrollDown) {
      setCityScrollIndex((prev) =>
        Math.min(moroccanCities.length - CITIES_PER_PAGE, prev + 1),
      );
    }
  };

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
          // filter: "brightness(0.5) contrast(1.3) saturate(0.8)",
        }}
      />

      {/* Left Gradient Overlay (30% width, fades right) */}
      <div
        className="absolute top-0 left-0 h-full z-10 pointer-events-none gradient-left"
        style={{
          width: "35%",
          background:
            "linear-gradient(90deg, rgba(11, 26, 82, 0.95) 0%, rgba(11, 26, 82, 0.3) 70%, transparent 100%)",
        }}
      />

      {/* Right Gradient Overlay (30% width, fades left) */}
      <div
        className="absolute top-0 right-0 h-full z-10 pointer-events-none gradient-right"
        style={{
          width: "35%",
          background:
            "linear-gradient(270deg, rgba(11, 26, 82, 0.9) 0%, rgba(11, 26, 82, 0.3) 70%, transparent 100%)",
        }}
      />

      {/* Top Linear Gradient Overlay */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "300px",
          background:
            "linear-gradient(180deg, rgba(11, 26, 82, 0.95) 0%, rgba(11, 26, 82, 0.7) 50%, transparent 100%)",
        }}
      />

      {/* Bottom Gradient for additional darkening */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "250px",
          background:
            "linear-gradient(0deg, rgba(11, 26, 82, 0.6) 0%, transparent 100%)",
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

        {/* Sidebar (Cities List) - Left Side, with Scroll Arrows */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 sidebar-cities"
          style={{
            width: "260px",
            background: "transparent",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {/* Scroll Up Arrow */}
          {canScrollUp && (
            <button
              onClick={handleCityScrollUp}
              className="w-full flex items-center justify-center mb-2 transition-all duration-300"
              style={{
                padding: "8px",
                background: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector("svg");
                if (icon) {
                  (icon as SVGElement).style.filter =
                    "drop-shadow(0 0 8px rgba(255, 214, 69, 0.8))";
                }
              }}
              onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector("svg");
                if (icon) {
                  (icon as SVGElement).style.filter = "none";
                }
              }}
            >
              <ChevronUp className="w-5 h-5" style={{ color: "#FFD645" }} />
            </button>
          )}

          {/* Cities List */}
          <div style={{ padding: "20px 40px" }}>
            {visibleCities.map((city) => {
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
                    borderLeft: isActive
                      ? "3px solid #ffd54a"
                      : "3px solid transparent",
                    paddingLeft: "16px",
                    transition: "all 0.2s ease-in-out",
                    textShadow: isActive
                      ? "0 2px 4px rgba(0, 0, 0, 0.3)"
                      : "none",
                  }}
                  whileHover={{
                    scale: 1.05,
                    color: "#ffffff",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {city.name}
                </motion.button>
              );
            })}
          </div>

          {/* Scroll Down Arrow */}
          {canScrollDown && (
            <button
              onClick={handleCityScrollDown}
              className="w-full flex items-center justify-center mt-2 transition-all duration-300"
              style={{
                padding: "8px",
                background: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector("svg");
                if (icon) {
                  (icon as SVGElement).style.filter =
                    "drop-shadow(0 0 8px rgba(255, 214, 69, 0.8))";
                }
              }}
              onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector("svg");
                if (icon) {
                  (icon as SVGElement).style.filter = "none";
                }
              }}
            >
              <ChevronDown className="w-5 h-5" style={{ color: "#FFD645" }} />
            </button>
          )}
        </div>

        {/* Map Controls (Zoom / Locate) - Right Center */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 map-controls">
          <button
            onClick={() => {
              if (map.current && selectedClubId) {
                const selectedClub = displayedClubs.find(
                  (club) => club.id === selectedClubId,
                );
                if (selectedClub?.latitude && selectedClub?.longitude) {
                  setMapCenter({
                    lat:
                      typeof selectedClub.latitude === "number"
                        ? selectedClub.latitude
                        : 35.2517,
                    lng:
                      typeof selectedClub.longitude === "number"
                        ? selectedClub.longitude
                        : -3.9317,
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

        {/* Bottom Club Cards - New Design with Image and Gradient Separator */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 flex gap-10 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2 club-cards-container"
          style={{
            bottom: "60px",
            maxWidth: "85%",
            justifyContent: "center",
            gap: "30px",
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
                  className="relative flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 club-card"
                  style={{
                    width: isSelected ? "380px" : "200px",
                    height: isSelected ? "160px" : "90px",
                    borderRadius: "16px",
                    background: isSelected
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(255, 213, 74, 0.8), 0 4px 15px rgba(0, 0, 0, 0.3)"
                      : isHovered
                        ? "0 0 15px rgba(255, 213, 74, 0.5)"
                        : "0 2px 8px rgba(0, 0, 0, 0.2)",
                    transform: isSelected
                      ? "scale(1.05)"
                      : isHovered
                        ? "scale(1.02)"
                        : "scale(1)",
                    border: isSelected
                      ? "2px solid #FFD645"
                      : "2px solid transparent",
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
                  {isSelected ? (
                    // Active Card Design - with image, address, and More Details button
                    <div className="flex h-full">
                      {/* Left Side - Club Image/Icon with Gradient Background */}
                      <div
                        className="flex-shrink-0 relative flex items-center justify-center"
                        style={{
                          width: "140px",
                          background:
                            "linear-gradient(135deg, #FFD645 0%, #FFA500 100%)",
                        }}
                      >
                        <div
                          className="rounded-full flex items-center justify-center"
                          style={{
                            width: "70px",
                            height: "70px",
                            background: "#ffffff",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <img
                            src={club.image || birdLogo}
                            alt={club.name}
                            style={{
                              width: club.image ? "70px" : "40px",
                              height: club.image ? "70px" : "40px",
                              objectFit: "cover",
                              borderRadius: club.image ? "50%" : "0",
                              filter: club.image
                                ? "none"
                                : "brightness(0) saturate(100%) invert(73%) sepia(78%) saturate(471%) hue-rotate(3deg) brightness(102%) contrast(101%)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Gradient Separator */}
                      <div
                        style={{
                          width: "3px",
                          background:
                            "linear-gradient(180deg, rgba(255, 214, 69, 0.3) 0%, rgba(255, 214, 69, 0.8) 50%, rgba(255, 214, 69, 0.3) 100%)",
                        }}
                      />

                      {/* Right Side - Club Information */}
                      <div
                        className="flex-1 flex flex-col justify-center"
                        style={{
                          padding: "16px 18px",
                          background: "transparent",
                        }}
                      >
                        {/* Club Name */}
                        <h3
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#ffffff",
                            marginBottom: "6px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          {club.name}
                        </h3>

                        {/* Address/Location */}
                        <p
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "13px",
                            fontWeight: 400,
                            color: "#e0e0e0",
                            marginBottom: "10px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          📍 {club.location}
                        </p>

                        {/* More Details Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clubs/${club.id}`);
                          }}
                          className="transition-all duration-300"
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background:
                              "linear-gradient(135deg, #FFD645 0%, #FFB800 100%)",
                            color: "#0b1a52",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(255, 214, 69, 0.3)",
                            width: "fit-content",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #FFE066 0%, #FFC633 100%)";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "linear-gradient(135deg, #FFD645 0%, #FFB800 100%)";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Inactive Card Design - minimal, no image, just name and location
                    <div
                      className="flex flex-col justify-center h-full"
                      style={{ padding: "12px 16px" }}
                    >
                      {/* Club Name */}
                      <h3
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#ffffff",
                          marginBottom: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        {club.name}
                      </h3>

                      {/* Club's Actual Location */}
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#c8c8c8",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {club.location}
                      </p>
                    </div>
                  )}
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
