import React, { useEffect, useLayoutEffect } from 'react';
import { Club } from '../../shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Star } from 'lucide-react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_moroccoLow from "@amcharts/amcharts5-geodata/moroccoLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface MoroccoMapProps {
  clubs: Club[];
  onClubSelect?: (club: Club) => void;
  selectedClub?: Club | null;
}

const MoroccoMap = ({ clubs, onClubSelect, selectedClub }: MoroccoMapProps) => {
  const clubsWithCoordinates = clubs.filter(club => 
    club.latitude && club.longitude && 
    !isNaN(parseFloat(club.latitude)) && 
    !isNaN(parseFloat(club.longitude))
  );

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
        homeZoomLevel: 5,
        homeGeoPoint: { longitude: -7.09, latitude: 31.79 }
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_moroccoLow
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0x88a4bc),
      stroke: am5.color(0xffffff),
      strokeWidth: 1.5
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xf97316)
    });

    // Add club markers
    if (clubsWithCoordinates.length > 0) {
      const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {})
      );

      pointSeries.bullets.push(function(root, series, dataItem) {
        const circle = am5.Circle.new(root, {
          radius: 8,
          fill: am5.color(0xf97316),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          tooltipY: 0,
          cursorOverStyle: "pointer"
        });

        circle.states.create("hover", {
          scale: 1.3
        });

        circle.events.on("click", function() {
          const data = dataItem.dataContext as any;
          if (data && data.club && onClubSelect) {
            onClubSelect(data.club);
          }
        });

        return am5.Bullet.new(root, {
          sprite: circle
        });
      });

      clubsWithCoordinates.forEach((club) => {
        pointSeries.data.push({
          geometry: { 
            type: "Point", 
            coordinates: [parseFloat(club.longitude!), parseFloat(club.latitude!)] 
          },
          title: club.name,
          club: club
        });
      });

      pointSeries.bullets.push(function() {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{title}",
            fill: am5.color(0x000000),
            centerX: am5.p50,
            centerY: am5.p100,
            dy: 10,
            fontSize: 11,
            fontWeight: "500"
          })
        });
      });
    }

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [clubs, onClubSelect]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div 
        id="chartdiv" 
        className="w-full max-w-4xl rounded-lg shadow-lg overflow-hidden bg-gray-50"
        style={{ height: '500px' }}
      />
      
      {clubsWithCoordinates.length === 0 && (
        <div className="mt-4 bg-white rounded-lg p-6 max-w-md text-center shadow-md">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-orange-500" />
          <h3 className="text-lg font-semibold mb-2">No Club Locations Available</h3>
          <p className="text-sm text-gray-600">
            Club locations will appear on the map once coordinates are added.
          </p>
        </div>
      )}
      
      {selectedClub && clubsWithCoordinates.length > 0 && (
        <Card className="mt-6 w-full max-w-md shadow-xl border-2 border-orange-500">
          <CardHeader className="pb-2">
            {selectedClub.image && (
              <img 
                src={selectedClub.image} 
                alt={selectedClub.name} 
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            )}
            <CardTitle className="text-lg">{selectedClub.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">{selectedClub.location}</p>
            <p className="text-sm text-gray-700">{selectedClub.description}</p>
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{selectedClub.memberCount || 0} members</span>
              </div>
              {selectedClub.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-600">{selectedClub.rating}/5</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoroccoMap;
