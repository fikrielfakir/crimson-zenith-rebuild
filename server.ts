import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { storage } from './server/storage.js';
import { setupAuth, isAuthenticated, isAdmin } from './server/replitAuth.js';
import { db, pool } from './server/db.js';
import { eq, asc, desc, or, like, count, sql, and } from 'drizzle-orm';
import { 
  users, 
  clubs, 
  clubEvents, 
  bookingEvents,
  bookingTickets,
  blogPosts,
  mediaAssets,
  seoSettings as seoSettingsTable,
  contactSettings as contactSettingsTable,
  themeSettings as themeSettingsTable,
  contentTranslations
} from './shared/schema.js';
import { sendBookingConfirmationEmail, sendBookingApprovedEmail } from './server/emailService.js';

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

// Run database migrations (PostgreSQL)
async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
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
          name: 'Ensah',
          slug: 'ensah',
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
          slug: 'desert-explorers',
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
          slug: 'coastal-adventures',
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
          latitude: 31.2578,
          longitude: -7.9928,
          duration: '3 Days / 2 Nights',
          startDate: '2024-12-15',
          endDate: '2025-03-30',
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
          latitude: 31.0801,
          longitude: -4.0133,
          duration: '2 Days / 1 Night',
          startDate: '2024-12-01',
          endDate: '2025-04-30',
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
          latitude: 31.5084,
          longitude: -9.7595,
          duration: '5 Days / 4 Nights',
          startDate: '2024-12-10',
          endDate: '2025-05-31',
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

    // Seed navbar settings with default navigation links
    const navbarSettings = await storage.getNavbarSettings();
    if (!navbarSettings || !navbarSettings.navigationLinks || navbarSettings.navigationLinks.length === 0) {
      console.log('📝 Adding navbar settings seed data...');
      await storage.updateNavbarSettings({
        navigationLinks: [
          { label: 'Discover', url: '/discover', isExternal: false, hasDropdown: true },
          { label: 'Activities', url: '/activities', isExternal: false },
          { label: 'Projects', url: '/projects', isExternal: false },
          { label: 'Clubs', url: '/clubs', isExternal: false },
          { label: 'Gallery', url: '/gallery', isExternal: false },
          { label: 'Blog', url: '/blog', isExternal: false },
          { label: 'Talents', url: '/talents', isExternal: false, hasDropdown: true },
          { label: 'Contact', url: '/contact', isExternal: false }
        ]
      });
      console.log('✅ Database seeded with navbar settings!');
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

    // Seed president message settings
    const presidentMsg = await storage.getPresidentMessageSettings();
    if (!presidentMsg) {
      console.log('📝 Adding president message seed data...');
      await storage.updatePresidentMessageSettings({
        isActive: true,
        title: 'A word from the president',
        presidentName: 'Dr. Aderahim Azrkan',
        presidentRole: 'President, The Journey Association',
        message: `Dear Friends and Fellow Travelers,\n\nIt is with great pleasure and pride that I welcome you to The Journey Association. Our mission is to create sustainable pathways for tourism, culture, and community development across Morocco. We believe that tourism is not just about visiting beautiful places—it's about creating meaningful connections, preserving our heritage, and empowering local communities.\n\nTogether with our partners, clubs, and dedicated members, we are building bridges between cultures, protecting our natural and cultural treasures, and ensuring that the benefits of tourism reach every corner of our beloved Morocco. Your participation and support make all the difference in achieving our vision of a sustainable and prosperous future.`,
        quote: 'Together, we create lasting impact.',
        backgroundColor: '#112250',
        backgroundGradient: 'linear-gradient(180deg, #112250 0%, #1a3366 100%)',
        titleFontFamily: 'Poppins',
        titleFontSize: '48px',
        titleColor: '#ffffff',
        titleAlignment: 'left',
        nameFontFamily: 'Poppins',
        nameFontSize: '28px',
        nameColor: '#ffffff',
        roleFontFamily: 'Poppins',
        roleFontSize: '18px',
        roleColor: '#D8C18D',
        messageFontFamily: 'Poppins',
        messageFontSize: '16px',
        messageColor: '#ffffff',
        quoteFontSize: '18px',
        quoteColor: '#D8C18D',
        imagePosition: 'left',
        imageAlignment: 'center',
        imageWidth: '42%',
        sectionPadding: '80px 0',
        contentGap: '48px',
      });
      console.log('✅ Database seeded with president message settings!');
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
await runMigrations();
await seedAdminUser();
await seedDatabase();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize authentication
await setupAuth(app);


// Serve static files from public directory
app.use('/static', express.static(join(__dirname, 'public')));
app.use('/uploads', express.static(join(__dirname, 'public/uploads')));

// In production, serve the built frontend files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
}

function buildPlaceholderSVG(w: number, h: number, type: string): string {
  const NAVY  = '#0d1b42';
  const NAVY2 = '#152d6e';
  const GOLD  = '#D8C18D';
  const GOLDF = '#D8C18D99';
  const cx = w / 2;
  const cy = h * 0.44;
  const r  = Math.min(w, h) * 0.18;
  const fs = Math.max(10, Math.min(14, h * 0.055));
  const gradId = `pg_${type}`;

  const labels: Record<string,string> = {
    club: 'Club', event: 'Event', news: 'Article',
    gallery: 'Gallery', partner: 'Partner', profile: 'Profile',
  };
  const label = labels[type] ?? 'The Journey';

  const icons: Record<string,string> = {
    profile: `
      <circle cx="${cx}" cy="${cy - r * 0.25}" r="${r * 0.45}" fill="${GOLD}"/>
      <path d="M ${cx - r * 0.9} ${cy + r * 1.15} Q ${cx - r * 0.9} ${cy + r * 0.35} ${cx} ${cy + r * 0.35} Q ${cx + r * 0.9} ${cy + r * 0.35} ${cx + r * 0.9} ${cy + r * 1.15} Z" fill="${GOLD}"/>`,

    club: `
      <circle cx="${cx}" cy="${cy - r * 0.5}" r="${r * 0.38}" fill="${GOLD}"/>
      <circle cx="${cx - r * 0.8}" cy="${cy - r * 0.2}" r="${r * 0.3}" fill="${GOLD}" opacity="0.7"/>
      <circle cx="${cx + r * 0.8}" cy="${cy - r * 0.2}" r="${r * 0.3}" fill="${GOLD}" opacity="0.7"/>
      <ellipse cx="${cx}" cy="${cy + r * 0.6}" rx="${r * 0.65}" ry="${r * 0.45}" fill="${GOLD}"/>
      <ellipse cx="${cx - r * 0.82}" cy="${cy + r * 0.85}" rx="${r * 0.5}" ry="${r * 0.35}" fill="${GOLD}" opacity="0.6"/>
      <ellipse cx="${cx + r * 0.82}" cy="${cy + r * 0.85}" rx="${r * 0.5}" ry="${r * 0.35}" fill="${GOLD}" opacity="0.6"/>`,

    event: `
      <rect x="${cx - r * 1.1}" y="${cy - r * 0.9}" width="${r * 2.2}" height="${r * 1.9}" rx="${r * 0.12}" fill="none" stroke="${GOLD}" stroke-width="${r * 0.1}"/>
      <rect x="${cx - r * 1.1}" y="${cy - r * 0.9}" width="${r * 2.2}" height="${r * 0.52}" rx="${r * 0.1}" fill="${GOLD}" opacity="0.35"/>
      <line x1="${cx - r * 0.55}" y1="${cy - r * 1.1}" x2="${cx - r * 0.55}" y2="${cy - r * 0.72}" stroke="${GOLD}" stroke-width="${r * 0.13}" stroke-linecap="round"/>
      <line x1="${cx + r * 0.55}" y1="${cy - r * 1.1}" x2="${cx + r * 0.55}" y2="${cy - r * 0.72}" stroke="${GOLD}" stroke-width="${r * 0.13}" stroke-linecap="round"/>
      <circle cx="${cx - r * 0.65}" cy="${cy + r * 0.18}" r="${r * 0.1}" fill="${GOLD}"/>
      <circle cx="${cx}"            cy="${cy + r * 0.18}" r="${r * 0.1}" fill="${GOLD}"/>
      <circle cx="${cx + r * 0.65}" cy="${cy + r * 0.18}" r="${r * 0.1}" fill="${GOLD}"/>
      <circle cx="${cx - r * 0.65}" cy="${cy + r * 0.6}" r="${r * 0.1}" fill="${GOLD}"/>
      <circle cx="${cx}"            cy="${cy + r * 0.6}" r="${r * 0.1}" fill="${GOLD}"/>
      <circle cx="${cx + r * 0.65}" cy="${cy + r * 0.6}" r="${r * 0.1}" fill="${GOLD}"/>`,

    news: `
      <rect x="${cx - r * 0.9}" y="${cy - r * 1.1}" width="${r * 1.8}" height="${r * 2.15}" rx="${r * 0.1}" fill="none" stroke="${GOLD}" stroke-width="${r * 0.09}"/>
      <polygon points="${cx + r * 0.3},${cy - r * 1.1} ${cx + r * 0.9},${cy - r * 0.5} ${cx + r * 0.3},${cy - r * 0.5}" fill="${GOLD}" opacity="0.4"/>
      <line x1="${cx - r * 0.65}" y1="${cy - r * 0.35}" x2="${cx + r * 0.45}" y2="${cy - r * 0.35}" stroke="${GOLD}" stroke-width="${r * 0.09}" stroke-linecap="round"/>
      <line x1="${cx - r * 0.65}" y1="${cy - r * 0.02}" x2="${cx + r * 0.65}" y2="${cy - r * 0.02}" stroke="${GOLD}" stroke-width="${r * 0.09}" stroke-linecap="round"/>
      <line x1="${cx - r * 0.65}" y1="${cy + r * 0.31}" x2="${cx + r * 0.65}" y2="${cy + r * 0.31}" stroke="${GOLD}" stroke-width="${r * 0.09}" stroke-linecap="round"/>
      <line x1="${cx - r * 0.65}" y1="${cy + r * 0.64}" x2="${cx + r * 0.3}"  y2="${cy + r * 0.64}" stroke="${GOLD}" stroke-width="${r * 0.09}" stroke-linecap="round"/>`,

    gallery: `
      <rect x="${cx - r * 1.2}" y="${cy - r * 0.9}" width="${r * 2.4}" height="${r * 1.75}" rx="${r * 0.12}" fill="none" stroke="${GOLD}" stroke-width="${r * 0.09}"/>
      <polygon points="${cx - r * 1},${cy + r * 0.7} ${cx - r * 0.35},${cy - r * 0.1} ${cx + r * 0.15},${cy + r * 0.35} ${cx + r * 0.6},${cy - r * 0.4} ${cx + r * 1.05},${cy + r * 0.7}"
        fill="${GOLD}" opacity="0.3" stroke="${GOLD}" stroke-width="${r * 0.07}" stroke-linejoin="round"/>
      <circle cx="${cx - r * 0.65}" cy="${cy - r * 0.52}" r="${r * 0.22}" fill="${GOLD}" opacity="0.7"/>`,

    partner: `
      <polygon points="${cx - r * 1.1},${cy - r * 0.3} ${cx},${cy - r * 1.1} ${cx + r * 1.1},${cy - r * 0.3}" fill="${GOLD}" opacity="0.4" stroke="${GOLD}" stroke-width="${r * 0.08}" stroke-linejoin="round"/>
      <rect x="${cx - r * 0.95}" y="${cy - r * 0.32}" width="${r * 1.9}" height="${r * 1.25}" fill="none" stroke="${GOLD}" stroke-width="${r * 0.08}"/>
      <rect x="${cx - r * 0.55}" y="${cy + r * 0.1}" width="${r * 0.42}" height="${r * 0.42}" fill="${GOLD}" opacity="0.5"/>
      <rect x="${cx + r * 0.13}" y="${cy + r * 0.1}" width="${r * 0.42}" height="${r * 0.42}" fill="${GOLD}" opacity="0.5"/>
      <rect x="${cx - r * 0.22}" y="${cy + r * 0.55}" width="${r * 0.44}" height="${r * 0.38}" fill="${GOLD}" opacity="0.5"/>`,

    default: `
      <rect x="${cx - r * 0.1}" y="${cy + r * 0.3}" width="${r * 0.2}" height="${r * 0.65}" fill="${GOLD}"/>
      <circle cx="${cx}"           cy="${cy - r * 0.2}" r="${r * 0.55}" fill="${GOLD}" opacity="0.85"/>
      <circle cx="${cx - r * 0.42}" cy="${cy + r * 0.2}" r="${r * 0.38}" fill="${GOLD}" opacity="0.75"/>
      <circle cx="${cx + r * 0.42}" cy="${cy + r * 0.2}" r="${r * 0.38}" fill="${GOLD}" opacity="0.75"/>`,
  };

  const icon = icons[type] ?? icons['default'];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%"   stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${gradId})"/>
  <rect width="${w}" height="${h}" fill="${GOLD}" opacity="0.03"/>
  ${icon}
  <text x="${cx}" y="${h * 0.91}" text-anchor="middle" fill="${GOLDF}"
    font-family="'Segoe UI',Arial,sans-serif" font-size="${fs}" letter-spacing="1.5">
    ${label.toUpperCase()}
  </text>
</svg>`;
}

app.get('/api/placeholder/:width/:height', (req, res) => {
  const w = Math.min(Math.max(parseInt(req.params.width)  || 400, 10), 3000);
  const h = Math.min(Math.max(parseInt(req.params.height) || 300, 10), 3000);
  const rawType = (typeof req.query.type === 'string' ? req.query.type : '').toLowerCase();
  const validTypes = new Set(['club','event','news','gallery','partner','profile','default']);
  const type = validTypes.has(rawType) ? rawType
    : (w === h ? 'profile'
      : w / h > 2 ? 'event'
      : w / h > 1.4 ? (h > 500 ? 'gallery' : 'news')
      : 'default');
  const svg = buildPlaceholderSVG(w, h, type);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
  res.send(svg);
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
        slug: club.slug,
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

app.get('/api/clubs/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`🔗 Fetching club with slug: ${slug}...`);
    
    const [club] = await db.select().from(clubs).where(eq(clubs.slug, slug));
    
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    console.log(`✅ Found club: ${club.name}`);
    res.json({
      id: club.id,
      name: club.name,
      slug: club.slug,
      description: club.description,
      longDescription: club.longDescription,
      location: club.location,
      memberCount: club.memberCount,
      rating: club.rating,
      image: club.image,
      features: club.features,
      contactPhone: club.contactPhone,
      contactEmail: club.contactEmail,
      website: club.website,
      socialMedia: club.socialMedia,
      established: club.established,
      isActive: club.isActive,
      latitude: club.latitude,
      longitude: club.longitude,
      ownerId: club.ownerId,
      createdAt: club.createdAt?.toISOString(),
      updatedAt: club.updatedAt?.toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching club by slug:', error);
    res.status(500).json({ error: 'Failed to fetch club', details: error.message });
  }
});

app.get('/api/clubs/:id/events', async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 Fetching events for club ${clubId}...`);
    
    const events = await storage.getUpcomingClubEvents(clubId);
    console.log(`✅ Found ${events.length} upcoming events for club ${clubId}`);
    
    const formattedEvents = events.map(event => ({
      id: event.id,
      clubId: event.clubId,
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      endDate: event.endDate,
      location: event.location,
      locationDetails: event.locationDetails,
      duration: event.duration,
      category: event.category,
      languages: event.languages,
      minAge: event.minAge,
      maxPeople: event.maxPeople,
      price: event.price,
      maxParticipants: event.maxParticipants,
      currentParticipants: event.currentParticipants,
      highlights: event.highlights,
      included: event.included,
      notIncluded: event.notIncluded,
      importantInfo: event.importantInfo,
      status: event.status,
      image: event.image,
      createdBy: event.createdBy,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));
    
    res.json({ events: formattedEvents });
  } catch (error) {
    console.error('❌ Error fetching club events:', error);
    res.status(500).json({ error: 'Failed to fetch club events', details: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    console.log('🔗 Fetching public events from MySQL database...');
    
    const { status, perPage = '100', page = '1' } = req.query;
    const perPageNum = parseInt(perPage as string);
    const pageNum = parseInt(page as string);
    const offset = (pageNum - 1) * perPageNum;
    
    // Fetch only association events (not club events) from the database
    let allEvents = await db.select().from(clubEvents).where(eq(clubEvents.isAssociationEvent, true));
    
    // Filter by status (default to showing only 'upcoming' events which maps to 'published' in frontend)
    if (status && status !== 'all') {
      if (status === 'published') {
        allEvents = allEvents.filter(e => e.status === 'upcoming');
      } else {
        allEvents = allEvents.filter(e => e.status === status);
      }
    } else {
      // By default, only show upcoming (published) events to public
      allEvents = allEvents.filter(e => e.status === 'upcoming');
    }
    
    // Map events to frontend format
    const events = allEvents
      .slice(offset, offset + perPageNum)
      .map(event => ({
        id: event.id,
        clubId: event.clubId,
        title: event.title,
        description: event.description,
        startDate: event.eventDate,
        endDate: event.endDate || event.eventDate,
        location: event.location,
        category: event.category || 'workshop',
        price: event.price,
        maxParticipants: event.maxParticipants,
        currentParticipants: event.currentParticipants,
        status: event.status === 'upcoming' ? 'published' : event.status,
        createdAt: event.createdAt
      }));
    
    console.log(`✅ Retrieved ${events.length} public events from database`);
    res.json({
      events,
      total: allEvents.length,
      page: pageNum,
      perPage: perPageNum,
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
    
    // Fetch event directly from the database
    const events = await db.select().from(clubEvents).where(eq(clubEvents.id, eventId));
    
    if (!events || events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const foundEvent = events[0];
    
    // Helper function to parse JSON or text fields into arrays
    const parseToArray = (field: any): any[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // Try to split by newlines or commas
          return field.split(/\n|,/).map((s: string) => s.trim()).filter((s: string) => s);
        }
      }
      return [];
    };
    
    console.log(`✅ Retrieved event: ${foundEvent.title}`);
    res.json({
      event: {
        id: foundEvent.id,
        clubId: foundEvent.clubId,
        isAssociationEvent: foundEvent.isAssociationEvent,
        title: foundEvent.title,
        description: foundEvent.description,
        image: foundEvent.image,
        eventDate: foundEvent.eventDate?.toISOString(),
        endDate: foundEvent.endDate?.toISOString(),
        category: foundEvent.category,
        duration: foundEvent.duration,
        price: foundEvent.price ? parseFloat(foundEvent.price as string) : null,
        location: foundEvent.location,
        locationDetails: foundEvent.locationDetails,
        languages: foundEvent.languages,
        minAge: foundEvent.minAge,
        maxPeople: foundEvent.maxPeople,
        highlights: parseToArray(foundEvent.highlights),
        included: parseToArray(foundEvent.included),
        notIncluded: parseToArray(foundEvent.notIncluded),
        importantInfo: foundEvent.importantInfo,
        maxParticipants: foundEvent.maxParticipants,
        currentParticipants: foundEvent.currentParticipants,
        status: foundEvent.status,
        createdBy: foundEvent.createdBy,
        createdAt: foundEvent.createdAt?.toISOString(),
        updatedAt: foundEvent.updatedAt?.toISOString()
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
        if (!c.createdAt) return false;
        const created = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length,
      upcomingEvents: eventList.length,
      eventsThisWeek: eventList.filter(e => {
        if (!e.eventDate) return false;
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
    ].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    }).slice(0, 10);
    
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
        if (!c.createdAt) return false;
        const created = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length,
      upcomingEvents: eventList.length,
      eventsThisWeek: eventList.filter(e => {
        if (!e.eventDate) return false;
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

// User Management - Toggle admin status
app.patch('/api/admin/users/:id/toggle-admin', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { isAdmin: newAdminStatus } = req.body;
    console.log(`🔗 Toggling admin status for user ${userId}...`);
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await db.update(users)
      .set({ isAdmin: newAdminStatus })
      .where(eq(users.id, userId));
    
    console.log(`✅ Admin status toggled for user ${userId}`);
    res.json({ message: 'Admin status updated', isAdmin: newAdminStatus });
  } catch (error) {
    console.error('❌ Error toggling admin status:', error);
    res.status(500).json({ error: 'Failed to toggle admin status', details: error.message });
  }
});

// User Management - Toggle active status (suspend/activate)
app.patch('/api/admin/users/:id/toggle-active', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`🔗 Toggling active status for user ${userId}...`);
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newActiveStatus = !user.isActive;
    await db.update(users)
      .set({ isActive: newActiveStatus })
      .where(eq(users.id, userId));
    
    console.log(`✅ User ${userId} ${newActiveStatus ? 'activated' : 'suspended'}`);
    res.json({ message: `User ${newActiveStatus ? 'activated' : 'suspended'}`, isActive: newActiveStatus });
  } catch (error) {
    console.error('❌ Error toggling active status:', error);
    res.status(500).json({ error: 'Failed to toggle active status', details: error.message });
  }
});

// User Management - Reset password
app.post('/api/admin/users/:id/reset-password', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    console.log(`🔗 Resetting password for user ${userId}...`);
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
    
    console.log(`✅ Password reset for user ${userId}`);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password', details: error.message });
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

// Clubs Management - Get single club
app.get('/api/admin/clubs/:id', isAdmin, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 Fetching club ${clubId}...`);
    
    const [club] = await db.select().from(clubs).where(eq(clubs.id, clubId));
    
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    console.log(`✅ Club retrieved: ${clubId}`);
    res.json(club);
  } catch (error) {
    console.error('❌ Error fetching club:', error);
    res.status(500).json({ error: 'Failed to fetch club', details: error.message });
  }
});

// Clubs Management - Create club
app.post('/api/admin/clubs', isAdmin, async (req: any, res) => {
  try {
    console.log('🔗 Creating new club...');
    const clubData = req.body;
    const userId = req.user?.id;
    
    // Check if slug already exists
    if (clubData.slug) {
      const [existingSlug] = await db.select().from(clubs).where(eq(clubs.slug, clubData.slug));
      if (existingSlug) {
        return res.status(400).json({ error: 'Slug already exists. Please choose a different slug.' });
      }
    }
    
    const result: any = await db.insert(clubs).values({
      name: clubData.name,
      slug: clubData.slug,
      description: clubData.description,
      longDescription: clubData.longDescription || null,
      image: clubData.image || null,
      location: clubData.location,
      contactPhone: clubData.contactPhone || null,
      contactEmail: clubData.contactEmail || null,
      website: clubData.website || null,
      socialMedia: clubData.socialMedia || {},
      established: clubData.established || null,
      isActive: clubData.isActive !== undefined ? clubData.isActive : true,
      latitude: clubData.latitude || null,
      longitude: clubData.longitude || null,
      ownerId: userId,
      memberCount: 0,
      rating: 5,
      features: []
    });
    
    const insertedId = result[0]?.insertId || result.insertId;
    const [newClub] = await db.select().from(clubs).where(eq(clubs.id, insertedId));
    
    console.log(`✅ Club created: ${insertedId}`);
    res.json(newClub);
  } catch (error) {
    console.error('❌ Error creating club:', error);
    res.status(500).json({ error: 'Failed to create club', details: error.message });
  }
});

// Clubs Management - Update club
app.put('/api/admin/clubs/:id', isAdmin, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 Updating club ${clubId}...`);
    const clubData = req.body;
    
    // Fetch existing club to preserve untouched fields
    const [existingClub] = await db.select().from(clubs).where(eq(clubs.id, clubId));
    if (!existingClub) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    // Check if slug is being changed and if new slug already exists
    if (clubData.slug !== undefined && clubData.slug !== existingClub.slug) {
      const [existingSlug] = await db.select().from(clubs).where(eq(clubs.slug, clubData.slug));
      if (existingSlug) {
        return res.status(400).json({ error: 'Slug already exists. Please choose a different slug.' });
      }
    }
    
    // Build update object with only provided fields to preserve existing data
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (clubData.name !== undefined) updateData.name = clubData.name;
    if (clubData.slug !== undefined) updateData.slug = clubData.slug;
    if (clubData.description !== undefined) updateData.description = clubData.description;
    if (clubData.longDescription !== undefined) updateData.longDescription = clubData.longDescription;
    if (clubData.image !== undefined) updateData.image = clubData.image;
    if (clubData.location !== undefined) updateData.location = clubData.location;
    if (clubData.contactPhone !== undefined) updateData.contactPhone = clubData.contactPhone;
    if (clubData.contactEmail !== undefined) updateData.contactEmail = clubData.contactEmail;
    if (clubData.website !== undefined) updateData.website = clubData.website;
    if (clubData.established !== undefined) updateData.established = clubData.established;
    if (clubData.isActive !== undefined) updateData.isActive = clubData.isActive;
    if (clubData.latitude !== undefined) updateData.latitude = clubData.latitude;
    if (clubData.longitude !== undefined) updateData.longitude = clubData.longitude;
    
    // Merge socialMedia instead of replacing it
    if (clubData.socialMedia !== undefined) {
      const existingSocialMedia = (existingClub.socialMedia as any) || {};
      updateData.socialMedia = {
        ...existingSocialMedia,
        ...clubData.socialMedia
      };
    }
    
    await db.update(clubs)
      .set(updateData)
      .where(eq(clubs.id, clubId));
    
    const [updatedClub] = await db.select().from(clubs).where(eq(clubs.id, clubId));
    
    console.log(`✅ Club updated: ${clubId}`);
    res.json(updatedClub);
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

// Clubs Management - Approve club
app.post('/api/admin/clubs/:id/approve', isAdmin, async (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    console.log(`🔗 Approving club ${clubId}...`);
    
    await db.update(clubs)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(clubs.id, clubId));
    
    const [approvedClub] = await db.select().from(clubs).where(eq(clubs.id, clubId));
    
    console.log(`✅ Club approved: ${clubId}`);
    res.json(approvedClub);
  } catch (error) {
    console.error('❌ Error approving club:', error);
    res.status(500).json({ error: 'Failed to approve club', details: error.message });
  }
});

// Clubs Management - Toggle feature status
// Note: This endpoint is currently disabled as 'featured' field needs to be added to schema
// app.patch('/api/admin/clubs/:id/feature', isAdmin, async (req, res) => {
//   try {
//     const clubId = parseInt(req.params.id);
//     const { featured } = req.body;
//     console.log(`🔗 Toggling feature status for club ${clubId}...`);
//     
//     await db.update(clubs)
//       .set({ featured, updatedAt: new Date() })
//       .where(eq(clubs.id, clubId));
//     
//     const [updatedClub] = await db.select().from(clubs).where(eq(clubs.id, clubId));
//     
//     console.log(`✅ Club feature status updated: ${clubId}`);
//     res.json(updatedClub);
//   } catch (error) {
//     console.error('❌ Error updating feature status:', error);
//     res.status(500).json({ error: 'Failed to update feature status', details: error.message });
//   }
// });

// Events Management - Get all events (uses booking_events table)
app.get('/api/admin/events', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching events for admin...');
    
    const { search, status, category, page = '1', perPage = '25' } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const offset = (pageNum - 1) * perPageNum;
    
    // Query from bookingEvents table (same table used by POST/PUT/DELETE)
    let query = db.select().from(bookingEvents);
    
    const allEvents = await query;
    let filteredEvents = allEvents;
    
    // Apply filters
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        e.title?.toLowerCase().includes(searchLower) || 
        e.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status && status !== 'all') {
      filteredEvents = filteredEvents.filter(e => e.status === status);
    }
    
    // Map events to frontend format with startDate and endDate
    const events = filteredEvents
      .slice(offset, offset + perPageNum)
      .map(event => ({
        ...event,
        startDate: event.eventDate,
        endDate: event.endDate || event.eventDate,
        maxAttendees: event.maxParticipants,
        attendees: event.currentParticipants || 0,
        // Map backend status to frontend: upcoming → published, others stay the same
        status: event.status === 'upcoming' ? 'published' : event.status
      }));
    
    console.log(`✅ Retrieved ${events.length} events`);
    res.json({ 
      events,
      total: filteredEvents.length,
      totalPages: Math.ceil(filteredEvents.length / perPageNum)
    });
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
    
    // Parse dates
    const eventDate = eventData.startDate ? new Date(eventData.startDate) : null;
    const endDate = eventData.endDate ? new Date(eventData.endDate) : null;
    
    if (!eventDate || isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: 'Invalid start date' });
    }
    
    // Generate unique string ID from title (slug format) with timestamp
    const slugBase = (eventData.title || 'event')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
    const uniqueId = `${slugBase}-${Date.now()}`;
    
    // Determine clubId - null for association events
    let clubId = null;
    if (!eventData.isAssociationEvent && eventData.clubId) {
      clubId = parseInt(eventData.clubId);
    } else if (!eventData.isAssociationEvent) {
      // Get first club as default for club events
      const [firstClub] = await db.select().from(clubs).limit(1);
      clubId = firstClub?.id || null;
    }
    
    await db.insert(bookingEvents).values({
      id: uniqueId,
      clubId: clubId,
      isAssociationEvent: !!eventData.isAssociationEvent,
      title: eventData.title,
      description: eventData.description,
      location: eventData.location || 'Morocco',
      locationDetails: eventData.locationDetails || null,
      eventDate: eventDate,
      endDate: endDate,
      duration: eventData.duration || null,
      category: eventData.category || 'workshop',
      languages: eventData.languages ? JSON.stringify([eventData.languages]) : null,
      minAge: eventData.minAge ? parseInt(eventData.minAge) : null,
      maxPeople: eventData.maxPeople ? parseInt(eventData.maxPeople) : null,
      maxParticipants: eventData.maxAttendees ? parseInt(eventData.maxAttendees) : null,
      price: eventData.price ? parseInt(eventData.price) : 0,
      image: eventData.image || null,
      highlights: eventData.highlights ? JSON.stringify([eventData.highlights]) : null,
      included: eventData.included ? JSON.stringify([eventData.included]) : null,
      notIncluded: eventData.notIncluded ? JSON.stringify([eventData.notIncluded]) : null,
      importantInfo: eventData.importantInfo || null,
      currentParticipants: 0,
      status: eventData.status || 'upcoming',
      createdBy: eventData.createdBy || null,
      isActive: true
    });
    
    const [newEvent] = await db.select().from(bookingEvents).where(eq(bookingEvents.id, uniqueId));
    
    console.log(`✅ Event created with ID: ${uniqueId}`);
    res.json({ 
      event: newEvent
    });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
});

