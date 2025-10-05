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

  const httpServer = createServer(app);
  return httpServer;
}