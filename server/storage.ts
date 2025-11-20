import {
  users,
  clubs,
  clubMemberships,
  clubEvents,
  eventGallery,
  eventSchedule,
  eventReviews,
  eventPrices,
  clubGallery,
  clubReviews,
  bookingEvents,
  bookingTickets,
  bookingPageSettings,
  themeSettings,
  navbarSettings,
  heroSettings,
  mediaAssets,
  landingSections,
  sectionBlocks,
  focusItems,
  teamMembers,
  landingTestimonials,
  siteStats,
  contactSettings,
  footerSettings,
  seoSettings,
  aboutSettings,
  presidentMessageSettings,
  partnerSettings,
  partners,
  type User,
  type UpsertUser,
  type Club,
  type InsertClub,
  type ClubMembership,
  type ClubEvent,
  type InsertClubEvent,
  type BookingEvent,
  type InsertBookingEvent,
  type BookingTicket,
  type InsertBookingTicket,
  type BookingPageSettings,
  type InsertBookingPageSettings,
  type ThemeSettings,
  type InsertThemeSettings,
  type NavbarSettings,
  type InsertNavbarSettings,
  type HeroSettings,
  type InsertHeroSettings,
  type MediaAsset,
  type InsertMediaAsset,
  type LandingSection,
  type InsertLandingSection,
  type SectionBlock,
  type InsertSectionBlock,
  type FocusItem,
  type InsertFocusItem,
  type TeamMember,
  type InsertTeamMember,
  type LandingTestimonial,
  type InsertLandingTestimonial,
  type SiteStat,
  type InsertSiteStat,
  type ContactSettings,
  type InsertContactSettings,
  type FooterSettings,
  type InsertFooterSettings,
  type SeoSettings,
  type InsertSeoSettings,
  type AboutSettings,
  type InsertAboutSettings,
  type PresidentMessageSettings,
  type InsertPresidentMessageSettings,
  type PartnerSettings,
  type InsertPartnerSettings,
  type Partner,
  type InsertPartner,
} from "../shared/schema.js";
import { db } from "./db";
import { eq, and, desc, asc, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Club operations
  getClubs(): Promise<Club[]>;
  getClub(id: number): Promise<Club | undefined>;
  getClubByName(name: string): Promise<Club | undefined>;
  getClubBySlug(slug: string): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, club: Partial<InsertClub>): Promise<Club>;
  deleteClub(id: number): Promise<void>;
  
  // Club membership operations
  joinClub(userId: string, clubId: number): Promise<ClubMembership>;
  leaveClub(userId: string, clubId: number): Promise<void>;
  getUserClubMemberships(userId: string): Promise<ClubMembership[]>;
  getClubMembers(clubId: number): Promise<ClubMembership[]>;
  isClubMember(userId: string, clubId: number): Promise<boolean>;
  
  // Event operations (unified - now uses booking_events for all events)
  getClubEvents(clubId: number): Promise<BookingEvent[]>;
  getUpcomingClubEvents(clubId: number): Promise<BookingEvent[]>;
  getAssociationEvents(): Promise<BookingEvent[]>; // Get Journey/Association events
  getUpcomingAssociationEvents(): Promise<BookingEvent[]>; // Get upcoming Journey/Association events
  getAllEvents(): Promise<BookingEvent[]>; // Get all events (for admin)
  getEvent(id: string): Promise<BookingEvent | undefined>; // Get single event by ID
  createClubEvent(event: InsertBookingEvent): Promise<BookingEvent>;
  updateClubEvent(id: string, event: Partial<InsertBookingEvent>): Promise<BookingEvent>;
  deleteClubEvent(id: string): Promise<void>;
  
  // Event gallery operations
  getEventGallery(eventId: string): Promise<any[]>;
  addEventImage(eventId: string, imageUrl: string, sortOrder?: number): Promise<any>;
  deleteEventImage(id: number): Promise<void>;
  
  // Event schedule operations
  getEventSchedule(eventId: string): Promise<any[]>;
  addEventScheduleDay(eventId: string, dayNumber: number, title: string, description?: string): Promise<any>;
  updateEventScheduleDay(id: number, data: any): Promise<any>;
  deleteEventScheduleDay(id: number): Promise<void>;
  
  // Event reviews operations
  getEventReviews(eventId: string): Promise<any[]>;
  addEventReview(eventId: string, userName: string, rating: number, review?: string): Promise<any>;
  deleteEventReview(id: number): Promise<void>;
  
  // Event prices operations
  getEventPrices(eventId: string): Promise<any[]>;
  addEventPrice(eventId: string, travelers: number, pricePerPerson: number): Promise<any>;
  updateEventPrice(id: number, data: any): Promise<any>;
  deleteEventPrice(id: number): Promise<void>;
  
  // Club gallery operations
  getClubGallery(clubId: number): Promise<any[]>;
  addClubImage(clubId: number, imageUrl: string, caption?: string, uploadedBy?: string): Promise<any>;
  
  // Booking event operations (now serves all event types)
  getBookingEvents(): Promise<BookingEvent[]>;
  getBookingEvent(id: string): Promise<BookingEvent | undefined>;
  createBookingEvent(event: InsertBookingEvent): Promise<BookingEvent>;
  updateBookingEvent(id: string, event: Partial<InsertBookingEvent>): Promise<BookingEvent>;
  deleteBookingEvent(id: string): Promise<void>;
  
  // Booking ticket operations
  createBookingTicket(ticket: InsertBookingTicket): Promise<BookingTicket>;
  getBookingTicket(bookingReference: string): Promise<BookingTicket | undefined>;
  getBookingTickets(): Promise<BookingTicket[]>;
  getUserBookingTickets(userId: string): Promise<BookingTicket[]>;
  getEventBookingTickets(eventId: string): Promise<BookingTicket[]>;
  updateBookingTicketStatus(bookingReference: string, status: string, additionalData?: any): Promise<BookingTicket>;
  
  // Booking page settings operations
  getBookingPageSettings(): Promise<BookingPageSettings | undefined>;
  updateBookingPageSettings(settings: InsertBookingPageSettings): Promise<BookingPageSettings>;
  
  // CMS operations
  getNavbarSettings(): Promise<NavbarSettings | undefined>;
  updateNavbarSettings(settings: Partial<InsertNavbarSettings>, userId?: string): Promise<NavbarSettings>;
  
  getHeroSettings(): Promise<HeroSettings | undefined>;
  updateHeroSettings(settings: Partial<InsertHeroSettings>, userId?: string): Promise<HeroSettings>;
  
  getThemeSettings(): Promise<ThemeSettings | undefined>;
  updateThemeSettings(settings: Partial<InsertThemeSettings>, userId?: string): Promise<ThemeSettings>;
  
  getMediaAssets(): Promise<MediaAsset[]>;
  getMediaAsset(id: number): Promise<MediaAsset | undefined>;
  createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset>;
  deleteMediaAsset(id: number): Promise<void>;
  
  getLandingSections(): Promise<LandingSection[]>;
  getLandingSection(id: number): Promise<LandingSection | undefined>;
  createLandingSection(section: InsertLandingSection): Promise<LandingSection>;
  updateLandingSection(id: number, section: Partial<InsertLandingSection>, userId?: string): Promise<LandingSection>;
  deleteLandingSection(id: number): Promise<void>;
  
  getSectionBlocks(sectionId: number): Promise<SectionBlock[]>;
  createSectionBlock(block: InsertSectionBlock): Promise<SectionBlock>;
  updateSectionBlock(id: number, block: Partial<InsertSectionBlock>): Promise<SectionBlock>;
  deleteSectionBlock(id: number): Promise<void>;
  
  // Focus items operations
  getFocusItems(): Promise<FocusItem[]>;
  getFocusItem(id: number): Promise<FocusItem | undefined>;
  createFocusItem(item: InsertFocusItem): Promise<FocusItem>;
  updateFocusItem(id: number, item: Partial<InsertFocusItem>): Promise<FocusItem>;
  deleteFocusItem(id: number): Promise<void>;
  
  // Team members operations
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  
  // Landing testimonials operations
  getLandingTestimonials(): Promise<LandingTestimonial[]>;
  getLandingTestimonial(id: number): Promise<LandingTestimonial | undefined>;
  createLandingTestimonial(testimonial: InsertLandingTestimonial): Promise<LandingTestimonial>;
  updateLandingTestimonial(id: number, testimonial: Partial<InsertLandingTestimonial>): Promise<LandingTestimonial>;
  deleteLandingTestimonial(id: number): Promise<void>;
  
  // Site stats operations
  getSiteStats(): Promise<SiteStat[]>;
  getSiteStat(id: number): Promise<SiteStat | undefined>;
  createSiteStat(stat: InsertSiteStat): Promise<SiteStat>;
  updateSiteStat(id: number, stat: Partial<InsertSiteStat>): Promise<SiteStat>;
  deleteSiteStat(id: number): Promise<void>;
  
  // Contact settings operations
  getContactSettings(): Promise<ContactSettings | undefined>;
  updateContactSettings(settings: Partial<InsertContactSettings>, userId?: string): Promise<ContactSettings>;
  
  // Footer settings operations
  getFooterSettings(): Promise<FooterSettings | undefined>;
  updateFooterSettings(settings: Partial<InsertFooterSettings>, userId?: string): Promise<FooterSettings>;
  
  // SEO settings operations
  getSeoSettings(): Promise<SeoSettings | undefined>;
  updateSeoSettings(settings: Partial<InsertSeoSettings>, userId?: string): Promise<SeoSettings>;
  
  // About settings operations
  getAboutSettings(): Promise<AboutSettings | undefined>;
  updateAboutSettings(settings: Partial<InsertAboutSettings>, userId?: string): Promise<AboutSettings>;
  
  // President message settings operations
  getPresidentMessageSettings(): Promise<PresidentMessageSettings | undefined>;
  updatePresidentMessageSettings(settings: Partial<InsertPresidentMessageSettings>, userId?: string): Promise<PresidentMessageSettings>;
  
  // Partner settings operations
  getPartnerSettings(): Promise<PartnerSettings | undefined>;
  updatePartnerSettings(settings: Partial<InsertPartnerSettings>, userId?: string): Promise<PartnerSettings>;
  
  // Partners operations
  getPartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner>;
  deletePartner(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Helper functions for PostgreSQL (uses .returning() support)
  
  // Insert and fetch - handles both auto-increment IDs and user-provided IDs (including strings)
  private async insertAndFetch<T extends { id: number | string }>(
    table: any,
    values: any,
    dbOrTx: any = db
  ): Promise<T> {
    // PostgreSQL supports RETURNING clause
    const [result] = await dbOrTx.insert(table).values(values).returning();
    return result as T;
  }
  
  // Update and fetch using primary key
  private async updateAndFetch<T extends { id: number | string }>(
    table: any,
    id: number | string,
    values: any,
    dbOrTx: any = db
  ): Promise<T> {
    await dbOrTx.update(table).set(values).where(eq(table.id, id));
    const [record] = await dbOrTx.select().from(table).where(eq(table.id, id));
    return record as T;
  }

  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    
    // Check if user exists
    const existingUser = userData.id ? await this.getUser(userData.id) : null;
    
    if (existingUser) {
      // Update existing user
      const updateData: Partial<UpsertUser> = {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        bio: userData.bio,
        phone: userData.phone,
        location: userData.location,
        interests: userData.interests,
        isAdmin: userData.isAdmin,
        updatedAt: now,
      };
      
      // Only update password if provided
      if (userData.password) {
        updateData.password = userData.password;
      }
      
      await db.update(users)
        .set(updateData)
        .where(eq(users.id, userData.id!));
      
      // Fetch and return updated user
      const updated = await this.getUser(userData.id!);
      if (!updated) throw new Error('User not found after update');
      return updated;
    } else {
      // Insert new user
      const insertData: UpsertUser = {
        id: userData.id,
        username: userData.username,
        password: userData.password || '',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        bio: userData.bio,
        phone: userData.phone,
        location: userData.location,
        interests: userData.interests,
        isAdmin: userData.isAdmin,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await db.insert(users).values(insertData);
      const insertId = userData.id || (result as any).insertId;
      
      const newUser = await this.getUser(insertId);
      if (!newUser) throw new Error('User not found after insert');
      return newUser;
    }
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

  async getClubBySlug(slug: string): Promise<Club | undefined> {
    const [club] = await db.select().from(clubs).where(and(eq(clubs.slug, slug), eq(clubs.isActive, true)));
    return club;
  }

  async createClub(clubData: InsertClub): Promise<Club> {
    return await this.insertAndFetch<Club>(clubs, clubData);
  }

  async updateClub(id: number, clubData: Partial<InsertClub>): Promise<Club> {
    return await this.updateAndFetch<Club>(clubs, id, { ...clubData, updatedAt: new Date() });
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
        membership = await this.updateAndFetch<ClubMembership>(
          clubMemberships,
          existing[0].id,
          { isActive: true },
          tx
        );
      } else {
        // Create new membership
        membership = await this.insertAndFetch<ClubMembership>(
          clubMemberships,
          { userId, clubId, role: 'member' },
          tx
        );
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

  // Event operations (now using unified bookingEvents table)
  async getClubEvents(clubId: number): Promise<BookingEvent[]> {
    return await db
      .select()
      .from(bookingEvents)
      .where(and(
        eq(bookingEvents.clubId, clubId),
        eq(bookingEvents.isAssociationEvent, false)
      ))
      .orderBy(desc(bookingEvents.eventDate));
  }

  async getUpcomingClubEvents(clubId: number): Promise<BookingEvent[]> {
    return await db
      .select()
      .from(bookingEvents)
      .where(and(
        eq(bookingEvents.clubId, clubId),
        eq(bookingEvents.isAssociationEvent, false),
        eq(bookingEvents.status, 'upcoming')
      ))
      .orderBy(asc(bookingEvents.eventDate));
  }

  async getAssociationEvents(): Promise<BookingEvent[]> {
    return await db
      .select()
      .from(bookingEvents)
      .where(eq(bookingEvents.isAssociationEvent, true))
      .orderBy(desc(bookingEvents.eventDate));
  }

  async getUpcomingAssociationEvents(): Promise<BookingEvent[]> {
    return await db
      .select()
      .from(bookingEvents)
      .where(and(
        eq(bookingEvents.isAssociationEvent, true),
        eq(bookingEvents.status, 'upcoming')
      ))
      .orderBy(asc(bookingEvents.eventDate));
  }

  async getAllEvents(): Promise<BookingEvent[]> {
    return await db
      .select()
      .from(bookingEvents)
      .orderBy(desc(bookingEvents.eventDate));
  }

  async getEvent(id: string): Promise<BookingEvent | undefined> {
    const [event] = await db
      .select()
      .from(bookingEvents)
      .where(eq(bookingEvents.id, id))
      .limit(1);
    return event;
  }

  async createClubEvent(eventData: InsertBookingEvent): Promise<BookingEvent> {
    // Generate a unique ID for the event
    const id = eventData.id || `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return await this.insertAndFetch<BookingEvent>(bookingEvents, { ...eventData, id });
  }

  async updateClubEvent(id: string, eventData: Partial<InsertBookingEvent>): Promise<BookingEvent> {
    return await this.updateAndFetch<BookingEvent>(bookingEvents, id, { ...eventData, updatedAt: new Date() });
  }

  async deleteClubEvent(id: string): Promise<void> {
    await db.delete(bookingEvents).where(eq(bookingEvents.id, id));
  }

  // Event gallery operations
  async getEventGallery(eventId: string): Promise<any[]> {
    return await db
      .select()
      .from(eventGallery)
      .where(eq(eventGallery.eventId, eventId))
      .orderBy(asc(eventGallery.sortOrder));
  }

  async addEventImage(eventId: string, imageUrl: string, sortOrder: number = 0): Promise<any> {
    return await this.insertAndFetch<any>(eventGallery, { eventId, imageUrl, sortOrder });
  }

  async deleteEventImage(id: number): Promise<void> {
    await db.delete(eventGallery).where(eq(eventGallery.id, id));
  }

  // Event schedule operations
  async getEventSchedule(eventId: string): Promise<any[]> {
    return await db
      .select()
      .from(eventSchedule)
      .where(eq(eventSchedule.eventId, eventId))
      .orderBy(asc(eventSchedule.dayNumber));
  }

  async addEventScheduleDay(eventId: string, dayNumber: number, title: string, description?: string): Promise<any> {
    return await this.insertAndFetch<any>(eventSchedule, { eventId, dayNumber, title, description });
  }

  async updateEventScheduleDay(id: number, data: any): Promise<any> {
    return await this.updateAndFetch<any>(eventSchedule, id, data);
  }

  async deleteEventScheduleDay(id: number): Promise<void> {
    await db.delete(eventSchedule).where(eq(eventSchedule.id, id));
  }

  // Event reviews operations
  async getEventReviews(eventId: string): Promise<any[]> {
    return await db
      .select()
      .from(eventReviews)
      .where(eq(eventReviews.eventId, eventId))
      .orderBy(desc(eventReviews.createdAt));
  }

  async addEventReview(eventId: string, userName: string, rating: number, review?: string): Promise<any> {
    return await this.insertAndFetch<any>(eventReviews, { eventId, userName, rating, review });
  }

  async deleteEventReview(id: number): Promise<void> {
    await db.delete(eventReviews).where(eq(eventReviews.id, id));
  }

  // Event prices operations
  async getEventPrices(eventId: string): Promise<any[]> {
    return await db
      .select()
      .from(eventPrices)
      .where(eq(eventPrices.eventId, eventId))
      .orderBy(asc(eventPrices.travelers));
  }

  async addEventPrice(eventId: string, travelers: number, pricePerPerson: number): Promise<any> {
    return await this.insertAndFetch<any>(eventPrices, { eventId, travelers, pricePerPerson });
  }

  async updateEventPrice(id: number, data: any): Promise<any> {
    return await this.updateAndFetch<any>(eventPrices, id, data);
  }

  async deleteEventPrice(id: number): Promise<void> {
    await db.delete(eventPrices).where(eq(eventPrices.id, id));
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
    return await this.insertAndFetch<any>(clubGallery, { clubId, imageUrl, caption, uploadedBy });
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
    return await this.insertAndFetch<BookingEvent>(bookingEvents, eventData);
  }

  async updateBookingEvent(id: string, eventData: Partial<InsertBookingEvent>): Promise<BookingEvent> {
    return await this.updateAndFetch<BookingEvent>(bookingEvents, id, { ...eventData, updatedAt: new Date() });
  }

  async deleteBookingEvent(id: string): Promise<void> {
    await db.delete(bookingEvents).where(eq(bookingEvents.id, id));
  }

  // Booking ticket operations
  async createBookingTicket(ticketData: InsertBookingTicket): Promise<BookingTicket> {
    const bookingReference = `BKG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return await this.insertAndFetch<BookingTicket>(bookingTickets, {
      ...ticketData,
      bookingReference,
    });
  }

  async getBookingTicket(bookingReference: string): Promise<BookingTicket | undefined> {
    const [ticket] = await db
      .select()
      .from(bookingTickets)
      .where(eq(bookingTickets.bookingReference, bookingReference));
    return ticket;
  }

  async getBookingTickets(): Promise<BookingTicket[]> {
    return await db
      .select()
      .from(bookingTickets)
      .orderBy(desc(bookingTickets.createdAt));
  }

  async getUserBookingTickets(userId: string): Promise<BookingTicket[]> {
    return await db
      .select()
      .from(bookingTickets)
      .where(eq(bookingTickets.userId, userId))
      .orderBy(desc(bookingTickets.createdAt));
  }

  async getEventBookingTickets(eventId: string): Promise<BookingTicket[]> {
    return await db
      .select()
      .from(bookingTickets)
      .where(eq(bookingTickets.eventId, eventId))
      .orderBy(desc(bookingTickets.createdAt));
  }

  async updateBookingTicketStatus(bookingReference: string, status: string, additionalData?: any): Promise<BookingTicket> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (status === 'confirmed') {
      updateData.confirmedAt = new Date();
      updateData.paymentStatus = 'completed';
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      if (additionalData?.cancellationReason) {
        updateData.cancellationReason = additionalData.cancellationReason;
      }
    }
    
    if (additionalData?.paymentMethod) {
      updateData.paymentMethod = additionalData.paymentMethod;
    }
    if (additionalData?.transactionId) {
      updateData.transactionId = additionalData.transactionId;
    }
    
    // Update the ticket using bookingReference
    const updated = await db
      .update(bookingTickets)
      .set(updateData)
      .where(eq(bookingTickets.bookingReference, bookingReference))
      .returning();
    
    if (!updated || updated.length === 0) {
      throw new Error(`Booking ticket not found: ${bookingReference}`);
    }
    
    return updated[0];
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
      return await this.updateAndFetch<BookingPageSettings>(
        bookingPageSettings,
        'booking-page-settings',
        { ...settingsData, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<BookingPageSettings>(
        bookingPageSettings,
        { ...settingsData, id: 'booking-page-settings' }
      );
    }
  }

  // CMS operations
  async getNavbarSettings(): Promise<NavbarSettings | undefined> {
    const [settings] = await db.select().from(navbarSettings).where(eq(navbarSettings.id, 'default'));
    return settings;
  }

  async updateNavbarSettings(settingsData: Partial<InsertNavbarSettings>, userId?: string): Promise<NavbarSettings> {
    if (settingsData.navigationLinks !== undefined && settingsData.navigationLinks !== null) {
      if (!Array.isArray(settingsData.navigationLinks)) {
        throw new Error('Navigation links must be an array');
      }
      
      for (let i = 0; i < settingsData.navigationLinks.length; i++) {
        const link = settingsData.navigationLinks[i];
        
        if (!link || typeof link !== 'object' || Array.isArray(link)) {
          throw new Error(`Navigation link at index ${i} must be an object`);
        }
        
        if (!link.label || typeof link.label !== 'string' || !link.label.trim()) {
          throw new Error(`Navigation link at index ${i} must have a valid label`);
        }
        
        if (!link.url || typeof link.url !== 'string' || !link.url.trim()) {
          throw new Error(`Navigation link at index ${i} must have a valid URL`);
        }
      }
    }

    const existing = await this.getNavbarSettings();
    
    if (existing) {
      return await this.updateAndFetch<NavbarSettings>(
        navbarSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<NavbarSettings>(
        navbarSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertNavbarSettings
      );
    }
  }

  async getHeroSettings(): Promise<HeroSettings | undefined> {
    const [settings] = await db.select().from(heroSettings).where(eq(heroSettings.id, 'default'));
    return settings;
  }

  async updateHeroSettings(settingsData: Partial<InsertHeroSettings>, userId?: string): Promise<HeroSettings> {
    const existing = await this.getHeroSettings();
    
    if (existing) {
      return await this.updateAndFetch<HeroSettings>(
        heroSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<HeroSettings>(
        heroSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertHeroSettings
      );
    }
  }

  async getThemeSettings(): Promise<ThemeSettings | undefined> {
    const [settings] = await db.select().from(themeSettings).where(eq(themeSettings.id, 'default'));
    return settings;
  }

  async updateThemeSettings(settingsData: Partial<InsertThemeSettings>, userId?: string): Promise<ThemeSettings> {
    const existing = await this.getThemeSettings();
    
    if (existing) {
      return await this.updateAndFetch<ThemeSettings>(
        themeSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<ThemeSettings>(
        themeSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertThemeSettings
      );
    }
  }

  async getMediaAssets(): Promise<MediaAsset[]> {
    return await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
  }

  async getMediaAsset(id: number): Promise<MediaAsset | undefined> {
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
    return asset;
  }

  async createMediaAsset(assetData: InsertMediaAsset): Promise<MediaAsset> {
    return await this.insertAndFetch<MediaAsset>(mediaAssets, assetData);
  }

  async deleteMediaAsset(id: number): Promise<void> {
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  }

  async getLandingSections(): Promise<LandingSection[]> {
    return await db.select().from(landingSections).where(eq(landingSections.isActive, true)).orderBy(asc(landingSections.ordering));
  }

  async getLandingSection(id: number): Promise<LandingSection | undefined> {
    const [section] = await db.select().from(landingSections).where(eq(landingSections.id, id));
    return section;
  }

  async createLandingSection(sectionData: InsertLandingSection): Promise<LandingSection> {
    return await this.insertAndFetch<LandingSection>(landingSections, sectionData);
  }

  async updateLandingSection(id: number, sectionData: Partial<InsertLandingSection>, userId?: string): Promise<LandingSection> {
    return await this.updateAndFetch<LandingSection>(
      landingSections,
      id,
      { ...sectionData, updatedBy: userId, updatedAt: new Date() }
    );
  }

  async deleteLandingSection(id: number): Promise<void> {
    await db.update(landingSections).set({ isActive: false }).where(eq(landingSections.id, id));
  }

  async getSectionBlocks(sectionId: number): Promise<SectionBlock[]> {
    return await db
      .select()
      .from(sectionBlocks)
      .where(and(eq(sectionBlocks.sectionId, sectionId), eq(sectionBlocks.isActive, true)))
      .orderBy(asc(sectionBlocks.ordering));
  }

  async createSectionBlock(blockData: InsertSectionBlock): Promise<SectionBlock> {
    return await this.insertAndFetch<SectionBlock>(sectionBlocks, blockData);
  }

  async updateSectionBlock(id: number, blockData: Partial<InsertSectionBlock>): Promise<SectionBlock> {
    return await this.updateAndFetch<SectionBlock>(
      sectionBlocks,
      id,
      { ...blockData, updatedAt: new Date() }
    );
  }

  async deleteSectionBlock(id: number): Promise<void> {
    await db.update(sectionBlocks).set({ isActive: false }).where(eq(sectionBlocks.id, id));
  }

  // Focus items operations
  async getFocusItems(): Promise<FocusItem[]> {
    return await db.select().from(focusItems).where(eq(focusItems.isActive, true)).orderBy(asc(focusItems.ordering));
  }

  async getFocusItem(id: number): Promise<FocusItem | undefined> {
    const [item] = await db.select().from(focusItems).where(eq(focusItems.id, id));
    return item;
  }

  async createFocusItem(itemData: InsertFocusItem): Promise<FocusItem> {
    return await this.insertAndFetch<FocusItem>(focusItems, itemData);
  }

  async updateFocusItem(id: number, itemData: Partial<InsertFocusItem>): Promise<FocusItem> {
    return await this.updateAndFetch<FocusItem>(
      focusItems,
      id,
      { ...itemData, updatedAt: new Date() }
    );
  }

  async deleteFocusItem(id: number): Promise<void> {
    await db.update(focusItems).set({ isActive: false }).where(eq(focusItems.id, id));
  }

  // Team members operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.ordering));
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(memberData: InsertTeamMember): Promise<TeamMember> {
    return await this.insertAndFetch<TeamMember>(teamMembers, memberData);
  }

  async updateTeamMember(id: number, memberData: Partial<InsertTeamMember>): Promise<TeamMember> {
    return await this.updateAndFetch<TeamMember>(
      teamMembers,
      id,
      { ...memberData, updatedAt: new Date() }
    );
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, id));
  }

  // Landing testimonials operations
  async getLandingTestimonials(): Promise<LandingTestimonial[]> {
    return await db.select().from(landingTestimonials).where(and(eq(landingTestimonials.isActive, true), eq(landingTestimonials.isApproved, true))).orderBy(asc(landingTestimonials.ordering));
  }

  async getLandingTestimonial(id: number): Promise<LandingTestimonial | undefined> {
    const [testimonial] = await db.select().from(landingTestimonials).where(eq(landingTestimonials.id, id));
    return testimonial;
  }

  async createLandingTestimonial(testimonialData: InsertLandingTestimonial): Promise<LandingTestimonial> {
    return await this.insertAndFetch<LandingTestimonial>(landingTestimonials, testimonialData);
  }

  async updateLandingTestimonial(id: number, testimonialData: Partial<InsertLandingTestimonial>): Promise<LandingTestimonial> {
    return await this.updateAndFetch<LandingTestimonial>(
      landingTestimonials,
      id,
      { ...testimonialData, updatedAt: new Date() }
    );
  }

  async deleteLandingTestimonial(id: number): Promise<void> {
    await db.update(landingTestimonials).set({ isActive: false }).where(eq(landingTestimonials.id, id));
  }

  // Site stats operations
  async getSiteStats(): Promise<SiteStat[]> {
    return await db.select().from(siteStats).where(eq(siteStats.isActive, true)).orderBy(asc(siteStats.ordering));
  }

  async getSiteStat(id: number): Promise<SiteStat | undefined> {
    const [stat] = await db.select().from(siteStats).where(eq(siteStats.id, id));
    return stat;
  }

  async createSiteStat(statData: InsertSiteStat): Promise<SiteStat> {
    return await this.insertAndFetch<SiteStat>(siteStats, statData);
  }

  async updateSiteStat(id: number, statData: Partial<InsertSiteStat>): Promise<SiteStat> {
    return await this.updateAndFetch<SiteStat>(
      siteStats,
      id,
      { ...statData, updatedAt: new Date() }
    );
  }

  async deleteSiteStat(id: number): Promise<void> {
    await db.update(siteStats).set({ isActive: false }).where(eq(siteStats.id, id));
  }

  // Contact settings operations
  async getContactSettings(): Promise<ContactSettings | undefined> {
    const [settings] = await db.select().from(contactSettings).where(eq(contactSettings.id, 'default'));
    return settings;
  }

  async updateContactSettings(settingsData: Partial<InsertContactSettings>, userId?: string): Promise<ContactSettings> {
    const existing = await this.getContactSettings();
    
    if (existing) {
      return await this.updateAndFetch<ContactSettings>(
        contactSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<ContactSettings>(
        contactSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertContactSettings
      );
    }
  }

  // Footer settings operations
  async getFooterSettings(): Promise<FooterSettings | undefined> {
    const [settings] = await db.select().from(footerSettings).where(eq(footerSettings.id, 'default'));
    return settings;
  }

  async updateFooterSettings(settingsData: Partial<InsertFooterSettings>, userId?: string): Promise<FooterSettings> {
    const existing = await this.getFooterSettings();
    
    if (existing) {
      return await this.updateAndFetch<FooterSettings>(
        footerSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<FooterSettings>(
        footerSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertFooterSettings
      );
    }
  }

  // SEO settings operations
  async getSeoSettings(): Promise<SeoSettings | undefined> {
    const [settings] = await db.select().from(seoSettings).where(eq(seoSettings.id, 'default'));
    return settings;
  }

  async updateSeoSettings(settingsData: Partial<InsertSeoSettings>, userId?: string): Promise<SeoSettings> {
    const existing = await this.getSeoSettings();
    
    if (existing) {
      return await this.updateAndFetch<SeoSettings>(
        seoSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<SeoSettings>(
        seoSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertSeoSettings
      );
    }
  }

  // About settings operations
  async getAboutSettings(): Promise<AboutSettings | undefined> {
    const [settings] = await db.select().from(aboutSettings).where(eq(aboutSettings.id, 'default'));
    return settings;
  }

  async updateAboutSettings(settingsData: Partial<InsertAboutSettings>, userId?: string): Promise<AboutSettings> {
    const existing = await this.getAboutSettings();
    
    if (existing) {
      return await this.updateAndFetch<AboutSettings>(
        aboutSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<AboutSettings>(
        aboutSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertAboutSettings
      );
    }
  }

  // President message settings operations
  async getPresidentMessageSettings(): Promise<PresidentMessageSettings | undefined> {
    const [settings] = await db.select().from(presidentMessageSettings).where(eq(presidentMessageSettings.id, 'default'));
    return settings;
  }

  async updatePresidentMessageSettings(settingsData: Partial<InsertPresidentMessageSettings>, userId?: string): Promise<PresidentMessageSettings> {
    const existing = await this.getPresidentMessageSettings();
    
    if (existing) {
      return await this.updateAndFetch<PresidentMessageSettings>(
        presidentMessageSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<PresidentMessageSettings>(
        presidentMessageSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertPresidentMessageSettings
      );
    }
  }

  // Partner settings operations
  async getPartnerSettings(): Promise<PartnerSettings | undefined> {
    const [settings] = await db.select().from(partnerSettings).where(eq(partnerSettings.id, 'default'));
    return settings;
  }

  async updatePartnerSettings(settingsData: Partial<InsertPartnerSettings>, userId?: string): Promise<PartnerSettings> {
    const existing = await this.getPartnerSettings();
    
    if (existing) {
      return await this.updateAndFetch<PartnerSettings>(
        partnerSettings,
        'default',
        { ...settingsData, updatedBy: userId, updatedAt: new Date() }
      );
    } else {
      return await this.insertAndFetch<PartnerSettings>(
        partnerSettings,
        { ...settingsData, id: 'default', updatedBy: userId } as InsertPartnerSettings
      );
    }
  }

  // Partners operations
  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partners).where(eq(partners.isActive, true)).orderBy(asc(partners.ordering));
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }

  async createPartner(partnerData: InsertPartner): Promise<Partner> {
    return await this.insertAndFetch<Partner>(partners, partnerData);
  }

  async updatePartner(id: number, partnerData: Partial<InsertPartner>): Promise<Partner> {
    return await this.updateAndFetch<Partner>(partners, id, { ...partnerData, updatedAt: new Date() });
  }

  async deletePartner(id: number): Promise<void> {
    await db.delete(partners).where(eq(partners.id, id));
  }
}

// Export the storage instance
export const storage = new DatabaseStorage();