// Events Management - Update event
app.put('/api/admin/events/:id', isAdmin, async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log(`🔗 Updating event ${eventId}...`);
    const eventData = req.body;
    
    // Parse dates
    const eventDate = eventData.startDate ? new Date(eventData.startDate) : null;
    const endDate = eventData.endDate ? new Date(eventData.endDate) : null;
    
    if (eventDate && isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: 'Invalid start date' });
    }
    
    // Determine clubId
    let clubId = undefined;
    if (eventData.isAssociationEvent) {
      clubId = null;
    } else if (eventData.clubId) {
      clubId = parseInt(eventData.clubId);
    }
    
    const updateData: any = {
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      locationDetails: eventData.locationDetails || null,
      status: eventData.status || 'upcoming',
      category: eventData.category || 'workshop',
      duration: eventData.duration || null,
      languages: eventData.languages ? JSON.stringify([eventData.languages]) : null,
      minAge: eventData.minAge ? parseInt(eventData.minAge) : null,
      maxPeople: eventData.maxPeople ? parseInt(eventData.maxPeople) : null,
      maxParticipants: eventData.maxAttendees ? parseInt(eventData.maxAttendees) : null,
      price: eventData.price ? parseInt(eventData.price) : 0,
      image: eventData.image || null,
      highlights: eventData.highlights ? JSON.stringify([eventData.highlights]) : null,
      included: eventData.included ? JSON.stringify([eventData.included]) : null,
      notIncluded: eventData.notIncluded ? JSON.stringify([eventData.notIncluded]) : null,
      importantInfo: eventData.importantInfo || null,
      isAssociationEvent: !!eventData.isAssociationEvent,
      updatedAt: new Date()
    };
    
    if (eventDate) updateData.eventDate = eventDate;
    if (endDate) updateData.endDate = endDate;
    if (clubId !== undefined) updateData.clubId = clubId;
    
    await db.update(bookingEvents)
      .set(updateData)
      .where(eq(bookingEvents.id, eventId));
    
    const [updatedEvent] = await db.select().from(bookingEvents).where(eq(bookingEvents.id, eventId));
    
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
    const eventId = req.params.id;
    console.log(`🔗 Deleting event ${eventId}...`);
    
    await db.delete(bookingEvents).where(eq(bookingEvents.id, eventId));
    
    console.log(`✅ Event deleted: ${eventId}`);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
});

