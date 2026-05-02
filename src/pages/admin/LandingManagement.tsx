import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Image, Layout, Navigation, Star, Users, Mail } from 'lucide-react';

interface SectionInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

const SECTIONS: SectionInfo[] = [
  {
    title: 'Hero Section',
    description: 'Edit the main banner: title, subtitle, buttons, background image, and typewriter texts.',
    icon: <Image className="h-5 w-5" />,
    href: '/admin/hero-settings',
    badge: 'CMS',
  },
  {
    title: 'Navbar',
    description: 'Manage navigation links, logo, language switcher, and header buttons.',
    icon: <Navigation className="h-5 w-5" />,
    href: '/admin/navbar-settings',
    badge: 'CMS',
  },
  {
    title: 'Focus Areas',
    description: 'Add and reorder the mission/focus-area cards shown on the landing page.',
    icon: <Star className="h-5 w-5" />,
    href: '/admin/focus-areas',
    badge: 'CMS',
  },
  {
    title: "President's Message",
    description: "Manage the president's photo, message text, and section styling.",
    icon: <Users className="h-5 w-5" />,
    href: '/admin/president-message',
    badge: 'CMS',
  },
  {
    title: 'Theme & Colors',
    description: 'Adjust global color palette, typography, spacing, and custom CSS.',
    icon: <Layout className="h-5 w-5" />,
    href: '/admin/theme-settings',
    badge: 'Design',
  },
  {
    title: 'Contact Settings',
    description: 'Update address, phone, email, social links, and map coordinates.',
    icon: <Mail className="h-5 w-5" />,
    href: '/admin/contact-settings',
    badge: 'Settings',
  },
];

export default function LandingManagement() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Landing Page Overview</h1>
        <p className="text-muted-foreground mt-1">
          Each section of the landing page is managed through its own dedicated settings page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </div>
                {section.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {section.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(section.href)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to {section.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
