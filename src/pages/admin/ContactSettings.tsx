import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/apiFetch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Phone, Mail, MapPin, MessageCircle, Headset } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' as const },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية', flag: '🇲🇦', dir: 'rtl' as const },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr' as const },
];

const LABEL_FIELDS = [
  { group: 'chatSupport',  icon: MessageCircle, titleKey: 'chatSupport',  subtitleKey: 'chatSupportSub' },
  { group: 'chatToSelect', icon: Headset,       titleKey: 'chatToSelect', subtitleKey: 'chatToSelectSub' },
  { group: 'visitUs',      icon: MapPin,        titleKey: 'visitUs',      subtitleKey: 'visitUsSub' },
  { group: 'callUs',       icon: Phone,         titleKey: 'callUs',       subtitleKey: 'callUsSub' },
  { group: 'formHeading',  icon: Mail,          titleKey: 'title',        subtitleKey: 'subtitle' },
];

interface InfoForm { email: string; phone: string; officeAddress: string }

export default function ContactSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeLang, setActiveLang] = useState('en');

  // ── Contact Info ────────────────────────────────────────────────────────
  const { data: contactInfo, isLoading: infoLoading } = useQuery<any>({
    queryKey: ['cms-contact'],
    queryFn: async () => {
      const res = await fetch('/api/cms/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const [infoForm, setInfoForm] = useState<InfoForm>({ email: '', phone: '', officeAddress: '' });

  useEffect(() => {
    if (contactInfo) {
      setInfoForm({
        email:         contactInfo.email         ?? '',
        phone:         contactInfo.phone         ?? '',
        // Laravel returns snake_case; support both
        officeAddress: contactInfo.officeAddress ?? contactInfo.office_address ?? '',
      });
    }
  }, [contactInfo]);

  const saveInfoMutation = useMutation({
    mutationFn: async (data: InfoForm) => {
      const res = await apiFetch('/api/admin/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:          data.email,
          phone:          data.phone,
          office_address: data.officeAddress,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-contact'] });
      toast({ title: t('admin.contact.savedInfo', 'Contact info saved'), description: t('admin.contact.savedInfoDesc', 'Changes are live on the contact page.') });
    },
    onError: () => toast({ title: t('admin.common.error', 'Save failed'), variant: 'destructive' }),
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

  useEffect(() => {
    if (i18nData && Object.keys(labelForm).length === 0) {
      setLabelForm(JSON.parse(JSON.stringify(i18nData)));
    }
  }, [i18nData]);

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
      toast({ title: t('admin.contact.savedLabels', 'Translations saved'), description: t('admin.contact.savedLabelsDesc', 'Page labels updated for all languages.') });
    },
    onError: () => toast({ title: t('admin.common.error', 'Save failed'), variant: 'destructive' }),
  });

  const setLabel = (lang: string, key: string, value: string) =>
    setLabelForm(prev => ({ ...prev, [lang]: { ...(prev[lang] ?? {}), [key]: value } }));

  const groupLabel = (key: string) => {
    const map: Record<string, string> = {
      chatSupport: t('contact.chatSupport', 'Chat to Support'),
      chatToSelect: t('contact.chatToSelect', 'Chat to Select'),
      visitUs: t('contact.visitUs', 'Visit Us'),
      callUs: t('contact.callUs', 'Call Us'),
      formHeading: t('admin.contact.formHeading', 'Form Heading'),
    };
    return map[key] ?? key;
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t('admin.nav.contactSettings', 'Contact Settings')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('admin.contact.description', 'Manage contact information and page labels displayed on the Contact page.')}
        </p>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">{t('admin.contact.tabInfo', 'Contact Info')}</TabsTrigger>
          <TabsTrigger value="labels">{t('admin.contact.tabLabels', 'Page Labels')}</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Contact Info ── */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.contact.infoTitle', 'Contact Information')}</CardTitle>
              <CardDescription>
                {t('admin.contact.infoDesc', 'Email address, phone number, and office address shown on the contact page.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 max-w-lg">
              {infoLoading ? (
                <p className="text-sm text-muted-foreground">{t('admin.common.loading', 'Loading…')}</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {t('contact.email', 'Email Address')}
                    </Label>
                    <Input
                      type="email"
                      placeholder="info@thejourney-ma.com"
                      value={infoForm.email}
                      onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {t('contact.phone', 'Phone Number')}
                    </Label>
                    <Input
                      placeholder="+212 686 777 888"
                      value={infoForm.phone}
                      onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {t('contact.visitUs', 'Office Address')}
                    </Label>
                    <Input
                      placeholder="Rabat Bouregreg, Morocco"
                      value={infoForm.officeAddress}
                      onChange={e => setInfoForm(f => ({ ...f, officeAddress: e.target.value }))}
                    />
                  </div>

                  <Button
                    onClick={() => saveInfoMutation.mutate(infoForm)}
                    disabled={saveInfoMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saveInfoMutation.isPending
                      ? t('admin.common.saving', 'Saving…')
                      : t('admin.contact.saveInfo', 'Save Contact Info')}
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
              <CardTitle>{t('admin.contact.labelsTitle', 'Page Labels & Translations')}</CardTitle>
              <CardDescription>
                {t('admin.contact.labelsDesc', 'Edit the titles and subtitles of each contact option across all languages.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {i18nLoading ? (
                <p className="text-sm text-muted-foreground">{t('admin.common.loading', 'Loading…')}</p>
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

                  {/* Fields */}
                  <div
                    className="space-y-4"
                    dir={LANGUAGES.find(l => l.code === activeLang)?.dir ?? 'ltr'}
                  >
                    {LABEL_FIELDS.map(field => {
                      const Icon = field.icon;
                      return (
                        <div key={field.group} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {groupLabel(field.group)}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                {t('admin.contact.titleLabel', 'Title')}
                              </Label>
                              <Input
                                value={labelForm[activeLang]?.[field.titleKey] ?? ''}
                                onChange={e => setLabel(activeLang, field.titleKey, e.target.value)}
                                placeholder={i18nData?.en?.[field.titleKey] ?? ''}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                                {t('admin.contact.subtitleLabel', 'Subtitle')}
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
                      {saveLabelsMutation.isPending
                        ? t('admin.common.saving', 'Saving…')
                        : t('admin.contact.saveLabels', 'Save All Translations')}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