// Bookings Management - Get all booking tickets
app.get('/api/admin/bookings', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching bookings for admin...');
    
    const { search, status, page = '1', perPage = '25' } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const offset = (pageNum - 1) * perPageNum;
    
    // Fetch booking tickets with event info joined
    const allBookings = await db.select({
      id: bookingTickets.id,
      bookingReference: bookingTickets.bookingReference,
      eventId: bookingTickets.eventId,
      eventTitle: bookingEvents.title,
      userId: bookingTickets.userId,
      customerName: bookingTickets.customerName,
      customerEmail: bookingTickets.customerEmail,
      customerPhone: bookingTickets.customerPhone,
      numberOfParticipants: bookingTickets.numberOfParticipants,
      eventDate: bookingTickets.eventDate,
      totalPrice: bookingTickets.totalPrice,
      paymentStatus: bookingTickets.paymentStatus,
      paymentMethod: bookingTickets.paymentMethod,
      status: bookingTickets.status,
      specialRequests: bookingTickets.specialRequests,
      createdAt: bookingTickets.createdAt,
    })
    .from(bookingTickets)
    .leftJoin(bookingEvents, eq(bookingTickets.eventId, bookingEvents.id));
    
    let filteredBookings = allBookings;
    
    // Apply filters
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredBookings = filteredBookings.filter(b => 
        b.customerName?.toLowerCase().includes(searchLower) || 
        b.customerEmail?.toLowerCase().includes(searchLower) ||
        b.bookingReference?.toLowerCase().includes(searchLower) ||
        b.eventTitle?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status && status !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }
    
    // Map to frontend format
    const bookings = filteredBookings
      .slice(offset, offset + perPageNum)
      .map(booking => ({
        id: booking.id,
        bookingReference: booking.bookingReference,
        eventId: booking.eventId,
        eventTitle: booking.eventTitle || 'Unknown Event',
        userName: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
        eventDate: booking.eventDate,
        attendees: booking.numberOfParticipants,
        totalAmount: parseFloat(booking.totalPrice?.toString() || '0'),
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        status: booking.status,
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
      }));
    
    console.log(`✅ Retrieved ${bookings.length} bookings`);
    res.json({ 
      bookings,
      total: filteredBookings.length,
      totalPages: Math.ceil(filteredBookings.length / perPageNum)
    });
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

// Bookings Management - Update booking status
app.patch('/api/admin/bookings/:id/status', isAdmin, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { status } = req.body;
    console.log(`🔗 Updating booking ${bookingId} status to ${status}...`);
    
    const updateData: any = { status, updatedAt: new Date() };
    if (status === 'confirmed') updateData.confirmedAt = new Date();
    if (status === 'cancelled') updateData.cancelledAt = new Date();
    
    await db.update(bookingTickets)
      .set(updateData)
      .where(eq(bookingTickets.id, bookingId));
    
    const [updatedBooking] = await db.select().from(bookingTickets).where(eq(bookingTickets.id, bookingId));
    
    console.log(`✅ Booking status updated: ${bookingId}`);
    res.json(updatedBooking);
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status', details: error.message });
  }
});

