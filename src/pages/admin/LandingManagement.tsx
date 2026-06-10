import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink, Image, Navigation, Star, Users, Mail,
  BarChart2, MessageSquare, Handshake, CalendarDays, Map, Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

interface SectionSetting {
  id: number;
  sectionKey: string;
  label: string;
  isEnabled: boolean;
  ordering: number;
}

const SECTION_META: Record<string, {
  icon: React.ReactNode;
  description: string;
  settingsHref?: string;
  badge?: string;
}> = {
  hero: {
    icon: <Image className="h-5 w-5" />,
    description: 'Main banner with title, subtitle, buttons, and background image.',
    settingsHref: '/admin/hero-settings',
    badge: 'CMS',
  },
  president_message: {
    icon: <Users className="h-5 w-5" />,
    description: "President's photo, message text, and section styling.",
    settingsHref: '/admin/president-message',
    badge: 'CMS',
  },
  about: {
    icon: <Star className="h-5 w-5" />,
    description: 'About section with focus areas and organisation overview.',
    settingsHref: '/admin/focus-areas',
    badge: 'CMS',
  },
  clubs_map: {
    icon: <Map className="h-5 w-5" />,
    description: 'Interactive map showing all club locations.',
    badge: 'Dynamic',
  },
  events_calendar: {
    icon: <CalendarDays className="h-5 w-5" />,
    description: 'Upcoming events and activities calendar.',
    badge: 'Dynamic',
  },
  stats: {
    icon: <BarChart2 className="h-5 w-5" />,
    description: 'Key numbers and impact statistics.',
    settingsHref: '/admin/impact',
    badge: 'CMS',
  },
  testimonials: {
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Member and traveller testimonials.',
    settingsHref: '/admin/testimonials',
    badge: 'CMS',
  },
  partners: {
    icon: <Handshake className="h-5 w-5" />,
    description: 'Partner logos and associations.',
    settingsHref: '/admin/partners',
    badge: 'CMS',
  },
  contact: {
    icon: <Mail className="h-5 w-5" />,
    description: 'Contact form and office information.',
    settingsHref: '/admin/contact-settings',
    badge: 'Settings',
  },
};

export default function LandingManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const { data: sections = [], isLoading } = useQuery<SectionSetting[]>({
    queryKey: ['admin-landing-sections'],
    queryFn: async () => {
      const res = await apiFetch('/api/admin/cms/landing-sections');
      if (!res.ok) throw new Error('Failed to load sections');
      return res.json();
    },
  });

  const effectiveState = (key: string, defaultVal: boolean) =>
    key in pendingChanges ? pendingChanges[key] : defaultVal;

  const handleToggle = (sectionKey: string, current: boolean) => {
    setPendingChanges((prev) => ({ ...prev, [sectionKey]: !current }));
  };

  const saveAll = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    setSaving(true);
    try {
      const updates = sections.map((s) => ({
        sectionKey: s.sectionKey,
        isEnabled: effectiveState(s.sectionKey, s.isEnabled),
      }));

      const res = await apiFetch('/api/admin/cms/landing-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Save failed');

      queryClient.invalidateQueries({ queryKey: ['admin-landing-sections'] });
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      setPendingChanges({});
      toast({ title: 'Saved', description: 'Landing page sections updated.' });
    } catch {
      toast({ title: 'Error', description: 'Could not save changes.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const hasPending = Object.keys(pendingChanges).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.landing.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Toggle each section on or off, then save. Click "Settings" to edit the section's content.
          </p>
        </div>
        <Button onClick={saveAll} disabled={!hasPending || saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {hasPending && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          You have unsaved changes — click <strong>Save Changes</strong> to apply them to the live site.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3 mt-2" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => {
            const meta = SECTION_META[section.sectionKey];
            const enabled = effectiveState(section.sectionKey, section.isEnabled);
            const changed = section.sectionKey in pendingChanges;

            return (
              <Card
                key={section.sectionKey}
                className={`transition-all ${!enabled ? 'opacity-60' : ''} ${changed ? 'ring-2 ring-amber-400' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {meta?.icon}
                      <CardTitle className="text-base">{section.label}</CardTitle>
                      {changed && (
                        <Badge variant="outline" className="text-xs border-amber-400 text-amber-600">
                          unsaved
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {meta?.badge && (
                        <Badge variant="secondary" className="text-xs">{meta.badge}</Badge>
                      )}
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => handleToggle(section.sectionKey, enabled)}
                      />
                    </div>
                  </div>
                  <CardDescription className="text-sm mt-1">
                    {meta?.description}
                  </CardDescription>
                </CardHeader>

                {meta?.settingsHref && (
                  <>
                    <Separator />
                    <CardContent className="pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(meta.settingsHref!)}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Edit Content
                      </Button>
                    </CardContent>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-3">Other Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Navbar', href: '/admin/navbar-settings', icon: <Navigation className="h-4 w-4" />, desc: 'Navigation links, logo, language switcher.' },
            { label: 'Theme & Colors', href: '/admin/theme-settings', icon: <Star className="h-4 w-4" />, desc: 'Global color palette, typography, custom CSS.' },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <CardTitle className="text-base">{item.label}</CardTitle>
                </div>
                <CardDescription className="text-sm">{item.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(item.href)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Go to {item.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
