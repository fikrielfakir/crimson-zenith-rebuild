import {
  users,
  clubs,
  clubMemberships,
  clubEvents,
  clubGallery,
  clubReviews,
  bookingEvents,
  bookingPageSettings,
  type User,
  type UpsertUser,
  type Club,
  type InsertClub,
  type ClubMembership,
  type ClubEvent,
  type InsertClubEvent,
  type BookingEvent,
  type InsertBookingEvent,
  type BookingPageSettings,
  type InsertBookingPageSettings,
} from "../shared/schema.js";
import { db } from "./db";
import { eq, and, desc, asc, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Club operations
  getClubs(): Promise<Club[]>;
  getClub(id: number): Promise<Club | undefined>;
  getClubByName(name: string): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, club: Partial<InsertClub>): Promise<Club>;
  deleteClub(id: number): Promise<void>;
  
  // Club membership operations
  joinClub(userId: string, clubId: number): Promise<ClubMembership>;
  leaveClub(userId: string, clubId: number): Promise<void>;
  getUserClubMemberships(userId: string): Promise<ClubMembership[]>;
  getClubMembers(clubId: number): Promise<ClubMembership[]>;
  isClubMember(userId: string, clubId: number): Promise<boolean>;
  
  // Club event operations
  getClubEvents(clubId: number): Promise<ClubEvent[]>;
  getUpcomingClubEvents(clubId: number): Promise<ClubEvent[]>;
  createClubEvent(event: InsertClubEvent): Promise<ClubEvent>;
  
  // Club gallery operations
  getClubGallery(clubId: number): Promise<any[]>;
  addClubImage(clubId: number, imageUrl: string, caption?: string, uploadedBy?: string): Promise<any>;
  
  // Booking event operations
  getBookingEvents(): Promise<BookingEvent[]>;
  getBookingEvent(id: string): Promise<BookingEvent | undefined>;
  createBookingEvent(event: InsertBookingEvent): Promise<BookingEvent>;
  updateBookingEvent(id: string, event: Partial<InsertBookingEvent>): Promise<BookingEvent>;
  deleteBookingEvent(id: string): Promise<void>;
  
  // Booking page settings operations
  getBookingPageSettings(): Promise<BookingPageSettings | undefined>;
  updateBookingPageSettings(settings: InsertBookingPageSettings): Promise<BookingPageSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Club operations
  async getClubs(): Promise<Club[]> {
    return await db.select().from(clubs).where(eq(clubs.isActive, true)).orderBy(asc(clubs.name));
  }

  async getClub(id: number): Promise<Club | undefined> {
    const [club] = await db.select().from(clubs).where(and(eq(clubs.id, id), eq(clubs.isActive, true)));
    return club;
  }

  async getClubByName(name: string): Promise<Club | undefined> {
    const [club] = await db.select().from(clubs).where(and(eq(clubs.name, name), eq(clubs.isActive, true)));
    return club;
  }

  async createClub(clubData: InsertClub): Promise<Club> {
    const [club] = await db.insert(clubs).values(clubData).returning();
    return club;
  }

  async updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
    const [club] = await db
      .update(clubs)
      .set({ ...clubData, updatedAt: new Date() })
      .where(eq(clubs.id, id))
      .returning();
    return club;
  }

  async deleteClub(id: number): Promise<void> {
    await db.update(clubs).set({ isActive: false }).where(eq(clubs.id, id));
  }

  // Club membership operations
  async joinClub(userId: string, clubId: number): Promise<ClubMembership> {
    return await db.transaction(async (tx) => {
      // Check if already a member
      const existing = await tx
        .select()
        .from(clubMemberships)
        .where(and(eq(clubMemberships.userId, userId), eq(clubMemberships.clubId, clubId)))
        .limit(1);
      
      let membership: ClubMembership;
      
      if (existing.length > 0) {
        // Reactivate membership if inactive
        const [reactivatedMembership] = await tx
          .update(clubMemberships)
          .set({ isActive: true })
          .where(eq(clubMemberships.id, existing[0].id))
          .returning();
        membership = reactivatedMembership;
      } else {
        // Create new membership
        const [newMembership] = await tx
          .insert(clubMemberships)
          .values({ userId, clubId, role: 'member' })
          .returning();
        membership = newMembership;
      }

      // Update club member count with proper count query
      const [memberCountResult] = await tx
        .select({ count: count() })
        .from(clubMemberships)
        .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.isActive, true)));

      await tx
        .update(clubs)
        .set({ memberCount: memberCountResult.count })
        .where(eq(clubs.id, clubId));

      return membership;
    });
  }

  async leaveClub(userId: string, clubId: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Deactivate membership
      await tx
        .update(clubMemberships)
        .set({ isActive: false })
        .where(and(eq(clubMemberships.userId, userId), eq(clubMemberships.clubId, clubId)));

      // Update club member count with proper count query
      const [memberCountResult] = await tx
        .select({ count: count() })
        .from(clubMemberships)
        .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.isActive, true)));

      await tx
        .update(clubs)
        .set({ memberCount: memberCountResult.count })
        .where(eq(clubs.id, clubId));
    });
  }

  async getUserClubMemberships(userId: string): Promise<ClubMembership[]> {
    return await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.userId, userId), eq(clubMemberships.isActive, true)));
  }

  async getClubMembers(clubId: number): Promise<ClubMembership[]> {
    return await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.isActive, true)));
  }

  async isClubMember(userId: string, clubId: number): Promise<boolean> {
    const [membership] = await db
      .select()
      .from(clubMemberships)
      .where(and(
        eq(clubMemberships.userId, userId), 
        eq(clubMemberships.clubId, clubId),
        eq(clubMemberships.isActive, true)
      ))
      .limit(1);
    return !!membership;
  }

  // Club event operations
  async getClubEvents(clubId: number): Promise<ClubEvent[]> {
    return await db
      .select()
      .from(clubEvents)
      .where(eq(clubEvents.clubId, clubId))
      .orderBy(desc(clubEvents.eventDate));
  }

  async getUpcomingClubEvents(clubId: number): Promise<ClubEvent[]> {
    return await db
      .select()
      .from(clubEvents)
      .where(and(eq(clubEvents.clubId, clubId), eq(clubEvents.status, 'upcoming')))
      .orderBy(asc(clubEvents.eventDate));
  }

  async createClubEvent(eventData: InsertClubEvent): Promise<ClubEvent> {
    const [event] = await db.insert(clubEvents).values(eventData).returning();
    return event;
  }

  // Club gallery operations
  async getClubGallery(clubId: number): Promise<any[]> {
    return await db
      .select()
      .from(clubGallery)
      .where(eq(clubGallery.clubId, clubId))
      .orderBy(desc(clubGallery.uploadedAt));
  }

  async addClubImage(clubId: number, imageUrl: string, caption?: string, uploadedBy?: string): Promise<any> {
    const [image] = await db
      .insert(clubGallery)
      .values({ clubId, imageUrl, caption, uploadedBy })
      .returning();
    return image;
  }

  // Booking event operations
  async getBookingEvents(): Promise<BookingEvent[]> {
    return await db
      .select()
      .from(bookingEvents)
      .orderBy(desc(bookingEvents.createdAt));
  }

  async getBookingEvent(id: string): Promise<BookingEvent | undefined> {
    const [event] = await db
      .select()
      .from(bookingEvents)
      .where(eq(bookingEvents.id, id));
    return event;
  }

  async createBookingEvent(eventData: InsertBookingEvent): Promise<BookingEvent> {
    const [event] = await db.insert(bookingEvents).values(eventData).returning();
    return event;
  }

  async updateBookingEvent(id: string, eventData: Partial<InsertBookingEvent>): Promise<BookingEvent> {
    const [event] = await db
      .update(bookingEvents)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(bookingEvents.id, id))
      .returning();
    return event;
  }

  async deleteBookingEvent(id: string): Promise<void> {
    await db.delete(bookingEvents).where(eq(bookingEvents.id, id));
  }

  // Booking page settings operations
  async getBookingPageSettings(): Promise<BookingPageSettings | undefined> {
    const [settings] = await db
      .select()
      .from(bookingPageSettings)
      .where(eq(bookingPageSettings.id, 'booking-page-settings'));
    return settings;
  }

  async updateBookingPageSettings(settingsData: InsertBookingPageSettings): Promise<BookingPageSettings> {
    const existingSettings = await this.getBookingPageSettings();
    
    if (existingSettings) {
      const [settings] = await db
        .update(bookingPageSettings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(bookingPageSettings.id, 'booking-page-settings'))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(bookingPageSettings)
        .values({ ...settingsData, id: 'booking-page-settings' })
        .returning();
      return settings;
    }
  }
}

// Export the storage instance
export const storage = new DatabaseStorage();