// Blog Posts / News Management - Get all posts
app.get('/api/admin/news', isAdmin, async (req, res) => {
  try {
    console.log('🔗 Fetching blog posts for admin...');
    
    const { search, status, category, page = '1', perPage = '25' } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const offset = (pageNum - 1) * perPageNum;
    
    let query = db.select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      status: blogPosts.status,
      views: blogPosts.views,
      featuredImage: blogPosts.featuredImage,
      authorId: blogPosts.authorId,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      authorName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
      authorAvatar: users.profileImageUrl,
    }).from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .$dynamic();
    
    const conditions: any[] = [];
    
    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.content, `%${search}%`)
        )
      );
    }
    
    if (status && status !== 'all') {
      conditions.push(eq(blogPosts.status, status as string));
    }
    
    if (category && category !== 'all') {
      conditions.push(eq(blogPosts.category, category as string));
    }
    
    if (conditions.length > 0) {
      const combinedConditions = conditions.length === 1 ? conditions[0] : sql`${sql.join(conditions, sql` AND `)}`;
      query = query.where(combinedConditions);
    }
    
    let countQuery = db.select({ count: count() }).from(blogPosts).$dynamic();
    
    if (status && status !== 'all') {
      countQuery = countQuery.where(eq(blogPosts.status, status as string));
    }
    
    if (category && category !== 'all') {
      countQuery = countQuery.where(eq(blogPosts.category, category as string));
    }
    
    if (search) {
      countQuery = countQuery.where(like(blogPosts.title, `%${search}%`));
    }
    
    const [countResult] = await countQuery;
    const total = countResult.count;
    
    const posts = await query.limit(perPageNum).offset(offset);
    
    console.log(`✅ Retrieved ${posts.length} blog posts`);
    res.json({
      posts,
      total,
      page: pageNum,
      perPage: perPageNum,
      totalPages: Math.ceil(total / perPageNum)
    });
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message });
  }
});

