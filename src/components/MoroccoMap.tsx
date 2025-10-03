import React, { useState, useEffect } from 'react';
import { Club } from '../../shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Star } from 'lucide-react';

interface MoroccoMapProps {
  clubs: Club[];
  onClubSelect?: (club: Club) => void;
  selectedClub?: Club | null;
}

const MoroccoMap = ({ clubs, onClubSelect, selectedClub }: MoroccoMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredClub, setHoveredClub] = useState<Club | null>(null);

  const clubsWithCoordinates = clubs.filter(club => 
    club.latitude && club.longitude && 
    !isNaN(parseFloat(club.latitude)) && 
    !isNaN(parseFloat(club.longitude))
  );

  const getMarkerPosition = (lat: string, lng: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    // Morocco bounds adjusted for the SVG map
    const mapBounds = {
      north: 36.0,
      south: 20.5,
      west: -17.2,
      east: -0.99
    };
    
    const x = ((longitude - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 450;
    const y = ((mapBounds.north - latitude) / (mapBounds.north - mapBounds.south)) * 450;
    
    return { x: `${x}px`, y: `${y}px` };
  };

  const handleClubClick = (club: Club) => {
    if (onClubSelect) {
      onClubSelect(club);
    }
  };

  const handleRegionClick = (regionName: string) => {
    console.log(`Clicked region: ${regionName}`);
  };

  return (
    <div className="w-full flex items-center justify-center py-8">
      <div id="map_inner" style={{ position: 'relative', height: '450px', width: '450px' }}>
        <svg 
          height="450" 
          version="1.1" 
          width="450" 
          xmlns="http://www.w3.org/2000/svg" 
          style={{ overflow: 'hidden', position: 'relative' }} 
          viewBox="0 0 450 450" 
          preserveAspectRatio="xMidYMid meet"
        >
          <rect 
            x="-2000" 
            y="-2000" 
            width="5000" 
            height="5000" 
            fill="#f0f4f8" 
            transform="matrix(0.45,0,0,0.45,0,0)" 
            fillOpacity="0"
          />
          
          {/* Tangier-Tetouan-Al Hoceima */}
          <path 
            data-region="Tangier-Tetouan-Al Hoceima" 
            fill={hoveredRegion === 'Tangier-Tetouan-Al Hoceima' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M804.8,311.8L804.8,311.7L804.8,311.5L804.6,310.9L805.8,309.8L806.6,309.1L807.7,308.2L809.8,306.7L812.1,304L808.5,304.5L808.4,305.6L807.9,305.7L807.5,304.8L806.8,303.2L805.2,299.9L804.7,297.6L804.5,296.7L804.6,295.9L804.7,295.1L804.9,294.2L805.3,293.2L806.4,292.1L808.2,291.8L809.1,291.8L810.5,292L811.2,292.2L811.8,292.5L812.4,293.2L813.4,294.5L813.5,295.4L813.6,295.7L814.5,296.3L815.3,296.7L816.2,297.3L817.3,298L817.7,298.5L817.9,299.4L818.2,300.1L818.5,300.7L819,301.2L819.3,302L819.6,303.1L819.6,304.3L819.9,305.3L819.6,306.9L819,308.8L818.2,310.4L817.6,311.6L817.5,312.5L817.2,314.1L816.9,315L815.9,316.7L814.5,318.6L814,319.2L813.7,319.4L813,319.7L812.4,320.1L812,320.6L811.4,321.4L810.9,322L810.6,322.2L810.4,322.2L810.2,322.2L809.9,322L809.6,321.8L809.1,321.4L808.7,320.9L808.2,320.2L807.6,319.7L807.3,319.3L807.1,318.9L806.9,318.3L806.8,317.8L806.5,317.2L806.3,316.3L806.2,315.8L805.9,315.1L805.7,314.6L805.3,313.8L805,313.3L804.8,312.8L804.8,312.1L804.8,311.8Z"
            onMouseEnter={() => setHoveredRegion('Tangier-Tetouan-Al Hoceima')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Tangier-Tetouan-Al Hoceima')}
          />

          {/* Oriental */}
          <path 
            data-region="Oriental" 
            fill={hoveredRegion === 'Oriental' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M696.4,135.9L698.2,136L699.3,135L699.5,134.9L699.3,134.8L699,134.6L698.9,134.3L699,133.8L699.3,133.5L699.4,133.4L702.1,133.2L702.6,133.2L702.8,132.5L703.2,131.7L703.3,131.6L703.4,131.2L703.3,131L703,130.8L702.6,130.7L702.3,130.7L702.3,130.5L702.5,130.2L702.6,129.9L702.9,129.7L703.4,129.7L703.9,129.6L704.4,129.4L704.8,129.2L705.2,129L705.6,128.7L706,128.3L706.3,128L706.6,127.5L707,127.2L707.6,127L708.2,126.8L709.1,126.8L709.7,126.9L710.2,127.1L710.6,127.4L711,127.9L711.2,128.5L711.3,129.3L711.5,130L711.8,130.5L712.2,131L712.7,131.4L713.5,131.8L714.5,132.2L715.7,132.5L717.1,132.9L718.5,133.4L719.7,134L720.6,134.8L721.2,135.8L721.5,137L721.6,138.3L721.5,139.6L721.1,140.7L720.5,141.6L719.7,142.2L718.7,142.6L717.6,142.8L716.5,142.8L715.4,142.6L714.4,142.2L713.6,141.7L712.9,141.1L712.3,140.4L711.8,139.5L711.4,138.6L711.1,137.6L710.8,136.5L710.5,135.5L710.1,134.6L709.6,133.9L709,133.3L708.3,132.9L707.5,132.7L706.7,132.6L705.9,132.7L705.1,132.9L704.3,133.3L703.6,133.8L703,134.5L702.6,135.2L702.3,136L702.1,136.8L701.9,137.5L701.6,138.2L701.2,138.7L700.7,139.1L700.1,139.3L699.4,139.4L698.7,139.2L698.1,138.9L697.6,138.4L697.2,137.8L696.9,137.1L696.7,136.4L696.5,135.9L696.4,135.9Z"
            onMouseEnter={() => setHoveredRegion('Oriental')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Oriental')}
          />

          {/* Fez-Meknes */}
          <path 
            data-region="Fez-Meknes" 
            fill={hoveredRegion === 'Fez-Meknes' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M774.8,92.2L775.3,93.1L775.9,93.8L775.8,94L775.7,94.4L775.4,94.7L775.7,95.3L775.5,96.3L775.4,96.5L775.4,96.6L775.3,97.4L775.2,98.7L775.3,98.9L775.5,99.9L775.4,100L775.4,100.1L775.4,100.2L775.5,100.3L775.5,100.4L775.5,100.5L775.5,100.6L775.5,100.7L775.5,100.8L775.5,100.9L775.5,101L775.5,101.1L775.5,101.4L775.4,101.5L775.4,101.6L775.3,101.8L775.2,101.8L775.2,101.9L775.2,102.1L775.1,102.2L775.1,102.4L775.1,102.5L775.2,102.6L775.2,102.7L775.2,102.8L775.1,103L775.1,103.2L775.1,103.4L775.1,103.6L775.1,103.8L775.2,103.8L775.2,103.9L775.2,104.1L775.2,104.2L775.2,104.3L775.3,104.3L775.4,104.4L775.4,104.5L775.5,104.6L775.5,104.7L775.5,104.8L775.5,104.9L775.6,105L775.7,105.1L775.8,105.2L776,105.3L776.2,105.4L776.5,105.6L776.9,105.8L777.3,106L777.7,106.3L778.1,106.6L778.6,107L779,107.4L779.4,107.9L779.7,108.4L780,109L780.3,109.6L780.5,110.2L780.6,110.9L780.6,111.6L780.5,112.3L780.3,113L779.9,113.6L779.5,114.2L778.9,114.7L778.3,115.1L777.6,115.4L776.8,115.6L776,115.7L775.2,115.7L774.3,115.5L773.5,115.2L772.7,114.8L772,114.3L771.3,113.7L770.7,113L770.2,112.3L769.8,111.5L769.5,110.6L769.3,109.7L769.2,108.8L769.2,107.9L769.3,106.9L769.5,106L769.8,105.2L770.2,104.4L770.6,103.6L771.2,103L771.8,102.4L772.5,102L773.2,101.6L774,101.3L774.8,92.2Z"
            onMouseEnter={() => setHoveredRegion('Fez-Meknes')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Fez-Meknes')}
          />

          {/* Rabat-Salé-Kenitra */}
          <path 
            data-region="Rabat-Salé-Kenitra" 
            fill={hoveredRegion === 'Rabat-Salé-Kenitra' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M499.6,249.2L499.7,249.2L499.7,249.1L499.8,249L499.7,249L499.8,248.9L499.8,248.8L499.9,248.8L499.9,248.7L500,248.7L500,248.6L500.1,248.6L500.1,248.5L500.2,248.5L500.3,248.4L500.3,248.3L500.2,248.4L500.2,248.3L500.3,248.3L500.2,248.3L500.3,248.3L500.3,248.2L500.3,248.3L500.3,248.2L500.3,248.3L500.3,248.2L500.4,248.2L500.3,248.2L500.4,248.2L500.3,248.2L500.4,248.2L500.4,248.1L500.5,248.1L500.5,248L500.5,248.1L500.5,248.2L500.4,248.2L500.4,248.3L500.5,248.3L500.4,248.3L500.4,248.4L500.5,248.4L500.6,248.4L500.7,248.4L500.8,248.3L500.9,248.2L501,248.2L501,248.1L501.1,248.1L501.1,248L501.1,247.9L501.1,247.8L501.2,247.8L501.2,247.7L501.3,247.7L501.3,247.6L501.4,247.6L501.4,247.5Z"
            onMouseEnter={() => setHoveredRegion('Rabat-Salé-Kenitra')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Rabat-Salé-Kenitra')}
          />

          {/* Beni Mellal-Khenifra */}
          <path 
            data-region="Béni Mellal-Khénifra" 
            fill={hoveredRegion === 'Béni Mellal-Khénifra' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M598.1,329.4L597.7,329.6L596.6,330.2L596.4,330.3L595.3,331.6L595.5,332.7L594.5,334.3L591.8,336.2L591.4,336.4L591,336.7L590.5,336.9L590,337.2L589.6,337.4L589.3,337.6L589,337.6L588.7,337.8L588.4,337.9L587.9,338L587.5,338.1L587,338.2L586.2,338L584.9,337.9L584.9,338.3L584.3,338.7L583.4,339L583.1,339.1L582.9,339.1L582.7,339.1L582.4,339.5L582.1,339.8L581.6,340.3L580.9,340.4L577.1,340.7L577.1,340.9L577,341.1L577,341.4L577,341.7L576.8,342L576.7,342.2L576.6,342.5L576.4,342.8L576.3,342.9L576.2,343L576,343L575.8,343.1L575,343.5L573.7,344L573,344.8L572.2,345.1L571.2,345.8L571,346.9L570.4,347.7L569.4,347.5L569.2,347.4L568.9,347.3L568,347L567.4,347L566.7,345.8L566.1,346.3L564.5,345.5L565.3,346.8L561.2,346.9L560.5,347.2L559.6,347.4L558.9,347.5L558.2,347.6L557.6,347.7L557,347.7L556.5,347.8L556,347.8L555.5,347.9L555,347.9L554.6,347.9L554.1,348L553.7,348L553.2,348L552.8,348.1L552.4,348.1L552,348.1L551.6,348.1L551.2,348.2L550.8,348.2L550.4,348.2L550,348.2L549.6,348.3Z"
            onMouseEnter={() => setHoveredRegion('Béni Mellal-Khénifra')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Béni Mellal-Khénifra')}
          />

          {/* Casablanca-Settat */}
          <path 
            data-region="Casablanca-Settat" 
            fill={hoveredRegion === 'Casablanca-Settat' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M647.6,104.9L648.1,105.1L648.9,105.3L649.1,105.2L649.5,105.3L649.7,105.5L650.1,105.5L650.2,105.5L650.4,105.6L650.6,105.7L650.8,105.7L651.7,105.5L652.4,105.3L653.1,105.2L653.7,104.3L654.5,104.2L655.1,104L655.6,104.2L655.9,104.3L656.5,104.5L657.3,105.1L656.9,105.6L657.2,106L657.6,106.5L659,106.5L660,105.5L662.1,106.7L662.4,106.9L663.7,108.2L664.6,108.8L666.5,109.2L666.8,109.2L667.9,109L669.2,108.6L670.5,109L671.6,109.4L671.9,109.6L671.9,110L671.9,110.2L671.8,110.5L671.5,110.8L671.6,111.4L671.4,112.2L671.7,112.8L672.2,113L671.9,113.9L671.7,114.4L671.4,114.5L671.6,115.2L671.4,115.5L671.6,115.8L671.7,116.2L671.7,116.6L671.7,116.8L671.7,117L671.6,117.2L671.6,117.4L671.7,117.5L671.7,117.7L671.6,117.9L671.5,118.2L671.6,118.5L671.8,118.9L671.8,119L671.9,119.2L671.8,119.6L671.6,120.2L671.2,120.9L671.5,121.2L672.1,122L673,121.8L673.3,121.9L673.7,122.1L674.2,122.4L674.6,122.7Z"
            onMouseEnter={() => setHoveredRegion('Casablanca-Settat')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Casablanca-Settat')}
          />

          {/* Marrakech-Safi */}
          <path 
            data-region="Marrakech-Safi" 
            fill={hoveredRegion === 'Marrakech-Safi' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff"
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }} 
            d="M699.6,240L699.7,240.3L699.8,240.6L699.8,240.8L699.1,240.9L698.9,241.1L698.5,241.4L698.2,241.6L697.8,241.8L697.7,242.1L697.6,242.4L697.5,242.7L697.3,243L697.2,243.2L697,243.3L696.8,243.5L696.7,243.7L696.6,243.9L696.6,244L696.7,244.2L696.9,244.4L697.1,244.4L697.2,244.6L696.9,244.8L696.6,245.1L696.3,245.6L696.3,245.7L696.2,246.5L696.4,247L696.5,247.7L696.5,248.6L696.4,249.3L696.1,249.8L696.1,250.6L696.3,251L696.4,251.8L696.5,252.3L696.5,252.6L696.3,253.2L696.1,254.3L695.9,254.9L696,255.7L695.7,255.9L694.7,256.6L695,257.2L695.1,257.6L695.1,258.4L694.9,259.1L694.6,259.6L694.4,260.5L694.4,261.2L694.3,262.1L694.2,262.1L693.5,261.9L693,261.8L692.5,261.7L692,261.5L691.7,262.1L692.2,263.1L692.1,264.1L691.8,264.9L691.4,265.2L690.4,265.5L690.2,265.5L689.6,265.7L688.9,265.9Z"
            onMouseEnter={() => setHoveredRegion('Marrakech-Safi')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Marrakech-Safi')}
          />

          {/* Draa-Tafilalet */}
          <path 
            data-region="Drâa-Tafilalet" 
            fill={hoveredRegion === 'Drâa-Tafilalet' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M636.8,443L637.3,441.7L637.9,440.4L638.3,439.3L639.1,438.1L639,437.2L638.2,436.1L638.1,435L638.7,433.5L639.9,432.2L639.5,431L639.2,429.4L639.2,428.5L639,427.2L639,425.9L638.6,424.5L638.5,423.4L638.3,422.7L638.3,421.5L638.2,420.1L637.8,419.2L637.8,418.9L637.7,418.4L639.3,416.8L641.6,416L641.8,414.9L641.2,414.3L640,414.3L639.5,413.9L635.2,415.2L633.7,412.2L634.7,408.9L634,407.7L629.4,402.8L631.1,401L633.5,399.1L633.5,397.5L631.6,396L630.1,394L628.1,391.6L626.8,391.5L626.5,390.8L626.8,390L626.6,389.9L626.3,389.4L625.8,388.7L625.1,388.7L624.2,389.5L621.8,390.2L619.4,390.6L617.8,391L616.6,388.7L615.1,388.9L615.5,390.1L615.1,392.3L615.4,394.1L615.4,394.8L614,396.6L613.2,395.6L611.8,395.1L606.6,396.4L605.2,395.7L603.2,395.2L601.5,394.7L599.7,394.2Z"
            onMouseEnter={() => setHoveredRegion('Drâa-Tafilalet')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Drâa-Tafilalet')}
          />

          {/* Souss-Massa */}
          <path 
            data-region="Souss-Massa" 
            fill={hoveredRegion === 'Souss-Massa' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M520.1,518.4L520,518.3L514.7,511.8L513.1,509.9L508.9,504.4L507,501.2L504.3,498.4L504.4,497.4L504.1,496L502.7,494.3L499.2,494.1L495.6,493.5L494.6,492.2L493.3,490.3L491.9,489.4L492.1,486.6L493.2,485.9L491.4,485.5L490.8,483.4L490.4,481.5L490.2,480.7L490.9,479.8L491,479.7L490.9,478.7L490.9,478.5L490.1,478.2L489.6,478L489.9,476.8L490.4,475.5L490.4,474.6L489.8,472.9L493.5,471.7L491.7,474L491.9,474.6L492.4,474.9L493.7,474L495,472.8L495.4,472.2L494.2,470.9L494.3,470.4L495.9,469.4L497.9,467.8L498.2,467.4L498.2,466.7L498.2,466L497.7,464L497.5,463.8L496.9,462.9L496.9,462.5L496.4,462.2L495.9,461.6L495.4,461.1L495.1,459.9L494.8,459.3L494.5,458.1L493.8,455.5L494,454.9L494.3,454.3L494.4,453.7Z"
            onMouseEnter={() => setHoveredRegion('Souss-Massa')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Souss-Massa')}
          />

          {/* Guelmim-Oued Noun */}
          <path 
            data-region="Guelmim-Oued Noun" 
            fill={hoveredRegion === 'Guelmim-Oued Noun' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M515.5,587.5L515.6,587.5L516.4,587.6L518.8,588L519.4,588L519.4,590.7L519.4,596.1L519.4,602.2L519.4,608.8L519.4,615.5L519.5,622.2L519.5,628.8L519.5,634.8L519.5,640.3L519.5,644.9L519.5,648.4L519.5,650.7L519.5,651.5L519.5,654.1L519.1,654.9L518.5,654.9L516.7,654.9L515,654.9L513.2,654.9L511.5,654.9L509.7,654.9L508,654.9L506.2,654.9L504.5,654.9L502.7,654.9L501,654.9L499.2,654.9L497.5,654.9L495.7,654.9L494,654.9L492.2,654.9L490.5,654.9L488.7,654.9L486.9,654.9L485.2,654.9L483.4,654.9L481.7,654.9L479.9,654.9L478.2,654.9L476.4,654.9L474.7,654.9L472.9,654.9L471.2,654.9L469.4,654.9L467.7,654.9L465.9,654.9L464.2,654.9L462.4,654.9L460.7,654.9L458.9,654.9L457.1,654.9L455.4,654.9L453.6,654.9L451.9,654.9L450.1,654.9L448.4,654.9L446.6,654.9L444.9,654.9L443.1,654.9L441.4,654.9L439.6,654.9Z"
            onMouseEnter={() => setHoveredRegion('Guelmim-Oued Noun')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Guelmim-Oued Noun')}
          />

          {/* Laayoune-Sakia El Hamra */}
          <path 
            data-region="Laâyoune-Sakia El Hamra" 
            fill={hoveredRegion === 'Laâyoune-Sakia El Hamra' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M515.5,587.5L512.7,586.7L509.3,585.4L506.9,582.5L504.2,579.8L499.5,577.6L493.7,572L487.5,568.3L486.8,568.6L481.3,571.1L479.1,571.7L474.1,572.4L470.8,569.8L468.3,568.2L466.8,567.3L464.9,566.2L462.6,564.5L461.5,563.4L460.8,562.5L459.9,561.2L459.8,559.9L458.6,558.6L458,557.7L457.6,557.2L457.4,557L456.4,556.4L455.4,556.3L454.9,557.2L454.6,557.8L453.4,558.3L451.9,558.6L450.9,558.4L449.2,557.5L449.1,557.3L448.4,556.5L448,555.5L447.1,554.2L445.3,554.1L444.3,554.7L443,553.9L440.6,551L439,548.9L438,548.7L437.1,548.3L435.7,548L434.1,548.1L431.8,548.3L428.3,548.5L425,549.2L423.3,549.4L420.2,549.7L418.2,550L416.8,550L414,550.4L412.4,550.7L410.6,549.9L408.8,549.6L406.7,550L404.4,550.4L402.8,551.4L401.4,551.1L399.4,551.4Z"
            onMouseEnter={() => setHoveredRegion('Laâyoune-Sakia El Hamra')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Laâyoune-Sakia El Hamra')}
          />

          {/* Dakhla-Oued Ed-Dahab */}
          <path 
            data-region="Dakhla-Oued Ed-Dahab" 
            fill={hoveredRegion === 'Dakhla-Oued Ed-Dahab' ? '#f97316' : '#88a4bc'}
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.3s ease' }}
            d="M192.4,731.5L192.7,732L193,732.8L193.3,733.8L194.4,735L196.5,736.9L198.7,738.9L200.6,739.5L202.9,739.9L205,740.6L207.3,742.2L207.9,743.5L208.9,744.7L210.3,746L213.3,746.9L222,744.1L223.1,743.8L223.9,743.6L224.7,743.6L227.4,743.4L230.9,743.3L235.9,743L240.3,743.8L245.7,745.2L249.8,746.2L253.9,747.9L256.3,748.4L258.8,747.7L265.5,745.9L269.5,744L272.2,743.1L277,741.3L281.7,740.9L286.2,740.5L289.8,741.2L295.1,742.4L295.9,742.6L296.7,742.8L298.4,743.1L300.1,743.9L306.7,746.3L309,747.4L311.7,748.5L312.9,748.8L314.5,749L316.7,748.8L318.3,748.5L326.1,746.7L328.3,746L331.2,745.6L334.4,746L335.7,746.3L339.1,746.9L344.2,748.5L344.2,751.8L344.2,756.1L344.2,760.5L344.2,764.9L344.2,769.2L344.2,773.6L344.2,777.9L344.2,782.2L344.2,786.6L344.2,790.9L344.2,795.3L344.2,799.9L344,801.9Z"
            onMouseEnter={() => setHoveredRegion('Dakhla-Oued Ed-Dahab')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('Dakhla-Oued Ed-Dahab')}
          />

          {/* Region labels */}
          <text 
            x="350" y="50" 
            textAnchor="middle" 
            fontSize="12px" 
            fontFamily="Arial" 
            fontWeight="bold" 
            fill={hoveredRegion === 'Tangier-Tetouan-Al Hoceima' ? '#fff' : 'transparent'}
            style={{ pointerEvents: 'none', transition: 'fill 0.3s' }}
          >
            Tangier-Tetouan-Al Hoceima
          </text>
          <text 
            x="370" y="70" 
            textAnchor="middle" 
            fontSize="12px" 
            fontFamily="Arial" 
            fontWeight="bold" 
            fill={hoveredRegion === 'Oriental' ? '#fff' : 'transparent'}
            style={{ pointerEvents: 'none', transition: 'fill 0.3s' }}
          >
            Oriental
          </text>
        </svg>

        {/* Club markers overlay */}
        {clubsWithCoordinates.map((club) => {
          const position = getMarkerPosition(club.latitude!, club.longitude!);
          const isSelected = selectedClub?.id === club.id;
          const isHovered = hoveredClub?.id === club.id;
          
          return (
            <div
              key={club.id}
              className="absolute"
              style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected || isHovered ? 30 : 10
              }}
            >
              <div
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected || isHovered ? 'scale-110' : 'scale-100'
                }`}
                onClick={() => handleClubClick(club)}
                onMouseEnter={() => setHoveredClub(club)}
                onMouseLeave={() => setHoveredClub(null)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  isSelected 
                    ? 'bg-orange-600 ring-4 ring-orange-300' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                
                {(isHovered || isSelected) && (
                  <Card className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 shadow-xl border-2 border-orange-500 z-40">
                    <CardHeader className="pb-2">
                      {club.image && (
                        <img 
                          src={club.image} 
                          alt={club.name} 
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                      )}
                      <CardTitle className="text-sm">{club.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-gray-600">{club.location}</p>
                      <p className="text-xs text-gray-700 line-clamp-2">{club.description}</p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600">{club.memberCount || 0} members</span>
                        </div>
                        {club.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-gray-600">{club.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
        
        {clubsWithCoordinates.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="bg-white rounded-lg p-6 max-w-md text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">No Club Locations Available</h3>
              <p className="text-sm text-gray-600">
                Club locations will appear on the map once coordinates are added.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoroccoMap;
