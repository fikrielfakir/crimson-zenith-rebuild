import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { storage } from './server/storage.js';
import { setupAuth, isAuthenticated, isAdmin } from './server/replitAuth.js';
import { db } from './server/db.js';
import { eq, asc, desc } from 'drizzle-orm';
import { 
  users, 
  clubs, 
  clubEvents, 
  bookingEvents, 
  mediaAssets,
  seoSettings as seoSettingsTable,
  contactSettings as contactSettingsTable,
  themeSettings as themeSettingsTable
} from './shared/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 5000) : 3001;

const dbType = process.env.MYSQL_HOST ? 'MySQL (Hostinger)' : 'PostgreSQL (Replit)';
console.log(`✅ Server configured for ${dbType} database integration`);

// Main server initialization
async function initializeServer() {

// Seed admin user if doesn't exist
async function seedAdminUser() {
  try {
    console.log('🔐 Checking for admin user...');
    const adminUser = await storage.getUserByUsername('admin');
    
    if (!adminUser) {
      console.log('📝 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await storage.upsertUser({
        id: crypto.randomUUID(),
        username: 'admin',
        password: hashedPassword,
        email: 'admin@morocclubs.com',
        firstName: 'Admin',
        lastName: 'User',
        profileImageUrl: null,
        bio: null,
        phone: null,
        location: null,
        isAdmin: true,
        interests: []
      });
      
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}

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

    const bookingEvents = await storage.getBookingEvents();
    
    if (bookingEvents.length === 0) {
      console.log('📝 Adding booking events seed data...');
      
      const seedBookingEvents = [
        {
          id: 'atlas-trek-3day',
          title: '3-Day Atlas Mountains Trek',
          subtitle: 'Discover the majestic peaks and Berber villages',
          description: 'Embark on an unforgettable 3-day journey through the Atlas Mountains. Experience breathtaking landscapes, traditional Berber hospitality, and authentic mountain culture. This guided trek takes you through scenic valleys, over mountain passes, and into remote villages where time seems to stand still.',
          location: 'Atlas Mountains, Morocco',
          duration: '3 Days / 2 Nights',
          price: 299,
          originalPrice: 399,
          rating: 5,
          reviewCount: 127,
          category: 'Mountain Trek',
          languages: ['English', 'French', 'Arabic'],
          ageRange: '12-65 years',
          groupSize: 'Max 12 people',
          cancellationPolicy: 'Free cancellation up to 48 hours before departure',
          images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
          highlights: [
            'Trek through stunning mountain valleys',
            'Visit authentic Berber villages',
            'Stay in traditional mountain guesthouses',
            'Enjoy home-cooked Berber meals',
            'Experience stunning sunrise views',
            'Learn about local culture and traditions'
          ],
          included: [
            'Professional mountain guide',
            'All meals during the trek',
            '2 nights accommodation',
            'Transportation to/from Marrakech',
            'Mule support for luggage',
            'First aid kit'
          ],
          notIncluded: [
            'Personal travel insurance',
            'Drinks and snacks',
            'Tips for guides',
            'Personal equipment'
          ],
          schedule: [
            { time: 'Day 1', activity: 'Depart Marrakech at 8am, trek to first village, 6 hours hiking' },
            { time: 'Day 2', activity: 'Cross mountain pass, visit local market, 7 hours hiking' },
            { time: 'Day 3', activity: 'Morning village tour, descent and return to Marrakech by 5pm' }
          ],
          isActive: true
        },
        {
          id: 'sahara-desert-adventure',
          title: 'Sahara Desert Adventure',
          subtitle: 'Sleep under the stars in the Moroccan Sahara',
          description: 'Experience the magic of the Sahara Desert on this 2-day adventure. Ride camels across golden dunes, watch spectacular sunsets, and spend the night in a traditional Berber camp under a blanket of stars. This tour includes traditional music, authentic cuisine, and unforgettable desert landscapes.',
          location: 'Merzouga, Sahara Desert',
          duration: '2 Days / 1 Night',
          price: 199,
          originalPrice: 279,
          rating: 5,
          reviewCount: 243,
          category: 'Desert Experience',
          languages: ['English', 'French', 'Spanish'],
          ageRange: '8-80 years',
          groupSize: 'Max 15 people',
          cancellationPolicy: 'Free cancellation up to 24 hours before departure',
          images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
          highlights: [
            'Camel trek across sand dunes',
            'Spectacular sunset and sunrise views',
            'Traditional Berber camp experience',
            'Campfire with local music',
            'Sandboarding opportunity',
            'Photography opportunities'
          ],
          included: [
            'Camel ride to and from camp',
            'Dinner and breakfast',
            'Traditional desert camp accommodation',
            'Campfire with music',
            'Sandboarding',
            'Bottled water'
          ],
          notIncluded: [
            'Transport to Merzouga',
            'Lunch',
            'Personal expenses',
            'Tips'
          ],
          schedule: [
            { time: '4:00 PM', activity: 'Meet at Merzouga, camel trek begins' },
            { time: '6:30 PM', activity: 'Arrive at camp, watch sunset, dinner and music' },
            { time: '6:00 AM', activity: 'Sunrise viewing, breakfast, camel trek back' },
            { time: '9:00 AM', activity: 'Return to Merzouga' }
          ],
          isActive: true
        },
        {
          id: 'coastal-surf-camp',
          title: 'Atlantic Coast Surf Camp',
          subtitle: 'Learn to surf in Morocco\'s best waves',
          description: 'Join our 5-day surf camp on Morocco\'s stunning Atlantic coast. Perfect for beginners and intermediate surfers, this package includes daily surf lessons, quality equipment, beachfront accommodation, and plenty of time to enjoy the sun, sea, and local culture.',
          location: 'Essaouira, Atlantic Coast',
          duration: '5 Days / 4 Nights',
          price: 449,
          originalPrice: 599,
          rating: 5,
          reviewCount: 89,
          category: 'Water Sports',
          languages: ['English', 'French'],
          ageRange: '14-50 years',
          groupSize: 'Max 8 people',
          cancellationPolicy: 'Free cancellation up to 7 days before start date',
          images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
          highlights: [
            'Daily professional surf coaching',
            'Beachfront accommodation',
            'Quality surfboard and wetsuit included',
            'Explore Essaouira\'s medina',
            'Beach yoga sessions',
            'Small group sizes for personalized attention'
          ],
          included: [
            '4 nights beachfront accommodation',
            'Daily surf lessons (2 hours)',
            'Surfboard and wetsuit rental',
            'Breakfast daily',
            'Beach yoga',
            'Airport transfer'
          ],
          notIncluded: [
            'Lunch and dinner',
            'Travel insurance',
            'Personal expenses',
            'Additional activities'
          ],
          schedule: [
            { time: '7:00 AM', activity: 'Beach yoga session' },
            { time: '8:00 AM', activity: 'Breakfast' },
            { time: '10:00 AM', activity: 'Surf lesson (2 hours)' },
            { time: 'Afternoon', activity: 'Free time or optional activities' }
          ],
          isActive: true
        }
      ];
      
      for (const eventData of seedBookingEvents) {
        await storage.createBookingEvent(eventData);
      }
      
      console.log('✅ Database seeded with booking events!');
    } else {
      console.log(`✅ Database already has ${bookingEvents.length} booking events`);
    }

    // Seed focus items
    const focusItems = await storage.getFocusItems();
    if (focusItems.length === 0) {
      console.log('📝 Adding focus items seed data...');
      const seedFocusItems = [
        {
          title: 'Adventure & Exploration',
          icon: 'mountain',
          description: 'Experience thrilling outdoor adventures from Atlas Mountains to Sahara Desert',
          ordering: 1,
          isActive: true
        },
        {
          title: 'Cultural Immersion',
          icon: 'globe',
          description: 'Connect with local communities and discover authentic Moroccan traditions',
          ordering: 2,
          isActive: true
        },
        {
          title: 'Sustainable Tourism',
          icon: 'leaf',
          description: 'Travel responsibly while supporting local economies and preserving nature',
          ordering: 3,
          isActive: true
        },
        {
          title: 'Community Building',
          icon: 'users',
          description: 'Join a vibrant network of adventurers and culture enthusiasts',
          ordering: 4,
          isActive: true
        }
      ];
      
      for (const item of seedFocusItems) {
        await storage.createFocusItem(item);
      }
      console.log('✅ Database seeded with focus items!');
    }

    // Seed team members
    const teamMembers = await storage.getTeamMembers();
    if (teamMembers.length === 0) {
      console.log('📝 Adding team members seed data...');
      const seedTeamMembers = [
        {
          name: 'Ahmed Benali',
          role: 'Founder & CEO',
          bio: 'Passionate about sustainable tourism and cultural preservation, Ahmed founded our organization to connect adventurers with authentic Moroccan experiences.',
          ordering: 1,
          isActive: true,
          socialLinks: { linkedin: '#', twitter: '#' }
        },
        {
          name: 'Fatima El Amrani',
          role: 'Operations Director',
          bio: 'With 15 years of experience in tourism management, Fatima ensures every journey is safe, memorable, and culturally enriching.',
          ordering: 2,
          isActive: true,
          socialLinks: { linkedin: '#' }
        },
        {
          name: 'Youssef Kadiri',
          role: 'Head Guide',
          bio: 'Born and raised in the Atlas Mountains, Youssef brings deep local knowledge and passion for sharing Morocco\'s natural beauty.',
          ordering: 3,
          isActive: true,
          socialLinks: { instagram: '#' }
        }
      ];
      
      for (const member of seedTeamMembers) {
        await storage.createTeamMember(member);
      }
      console.log('✅ Database seeded with team members!');
    }

    // Seed landing testimonials
    const testimonials = await storage.getLandingTestimonials();
    if (testimonials.length === 0) {
      console.log('📝 Adding testimonials seed data...');
      const seedTestimonials = [
        {
          name: 'Sarah Martinez',
          role: 'Adventure Traveler',
          rating: 5,
          feedback: 'The Atlas Mountains trek was absolutely incredible! Our guide was knowledgeable and the experience was truly authentic.',
          isApproved: true,
          isActive: true,
          ordering: 1
        },
        {
          name: 'James Wilson',
          role: 'Cultural Explorer',
          rating: 5,
          feedback: 'I loved the cultural immersion. Staying with Berber families and learning about their traditions was unforgettable.',
          isApproved: true,
          isActive: true,
          ordering: 2
        },
        {
          name: 'Emma Thompson',
          role: 'Photography Enthusiast',
          rating: 5,
          feedback: 'The desert sunset was magical. Every moment was photo-perfect and the guides were exceptional.',
          isApproved: true,
          isActive: true,
          ordering: 3
        }
      ];
      
      for (const testimonial of seedTestimonials) {
        await storage.createLandingTestimonial(testimonial);
      }
      console.log('✅ Database seeded with testimonials!');
    }

    // Seed site stats
    const siteStats = await storage.getSiteStats();
    if (siteStats.length === 0) {
      console.log('📝 Adding site stats seed data...');
      const seedStats = [
        {
          label: 'Happy Travelers',
          value: '1500',
          icon: 'users',
          suffix: '+',
          ordering: 1,
          isActive: true
        },
        {
          label: 'Adventures Completed',
          value: '500',
          icon: 'mountain',
          suffix: '+',
          ordering: 2,
          isActive: true
        },
        {
          label: 'Cultural Collaborations',
          value: '50',
          icon: 'handshake',
          suffix: '+',
          ordering: 3,
          isActive: true
        },
        {
          label: 'Years of Excellence',
          value: '10',
          icon: 'award',
          suffix: '+',
          ordering: 4,
          isActive: true
        }
      ];
      
      for (const stat of seedStats) {
        await storage.createSiteStat(stat);
      }
      console.log('✅ Database seeded with site stats!');
    }

    // Seed contact settings
    const contactSettings = await storage.getContactSettings();
    if (!contactSettings) {
      console.log('📝 Adding contact settings seed data...');
      await storage.updateContactSettings({
        officeAddress: 'Marrakech, Morocco',
        email: 'contact@clubsmorocco.com',
        phone: '+212 524 123 456',
        officeHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
        mapLatitude: '31.6295',
        mapLongitude: '-7.9811',
        formRecipients: ['contact@clubsmorocco.com'],
        autoReplyEnabled: true,
        autoReplyMessage: 'Thank you for contacting us! We will get back to you within 24 hours.',
        socialLinks: {
          facebook: 'https://facebook.com/clubsmorocco',
          instagram: 'https://instagram.com/clubsmorocco',
          twitter: 'https://twitter.com/clubsmorocco'
        }
      });
      console.log('✅ Database seeded with contact settings!');
    }

    // Seed footer settings
    const footerSettings = await storage.getFooterSettings();
    if (!footerSettings) {
      console.log('📝 Adding footer settings seed data...');
      await storage.updateFooterSettings({
        copyrightText: '© 2024 Clubs Morocco. All rights reserved.',
        description: 'Experience authentic Moroccan adventures with sustainable tourism practices.',
        links: [
          { label: 'About Us', url: '/about' },
          { label: 'Privacy Policy', url: '/privacy-policy' },
          { label: 'Terms of Service', url: '/terms-of-service' },
          { label: 'Contact', url: '/contact' }
        ],
        socialLinks: {
          facebook: 'https://facebook.com/clubsmorocco',
          instagram: 'https://instagram.com/clubsmorocco',
          twitter: 'https://twitter.com/clubsmorocco',
          youtube: 'https://youtube.com/@clubsmorocco'
        },
        newsletterEnabled: true,
        newsletterTitle: 'Stay Updated',
        newsletterDescription: 'Subscribe to our newsletter for exclusive offers and adventure tips'
      });
      console.log('✅ Database seeded with footer settings!');
    }

    // Seed SEO settings
    const seoSettings = await storage.getSeoSettings();
    if (!seoSettings) {
      console.log('📝 Adding SEO settings seed data...');
      await storage.updateSeoSettings({
        siteTitle: 'Clubs Morocco - Authentic Adventures & Cultural Experiences',
        siteDescription: 'Discover Morocco through sustainable tourism. Join our community for trekking, desert expeditions, cultural tours, and authentic local experiences.',
        keywords: 'Morocco tourism, Atlas Mountains trek, Sahara Desert tour, Moroccan culture, sustainable travel, adventure clubs, cultural immersion',
        twitterHandle: '@clubsmorocco'
      });
      console.log('✅ Database seeded with SEO settings!');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Initialize database on startup
await seedAdminUser();
await seedDatabase();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize authentication
await setupAuth(app);

// Auth endpoint
app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    let user = await storage.getUser(userId);
    
    // Create user if they don't exist (normal users, NOT admin)
    if (!user) {
      const name = req.user.claims.preferred_username || req.user.claims.name || 'User';
      user = await storage.upsertUser({
        id: userId,
        firstName: name,
        email: req.user.claims.email || `${userId}@replit.dev`,
        isAdmin: false, // Users are NOT admin by default
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

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
    console.log('🔗 Fetching clubs from MySQL database...');
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
        latitude: club.latitude,
        longitude: club.longitude,
        created_at: club.createdAt?.toISOString(),
        updated_at: club.updatedAt?.toISOString()
      })),
      total: clubs.length,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching clubs from database:', error);
    res.status(500).json({ error: 'Failed to fetch clubs from database', details: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    console.log('🔗 Fetching events from MySQL database...');
    const clubs = await storage.getClubs();
    const allEvents: any[] = [];
    
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
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching events from database:', error);
    res.status(500).json({ error: 'Failed to fetch events from database', details: error.message });
  }
});

// Event management endpoints
app.post('/api/events', async (req, res) => {
  try {
    console.log('🔗 Creating new event...');
    const eventData = req.body;
    const event = await storage.createClubEvent(eventData);
    console.log(`✅ Created event: ${event.title}`);
    
    res.status(201).json({
      event: {
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
      },
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log(`🔗 Fetching event ${eventId}...`);
    
    // Get all clubs and find the event
    const clubs = await storage.getClubs();
    let foundEvent: any = null;
    
    for (const club of clubs) {
      const events = await storage.getClubEvents(club.id);
      foundEvent = events.find(event => event.id === eventId);
      if (foundEvent) break;
    }
    
    if (!foundEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    console.log(`✅ Retrieved event: ${foundEvent.title}`);
    res.json({
      event: {
        id: foundEvent.id,
        club_id: foundEvent.clubId,
        title: foundEvent.title,
        description: foundEvent.description,
        event_date: foundEvent.eventDate?.toISOString(),
        location: foundEvent.location,
        max_participants: foundEvent.maxParticipants,
        current_participants: foundEvent.currentParticipants,
        status: foundEvent.status,
        created_at: foundEvent.createdAt?.toISOString()
      },
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event', details: error.message });
  }
});

// Payment endpoints
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('🔗 Creating Stripe payment intent...');
    const { amount } = req.body;
    
    // For demo purposes, return a mock payment intent
    // In production, this would integrate with actual Stripe API
    const paymentIntent = {
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      id: `pi_mock_${Date.now()}`,
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      status: 'requires_payment_method'
    };
    
    console.log(`✅ Created payment intent for $${amount}`);
    res.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntent: paymentIntent,
      source: 'Mock Stripe integration'
    });
  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
  }
});

app.post('/api/paypal/order', async (req, res) => {
  try {
    console.log('🔗 Creating PayPal order...');
    const { amount, currency = 'USD', intent = 'CAPTURE' } = req.body;
    
    // For demo purposes, return a mock PayPal order
    // In production, this would integrate with actual PayPal API
    const order = {
      id: `ORDER_${Date.now()}`,
      status: 'CREATED',
      intent: intent,
      amount: {
        currency_code: currency,
        value: amount.toString()
      },
      approval_url: `https://sandbox.paypal.com/checkoutnow?token=ORDER_${Date.now()}`,
      links: [
        {
          href: `https://sandbox.paypal.com/checkoutnow?token=ORDER_${Date.now()}`,
          rel: 'approve',
          method: 'GET'
        }
      ]
    };
    
    console.log(`✅ Created PayPal order for ${currency} ${amount}`);
    res.json({
      orderId: order.id,
      approval_url: order.approval_url,
      order: order,
      source: 'Mock PayPal integration'
    });
  } catch (error) {
    console.error('❌ Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order', details: error.message });
  }
});

// Club applications management
app.post('/api/applications', async (req, res) => {
  try {
    console.log('🔗 Submitting club application...');
    const applicationData = req.body;
    
    // For demo purposes, store in database (would need to create applications table)
    // For now, return success response
    const application = {
      id: Date.now(),
      ...applicationData,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log(`✅ Application submitted for: ${applicationData.applicantName}`);
    res.status(201).json({
      application: application,
      message: 'Application submitted successfully',
      source: 'Mock application system'
    });
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application', details: error.message });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    console.log('🔗 Fetching club applications...');
    
    // For demo purposes, return mock applications
    const mockApplications = [
      {
        id: 1,
        applicantName: "Sofia Rodriguez",
        email: "sofia.rodriguez@email.com",
        phone: "+212 655 987 654",
        preferredClub: "Atlas Hikers Club",
        interests: ["Mountain Trekking", "Photography", "Nature Conservation"],
        motivation: "I've always been passionate about mountain hiking and would love to explore Morocco's Atlas Mountains with experienced guides.",
        status: "submitted",
        created_at: "2024-12-24T09:30:00Z",
        updated_at: "2024-12-24T09:30:00Z"
      },
      {
        id: 2,
        applicantName: "Ahmed Hassan",
        email: "ahmed.hassan@email.com", 
        phone: "+212 661 123 456",
        preferredClub: "Photography Collective",
        interests: ["Photography", "Cultural Tours", "Historical Sites"],
        motivation: "As a professional photographer, I'm excited about capturing Morocco's diverse landscapes and culture.",
        status: "under_review",
        created_at: "2024-12-23T08:15:00Z",
        updated_at: "2024-12-23T14:20:00Z"
      }
    ];
    
    console.log(`✅ Retrieved ${mockApplications.length} applications`);
    res.json({
      applications: mockApplications,
      total: mockApplications.length,
      source: 'Mock application system'
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const updates = req.body;
    
    console.log(`🔗 Updating application ${applicationId}...`);
    
    // For demo purposes, return success response
    const updatedApplication = {
      id: applicationId,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    console.log(`✅ Updated application ${applicationId}: ${updates.status || 'data updated'}`);
    res.json({
      application: updatedApplication,
      message: 'Application updated successfully',
      source: 'Mock application system'
    });
  } catch (error) {
    console.error('❌ Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application', details: error.message });
  }
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
  try {
    console.log('🔗 Admin login attempt...');
    const { username, password } = req.body;
    
    // Get user from database
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      console.log('❌ Admin login failed - user not found');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    // Check if user is admin
    if (!user.isAdmin) {
      console.log('❌ Admin login failed - user is not admin');
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    
    // Verify password
    if (!user.password) {
      console.log('❌ Admin login failed - no password set');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Admin login failed - invalid password');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    // Generate token
    const adminToken = {
      token: `admin_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'admin'
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    console.log(`✅ Admin login successful for user: ${username}`);
    res.json({
      success: true,
      token: adminToken.token,
      user: adminToken.user,
      expires_at: adminToken.expires_at
    });
  } catch (error) {
    console.error('❌ Error during admin login:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// =======================
// ADMIN API ENDPOINTS
// =======================

// Admin Dashboard - Get statistics and overview
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching admin dashboard stats...');
    
    // Admin gets ALL records (not filtered) for accurate statistics
    const [userList, clubList, eventList, bookingEventList] = await Promise.all([
      db.select().from(users),
      db.select().from(clubs),
      db.select().from(clubEvents),
      db.select().from(bookingEvents)
    ]);
    
    const stats = {
      totalUsers: userList.length,
      userGrowth: 12,
      activeClubs: clubList.filter(c => c.isActive).length,
      newClubsThisMonth: clubList.filter(c => {
        const created = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length,
      upcomingEvents: eventList.length,
      eventsThisWeek: eventList.filter(e => {
        const eventDate = new Date(e.eventDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return eventDate > new Date() && eventDate < weekFromNow;
      }).length,
      totalRevenue: bookingEventList.reduce((sum, e) => sum + (e.price || 0), 0),
      revenueGrowth: 18
    };
    
    console.log('✅ Dashboard stats retrieved');
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
});

// Admin Dashboard - Get recent activity feed
app.get('/api/admin/activity', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching recent activity...');
    
    const [recentUsers, recentClubs, recentEvents] = await Promise.all([
      db.select().from(users).orderBy(desc(users.createdAt)).limit(5),
      db.select().from(clubs).orderBy(desc(clubs.createdAt)).limit(5),
      db.select().from(clubEvents).orderBy(desc(clubEvents.createdAt)).limit(5)
    ]);
    
    const activities = [
      ...recentUsers.map(u => ({
        id: `user-${u.id}`,
        type: 'user_signup',
        title: 'New user registered',
        description: `${u.firstName} ${u.lastName} joined the platform`,
        timestamp: u.createdAt
      })),
      ...recentClubs.map(c => ({
        id: `club-${c.id}`,
        type: 'club_created',
        title: 'New club created',
        description: `${c.name} was added to the platform`,
        timestamp: c.createdAt
      })),
      ...recentEvents.map(e => ({
        id: `event-${e.id}`,
        type: 'event_created',
        title: 'New event scheduled',
        description: `${e.title} is now available`,
        timestamp: e.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    
    console.log(`✅ Retrieved ${activities.length} recent activities`);
    res.json(activities);
  } catch (error) {
    console.error('❌ Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity', details: error.message });
  }
});

// Admin Dashboard - Get upcoming events
app.get('/api/admin/upcoming-events', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching upcoming events...');
    
    const [clubEventsList, bookingEventsList] = await Promise.all([
      db.select().from(clubEvents).orderBy(asc(clubEvents.eventDate)),
      db.select().from(bookingEvents)
    ]);
    
    const upcomingClubEvents = clubEventsList
      .filter(e => e.eventDate && new Date(e.eventDate) > new Date())
      .slice(0, 10)
      .map(e => ({
        id: e.id,
        title: e.title,
        date: e.eventDate,
        location: e.location,
        participants: e.currentParticipants,
        maxParticipants: e.maxParticipants,
        status: e.status,
        type: 'club_event'
      }));
    
    const upcomingBookingEvents = bookingEventsList
      .slice(0, 10)
      .map(e => ({
        id: e.id,
        title: e.title,
        date: new Date().toISOString(), // Booking events don't have specific dates
        location: e.location,
        price: e.price,
        rating: e.rating,
        type: 'booking_event'
      }));
    
    const allEvents = [...upcomingClubEvents, ...upcomingBookingEvents];
    
    console.log(`✅ Retrieved ${allEvents.length} upcoming events`);
    res.json(allEvents);
  } catch (error) {
    console.error('❌ Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events', details: error.message });
  }
});

// Admin Dashboard - Get chart data
app.get('/api/admin/charts', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching chart data...');
    
    const [userList, clubList, eventList, bookingEventList] = await Promise.all([
      db.select().from(users),
      db.select().from(clubs),
      db.select().from(clubEvents),
      db.select().from(bookingEvents)
    ]);
    
    // Generate mock user growth data for the last 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const userGrowthData = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      const count = Math.floor(userList.length * (0.5 + (i * 0.1)));
      return {
        month: monthNames[monthIndex],
        users: count
      };
    });
    
    // Generate revenue data (based on booking events)
    const revenueData = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      const revenue = Math.floor(bookingEventList.reduce((sum, e) => sum + (e.price || 0), 0) * (0.5 + (i * 0.1)));
      return {
        month: monthNames[monthIndex],
        revenue: revenue
      };
    });
    
    // Club activity data
    const clubActivityData = clubList.slice(0, 5).map(c => ({
      name: c.name,
      members: c.memberCount || 0,
      events: eventList.filter(e => e.clubId === c.id).length
    }));
    
    const chartData = {
      userGrowth: userGrowthData,
      revenue: revenueData,
      clubActivity: clubActivityData
    };
    
    console.log('✅ Chart data retrieved');
    res.json(chartData);
  } catch (error) {
    console.error('❌ Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data', details: error.message });
  }
});

// Admin Dashboard - Get statistics and overview (legacy endpoint)
app.get('/api/admin/dashboard/stats', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching admin dashboard stats...');
    
    // Admin gets ALL records (not filtered) for accurate statistics
    const [userList, clubList, eventList, bookingEventList] = await Promise.all([
      db.select().from(users),
      db.select().from(clubs),
      db.select().from(clubEvents),
      db.select().from(bookingEvents)
    ]);
    
    const stats = {
      totalUsers: userList.length,
      userGrowth: 12,
      activeClubs: clubList.filter(c => c.isActive).length,
      newClubsThisMonth: clubList.filter(c => {
        const created = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length,
      upcomingEvents: eventList.length,
      eventsThisWeek: eventList.filter(e => {
        const eventDate = new Date(e.eventDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return eventDate > new Date() && eventDate < weekFromNow;
      }).length,
      totalRevenue: bookingEventList.reduce((sum, e) => sum + (e.price || 0), 0),
      revenueGrowth: 18
    };
    
    console.log('✅ Dashboard stats retrieved');
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: error.message });
  }
});

// User Management - Get all users
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const {  page = '1', perPage = '10', search = '', role = 'all', status = 'all' } = req.query;
    console.log('🔗 Fetching users for admin...');
    
    // Admin queries database directly to get ALL users
    let userList = await db.select().from(users);
    
    if (search) {
      const searchLower = search.toString().toLowerCase();
      userList = userList.filter(u => 
        u.username?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.firstName?.toLowerCase().includes(searchLower) ||
        u.lastName?.toLowerCase().includes(searchLower)
      );
    }
    
    if (role !== 'all') {
      userList = userList.filter(u => role === 'admin' ? u.isAdmin : !u.isAdmin);
    }
    
    const total = userList.length;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const start = (pageNum - 1) * perPageNum;
    const paginatedUsers = userList.slice(start, start + perPageNum);
    
    console.log(`✅ Retrieved ${paginatedUsers.length} users`);
    res.json({
      users: paginatedUsers.map(u => ({ ...u, password: undefined })),
      pagination: {
        total,
        page: pageNum,
        perPage: perPageNum,
        totalPages: Math.ceil(total / perPageNum)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// User Management - Create user
app.post('/api/admin/users', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Creating new user...');
    const userData = req.body;
    
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : null;
    
    const newUser = await storage.upsertUser({
      id: crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || null,
      location: userData.location || null,
      bio: userData.bio || null,
      profileImageUrl: userData.profileImageUrl || null,
      isAdmin: userData.isAdmin || false,
      interests: userData.interests || []
    });
    
    console.log(`✅ User created: ${userData.username}`);
    res.json({ user: { ...newUser, password: undefined } });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// User Management - Update user
app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`🔗 Updating user ${userId}...`);
    const userData = req.body;
    
    const existingUser = await storage.getUser(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : existingUser.password;
    
    const updatedUser = await storage.upsertUser({
      id: userId,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
      profileImageUrl: userData.profileImageUrl,
      isAdmin: userData.isAdmin,
      interests: userData.interests || []
    });
    
    console.log(`✅ User updated: ${userId}`);
    res.json({ user: { ...updatedUser, password: undefined } });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// User Management - Delete user
app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`🔗 Deleting user ${userId}...`);
    
    await db.delete(users).where(eq(users.id, userId));
    
    console.log(`✅ User deleted: ${userId}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Clubs Management - Get all clubs (admin view)
app.get('/api/admin/clubs', isAdmin, async (req, res) => {
  try {
    const { page = '1', perPage = '10', search = '', status = 'all' } = req.query;
    console.log('🔗 Fetching clubs for admin...');
    
    // Admin gets ALL clubs, not just active ones
    let clubsList = await db.select().from(clubs).orderBy(asc(clubs.name));
    
    if (search) {
      const searchLower = search.toString().toLowerCase();
      clubsList = clubsList.filter(c => 
        c.name?.toLowerCase().includes(searchLower) ||
        c.location?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status !== 'all') {
      clubsList = clubsList.filter(c => 
        status === 'active' ? c.isActive : !c.isActive
      );
    }
    
    const total = clubsList.length;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const start = (pageNum - 1) * perPageNum;
    const paginatedClubs = clubsList.slice(start, start + perPageNum);
    
    console.log(`✅ Retrieved ${paginatedClubs.length} clubs`);
    res.json({
      clubs: paginatedClubs,
      pagination: {
        total,
        page: pageNum,
        perPage: perPageNum,
        totalPages: Math.ceil(total / perPageNum)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching clubs:', error);
    res.status(500).json({ error: 'Failed to fetch clubs', details: error.message });
  }
});

// Clubs Management - Update club
app.put('/api/admin/clubs/:id', isAdmin, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 Updating club ${clubId}...`);
    const clubData = req.body;
    
    await db.update(clubs)
      .set({
        ...clubData,
        updatedAt: new Date()
      })
      .where(eq(clubs.id, clubId));
    
    const [updatedClub] = await db.select().from(clubs).where(eq(clubs.id, clubId));
    
    console.log(`✅ Club updated: ${clubId}`);
    res.json({ club: updatedClub });
  } catch (error) {
    console.error('❌ Error updating club:', error);
    res.status(500).json({ error: 'Failed to update club', details: error.message });
  }
});

// Clubs Management - Delete club
app.delete('/api/admin/clubs/:id', isAdmin, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 Deleting club ${clubId}...`);
    
    await db.delete(clubs).where(eq(clubs.id, clubId));
    
    console.log(`✅ Club deleted: ${clubId}`);
    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting club:', error);
    res.status(500).json({ error: 'Failed to delete club', details: error.message });
  }
});

// Events Management - Get all events
app.get('/api/admin/events', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching events for admin...');
    
    const events = await db.select().from(clubEvents);
    
    console.log(`✅ Retrieved ${events.length} events`);
    res.json({ events });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
});

// Events Management - Create event
app.post('/api/admin/events', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Creating new event...');
    const eventData = req.body;
    
    const result: any = await db.insert(clubEvents).values({
      clubId: eventData.clubId,
      title: eventData.title,
      description: eventData.description,
      eventDate: new Date(eventData.eventDate),
      location: eventData.location,
      maxParticipants: eventData.maxParticipants,
      currentParticipants: 0,
      status: 'upcoming',
      createdBy: eventData.createdBy
    });
    
    const insertedId = result[0]?.insertId || result.insertId;
    const [newEvent] = await db.select().from(clubEvents).where(eq(clubEvents.id, insertedId));
    
    console.log(`✅ Event created`);
    res.json({ event: newEvent });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
});

// Events Management - Update event
app.put('/api/admin/events/:id', isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log(`🔗 Updating event ${eventId}...`);
    const eventData = req.body;
    
    await db.update(clubEvents)
      .set({
        ...eventData,
        updatedAt: new Date()
      })
      .where(eq(clubEvents.id, eventId));
    
    const [updatedEvent] = await db.select().from(clubEvents).where(eq(clubEvents.id, eventId));
    
    console.log(`✅ Event updated: ${eventId}`);
    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('❌ Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
});

// Events Management - Delete event
app.delete('/api/admin/events/:id', isAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    console.log(`🔗 Deleting event ${eventId}...`);
    
    await db.delete(clubEvents).where(eq(clubEvents.id, eventId));
    
    console.log(`✅ Event deleted: ${eventId}`);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
});

// Booking Events Management - Get all booking events
app.get('/api/admin/booking-events', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching booking events for admin...');
    
    const events = await storage.getBookingEvents();
    
    console.log(`✅ Retrieved ${events.length} booking events`);
    res.json({ events });
  } catch (error) {
    console.error('❌ Error fetching booking events:', error);
    res.status(500).json({ error: 'Failed to fetch booking events', details: error.message });
  }
});

// Booking Events Management - Create booking event
app.post('/api/admin/booking-events', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Creating new booking event...');
    const eventData = req.body;
    
    const eventId = crypto.randomUUID();
    await db.insert(bookingEvents).values({
      id: eventId,
      title: eventData.title,
      subtitle: eventData.subtitle,
      description: eventData.description,
      location: eventData.location,
      duration: eventData.duration,
      price: eventData.price,
      originalPrice: eventData.originalPrice,
      rating: eventData.rating || 5,
      reviewCount: 0,
      category: eventData.category,
      languages: eventData.languages || ['English'],
      ageRange: eventData.ageRange,
      groupSize: eventData.groupSize,
      cancellationPolicy: eventData.cancellationPolicy,
      images: eventData.images || [],
      highlights: eventData.highlights || [],
      included: eventData.included || [],
      notIncluded: eventData.notIncluded || [],
      schedule: eventData.schedule || [],
      isActive: true,
      createdBy: eventData.createdBy
    });
    
    const [newEvent] = await db.select().from(bookingEvents).where(eq(bookingEvents.id, eventId));
    
    console.log(`✅ Booking event created`);
    res.json({ event: newEvent });
  } catch (error) {
    console.error('❌ Error creating booking event:', error);
    res.status(500).json({ error: 'Failed to create booking event', details: error.message });
  }
});

// Booking Events Management - Update booking event
app.put('/api/admin/booking-events/:id', isAdmin, async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`🔗 Updating booking event ${eventId}...`);
    const eventData = req.body;
    
    await db.update(bookingEvents)
      .set({
        ...eventData,
        updatedAt: new Date()
      })
      .where(eq(bookingEvents.id, eventId));
    
    const [updatedEvent] = await db.select().from(bookingEvents).where(eq(bookingEvents.id, eventId));
    
    console.log(`✅ Booking event updated: ${eventId}`);
    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('❌ Error updating booking event:', error);
    res.status(500).json({ error: 'Failed to update booking event', details: error.message });
  }
});

// Booking Events Management - Delete booking event
app.delete('/api/admin/booking-events/:id', isAdmin, async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`🔗 Deleting booking event ${eventId}...`);
    
    await db.delete(bookingEvents).where(eq(bookingEvents.id, eventId));
    
    console.log(`✅ Booking event deleted: ${eventId}`);
    res.json({ message: 'Booking event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting booking event:', error);
    res.status(500).json({ error: 'Failed to delete booking event', details: error.message });
  }
});

