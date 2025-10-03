import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Club } from '../../shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';

interface MoroccoMapProps {
  clubs: Club[];
  onClubSelect?: (club: Club) => void;
  selectedClub?: Club | null;
}

interface ClubMarker {
  id: number;
  marker: maplibregl.Marker;
  popup: maplibregl.Popup;
}

// WebGL support detection
const isWebGLSupported = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return context && typeof context.getParameter === 'function';
  } catch {
    return false;
  }
};

const MoroccoMap = ({ clubs, onClubSelect, selectedClub }: MoroccoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [clubMarkers, setClubMarkers] = useState<ClubMarker[]>([]);
  const [mapError, setMapError] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Check WebGL support and initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check WebGL support first
    if (!isWebGLSupported()) {
      console.warn('WebGL not supported, using fallback map');
      setWebglSupported(false);
      setMapError(true);
      return;
    }

    try {
      // Morocco bounds: West to East, South to North
      const moroccoBounds: maplibregl.LngLatBoundsLike = [
        [-17.5, 20.5], // Southwest coordinates [lng, lat]
        [-0.5, 36.0]   // Northeast coordinates [lng, lat]
      ];

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json', // Free MapLibre style
        center: [-7.09, 31.79], // Center of Morocco
        zoom: 5.5,
        maxBounds: moroccoBounds, // Restrict map to Morocco
        attributionControl: false,
        preserveDrawingBuffer: false
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add full screen control
      map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

      // Set success state
      setMapError(false);
      setWebglSupported(true);

    } catch (error) {
      console.error('Error loading map:', error);
      setMapError(true);
      setWebglSupported(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add club markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    clubMarkers.forEach(({ marker, popup }) => {
      marker.remove();
      popup.remove();
    });

    // Filter clubs with valid coordinates
    const clubsWithCoordinates = clubs.filter(club => 
      club.latitude && club.longitude && 
      !isNaN(parseFloat(club.latitude)) && 
      !isNaN(parseFloat(club.longitude))
    );

    if (clubsWithCoordinates.length === 0) {
      setClubMarkers([]);
      return;
    }

    // Create new markers
    const newMarkers: ClubMarker[] = clubsWithCoordinates.map(club => {
      const lat = parseFloat(club.latitude!);
      const lng = parseFloat(club.longitude!);

      // Create custom marker element with image and name
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 120px;
        min-height: 80px;
        background: white;
        border: 2px solid #f97316;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
      `;

      // Add club image
      const clubImg = document.createElement('img');
      clubImg.src = club.image || '/api/placeholder/60/40';
      clubImg.alt = club.name || '';
      clubImg.style.cssText = `
        width: 60px;
        height: 40px;
        object-fit: cover;
        border-radius: 6px;
        margin-bottom: 4px;
      `;
      markerElement.appendChild(clubImg);

      // Add club name
      const clubName = document.createElement('div');
      clubName.textContent = club.name || 'Unknown Club';
      clubName.style.cssText = `
        font-size: 11px;
        font-weight: 600;
        color: #1f2937;
        text-align: center;
        line-height: 1.2;
        max-width: 100px;
        word-wrap: break-word;
        margin-bottom: 2px;
      `;
      markerElement.appendChild(clubName);

      // Add member count badge
      const memberBadge = document.createElement('div');
      memberBadge.textContent = `${club.memberCount || 0} members`;
      memberBadge.style.cssText = `
        font-size: 9px;
        color: #f97316;
        font-weight: 500;
        text-align: center;
      `;
      markerElement.appendChild(memberBadge);

      // Add pointer arrow at bottom
      const arrow = document.createElement('div');
      arrow.style.cssText = `
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid #f97316;
      `;
      markerElement.appendChild(arrow);

      // Create hover card with larger image
      const hoverCard = document.createElement('div');
      hoverCard.className = 'hover-card';
      hoverCard.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        width: 280px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        padding: 12px;
        z-index: 2000;
        display: none;
        pointer-events: none;
      `;

      // Hover card image
      const hoverImg = document.createElement('img');
      hoverImg.src = club.image || '/api/placeholder/280/180';
      hoverImg.alt = club.name || '';
      hoverImg.style.cssText = `
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 8px;
      `;
      hoverCard.appendChild(hoverImg);

      // Hover card title
      const hoverTitle = document.createElement('div');
      hoverTitle.textContent = club.name || 'Unknown Club';
      hoverTitle.style.cssText = `
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 4px;
      `;
      hoverCard.appendChild(hoverTitle);

      // Hover card description
      const hoverDesc = document.createElement('div');
      hoverDesc.textContent = club.description || '';
      hoverDesc.style.cssText = `
        font-size: 13px;
        color: #6b7280;
        line-height: 1.4;
        margin-bottom: 8px;
        max-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      hoverCard.appendChild(hoverDesc);

      // Hover card stats
      const hoverStats = document.createElement('div');
      hoverStats.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        border-top: 1px solid #e5e7eb;
      `;

      const membersSpan = document.createElement('span');
      membersSpan.textContent = `👥 ${club.memberCount || 0} Members`;
      membersSpan.style.cssText = `
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
      `;
      hoverStats.appendChild(membersSpan);

      if (club.rating) {
        const ratingSpan = document.createElement('span');
        ratingSpan.textContent = `⭐ ${club.rating}/5`;
        ratingSpan.style.cssText = `
          font-size: 12px;
          color: #f59e0b;
          font-weight: 600;
        `;
        hoverStats.appendChild(ratingSpan);
      }

      hoverCard.appendChild(hoverStats);
      markerElement.appendChild(hoverCard);

      // Hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.15)';
        markerElement.style.zIndex = '1000';
        hoverCard.style.display = 'block';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '1';
        hoverCard.style.display = 'none';
      });

      // Create popup with club information (safely)
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-4 min-w-[250px]';
      
      // Header section
      const headerDiv = document.createElement('div');
      headerDiv.className = 'mb-3';
      
      // Image (if exists)
      if (club.image) {
        const img = document.createElement('img');
        img.src = club.image;
        img.alt = club.name || '';
        img.className = 'w-full h-32 object-cover rounded-lg mb-3';
        headerDiv.appendChild(img);
      }
      
      // Club name
      const nameH3 = document.createElement('h3');
      nameH3.className = 'font-bold text-lg text-gray-900 mb-1';
      nameH3.textContent = club.name || 'Unknown Club';
      headerDiv.appendChild(nameH3);
      
      // Location
      const locationP = document.createElement('p');
      locationP.className = 'text-sm text-gray-600 mb-2';
      locationP.textContent = club.location || '';
      headerDiv.appendChild(locationP);
      
      popupDiv.appendChild(headerDiv);
      
      // Stats section
      const statsDiv = document.createElement('div');
      statsDiv.className = 'space-y-2 mb-4';
      
      // Members
      const membersDiv = document.createElement('div');
      membersDiv.className = 'flex justify-between text-sm';
      const membersLabel = document.createElement('span');
      membersLabel.className = 'text-gray-600';
      membersLabel.textContent = 'Members:';
      const membersValue = document.createElement('span');
      membersValue.className = 'font-semibold text-blue-600';
      membersValue.textContent = (club.memberCount || 0).toString();
      membersDiv.appendChild(membersLabel);
      membersDiv.appendChild(membersValue);
      statsDiv.appendChild(membersDiv);
      
      // Rating
      const ratingDiv = document.createElement('div');
      ratingDiv.className = 'flex justify-between text-sm';
      const ratingLabel = document.createElement('span');
      ratingLabel.className = 'text-gray-600';
      ratingLabel.textContent = 'Rating:';
      const ratingValue = document.createElement('span');
      ratingValue.className = 'font-semibold text-yellow-600';
      ratingValue.textContent = '★'.repeat(club.rating || 5);
      ratingDiv.appendChild(ratingLabel);
      ratingDiv.appendChild(ratingValue);
      statsDiv.appendChild(ratingDiv);
      
      // Established (if exists)
      if (club.established) {
        const establishedDiv = document.createElement('div');
        establishedDiv.className = 'flex justify-between text-sm';
        const establishedLabel = document.createElement('span');
        establishedLabel.className = 'text-gray-600';
        establishedLabel.textContent = 'Established:';
        const establishedValue = document.createElement('span');
        establishedValue.className = 'font-semibold';
        establishedValue.textContent = club.established;
        establishedDiv.appendChild(establishedLabel);
        establishedDiv.appendChild(establishedValue);
        statsDiv.appendChild(establishedDiv);
      }
      
      popupDiv.appendChild(statsDiv);
      
      // Description
      const descriptionP = document.createElement('p');
      descriptionP.className = 'text-sm text-gray-700 mb-4 line-clamp-2';
      descriptionP.textContent = club.description || '';
      popupDiv.appendChild(descriptionP);
      
      // Buttons section
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'flex gap-2';
      
      // View Details button
      const viewDetailsBtn = document.createElement('button');
      viewDetailsBtn.className = 'flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors';
      viewDetailsBtn.textContent = 'View Details';
      viewDetailsBtn.onclick = () => {
        window.location.href = `/club/${encodeURIComponent(club.name || '')}`;
      };
      buttonsDiv.appendChild(viewDetailsBtn);
      
      // Contact button (if contact info exists)
      if (club.contactEmail || club.contactPhone) {
        const contactBtn = document.createElement('button');
        contactBtn.className = 'px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-lg text-sm font-medium transition-colors';
        contactBtn.textContent = 'Contact';
        contactBtn.onclick = () => {
          if (club.contactEmail) {
            window.open(`mailto:${club.contactEmail}`, '_blank');
          } else if (club.contactPhone) {
            window.open(`tel:${club.contactPhone}`, '_blank');
          }
        };
        buttonsDiv.appendChild(contactBtn);
      }
      
      popupDiv.appendChild(buttonsDiv);

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'club-popup'
      }).setDOMContent(popupDiv);

      // Create marker
      const marker = new maplibregl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Handle marker click
      markerElement.addEventListener('click', () => {
        if (onClubSelect) {
          onClubSelect(club);
        }
        // Always open popup on click
        if (!marker.getPopup().isOpen()) {
          marker.togglePopup();
        }
      });

      return {
        id: club.id,
        marker,
        popup
      };
    });

    setClubMarkers(newMarkers);

    // Fit map to show all markers
    if (clubsWithCoordinates.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      clubsWithCoordinates.forEach(club => {
        bounds.extend([parseFloat(club.longitude!), parseFloat(club.latitude!)]);
      });
      map.current.fitBounds(bounds, { 
        padding: 50,
        maxZoom: 10 
      });
    } else if (clubsWithCoordinates.length === 1) {
      const club = clubsWithCoordinates[0];
      map.current.setCenter([parseFloat(club.longitude!), parseFloat(club.latitude!)]);
      map.current.setZoom(8);
    }

  }, [clubs, onClubSelect]);

  // Handle selected club
  useEffect(() => {
    if (!selectedClub || !map.current) return;

    const clubMarker = clubMarkers.find(m => m.id === selectedClub.id);
    if (clubMarker && selectedClub.latitude && selectedClub.longitude) {
      // Center map on selected club
      map.current.flyTo({
        center: [parseFloat(selectedClub.longitude), parseFloat(selectedClub.latitude)],
        zoom: 10,
        duration: 1000
      });
      
      // Open popup (ensure it opens)
      if (!clubMarker.marker.getPopup().isOpen()) {
        clubMarker.marker.togglePopup();
      }
    }
  }, [selectedClub, clubMarkers]);

  // MapLibre doesn't require an access token - removed token check

  // Fallback component for when WebGL is not supported
  const FallbackMap = () => {
    const clubsWithCoordinates = clubs.filter(club => 
      club.latitude && club.longitude && 
      !isNaN(parseFloat(club.latitude)) && 
      !isNaN(parseFloat(club.longitude))
    );

    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-green-50 relative">
        {/* Morocco outline SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="400"
            height="300"
            viewBox="0 0 400 300"
            className="opacity-20"
          >
            <path
              d="M50 150 Q80 80 150 70 Q220 65 300 80 Q350 90 380 120 L380 200 Q350 230 300 240 Q200 250 100 240 Q60 220 50 180 Z"
              fill="#10b981"
              stroke="#059669"
              strokeWidth="2"
            />
            <text x="200" y="160" textAnchor="middle" className="fill-gray-600 text-xl font-semibold">Morocco</text>
          </svg>
        </div>
        
        {/* Club locations overlay */}
        <div className="absolute inset-0 p-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Club Locations (Interactive map unavailable)
            </h3>
            <p className="text-sm text-gray-600">WebGL is not supported in this environment. Club locations are shown below:</p>
          </div>
          
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {clubsWithCoordinates.map((club, index) => (
              <Card 
                key={club.id} 
                className="cursor-pointer hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm"
                onClick={() => onClubSelect && onClubSelect(club)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-800">{club.name}</CardTitle>
                      <p className="text-xs text-gray-600 mt-1">{club.location}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{club.memberCount}+ members</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {parseFloat(club.latitude!).toFixed(2)}°, {parseFloat(club.longitude!).toFixed(2)}°
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render fallback if WebGL is not supported or map failed to load
  if (mapError || !webglSupported) {
    return <FallbackMap />;
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MoroccoMap;