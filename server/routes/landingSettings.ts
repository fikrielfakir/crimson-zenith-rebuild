import { Router } from 'express';
import { storage } from '../storage.js';

const router = Router();

// Hero Settings
router.get('/hero', async (req, res) => {
  try {
    const settings = await storage.getHeroSettings();
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    res.status(500).json({ error: 'Failed to fetch hero settings' });
  }
});

router.put('/hero', async (req, res) => {
  try {
    const userId = req.user?.id;
    const settings = await storage.updateHeroSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('Error updating hero settings:', error);
    res.status(500).json({ error: 'Failed to update hero settings' });
  }
});

// About Settings
router.get('/about', async (req, res) => {
  try {
    const settings = await storage.getAboutSettings();
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching about settings:', error);
    res.status(500).json({ error: 'Failed to fetch about settings' });
  }
});

router.put('/about', async (req, res) => {
  try {
    const userId = req.user?.id;
    const settings = await storage.updateAboutSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('Error updating about settings:', error);
    res.status(500).json({ error: 'Failed to update about settings' });
  }
});

// President Message Settings
router.get('/president-message', async (req, res) => {
  try {
    const settings = await storage.getPresidentMessageSettings();
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching president message settings:', error);
    res.status(500).json({ error: 'Failed to fetch president message settings' });
  }
});

router.put('/president-message', async (req, res) => {
  try {
    const userId = req.user?.id;
    const settings = await storage.updatePresidentMessageSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('Error updating president message settings:', error);
    res.status(500).json({ error: 'Failed to update president message settings' });
  }
});

// Partner Settings
router.get('/partner-settings', async (req, res) => {
  try {
    const settings = await storage.getPartnerSettings();
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching partner settings:', error);
    res.status(500).json({ error: 'Failed to fetch partner settings' });
  }
});

router.put('/partner-settings', async (req, res) => {
  try {
    const userId = req.user?.id;
    const settings = await storage.updatePartnerSettings(req.body, userId);
    res.json(settings);
  } catch (error) {
    console.error('Error updating partner settings:', error);
    res.status(500).json({ error: 'Failed to update partner settings' });
  }
});

// Partners CRUD
router.get('/partners', async (req, res) => {
  try {
    const partners = await storage.getPartners();
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

router.get('/partners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const partner = await storage.getPartner(id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

router.post('/partners', async (req, res) => {
  try {
    const userId = req.user?.id;
    const partner = await storage.createPartner({ ...req.body, createdBy: userId });
    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

router.put('/partners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const partner = await storage.updatePartner(id, req.body);
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

router.delete('/partners/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deletePartner(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await storage.getSiteStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/stats', async (req, res) => {
  try {
    const userId = req.user?.id;
    const stat = await storage.createSiteStat({ ...req.body, updatedBy: userId });
    res.status(201).json(stat);
  } catch (error) {
    console.error('Error creating stat:', error);
    res.status(500).json({ error: 'Failed to create stat' });
  }
});

router.put('/stats/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.id;
    const stat = await storage.updateSiteStat(id, { ...req.body, updatedBy: userId });
    res.json(stat);
  } catch (error) {
    console.error('Error updating stat:', error);
    res.status(500).json({ error: 'Failed to update stat' });
  }
});

router.delete('/stats/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteSiteStat(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting stat:', error);
    res.status(500).json({ error: 'Failed to delete stat' });
  }
});

// Testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await storage.getLandingTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const userId = req.user?.id;
    const testimonial = await storage.createLandingTestimonial({ ...req.body, userId });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const testimonial = await storage.updateLandingTestimonial(id, req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteLandingTestimonial(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
