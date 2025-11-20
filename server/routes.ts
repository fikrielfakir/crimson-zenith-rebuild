import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Admin middleware
const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user;
    
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Map configuration endpoint - returns MapTiler style URL (server-side only)
  app.get('/api/config/map-style', async (req, res) => {
    try {
      const apiKey = process.env.MAPTILER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Map configuration not available" });
      }
      // Return the complete style URL, not the raw API key
      res.json({ 
        styleUrl: `https://api.maptiler.com/maps/satellite/style.json?key=${apiKey}`
      });
    } catch (error) {
      console.error("Error fetching map config:", error);
      res.status(500).json({ message: "Failed to fetch map configuration" });
    }
  });

  // User profile routes
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userData = req.body;
      const user = await storage.upsertUser({ id: userId, ...userData });
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Club routes
  app.get('/api/clubs', async (req, res) => {
    try {
      const clubs = await storage.getClubs();
      res.json(clubs);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ message: "Failed to fetch clubs" });
    }
  });

  app.get('/api/clubs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const club = await storage.getClub(id);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      console.error("Error fetching club:", error);
      res.status(500).json({ message: "Failed to fetch club" });
    }
  });

  // Get club-specific events (upcoming club events only)
  app.get('/api/clubs/:id/events', async (req, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const events = await storage.getUpcomingClubEvents(clubId);
      res.json({ events });
    } catch (error) {
      console.error("Error fetching club events:", error);
      res.status(500).json({ message: "Failed to fetch club events" });
    }
  });

  app.post('/api/clubs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const clubData = { ...req.body, ownerId: userId };
      const club = await storage.createClub(clubData);
      res.json(club);
    } catch (error) {
      console.error("Error creating club:", error);
      res.status(500).json({ message: "Failed to create club" });
    }
  });

  app.put('/api/clubs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if user owns the club or is admin
      const club = await storage.getClub(id);
      if (!club || (club.ownerId !== userId)) {
        return res.status(403).json({ message: "Permission denied" });
      }

      const updatedClub = await storage.updateClub(id, req.body);
      res.json(updatedClub);
    } catch (error) {
      console.error("Error updating club:", error);
      res.status(500).json({ message: "Failed to update club" });
    }
  });

  // Club membership routes
  app.post('/api/clubs/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const userId = req.user.id;
      const membership = await storage.joinClub(userId, clubId);
      res.json(membership);
    } catch (error) {
      console.error("Error joining club:", error);
      res.status(500).json({ message: "Failed to join club" });
    }
  });

  app.post('/api/clubs/:id/leave', isAuthenticated, async (req: any, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const userId = req.user.id;
      await storage.leaveClub(userId, clubId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error leaving club:", error);
      res.status(500).json({ message: "Failed to leave club" });
    }
  });

  app.get('/api/clubs/:id/membership', isAuthenticated, async (req: any, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const userId = req.user.id;
      const isMember = await storage.isClubMember(userId, clubId);
      res.json({ isMember });
    } catch (error) {
      console.error("Error checking membership:", error);
      res.status(500).json({ message: "Failed to check membership" });
    }
  });

  app.get('/api/user/clubs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const memberships = await storage.getUserClubMemberships(userId);
      res.json(memberships);
    } catch (error) {
      console.error("Error fetching user clubs:", error);
      res.status(500).json({ message: "Failed to fetch user clubs" });
    }
  });

  // Club Events Routes
  app.get('/api/clubs/:id/events', async (req, res) => {
    try {
      const clubId = parseInt(req.params.id);
      const events = await storage.getClubEvents(clubId);
      res.json({ events });
    } catch (error) {
      console.error("Error fetching club events:", error);
      res.status(500).json({ message: "Failed to fetch club events" });
    }
  });

  // Admin CMS Routes
  
  // Hero Settings
  app.get('/api/cms/hero', async (req, res) => {
    try {
      const settings = await storage.getHeroSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  app.put('/api/admin/cms/hero', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateHeroSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating hero settings:", error);
      res.status(500).json({ message: "Failed to update hero settings" });
    }
  });

  // Navbar Settings
  app.get('/api/cms/navbar', async (req, res) => {
    try {
      const settings = await storage.getNavbarSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching navbar settings:", error);
      res.status(500).json({ message: "Failed to fetch navbar settings" });
    }
  });

  app.put('/api/admin/cms/navbar', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateNavbarSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating navbar settings:", error);
      res.status(500).json({ message: "Failed to update navbar settings" });
    }
  });

  // Theme Settings
  app.get('/api/cms/theme', async (req, res) => {
    try {
      const settings = await storage.getThemeSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching theme settings:", error);
      res.status(500).json({ message: "Failed to fetch theme settings" });
    }
  });

  app.put('/api/admin/cms/theme', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateThemeSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating theme settings:", error);
      res.status(500).json({ message: "Failed to update theme settings" });
    }
  });

  // Media Assets
  app.get('/api/admin/cms/media', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const assets = await storage.getMediaAssets();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching media assets:", error);
      res.status(500).json({ message: "Failed to fetch media assets" });
    }
  });

  app.post('/api/admin/cms/media', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const asset = await storage.createMediaAsset({ ...req.body, uploadedBy: userId });
      res.json(asset);
    } catch (error) {
      console.error("Error creating media asset:", error);
      res.status(500).json({ message: "Failed to create media asset" });
    }
  });

  app.get('/api/admin/cms/media/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const asset = await storage.getMediaAsset(id);
      if (!asset) {
        return res.status(404).json({ message: "Media asset not found" });
      }
      res.json(asset);
    } catch (error) {
      console.error("Error fetching media asset:", error);
      res.status(500).json({ message: "Failed to fetch media asset" });
    }
  });

  app.delete('/api/admin/cms/media/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMediaAsset(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting media asset:", error);
      res.status(500).json({ message: "Failed to delete media asset" });
    }
  });

  // Landing Sections
  app.get('/api/cms/sections', async (req, res) => {
    try {
      const sections = await storage.getLandingSections();
      res.json(sections);
    } catch (error) {
      console.error("Error fetching landing sections:", error);
      res.status(500).json({ message: "Failed to fetch landing sections" });
    }
  });

  app.post('/api/admin/cms/sections', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const section = await storage.createLandingSection({ ...req.body, updatedBy: userId });
      res.json(section);
    } catch (error) {
      console.error("Error creating landing section:", error);
      res.status(500).json({ message: "Failed to create landing section" });
    }
  });

  app.put('/api/admin/cms/sections/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const section = await storage.updateLandingSection(id, req.body, userId);
      res.json(section);
    } catch (error) {
      console.error("Error updating landing section:", error);
      res.status(500).json({ message: "Failed to update landing section" });
    }
  });

  app.delete('/api/admin/cms/sections/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLandingSection(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting landing section:", error);
      res.status(500).json({ message: "Failed to delete landing section" });
    }
  });

  // Section Blocks
  app.get('/api/cms/sections/:id/blocks', async (req, res) => {
    try {
      const sectionId = parseInt(req.params.id);
      const blocks = await storage.getSectionBlocks(sectionId);
      res.json(blocks);
    } catch (error) {
      console.error("Error fetching section blocks:", error);
      res.status(500).json({ message: "Failed to fetch section blocks" });
    }
  });

  app.post('/api/admin/cms/blocks', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const block = await storage.createSectionBlock(req.body);
      res.json(block);
    } catch (error) {
      console.error("Error creating section block:", error);
      res.status(500).json({ message: "Failed to create section block" });
    }
  });

  app.put('/api/admin/cms/blocks/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const block = await storage.updateSectionBlock(id, req.body);
      res.json(block);
    } catch (error) {
      console.error("Error updating section block:", error);
      res.status(500).json({ message: "Failed to update section block" });
    }
  });

  app.delete('/api/admin/cms/blocks/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSectionBlock(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting section block:", error);
      res.status(500).json({ message: "Failed to delete section block" });
    }
  });

  // Focus Items
  app.get('/api/cms/focus-items', async (req, res) => {
    try {
      const items = await storage.getFocusItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching focus items:", error);
      res.status(500).json({ message: "Failed to fetch focus items" });
    }
  });

  app.get('/api/cms/focus-items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getFocusItem(id);
      if (!item) {
        return res.status(404).json({ message: "Focus item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching focus item:", error);
      res.status(500).json({ message: "Failed to fetch focus item" });
    }
  });

  app.post('/api/admin/cms/focus-items', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const item = await storage.createFocusItem(req.body);
      res.json(item);
    } catch (error) {
      console.error("Error creating focus item:", error);
      res.status(500).json({ message: "Failed to create focus item" });
    }
  });

  app.put('/api/admin/cms/focus-items/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateFocusItem(id, req.body);
      res.json(item);
    } catch (error) {
      console.error("Error updating focus item:", error);
      res.status(500).json({ message: "Failed to update focus item" });
    }
  });

  app.delete('/api/admin/cms/focus-items/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFocusItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting focus item:", error);
      res.status(500).json({ message: "Failed to delete focus item" });
    }
  });

  // Team Members
  app.get('/api/cms/team-members', async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get('/api/cms/team-members/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getTeamMember(id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching team member:", error);
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  app.post('/api/admin/cms/team-members', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const member = await storage.createTeamMember(req.body);
      res.json(member);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put('/api/admin/cms/team-members/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateTeamMember(id, req.body);
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete('/api/admin/cms/team-members/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Landing Testimonials
  app.get('/api/cms/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getLandingTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get('/api/cms/testimonials/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.getLandingTestimonial(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      res.status(500).json({ message: "Failed to fetch testimonial" });
    }
  });

  app.post('/api/admin/cms/testimonials', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.createLandingTestimonial(req.body);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put('/api/admin/cms/testimonials/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.updateLandingTestimonial(id, req.body);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete('/api/admin/cms/testimonials/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLandingTestimonial(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Site Stats
  app.get('/api/cms/stats', async (req, res) => {
    try {
      const stats = await storage.getSiteStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching site stats:", error);
      res.status(500).json({ message: "Failed to fetch site stats" });
    }
  });

  app.get('/api/cms/stats/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stat = await storage.getSiteStat(id);
      if (!stat) {
        return res.status(404).json({ message: "Stat not found" });
      }
      res.json(stat);
    } catch (error) {
      console.error("Error fetching stat:", error);
      res.status(500).json({ message: "Failed to fetch stat" });
    }
  });

  app.post('/api/admin/cms/stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stat = await storage.createSiteStat(req.body);
      res.json(stat);
    } catch (error) {
      console.error("Error creating stat:", error);
      res.status(500).json({ message: "Failed to create stat" });
    }
  });

  app.put('/api/admin/cms/stats/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stat = await storage.updateSiteStat(id, req.body);
      res.json(stat);
    } catch (error) {
      console.error("Error updating stat:", error);
      res.status(500).json({ message: "Failed to update stat" });
    }
  });

  app.delete('/api/admin/cms/stats/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSiteStat(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting stat:", error);
      res.status(500).json({ message: "Failed to delete stat" });
    }
  });

  // Contact Settings
  app.get('/api/cms/contact', async (req, res) => {
    try {
      const settings = await storage.getContactSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching contact settings:", error);
      res.status(500).json({ message: "Failed to fetch contact settings" });
    }
  });

  app.put('/api/admin/cms/contact', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateContactSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating contact settings:", error);
      res.status(500).json({ message: "Failed to update contact settings" });
    }
  });

  // Footer Settings
  app.get('/api/cms/footer', async (req, res) => {
    try {
      const settings = await storage.getFooterSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching footer settings:", error);
      res.status(500).json({ message: "Failed to fetch footer settings" });
    }
  });

  app.put('/api/admin/cms/footer', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateFooterSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating footer settings:", error);
      res.status(500).json({ message: "Failed to update footer settings" });
    }
  });

  // SEO Settings
  app.get('/api/cms/seo', async (req, res) => {
    try {
      const settings = await storage.getSeoSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      res.status(500).json({ message: "Failed to fetch SEO settings" });
    }
  });

  app.put('/api/admin/cms/seo', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateSeoSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      res.status(500).json({ message: "Failed to update SEO settings" });
    }
  });

  // About Settings
  app.get('/api/cms/about', async (req, res) => {
    try {
      const settings = await storage.getAboutSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching about settings:", error);
      res.status(500).json({ message: "Failed to fetch about settings" });
    }
  });

  app.put('/api/admin/cms/about', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updateAboutSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating about settings:", error);
      res.status(500).json({ message: "Failed to update about settings" });
    }
  });

  // President Message Settings
  app.get('/api/cms/president-message', async (req, res) => {
    try {
      const settings = await storage.getPresidentMessageSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching president message settings:", error);
      res.status(500).json({ message: "Failed to fetch president message settings" });
    }
  });

  app.put('/api/admin/cms/president-message', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updatePresidentMessageSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating president message settings:", error);
      res.status(500).json({ message: "Failed to update president message settings" });
    }
  });

  // Partner Settings
  app.get('/api/cms/partner-settings', async (req, res) => {
    try {
      const settings = await storage.getPartnerSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching partner settings:", error);
      res.status(500).json({ message: "Failed to fetch partner settings" });
    }
  });

  app.put('/api/admin/cms/partner-settings', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const settings = await storage.updatePartnerSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating partner settings:", error);
      res.status(500).json({ message: "Failed to update partner settings" });
    }
  });

  // Partners CRUD
  app.get('/api/admin/cms/partners', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const partners = await storage.getPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  app.post('/api/admin/cms/partners', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const partner = await storage.createPartner({ ...req.body, createdBy: userId });
      res.status(201).json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  app.put('/api/admin/cms/partners/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const partner = await storage.updatePartner(id, req.body);
      res.json(partner);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ message: "Failed to update partner" });
    }
  });

  app.delete('/api/admin/cms/partners/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartner(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  // Event Management Routes
  app.get('/api/admin/events', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 25;
      const search = req.query.search as string || '';
      const status = req.query.status as string;
      const category = req.query.category as string;
      
      let events = await storage.getBookingEvents();
      
      // Transform events for the form
      events = events.map((e: any) => {
        // Extract minAge from ageRange (e.g., "12+" -> 12)
        const minAge = e.ageRange ? parseInt(e.ageRange.replace(/\D/g, '')) : null;
        
        // Extract maxPeople from groupSize (e.g., "Max 12 people" -> 12)
        const maxPeople = e.groupSize ? parseInt(e.groupSize.replace(/\D/g, '')) : null;
        
        return {
          ...e,
          locationDetails: e.subtitle || '',
          languages: Array.isArray(e.languages) ? e.languages.join(', ') : (e.languages || ''),
          minAge: minAge,
          maxPeople: maxPeople,
          highlights: Array.isArray(e.highlights) ? e.highlights.join('\n') : (e.highlights || ''),
          included: Array.isArray(e.included) ? e.included.join('\n') : (e.included || ''),
          notIncluded: Array.isArray(e.notIncluded) ? e.notIncluded.join('\n') : (e.notIncluded || ''),
          importantInfo: e.cancellationPolicy || '',
          price: e.price?.toString() || '',
          startDate: '',
          endDate: '',
        };
      });
      
      // Apply filters
      if (search) {
        events = events.filter((e: any) => 
          e.title?.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (status && status !== 'all') {
        events = events.filter((e: any) => e.status === status);
      }
      if (category && category !== 'all') {
        events = events.filter((e: any) => e.category === category);
      }
      
      const totalPages = Math.ceil(events.length / perPage);
      const paginatedEvents = events.slice((page - 1) * perPage, page * perPage);
      
      res.json({ 
        events: paginatedEvents, 
        totalPages, 
        currentPage: page,
        total: events.length 
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/admin/events', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const {
        title,
        description,
        location,
        locationDetails,
        startDate,
        endDate,
        duration,
        category,
        languages,
        minAge,
        maxPeople,
        maxAttendees,
        price,
        highlights,
        included,
        notIncluded,
        importantInfo,
        status,
      } = req.body;

      // Create as a booking event
      const eventData = {
        id: `event-${Date.now()}`,
        title: title || '',
        subtitle: locationDetails || null, // Using subtitle field for locationDetails
        description: description || '',
        location: location || '',
        duration: duration || null,
        price: price ? parseInt(price) : 0,
        originalPrice: price ? parseInt(price) : null,
        rating: 5,
        reviewCount: 0,
        category: category || null,
        languages: languages ? languages.split(',').map((l: string) => l.trim()) : ['English'],
        ageRange: minAge ? `${minAge}+` : null,
        groupSize: maxPeople ? `Max ${maxPeople} people` : null,
        cancellationPolicy: importantInfo || null, // Using cancellationPolicy for importantInfo
        images: [],
        highlights: highlights ? highlights.split('\n').filter((h: string) => h.trim()).map(h => h.trim()) : [],
        included: included ? included.split('\n').filter((i: string) => i.trim()).map(i => i.trim()) : [],
        notIncluded: notIncluded ? notIncluded.split('\n').filter((n: string) => n.trim()).map(n => n.trim()) : [],
        schedule: [],
        isActive: status === 'published',
        status: status || 'draft',
        createdBy: req.user.id,
      };

      const event = await storage.createBookingEvent(eventData as any);
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put('/api/admin/events/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const id = req.params.id;
      const {
        title,
        description,
        location,
        locationDetails,
        startDate,
        endDate,
        duration,
        category,
        languages,
        minAge,
        maxPeople,
        maxAttendees,
        price,
        highlights,
        included,
        notIncluded,
        importantInfo,
        status,
      } = req.body;

      const eventData = {
        title: title || '',
        subtitle: locationDetails || null,
        description: description || '',
        location: location || '',
        duration: duration || null,
        price: price ? parseInt(price) : 0,
        originalPrice: price ? parseInt(price) : null,
        category: category || null,
        languages: languages ? languages.split(',').map((l: string) => l.trim()) : ['English'],
        ageRange: minAge ? `${minAge}+` : null,
        groupSize: maxPeople ? `Max ${maxPeople} people` : null,
        cancellationPolicy: importantInfo || null,
        highlights: highlights ? highlights.split('\n').filter((h: string) => h.trim()).map(h => h.trim()) : [],
        included: included ? included.split('\n').filter((i: string) => i.trim()).map(i => i.trim()) : [],
        notIncluded: notIncluded ? notIncluded.split('\n').filter((n: string) => n.trim()).map(n => n.trim()) : [],
        isActive: status === 'published',
        status: status || 'draft',
      };

      const event = await storage.updateBookingEvent(id, eventData as any);
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete('/api/admin/events/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteBookingEvent(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Public events endpoint - for Journey/Association events (landing page)
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getUpcomingAssociationEvents();
      res.json({ events });
    } catch (error) {
      console.error("Error fetching association events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Admin: Get all events (both club and association)
  app.get('/api/admin/club-events', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json({ events });
    } catch (error) {
      console.error("Error fetching all events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Admin: Create new event
  app.post('/api/admin/club-events', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const eventData = req.body;
      const event = await storage.createClubEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Admin: Update event
  app.put('/api/admin/club-events/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventData = req.body;
      const event = await storage.updateClubEvent(id, eventData);
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  // Admin: Delete event
  app.delete('/api/admin/club-events/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClubEvent(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}