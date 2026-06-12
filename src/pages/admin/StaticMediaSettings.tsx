import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/apiFetch";
import { MEDIA_KEYS, setStaticMediaStore, getStaticMediaStore } from "@/lib/staticMedia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, RefreshCw, Image, Globe } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const KEY_META: Record<string, { label: string; description: string; group: string }> = {
  [MEDIA_KEYS.HERO_BG]:          { label: "Hero Background",          description: "Main landing page hero section background image",         group: "Landing Page" },
  [MEDIA_KEYS.PATTERN_002]:      { label: "Decorative Pattern",        description: "Bottom-of-hero wave/pattern overlay image",              group: "Landing Page" },
  [MEDIA_KEYS.PRESIDENT_PHOTO]:  { label: "President Photo",           description: "Portrait shown in the President Message section",        group: "Landing Page" },
  [MEDIA_KEYS.NO_EVENTS]:        { label: "No Events Placeholder",     description: "Image shown when no events are available",              group: "Events" },
  [MEDIA_KEYS.GNAOUA]:           { label: "Gnaoua Festival Image",     description: "Gnaoua festival event card fallback image",             group: "Events" },
  [MEDIA_KEYS.TIMITAR]:          { label: "Timitar Festival Image",    description: "Timitar festival event card fallback image",            group: "Events" },
  [MEDIA_KEYS.BIRD_LOGO]:        { label: "Bird Logo",                 description: "Bird/association logo shown in clubs map view",         group: "Clubs" },
  [MEDIA_KEYS.CITY_TANGIER]:     { label: "Tangier City Image",        description: "Background image for Tangier city pages",              group: "Cities" },
  [MEDIA_KEYS.CITY_TETOUAN]:     { label: "Tetouan City Image",        description: "Background image for Tetouan city pages",              group: "Cities" },
  [MEDIA_KEYS.CITY_ALHOCEIMA]:   { label: "Al Hoceima City Image",     description: "Background image for Al Hoceima city pages",           group: "Cities" },
  [MEDIA_KEYS.CITY_CHEFCHAOUEN]: { label: "Chefchaouen City Image",    description: "Background image for Chefchaouen city pages",          group: "Cities" },
  [MEDIA_KEYS.CITY_FES]:         { label: "Fes City Image",            description: "Background image for Fes city pages / Projects hero",  group: "Cities" },
  [MEDIA_KEYS.CITY_ESSAOUIRA]:   { label: "Essaouira City Image",      description: "Auth pages, Contact, News, Blog hero background",      group: "Cities" },
  [MEDIA_KEYS.CITY_HERITAGE]:    { label: "Moroccan Heritage Image",   description: "Generic heritage architecture image preset",           group: "Cities" },
  [MEDIA_KEYS.CITY_FESTIVAL]:    { label: "Moroccan Festival Image",   description: "Generic festival/entertainment image preset",          group: "Cities" },
};

const GROUPS = ["Landing Page", "Events", "Clubs", "Cities"];

export default function StaticMediaSettings() {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/cms/static-media");
      if (res.ok) {
        const data = await res.json();
        setValues(data ?? {});
        setStaticMediaStore(data ?? {});
      }
    } catch {
      toast({ title: "Failed to load", description: "Could not fetch static media settings.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    const current = getStaticMediaStore();
    const hasData = Object.keys(current).some(k => current[k]);
    if (hasData) {
      setValues({ ...current });
      setLoading(false);
    } else {
      load();
    }
  }, []);

  const handleChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/cms/static-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setStaticMediaStore(updated);
      toast({ title: "Saved", description: "Static media settings updated." });
    } catch {
      toast({ title: "Save failed", description: "Could not save settings.", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleClear = (key: string) => {
    setValues(prev => ({ ...prev, [key]: "" }));
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Image className="w-6 h-6" />
              Static Media Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Override the default hardcoded images used across the site. Leave a field blank to keep the built-in fallback.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Reload
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving…" : "Save All"}
            </Button>
          </div>
        </div>

        {GROUPS.map(group => {
          const keys = Object.entries(KEY_META).filter(([, m]) => m.group === group);
          return (
            <Card key={group}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{group}</CardTitle>
                <CardDescription className="text-xs">
                  Images used by the {group.toLowerCase()} section of the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {keys.map(([key, meta], idx) => {
                  const val = values[key] ?? "";
                  return (
                    <div key={key}>
                      {idx > 0 && <Separator className="mb-5" />}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">{meta.label}</Label>
                          <p className="text-xs text-muted-foreground">{meta.description}</p>
                          <Badge variant="outline" className="text-xs font-mono">{key}</Badge>
                        </div>

                        <div className="lg:col-span-2 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://example.com/image.jpg  (leave blank for default)"
                              value={val}
                              onChange={e => handleChange(key, e.target.value)}
                              className="flex-1 font-mono text-xs"
                            />
                            {val && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleClear(key)}
                                className="shrink-0"
                              >
                                Clear
                              </Button>
                            )}
                          </div>

                          {val && (
                            <div className="flex items-start gap-3 p-2 bg-muted/40 rounded-md">
                              <img
                                src={val}
                                alt={meta.label}
                                className="w-20 h-14 object-cover rounded border shrink-0"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                              <a
                                href={val}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                <Globe className="w-3 h-3" />
                                Open in new tab
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-end pb-6">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving…" : "Save All Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
