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
      source: 'PostgreSQL database via Drizzle ORM'
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
    let foundEvent = null;
    
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
      source: 'PostgreSQL database via Drizzle ORM'
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
    
    // Demo credentials check
    if (username === 'admin' && password === 'admin123') {
      const adminToken = {
        token: `admin_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user: {
          id: 'admin',
          username: 'admin',
          role: 'admin',
          email: 'admin@morocclubs.com'
        },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      console.log('✅ Admin login successful');
      res.json({
        success: true,
        token: adminToken.token,
        user: adminToken.user,
        expires_at: adminToken.expires_at,
        source: 'Mock admin authentication'
      });
    } else {
      console.log('❌ Admin login failed - invalid credentials');
      res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error('❌ Error during admin login:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
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
      source: 'PostgreSQL database via Drizzle ORM'
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
      source: 'PostgreSQL database via Drizzle ORM'
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
      source: 'PostgreSQL database via Drizzle ORM'
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
      source: 'PostgreSQL database via Drizzle ORM'
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
      source: 'PostgreSQL database via Drizzle ORM'
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
      source: 'PostgreSQL database via Drizzle ORM'
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
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error updating booking page settings:', error);
    res.status(500).json({ error: 'Failed to update booking page settings', details: error.message });
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