// Analytics - Get analytics data
app.get('/api/admin/analytics', isAdmin, async (req, res) => {
  try {
    const { period = '30days' } = req.query;
    console.log(`🔗 Fetching analytics for period: ${period}...`);
    
    const [users, clubsList, events] = await Promise.all([
      storage.getAllUsers(),
      storage.getClubs(),
      db.select().from(clubEvents)
    ]);
    
    const analytics = {
      traffic: {
        pageViews: 45234,
        uniqueVisitors: 12543,
        avgSessionDuration: '3:24',
        bounceRate: 42
      },
      users: {
        total: users.length,
        new: users.filter(u => {
          const created = new Date(u.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return created > monthAgo;
        }).length,
        active: users.length,
        growth: 15
      },
      events: {
        total: events.length,
        upcoming: events.filter(e => new Date(e.eventDate) > new Date()).length,
        completed: events.filter(e => e.status === 'completed').length,
        avgParticipants: Math.round(events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0) / events.length || 0)
      },
      clubs: {
        total: clubsList.length,
        active: clubsList.filter(c => c.isActive).length,
        avgRating: 4.7,
        avgMembers: Math.round(clubsList.reduce((sum, c) => sum + (c.memberCount || 0), 0) / clubsList.length || 0)
      }
    };
    
    console.log('✅ Analytics data retrieved');
    res.json(analytics);
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
});

// Media Library - Get all media
app.get('/api/admin/media', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching media library...');
    
    const media = await db.select().from(mediaAssets);
    
    console.log(`✅ Retrieved ${media.length} media files`);
    res.json({ media });
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media', details: error.message });
  }
});

