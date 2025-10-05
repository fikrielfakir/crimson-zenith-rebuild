import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Menu,
  Sparkles, 
  Target, 
  Activity,
  Calendar,
  Users as UsersIcon,
  BarChart3,
  MessageSquare,
  Phone,
  Globe,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NavbarTab from "@/components/admin/landing/NavbarTab";
import HeroTab from "@/components/admin/landing/HeroTab";
import FocusTab from "@/components/admin/landing/FocusTab";
import ActivitiesTab from "@/components/admin/landing/ActivitiesTab";
import EventsTab from "@/components/admin/landing/EventsTab";
import ClubsTab from "@/components/admin/landing/ClubsTab";
import StatsTab from "@/components/admin/landing/StatsTab";
import TeamTab from "@/components/admin/landing/TeamTab";
import TestimonialsTab from "@/components/admin/landing/TestimonialsTab";
import ContactTab from "@/components/admin/landing/ContactTab";
import FooterTab from "@/components/admin/landing/FooterTab";
import SeoTab from "@/components/admin/landing/SeoTab";

const LandingManagement = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const { toast } = useToast();

  const tabs = [
    { value: 'navbar', label: 'Navbar', icon: Menu, description: 'Navigation bar settings' },
    { value: 'hero', label: 'Hero', icon: Sparkles, description: 'Main landing hero section' },
    { value: 'focus', label: 'Focus Items', icon: Target, description: 'Key focus areas and benefits' },
    { value: 'activities', label: 'Activities', icon: Activity, description: 'Activity sections and content' },
    { value: 'events', label: 'Events', icon: Calendar, description: 'Event sections and content' },
    { value: 'clubs', label: 'Clubs', icon: UsersIcon, description: 'Featured clubs overview' },
    { value: 'stats', label: 'Statistics', icon: BarChart3, description: 'Site metrics and achievements' },
    { value: 'team', label: 'Team', icon: UsersIcon, description: 'Team members and leadership' },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Customer reviews and feedback' },
    { value: 'contact', label: 'Contact', icon: Phone, description: 'Contact information and settings' },
    { value: 'footer', label: 'Footer', icon: Globe, description: 'Footer content and links' },
    { value: 'seo', label: 'SEO', icon: Settings, description: 'Meta tags and SEO settings' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Landing Page Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all aspects of your landing page content and settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 h-auto gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col items-center gap-1 py-3 px-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="navbar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Menu className="w-5 h-5" />
                  Navigation Bar
                </CardTitle>
                <CardDescription>
                  Configure your site's navigation bar and header settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NavbarTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Hero Section
                </CardTitle>
                <CardDescription>
                  Manage the main hero banner on your landing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeroTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="focus" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Focus Items
                </CardTitle>
                <CardDescription>
                  Highlight key features and benefits of your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FocusTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activities
                </CardTitle>
                <CardDescription>
                  Manage activity sections displayed on the landing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivitiesTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Events
                </CardTitle>
                <CardDescription>
                  Manage event sections displayed on the landing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clubs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Featured Clubs
                </CardTitle>
                <CardDescription>
                  Overview of clubs featured on the landing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClubsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Site Statistics
                </CardTitle>
                <CardDescription>
                  Showcase your achievements and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage your team members and leadership profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Testimonials
                </CardTitle>
                <CardDescription>
                  Manage customer testimonials and reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestimonialsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Settings
                </CardTitle>
                <CardDescription>
                  Configure contact information and form settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Footer Settings
                </CardTitle>
                <CardDescription>
                  Manage footer content, links, and social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FooterTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  SEO Settings
                </CardTitle>
                <CardDescription>
                  Configure meta tags, titles, and SEO optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SeoTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default LandingManagement;
