import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { storage } from './server/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 5000) : 3001;

// Validate environment
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

console.log('✅ Server configured for database integration');

// Seed database with initial data if empty
async function seedDatabase() {
  try {
    console.log('🌱 Checking database for seed data...');
    const clubs = await storage.getClubs();
    
    if (clubs.length === 0) {
      console.log('📝 Adding seed data to database...');
      
      const seedClubs = [
        {
          name: 'Atlas Hikers Club',
          description: 'Mountain trekking and hiking adventures',
          location: 'Atlas Mountains',
          memberCount: 250,
          rating: 5,
          image: '/images/atlas-hikers.jpg',
          features: ['Hiking', 'Camping', 'Photography'],
          isActive: true
        },
        {
          name: 'Desert Explorers',
          description: 'Sahara expeditions and desert camping',
          location: 'Sahara Desert',
          memberCount: 180,
          rating: 5,
          image: '/images/desert-explorers.jpg',
          features: ['Desert Tours', 'Camping', 'Camel Rides'],
          isActive: true
        },
        {
          name: 'Coastal Adventures',
          description: 'Beach activities and water sports',
          location: 'Atlantic Coast',
          memberCount: 320,
          rating: 4,
          image: '/images/coastal-adventures.jpg',
          features: ['Surfing', 'Beach Volleyball', 'Swimming'],
          isActive: true
        }
      ];
      
      for (const clubData of seedClubs) {
        await storage.createClub(clubData);
      }
      
      console.log('✅ Database seeded with sample clubs!');
    } else {
      console.log(`✅ Database already has ${clubs.length} clubs`);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Initialize database on startup
seedDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/static', express.static(join(__dirname, 'public')));

// In production, serve the built frontend files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
}

// Create a simple placeholder image API that returns demo images
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  // For demo purposes, serve one of our hero images based on dimensions
  const demoImages = [
    'discover-hero.jpg',
    'book-hero.jpg', 
    'gallery-hero.jpg',
    'news-hero.jpg',
    'events-hero.jpg',
    'clubs-hero.jpg'
  ];
  
  // Simple hash based on dimensions to consistently return same image for same size
  const imageIndex = (parseInt(width) + parseInt(height)) % demoImages.length;
  const selectedImage = demoImages[imageIndex];
  const imagePath = join(__dirname, 'public', selectedImage);
  
  // Check if image exists, otherwise return a default
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    // Return a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e2e8f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b" font-family="Arial, sans-serif" font-size="16">
          ${width} × ${height}
        </text>
      </svg>
    `;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Image server running' });
});

// API routes using real database storage
app.get('/api/clubs', async (req, res) => {
  try {
    console.log('🔗 Fetching clubs from PostgreSQL database...');
    const clubs = await storage.getClubs();
    console.log(`✅ Retrieved ${clubs.length} clubs from database`);
    
    res.json({
      clubs: clubs.map(club => ({
        id: club.id,
        name: club.name,
        description: club.description,
        location: club.location,
        member_count: club.memberCount,
        rating: club.rating,
        image: club.image,
        features: club.features,
        is_active: club.isActive,
        created_at: club.createdAt?.toISOString(),
        updated_at: club.updatedAt?.toISOString()
      })),
      total: clubs.length,
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching clubs from database:', error);
    res.status(500).json({ error: 'Failed to fetch clubs from database', details: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    console.log('🔗 Fetching events from PostgreSQL database...');
    const clubs = await storage.getClubs();
    const allEvents = [];
    
    for (const club of clubs) {
      const events = await storage.getClubEvents(club.id);
      allEvents.push(...events.map(event => ({
        id: event.id,
        club_id: event.clubId,
        title: event.title,
        description: event.description,
        event_date: event.eventDate?.toISOString(),
        location: event.location,
        max_participants: event.maxParticipants,
        current_participants: event.currentParticipants,
        status: event.status,
        created_at: event.createdAt?.toISOString()
      })));
    }
    
    console.log(`✅ Retrieved ${allEvents.length} events from database`);
    res.json({
      events: allEvents,
      total: allEvents.length,
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching events from database:', error);
    res.status(500).json({ error: 'Failed to fetch events from database', details: error.message });
  }
});

// In production, handle client-side routing
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Serving built frontend and API');
  } else {
    console.log('Development mode: API server only');
  }
  console.log(`Placeholder API available at http://localhost:${PORT}/api/placeholder/WIDTH/HEIGHT`);
});