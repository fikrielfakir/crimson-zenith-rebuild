import {
  users,
  clubs,
  clubMemberships,
  clubEvents,
  clubGallery,
  clubReviews,
  bookingEvents,
  bookingPageSettings,
  themeSettings,
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
  type ThemeSettings,
  type InsertThemeSettings,
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
  
  // CMS operations
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

  // CMS operations
  async getHeroSettings(): Promise<HeroSettings | undefined> {
    const [settings] = await db.select().from(heroSettings).where(eq(heroSettings.id, 'default'));
    return settings;
  }

  async updateHeroSettings(settingsData: Partial<InsertHeroSettings>, userId?: string): Promise<HeroSettings> {
    const existing = await this.getHeroSettings();
    
    if (existing) {
      const [settings] = await db
        .update(heroSettings)
        .set({ ...settingsData, updatedBy: userId, updatedAt: new Date() })
        .where(eq(heroSettings.id, 'default'))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(heroSettings)
        .values({ ...settingsData, id: 'default', updatedBy: userId } as InsertHeroSettings)
        .returning();
      return settings;
    }
  }

  async getThemeSettings(): Promise<ThemeSettings | undefined> {
    const [settings] = await db.select().from(themeSettings).where(eq(themeSettings.id, 'default'));
    return settings;
  }

  async updateThemeSettings(settingsData: Partial<InsertThemeSettings>, userId?: string): Promise<ThemeSettings> {
    const existing = await this.getThemeSettings();
    
    if (existing) {
      const [settings] = await db
        .update(themeSettings)
        .set({ ...settingsData, updatedBy: userId, updatedAt: new Date() })
        .where(eq(themeSettings.id, 'default'))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(themeSettings)
        .values({ ...settingsData, id: 'default', updatedBy: userId } as InsertThemeSettings)
        .returning();
      return settings;
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
    const [asset] = await db.insert(mediaAssets).values(assetData).returning();
    return asset;
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
    const [section] = await db.insert(landingSections).values(sectionData).returning();
    return section;
  }

  async updateLandingSection(id: number, sectionData: Partial<InsertLandingSection>, userId?: string): Promise<LandingSection> {
    const [section] = await db
      .update(landingSections)
      .set({ ...sectionData, updatedBy: userId, updatedAt: new Date() })
      .where(eq(landingSections.id, id))
      .returning();
    return section;
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
    const [block] = await db.insert(sectionBlocks).values(blockData).returning();
    return block;
  }

  async updateSectionBlock(id: number, blockData: Partial<InsertSectionBlock>): Promise<SectionBlock> {
    const [block] = await db
      .update(sectionBlocks)
      .set({ ...blockData, updatedAt: new Date() })
      .where(eq(sectionBlocks.id, id))
      .returning();
    return block;
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
    const [item] = await db.insert(focusItems).values(itemData).returning();
    return item;
  }

  async updateFocusItem(id: number, itemData: Partial<InsertFocusItem>): Promise<FocusItem> {
    const [item] = await db
      .update(focusItems)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(focusItems.id, id))
      .returning();
    return item;
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
    const [member] = await db.insert(teamMembers).values(memberData).returning();
    return member;
  }

  async updateTeamMember(id: number, memberData: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [member] = await db
      .update(teamMembers)
      .set({ ...memberData, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
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
    const [testimonial] = await db.insert(landingTestimonials).values(testimonialData).returning();
    return testimonial;
  }

  async updateLandingTestimonial(id: number, testimonialData: Partial<InsertLandingTestimonial>): Promise<LandingTestimonial> {
    const [testimonial] = await db
      .update(landingTestimonials)
      .set({ ...testimonialData, updatedAt: new Date() })
      .where(eq(landingTestimonials.id, id))
      .returning();
    return testimonial;
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
    const [stat] = await db.insert(siteStats).values(statData).returning();
    return stat;
  }

  async updateSiteStat(id: number, statData: Partial<InsertSiteStat>): Promise<SiteStat> {
    const [stat] = await db
      .update(siteStats)
      .set({ ...statData, updatedAt: new Date() })
      .where(eq(siteStats.id, id))
      .returning();
    return stat;
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
      const [settings] = await db
        .update(contactSettings)
        .set({ ...settingsData, updatedBy: userId, updatedAt: new Date() })
        .where(eq(contactSettings.id, 'default'))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(contactSettings)
        .values({ ...settingsData, id: 'default', updatedBy: userId } as InsertContactSettings)
        .returning();
      return settings;
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
      const [settings] = await db
        .update(footerSettings)
        .set({ ...settingsData, updatedBy: userId, updatedAt: new Date() })
        .where(eq(footerSettings.id, 'default'))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(footerSettings)
        .values({ ...settingsData, id: 'default', updatedBy: userId } as InsertFooterSettings)
        .returning();
      return settings;
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
      const [settings] = await db
        .update(seoSettings)
        .set({ ...settingsData, updatedBy: userId, updatedAt: new Date() })
        .where(eq(seoSettings.id, 'default'))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(seoSettings)
        .values({ ...settingsData, id: 'default', updatedBy: userId } as InsertSeoSettings)
        .returning();
      return settings;
    }
  }
}

// Export the storage instance
export const storage = new DatabaseStorage();