import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

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

  const httpServer = createServer(app);
  return httpServer;
}