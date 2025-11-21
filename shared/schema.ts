import { sql } from 'drizzle-orm';
import {
  index,
  json,
  mysqlTable,
  timestamp,
  varchar,
  int,
  text,
  boolean,
  decimal,
  serial,
  date,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expires)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: varchar("username", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  bio: text("bio"),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  interests: json("interests").default(sql`'[]'`),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clubs table with enhanced profile information
export const clubs = mysqlTable("clubs", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  image: varchar("image", { length: 500 }),
  // logo: varchar("logo", { length: 500 }), // TODO: Uncomment after adding logo column to production MySQL database
  location: varchar("location", { length: 255 }).notNull(),
  memberCount: int("member_count").default(0),
  features: json("features").default(sql`'[]'`),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  socialMedia: json("social_media").default(sql`'{}'`),
  rating: int("rating").default(5),
  established: varchar("established", { length: 100 }),
  isActive: boolean("is_active").default(true),
  latitude: decimal("latitude", { precision: 9, scale: 6 }),
  longitude: decimal("longitude", { precision: 9, scale: 6 }),
  ownerId: varchar("owner_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Club memberships
export const clubMemberships = mysqlTable("club_memberships", {
  id: serial().primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  clubId: int("club_id").references(() => clubs.id).notNull(),
  role: varchar("role", { length: 50 }).default("member"), // member, moderator, admin
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Booking events table - unified events table (includes club events, association events, and booking events)
export const bookingEvents = mysqlTable("booking_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  clubId: int("club_id").references(() => clubs.id), // Nullable - only for club-specific events
  isAssociationEvent: boolean("is_association_event").default(false), // true for Journey/Association events
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  locationDetails: varchar("location_details", { length: 255 }), // Additional location context
  latitude: decimal("latitude", { precision: 9, scale: 6 }),
  longitude: decimal("longitude", { precision: 9, scale: 6 }),
  duration: varchar("duration", { length: 100 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  eventDate: timestamp("event_date"), // For club events compatibility
  price: int("price").notNull(),
  originalPrice: int("original_price"),
  rating: int("rating").default(5),
  reviewCount: int("review_count").default(0),
  category: varchar("category", { length: 100 }),
  languages: json("languages").default(sql`'["English"]'`),
  ageRange: varchar("age_range", { length: 100 }),
  minAge: int("min_age"), // Minimum age requirement
  groupSize: varchar("group_size", { length: 100 }),
  maxPeople: int("max_people"), // Maximum group size
  maxParticipants: int("max_participants"),
  currentParticipants: int("current_participants").default(0),
  cancellationPolicy: text("cancellation_policy"),
  images: json("images").default(sql`'[]'`),
  image: varchar("image", { length: 500 }), // Featured image (for club events compatibility)
  highlights: json("highlights").default(sql`'[]'`),
  included: json("included").default(sql`'[]'`),
  notIncluded: json("not_included").default(sql`'[]'`),
  schedule: json("schedule").default(sql`'[]'`),
  importantInfo: text("important_info"), // Important information/notes
  status: varchar("status", { length: 20 }).default("upcoming"), // upcoming, ongoing, completed, cancelled
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NOTE: club_events table has been merged into booking_events
// Temporary alias for backward compatibility during migration
export const clubEvents = bookingEvents;

// Club event participants - now references booking_events
export const eventParticipants = mysqlTable("event_participants", {
  id: serial().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  attended: boolean("attended").default(false),
});

// Events-Clubs junction table - allows events to be associated with multiple clubs
export const eventsClubs = mysqlTable("events_clubs", {
  id: serial().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  clubId: int("club_id").references(() => clubs.id).notNull(),
  isPrimaryClub: boolean("is_primary_club").default(false), // Marks the main organizing club
  createdAt: timestamp("created_at").defaultNow(),
});

// Event gallery - stores multiple images for event carousel
export const eventGallery = mysqlTable("event_gallery", {
  id: serial().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event schedule - stores day-by-day itinerary for multi-day events
export const eventSchedule = mysqlTable("event_schedule", {
  id: serial().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  dayNumber: int("day_number").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event reviews - stores user reviews and ratings for events
export const eventReviews = mysqlTable("event_reviews", {
  id: serial().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  userName: varchar("user_name", { length: 255 }),
  rating: int("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event prices - stores dynamic pricing based on number of travelers
export const eventPrices = mysqlTable("event_prices", {
  id: serial().primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  travelers: int("travelers").notNull(),
  pricePerPerson: decimal("price_per_person", { precision: 10, scale: 2 }).notNull(),
});

// Club gallery/images
export const clubGallery = mysqlTable("club_gallery", {
  id: serial().primaryKey(),
  clubId: int("club_id").references(() => clubs.id).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Club reviews/testimonials
export const clubReviews = mysqlTable("club_reviews", {
  id: serial().primaryKey(),
  clubId: int("club_id").references(() => clubs.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking tickets table - stores customer bookings for booking events
export const bookingTickets = mysqlTable("booking_tickets", {
  id: serial().primaryKey(),
  bookingReference: varchar("booking_reference", { length: 50 }).unique().notNull(),
  eventId: varchar("event_id", { length: 255 }).references(() => bookingEvents.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  numberOfParticipants: int("number_of_participants").notNull().default(1),
  eventDate: timestamp("event_date").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  specialRequests: text("special_requests"),
  status: varchar("status", { length: 20 }).default("pending"),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts / News table
export const blogPosts = mysqlTable("blog_posts", {
  id: serial().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: varchar("category", { length: 100 }),
  tags: json("tags").default(sql`'[]'`),
  featuredImage: varchar("featured_image", { length: 500 }),
  status: varchar("status", { length: 20 }).default("draft"),
  views: int("views").default(0),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Booking page settings table
export const bookingPageSettings = mysqlTable("booking_page_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  headerBackgroundImage: varchar("header_background_image", { length: 500 }),
  footerText: text("footer_text"),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  enableReviews: boolean("enable_reviews").default(true),
  enableSimilarEvents: boolean("enable_similar_events").default(true),
  enableImageGallery: boolean("enable_image_gallery").default(true),
  maxParticipants: int("max_participants").default(25),
  minimumBookingHours: int("minimum_booking_hours").default(24),
  customCss: text("custom_css"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Tables for Landing Page Management

// Theme settings table - stores global theme colors and styling
export const themeSettings = mysqlTable("theme_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#112250"),
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#D8C18D"),
  customCss: text("custom_css"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media assets table - stores uploaded images and videos
export const mediaAssets = mysqlTable("media_assets", {
  id: serial().primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
  altText: varchar("alt_text", { length: 500 }),
  focalPoint: json("focal_point"),
  metadata: json("metadata").default(sql`'{}'`),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Navbar settings table - stores navigation bar configuration
export const navbarSettings = mysqlTable("navbar_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  logoType: varchar("logo_type", { length: 20 }).default("image"),
  logoImageId: int("logo_image_id").references(() => mediaAssets.id),
  logoSvg: text("logo_svg"),
  logoText: varchar("logo_text", { length: 255 }),
  logoSize: int("logo_size").default(135),
  logoLink: varchar("logo_link", { length: 500 }).default("/"),
  navigationLinks: json("navigation_links").default(sql`'[]'`),
  showLanguageSwitcher: boolean("show_language_switcher").default(true),
  availableLanguages: json("available_languages").default(sql`'["EN","FR","AR"]'`),
  showDarkModeToggle: boolean("show_dark_mode_toggle").default(true),
  loginButtonText: varchar("login_button_text", { length: 100 }).default("Login"),
  loginButtonLink: varchar("login_button_link", { length: 500 }).default("/admin/login"),
  showLoginButton: boolean("show_login_button").default(true),
  joinButtonText: varchar("join_button_text", { length: 100 }).default("Join Us"),
  joinButtonLink: varchar("join_button_link", { length: 500 }).default("/join"),
  joinButtonStyle: varchar("join_button_style", { length: 50 }).default("secondary"),
  showJoinButton: boolean("show_join_button").default(true),
  backgroundColor: varchar("background_color", { length: 50 }).default("#112250"),
  textColor: varchar("text_color", { length: 50 }).default("#ffffff"),
  hoverColor: varchar("hover_color", { length: 50 }).default("#D8C18D"),
  fontFamily: varchar("font_family", { length: 100 }).default("Inter"),
  fontSize: varchar("font_size", { length: 50 }).default("14px"),
  isSticky: boolean("is_sticky").default(true),
  isTransparent: boolean("is_transparent").default(false),
  transparentBg: varchar("transparent_bg", { length: 50 }).default("rgba(0,0,0,0.3)"),
  scrolledBg: varchar("scrolled_bg", { length: 50 }).default("#112250"),
  height: int("height").default(80),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hero settings table - stores hero section configuration
export const heroSettings = mysqlTable("hero_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  title: text("title").notNull().default("Where Adventure Meets\nTransformation"),
  subtitle: text("subtitle").notNull().default("Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities."),
  primaryButtonText: varchar("primary_button_text", { length: 100 }).default("Start Your Journey"),
  primaryButtonLink: varchar("primary_button_link", { length: 500 }).default("/discover"),
  secondaryButtonText: varchar("secondary_button_text", { length: 100 }).default("Explore Clubs"),
  secondaryButtonLink: varchar("secondary_button_link", { length: 500 }).default("/clubs"),
  backgroundType: varchar("background_type", { length: 20 }).default("image"),
  backgroundMediaId: int("background_media_id").references(() => mediaAssets.id),
  backgroundOverlayColor: varchar("background_overlay_color", { length: 50 }).default("rgba(26, 54, 93, 0.7)"),
  backgroundOverlayOpacity: int("background_overlay_opacity").default(70),
  titleFontSize: varchar("title_font_size", { length: 50 }).default("65px"),
  titleColor: varchar("title_color", { length: 50 }).default("#ffffff"),
  subtitleFontSize: varchar("subtitle_font_size", { length: 50 }).default("20px"),
  subtitleColor: varchar("subtitle_color", { length: 50 }).default("#ffffff"),
  enableTypewriter: boolean("enable_typewriter").default(true),
  typewriterTexts: json("typewriter_texts").default(sql`'[]'`),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing page sections table - stores all sections configuration
export const landingSections = mysqlTable("landing_sections", {
  id: serial().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  sectionType: varchar("section_type", { length: 50 }).notNull(),
  ordering: int("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  backgroundColor: varchar("background_color", { length: 50 }),
  backgroundMediaId: int("background_media_id").references(() => mediaAssets.id),
  titleFontSize: varchar("title_font_size", { length: 50 }).default("32px"),
  titleColor: varchar("title_color", { length: 50 }).default("#112250"),
  customCss: text("custom_css"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Section blocks table - stores dynamic content for each section
export const sectionBlocks = mysqlTable("section_blocks", {
  id: serial().primaryKey(),
  sectionId: int("section_id").references(() => landingSections.id).notNull(),
  blockType: varchar("block_type", { length: 50 }).notNull(),
  ordering: int("ordering").default(0).notNull(),
  content: json("content").default(sql`'{}'`).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Focus items table - for "Our Focus" section
export const focusItems = mysqlTable("focus_items", {
  id: serial().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  description: text("description").notNull(),
  ordering: int("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  mediaId: int("media_id").references(() => mediaAssets.id),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members table - for "Our Team" section
export const teamMembers = mysqlTable("team_members", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  bio: text("bio"),
  photoId: int("photo_id").references(() => mediaAssets.id),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  socialLinks: json("social_links").default(sql`'{}'`),
  ordering: int("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing testimonials table - general testimonials for the site
export const landingTestimonials = mysqlTable("landing_testimonials", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  photoId: int("photo_id").references(() => mediaAssets.id),
  rating: int("rating").default(5),
  feedback: text("feedback").notNull(),
  isApproved: boolean("is_approved").default(false),
  isActive: boolean("is_active").default(true),
  ordering: int("ordering").default(0).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stats/footprint table - for metrics display
export const siteStats = mysqlTable("site_stats", {
  id: serial().primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  suffix: varchar("suffix", { length: 20 }),
  ordering: int("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact settings table - for contact information
export const contactSettings = mysqlTable("contact_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  officeAddress: text("office_address"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  officeHours: text("office_hours"),
  mapLatitude: decimal("map_latitude", { precision: 9, scale: 6 }),
  mapLongitude: decimal("map_longitude", { precision: 9, scale: 6 }),
  formRecipients: json("form_recipients").default(sql`'[]'`),
  autoReplyEnabled: boolean("auto_reply_enabled").default(false),
  autoReplyMessage: text("auto_reply_message"),
  socialLinks: json("social_links").default(sql`'{}'`),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Footer settings table - for footer content
export const footerSettings = mysqlTable("footer_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  copyrightText: varchar("copyright_text", { length: 500 }),
  description: text("description"),
  links: json("links").default(sql`'[]'`),
  socialLinks: json("social_links").default(sql`'{}'`),
  newsletterEnabled: boolean("newsletter_enabled").default(true),
  newsletterTitle: varchar("newsletter_title", { length: 255 }),
  newsletterDescription: text("newsletter_description"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SEO settings table - for meta tags and SEO
export const seoSettings = mysqlTable("seo_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  siteTitle: varchar("site_title", { length: 255 }),
  siteDescription: text("site_description"),
  keywords: text("keywords"),
  ogImage: int("og_image").references(() => mediaAssets.id),
  twitterHandle: varchar("twitter_handle", { length: 100 }),
  googleAnalyticsId: varchar("google_analytics_id", { length: 100 }),
  facebookPixelId: varchar("facebook_pixel_id", { length: 100 }),
  customHeadCode: text("custom_head_code"),
  customBodyCode: text("custom_body_code"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// About section settings table
export const aboutSettings = mysqlTable("about_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  isActive: boolean("is_active").default(true),
  title: varchar("title", { length: 255 }).default("About Us"),
  subtitle: text("subtitle"),
  description: text("description").notNull(),
  imageId: int("image_id").references(() => mediaAssets.id),
  backgroundImageId: int("background_image_id").references(() => mediaAssets.id),
  backgroundColor: varchar("background_color", { length: 50 }),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// President message settings table
export const presidentMessageSettings = mysqlTable("president_message_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  isActive: boolean("is_active").default(true),
  title: varchar("title", { length: 255 }).default("A word from the president"),
  presidentName: varchar("president_name", { length: 255 }).default("Dr. Aderahim Azrkan"),
  presidentRole: varchar("president_role", { length: 255 }).default("President, The Journey Association"),
  message: text("message").default(""),
  quote: text("quote"),
  photoId: int("photo_id").references(() => mediaAssets.id),
  signatureId: int("signature_id").references(() => mediaAssets.id),
  backgroundImageId: int("background_image_id").references(() => mediaAssets.id),
  backgroundColor: varchar("background_color", { length: 50 }).default("#112250"),
  backgroundGradient: varchar("background_gradient", { length: 255 }).default("linear-gradient(180deg, #112250 0%, #1a3366 100%)"),
  // Typography & Colors
  titleFontFamily: varchar("title_font_family", { length: 100 }).default("Poppins"),
  titleFontSize: varchar("title_font_size", { length: 50 }).default("48px"),
  titleColor: varchar("title_color", { length: 50 }).default("#ffffff"),
  titleAlignment: varchar("title_alignment", { length: 20 }).default("left"),
  nameFontFamily: varchar("name_font_family", { length: 100 }).default("Poppins"),
  nameFontSize: varchar("name_font_size", { length: 50 }).default("28px"),
  nameColor: varchar("name_color", { length: 50 }).default("#ffffff"),
  roleFontFamily: varchar("role_font_family", { length: 100 }).default("Poppins"),
  roleFontSize: varchar("role_font_size", { length: 50 }).default("18px"),
  roleColor: varchar("role_color", { length: 50 }).default("#D8C18D"),
  messageFontFamily: varchar("message_font_family", { length: 100 }).default("Poppins"),
  messageFontSize: varchar("message_font_size", { length: 50 }).default("16px"),
  messageColor: varchar("message_color", { length: 50 }).default("#ffffff"),
  quoteColor: varchar("quote_color", { length: 50 }).default("#D8C18D"),
  quoteFontSize: varchar("quote_font_size", { length: 50 }).default("18px"),
  // Layout & Positioning
  imagePosition: varchar("image_position", { length: 20 }).default("left"),
  imageAlignment: varchar("image_alignment", { length: 20 }).default("center"),
  imageWidth: varchar("image_width", { length: 50 }).default("42%"),
  sectionPadding: varchar("section_padding", { length: 50 }).default("80px 0"),
  contentGap: varchar("content_gap", { length: 50 }).default("48px"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners settings table
export const partnerSettings = mysqlTable("partner_settings", {
  id: varchar("id", { length: 255 }).primaryKey().default("default"),
  isActive: boolean("is_active").default(true),
  title: varchar("title", { length: 255 }).default("Our Partners"),
  subtitle: text("subtitle"),
  backgroundColor: varchar("background_color", { length: 50 }),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners table - individual partner entries
export const partners = mysqlTable("partners", {
  id: serial().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoId: int("logo_id").references(() => mediaAssets.id),
  websiteUrl: varchar("website_url", { length: 500 }),
  description: text("description"),
  ordering: int("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedClubs: many(clubs),
  memberships: many(clubMemberships),
  eventParticipations: many(eventParticipants),
  reviews: many(clubReviews),
  uploadedImages: many(clubGallery),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  owner: one(users, {
    fields: [clubs.ownerId],
    references: [users.id],
  }),
  memberships: many(clubMemberships),
  events: many(clubEvents),
  gallery: many(clubGallery),
  reviews: many(clubReviews),
}));

export const clubMembershipsRelations = relations(clubMemberships, ({ one }) => ({
  user: one(users, {
    fields: [clubMemberships.userId],
    references: [users.id],
  }),
  club: one(clubs, {
    fields: [clubMemberships.clubId],
    references: [clubs.id],
  }),
}));

export const clubEventsRelations = relations(clubEvents, ({ one, many }) => ({
  club: one(clubs, {
    fields: [clubEvents.clubId],
    references: [clubs.id],
  }),
  creator: one(users, {
    fields: [clubEvents.createdBy],
    references: [users.id],
  }),
  participants: many(eventParticipants),
  gallery: many(eventGallery),
  schedule: many(eventSchedule),
  reviews: many(eventReviews),
  prices: many(eventPrices),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(clubEvents, {
    fields: [eventParticipants.eventId],
    references: [clubEvents.id],
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id],
  }),
}));

export const eventGalleryRelations = relations(eventGallery, ({ one }) => ({
  event: one(clubEvents, {
    fields: [eventGallery.eventId],
    references: [clubEvents.id],
  }),
}));

export const eventScheduleRelations = relations(eventSchedule, ({ one }) => ({
  event: one(clubEvents, {
    fields: [eventSchedule.eventId],
    references: [clubEvents.id],
  }),
}));

export const eventReviewsRelations = relations(eventReviews, ({ one }) => ({
  event: one(clubEvents, {
    fields: [eventReviews.eventId],
    references: [clubEvents.id],
  }),
}));

export const eventPricesRelations = relations(eventPrices, ({ one }) => ({
  event: one(clubEvents, {
    fields: [eventPrices.eventId],
    references: [clubEvents.id],
  }),
}));

export const clubGalleryRelations = relations(clubGallery, ({ one }) => ({
  club: one(clubs, {
    fields: [clubGallery.clubId],
    references: [clubs.id],
  }),
  uploader: one(users, {
    fields: [clubGallery.uploadedBy],
    references: [users.id],
  }),
}));

export const clubReviewsRelations = relations(clubReviews, ({ one }) => ({
  club: one(clubs, {
    fields: [clubReviews.clubId],
    references: [clubs.id],
  }),
  user: one(users, {
    fields: [clubReviews.userId],
    references: [users.id],
  }),
}));

export const bookingEventsRelations = relations(bookingEvents, ({ one, many }) => ({
  creator: one(users, {
    fields: [bookingEvents.createdBy],
    references: [users.id],
  }),
  tickets: many(bookingTickets),
}));

export const bookingTicketsRelations = relations(bookingTickets, ({ one }) => ({
  event: one(bookingEvents, {
    fields: [bookingTickets.eventId],
    references: [bookingEvents.id],
  }),
  user: one(users, {
    fields: [bookingTickets.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;
export type ClubMembership = typeof clubMemberships.$inferSelect;
export type ClubEvent = typeof clubEvents.$inferSelect;
export type InsertClubEvent = typeof clubEvents.$inferInsert;
export type EventsClub = typeof eventsClubs.$inferSelect;
export type InsertEventsClub = typeof eventsClubs.$inferInsert;
export type BookingEvent = typeof bookingEvents.$inferSelect;
export type InsertBookingEvent = typeof bookingEvents.$inferInsert;
export type BookingPageSettings = typeof bookingPageSettings.$inferSelect;
export type InsertBookingPageSettings = typeof bookingPageSettings.$inferInsert;
export type ThemeSettings = typeof themeSettings.$inferSelect;
export type InsertThemeSettings = typeof themeSettings.$inferInsert;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;
export type HeroSettings = typeof heroSettings.$inferSelect;
export type InsertHeroSettings = typeof heroSettings.$inferInsert;
export type LandingSection = typeof landingSections.$inferSelect;
export type InsertLandingSection = typeof landingSections.$inferInsert;
export type SectionBlock = typeof sectionBlocks.$inferSelect;
export type InsertSectionBlock = typeof sectionBlocks.$inferInsert;
export type FocusItem = typeof focusItems.$inferSelect;
export type InsertFocusItem = typeof focusItems.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
export type LandingTestimonial = typeof landingTestimonials.$inferSelect;
export type InsertLandingTestimonial = typeof landingTestimonials.$inferInsert;
export type SiteStat = typeof siteStats.$inferSelect;
export type InsertSiteStat = typeof siteStats.$inferInsert;
export type ContactSettings = typeof contactSettings.$inferSelect;
export type InsertContactSettings = typeof contactSettings.$inferInsert;
export type NavbarSettings = typeof navbarSettings.$inferSelect;
export type InsertNavbarSettings = typeof navbarSettings.$inferInsert;
export type FooterSettings = typeof footerSettings.$inferSelect;
export type InsertFooterSettings = typeof footerSettings.$inferInsert;
export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertSeoSettings = typeof seoSettings.$inferInsert;
export type AboutSettings = typeof aboutSettings.$inferSelect;
export type InsertAboutSettings = typeof aboutSettings.$inferInsert;
export type PresidentMessageSettings = typeof presidentMessageSettings.$inferSelect;
export type InsertPresidentMessageSettings = typeof presidentMessageSettings.$inferInsert;
export type PartnerSettings = typeof partnerSettings.$inferSelect;
export type InsertPartnerSettings = typeof partnerSettings.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type BookingTicket = typeof bookingTickets.$inferSelect;
export type InsertBookingTicket = typeof bookingTickets.$inferInsert;