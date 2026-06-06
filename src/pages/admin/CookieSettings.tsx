import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Cookie, Eye, EyeOff, Lock } from 'lucide-react';

interface CookieCategory {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  locked: boolean;
}

interface CookieSettingsData {
  enabled: boolean;
  delay: number;
  title: string;
  description: string;
  categories: CookieCategory[];
}

const DEFAULT: CookieSettingsData = {
  enabled: true,
  delay: 1500,
  title: '🍪 We use cookies to enhance your experience',
  description: 'Our cookies help us remember your preferences, analyze site traffic, and provide personalized content. Essential cookies are always active.',
  categories: [
    { key: 'necessary', label: 'Necessary Cookies', description: 'Required for basic site functionality', enabled: true, locked: true },
    { key: 'functional', label: 'Functional Cookies', description: 'Remember your preferences and settings', enabled: true, locked: false },
    { key: 'analytics', label: 'Analytics Cookies', description: 'Help us understand how our website is being used', enabled: true, locked: false },
    { key: 'marketing', label: 'Marketing Cookies', description: 'Personalized content and ads', enabled: true, locked: false },
  ],
};

export default function CookieSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CookieSettingsData>(DEFAULT);

  const { data, isLoading } = useQuery<CookieSettingsData>({
    queryKey: ['/api/cms/cookie-settings'],
    queryFn: async () => {
      const res = await apiFetch('/api/cms/cookie-settings');
      if (!res.ok) return DEFAULT;
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/admin/cms/cookie-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/cookie-settings'] });
      toast({ title: 'Saved', description: 'Cookie settings have been updated.' });
    },
    onError: (e: any) => {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    },
  });

  function updateCategory(key: string, field: keyof CookieCategory, value: any) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.key === key ? { ...c, [field]: value } : c
      ),
    }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cookie Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure the cookie consent banner shown to visitors and manage cookie categories.
          </p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />Save Changes</>
          )}
        </Button>
      </div>

      {/* Banner Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            Banner Visibility
          </CardTitle>
          <CardDescription>Control whether the cookie consent banner is shown to visitors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {form.enabled ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">{form.enabled ? 'Banner is visible' : 'Banner is hidden'}</p>
                <p className="text-sm text-muted-foreground">
                  {form.enabled
                    ? 'Visitors will see the cookie consent popup.'
                    : 'The banner is disabled and will not appear.'}
                </p>
              </div>
            </div>
            <Switch
              checked={form.enabled}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Banner Text */}
      <Card>
        <CardHeader>
          <CardTitle>Banner Text</CardTitle>
          <CardDescription>Customize the title and description shown in the cookie banner.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Banner Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Cookie banner title"
            />
          </div>
          <div className="space-y-2">
            <Label>Banner Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Explain why you use cookies…"
            />
          </div>
          <div className="space-y-2">
            <Label>Show Delay (milliseconds)</Label>
            <Input
              type="number"
              min={0}
              max={10000}
              value={form.delay}
              onChange={(e) => setForm((prev) => ({ ...prev, delay: Number(e.target.value) }))}
              className="w-40"
            />
            <p className="text-xs text-muted-foreground">
              How long to wait after page load before showing the banner. 0 = immediate.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Cookie Categories</CardTitle>
          <CardDescription>
            Configure which cookie categories are offered to visitors. Necessary cookies cannot be disabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.categories.map((cat) => (
            <div key={cat.key} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{cat.label}</span>
                    {cat.locked && (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Always Active
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Category Name</Label>
                      <Input
                        value={cat.label}
                        onChange={(e) => updateCategory(cat.key, 'label', e.target.value)}
                        placeholder="Cookie category name"
                        disabled={cat.locked}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <Input
                        value={cat.description}
                        onChange={(e) => updateCategory(cat.key, 'description', e.target.value)}
                        placeholder="What these cookies do"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-1">
                  <Switch
                    checked={cat.enabled}
                    disabled={cat.locked}
                    onCheckedChange={(checked) => updateCategory(cat.key, 'enabled', checked)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How the banner will appear to visitors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-md overflow-hidden max-w-xl">
            <div className="text-white p-3" style={{ backgroundColor: 'hsl(var(--primary))' }}>
              <p className="font-semibold text-sm">{form.title || '🍪 Cookie Banner'}</p>
            </div>
            <div className="p-4 space-y-3 bg-white">
              <p className="text-sm text-gray-700">{form.description}</p>
              <div className="space-y-2 border-t pt-3">
                {form.categories.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                    {cat.locked ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Always Active</span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${cat.enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.enabled ? 'On by default' : 'Off by default'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <span className="text-xs bg-primary/10 text-primary font-medium px-3 py-1.5 rounded">Accept All</span>
                <span className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded">Necessary Only</span>
                <span className="text-xs border px-3 py-1.5 rounded text-primary border-primary/40">Customize</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-6">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} size="lg">
          {saveMutation.isPending ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />Save Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
