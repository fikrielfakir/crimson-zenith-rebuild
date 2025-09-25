import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Users,
  Heart,
  FileText,
  User,
  MapPin,
  Mountain,
  Camera,
  Waves,
  Compass,
  CheckCircle2,
  Info
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { JoinUsPageConfig, ClubOption, JoinUsFormField } from "@/types/admin";

const JoinUsConfig = () => {
  // Default configuration
  const [config, setConfig] = useState<JoinUsPageConfig>({
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
        fields: [
          {
            id: "applicantName",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            isRequired: true,
            isVisible: true,
            order: 1,
            validation: { minLength: 2, customMessage: "Name must be at least 2 characters" }
          },
          {
            id: "email",
            type: "email",
            label: "Email Address",
            placeholder: "your.email@example.com",
            isRequired: true,
            isVisible: true,
            order: 2,
            validation: { customMessage: "Please enter a valid email address" }
          },
          {
            id: "phone",
            type: "tel",
            label: "Phone Number",
            placeholder: "+212 XXX XXX XXX",
            isRequired: true,
            isVisible: true,
            order: 3,
            validation: { minLength: 10, customMessage: "Please enter a valid phone number" }
          }
        ]
      },
      clubPreferences: {
        isEnabled: true,
        title: "Club Preferences",
        description: "Choose a specific club that interests you most, or leave blank to explore all options.",
        icon: "MapPin",
        order: 2,
        fields: [
          {
            id: "preferredClub",
            type: "radio",
            label: "Preferred Club (Optional)",
            isRequired: false,
            isVisible: true,
            order: 1
          }
        ]
      },
      interests: {
        isEnabled: true,
        title: "Your Interests",
        description: "Choose all activities that interest you. This helps us match you with the right events and groups.",
        icon: "Heart",
        order: 3,
        fields: [
          {
            id: "interests",
            type: "multi-select",
            label: "Select your interests",
            isRequired: true,
            isVisible: true,
            order: 1,
            validation: { customMessage: "Please select at least one interest" }
          }
        ]
      },
      motivation: {
        isEnabled: true,
        title: "Tell Us About Yourself",
        description: "Share your motivation, expectations, and what you hope to gain from being part of our community.",
        icon: "FileText",
        order: 4,
        fields: [
          {
            id: "motivation",
            type: "textarea",
            label: "Why do you want to join our community?",
            placeholder: "Tell us about your passion for adventure, what you hope to experience, and how you'd like to contribute to our community...",
            isRequired: true,
            isVisible: true,
            order: 1,
            validation: { minLength: 50, customMessage: "Please tell us more about your motivation (at least 50 characters)" }
          }
        ]
      },
      terms: {
        isEnabled: true,
        title: "Terms & Conditions",
        description: "Agreement to community guidelines and terms of service",
        icon: "CheckCircle2",
        order: 5,
        fields: [
          {
            id: "agreeToTerms",
            type: "checkbox",
            label: "I agree to the terms and conditions",
            isRequired: true,
            isVisible: true,
            order: 1,
            validation: { customMessage: "You must agree to the terms and conditions" }
          }
        ]
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
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newClub, setNewClub] = useState<Partial<ClubOption>>({
    name: '',
    description: '',
    icon: 'Users',
    members: '0+ Members',
    isActive: true
  });

  const iconOptions = [
    { value: 'User', label: 'User' },
    { value: 'Users', label: 'Users' },
    { value: 'MapPin', label: 'MapPin' },
    { value: 'Heart', label: 'Heart' },
    { value: 'FileText', label: 'FileText' },
    { value: 'Mountain', label: 'Mountain' },
    { value: 'Camera', label: 'Camera' },
    { value: 'Waves', label: 'Waves' },
    { value: 'Compass', label: 'Compass' },
    { value: 'CheckCircle2', label: 'CheckCircle2' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update timestamp
      setConfig(prev => ({
        ...prev,
        updatedAt: new Date().toISOString()
      }));
      
      console.log('Join Us page configuration saved:', config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !config.availableInterests.includes(newInterest.trim())) {
      setConfig(prev => ({
        ...prev,
        availableInterests: [...prev.availableInterests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setConfig(prev => ({
      ...prev,
      availableInterests: prev.availableInterests.filter(i => i !== interest)
    }));
  };

  const addClub = () => {
    if (newClub.name && newClub.description) {
      const club: ClubOption = {
        id: newClub.name.toLowerCase().replace(/\s+/g, '-'),
        name: newClub.name,
        description: newClub.description,
        icon: newClub.icon || 'Users',
        members: newClub.members || '0+ Members',
        isActive: true,
        order: config.availableClubs.length + 1
      };
      
      setConfig(prev => ({
        ...prev,
        availableClubs: [...prev.availableClubs, club]
      }));
      
      setNewClub({
        name: '',
        description: '',
        icon: 'Users',
        members: '0+ Members',
        isActive: true
      });
    }
  };

  const removeClub = (clubId: string) => {
    setConfig(prev => ({
      ...prev,
      availableClubs: prev.availableClubs.filter(c => c.id !== clubId)
    }));
  };

  const toggleClubStatus = (clubId: string) => {
    setConfig(prev => ({
      ...prev,
      availableClubs: prev.availableClubs.map(club =>
        club.id === clubId ? { ...club, isActive: !club.isActive } : club
      )
    }));
  };

  const toggleSectionEnabled = (sectionKey: keyof typeof config.sections) => {
    setConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          isEnabled: !prev.sections[sectionKey].isEnabled
        }
      }
    }));
  };

  const updateSectionField = (sectionKey: keyof typeof config.sections, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [field]: value
        }
      }
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Join Us Page Configuration</h1>
            <p className="text-muted-foreground">
              Customize the Join Us application form and page content
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sections">Form Sections</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="success">Success Page</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input
                    id="pageTitle"
                    value={config.pageTitle}
                    onChange={(e) => setConfig(prev => ({ ...prev, pageTitle: e.target.value }))}
                    placeholder="Join Our Adventure Community"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pageSubtitle">Page Subtitle</Label>
                  <Textarea
                    id="pageSubtitle"
                    value={config.pageSubtitle}
                    onChange={(e) => setConfig(prev => ({ ...prev, pageSubtitle: e.target.value }))}
                    placeholder="Description that appears below the title"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headerGradient">Header Gradient CSS</Label>
                  <Input
                    id="headerGradient"
                    value={config.headerGradient}
                    onChange={(e) => setConfig(prev => ({ ...prev, headerGradient: e.target.value }))}
                    placeholder="from-primary to-primary/80"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="termsText">Terms Text</Label>
                  <Input
                    id="termsText"
                    value={config.termsText}
                    onChange={(e) => setConfig(prev => ({ ...prev, termsText: e.target.value }))}
                    placeholder="I agree to the terms and conditions"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="termsDescription">Terms Description</Label>
                  <Textarea
                    id="termsDescription"
                    value={config.termsDescription}
                    onChange={(e) => setConfig(prev => ({ ...prev, termsDescription: e.target.value }))}
                    placeholder="Detailed description of what users agree to"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Validation</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameMinLength">Name Min Length</Label>
                  <Input
                    id="nameMinLength"
                    type="number"
                    value={config.validation.nameMinLength}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      validation: { ...prev.validation, nameMinLength: parseInt(e.target.value) || 2 }
                    }))}
                    min="1"
                    max="20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneMinLength">Phone Min Length</Label>
                  <Input
                    id="phoneMinLength"
                    type="number"
                    value={config.validation.phoneMinLength}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      validation: { ...prev.validation, phoneMinLength: parseInt(e.target.value) || 10 }
                    }))}
                    min="5"
                    max="20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivationMinLength">Motivation Min Length</Label>
                  <Input
                    id="motivationMinLength"
                    type="number"
                    value={config.validation.motivationMinLength}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      validation: { ...prev.validation, motivationMinLength: parseInt(e.target.value) || 50 }
                    }))}
                    min="10"
                    max="500"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Sections */}
          <TabsContent value="sections" className="space-y-6">
            {Object.entries(config.sections).map(([key, section]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {section.title}
                      <Badge variant={section.isEnabled ? "default" : "secondary"}>
                        {section.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </CardTitle>
                    <Switch
                      checked={section.isEnabled}
                      onCheckedChange={() => toggleSectionEnabled(key as keyof typeof config.sections)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateSectionField(key as keyof typeof config.sections, 'title', e.target.value)}
                        placeholder="Section title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={section.icon}
                        onValueChange={(value) => updateSectionField(key as keyof typeof config.sections, 'icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={section.description || ''}
                      onChange={(e) => updateSectionField(key as keyof typeof config.sections, 'description', e.target.value)}
                      placeholder="Optional section description"
                      className="min-h-[60px]"
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {section.fields.length} field(s) configured for this section
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Clubs */}
          <TabsContent value="clubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Club</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Club Name</Label>
                    <Input
                      value={newClub.name || ''}
                      onChange={(e) => setNewClub(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Atlas Adventure Club"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={newClub.icon}
                      onValueChange={(value) => setNewClub(prev => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newClub.description || ''}
                    onChange={(e) => setNewClub(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Adventure activities and experiences"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Member Count Display</Label>
                  <Input
                    value={newClub.members || ''}
                    onChange={(e) => setNewClub(prev => ({ ...prev, members: e.target.value }))}
                    placeholder="250+ Members"
                  />
                </div>
                
                <Button onClick={addClub} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Club
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {config.availableClubs.map((club) => (
                <Card key={club.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={club.isActive ? "default" : "secondary"}>
                          {club.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div>
                          <h3 className="font-semibold">{club.name}</h3>
                          <p className="text-sm text-muted-foreground">{club.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{club.members}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleClubStatus(club.id)}
                          className="gap-2"
                        >
                          {club.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {club.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeClub(club.id)}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Interests */}
          <TabsContent value="interests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add new interest"
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button onClick={addInterest} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {config.availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors gap-2"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest}
                      <Trash2 className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Click on any interest badge to remove it from the list.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Success Page */}
          <TabsContent value="success" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Page Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Success Title</Label>
                  <Input
                    value={config.successPage.title}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      successPage: { ...prev.successPage, title: e.target.value }
                    }))}
                    placeholder="Application Submitted!"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Success Message</Label>
                  <Textarea
                    value={config.successPage.subtitle}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      successPage: { ...prev.successPage, subtitle: e.target.value }
                    }))}
                    placeholder="Thank you message and next steps"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Return Button Text</Label>
                  <Input
                    value={config.successPage.returnButtonText}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      successPage: { ...prev.successPage, returnButtonText: e.target.value }
                    }))}
                    placeholder="Return to Homepage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Next Steps</Label>
                  <div className="space-y-2">
                    {config.successPage.nextSteps.map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={step}
                          onChange={(e) => {
                            const newSteps = [...config.successPage.nextSteps];
                            newSteps[index] = e.target.value;
                            setConfig(prev => ({
                              ...prev,
                              successPage: { ...prev.successPage, nextSteps: newSteps }
                            }));
                          }}
                          placeholder={`Step ${index + 1}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newSteps = config.successPage.nextSteps.filter((_, i) => i !== index);
                            setConfig(prev => ({
                              ...prev,
                              successPage: { ...prev.successPage, nextSteps: newSteps }
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConfig(prev => ({
                          ...prev,
                          successPage: {
                            ...prev.successPage,
                            nextSteps: [...prev.successPage.nextSteps, 'New step']
                          }
                        }));
                      }}
                      className="gap-2 w-full"
                    >
                      <Plus className="w-4 h-4" />
                      Add Next Step
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Changes will be applied to the live Join Us page after saving. 
            Make sure to test the form after making significant modifications.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  );
};

export default JoinUsConfig;