// Media Library - Upload media (placeholder - actual file upload would need multer)
app.post('/api/admin/media', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Uploading media...');
    const mediaData = req.body;
    
    const result: any = await db.insert(mediaAssets).values({
      fileName: mediaData.fileName,
      fileType: mediaData.fileType,
      fileUrl: mediaData.fileUrl,
      thumbnailUrl: mediaData.thumbnailUrl,
      altText: mediaData.altText,
      focalPoint: mediaData.focalPoint,
      metadata: mediaData.metadata || {},
      uploadedBy: mediaData.uploadedBy
    });
    
    const insertedId = result[0]?.insertId || result.insertId;
    const [newMedia] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, insertedId));
    
    console.log(`✅ Media uploaded`);
    res.json({ media: newMedia });
  } catch (error) {
    console.error('❌ Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media', details: error.message });
  }
});

// Media Library - Delete media
app.delete('/api/admin/media/:id', isAdmin, async (req, res) => {
  try {
    const mediaId = parseInt(req.params.id);
    console.log(`🔗 Deleting media ${mediaId}...`);
    
    await db.delete(mediaAssets).where(eq(mediaAssets.id, mediaId));
    
    console.log(`✅ Media deleted: ${mediaId}`);
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media', details: error.message });
  }
});

// Settings - Get all settings
app.get('/api/admin/settings', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching all settings...');
    
    const [heroSettings, navbarSettings, footerSettings, contactSettings, seoSettings, themeSettings] = await Promise.all([
      storage.getHeroSettings(),
      storage.getNavbarSettings(),
      storage.getFooterSettings(),
      storage.getContactSettings(),
      db.select().from(seoSettingsTable).limit(1),
      db.select().from(themeSettingsTable).limit(1)
    ]);
    
    const settings = {
      hero: heroSettings,
      navbar: navbarSettings,
      footer: footerSettings,
      contact: contactSettings,
      seo: seoSettings[0] || null,
      theme: themeSettings[0] || null
    };
    
    console.log('✅ All settings retrieved');
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
  }
});