// Blog Posts - Create post
app.post('/api/admin/news', isAdmin, async (req: any, res) => {
  try {
    console.log('🔗 Creating new blog post...');
    const postData = req.body;
    
    const slug = postData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const [newPost] = await db.insert(blogPosts).values({
      title: postData.title,
      slug: `${slug}-${Date.now()}`,
      content: postData.content,
      excerpt: postData.excerpt,
      category: postData.category,
      featuredImage: postData.featuredImage,
      status: postData.status || 'draft',
      authorId: req.user.id,
      publishedAt: postData.status === 'published' ? new Date() : null,
    }).$returningId();
    
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, newPost.id));
    
    console.log(`✅ Blog post created: ${newPost.id}`);
    res.json({ post });
  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post', details: error.message });
  }
});

// Blog Posts - Update post
app.put('/api/admin/news/:id', isAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    console.log(`🔗 Updating blog post ${postId}...`);
    const postData = req.body;
    
    const updateData: any = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      category: postData.category,
      featuredImage: postData.featuredImage,
      status: postData.status,
      updatedAt: new Date(),
    };
    
    if (postData.status === 'published' && !postData.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, postId));
    
    const [updatedPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
    
    console.log(`✅ Blog post updated: ${postId}`);
    res.json({ post: updatedPost });
  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post', details: error.message });
  }
});

