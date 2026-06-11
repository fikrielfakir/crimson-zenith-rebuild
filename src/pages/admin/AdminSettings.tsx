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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Save, Loader2, Globe, Search, ShieldCheck, Image as ImageIcon,
  Mail, BarChart2, Link as LinkIcon, Code, CheckCircle2, XCircle, Upload,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

// ── Shared helpers ─────────────────────────────────────────────────────────────

function useSettingsQuery<T>(url: string, key: string[]) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const res = await apiFetch(url);
      if (!res.ok) return {} as T;
      return res.json();
    },
    staleTime: 30_000,
  });
}

function useSave(writeUrl: string, invalidateKeys: string[][], label: string, toast: ReturnType<typeof useToast>['toast'], t: (k: string, fb?: string) => string) {
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
      invalidateKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
      toast({ title: `${label} saved` });
    },
    onError: () => toast({ title: t('admin.common.errorSave', 'Save failed'), variant: 'destructive' }),
  });
}

// ── General Tab ──────────────────────────────────────────────────────────────

function GeneralTab() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const { data: seo, isLoading: seoLoading } = useSettingsQuery<any>('/api/cms/seo', ['settings-seo']);
  const { data: contact, isLoading: contactLoading } = useSettingsQuery<any>('/api/cms/contact', ['settings-contact']);

  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  useEffect(() => {
    if (seo) {
      setSiteTitle(seo.siteTitle ?? '');
      setSiteDescription(seo.siteDescription ?? '');
    }
  }, [seo]);

  useEffect(() => {
    if (contact) {
      setContactEmail(contact.email ?? '');
      setContactPhone(contact.phone ?? '');
      setOfficeAddress(contact.officeAddress ?? '');
    }
  }, [contact]);

  const seoMutation = useSave('/api/admin/settings/seo', [['settings-seo'], ['cms-seo']], 'General settings', toast, t);
  const contactMutation = useSave('/api/admin/settings/contact', [['settings-contact']], 'Contact settings', toast, t);

  const saving = seoMutation.isPending || contactMutation.isPending;
  const isLoading = seoLoading || contactLoading;

  const handleSave = async () => {
    await Promise.all([
      seoMutation.mutateAsync({ siteTitle, siteDescription }),
      contactMutation.mutateAsync({ email: contactEmail, phone: contactPhone, officeAddress }),
    ]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.settings.generalTitle', 'Site Identity')}</CardTitle>
          <CardDescription>{t('admin.settings.generalDesc', 'Basic information about your website')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="site-title">{t('admin.common.siteNameLabel', 'Site Name')}</Label>
                <Input id="site-title" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} placeholder="The Journey Association" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">{t('admin.common.siteDescLabel', 'Site Description')}</Label>
                <Textarea id="site-description" rows={3} value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="Morocco's network of adventure and cultural clubs" />
              </div>
              <Separator />
              <h4 className="text-sm font-semibold">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">{t('admin.common.contactEmailLabel', 'Contact Email')}</Label>
                  <Input id="contact-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="info@thejourney-ma.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number</Label>
                  <Input id="contact-phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+212 600 000 000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="office-address">Office Address</Label>
                <Textarea id="office-address" rows={2} value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} placeholder="123 Avenue Mohammed V, Casablanca, Morocco" />
              </div>
            </>
          )}
          <Button onClick={handleSave} disabled={saving || isLoading}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Saving…' : t('admin.settings.saveChanges', 'Save Changes')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── SEO Tab ──────────────────────────────────────────────────────────────────

function SeoTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data, isLoading } = useSettingsQuery<any>('/api/cms/seo', ['settings-seo']);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => { if (data) setForm(data); }, [data]);

  const mutation = useSave('/api/admin/cms/seo', [['settings-seo'], ['cms-seo']], 'SEO settings', toast, t);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const descLen = (form.siteDescription ?? '').length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.settings.seoTitle', 'Search Engine Optimization')}</CardTitle>
          <CardDescription>{t('admin.settings.seoDesc', 'Control how your site appears in search results')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="meta-title">{t('admin.common.metaTitle', 'Meta Title')}</Label>
                <Input id="meta-title" value={form.siteTitle ?? ''} onChange={(e) => set('siteTitle', e.target.value)} placeholder="The Journey Association — Morocco Adventure Clubs" />
                <p className="text-xs text-muted-foreground">{(form.siteTitle ?? '').length} / 60 characters recommended</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">{t('admin.common.metaDescription', 'Meta Description')}</Label>
                <Textarea id="meta-description" rows={3} value={form.siteDescription ?? ''} onChange={(e) => set('siteDescription', e.target.value)} placeholder="Discover Morocco's adventure and cultural clubs…" />
                <p className={`text-xs ${descLen > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>{descLen} / 160 characters recommended</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">{t('admin.common.keywords', 'Keywords')}</Label>
                <Input id="meta-keywords" value={form.keywords ?? ''} onChange={(e) => set('keywords', e.target.value)} placeholder="morocco, adventure, clubs, hiking, travel" />
                <p className="text-xs text-muted-foreground">Comma-separated keywords</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter-handle">{t('admin.common.twitterHandle', 'Twitter / X Handle')}</Label>
                <Input id="twitter-handle" value={form.twitterHandle ?? ''} onChange={(e) => set('twitterHandle', e.target.value)} placeholder="@thejourneymorroco" />
              </div>
              <Separator />
              <h4 className="text-sm font-semibold flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Analytics & Tracking</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input id="ga-id" value={form.googleAnalyticsId ?? ''} onChange={(e) => set('googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX or UA-XXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                  <Input id="fb-pixel" value={form.facebookPixelId ?? ''} onChange={(e) => set('facebookPixelId', e.target.value)} placeholder="123456789012345" />
                </div>
              </div>
              <Separator />
              <h4 className="text-sm font-semibold flex items-center gap-2"><Code className="h-4 w-4" /> Custom Code Injection</h4>
              <div className="space-y-2">
                <Label htmlFor="head-code">Custom &lt;head&gt; Code</Label>
                <Textarea id="head-code" rows={4} value={form.customHeadCode ?? ''} onChange={(e) => set('customHeadCode', e.target.value)} placeholder="<!-- Custom scripts, meta tags, etc. -->" className="font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body-code">Custom &lt;body&gt; End Code</Label>
                <Textarea id="body-code" rows={4} value={form.customBodyCode ?? ''} onChange={(e) => set('customBodyCode', e.target.value)} placeholder="<!-- Chat widgets, analytics, etc. -->" className="font-mono text-xs" />
              </div>
            </>
          )}
          <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || isLoading}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {mutation.isPending ? 'Saving…' : t('admin.settings.saveSEO', 'Save SEO Settings')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Logo & Favicon Tab ────────────────────────────────────────────────────────

function ImageUploadField({
  label,
  description,
  value,
  onChange,
  accept,
  previewClass,
  inputId,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  accept: string;
  previewClass?: string;
  inputId: string;
}) {
  const [dragging, setDragging] = useState(false);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer
          ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <input id={inputId} type="file" accept={accept} className="hidden" onChange={handleFile} />
      </div>

      {value && (
        <div className={`border rounded-lg p-4 bg-muted/30 flex items-center justify-center ${previewClass ?? 'min-h-[80px]'}`}>
          <img
            src={value}
            alt={`${label} preview`}
            className="max-h-16 max-w-[200px] object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="ml-3 text-xs text-destructive hover:underline self-start"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function LogoFaviconTab() {
  const { toast } = useToast();

  const { data: navbar, isLoading: navbarLoading } = useSettingsQuery<any>('/api/cms/navbar', ['settings-navbar']);
  const { data: seo, isLoading: seoLoading } = useSettingsQuery<any>('/api/cms/seo', ['settings-seo']);

  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState('135');
  const [logoLink, setLogoLink] = useState('/');
  const [faviconUrl, setFaviconUrl] = useState('');

  useEffect(() => {
    if (navbar) {
      setLogoUrl(navbar.logoImageUrl ?? navbar.logoUrl ?? '');
      setLogoSize(String(navbar.logoSize ?? 135));
      setLogoLink(navbar.logoLink ?? '/');
    }
  }, [navbar]);

  useEffect(() => {
    if (seo) {
      setFaviconUrl(seo.faviconUrl ?? '');
    }
  }, [seo]);

  const navbarMutation = useSave('/api/admin/cms/navbar', [['settings-navbar'], ['cms-navbar']], 'Logo settings', toast, (k, fb) => fb ?? k);
  const seoMutation = useSave('/api/admin/cms/seo', [['settings-seo'], ['cms-seo']], 'Favicon settings', toast, (k, fb) => fb ?? k);

  const isLoading = navbarLoading || seoLoading;
  const saving = navbarMutation.isPending || seoMutation.isPending;

  const handleSave = async () => {
    await Promise.all([
      navbarMutation.mutateAsync({ logoType: 'image', logoUrl, logoSize: Number(logoSize), logoLink }),
      seoMutation.mutateAsync({ faviconUrl }),
    ]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Logo</CardTitle>
          <CardDescription>The logo displayed in the navigation bar across all pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : (
            <>
              <ImageUploadField
                inputId="logo-upload"
                label="Logo Image"
                description="PNG, SVG or WebP — transparent background recommended, ~400×160px"
                accept="image/png,image/svg+xml,image/webp,image/jpeg"
                value={logoUrl}
                onChange={setLogoUrl}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-size">Logo Size (px)</Label>
                  <Input id="logo-size" type="number" value={logoSize} onChange={(e) => setLogoSize(e.target.value)} min="50" max="300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-link" className="flex items-center gap-1"><LinkIcon className="h-3 w-3" /> Logo Link</Label>
                  <Input id="logo-link" value={logoLink} onChange={(e) => setLogoLink(e.target.value)} placeholder="/" />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Favicon</CardTitle>
          <CardDescription>Small icon shown in browser tabs and bookmarks (32×32px .ico, .png, or .svg)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : (
            <ImageUploadField
              inputId="favicon-upload"
              label="Favicon Image"
              description=".ico, PNG or SVG — 32×32px recommended"
              accept="image/x-icon,image/png,image/svg+xml,image/vnd.microsoft.icon"
              value={faviconUrl}
              onChange={setFaviconUrl}
              previewClass="min-h-[56px]"
            />
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving || isLoading}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {saving ? 'Saving…' : 'Save Logo & Favicon'}
      </Button>
    </div>
  );
}

// ── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const { toast } = useToast();
  const { data: smtp, isLoading: smtpLoading, refetch } = useSettingsQuery<any>('/api/admin/smtp-settings', ['settings-smtp']);

  const [smtpForm, setSmtpForm] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    if (smtp) setSmtpForm(smtp);
  }, [smtp]);

  const smtpMutation = useSave('/api/admin/smtp-settings', [['settings-smtp']], 'SMTP settings', toast, (k, fb) => fb ?? k);

  const setS = (k: string, v: any) => setSmtpForm((f) => ({ ...f, [k]: v }));

  const handleTestEmail = async () => {
    if (!testEmail) { toast({ title: 'Enter a test email address', variant: 'destructive' }); return; }
    setTesting(true);
    try {
      const res = await apiFetch('/api/admin/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail }),
      });
      if (res.ok) {
        toast({ title: 'Test email sent successfully!' });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Test failed', description: err.message ?? err.error ?? 'Unknown error', variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Test failed', description: e.message, variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  const staticIntegrations = [
    { name: 'Stripe', desc: 'Payment processing via Replit Stripe integration.', badge: 'Payments', status: true },
    { name: 'PayPal', desc: 'PayPal payments via Replit PayPal integration.', badge: 'Payments', status: true },
    { name: 'CMI Payment Gateway', desc: 'Moroccan CMI gateway — configure via the Payments admin page.', badge: 'Payments', link: '/admin/payments', status: null },
  ];

  return (
    <div className="space-y-4">
      {/* Payment Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Payment Integrations</CardTitle>
          <CardDescription>Manage payment provider connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {staticIntegrations.map((item) => (
            <div key={item.name} className="flex items-start justify-between gap-4 border rounded-lg p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{item.name}</p>
                  <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                  {item.status === true && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {item.link && (
                  <a href={item.link} className="text-xs text-primary underline">Configure →</a>
                )}
              </div>
              <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SMTP Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> SMTP Email</CardTitle>
          <CardDescription>Configure email delivery for notifications, booking confirmations, and contact forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {smtpLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Switch
                  checked={smtpForm.enabled ?? false}
                  onCheckedChange={(v) => setS('enabled', v)}
                />
                <Label>Enable SMTP email delivery</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" value={smtpForm.host ?? ''} onChange={(e) => setS('host', e.target.value)} placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" value={smtpForm.port ?? 587} onChange={(e) => setS('port', Number(e.target.value))} placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Username</Label>
                  <Input id="smtp-user" value={smtpForm.username ?? ''} onChange={(e) => setS('username', e.target.value)} placeholder="you@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">Password / App Password</Label>
                  <Input id="smtp-pass" type="password" value={smtpForm.password ?? ''} onChange={(e) => setS('password', e.target.value)} placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-from-name">From Name</Label>
                  <Input id="smtp-from-name" value={smtpForm.fromName ?? ''} onChange={(e) => setS('fromName', e.target.value)} placeholder="The Journey Association" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-from-email">From Email</Label>
                  <Input id="smtp-from-email" type="email" value={smtpForm.fromEmail ?? ''} onChange={(e) => setS('fromEmail', e.target.value)} placeholder="noreply@thejourney-ma.org" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={smtpForm.secure ?? false}
                  onCheckedChange={(v) => setS('secure', v)}
                />
                <Label>Use SSL/TLS (port 465)</Label>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Send Test Email</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleTestEmail} disabled={testing}>
                    {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Test'}
                  </Button>
                </div>
              </div>
            </>
          )}
          <Button onClick={() => smtpMutation.mutate(smtpForm)} disabled={smtpMutation.isPending || smtpLoading}>
            {smtpMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {smtpMutation.isPending ? 'Saving…' : 'Save SMTP Settings'}
          </Button>
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
        <h1 className="text-3xl font-bold">{t('admin.settings.title', 'Settings')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle', 'Manage your website configuration')}</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            {t('admin.settings.tabGeneral', 'General')}
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="mr-2 h-4 w-4" />
            {t('admin.settings.tabSEO', 'SEO')}
          </TabsTrigger>
          <TabsTrigger value="logo">
            <ImageIcon className="mr-2 h-4 w-4" />
            Logo & Favicon
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <ShieldCheck className="mr-2 h-4 w-4" />
            {t('admin.settings.tabIntegrations', 'Integrations')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general"><GeneralTab /></TabsContent>
        <TabsContent value="seo"><SeoTab /></TabsContent>
        <TabsContent value="logo"><LogoFaviconTab /></TabsContent>
        <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