// Settings - Update SEO settings
app.put('/api/admin/settings/seo', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Updating SEO settings...');
    const seoData = req.body;
    
    await db.update(seoSettingsTable)
      .set({
        ...seoData,
        updatedAt: new Date()
      })
      .where(eq(seoSettingsTable.id, 'default'));
    
    const [updated] = await db.select().from(seoSettingsTable).where(eq(seoSettingsTable.id, 'default'));
    
    console.log('✅ SEO settings updated');
    res.json({ settings: updated });
  } catch (error) {
    console.error('❌ Error updating SEO settings:', error);
    res.status(500).json({ error: 'Failed to update SEO settings', details: error.message });
  }
});

// Settings - Update contact settings
app.put('/api/admin/settings/contact', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Updating contact settings...');
    const contactData = req.body;
    
    await db.update(contactSettingsTable)
      .set({
        ...contactData,
        updatedAt: new Date()
      })
      .where(eq(contactSettingsTable.id, 'default'));
    
    const [updated] = await db.select().from(contactSettingsTable).where(eq(contactSettingsTable.id, 'default'));
    
    console.log('✅ Contact settings updated');
    res.json({ settings: updated });
  } catch (error) {
    console.error('❌ Error updating contact settings:', error);
    res.status(500).json({ error: 'Failed to update contact settings', details: error.message });
  }
});

