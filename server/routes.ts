import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Admin middleware
const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.claims || !req.user.claims.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user || !user.isAdmin) {
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

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/clubs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const isMember = await storage.isClubMember(userId, clubId);
      res.json({ isMember });
    } catch (error) {
      console.error("Error checking membership:", error);
      res.status(500).json({ message: "Failed to check membership" });
    }
  });

  app.get('/api/user/clubs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memberships = await storage.getUserClubMemberships(userId);
      res.json(memberships);
    } catch (error) {
      console.error("Error fetching user clubs:", error);
      res.status(500).json({ message: "Failed to fetch user clubs" });
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const asset = await storage.createMediaAsset({ ...req.body, uploadedBy: userId });
      res.json(asset);
    } catch (error) {
      console.error("Error creating media asset:", error);
      res.status(500).json({ message: "Failed to create media asset" });
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const settings = await storage.updateSeoSettings(req.body, userId);
      res.json(settings);
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      res.status(500).json({ message: "Failed to update SEO settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}