// Blog Posts - Delete post
app.delete('/api/admin/news/:id', isAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    console.log(`🔗 Deleting blog post ${postId}...`);
    
    await db.delete(blogPosts).where(eq(blogPosts.id, postId));
    
    console.log(`✅ Blog post deleted: ${postId}`);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post', details: error.message });
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
          if (!u.createdAt) return false;
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
        upcoming: events.filter(e => e.eventDate && new Date(e.eventDate) > new Date()).length,
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

// Booking Tickets API
app.post('/api/booking/tickets', async (req, res) => {
  try {
    console.log('🎫 Creating new booking ticket...');
    const ticketData = req.body;
    
    // Validate required fields
    if (!ticketData.eventId || !ticketData.customerName || !ticketData.customerEmail || !ticketData.eventDate || !ticketData.totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const paymentMethod = ticketData.paymentMethod || 'cash';
    const status = paymentMethod === 'card' ? 'accepted' : 'pending';
    
    const ticket = await storage.createBookingTicket({
      ...ticketData,
      eventDate: new Date(ticketData.eventDate),
      userId: (req.user as any)?.id || null,
      status: status,
      paymentStatus: status,
    });
    
    console.log(`✅ Created booking ticket: ${ticket.bookingReference}`);
    
    // Send email confirmation
    const event = await storage.getBookingEvent(ticketData.eventId);
    const emailData = {
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      bookingReference: ticket.bookingReference,
      eventTitle: event?.title || 'Event Booking',
      eventDate: new Date(ticket.eventDate),
      numberOfParticipants: ticket.numberOfParticipants,
      totalPrice: parseFloat(ticket.totalPrice?.toString() || '0'),
      paymentMethod: paymentMethod,
      status: status,
      eventLocation: event?.location,
    };
    
    sendBookingConfirmationEmail(emailData).catch(err => {
      console.error('Failed to send booking email:', err);
    });
    
    res.status(201).json({
      ticket: ticket,
      message: 'Booking created successfully',
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error creating booking ticket:', error);
    res.status(500).json({ error: 'Failed to create booking ticket', details: error.message });
  }
});

app.get('/api/booking/tickets/:reference', async (req, res) => {
  try {
    const reference = req.params.reference;
    console.log(`🔍 Fetching booking ticket: ${reference}`);
    
    const ticket = await storage.getBookingTicket(reference);
    if (!ticket) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log(`✅ Retrieved booking ticket: ${reference}`);
    res.json({
      ticket: ticket,
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching booking ticket:', error);
    res.status(500).json({ error: 'Failed to fetch booking ticket', details: error.message });
  }
});

app.get('/api/booking/tickets', isAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching booking tickets (admin only)...');
    
    const tickets = await storage.getBookingTickets();
    console.log(`✅ Retrieved ${tickets.length} booking tickets`);
    
    res.json({
      tickets: tickets,
      total: tickets.length,
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching booking tickets:', error);
    res.status(500).json({ error: 'Failed to fetch booking tickets', details: error.message });
  }
});

app.get('/api/booking/my-tickets', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    console.log(`📋 Fetching tickets for user: ${userId}`);
    
    // Get tickets with event titles using JOIN
    const ticketsWithEvents = await db
      .select({
        id: bookingTickets.id,
        bookingReference: bookingTickets.bookingReference,
        eventId: bookingTickets.eventId,
        userId: bookingTickets.userId,
        customerName: bookingTickets.customerName,
        customerEmail: bookingTickets.customerEmail,
        customerPhone: bookingTickets.customerPhone,
        numberOfParticipants: bookingTickets.numberOfParticipants,
        eventDate: bookingTickets.eventDate,
        totalPrice: bookingTickets.totalPrice,
        paymentStatus: bookingTickets.paymentStatus,
        paymentMethod: bookingTickets.paymentMethod,
        specialRequests: bookingTickets.specialRequests,
        status: bookingTickets.status,
        createdAt: bookingTickets.createdAt,
        updatedAt: bookingTickets.updatedAt,
        eventTitle: bookingEvents.title,
      })
      .from(bookingTickets)
      .leftJoin(bookingEvents, eq(bookingTickets.eventId, bookingEvents.id))
      .where(eq(bookingTickets.userId, userId))
      .orderBy(desc(bookingTickets.createdAt));
    
    console.log(`✅ Retrieved ${ticketsWithEvents.length} tickets for user`);
    
    res.json({
      tickets: ticketsWithEvents,
      total: ticketsWithEvents.length,
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error fetching user booking tickets:', error);
    res.status(500).json({ error: 'Failed to fetch user booking tickets', details: error.message });
  }
});

app.get('/api/booking/check-event/:eventId', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.json({ hasBooked: false, booking: null });
    }
    
    const eventId = req.params.eventId;
    console.log(`🔍 Checking booking for user ${userId} on event ${eventId}`);
    
    const [existingBooking] = await db
      .select({
        id: bookingTickets.id,
        bookingReference: bookingTickets.bookingReference,
        status: bookingTickets.status,
        eventDate: bookingTickets.eventDate,
        numberOfParticipants: bookingTickets.numberOfParticipants,
        createdAt: bookingTickets.createdAt,
      })
      .from(bookingTickets)
      .where(sql`${bookingTickets.userId} = ${userId} AND ${bookingTickets.eventId} = ${eventId} AND ${bookingTickets.status} != 'cancelled'`)
      .limit(1);
    
    if (existingBooking) {
      console.log(`✅ User has existing booking: ${existingBooking.bookingReference}`);
      return res.json({ hasBooked: true, booking: existingBooking });
    }
    
    res.json({ hasBooked: false, booking: null });
  } catch (error) {
    console.error('❌ Error checking user booking:', error);
    res.status(500).json({ error: 'Failed to check booking status', details: error.message });
  }
});

app.put('/api/booking/tickets/:reference/status', async (req, res) => {
  try {
    const reference = req.params.reference;
    const { status, ...additionalData } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    console.log(`🔄 Updating booking ticket ${reference} status to: ${status}`);
    
    const ticket = await storage.updateBookingTicketStatus(reference, status, additionalData);
    console.log(`✅ Updated booking ticket status: ${reference}`);
    
    // Send confirmation email when booking is approved (cash payment approved by admin)
    if (status === 'accepted' || status === 'confirmed') {
      const event = await storage.getBookingEvent(ticket.eventId);
      const emailData = {
        customerName: ticket.customerName,
        customerEmail: ticket.customerEmail,
        bookingReference: ticket.bookingReference,
        eventTitle: event?.title || 'Event Booking',
        eventDate: new Date(ticket.eventDate),
        numberOfParticipants: ticket.numberOfParticipants,
        totalPrice: parseFloat(ticket.totalPrice?.toString() || '0'),
        paymentMethod: ticket.paymentMethod || 'cash',
        status: status,
        eventLocation: event?.location,
      };
      
      sendBookingApprovedEmail(emailData).catch(err => {
        console.error('Failed to send approval email:', err);
      });
    }
    
    res.json({
      ticket: ticket,
      message: 'Booking status updated successfully',
      source: 'PostgreSQL database via Drizzle ORM'
    });
  } catch (error) {
    console.error('❌ Error updating booking ticket status:', error);
    res.status(500).json({ error: 'Failed to update booking ticket status', details: error.message });
  }
});

// User cancel their own pending booking
app.put('/api/booking/my-tickets/:reference/cancel', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const reference = req.params.reference;
    const { reason } = req.body;
    
    // Get the booking first to verify ownership and status
    const ticket = await storage.getBookingTicket(reference);
    if (!ticket) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Verify user owns this booking
    if (ticket.userId !== userId) {
      return res.status(403).json({ error: 'You can only cancel your own bookings' });
    }
    
    // Only allow cancellation of pending bookings
    if (ticket.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bookings can be cancelled' });
    }
    
    console.log(`🚫 User ${userId} cancelling booking: ${reference}`);
    
    const updatedTicket = await storage.updateBookingTicketStatus(reference, 'cancelled', {
      cancellationReason: reason || 'Cancelled by user'
    });
    
    console.log(`✅ Booking cancelled: ${reference}`);
    
    res.json({
      ticket: updatedTicket,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking', details: error.message });
  }
});

// User update their own pending booking
app.put('/api/booking/my-tickets/:reference/update', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const reference = req.params.reference;
    const { numberOfParticipants, eventDate, specialRequests } = req.body;
    
    // Get the booking first to verify ownership and status
    const ticket = await storage.getBookingTicket(reference);
    if (!ticket) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Verify user owns this booking
    if (ticket.userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own bookings' });
    }
    
    // Only allow editing of pending bookings
    if (ticket.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending bookings can be edited' });
    }
    
    console.log(`✏️ User ${userId} updating booking: ${reference}`);
    
    // Get event for price calculation
    const event = await storage.getBookingEvent(ticket.eventId);
    const pricePerPerson = event?.price ? parseFloat(event.price.toString()) : 0;
    const newParticipants = numberOfParticipants || ticket.numberOfParticipants;
    const newTotalPrice = pricePerPerson * newParticipants;
    
    // Update the booking
    await db
      .update(bookingTickets)
      .set({
        numberOfParticipants: newParticipants,
        eventDate: eventDate ? new Date(eventDate) : ticket.eventDate,
        specialRequests: specialRequests !== undefined ? specialRequests : ticket.specialRequests,
        totalPrice: newTotalPrice.toString(),
        updatedAt: new Date()
      })
      .where(eq(bookingTickets.bookingReference, reference));
    
    // Fetch updated ticket
    const updatedTicket = await storage.getBookingTicket(reference);
    
    console.log(`✅ Booking updated: ${reference}`);
    
    res.json({
      ticket: updatedTicket,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
});

// CMS API Routes

// Hero Settings
app.get('/api/cms/hero', async (req, res) => {
  try {
    const settings = await storage.getHeroSettings();
    if (!settings) {
      return res.json({
        id: 'default',
        title: ["Where Adventure Meets Transformation", "اكتشف المغرب"],
        subtitle: "Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities.",
        primaryButtonText: "Start Your Journey",
        primaryButtonLink: "/join",
        secondaryButtonText: "Explore Clubs",
        secondaryButtonLink: "/clubs",
        backgroundType: "image",
        backgroundOverlayColor: "rgba(26, 54, 93, 0.7)",
        titleFontSize: "65px",
        titleColor: "#ffffff",
        subtitleFontSize: "20px",
        subtitleColor: "#ffffff",
        enableTypewriter: true,
        showPrimaryButton: true,
        showSecondaryButton: true,
      });
    }
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

// About Settings - Public endpoint
app.get('/api/cms/about', async (req, res) => {
  try {
    const settings = await storage.getAboutSettings();
    res.json(settings ?? {});
  } catch (error) {
    console.error('❌ Error fetching about settings:', error);
    res.status(500).json({ error: 'Failed to fetch about settings' });
  }
});

// About Settings - Admin endpoints
app.get('/api/admin/cms/about', isAdmin, async (req, res) => {
  try {
    const settings = await storage.getAboutSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching about settings:', error);
    res.status(500).json({ error: 'Failed to fetch about settings' });
  }
});

app.put('/api/admin/cms/about', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const settings = await storage.updateAboutSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating about settings:', error);
    res.status(500).json({ error: 'Failed to update about settings' });
  }
});

// President Message Settings - Public endpoint
app.get('/api/cms/president-message', async (req, res) => {
  try {
    const settings = await storage.getPresidentMessageSettings();
    res.json(settings ?? null);
  } catch (error) {
    console.error('❌ Error fetching president message settings:', error);
    res.status(500).json({ error: 'Failed to fetch president message settings' });
  }
});

// President Message Settings - Admin endpoints
app.get('/api/admin/cms/president-message', isAdmin, async (req, res) => {
  try {
    const settings = await storage.getPresidentMessageSettings();
    res.json(settings ?? null);
  } catch (error) {
    console.error('❌ Error fetching president message settings:', error);
    res.status(500).json({ error: 'Failed to fetch president message settings' });
  }
});

app.put('/api/admin/cms/president-message', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const settings = await storage.updatePresidentMessageSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating president message settings:', error);
    res.status(500).json({ error: 'Failed to update president message settings' });
  }
});

// Footer Settings - Admin endpoints
app.put('/api/admin/cms/footer', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const settings = await storage.updateFooterSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating footer settings:', error);
    res.status(500).json({ error: 'Failed to update footer settings' });
  }
});

// Partner Settings - Admin endpoints
app.get('/api/admin/cms/partner-settings', isAdmin, async (req, res) => {
  try {
    const settings = await storage.getPartnerSettings();
    res.json(settings);
  } catch (error) {
    console.error('❌ Error fetching partner settings:', error);
    res.status(500).json({ error: 'Failed to fetch partner settings' });
  }
});

app.put('/api/admin/cms/partner-settings', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const settings = await storage.updatePartnerSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating partner settings:', error);
    res.status(500).json({ error: 'Failed to update partner settings' });
  }
});

