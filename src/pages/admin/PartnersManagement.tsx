import { apiFetch } from '@/lib/apiFetch';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Handshake, ExternalLink, Globe, Save, Eye, EyeOff, Upload, Loader2 } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';

interface Partner {
  id: number;
  name: string;
  logo_id?: string;
  website_url?: string;
  description?: string;
  ordering: number;
  is_active: boolean;
}

interface PartnerSettings {
  id: string;
  title: string;
  subtitle: string;
  is_active: boolean;
}

type PartnerForm = {
  name: string;
  logo_id: string;
  website_url: string;
  description: string;
  is_active: boolean;
};

/* ── API helpers ─────────────────────────────────────────── */

async function fetchPartners(): Promise<Partner[]> {
  const res = await apiFetch('/api/admin/cms/stats?type=partners', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch partners');
  const data = await res.json();
  return data.partners ?? [];
}

async function fetchPartnerSettings(): Promise<PartnerSettings> {
  const res = await apiFetch('/api/admin/cms/partner-settings', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch partner settings');
  return res.json();
}

async function savePartner(item: Partial<Partner> & { id?: number }): Promise<void> {
  const res = await apiFetch('/api/admin/cms/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ type: 'partners', items: [item] }),
  });
  if (!res.ok) throw new Error('Failed to save partner');
}

async function deletePartner(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/cms/stats/partners/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete partner');
}

async function savePartnerSettings(data: Partial<PartnerSettings>): Promise<void> {
  const res = await apiFetch('/api/admin/cms/partner-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save section settings');
}

/* ── Sub-components ──────────────────────────────────────── */

const emptyForm: PartnerForm = { name: '', logo_id: '', website_url: '', description: '', is_active: true };

function LogoPreview({ src, name }: { src?: string; name: string }) {
  if (src && (src.startsWith('http') || src.startsWith('/'))) {
    return (
      <img
        src={src}
        alt={name}
        className="h-8 w-16 object-contain rounded border bg-gray-50 p-1"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <div className="h-8 w-16 rounded border bg-gray-50 flex items-center justify-center">
      <Globe className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

export default function PartnersManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [sectionForm, setSectionForm] = useState<{ title: string; subtitle: string; is_active: boolean } | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  /* ── Queries ── */
  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: fetchPartners,
  });

  const { data: sectionSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['admin-partner-settings'],
    queryFn: fetchPartnerSettings,
    onSuccess: (data) => {
      if (!sectionForm) {
        setSectionForm({ title: data.title, subtitle: data.subtitle, is_active: data.is_active });
      }
    },
  });

  /* initialize sectionForm once data arrives if not yet set */
  const currentSection = sectionForm ?? {
    title: sectionSettings?.title ?? 'Our Partners & Supporters',
    subtitle: sectionSettings?.subtitle ?? 'Associates & Clients',
    is_active: sectionSettings?.is_active ?? true,
  };

  /* ── Mutations ── */
  const saveMutation = useMutation({
    mutationFn: savePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      toast({ title: `Partner ${editingItem ? 'updated' : 'added'} successfully` });
      handleClose();
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      toast({ title: 'Partner removed' });
      setDeletingId(null);
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const settingsMutation = useMutation({
    mutationFn: savePartnerSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partner-settings'] });
      toast({ title: 'Section settings saved' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  /* ── Handlers ── */
  const handleEdit = (item: Partner) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      logo_id: item.logo_id ?? '',
      website_url: item.website_url ?? '',
      description: item.description ?? '',
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSavePartner = () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation error', description: 'Partner name is required', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(editingItem ? { ...form, id: editingItem.id } : form);
  };

  const handleSaveSettings = () => {
    settingsMutation.mutate(currentSection);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiFetch('/api/admin/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const fileUrl: string = data.fileUrl ?? data.url ?? data.thumbnailUrl ?? '';
      if (fileUrl) {
        setForm(f => ({ ...f, logo_id: fileUrl }));
        toast({ title: 'Logo uploaded', description: 'Logo saved and URL filled in automatically.' });
      }
    } catch (err) {
      toast({ title: 'Upload failed', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setUploadingLogo(false);
      if (logoFileRef.current) logoFileRef.current.value = '';
    }
  };

  const activeCount = partners.filter((p) => p.is_active).length;

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partners</h1>
          <p className="text-muted-foreground mt-1">Manage the Partners & Supporters section on the landing page</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* ── Section header settings ── */}
      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
          <CardDescription>Control the title, subtitle and visibility of the partners section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {settingsLoading ? (
            <div className="text-sm text-muted-foreground py-4">Loading settings…</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sec-subtitle">Eyebrow / Subtitle</Label>
                  <Input
                    id="sec-subtitle"
                    value={currentSection.subtitle}
                    onChange={(e) => setSectionForm({ ...currentSection, subtitle: e.target.value })}
                    placeholder="Associates & Clients"
                  />
                  <p className="text-xs text-muted-foreground">Small uppercase label shown above the main title</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sec-title">Main Title</Label>
                  <Input
                    id="sec-title"
                    value={currentSection.title}
                    onChange={(e) => setSectionForm({ ...currentSection, title: e.target.value })}
                    placeholder="Our Partners & Supporters"
                  />
                  <p className="text-xs text-muted-foreground">Large heading shown on the section</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    id="sec-active"
                    checked={currentSection.is_active}
                    onCheckedChange={(v) => setSectionForm({ ...currentSection, is_active: v })}
                  />
                  <div>
                    <Label htmlFor="sec-active" className="cursor-pointer">
                      {currentSection.is_active ? (
                        <span className="flex items-center gap-1.5 text-green-700"><Eye className="h-4 w-4" /> Section visible on site</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-muted-foreground"><EyeOff className="h-4 w-4" /> Section hidden from site</span>
                      )}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Hiding the section removes it from the landing page entirely</p>
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={settingsMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {settingsMutation.isPending ? 'Saving…' : 'Save Settings'}
                </Button>
              </div>

              {/* Live preview strip */}
              <div className="rounded-lg border bg-[#112250] p-5 text-center space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  {currentSection.subtitle || 'Eyebrow text'}
                </p>
                <p className="text-xl font-bold text-white">
                  {currentSection.title || 'Main title'}
                </p>
                <p className="text-xs text-white/50 mt-1">↑ Live preview of section header</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{partners.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total partners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-muted-foreground mt-1">Visible on site</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-400">{partners.length - activeCount}</div>
            <div className="text-sm text-muted-foreground mt-1">Hidden</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Partners table ── */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Logos</CardTitle>
          <CardDescription>
            {partners.length} partner{partners.length !== 1 ? 's' : ''} · shown in the scrolling carousel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center space-y-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="text-sm">Loading partners…</p>
              </div>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Handshake className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="font-medium">No partners yet</p>
              <p className="text-sm mt-1">Click "Add Partner" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <LogoPreview src={partner.logo_id} name={partner.name} />
                    </TableCell>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      {partner.website_url ? (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {partner.website_url.replace(/^https?:\/\//, '')}
                          </span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground text-sm">
                      {partner.description || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">#{partner.ordering}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        partner.is_active
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                          : 'bg-gray-50 text-gray-600 ring-1 ring-gray-400/20'
                      }`}>
                        {partner.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <TranslateDialog
                          entityType="partner"
                          entityId={partner.id}
                          entityLabel={partner.name}
                          fields={[
                            { key: 'name', label: 'Name' },
                            { key: 'description', label: 'Description', multiline: true },
                          ]}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(partner)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(partner.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          </div>
        </CardContent>
      </Card>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update partner details shown in the carousel'
                : 'Add a new partner to the scrolling carousel on the landing page'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="p-name">Partner Name *</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Royal Air Maroc"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>

              {/* Upload button */}
              <div className="flex items-center gap-2">
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  onClick={() => logoFileRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  {uploadingLogo
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                    : <><Upload className="h-4 w-4" /> Upload image</>
                  }
                </Button>
                <span className="text-xs text-muted-foreground">PNG, JPG, SVG, WebP</span>
              </div>

              {/* Or paste URL */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground px-1">or paste URL</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Input
                id="p-logo"
                value={form.logo_id}
                onChange={(e) => setForm({ ...form, logo_id: e.target.value })}
                placeholder="https://example.com/logo.png"
              />

              {/* Preview */}
              {form.logo_id && (
                <div className="flex items-center gap-3 p-3 rounded-md border bg-gray-50">
                  <span className="text-xs text-muted-foreground shrink-0">Preview:</span>
                  <img
                    src={form.logo_id}
                    alt="Logo preview"
                    className="h-10 max-w-[160px] object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-website">Website URL</Label>
              <Input
                id="p-website"
                type="url"
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the partnership…"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="p-active"
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label htmlFor="p-active">Visible on site</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSavePartner} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : editingItem ? 'Save Changes' : 'Add Partner'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove partner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the partner from the carousel. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
            >
              {deleteMutation.isPending ? 'Removing…' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
