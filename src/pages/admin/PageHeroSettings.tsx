import { useState, useEffect, useRef } from "react";
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
import { Save, Eye, ExternalLink, Image, Video, Palette, AlertCircle, Upload, X, Loader2 } from "lucide-react";
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
    defaultImage: "",
  },
  {
    key: "volunteers",
    label: "Volunteers",
    previewUrl: "/talents/volunteers/spontaneous",
    defaultTitle: "Spontaneous Volunteers",
    defaultSubtitle: "Make a difference during your Morocco journey.",
    defaultImage: "",
  },
  {
    key: "blog",
    label: "Blog",
    previewUrl: "/news",
    defaultTitle: "Blog",
    defaultSubtitle: "Stay updated with the latest adventure tips, safety guidelines, and stories.",
    defaultImage: "",
  },
  {
    key: "projects",
    label: "Projects",
    previewUrl: "/projects",
    defaultTitle: "Our Projects",
    defaultSubtitle: "Making a difference through meaningful initiatives.",
    defaultImage: "",
  },
  {
    key: "discover",
    label: "Discover",
    previewUrl: "/discover",
    defaultTitle: "Discover Morocco",
    defaultSubtitle: "Explore the wonders of the Kingdom.",
    defaultImage: "",
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

function MediaUploadField({
  mediaType,
  value,
  onChange,
  accept,
  placeholder,
}: {
  mediaType: "image" | "video";
  value: string;
  onChange: (url: string) => void;
  accept: string;
  placeholder: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeMB = mediaType === "video" ? 200 : 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", mediaType);

      const res = await apiFetch("/api/admin/cms/page-hero-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
      toast({
        title: "Uploaded",
        description: `${mediaType === "image" ? "Image" : "Video"} uploaded successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "Could not upload file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 font-mono text-xs"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          title={`Upload ${mediaType}`}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            title="Clear"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      {uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Uploading {mediaType}…
        </div>
      )}
    </div>
  );
}

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
    apiFetch(`/api/cms/page-hero/${pageKey}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setForm({
            backgroundType: data.backgroundType || data.background_type || "image",
            backgroundImageUrl: data.backgroundImageUrl || data.background_image_url || "",
            backgroundVideoUrl: data.backgroundVideoUrl || data.background_video_url || "",
            overlayOpacity: data.overlayOpacity ?? data.backgroundOverlayOpacity ?? 50,
            title: data.title || "",
            subtitle: data.subtitle || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        backgroundType: form.backgroundType,
        backgroundImageUrl: form.backgroundImageUrl,
        backgroundVideoUrl: form.backgroundVideoUrl,
        overlayOpacity: form.overlayOpacity,
        title: form.title || null,
        subtitle: form.subtitle || null,
      };

      const res = await apiFetch(`/api/admin/cms/page-hero/${pageKey}`, {
        method: "PUT",
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
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
      </div>
    );
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

      {(config as any).note === "city-detail" && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">City Detail — global override</p>
            <p>When Background Type is set to <strong>Video</strong>, all city detail pages will show the configured video instead of the city's own photo.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4" /> Background
            </CardTitle>
            <CardDescription>Choose the background type and upload or link media</CardDescription>
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

            {form.backgroundType === "image" && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" /> Background Image
                </Label>
                <MediaUploadField
                  mediaType="image"
                  value={form.backgroundImageUrl}
                  onChange={url => setForm(f => ({ ...f, backgroundImageUrl: url }))}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  placeholder="https://example.com/hero.jpg or upload ↑"
                />
                <p className="text-xs text-muted-foreground">
                  Upload an image file (JPG, PNG, WebP · max 10 MB) or paste a direct URL. Leave blank to use the page default.
                </p>
                {form.backgroundImageUrl && !form.backgroundImageUrl.startsWith("data:") && (
                  <div className="mt-2 rounded-lg overflow-hidden border aspect-video bg-black/5">
                    <img
                      src={form.backgroundImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
                {form.backgroundImageUrl && form.backgroundImageUrl.startsWith("data:") && (
                  <div className="mt-2 rounded-lg overflow-hidden border aspect-video bg-black/5">
                    <img
                      src={form.backgroundImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {form.backgroundType === "video" && (
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Background Video
                </Label>
                <MediaUploadField
                  mediaType="video"
                  value={form.backgroundVideoUrl}
                  onChange={url => setForm(f => ({ ...f, backgroundVideoUrl: url }))}
                  accept="video/mp4,video/webm,video/ogg"
                  placeholder="https://example.com/hero.mp4 or upload ↑"
                />
                <p className="text-xs text-muted-foreground">
                  Upload an MP4 or WebM file (max 200 MB) or paste a direct video URL. Video plays automatically, muted, on loop.
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
          Upload or link background images and videos for each page's hero section.
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
