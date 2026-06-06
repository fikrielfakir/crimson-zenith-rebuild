import type { JoinUsPageConfig } from '@/types/admin';

// Configuration service for Join Us page - shared between admin and public page
class JoinUsConfigService {
  private readonly STORAGE_KEY = 'joinUsPageConfig';

  // Default configuration
  private getDefaultConfig(): JoinUsPageConfig {
    return {
      id: 1,
      pageTitle: "Join Our Adventure Community",
      pageSubtitle: "Ready to explore Morocco's wonders with like-minded adventurers? Complete this application to become part of our vibrant community.",
      headerGradient: "from-primary to-primary/80",
      sections: {
        personalInfo: {
          isEnabled: true,
          title: "Personal Information",
          description: "Basic details about yourself",
          icon: "User",
          order: 1,
          fields: []
        },
        clubPreferences: {
          isEnabled: true,
          title: "Club Preferences",
          description: "Choose a specific club that interests you most, or leave blank to explore all options.",
          icon: "MapPin",
          order: 2,
          fields: []
        },
        interests: {
          isEnabled: true,
          title: "Your Interests", 
          description: "Choose all activities that interest you. This helps us match you with the right events and groups.",
          icon: "Heart",
          order: 3,
          fields: []
        },
        motivation: {
          isEnabled: true,
          title: "Tell Us About Yourself",
          description: "Share your motivation, expectations, and what you hope to gain from being part of our community.",
          icon: "FileText",
          order: 4,
          fields: []
        },
        terms: {
          isEnabled: true,
          title: "Terms & Conditions",
          description: "Agreement to community guidelines and terms of service",
          icon: "CheckCircle2",
          order: 5,
          fields: []
        }
      },
      availableClubs: [
        {
          id: 'atlas-hikers',
          name: 'Atlas Hikers Club',
          description: 'Mountain trekking and hiking adventures',
          icon: 'Mountain',
          members: '250+ Members',
          isActive: true,
          order: 1
        },
        {
          id: 'desert-explorers',
          name: 'Desert Explorers',
          description: 'Sahara expeditions and desert camping',
          icon: 'Compass',
          members: '180+ Members',
          isActive: true,
          order: 2
        },
        {
          id: 'photography-collective',
          name: 'Photography Collective',
          description: 'Capture Morocco\'s beauty through the lens',
          icon: 'Camera',
          members: '320+ Members',
          isActive: true,
          order: 3
        },
        {
          id: 'coastal-riders',
          name: 'Coastal Riders',
          description: 'Surfing and water sports on Atlantic coast',
          icon: 'Waves',
          members: '150+ Members',
          isActive: true,
          order: 4
        },
        {
          id: 'culture-seekers',
          name: 'Culture Seekers',
          description: 'Explore medinas, traditions, and local arts',
          icon: 'Users',
          members: '400+ Members',
          isActive: true,
          order: 5
        }
      ],
      availableInterests: [
        'Mountain Trekking',
        'Desert Adventures',
        'Photography',
        'Water Sports',
        'Cultural Tours',
        'Local Cuisine',
        'Traditional Crafts',
        'Historical Sites',
        'Nature Conservation',
        'Community Service',
        'Language Exchange',
        'Meditation & Wellness'
      ],
      successPage: {
        title: "Application Submitted!",
        subtitle: "Thank you for your interest in joining our community. We've received your application and will review it shortly. You'll hear from us within 2-3 business days.",
        nextSteps: [
          "Our team reviews your application",
          "We'll contact you for a brief interview",
          "Upon approval, you'll receive joining instructions",
          "Welcome to the community!"
        ],
        returnButtonText: "Return to Homepage"
      },
      termsText: "I agree to the terms and conditions",
      termsDescription: "By checking this box, you agree to our community guidelines, privacy policy, and terms of service. You also consent to receive communications about events and activities.",
      validation: {
        nameMinLength: 2,
        phoneMinLength: 10,
        motivationMinLength: 50
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Get configuration (from localStorage or default)
  async getConfig(): Promise<JoinUsPageConfig> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored) as JoinUsPageConfig;
        // Ensure config has all required fields by merging with default
        return { ...this.getDefaultConfig(), ...config };
      }
      return this.getDefaultConfig();
    } catch (error) {
      console.error('Error loading Join Us config:', error);
      return this.getDefaultConfig();
    }
  }

  // Save configuration
  async saveConfig(config: JoinUsPageConfig): Promise<void> {
    try {
      config.updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('joinUsConfigUpdated', { detail: config }));
    } catch (error) {
      console.error('Error saving Join Us config:', error);
      throw error;
    }
  }

  // Subscribe to configuration changes
  onConfigChange(callback: (config: JoinUsPageConfig) => void): () => void {
    const handleUpdate = (event: CustomEvent<JoinUsPageConfig>) => {
      callback(event.detail);
    };

    window.addEventListener('joinUsConfigUpdated', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('joinUsConfigUpdated', handleUpdate as EventListener);
    };
  }
}

export const joinUsConfigService = new JoinUsConfigService();