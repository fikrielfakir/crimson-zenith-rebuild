import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  phone: varchar("phone"),
  location: varchar("location"),
  interests: jsonb("interests").default(sql`'[]'::jsonb`),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clubs table with enhanced profile information
export const clubs = pgTable("clubs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  image: varchar("image", { length: 500 }),
  location: varchar("location", { length: 255 }).notNull(),
  memberCount: integer("member_count").default(0),
  features: jsonb("features").default(sql`'[]'::jsonb`),
  contactPhone: varchar("contact_phone"),
  contactEmail: varchar("contact_email"),
  website: varchar("website"),
  socialMedia: jsonb("social_media").default(sql`'{}'::jsonb`),
  rating: integer("rating").default(5),
  established: varchar("established"),
  isActive: boolean("is_active").default(true),
  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  ownerId: varchar("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Club memberships
export const clubMemberships = pgTable("club_memberships", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  role: varchar("role", { length: 50 }).default("member"), // member, moderator, admin
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Club events
export const clubEvents = pgTable("club_events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location", { length: 255 }),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  status: varchar("status", { length: 20 }).default("upcoming"), // upcoming, ongoing, completed, cancelled
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Club event participants
export const eventParticipants = pgTable("event_participants", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  eventId: integer("event_id").references(() => clubEvents.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  attended: boolean("attended").default(false),
});

// Club gallery/images
export const clubGallery = pgTable("club_gallery", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Club reviews/testimonials
export const clubReviews = pgTable("club_reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clubId: integer("club_id").references(() => clubs.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking events table - for customizable bookable events
export const bookingEvents = pgTable("booking_events", {
  id: varchar("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  rating: integer("rating").default(5),
  reviewCount: integer("review_count").default(0),
  category: varchar("category", { length: 100 }),
  languages: jsonb("languages").default(sql`'["English"]'::jsonb`),
  ageRange: varchar("age_range", { length: 100 }),
  groupSize: varchar("group_size", { length: 100 }),
  cancellationPolicy: text("cancellation_policy"),
  images: jsonb("images").default(sql`'[]'::jsonb`),
  highlights: jsonb("highlights").default(sql`'[]'::jsonb`),
  included: jsonb("included").default(sql`'[]'::jsonb`),
  notIncluded: jsonb("not_included").default(sql`'[]'::jsonb`),
  schedule: jsonb("schedule").default(sql`'[]'::jsonb`),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Booking page settings table
export const bookingPageSettings = pgTable("booking_page_settings", {
  id: varchar("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  headerBackgroundImage: varchar("header_background_image", { length: 500 }),
  footerText: text("footer_text"),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  enableReviews: boolean("enable_reviews").default(true),
  enableSimilarEvents: boolean("enable_similar_events").default(true),
  enableImageGallery: boolean("enable_image_gallery").default(true),
  maxParticipants: integer("max_participants").default(25),
  minimumBookingHours: integer("minimum_booking_hours").default(24),
  customCss: text("custom_css"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CMS Tables for Landing Page Management

// Theme settings table - stores global theme colors and styling
export const themeSettings = pgTable("theme_settings", {
  id: varchar("id").primaryKey().default("default"),
  primaryColor: varchar("primary_color", { length: 7 }).default("#112250"),
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#D8C18D"),
  customCss: text("custom_css"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media assets table - stores uploaded images and videos
export const mediaAssets = pgTable("media_assets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
  altText: varchar("alt_text", { length: 500 }),
  focalPoint: jsonb("focal_point"),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hero settings table - stores hero section configuration
export const heroSettings = pgTable("hero_settings", {
  id: varchar("id").primaryKey().default("default"),
  title: text("title").notNull().default("Where Adventure Meets\nTransformation"),
  subtitle: text("subtitle").notNull().default("Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities."),
  primaryButtonText: varchar("primary_button_text", { length: 100 }).default("Start Your Journey"),
  primaryButtonLink: varchar("primary_button_link", { length: 500 }).default("/discover"),
  secondaryButtonText: varchar("secondary_button_text", { length: 100 }).default("Explore Clubs"),
  secondaryButtonLink: varchar("secondary_button_link", { length: 500 }).default("/clubs"),
  backgroundType: varchar("background_type", { length: 20 }).default("image"),
  backgroundMediaId: integer("background_media_id").references(() => mediaAssets.id),
  backgroundOverlayColor: varchar("background_overlay_color", { length: 20 }).default("rgba(26, 54, 93, 0.7)"),
  backgroundOverlayOpacity: integer("background_overlay_opacity").default(70),
  titleFontSize: varchar("title_font_size", { length: 20 }).default("65px"),
  titleColor: varchar("title_color", { length: 20 }).default("#ffffff"),
  subtitleFontSize: varchar("subtitle_font_size", { length: 20 }).default("20px"),
  subtitleColor: varchar("subtitle_color", { length: 20 }).default("#ffffff"),
  enableTypewriter: boolean("enable_typewriter").default(true),
  typewriterTexts: jsonb("typewriter_texts").default(sql`'[]'::jsonb`),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing page sections table - stores all sections configuration
export const landingSections = pgTable("landing_sections", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  sectionType: varchar("section_type", { length: 50 }).notNull(),
  ordering: integer("ordering").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  backgroundColor: varchar("background_color", { length: 20 }),
  backgroundMediaId: integer("background_media_id").references(() => mediaAssets.id),
  titleFontSize: varchar("title_font_size", { length: 20 }).default("32px"),
  titleColor: varchar("title_color", { length: 20 }).default("#112250"),
  customCss: text("custom_css"),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Section blocks table - stores dynamic content for each section
export const sectionBlocks = pgTable("section_blocks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sectionId: integer("section_id").references(() => landingSections.id).notNull(),
  blockType: varchar("block_type", { length: 50 }).notNull(),
  ordering: integer("ordering").default(0).notNull(),
  content: jsonb("content").default(sql`'{}'::jsonb`).notNull(),
  isActive: boolean("is_active").default(true),
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

export const bookingEventsRelations = relations(bookingEvents, ({ one }) => ({
  creator: one(users, {
    fields: [bookingEvents.createdBy],
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