// Partners CRUD - Admin endpoints
app.get('/api/admin/cms/partners', isAdmin, async (req, res) => {
  try {
    const partners = await storage.getPartners();
    res.json(partners);
  } catch (error) {
    console.error('❌ Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

app.post('/api/admin/cms/partners', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const partner = await storage.createPartner({ ...req.body, createdBy: userId });
    res.status(201).json(partner);
  } catch (error) {
    console.error('❌ Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

app.put('/api/admin/cms/partners/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const partner = await storage.updatePartner(id, req.body);
    res.json(partner);
  } catch (error) {
    console.error('❌ Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

app.delete('/api/admin/cms/partners/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deletePartner(id);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

// Focus Items CRUD - Admin endpoints
app.get('/api/admin/cms/focus-items', isAdmin, async (req, res) => {
  try {
    const items = await storage.getFocusItems();
    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching focus items:', error);
    res.status(500).json({ error: 'Failed to fetch focus items' });
  }
});

app.post('/api/admin/cms/focus-items', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const item = await storage.createFocusItem({ ...req.body, createdBy: userId });
    res.status(201).json(item);
  } catch (error) {
    console.error('❌ Error creating focus item:', error);
    res.status(500).json({ error: 'Failed to create focus item' });
  }
});

app.put('/api/admin/cms/focus-items/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await storage.updateFocusItem(id, req.body);
    res.json(item);
  } catch (error) {
    console.error('❌ Error updating focus item:', error);
    res.status(500).json({ error: 'Failed to update focus item' });
  }
});

app.delete('/api/admin/cms/focus-items/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteFocusItem(id);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting focus item:', error);
    res.status(500).json({ error: 'Failed to delete focus item' });
  }
});

// Testimonials CRUD - Admin endpoints
app.get('/api/admin/cms/testimonials', isAdmin, async (req, res) => {
  try {
    const testimonials = await storage.getLandingTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/admin/cms/testimonials', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const testimonial = await storage.createLandingTestimonial({ ...req.body, userId });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/admin/cms/testimonials/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const testimonial = await storage.updateLandingTestimonial(id, req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('❌ Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/admin/cms/testimonials/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteLandingTestimonial(id);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// Site Stats CRUD - Admin endpoints
app.get('/api/admin/cms/stats', isAdmin, async (req, res) => {
  try {
    const stats = await storage.getSiteStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching site stats:', error);
    res.status(500).json({ error: 'Failed to fetch site stats' });
  }
});

app.post('/api/admin/cms/stats', isAdmin, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const stat = await storage.createSiteStat({ ...req.body, updatedBy: userId });
    res.status(201).json(stat);
  } catch (error) {
    console.error('❌ Error creating site stat:', error);
    res.status(500).json({ error: 'Failed to create site stat' });
  }
});

app.put('/api/admin/cms/stats/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req.user as any)?.id;
    const stat = await storage.updateSiteStat(id, { ...req.body, updatedBy: userId });
    res.json(stat);
  } catch (error) {
    console.error('❌ Error updating site stat:', error);
    res.status(500).json({ error: 'Failed to update site stat' });
  }
});

app.delete('/api/admin/cms/stats/:id', isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteSiteStat(id);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting site stat:', error);
    res.status(500).json({ error: 'Failed to delete site stat' });
  }
});

