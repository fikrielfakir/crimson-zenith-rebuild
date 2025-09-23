import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MoroccoMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const clubs = [
    { name: 'Marrakech Club', coordinates: [-7.9811, 31.6295], members: '250+' },
    { name: 'Fez Club', coordinates: [-5.0003, 34.0331], members: '180+' },
    { name: 'Casablanca Club', coordinates: [-7.5898, 33.5731], members: '320+' },
  ];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isMapLoaded) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-6.8498, 31.7917], // Center of Morocco
        zoom: 5.5,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: false,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        // Add markers for each club
        clubs.forEach((club) => {
          // Create custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.cssText = `
            width: 12px;
            height: 12px;
            background-color: hsl(225, 70%, 20%);
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          `;

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; color: hsl(225, 70%, 20%);">${club.name}</h3>
              <p style="margin: 0; color: hsl(225, 15%, 46%); font-size: 14px;">${club.members} Members</p>
            </div>
          `);

          // Add marker to map
          new mapboxgl.Marker(markerElement)
            .setLngLat(club.coordinates as [number, number])
            .setPopup(popup)
            .addTo(map.current!);
        });

        setIsMapLoaded(true);
      });

    } catch (error) {
      console.error('Error loading map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsMapLoaded(false);
    }
  };

  return (
    <div className="w-full h-full">
      {!isMapLoaded && (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center p-8">
            <CardTitle className="text-xl mb-4">Setup Map</CardTitle>
            <p className="text-muted-foreground mb-4">
              Enter your Mapbox public token to view the interactive Morocco map.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Get your token at: <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="pk.eyJ1Ijoi..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                Load Map
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isMapLoaded && (
        <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
      )}
    </div>
  );
};

export default MoroccoMap;