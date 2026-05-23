import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/apiFetch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, MessageCircle, Headset, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AdminPageHeader,
  AdminCard,
  AdminSaveButton,
  AdminFormSkeleton,
  AdminPageError,
  LABEL_CN,
  HINT_CN,
} from '@/components/admin/AdminPageShell';

// ── Constants ────────────────────────────────────────────────────────────────

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

const ALL_KEYS = LABEL_FIELDS.flatMap(f => [f.titleKey, f.subtitleKey]);

// ── Types ────────────────────────────────────────────────────────────────────

interface InfoForm { email: string; phone: string; officeAddress: string }

// ── Component ────────────────────────────────────────────────────────────────

export default function ContactSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeLang, setActiveLang] = useState('en');
  const [translating, setTranslating] = useState(false);

  // ── Contact Info ───────────────────────────────────────────────────────────
  const {
    data: contactInfo,
    isLoading: infoLoading,
    isError: infoError,
    refetch: refetchInfo,
  } = useQuery<any>({
    queryKey: ['cms-contact'],
    queryFn: async () => {
      const res = await fetch('/api/cms/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch contact info');
      return res.json();
    },
  });

  const [infoForm, setInfoForm] = useState<InfoForm>({ email: '', phone: '', officeAddress: '' });

  useEffect(() => {
    if (contactInfo) {
      setInfoForm({
        email:         contactInfo.email         ?? '',
        phone:         contactInfo.phone         ?? '',
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
      toast({ title: 'Contact info saved' });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });

  // ── Translations ───────────────────────────────────────────────────────────
  const {
    data: i18nData,
    isLoading: i18nLoading,
    isError: i18nError,
    refetch: refetchI18n,
  } = useQuery<Record<string, Record<string, string>>>({
    queryKey: ['admin-i18n-contact'],
    queryFn: async () => {
      const res = await fetch('/api/admin/i18n/contact', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch labels');
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
      const res = await fetch('/api/admin/i18n/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-i18n-contact'] });
      toast({ title: 'Translations saved' });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });

  const setLabel = (lang: string, key: string, value: string) =>
    setLabelForm(prev => ({ ...prev, [lang]: { ...(prev[lang] ?? {}), [key]: value } }));

  // ── Auto-translate ─────────────────────────────────────────────────────────
  const handleAutoTranslate = async () => {
    if (activeLang === 'en') return;
    const enValues = labelForm['en'] ?? i18nData?.en ?? {};
    const texts = ALL_KEYS
      .map(key => ({ key, value: enValues[key] ?? '' }))
      .filter(item => item.value.trim() !== '');

    if (texts.length === 0) {
      toast({ title: 'No English text to translate', variant: 'destructive' });
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch('/api/admin/translations/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLanguage: activeLang }),
      });
      if (!res.ok) throw new Error('Translation request failed');
      const { results } = await res.json() as { results: Record<string, string> };
      setLabelForm(prev => ({
        ...prev,
        [activeLang]: { ...(prev[activeLang] ?? {}), ...results },
      }));
      toast({
        title: 'Auto-translation complete',
        description: `${Object.keys(results).length} fields translated to ${LANGUAGES.find(l => l.code === activeLang)?.label}`,
      });
    } catch {
      toast({ title: 'Translation failed', description: 'Could not reach the translation service.', variant: 'destructive' });
    } finally {
      setTranslating(false);
    }
  };

  const groupLabel = (key: string) => ({
    chatSupport:  'Chat to Support',
    chatToSelect: 'Chat to Select',
    visitUs:      'Visit Us',
    callUs:       'Call Us',
    formHeading:  'Form Heading',
  }[key] ?? key);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('admin.nav.contactSettings', 'Contact Settings')}
        description={t('admin.contact.description', 'Manage contact information and page labels shown on the Contact page.')}
      />

      <Tabs defaultValue="info">
        <TabsList className="mb-5">
          <TabsTrigger value="info">{t('admin.contact.tabInfo', 'Contact Info')}</TabsTrigger>
          <TabsTrigger value="labels">{t('admin.contact.tabLabels', 'Page Labels')}</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Contact Info ──────────────────────────────────────────── */}
        <TabsContent value="info">
          {infoLoading ? (
            <AdminFormSkeleton rows={3} className="max-w-lg" />
          ) : infoError ? (
            <AdminPageError
              title="Couldn't load contact info"
              message="The contact settings failed to load. The server may be unavailable."
              onRetry={() => refetchInfo()}
              className="max-w-lg"
            />
          ) : (
            <AdminCard
              title={t('admin.contact.infoTitle', 'Contact Information')}
              description={t('admin.contact.infoDesc', 'Email, phone number, and office address shown on the contact page.')}
              className="max-w-lg"
              footer={
                <AdminSaveButton
                  isPending={saveInfoMutation.isPending}
                  onClick={() => saveInfoMutation.mutate(infoForm)}
                  label={t('admin.contact.saveInfo', 'Save Contact Info')}
                  pendingLabel={t('admin.common.saving', 'Saving…')}
                  icon={<Mail className="h-4 w-4" />}
                />
              }
            >
              <div className="space-y-2">
                <Label className={`${LABEL_CN} flex items-center gap-2`}>
                  <Mail className="h-4 w-4 text-muted-foreground" />
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
                <Label className={`${LABEL_CN} flex items-center gap-2`}>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {t('contact.phone', 'Phone Number')}
                </Label>
                <Input
                  placeholder="+212 686 777 888"
                  value={infoForm.phone}
                  onChange={e => setInfoForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className={`${LABEL_CN} flex items-center gap-2`}>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {t('contact.visitUs', 'Office Address')}
                </Label>
                <Input
                  placeholder="Rabat Bouregreg, Morocco"
                  value={infoForm.officeAddress}
                  onChange={e => setInfoForm(f => ({ ...f, officeAddress: e.target.value }))}
                />
              </div>
            </AdminCard>
          )}
        </TabsContent>

        {/* ── Tab 2: Page Labels ───────────────────────────────────────────── */}
        <TabsContent value="labels">
          {i18nLoading ? (
            <AdminFormSkeleton rows={5} />
          ) : i18nError ? (
            <AdminPageError
              title="Couldn't load page labels"
              message="The translation data failed to load."
              onRetry={() => refetchI18n()}
            />
          ) : (
            <AdminCard
              title={t('admin.contact.labelsTitle', 'Page Labels & Translations')}
              description={t('admin.contact.labelsDesc', 'Edit the title and subtitle for each contact option, across all 4 languages.')}
              footer={
                <>
                  <AdminSaveButton
                    isPending={saveLabelsMutation.isPending}
                    onClick={() => saveLabelsMutation.mutate(labelForm)}
                    label={t('admin.contact.saveLabels', 'Save All Translations')}
                    pendingLabel={t('admin.common.saving', 'Saving…')}
                  />
                  <span className={HINT_CN}>
                    {t('admin.contact.saveHint', 'Saves labels for all 4 languages at once.')}
                  </span>
                </>
              }
            >
              {/* Language tabs + auto-translate button */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang.code)}
                      className={[
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        activeLang === lang.code
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted',
                      ].join(' ')}
                    >
                      <span aria-hidden>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>

                {activeLang !== 'en' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAutoTranslate}
                    disabled={translating}
                    className="ml-auto flex items-center gap-1.5 shrink-0"
                    title={`Auto-translate English → ${LANGUAGES.find(l => l.code === activeLang)?.label}`}
                  >
                    {translating
                      ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      : <Wand2 className="h-4 w-4" />}
                    {translating ? t('admin.contact.translating', 'Translating…') : t('admin.contact.autoTranslate', 'Auto Translate')}
                  </Button>
                )}
              </div>

              {/* Field groups for the active language */}
              <div
                className="space-y-3 mt-2"
                dir={LANGUAGES.find(l => l.code === activeLang)?.dir ?? 'ltr'}
              >
                {LABEL_FIELDS.map(field => {
                  const Icon = field.icon;
                  return (
                    <div key={field.group} className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
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
            </AdminCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
