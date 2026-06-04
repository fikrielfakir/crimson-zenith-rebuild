import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Globe, Search, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

interface SeoSettings {
  siteTitle?: string;
  siteDescription?: string;
  keywords?: string;
  twitterHandle?: string;
  ogImage?: string;
}

interface ContactSettings {
  email?: string;
  phone?: string;
  officeAddress?: string;
}

function useSettings<T>(readUrl: string, queryKey: string[]) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const res = await apiFetch(readUrl);
      if (!res.ok) return {} as T;
      return res.json();
    },
    staleTime: 30_000,
  });
}

function useSaveMutation(writeUrl: string, queryKeys: string[][], label: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiFetch(writeUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
      toast({ title: `${label} saved` });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });
}

// ── General Tab ──────────────────────────────────────────────────────────────

function GeneralTab() {
  const { data: seo, isLoading: seoLoading } = useSettings<SeoSettings>('/api/cms/seo', ['settings-seo']);
  const { data: contact, isLoading: contactLoading } = useSettings<ContactSettings>('/api/cms/contact', ['settings-contact']);

  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => { if (seo?.siteTitle) setSiteTitle(seo.siteTitle); }, [seo]);
  useEffect(() => { if (seo?.siteDescription) setSiteDescription(seo.siteDescription); }, [seo]);
  useEffect(() => { if (contact?.email) setContactEmail(contact.email); }, [contact]);

  const seoMutation = useSaveMutation('/api/admin/cms/seo', [['settings-seo'], ['cms-seo']], 'General settings');
  const contactMutation = useSaveMutation('/api/admin/settings/contact', [['settings-contact']], 'Contact settings');

  const saving = seoMutation.isPending || contactMutation.isPending;
  const isLoading = seoLoading || contactLoading;

  const handleSave = async () => {
    await Promise.all([
      seoMutation.mutateAsync({ siteTitle, siteDescription }),
      contactMutation.mutateAsync({ email: contactEmail }),
    ]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic site information shown in the browser and search results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Name / Title</Label>
                <Input
                  id="site-title"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="Your site name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  rows={3}
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Brief description of your site"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Full contact details can be edited in <strong>Contact Settings</strong>.
                </p>
              </div>
            </>
          )}
          <Button onClick={handleSave} disabled={saving || isLoading}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── SEO Tab ──────────────────────────────────────────────────────────────────

function SeoTab() {
  const { data, isLoading } = useSettings<SeoSettings>('/api/cms/seo', ['settings-seo']);
  const [form, setForm] = useState<SeoSettings>({});

  useEffect(() => { if (data) setForm(data); }, [data]);

  const mutation = useSaveMutation('/api/admin/cms/seo', [['settings-seo'], ['cms-seo']], 'SEO settings');

  const set = (k: keyof SeoSettings, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Control how your site appears in search engines and social shares.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={form.siteTitle ?? ''}
                  onChange={(e) => set('siteTitle', e.target.value)}
                  placeholder="Site title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  rows={3}
                  value={form.siteDescription ?? ''}
                  onChange={(e) => set('siteDescription', e.target.value)}
                  placeholder="Description shown in search results (150–160 chars)"
                />
                <p className="text-xs text-muted-foreground">
                  {(form.siteDescription ?? '').length} / 160 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Keywords</Label>
                <Input
                  id="meta-keywords"
                  value={form.keywords ?? ''}
                  onChange={(e) => set('keywords', e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter-handle">Twitter / X Handle</Label>
                <Input
                  id="twitter-handle"
                  value={form.twitterHandle ?? ''}
                  onChange={(e) => set('twitterHandle', e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>
            </>
          )}
          <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || isLoading}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {mutation.isPending ? 'Saving…' : 'Save SEO Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Third-Party Integrations
          </CardTitle>
          <CardDescription>
            API keys and secrets are managed securely through Replit environment variables — not stored in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              name: 'Stripe',
              desc: 'Payment processing — configured via STRIPE_SECRET_KEY env var.',
              envVar: 'STRIPE_SECRET_KEY',
              badge: 'Payments',
            },
            {
              name: 'PayPal',
              desc: 'PayPal payments — configured via PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET env vars.',
              envVar: 'PAYPAL_CLIENT_ID',
              badge: 'Payments',
            },
            {
              name: 'SMTP Email',
              desc: 'Email delivery — configured via SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.',
              envVar: 'SMTP_HOST',
              badge: 'Email',
            },
            {
              name: 'CMI Payment Gateway',
              desc: 'Moroccan CMI gateway — configure via the Payments admin page.',
              envVar: '',
              badge: 'Payments',
              link: '/admin/payments',
            },
          ].map((item) => (
            <div key={item.name} className="flex items-start justify-between gap-4 border rounded-lg p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{item.name}</p>
                  <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {item.envVar && (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.envVar}</code>
                )}
              </div>
              <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your website settings and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general"><GeneralTab /></TabsContent>
        <TabsContent value="seo"><SeoTab /></TabsContent>
        <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
