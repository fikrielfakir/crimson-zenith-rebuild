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

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'club-popup'
      }).setDOMContent(popupDiv);

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
      
      // Open popup (ensure it opens)
      if (!clubMarker.marker.getPopup().isOpen()) {
        clubMarker.marker.togglePopup();
      }
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