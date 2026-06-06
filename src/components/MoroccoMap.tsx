import React, { useLayoutEffect } from 'react';
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
        homeZoomLevel: 6,
        homeGeoPoint: { longitude: -7.09, latitude: 31.79 }
      })
    );

    // Add zoom controls
    const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    zoomControl.homeButton.set("visible", true);

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

    // Add club markers with advanced PIN design
    if (clubsWithCoordinates.length > 0) {
      const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {})
      );

      // Create custom PIN markers
      pointSeries.bullets.push(function(root, series, dataItem) {
        const container = am5.Container.new(root, {});

        // PIN base (teardrop shape using circle and triangle)
        const pin = container.children.push(
          am5.Graphics.new(root, {
            svgPath: "M12,0 C5.4,0 0,5.4 0,12 C0,18.6 12,36 12,36 C12,36 24,18.6 24,12 C24,5.4 18.6,0 12,0 Z",
            scale: 1.2,
            centerX: am5.p50,
            centerY: am5.p100,
            fill: am5.color(0xf97316),
            stroke: am5.color(0xffffff),
            strokeWidth: 2,
            tooltipY: 0,
            cursorOverStyle: "pointer",
            shadowColor: am5.color(0x000000),
            shadowBlur: 10,
            shadowOffsetY: 3,
            shadowOpacity: 0.3
          })
        );

        // Inner circle on PIN
        const innerCircle = container.children.push(
          am5.Circle.new(root, {
            radius: 6,
            fill: am5.color(0xffffff),
            centerX: am5.p50,
            centerY: 12,
            dy: -24
          })
        );

        // Pulsing animation for PIN
        const pulse = container.children.push(
          am5.Circle.new(root, {
            radius: 16,
            fill: am5.color(0xf97316),
            fillOpacity: 0.3,
            centerX: am5.p50,
            centerY: 12,
            dy: -24
          })
        );

        pulse.animate({
          key: "scale",
          from: 1,
          to: 1.5,
          duration: 1000,
          loops: Infinity,
          easing: am5.ease.out(am5.ease.cubic)
        });

        pulse.animate({
          key: "opacity",
          from: 0.5,
          to: 0,
          duration: 1000,
          loops: Infinity,
          easing: am5.ease.out(am5.ease.cubic)
        });

        // Hover effect
        pin.states.create("hover", {
          scale: 1.3,
          fill: am5.color(0xe85d04)
        });

        innerCircle.states.create("hover", {
          radius: 7
        });

        // Click handler
        container.events.on("click", function() {
          const data = dataItem.dataContext as any;
          if (data && data.club && onClubSelect) {
            onClubSelect(data.club);
          }
        });

        // Apply hover to entire container
        container.events.on("pointerover", function() {
          pin.states.apply("hover");
          innerCircle.states.apply("hover");
        });

        container.events.on("pointerout", function() {
          pin.states.apply("default");
          innerCircle.states.apply("default");
        });

        return am5.Bullet.new(root, {
          sprite: container
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

      // Add club name labels
      pointSeries.bullets.push(function() {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{title}",
            fill: am5.color(0x1a365d),
            centerX: am5.p50,
            centerY: am5.p0,
            dy: 8,
            fontSize: 12,
            fontWeight: "600",
            background: am5.RoundedRectangle.new(root, {
              fill: am5.color(0xffffff),
              fillOpacity: 0.9,
              cornerRadiusTL: 4,
              cornerRadiusTR: 4,
              cornerRadiusBL: 4,
              cornerRadiusBR: 4,
              shadowColor: am5.color(0x000000),
              shadowBlur: 4,
              shadowOffsetY: 2,
              shadowOpacity: 0.2
            }),
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8
          })
        });
      });

      // Add tooltips on hover
      pointSeries.bullets.push(function(root, series, dataItem) {
        const data = dataItem.dataContext as any;
        const club = data.club;
        
        const tooltip = am5.Tooltip.new(root, {
          labelText: `[bold]{title}[/]\n📍 ${club.location}\n👥 ${club.memberCount || 0} members\n⭐ ${club.rating || 'N/A'}/5`,
          getFillFromSprite: false,
          autoTextColor: false
        });

        tooltip.get("background")?.setAll({
          fill: am5.color(0x1a365d),
          fillOpacity: 0.95,
          stroke: am5.color(0xf97316),
          strokeWidth: 2
        });

        tooltip.label.setAll({
          fill: am5.color(0xffffff)
        });

        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 0,
            tooltip: tooltip
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
        className="w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden bg-gray-50 border-4 border-orange-500/20"
        style={{ height: '600px' }}
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

      {clubsWithCoordinates.length > 0 && (
        <div className="mt-6 w-full max-w-6xl">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 mb-4">
            <h3 className="text-lg font-bold mb-2">📍 Interactive Club Map</h3>
            <p className="text-sm opacity-90">
              {clubsWithCoordinates.length} club{clubsWithCoordinates.length !== 1 ? 's' : ''} displayed with coordinates • Click on any PIN to view details
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clubsWithCoordinates.map((club) => (
              <div 
                key={club.id}
                className={`bg-white rounded-lg p-4 shadow-md border-2 transition-all cursor-pointer hover:shadow-lg ${
                  selectedClub?.id === club.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
                }`}
                onClick={() => onClubSelect?.(club)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white rounded-full p-2 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{club.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{club.location}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {club.memberCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {club.rating || 'N/A'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs font-mono text-gray-400">
                      📍 {parseFloat(club.latitude!).toFixed(4)}, {parseFloat(club.longitude!).toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedClub && clubsWithCoordinates.length > 0 && (
        <Card className="mt-6 w-full max-w-2xl shadow-2xl border-2 border-orange-500 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            {selectedClub.image && (
              <img 
                src={selectedClub.image} 
                alt={selectedClub.name} 
                className="w-full h-56 object-cover rounded-md mb-4 shadow-lg"
              />
            )}
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {selectedClub.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">📍 Location</h4>
              <p className="text-gray-600">{selectedClub.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">📝 Description</h4>
              <p className="text-gray-700">{selectedClub.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{selectedClub.memberCount || 0} Members</span>
              </div>
              {selectedClub.rating && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{selectedClub.rating}/5 Rating</span>
                </div>
              )}
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 mb-2">🗺️ Coordinates</h4>
              <div className="font-mono text-sm text-gray-600">
                <div>Latitude: {parseFloat(selectedClub.latitude!).toFixed(6)}</div>
                <div>Longitude: {parseFloat(selectedClub.longitude!).toFixed(6)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoroccoMap;
