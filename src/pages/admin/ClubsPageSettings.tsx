import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, Loader2, Building2, Megaphone, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';
import { TranslateDialog } from '@/components/admin/TranslateDialog';

interface ClubsPageSettings {
  intro_heading?: string;
  intro_description?: string;
  cta_heading?: string;
  cta_description?: string;
  cta_button_text?: string;
  cta_button_link?: string;
}

const DEFAULTS: ClubsPageSettings = {
  intro_heading: 'Join a Community of Adventurers',
  intro_description: 'From the Atlantic to the Sahara, our clubs connect passionate explorers across Morocco\'s most iconic destinations.',
  cta_heading: 'Start your own club',
  cta_description: 'Passionate about a region or activity? Create a club and build your community of adventurers.',
  cta_button_text: 'Get Started',
  cta_button_link: '/join-us',
};

async function fetchSettings(): Promise<ClubsPageSettings> {
  const res = await apiFetch('/api/cms/clubs-page');
  if (!res.ok) return DEFAULTS;
  const data = await res.json();
  return { ...DEFAULTS, ...data };
}

export default function ClubsPageSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ClubsPageSettings | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['admin-clubs-page-settings'],
    queryFn: fetchSettings,
    onSuccess: (d: ClubsPageSettings) => {
      if (!form) setForm(d);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ClubsPageSettings) => {
      const res = await apiFetch('/api/admin/cms/clubs-page', {
        method: 'PUT',
        body: JSON.stringify({
          introHeading: data.intro_heading,
          introDescription: data.intro_description,
          ctaHeading: data.cta_heading,
          ctaDescription: data.cta_description,
          ctaButtonText: data.cta_button_text,
          ctaButtonLink: data.cta_button_link,
        }),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clubs-page-settings'] });
      queryClient.invalidateQueries({ queryKey: ['clubs-page-settings-public'] });
      toast({ title: 'Clubs page settings saved' });
    },
    onError: (e: any) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  });

  const current = form ?? DEFAULTS;

  function set(field: keyof ClubsPageSettings, value: string) {
    setForm(prev => ({ ...(prev ?? DEFAULTS), [field]: value }));
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clubs Page</h1>
            <p className="text-muted-foreground mt-1">
              Manage the content shown on the public /clubs page
            </p>
          </div>
          <Button
            onClick={() => saveMutation.mutate(current)}
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>

        {/* Hero note */}
        <Card className="border-dashed border-primary/40 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">
              <strong>Hero section</strong> (title, subtitle, background image) is managed under{' '}
              <a href="/admin/customization/page-heroes" className="text-primary underline underline-offset-2">
                Page Hero Settings → Clubs
              </a>.
            </p>
          </CardContent>
        </Card>

        {/* Introduction Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Introduction Section</CardTitle>
                  <CardDescription>Text shown below the stats bar</CardDescription>
                </div>
              </div>
              <TranslateDialog
                entityType="clubs-page"
                entityId="2"
                entityLabel="Introduction Section"
                fields={[
                  { key: 'intro_heading', label: 'Heading' },
                  { key: 'intro_description', label: 'Description', multiline: true },
                ]}
                sourceValues={{
                  intro_heading: current.intro_heading ?? '',
                  intro_description: current.intro_description ?? '',
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Heading</Label>
              <Input
                value={current.intro_heading ?? ''}
                onChange={e => set('intro_heading', e.target.value)}
                placeholder="Join a Community of Adventurers"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={current.intro_description ?? ''}
                onChange={e => set('intro_description', e.target.value)}
                rows={3}
                placeholder="From the Atlantic to the Sahara…"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Call-to-Action Section</CardTitle>
                  <CardDescription>Bottom banner encouraging new club creation</CardDescription>
                </div>
              </div>
              <TranslateDialog
                entityType="clubs-page"
                entityId="3"
                entityLabel="CTA Section"
                fields={[
                  { key: 'cta_heading', label: 'Heading' },
                  { key: 'cta_description', label: 'Description', multiline: true },
                  { key: 'cta_button_text', label: 'Button Text' },
                ]}
                sourceValues={{
                  cta_heading: current.cta_heading ?? '',
                  cta_description: current.cta_description ?? '',
                  cta_button_text: current.cta_button_text ?? '',
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Heading</Label>
              <Input
                value={current.cta_heading ?? ''}
                onChange={e => set('cta_heading', e.target.value)}
                placeholder="Start your own club"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={current.cta_description ?? ''}
                onChange={e => set('cta_description', e.target.value)}
                rows={3}
                placeholder="Passionate about a region or activity?…"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Button Text</Label>
                <Input
                  value={current.cta_button_text ?? ''}
                  onChange={e => set('cta_button_text', e.target.value)}
                  placeholder="Get Started"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Button Link</Label>
                <Input
                  value={current.cta_button_link ?? ''}
                  onChange={e => set('cta_button_link', e.target.value)}
                  placeholder="/join-us"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate(current)}
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
