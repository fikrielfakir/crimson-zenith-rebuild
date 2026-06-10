import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Languages, Save, RefreshCw, Eye, Info } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

interface AboutForm {
  title: string;
  subtitle: string;
  description: string;
  whoWeAreTitle: string;
  whoWeAreParagraph2: string;
  valuesTitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

interface Translation {
  title: string;
  subtitle: string;
  description: string;
  whoWeAreTitle: string;
  whoWeAreParagraph2: string;
  valuesTitle: string;
  ctaTitle: string;
  ctaDescription: string;
}

const FIELDS: { key: keyof AboutForm; label: string; multiline?: boolean; hint?: string }[] = [
  { key: "title", label: "Hero Title" },
  { key: "subtitle", label: "Hero Subtitle", multiline: true },
  { key: "description", label: "Who We Are — Paragraph 1", multiline: true },
  { key: "whoWeAreTitle", label: "Who We Are — Section Heading" },
  { key: "whoWeAreParagraph2", label: "Who We Are — Paragraph 2", multiline: true },
  { key: "valuesTitle", label: "Values Section Title" },
  { key: "ctaTitle", label: "Call-to-Action Title" },
  { key: "ctaDescription", label: "Call-to-Action Subtitle", multiline: true },
];

const DEFAULT_FORM: AboutForm = {
  title: "About The Journey Association",
  subtitle: "Morocco's leading network of adventure and cultural clubs, dedicated to inspiring youth through exploration, community, and purpose.",
  description: "The Journey Association (جمعية الرحلة) was founded with a simple belief: that every young Moroccan deserves the opportunity to discover their country, connect with its heritage, and grow through adventure.",
  whoWeAreTitle: "Who We Are",
  whoWeAreParagraph2: "We organize treks, cultural tours, sporting events, and community projects that bring people together across Morocco's cities, mountains, and deserts.",
  valuesTitle: "What Drives Us",
  ctaTitle: "Ready to Join the Journey?",
  ctaDescription: "Become a member of one of our clubs and start exploring Morocco with like-minded adventurers.",
};

export default function AboutManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<AboutForm>(DEFAULT_FORM);
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    fr: {} as Translation,
    ar: {} as Translation,
    es: {} as Translation,
  });
  const [translating, setTranslating] = useState<string | null>(null);

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["admin-about-settings"],
    queryFn: async () => {
      const r = await apiFetch("/api/admin/cms/about");
      return r.json();
    },
  });

  useEffect(() => {
    if (!aboutData) return;
    setForm({
      title: aboutData.title ?? DEFAULT_FORM.title,
      subtitle: aboutData.subtitle ?? DEFAULT_FORM.subtitle,
      description: aboutData.description ?? DEFAULT_FORM.description,
      whoWeAreTitle: aboutData.whoWeAreTitle ?? DEFAULT_FORM.whoWeAreTitle,
      whoWeAreParagraph2: aboutData.whoWeAreParagraph2 ?? DEFAULT_FORM.whoWeAreParagraph2,
      valuesTitle: aboutData.valuesTitle ?? DEFAULT_FORM.valuesTitle,
      ctaTitle: aboutData.ctaTitle ?? DEFAULT_FORM.ctaTitle,
      ctaDescription: aboutData.ctaDescription ?? DEFAULT_FORM.ctaDescription,
    });
    if (aboutData.translations) {
      setTranslations((prev) => ({ ...prev, ...aboutData.translations }));
    }
  }, [aboutData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const r = await apiFetch("/api/admin/cms/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, translations }),
      });
      if (!r.ok) throw new Error("Failed to save");
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-about-settings"] });
      toast({ title: t('admin.about.savedTitle'), description: t('admin.about.savedDesc') });
    },
    onError: () => {
      toast({ title: t('admin.common.error'), description: t('admin.about.saveError'), variant: "destructive" });
    },
  });

  const handleAutoTranslate = async (langCode: string) => {
    setTranslating(langCode);
    try {
      const texts = FIELDS.map(({ key }) => ({ key, value: form[key] || "" }));
      const r = await apiFetch("/api/admin/translations/auto-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts, targetLanguage: langCode }),
      });
      const data = await r.json();
      if (data.results) {
        setTranslations((prev) => ({
          ...prev,
          [langCode]: { ...prev[langCode], ...data.results },
        }));
        toast({ title: t('admin.about.translatedTitle'), description: `Auto-translated to ${LANGUAGES.find(l => l.code === langCode)?.label}.` });
      }
    } catch {
      toast({ title: t('admin.common.error'), description: t('admin.about.translationFailed'), variant: "destructive" });
    } finally {
      setTranslating(null);
    }
  };

  const updateTranslation = (lang: string, field: keyof Translation, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: { ...(prev[lang] ?? {}), [field]: value },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading about settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.about.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the content for the public <a href="/about" target="_blank" className="underline text-primary">/about</a> page. Use auto-translate to generate French, Arabic, and Spanish versions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/about" target="_blank"><Eye className="w-4 h-4 mr-1" /> {t('admin.common.preview')}</a>
          </Button>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? t('admin.common.saving') : t('admin.common.save')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">🇬🇧 {t('admin.about.englishTabLabel')}</TabsTrigger>
          {LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* English tab */}
        <TabsContent value="en" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.about.englishContent')}</CardTitle>
              <CardDescription>
                {t('admin.about.englishContentDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {FIELDS.map(({ key, label, multiline }) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  {multiline ? (
                    <Textarea
                      value={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={3}
                      className="resize-y"
                    />
                  ) : (
                    <Input
                      value={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language tabs */}
        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{lang.flag} {lang.label} {t('admin.about.translationSuffix')}</CardTitle>
                    <CardDescription>
                      {t('admin.about.translationCardDesc', { lang: lang.label })}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleAutoTranslate(lang.code)}
                    disabled={translating === lang.code}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${translating === lang.code ? "animate-spin" : ""}`} />
                    {translating === lang.code ? t('admin.about.translating') : t('admin.about.autoTranslate')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4" dir={lang.code === "ar" ? "rtl" : "ltr"}>
                {translations[lang.code] && Object.keys(translations[lang.code]).length > 0 ? (
                  FIELDS.map(({ key, label, multiline }) => (
                    <div key={key} className="space-y-1">
                      <Label>{label}</Label>
                      {multiline ? (
                        <Textarea
                          value={(translations[lang.code] as any)?.[key] ?? ""}
                          onChange={(e) => updateTranslation(lang.code, key as keyof Translation, e.target.value)}
                          rows={3}
                          className="resize-y"
                        />
                      ) : (
                        <Input
                          value={(translations[lang.code] as any)?.[key] ?? ""}
                          onChange={(e) => updateTranslation(lang.code, key as keyof Translation, e.target.value)}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground space-y-3">
                    <Languages className="w-10 h-10 mx-auto opacity-40" />
                    <p>{t('admin.about.noTranslation', { lang: lang.label })}</p>
                    <Button variant="outline" onClick={() => handleAutoTranslate(lang.code)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {t('admin.about.generateTranslation')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? t('admin.common.saving') : t('admin.about.saveAllChanges')}
        </Button>
      </div>
    </div>
  );
}