// Content and settings management
app.get('/api/content/landing', async (req, res) => {
  try {
    console.log('🔗 Fetching landing page content...');
    
    // For demo purposes, return mock landing page configuration
    const landingContent = {
      hero: {
        title: "Discover Morocco's Adventure Clubs",
        subtitle: "Join authentic experiences across Morocco's diverse landscapes",
        backgroundImage: "/images/hero-bg.jpg",
        ctaText: "Explore Clubs",
        ctaLink: "/clubs"
      },
      stats: {
        totalClubs: 15,
        totalMembers: 2500,
        totalEvents: 120,
        totalAdventures: 85
      },
      features: [
        {
          title: "Expert Guides",
          description: "Local guides with deep knowledge of Morocco's culture and landscapes",
          icon: "compass"
        },
        {
          title: "Authentic Experiences", 
          description: "Genuine cultural immersion and adventure opportunities",
          icon: "heart"
        },
        {
          title: "Safe Adventures",
          description: "Professionally organized activities with safety as our priority",
          icon: "shield"
        }
      ]
    };
    
    console.log('✅ Retrieved landing page content');
    res.json({
      content: landingContent,
      source: 'Mock content management system'
    });
  } catch (error) {
    console.error('❌ Error fetching landing content:', error);
    res.status(500).json({ error: 'Failed to fetch landing content', details: error.message });
  }
});

