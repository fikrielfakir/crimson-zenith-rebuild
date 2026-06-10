import { useTranslation } from 'react-i18next';
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
      toast({ title: t('admin.common.labelSaved', { label }) });
    },
    onError: () => toast({ title: t('admin.common.errorSave'), variant: 'destructive' }),
  });
}

// ── General Tab ──────────────────────────────────────────────────────────────

function GeneralTab() {
  const { t } = useTranslation();
  const { data: seo, isLoading: seoLoading } = useSettings<SeoSettings>('/api/cms/seo', ['settings-seo']);
  const { data: contact, isLoading: contactLoading } = useSettings<ContactSettings>('/api/cms/contact', ['settings-contact']);

  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => { if (seo?.siteTitle) setSiteTitle(seo.siteTitle); }, [seo]);
  useEffect(() => { if (seo?.siteDescription) setSiteDescription(seo.siteDescription); }, [seo]);
  useEffect(() => { if (contact?.email) setContactEmail(contact.email); }, [contact]);

  const seoMutation = useSaveMutation('/api/admin/settings/seo', [['settings-seo'], ['cms-seo']], 'General settings');
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
          <CardTitle>{t('admin.settings.generalTitle')}</CardTitle>
          <CardDescription>{t('admin.settings.generalDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> {t('admin.common.loading')}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="site-title">{t('admin.common.siteNameLabel')}</Label>
                <Input
                  id="site-title"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder={t('admin.settings.siteNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">{t('admin.common.siteDescLabel')}</Label>
                <Textarea
                  id="site-description"
                  rows={3}
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder={t('admin.settings.siteDescPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">{t('admin.common.contactEmailLabel')}</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={t('admin.settings.contactEmailPlaceholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('admin.common.contactFullDetails')}
                </p>
              </div>
            </>
          )}
          <Button onClick={handleSave} disabled={saving || isLoading}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? t('admin.events.saving') : t('admin.settings.saveChanges')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── SEO Tab ──────────────────────────────────────────────────────────────────

function SeoTab() {
  const { t } = useTranslation();
  const { data, isLoading } = useSettings<SeoSettings>('/api/cms/seo', ['settings-seo']);
  const [form, setForm] = useState<SeoSettings>({});

  useEffect(() => { if (data) setForm(data); }, [data]);

  const mutation = useSaveMutation('/api/admin/settings/seo', [['settings-seo'], ['cms-seo']], 'SEO settings');

  const set = (k: keyof SeoSettings, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.settings.seoTitle')}</CardTitle>
          <CardDescription>{t('admin.settings.seoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> {t('admin.common.loading')}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="meta-title">{t('admin.common.metaTitle')}</Label>
                <Input
                  id="meta-title"
                  value={form.siteTitle ?? ''}
                  onChange={(e) => set('siteTitle', e.target.value)}
                  placeholder={t('admin.settings.metaTitlePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">{t('admin.common.metaDescription')}</Label>
                <Textarea
                  id="meta-description"
                  rows={3}
                  value={form.siteDescription ?? ''}
                  onChange={(e) => set('siteDescription', e.target.value)}
                  placeholder={t('admin.settings.metaDescPlaceholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {(form.siteDescription ?? '').length} / 160
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">{t('admin.common.keywords')}</Label>
                <Input
                  id="meta-keywords"
                  value={form.keywords ?? ''}
                  onChange={(e) => set('keywords', e.target.value)}
                  placeholder={t('admin.settings.keywordsPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter-handle">{t('admin.common.twitterHandle')}</Label>
                <Input
                  id="twitter-handle"
                  value={form.twitterHandle ?? ''}
                  onChange={(e) => set('twitterHandle', e.target.value)}
                  placeholder={t('admin.settings.twitterHandlePlaceholder')}
                />
              </div>
            </>
          )}
          <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || isLoading}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {mutation.isPending ? t('admin.events.saving') : t('admin.settings.saveSEO')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            {t('admin.settings.integrationsTitle')}
          </CardTitle>
          <CardDescription>
            {t('admin.settings.integrationsDesc')}
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
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.settings.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle')}</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            {t('admin.settings.tabGeneral')}
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="mr-2 h-4 w-4" />
            {t('admin.settings.tabSEO')}
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <ShieldCheck className="mr-2 h-4 w-4" />
            {t('admin.settings.tabIntegrations')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general"><GeneralTab /></TabsContent>
        <TabsContent value="seo"><SeoTab /></TabsContent>
        <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
