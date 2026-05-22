import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Languages, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

const LANGUAGES = [
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export interface TranslateField {
  key: string;
  label: string;
  multiline?: boolean;
}

interface Translation {
  id: number;
  entityType: string;
  entityId: string;
  field: string;
  language: string;
  value: string;
}

interface Props {
  entityType: string;
  entityId: string | number;
  entityLabel: string;
  fields: TranslateField[];
}

export function TranslateDialog({ entityType, entityId, entityLabel, fields }: Props) {
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function loadTranslations() {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/translations/${entityType}/${entityId}`);
      if (!res.ok) throw new Error('Failed to load');
      const data: Translation[] = await res.json();
      const built: Record<string, Record<string, string>> = {};
      for (const t of data) {
        if (!built[t.language]) built[t.language] = {};
        built[t.language][t.field] = t.value;
      }
      setDrafts(built);
    } catch {
      toast({ title: 'Could not load existing translations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    loadTranslations();
  }

  const saveMutation = useMutation({
    mutationFn: async ({ language, field, value }: { language: string; field: string; value: string }) => {
      const res = await apiFetch('/api/admin/translations', {
        method: 'POST',
        body: JSON.stringify({
          entityType,
          entityId: String(entityId),
          field,
          language,
          value,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
  });

  async function saveAll() {
    const tasks: Array<{ language: string; field: string; value: string }> = [];
    for (const lang of LANGUAGES) {
      for (const f of fields) {
        const val = drafts[lang.code]?.[f.key]?.trim();
        if (val) tasks.push({ language: lang.code, field: f.key, value: val });
      }
    }
    if (tasks.length === 0) {
      toast({ title: 'Nothing to save', description: 'Add at least one translation first.' });
      return;
    }
    try {
      await Promise.all(tasks.map((t) => saveMutation.mutateAsync(t)));
      queryClient.invalidateQueries({ queryKey: [`/api/translations/${entityType}`] });
      toast({ title: 'Translations saved' });
      setOpen(false);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  }

  function setValue(lang: string, field: string, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [lang]: { ...(prev[lang] ?? {}), [field]: value },
    }));
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpen} title="Manage translations">
        <Languages className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Translate: {entityLabel}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="ar">
              <TabsList>
                {LANGUAGES.map((lang) => (
                  <TabsTrigger key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {LANGUAGES.map((lang) => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
                  {fields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label>{f.label}</Label>
                      {f.multiline ? (
                        <Textarea
                          value={drafts[lang.code]?.[f.key] ?? ''}
                          onChange={(e) => setValue(lang.code, f.key, e.target.value)}
                          rows={f.key === 'content' ? 7 : 3}
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                          placeholder={`${f.label} in ${lang.label}`}
                        />
                      ) : (
                        <Input
                          value={drafts[lang.code]?.[f.key] ?? ''}
                          onChange={(e) => setValue(lang.code, f.key, e.target.value)}
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                          placeholder={`${f.label} in ${lang.label}`}
                        />
                      )}
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAll} disabled={saveMutation.isPending || loading}>
              {saveMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
              ) : (
                'Save Translations'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