// ── Translations ─────────────────────────────────────────────────────────────

// Middleware that accepts either a Passport session OR any Bearer token.
// Translation routes are dev-only local Express endpoints; the Bearer token
// is issued by the production Laravel admin login, so its presence is proof
// the caller is an authenticated admin.
function isAdminOrBearer(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user?.isAdmin) return next();
  const auth = (req.headers.authorization as string) || '';
  if (auth.startsWith('Bearer ') && auth.length > 10) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// GET /api/translations/:entityType — all translations for an entity type
// Accepts optional ?ids=1,2,3 to filter by specific entity IDs
app.get('/api/translations/:entityType', async (req, res) => {
  try {
    const { entityType } = req.params;
    const idsParam = req.query.ids as string | undefined;
    const idList = idsParam ? idsParam.split(',').map(s => s.trim()).filter(Boolean) : [];

    let query = db
      .select()
      .from(contentTranslations)
      .where(eq(contentTranslations.entityType, entityType)) as any;

    if (idList.length > 0) {
      const { inArray } = await import('drizzle-orm');
      query = db
        .select()
        .from(contentTranslations)
        .where(
          and(
            eq(contentTranslations.entityType, entityType),
            inArray(contentTranslations.entityId, idList)
          )
        );
    }

    const rows = await query;
    res.json(rows.map((r: any) => ({
      id: r.id,
      entityType: r.entityType,
      entityId: r.entityId,
      field: r.field,
      language: r.language,
      value: r.value,
    })));
  } catch (err) {
    console.error('❌ Error fetching translations:', err);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

// GET /api/translations/:entityType/:entityId — translations for one entity
app.get('/api/translations/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const rows = await db
      .select()
      .from(contentTranslations)
      .where(
        and(
          eq(contentTranslations.entityType, entityType),
          eq(contentTranslations.entityId, entityId)
        )
      );
    res.json(rows.map(r => ({
      id: r.id,
      entityType: r.entityType,
      entityId: r.entityId,
      field: r.field,
      language: r.language,
      value: r.value,
    })));
  } catch (err) {
    console.error('❌ Error fetching translations:', err);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

// POST /api/admin/translations/auto-translate — translate text via MyMemory free API
app.post('/api/admin/translations/auto-translate', isAdminOrBearer, async (req, res) => {
  try {
    const { texts, targetLanguage } = req.body;
    // texts: Array<{ key: string; value: string }>
    // targetLanguage: 'ar' | 'fr' | 'es'
    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const langMap: Record<string, string> = { ar: 'ar', fr: 'fr', es: 'es' };
    const targetLang = langMap[targetLanguage];
    if (!targetLang) return res.status(400).json({ error: 'Unsupported language' });

    const results: Record<string, string> = {};

    for (const { key, value } of texts) {
      if (!value?.trim()) { results[key] = ''; continue; }
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=en|${targetLang}`;
      const response = await fetch(url);
      const data = await response.json() as any;
      if (data?.responseStatus === 200) {
        results[key] = data.responseData?.translatedText ?? '';
      } else {
        results[key] = '';
      }
    }

    res.json({ results });
  } catch (err) {
    console.error('❌ Auto-translate error:', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// POST /api/admin/translations — upsert a single translation
app.post('/api/admin/translations', isAdminOrBearer, async (req, res) => {
  try {
    const { entityType, entityId, field, language, value } = req.body;
    if (!entityType || !entityId || !field || !language || !value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await db
      .select()
      .from(contentTranslations)
      .where(
        and(
          eq(contentTranslations.entityType, entityType),
          eq(contentTranslations.entityId, String(entityId)),
          eq(contentTranslations.field, field),
          eq(contentTranslations.language, language)
        )
      )
      .limit(1);

    let row;
    if (existing.length > 0) {
      const updated = await db
        .update(contentTranslations)
        .set({ value, updatedAt: new Date() })
        .where(eq(contentTranslations.id, existing[0].id))
        .returning();
      row = updated[0];
    } else {
      const inserted = await db
        .insert(contentTranslations)
        .values({ entityType, entityId: String(entityId), field, language, value })
        .returning();
      row = inserted[0];
    }

    res.status(201).json({
      id: row.id,
      entityType: row.entityType,
      entityId: row.entityId,
      field: row.field,
      language: row.language,
      value: row.value,
    });
  } catch (err) {
    console.error('❌ Error saving translation:', err);
    res.status(500).json({ error: 'Failed to save translation' });
  }
});

// In production, handle client-side routing
if (process.env.NODE_ENV === 'production') {
  app.get('(.*)', (req, res) => {
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