app.put('/api/content/landing', async (req, res) => {
  try {
    console.log('🔗 Updating landing page content...');
    const contentUpdates = req.body;
    
    // For demo purposes, return success response
    console.log('✅ Landing page content updated');
    res.json({
      content: contentUpdates,
      message: 'Landing page content updated successfully',
      updated_at: new Date().toISOString(),
      source: 'Mock content management system'
    });
  } catch (error) {
    console.error('❌ Error updating landing content:', error);
    res.status(500).json({ error: 'Failed to update landing content', details: error.message });
  }
});

// User club membership endpoints
app.get('/api/user/clubs', async (req, res) => {
  try {
    console.log('🔗 Fetching user club memberships...');
    
    // For demo purposes, return mock user clubs data
    // In real implementation, this would get user ID from authentication
    const userClubs = [
      {
        id: 1,
        clubId: 1,
        clubName: "Atlas Hikers Club",
        role: "member",
        joinedAt: "2024-01-15T10:00:00Z",
        isActive: true
      },
      {
        id: 2,
        clubId: 3,
        clubName: "Coastal Adventures",
        role: "moderator", 
        joinedAt: "2024-03-20T14:30:00Z",
        isActive: true
      }
    ];
    
    console.log(`✅ Retrieved ${userClubs.length} club memberships`);
    res.json({
      memberships: userClubs,
      total: userClubs.length,
      source: 'Mock membership system'
    });
  } catch (error) {
    console.error('❌ Error fetching user clubs:', error);
    res.status(500).json({ error: 'Failed to fetch user clubs', details: error.message });
  }
});

