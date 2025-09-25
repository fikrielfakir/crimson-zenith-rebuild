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

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;
export type ClubMembership = typeof clubMemberships.$inferSelect;
export type ClubEvent = typeof clubEvents.$inferSelect;
export type InsertClubEvent = typeof clubEvents.$inferInsert;