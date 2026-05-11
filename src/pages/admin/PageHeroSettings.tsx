import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, ExternalLink, Image, Video, Palette, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PAGE_CONFIGS = [
  {
    key: "landing",
    label: "Landing",
    previewUrl: "/",
    defaultTitle: "Where Adventure Meets Transformation",
    defaultSubtitle: "Experience Morocco's soul through sustainable journeys.",
    defaultImage: "",
    note: "landing",
  },
  {
    key: "contact",
    label: "Contact",
    previewUrl: "/contact",
    defaultTitle: "Contact Us",
    defaultSubtitle: "Have questions about your next adventure? Our friendly team is here to help.",
    defaultImage: "/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png",
  },
  {
    key: "volunteers",
    label: "Volunteers",
    previewUrl: "/talents/volunteers/spontaneous",
    defaultTitle: "Spontaneous Volunteers",
    defaultSubtitle: "Make a difference during your Morocco journey.",
    defaultImage: "/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png",
  },
  {
    key: "blog",
    label: "Blog",
    previewUrl: "/news",
    defaultTitle: "Blog",
    defaultSubtitle: "Stay updated with the latest adventure tips, safety guidelines, and stories.",
    defaultImage: "/attached_assets/generated_images/Atlas_Mountain_Sunrise_9a8b7c6d.png",
  },
  {
    key: "projects",
    label: "Projects",
    previewUrl: "/projects",
    defaultTitle: "Our Projects",
    defaultSubtitle: "Making a difference through meaningful initiatives.",
    defaultImage: "/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png",
  },
  {
    key: "discover",
    label: "Discover",
    previewUrl: "/discover",
    defaultTitle: "Discover Morocco",
    defaultSubtitle: "Explore the wonders of the Kingdom.",
    defaultImage: "",
  },
  {
    key: "city-detail",
    label: "City Detail",
    previewUrl: "/discover",
    defaultTitle: "(Uses city name)",
    defaultSubtitle: "(Uses city description)",
    defaultImage: "(Uses city image by default)",
    note: "city-detail",
  },
] as const;

interface HeroFormData {
  backgroundType: string;
  backgroundImageUrl: string;
  backgroundVideoUrl: string;
  overlayOpacity: number;
  title: string;
  subtitle: string;
}

const DEFAULT_FORM: HeroFormData = {
  backgroundType: "image",
  backgroundImageUrl: "",
  backgroundVideoUrl: "",
  overlayOpacity: 50,
  title: "",
  subtitle: "",
};

function PageHeroForm({ pageKey, config, isLanding }: {
  pageKey: string;
  config: typeof PAGE_CONFIGS[number];
  isLanding?: boolean;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<HeroFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = isLanding ? "/api/cms/hero" : `/api/cms/page-hero/${pageKey}`;
    apiFetch(endpoint)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setForm({
            backgroundType: data.backgroundType || data.background_type || "image",
            backgroundImageUrl: data.backgroundImageUrl || data.background_image_url || data.backgroundImageUrl || "",
            backgroundVideoUrl: data.backgroundVideoUrl || data.background_video_url || "",
            overlayOpacity: data.overlayOpacity ?? data.backgroundOverlayOpacity ?? 50,
            title: data.title || "",
            subtitle: data.subtitle || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey, isLanding]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = isLanding
        ? "/api/admin/cms/hero"
        : `/api/admin/cms/page-hero/${pageKey}`;
      const method = "PUT";
      const payload = isLanding
        ? {
            backgroundType: form.backgroundType,
            backgroundVideoUrl: form.backgroundVideoUrl,
            backgroundOverlayOpacity: form.overlayOpacity,
          }
        : {
            backgroundType: form.backgroundType,
            backgroundImageUrl: form.backgroundImageUrl,
            backgroundVideoUrl: form.backgroundVideoUrl,
            overlayOpacity: form.overlayOpacity,
            title: form.title || null,
            subtitle: form.subtitle || null,
          };

      const res = await apiFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        toast({ title: "Saved", description: "Hero settings updated successfully." });
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast({ title: "Error", description: "Failed to save hero settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-5">
      {isLanding && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">Landing page — limited controls here</p>
            <p>This tab manages only the background type and video URL for the landing hero. For full control (typewriter texts, buttons, overlay color, typography) visit <Link to="/admin/customization/hero" className="underline font-medium">Hero Section Settings →</Link></p>
          </div>
        </div>
      )}

      {config.note === "city-detail" && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">City Detail — global override</p>
            <p>When Background Type is set to <strong>Video</strong>, all city detail pages will show the configured video instead of the city's own photo. For Image or Gradient types, each city uses its own photo.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4" /> Background
            </CardTitle>
            <CardDescription>Choose the background type and source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Background Type</Label>
              <Select
                value={form.backgroundType}
                onValueChange={v => setForm(f => ({ ...f, backgroundType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    <span className="flex items-center gap-2"><Image className="w-4 h-4" /> Image</span>
                  </SelectItem>
                  <SelectItem value="video">
                    <span className="flex items-center gap-2"><Video className="w-4 h-4" /> Video</span>
                  </SelectItem>
                  <SelectItem value="gradient">
                    <span className="flex items-center gap-2"><Palette className="w-4 h-4" /> Gradient</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.backgroundType === "image" && !isLanding && (
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  placeholder={config.defaultImage || "https://example.com/image.jpg"}
                  value={form.backgroundImageUrl}
                  onChange={e => setForm(f => ({ ...f, backgroundImageUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Direct URL to image. Leave blank to use the default.</p>
              </div>
            )}

            {form.backgroundType === "video" && (
              <div className="space-y-1.5">
                <Label>Video URL</Label>
                <Input
                  placeholder="https://example.com/hero.mp4"
                  value={form.backgroundVideoUrl}
                  onChange={e => setForm(f => ({ ...f, backgroundVideoUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Direct URL to an MP4 or WebM file. Supports Cloudinary, Bunny CDN, or any direct video URL.
                </p>
                {form.backgroundVideoUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border aspect-video bg-black/10">
                    <video
                      src={form.backgroundVideoUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      controls
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Overlay Opacity: {form.overlayOpacity}%</Label>
              <Slider
                min={0}
                max={90}
                step={5}
                value={[form.overlayOpacity]}
                onValueChange={([v]) => setForm(f => ({ ...f, overlayOpacity: v }))}
              />
              <p className="text-xs text-muted-foreground">Controls the dark overlay over the background. Higher = darker.</p>
            </div>
          </CardContent>
        </Card>

        {!isLanding && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content Override</CardTitle>
              <CardDescription>Leave blank to use the page defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  placeholder={config.defaultTitle}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Subtitle</Label>
                <Textarea
                  placeholder={config.defaultSubtitle}
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save Changes"}
        </Button>
        <Button variant="outline" asChild>
          <a href={config.previewUrl} target="_blank" rel="noopener noreferrer">
            <Eye className="w-4 h-4 mr-2" />
            Preview Page
            <ExternalLink className="w-3 h-3 ml-1.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export default function PageHeroSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Hero Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage hero backgrounds (image, video, gradient) for each page. Video backgrounds play automatically, muted, on loop.
        </p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          {PAGE_CONFIGS.map(p => (
            <TabsTrigger key={p.key} value={p.key}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGE_CONFIGS.map(p => (
          <TabsContent key={p.key} value={p.key} className="mt-4">
            <PageHeroForm
              pageKey={p.key}
              config={p}
              isLanding={p.key === "landing"}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