app.post('/api/clubs/:id/join', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 User joining club ${clubId}...`);
    
    // For demo purposes, return success response
    const membership = {
      id: Date.now(),
      clubId: clubId,
      userId: 'demo_user',
      role: 'member',
      joinedAt: new Date().toISOString(),
      isActive: true
    };
    
    console.log(`✅ User joined club ${clubId}`);
    res.status(201).json({
      membership: membership,
      message: 'Successfully joined club',
      source: 'Mock membership system'
    });
  } catch (error) {
    console.error('❌ Error joining club:', error);
    res.status(500).json({ error: 'Failed to join club', details: error.message });
  }
});

app.post('/api/clubs/:id/leave', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 User leaving club ${clubId}...`);
    
    // For demo purposes, return success response
    console.log(`✅ User left club ${clubId}`);
    res.json({
      message: 'Successfully left club',
      clubId: clubId,
      source: 'Mock membership system'
    });
  } catch (error) {
    console.error('❌ Error leaving club:', error);
    res.status(500).json({ error: 'Failed to leave club', details: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('🔗 Processing contact form submission...');
    const { name, email, subject, message } = req.body;
    
    // For demo purposes, log the contact form data
    const contactSubmission = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      submitted_at: new Date().toISOString(),
      status: 'received'
    };
    
    console.log(`✅ Contact form submitted by: ${name} (${email})`);
    res.status(201).json({
      submission: contactSubmission,
      message: 'Thank you for your message. We will get back to you soon!',
      source: 'Mock contact system'
    });
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form', details: error.message });
  }
});

