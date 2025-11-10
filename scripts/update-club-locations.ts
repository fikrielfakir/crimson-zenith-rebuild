import { storage } from '../server/storage.js';

async function updateClubLocations() {
  console.log('🔄 Updating club locations and coordinates...');
  
  try {
    // Update club 1 - Al Hoceima
    await storage.updateClub(1, {
      location: 'Al Hoceima',
      latitude: '35.251700' as any,
      longitude: '-3.931700' as any,
    });
    console.log('✅ Updated club 1: Atlas Hikers Club -> Al Hoceima');
    
    // Update club 2 - Rabat
    await storage.updateClub(2, {
      location: 'Rabat',
      latitude: '34.020900' as any,
      longitude: '-6.841600' as any,
    });
    console.log('✅ Updated club 2: Desert Explorers -> Rabat');
    
    // Update club 3 - Casablanca
    await storage.updateClub(3, {
      location: 'Casablanca',
      latitude: '33.573100' as any,
      longitude: '-7.589800' as any,
    });
    console.log('✅ Updated club 3: Coastal Adventures -> Casablanca');
    
    console.log('🎉 All club locations updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating club locations:', error);
    process.exit(1);
  }
}

updateClubLocations();
