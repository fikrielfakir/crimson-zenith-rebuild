import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  FileText,
  CheckCircle,
  User,
  Calendar,
  Mountain,
  Camera,
  Waves,
  Compass
} from "lucide-react";
import type { JoinUsFormData, JoinUsPageConfig, ClubOption } from "@/types/admin";

// Create dynamic form validation schema based on config
const createJoinUsSchema = (config: JoinUsPageConfig | null) => {
  if (!config) {
    // Fallback schema
    return z.object({
      applicantName: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      phone: z.string().min(10, "Please enter a valid phone number"),
      preferredClub: z.string().optional(),
      interests: z.array(z.string()).min(1, "Please select at least one interest"),
      motivation: z.string().min(50, "Please tell us more about your motivation (at least 50 characters)"),
      agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions")
    });
  }

  return z.object({
    applicantName: z.string().min(config.validation.nameMinLength, `Name must be at least ${config.validation.nameMinLength} characters`),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(config.validation.phoneMinLength, "Please enter a valid phone number"),
    preferredClub: z.string().optional(),
    interests: z.array(z.string()).min(1, "Please select at least one interest"),
    motivation: z.string().min(config.validation.motivationMinLength, `Please tell us more about your motivation (at least ${config.validation.motivationMinLength} characters)`),
    agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions")
  });
};

const JoinUs = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [config, setConfig] = useState<JoinUsPageConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  const joinUsSchema = createJoinUsSchema(config);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<JoinUsFormData>({
    resolver: zodResolver(joinUsSchema),
    defaultValues: {
      applicantName: '',
      email: '',
      phone: '',
      preferredClub: '',
      interests: [],
      motivation: '',
      agreeToTerms: false
    }
  });

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // In a real app, this would fetch from API: const response = await fetch('/api/join-us-config');
        // For now, use default configuration
        const defaultConfig: JoinUsPageConfig = {
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
        
        setConfig(defaultConfig);
      } catch (error) {
        console.error('Error loading Join Us configuration:', error);
        // Use fallback config on error
        setConfig(null);
      } finally {
        setConfigLoading(false);
      }
    };
    
    loadConfig();
  }, []);

  // Get icon component from string
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      User, Users, MapPin, Heart, FileText, Mountain, Camera, Waves, Compass, CheckCircle
    };
    return iconMap[iconName] || Users;
  };

  // Dynamic clubs and interests based on config
  const clubs = config?.availableClubs?.filter(club => club.isActive).sort((a, b) => a.order - b.order) || [];
  const interestOptions = config?.availableInterests || [];

  const handleInterestChange = (interest: string, checked: boolean) => {
    const updatedInterests = checked 
      ? [...selectedInterests, interest]
      : selectedInterests.filter(i => i !== interest);
    
    setSelectedInterests(updatedInterests);
    setValue('interests', updatedInterests);
  };

  const onSubmit = async (data: JoinUsFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be: await fetch('/api/applications', { method: 'POST', body: JSON.stringify(data) })
      console.log('Application submitted:', data);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${config?.headerGradient || 'from-primary to-primary/80'} flex items-center justify-center py-12 px-4`}>
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{config?.successPage.title || 'Application Submitted!'}</h1>
            <p className="text-muted-foreground mb-6">
              {config?.successPage.subtitle || 'Thank you for your interest in joining our community. We\'ve received your application and will review it shortly. You\'ll hear from us within 2-3 business days.'}
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {(config?.successPage.nextSteps || []).map((step, index) => (
                  <li key={index}>• {step}</li>
                ))}
              </ul>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto"
            >
              {config?.successPage.returnButtonText || 'Return to Homepage'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while configuration loads
  if (configLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If config failed to load, show error message
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
            <p className="text-muted-foreground mb-6">
              Unable to load the Join Us page configuration. Please try again later or contact support.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.headerGradient} py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {config.pageTitle}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {config.pageSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          {config.sections.personalInfo.isEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(getIconComponent(config.sections.personalInfo.icon), { className: "w-5 h-5" })}
                  {config.sections.personalInfo.title}
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Full Name *</Label>
                  <Input
                    id="applicantName"
                    {...register('applicantName')}
                    placeholder="Enter your full name"
                    className={errors.applicantName ? 'border-red-500' : ''}
                  />
                  {errors.applicantName && (
                    <p className="text-sm text-red-500">{errors.applicantName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+212 XXX XXX XXX"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Club Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Club Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Club (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose a specific club that interests you most, or leave blank to explore all options.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {clubs.map((club) => {
                  const IconComponent = getIconComponent(club.icon);
                  return (
                    <Card key={club.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{club.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{club.description}</p>
                            <Badge variant="outline" className="text-xs">{club.members}</Badge>
                          </div>
                          <input
                            type="radio"
                            {...register('preferredClub')}
                            value={club.id}
                            className="mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Your Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select your interests *</Label>
                <p className="text-sm text-muted-foreground">
                  Choose all activities that interest you. This helps us match you with the right events and groups.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                    />
                    <Label
                      htmlFor={interest}
                      className="text-sm cursor-pointer"
                    >
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              
              {selectedInterests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedInterests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.interests && (
                <p className="text-sm text-red-500">{errors.interests.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tell Us About Yourself
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to join our community? *</Label>
                <p className="text-sm text-muted-foreground">
                  Share your motivation, expectations, and what you hope to gain from being part of our community.
                </p>
                <Textarea
                  id="motivation"
                  {...register('motivation')}
                  placeholder="Tell us about your passion for adventure, what you hope to experience, and how you'd like to contribute to our community..."
                  className={`min-h-[120px] ${errors.motivation ? 'border-red-500' : ''}`}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('motivation')?.length || 0} / 50 characters minimum
                </p>
                {errors.motivation && (
                  <p className="text-sm text-red-500">{errors.motivation.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    {...register('agreeToTerms')}
                    className={errors.agreeToTerms ? 'border-red-500' : ''}
                  />
                  <div className="space-y-1">
                    <Label 
                      htmlFor="agreeToTerms"
                      className="text-sm cursor-pointer"
                    >
                      I agree to the terms and conditions *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By checking this box, you agree to our community guidelines, 
                      privacy policy, and terms of service. You also consent to receive 
                      communications about events and activities.
                    </p>
                  </div>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
                )}
                
                <Separator />
                
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>What to expect:</strong> After submission, our team will review your application 
                    within 2-3 business days. We may contact you for a brief conversation to get to know you better 
                    before finalizing your membership.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default JoinUs;