// Booking Events Management API
app.get('/api/booking/events', async (req, res) => {
  try {
    console.log('🔗 Fetching all booking events...');
    const events = await storage.getBookingEvents();
    console.log(`✅ Retrieved ${events.length} booking events`);
    
    res.json({
      events: events,
      total: events.length,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching booking events:', error);
    res.status(500).json({ error: 'Failed to fetch booking events', details: error.message });
  }
});

app.get('/api/booking/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`🔗 Fetching booking event: ${eventId}`);
    
    const event = await storage.getBookingEvent(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Booking event not found' });
    }
    
    console.log(`✅ Retrieved booking event: ${event.title}`);
    res.json({
      event: event,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching booking event:', error);
    res.status(500).json({ error: 'Failed to fetch booking event', details: error.message });
  }
});

app.post('/api/booking/events', async (req, res) => {
  try {
    console.log('🔗 Creating new booking event...');
    const eventData = req.body;
    
    // Generate ID if not provided
    if (!eventData.id) {
      eventData.id = `event-${Date.now()}`;
    }
    
    const event = await storage.createBookingEvent(eventData);
    console.log(`✅ Created booking event: ${event.title}`);
    
    res.status(201).json({
      event: event,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error creating booking event:', error);
    res.status(500).json({ error: 'Failed to create booking event', details: error.message });
  }
});

app.put('/api/booking/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;
    console.log(`🔗 Updating booking event: ${eventId}`);
    
    // Check if event exists first
    const existingEvent = await storage.getBookingEvent(eventId);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Booking event not found' });
    }
    
    const event = await storage.updateBookingEvent(eventId, eventData);
    console.log(`✅ Updated booking event: ${event.title}`);
    
    res.json({
      event: event,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error updating booking event:', error);
    res.status(500).json({ error: 'Failed to update booking event', details: error.message });
  }
});

app.delete('/api/booking/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`🔗 Deleting booking event: ${eventId}`);
    
    // Check if event exists first
    const existingEvent = await storage.getBookingEvent(eventId);
    if (!existingEvent) {
      return res.status(404).json({ error: 'Booking event not found' });
    }
    
    await storage.deleteBookingEvent(eventId);
    console.log(`✅ Deleted booking event: ${eventId}`);
    
    res.json({
      message: 'Booking event deleted successfully',
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error deleting booking event:', error);
    res.status(500).json({ error: 'Failed to delete booking event', details: error.message });
  }
});

// Booking Page Settings API
app.get('/api/booking/settings', async (req, res) => {
  try {
    console.log('🔗 Fetching booking page settings...');
    const settings = await storage.getBookingPageSettings();
    
    // Return default settings if none exist
    const defaultSettings = {
      id: 'booking-page-settings',
      title: 'Book Your Adventure',
      subtitle: 'Secure your spot for an unforgettable Moroccan experience',
      headerBackgroundImage: '/book-hero.jpg',
      footerText: 'Questions? Contact our team for personalized assistance.',
      contactEmail: 'bookings@morocclubs.com',
      contactPhone: '+212 522 123 456',
      enableReviews: true,
      enableSimilarEvents: true,
      enableImageGallery: true,
      maxParticipants: 25,
      minimumBookingHours: 24,
      customCss: '',
      seoTitle: 'Book Morocco Adventures | Morocco Clubs',
      seoDescription: 'Book authentic Moroccan experiences with local clubs. From Atlas Mountains trekking to Sahara expeditions and cultural festivals.',
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Retrieved booking page settings');
    res.json({
      settings: settings || defaultSettings,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching booking page settings:', error);
    res.status(500).json({ error: 'Failed to fetch booking page settings', details: error.message });
  }
});

app.put('/api/booking/settings', async (req, res) => {
  try {
    console.log('🔗 Updating booking page settings...');
    const settingsData = req.body;
    
    const settings = await storage.updateBookingPageSettings(settingsData);
    console.log('✅ Updated booking page settings');
    
    res.json({
      settings: settings,
      source: 'MySQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error updating booking page settings:', error);
    res.status(500).json({ error: 'Failed to update booking page settings', details: error.message });
  }
});

// CMS API Routes

// Hero Settings
app.get('/api/cms/hero', async (req, res) => {
  try {
    const settings = await storage.getHeroSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching hero settings:', error);
    res.status(500).json({ error: 'Failed to fetch hero settings' });
  }
});

app.put('/api/admin/cms/hero', isAdmin, async (req, res) => {
  try {
    const settings = await storage.updateHeroSettings(req.body);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating hero settings:', error);
    res.status(500).json({ error: 'Failed to update hero settings' });
  }
});

// Media Upload
app.post('/api/admin/cms/media', isAdmin, async (req, res) => {
  try {
    const { fileName, fileType, fileUrl, altText } = req.body;
    
    if (!fileName || !fileType || !fileUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mediaAsset = await storage.createMediaAsset({
      fileName,
      fileType,
      fileUrl,
      altText: altText || null,
      uploadedBy: null,
    });

    res.json(mediaAsset);
  } catch (error) {
    console.error('❌ Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Theme Settings
app.get('/api/cms/theme', async (req, res) => {
  try {
    const settings = await storage.getThemeSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching theme settings:', error);
    res.status(500).json({ error: 'Failed to fetch theme settings' });
  }
});

app.put('/api/admin/cms/theme', isAdmin, async (req, res) => {
  try {
    const settings = await storage.updateThemeSettings(req.body);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating theme settings:', error);
    res.status(500).json({ error: 'Failed to update theme settings' });
  }
});

// Navbar Settings
app.get('/api/cms/navbar', async (req, res) => {
  try {
    const settings = await storage.getNavbarSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching navbar settings:', error);
    res.status(500).json({ error: 'Failed to fetch navbar settings' });
  }
});

app.put('/api/admin/cms/navbar', isAdmin, async (req, res) => {
  try {
    const settings = await storage.updateNavbarSettings(req.body);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating navbar settings:', error);
    res.status(500).json({ error: 'Failed to update navbar settings' });
  }
});

// Focus Items
app.get('/api/cms/focus-items', async (req, res) => {
  try {
    const items = await storage.getFocusItems();
    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching focus items:', error);
    res.status(500).json({ error: 'Failed to fetch focus items' });
  }
});

// Site Stats
app.get('/api/cms/stats', async (req, res) => {
  try {
    const stats = await storage.getSiteStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching site stats:', error);
    res.status(500).json({ error: 'Failed to fetch site stats' });
  }
});

// Team Members
app.get('/api/cms/team-members', async (req, res) => {
  try {
    const members = await storage.getTeamMembers();
    res.json(members);
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Testimonials
app.get('/api/cms/testimonials', async (req, res) => {
  try {
    const testimonials = await storage.getLandingTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Contact Settings
app.get('/api/cms/contact', async (req, res) => {
  try {
    const settings = await storage.getContactSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching contact settings:', error);
    res.status(500).json({ error: 'Failed to fetch contact settings' });
  }
});

// Footer Settings
app.get('/api/cms/footer', async (req, res) => {
  try {
    const settings = await storage.getFooterSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching footer settings:', error);
    res.status(500).json({ error: 'Failed to fetch footer settings' });
  }
});

// Media Assets - List all
app.get('/api/admin/cms/media', isAdmin, async (req, res) => {
  try {
    const media = await storage.getMediaAssets();
    res.json(media);
  } catch (error) {
    console.error('❌ Error fetching media assets:', error);
    res.status(500).json({ error: 'Failed to fetch media assets' });
  }
});

// In production, handle client-side routing
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

const host = '0.0.0.0';

app.listen(PORT, host, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Serving built frontend and API');
  } else {
    console.log('Development mode: API server only');
  }
  console.log(`Placeholder API available at http://${host}:${PORT}/api/placeholder/WIDTH/HEIGHT`);
});

}

// Start the server
initializeServer().catch(err => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});