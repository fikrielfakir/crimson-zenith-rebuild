import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { Save, Eye, Plus, Trash2, GripVertical, Loader2, Type } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';

const FONT_SIZES = ['24px', '32px', '40px', '48px', '56px', '64px', '72px', '80px'];
const TEXT_ALIGNS = ['left', 'center', 'right'];

interface TaglineEntry {
  text: string;
  twoLines?: boolean;
}

export default function HeroSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Content
  const [taglines, setTaglines] = useState<TaglineEntry[]>([
    { text: 'Where Adventure Meets\nTransformation', twoLines: true },
  ]);
  const [subtitle, setSubtitle] = useState(
    "Experience Morocco's soul through sustainable journeys. Discover culture, embrace adventure, and create lasting connections with local communities."
  );

  // Buttons
  const [primaryButtonText, setPrimaryButtonText] = useState('Start Your Journey');
  const [primaryButtonLink, setPrimaryButtonLink] = useState('/discover');
  const [secondaryButtonText, setSecondaryButtonText] = useState('Explore Clubs');
  const [secondaryButtonLink, setSecondaryButtonLink] = useState('/clubs');
  const [showPrimaryButton, setShowPrimaryButton] = useState(true);
  const [showSecondaryButton, setShowSecondaryButton] = useState(true);

  // Background
  const [backgroundType, setBackgroundType] = useState<'image' | 'video' | 'gradient'>('image');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [backgroundOverlayColor, setBackgroundOverlayColor] = useState('rgba(26, 54, 93, 0.7)');
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState('70');

  // Typography
  const [titleFontSize, setTitleFontSize] = useState('64px');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [titleAlignment, setTitleAlignment] = useState('center');
  const [subtitleFontSize, setSubtitleFontSize] = useState('20px');
  const [subtitleColor, setSubtitleColor] = useState('#ffffff');
  const [subtitleAlignment, setSubtitleAlignment] = useState('center');

  // Layout
  const [heroHeight, setHeroHeight] = useState('600');
  const [contentMaxWidth, setContentMaxWidth] = useState('800');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiFetch('/api/cms/hero');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // title is now a JSON array of {text, twoLines} objects
          if (Array.isArray(data.title) && data.title.length > 0) {
            setTaglines(
              data.title.map((t: any) =>
                typeof t === 'string' ? { text: t, twoLines: false } : { text: t.text ?? '', twoLines: !!t.twoLines }
              )
            );
          }

          setSubtitle(data.subtitle ?? '');
          setPrimaryButtonText(data.primaryButtonText ?? 'Start Your Journey');
          setPrimaryButtonLink(data.primaryButtonLink ?? '/discover');
          setSecondaryButtonText(data.secondaryButtonText ?? 'Explore Clubs');
          setSecondaryButtonLink(data.secondaryButtonLink ?? '/clubs');
          setShowPrimaryButton(data.showPrimaryButton ?? true);
          setShowSecondaryButton(data.showSecondaryButton ?? true);
          setBackgroundType(data.backgroundType ?? 'image');
          setBackgroundImageUrl(data.backgroundImageUrl ?? '');
          setBackgroundOverlayColor(data.backgroundOverlayColor ?? 'rgba(26, 54, 93, 0.7)');
          setBackgroundOverlayOpacity(String(data.backgroundOverlayOpacity ?? '70'));
          setTitleFontSize(data.titleFontSize ?? '64px');
          setTitleColor(data.titleColor ?? '#ffffff');
          setTitleAlignment(data.titleAlignment ?? 'center');
          setSubtitleFontSize(data.subtitleFontSize ?? '20px');
          setSubtitleColor(data.subtitleColor ?? '#ffffff');
          setSubtitleAlignment(data.subtitleAlignment ?? 'center');
          setHeroHeight(String(data.heroHeight ?? '600'));
          setContentMaxWidth(String(data.contentMaxWidth ?? '800'));
        }
      }
    } catch (error) {
      console.error('Error loading hero settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (taglines.length === 0 || taglines.every(t => !t.text.trim())) {
      toast({ title: t('admin.hero.validationError'), description: 'Add at least one title', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      // Build JSON payload — no FormData, so all fields are reliably sent
      const payload = {
        title: taglines.filter(t => t.text.trim()),  // JSON array of {text, twoLines}
        subtitle,
        enableTypewriter: true,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink,
        showPrimaryButton,
        showSecondaryButton,
        backgroundType,
        backgroundImageUrl,
        backgroundOverlayColor,
        backgroundOverlayOpacity,
        titleFontSize,
        titleColor,
        titleAlignment,
        subtitleFontSize,
        subtitleColor,
        subtitleAlignment,
        heroHeight,
        contentMaxWidth,
      };

      const response = await apiFetch('/api/admin/cms/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: t('admin.hero.saved') });
      } else {
        const err = await response.text();
        throw new Error(err || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Error saving hero settings:', error);
      toast({ title: t('admin.hero.saveError'), description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };


  // ── Tagline helpers ───────────────────────────────────────────────────────
  const addTagline = () => setTaglines(prev => [...prev, { text: '', twoLines: true }]);

  const updateTagline = (i: number, patch: Partial<TaglineEntry>) =>
    setTaglines(prev => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const removeTagline = (i: number) =>
    setTaglines(prev => prev.filter((_, idx) => idx !== i));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.hero.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.hero.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/', '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            {t('admin.common.preview')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? t('admin.common.saving') : t('admin.settings.saveChanges')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">{t('admin.hero.tabContent')}</TabsTrigger>
          <TabsTrigger value="buttons">{t('admin.hero.tabButtons')}</TabsTrigger>
          <TabsTrigger value="background">{t('admin.hero.tabBackground')}</TabsTrigger>
          <TabsTrigger value="typography">{t('admin.hero.tabTypography')}</TabsTrigger>
          <TabsTrigger value="layout">{t('admin.hero.tabLayout')}</TabsTrigger>
        </TabsList>

        {/* ── Content Tab ─────────────────────────────────────────────── */}
        <TabsContent value="content" className="space-y-5">

          {/* Animated Titles */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    {t('admin.hero.animatedTitles')}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t('admin.hero.animatedTitlesDesc')}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addTagline}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  {t('admin.hero.addTitle')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {taglines.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  <Type className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{t('admin.hero.noTitles')}</p>
                </div>
              )}

              {taglines.map((tagline, i) => (
                <div key={i} className="group flex items-start gap-3 rounded-lg border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
                  {/* Drag handle (visual only) */}
                  <div className="mt-2.5 text-muted-foreground opacity-40 group-hover:opacity-70 shrink-0 cursor-grab">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {t('admin.hero.titleN', { n: i + 1 })}
                      </span>
                      <Switch
                        id={`twolines-${i}`}
                        checked={tagline.twoLines ?? true}
                        onCheckedChange={(v) => updateTagline(i, { twoLines: v })}
                        className="scale-75"
                      />
                      <Label htmlFor={`twolines-${i}`} className="text-xs text-muted-foreground cursor-pointer">
                        {t('admin.hero.twoLineLayout')}
                      </Label>
                    </div>

                    <Textarea
                      value={tagline.text}
                      onChange={(e) => updateTagline(i, { text: e.target.value })}
                      placeholder={`Animated title ${i + 1}…  (use Enter / \\n for line break)`}
                      rows={tagline.twoLines ? 2 : 1}
                      className="resize-none font-semibold text-base leading-snug"
                    />

                    {/* Live mini-preview */}
                    {tagline.text.trim() && (
                      <div className="rounded bg-[#112250] px-3 py-2 text-white text-sm font-bold whitespace-pre-line leading-tight">
                        {tagline.text}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 shrink-0 mt-1">
                    <TranslateDialog
                      entityType="hero_tagline"
                      entityId={i}
                      entityLabel={`Title ${i + 1}`}
                      fields={[{ key: 'text', label: 'Title text' }]}
                      sourceValues={{ text: tagline.text }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTagline(i)}
                      disabled={taglines.length === 1}
                      title={t('admin.pageHero.removeTitle')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addTagline} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.hero.addAnotherTitle')}
              </Button>
            </CardContent>
          </Card>

          {/* Subtitle */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.hero.subtitleLabel')}</CardTitle>
              <CardDescription>{t('admin.hero.subtitleDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-start">
                <Textarea
                  id="hero-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Your compelling subtitle describing the association…"
                  rows={3}
                  className="flex-1"
                />
                <TranslateDialog
                  entityType="hero_settings"
                  entityId="subtitle"
                  entityLabel="Hero Subtitle"
                  fields={[{ key: 'subtitle', label: 'Subtitle', multiline: true }]}
                  sourceValues={{ subtitle }}
                />
              </div>
              {subtitle.trim() && (
                <div className="rounded bg-[#112250] px-4 py-3 text-white/80 text-sm italic leading-relaxed">
                  {subtitle}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Buttons Tab ──────────────────────────────────────────────── */}
        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.hero.ctaButtonsTitle')}</CardTitle>
              <CardDescription>{t('admin.hero.ctaButtonsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={showPrimaryButton} onCheckedChange={setShowPrimaryButton} />
                  <Label>{t('admin.hero.showPrimaryBtn')}</Label>
                </div>
                {showPrimaryButton && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label>{t('admin.cities.buttonText', 'Button Text')}</Label>
                      <div className="flex gap-2 items-start">
                        <Input value={primaryButtonText} onChange={(e) => setPrimaryButtonText(e.target.value)} className="flex-1" />
                        <TranslateDialog
                          entityType="hero_settings"
                          entityId="primary_button"
                          entityLabel="Primary Button Text"
                          fields={[{ key: 'primaryButtonText', label: 'Button Text' }]}
                          sourceValues={{ primaryButtonText }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('admin.cities.buttonLink', 'Button Link')}</Label>
                      <Input value={primaryButtonLink} onChange={(e) => setPrimaryButtonLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={showSecondaryButton} onCheckedChange={setShowSecondaryButton} />
                  <Label>{t('admin.hero.showSecondaryBtn')}</Label>
                </div>
                {showSecondaryButton && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label>{t('admin.cities.buttonText', 'Button Text')}</Label>
                      <div className="flex gap-2 items-start">
                        <Input value={secondaryButtonText} onChange={(e) => setSecondaryButtonText(e.target.value)} className="flex-1" />
                        <TranslateDialog
                          entityType="hero_settings"
                          entityId="secondary_button"
                          entityLabel="Secondary Button Text"
                          fields={[{ key: 'secondaryButtonText', label: 'Button Text' }]}
                          sourceValues={{ secondaryButtonText }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('admin.cities.buttonLink', 'Button Link')}</Label>
                      <Input value={secondaryButtonLink} onChange={(e) => setSecondaryButtonLink(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Background Tab ───────────────────────────────────────────── */}
        <TabsContent value="background" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.hero.backgroundTitle')}</CardTitle>
              <CardDescription>{t('admin.hero.backgroundDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>{t('admin.hero.backgroundType')}</Label>
                <Select value={backgroundType} onValueChange={(v: 'image' | 'video' | 'gradient') => setBackgroundType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">{t('admin.hero.bgImage')}</SelectItem>
                    <SelectItem value="video">{t('admin.hero.bgVideo')}</SelectItem>
                    <SelectItem value="gradient">{t('admin.hero.bgGradient')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {backgroundType === 'image' && (
                <div className="space-y-3">
                  <ImageUpload
                    label={t('admin.hero.backgroundImage')}
                    description="JPG, PNG, WebP — recommended 1920×1080px"
                    value={backgroundImageUrl}
                    onChange={setBackgroundImageUrl}
                  />
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">{t('admin.hero.orPasteUrl')}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Input
                    value={backgroundImageUrl}
                    onChange={(e) => setBackgroundImageUrl(e.target.value)}
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>
              )}

              {backgroundType === 'video' && (
                <div className="space-y-2">
                  <Label>{t('admin.hero.videoUrl')}</Label>
                  <Input
                    value={backgroundImageUrl}
                    onChange={(e) => setBackgroundImageUrl(e.target.value)}
                    placeholder="https://example.com/hero.mp4"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.hero.overlayColor')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={backgroundOverlayColor.replace(/rgba?\([^)]+\)/, '#112250')}
                      onChange={(e) => setBackgroundOverlayColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={backgroundOverlayColor}
                      onChange={(e) => setBackgroundOverlayColor(e.target.value)}
                      placeholder="rgba(26, 54, 93, 0.7)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.hero.overlayOpacity')}</Label>
                  <Input
                    type="number"
                    value={backgroundOverlayOpacity}
                    onChange={(e) => setBackgroundOverlayOpacity(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Typography Tab ───────────────────────────────────────────── */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.hero.typographyTitle')}</CardTitle>
              <CardDescription>{t('admin.hero.typographyDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 border-b pb-6">
                <h4 className="font-semibold">{t('admin.hero.titleStyling')}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.hero.fontSizeLabel')}</Label>
                    <Select value={titleFontSize} onValueChange={setTitleFontSize}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.hero.textColorLabel')}</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-14 h-10 p-1 cursor-pointer" />
                      <Input value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.hero.alignmentLabel')}</Label>
                    <Select value={titleAlignment} onValueChange={setTitleAlignment}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TEXT_ALIGNS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">{t('admin.hero.subtitleStyling')}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.hero.fontSizeLabel')}</Label>
                    <Select value={subtitleFontSize} onValueChange={setSubtitleFontSize}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.slice(0, 5).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.hero.textColorLabel')}</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="w-14 h-10 p-1 cursor-pointer" />
                      <Input value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.hero.alignmentLabel')}</Label>
                    <Select value={subtitleAlignment} onValueChange={setSubtitleAlignment}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TEXT_ALIGNS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Layout Tab ───────────────────────────────────────────────── */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.hero.layoutTitle')}</CardTitle>
              <CardDescription>{t('admin.hero.layoutDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.hero.heroHeight')}</Label>
                  <Input type="number" value={heroHeight} onChange={(e) => setHeroHeight(e.target.value)} min="400" max="1000" />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.hero.contentMaxWidth')}</Label>
                  <Input type="number" value={contentMaxWidth} onChange={(e) => setContentMaxWidth(e.target.value)} min="600" max="1400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
