import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Phone, Mail, MapPin, MessageCircle, Headset } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' as const },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية', flag: '🇲🇦', dir: 'rtl' as const },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' as const },
];

const LABEL_FIELDS = [
  {
    group: 'Chat to Support',
    icon: MessageCircle,
    titleKey: 'chatSupport',
    subtitleKey: 'chatSupportSub',
    titleLabel: 'Title',
    subtitleLabel: 'Subtitle',
  },
  {
    group: 'Chat to Select',
    icon: Headset,
    titleKey: 'chatToSelect',
    subtitleKey: 'chatToSelectSub',
    titleLabel: 'Title',
    subtitleLabel: 'Subtitle',
  },
  {
    group: 'Visit Us',
    icon: MapPin,
    titleKey: 'visitUs',
    subtitleKey: 'visitUsSub',
    titleLabel: 'Title',
    subtitleLabel: 'Subtitle',
  },
  {
    group: 'Call Us',
    icon: Phone,
    titleKey: 'callUs',
    subtitleKey: 'callUsSub',
    titleLabel: 'Title',
    subtitleLabel: 'Subtitle',
  },
  {
    group: 'Form Labels',
    icon: Mail,
    titleKey: 'title',
    subtitleKey: 'subtitle',
    titleLabel: 'Form Heading',
    subtitleLabel: 'Form Subheading',
  },
];

export default function ContactSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeLang, setActiveLang] = useState('en');

  // ── Contact Info (email / phone / address) ──────────────────────────────
  const { data: contactInfo, isLoading: infoLoading } = useQuery<any>({
    queryKey: ['cms-contact'],
    queryFn: async () => {
      const res = await fetch('/api/cms/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const [infoForm, setInfoForm] = useState({ email: '', phone: '', officeAddress: '' });

  // Sync form when data loads
  useState(() => {
    if (contactInfo) {
      setInfoForm({
        email: contactInfo.email ?? '',
        phone: contactInfo.phone ?? '',
        officeAddress: contactInfo.officeAddress ?? '',
      });
    }
  });

  const saveInfoMutation = useMutation({
    mutationFn: async (data: typeof infoForm) => {
      const res = await apiFetch('/api/admin/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-contact'] });
      toast({ title: 'Contact info saved', description: 'Changes are live on the contact page.' });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });

  // ── Translations ────────────────────────────────────────────────────────
  const { data: i18nData, isLoading: i18nLoading } = useQuery<Record<string, Record<string, string>>>({
    queryKey: ['admin-i18n-contact'],
    queryFn: async () => {
      const res = await apiFetch('/api/admin/i18n/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const [labelForm, setLabelForm] = useState<Record<string, Record<string, string>>>({});

  // Sync label form when i18n data arrives
  if (i18nData && Object.keys(labelForm).length === 0) {
    setLabelForm(JSON.parse(JSON.stringify(i18nData)));
  }

  const saveLabelsMutation = useMutation({
    mutationFn: async (data: typeof labelForm) => {
      const res = await apiFetch('/api/admin/i18n/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-i18n-contact'] });
      toast({ title: 'Translations saved', description: 'Page labels updated for all languages.' });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });

  const setLabel = (lang: string, key: string, value: string) => {
    setLabelForm(prev => ({
      ...prev,
      [lang]: { ...(prev[lang] ?? {}), [key]: value },
    }));
  };

  // Sync info form once data is available
  const displayInfo = {
    email: infoForm.email || contactInfo?.email || '',
    phone: infoForm.phone || contactInfo?.phone || '',
    officeAddress: infoForm.officeAddress || contactInfo?.officeAddress || '',
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage contact information and page labels displayed on the Contact page.
          </p>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Contact Info</TabsTrigger>
            <TabsTrigger value="labels">Page Labels</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Contact Info ── */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Email address, phone number, and office address shown on the contact page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 max-w-lg">
                {infoLoading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email Address
                      </Label>
                      <Input
                        type="email"
                        placeholder="info@thejourney-ma.com"
                        value={displayInfo.email}
                        onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone Number
                      </Label>
                      <Input
                        placeholder="+212 686 777 888"
                        value={displayInfo.phone}
                        onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Office Address
                      </Label>
                      <Input
                        placeholder="Rabat Bouregreg, Morocco"
                        value={displayInfo.officeAddress}
                        onChange={e => setInfoForm(f => ({ ...f, officeAddress: e.target.value }))}
                      />
                    </div>

                    <Button
                      onClick={() => saveInfoMutation.mutate(displayInfo)}
                      disabled={saveInfoMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saveInfoMutation.isPending ? 'Saving…' : 'Save Contact Info'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab 2: Page Labels (translations) ── */}
          <TabsContent value="labels">
            <Card>
              <CardHeader>
                <CardTitle>Page Labels &amp; Translations</CardTitle>
                <CardDescription>
                  Edit the titles and subtitles of each contact option across all languages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {i18nLoading ? (
                  <p className="text-sm text-muted-foreground">Loading translations…</p>
                ) : (
                  <>
                    {/* Language switcher */}
                    <div className="flex gap-2 flex-wrap mb-6">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => setActiveLang(lang.code)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            activeLang === lang.code
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Fields for active language */}
                    <div
                      className="space-y-6"
                      dir={LANGUAGES.find(l => l.code === activeLang)?.dir ?? 'ltr'}
                    >
                      {LABEL_FIELDS.map(field => {
                        const Icon = field.icon;
                        return (
                          <div key={field.group} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              {field.group}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                  {field.titleLabel}
                                </Label>
                                <Input
                                  value={labelForm[activeLang]?.[field.titleKey] ?? ''}
                                  onChange={e => setLabel(activeLang, field.titleKey, e.target.value)}
                                  placeholder={i18nData?.en?.[field.titleKey] ?? ''}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                  {field.subtitleLabel}
                                </Label>
                                <Input
                                  value={labelForm[activeLang]?.[field.subtitleKey] ?? ''}
                                  onChange={e => setLabel(activeLang, field.subtitleKey, e.target.value)}
                                  placeholder={i18nData?.en?.[field.subtitleKey] ?? ''}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6">
                      <Button
                        onClick={() => saveLabelsMutation.mutate(labelForm)}
                        disabled={saveLabelsMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {saveLabelsMutation.isPending ? 'Saving…' : 'Save All Translations'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
