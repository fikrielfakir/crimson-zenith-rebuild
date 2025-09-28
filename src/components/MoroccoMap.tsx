import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Club } from '../../shared/schema';

// Set Mapbox access token from environment
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MoroccoMapProps {
  clubs: Club[];
  onClubSelect?: (club: Club) => void;
  selectedClub?: Club | null;
}

interface ClubMarker {
  id: number;
  marker: mapboxgl.Marker;
  popup: mapboxgl.Popup;
}

const MoroccoMap = ({ clubs, onClubSelect, selectedClub }: MoroccoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [clubMarkers, setClubMarkers] = useState<ClubMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
      console.error('Mapbox access token is not configured');
      return;
    }

    try {
      // Morocco bounds: West to East, South to North
      const moroccoBounds: mapboxgl.LngLatBoundsLike = [
        [-17.5, 20.5], // Southwest coordinates [lng, lat]
        [-0.5, 36.0]   // Northeast coordinates [lng, lat]
      ];

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12', // Outdoor style for Morocco terrain
        center: [-7.09, 31.79], // Center of Morocco
        zoom: 5.5,
        maxBounds: moroccoBounds, // Restrict map to Morocco
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add full screen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    } catch (error) {
      console.error('Error loading map:', error);
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

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%);
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
        transition: all 0.3s ease;
      `;
      markerElement.innerHTML = club.memberCount ? club.memberCount.toString() : '0';

      // Hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = '1';
      });

      // Create popup with club information
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'club-popup'
      }).setHTML(`
        <div class="p-4 min-w-[250px]">
          <div class="mb-3">
            ${club.image ? `<img src="${club.image}" alt="${club.name}" class="w-full h-32 object-cover rounded-lg mb-3" />` : ''}
            <h3 class="font-bold text-lg text-gray-900 mb-1">${club.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${club.location}</p>
          </div>
          
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Members:</span>
              <span class="font-semibold text-blue-600">${club.memberCount || 0}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Rating:</span>
              <span class="font-semibold text-yellow-600">${'★'.repeat(club.rating || 5)}</span>
            </div>
            ${club.established ? `
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Established:</span>
                <span class="font-semibold">${club.established}</span>
              </div>
            ` : ''}
          </div>
          
          <p class="text-sm text-gray-700 mb-4 line-clamp-2">${club.description}</p>
          
          <div class="flex gap-2">
            <button 
              onclick="window.location.href='/clubs/${club.id}'" 
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </button>
            ${club.contactEmail || club.contactPhone ? `
              <button 
                onclick="window.open('${club.contactEmail ? `mailto:${club.contactEmail}` : `tel:${club.contactPhone}`}', '_blank')" 
                class="px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-lg text-sm font-medium transition-colors"
              >
                Contact
              </button>
            ` : ''}
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Handle marker click
      markerElement.addEventListener('click', () => {
        if (onClubSelect) {
          onClubSelect(club);
        }
        marker.togglePopup();
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
      const bounds = new mapboxgl.LngLatBounds();
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
      
      // Open popup
      clubMarker.marker.togglePopup();
    }
  }, [selectedClub, clubMarkers]);

  if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-gray-600">Mapbox access token is required to display the interactive map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MoroccoMap;