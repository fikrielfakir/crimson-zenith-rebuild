import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Globe, Save, Eye, EyeOff } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog';
import {
  AdminPageHeader,
  AdminTableSkeleton,
  AdminEmptyState,
} from '@/components/admin/AdminPageShell';
import { useAdminCRUD } from '@/hooks/useAdminCRUD';

interface Partner {
  id: number;
  name: string;
  logoId?: number | null;
  websiteUrl?: string | null;
  description?: string | null;
  ordering: number;
  isActive: boolean;
  logoUrl?: string;
}

interface PartnerSettings {
  id: string;
  title: string;
  subtitle?: string | null;
  isActive: boolean;
}

type PartnerForm = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  isActive: boolean;
};

const SETTINGS_KEY = ['admin-partner-settings'] as const;

async function fetchPartnerSettings(): Promise<PartnerSettings> {
  const res = await apiFetch('/api/admin/cms/partner-settings');
  if (!res.ok) throw new Error('Failed to fetch partner settings');
  return res.json();
}

async function savePartnerSettings(data: Partial<PartnerSettings>): Promise<PartnerSettings> {
  const res = await apiFetch('/api/admin/cms/partner-settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save section settings');
  return res.json();
}

const emptyForm: PartnerForm = { name: '', logoUrl: '', websiteUrl: '', description: '', isActive: true };

function LogoPreview({ src, name }: { src?: string | null; name: string }) {
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

export default function PartnersManagement() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [sectionDraft, setSectionDraft] = useState<{ title: string; subtitle: string; isActive: boolean } | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const crud = useAdminCRUD<Partner>({
    readEndpoint: '/api/admin/cms/partners',
    writeEndpoint: '/api/admin/cms/partners',
    queryKey: ['admin-partners'],
    messages: {
      created: t('admin.partners.toastCreated'),
      updated: t('admin.partners.toastUpdated'),
      deleted: t('admin.partners.toastDeleted'),
    },
  });

  const { data: sectionSettings, isLoading: settingsLoading } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: fetchPartnerSettings,
  });

  const section = sectionDraft ?? {
    title: sectionSettings?.title ?? 'Our Partners & Supporters',
    subtitle: sectionSettings?.subtitle ?? 'Associates & Clients',
    isActive: sectionSettings?.isActive ?? true,
  };

  const settingsMutation = useMutation({
    mutationFn: savePartnerSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      setSectionDraft(null);
      toast({ title: t('admin.partners.toastSectionSaved') });
    },
    onError: (err: Error) => toast({ title: t('admin.common.error'), description: err.message, variant: 'destructive' }),
  });

  const handleEdit = (item: Partner) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      logoUrl: item.logoUrl ?? '',
      websiteUrl: item.websiteUrl ?? '',
      description: item.description ?? '',
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSavePartner = async () => {
    if (!form.name.trim()) {
      toast({ title: t('admin.common.error'), description: t('admin.partners.validationError'), variant: 'destructive' });
      return;
    }
    if (editingItem) {
      await crud.update(editingItem.id, form);
    } else {
      await crud.create(form);
    }
    handleClose();
  };


  const activeCount = crud.data.filter((p) => p.isActive).length;
  const isPending = crud.isCreating || crud.isUpdating;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={t('admin.partners.title')}
        description={t('admin.partners.headerDescription')}
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.partners.addPartner')}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.partners.sectionHeaderTitle')}</CardTitle>
          <CardDescription>{t('admin.partners.sectionHeaderDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {settingsLoading ? (
            <div className="text-sm text-muted-foreground py-4">{t('admin.partners.loadingSettings')}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sec-subtitle">{t('admin.partners.eyebrowLabel')}</Label>
                  <div className="flex gap-2 items-start">
                    <Input
                      id="sec-subtitle"
                      value={section.subtitle}
                      onChange={(e) => setSectionDraft({ ...section, subtitle: e.target.value })}
                      placeholder="Associates & Clients"
                      className="flex-1"
                    />
                    <TranslateDialog
                      entityType="partner_settings"
                      entityId="subtitle"
                      entityLabel="Partners Section Subtitle"
                      fields={[{ key: 'subtitle', label: 'Eyebrow / Subtitle' }]}
                      sourceValues={{ subtitle: section.subtitle }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sec-title">{t('admin.partners.mainTitleLabel')}</Label>
                  <div className="flex gap-2 items-start">
                    <Input
                      id="sec-title"
                      value={section.title}
                      onChange={(e) => setSectionDraft({ ...section, title: e.target.value })}
                      placeholder="Our Partners & Supporters"
                      className="flex-1"
                    />
                    <TranslateDialog
                      entityType="partner_settings"
                      entityId="title"
                      entityLabel="Partners Section Title"
                      fields={[{ key: 'title', label: 'Main Title' }]}
                      sourceValues={{ title: section.title }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    id="sec-active"
                    checked={section.isActive}
                    onCheckedChange={(v) => setSectionDraft({ ...section, isActive: v })}
                  />
                  <Label htmlFor="sec-active" className="cursor-pointer">
                    {section.isActive
                      ? <span className="flex items-center gap-1.5 text-green-700"><Eye className="h-4 w-4" /> {t('admin.partners.sectionVisible')}</span>
                      : <span className="flex items-center gap-1.5 text-muted-foreground"><EyeOff className="h-4 w-4" /> {t('admin.partners.sectionHidden')}</span>
                    }
                  </Label>
                </div>
                <Button onClick={() => settingsMutation.mutate(section)} disabled={settingsMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {settingsMutation.isPending ? t('admin.common.saving') : t('admin.settings.saveSettings')}
                </Button>
              </div>

              <div className="rounded-lg border bg-[#112250] p-5 text-center space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{section.subtitle || 'Eyebrow text'}</p>
                <p className="text-xl font-bold text-white">{section.title || 'Main title'}</p>
                <p className="text-xs text-white/50 mt-1">↑ Live preview of section header</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{crud.data.length}</div><div className="text-sm text-muted-foreground mt-1">{t('admin.partners.totalPartnersLabel')}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{activeCount}</div><div className="text-sm text-muted-foreground mt-1">{t('admin.common.visibleOnSite')}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-gray-400">{crud.data.length - activeCount}</div><div className="text-sm text-muted-foreground mt-1">{t('admin.common.hidden')}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.partners.partnerLogosTitle')}</CardTitle>
          <CardDescription>{t('admin.partners.partnerLogosDesc', { count: crud.data.length })}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {crud.isLoading ? (
            <AdminTableSkeleton cols={7} rows={4} />
          ) : crud.data.length === 0 ? (
            <AdminEmptyState
              title={t('admin.partners.noItems')}
              message={t('admin.partners.noItemsDesc')}
              action={
                <Button size="sm" onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />{t('admin.partners.addPartner')}
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Logo</TableHead>
                  <TableHead>{t('admin.partners.colName')}</TableHead>
                  <TableHead>{t('admin.partners.colWebsite')}</TableHead>
                  <TableHead>{t('admin.common.description')}</TableHead>
                  <TableHead>{t('admin.partners.colOrder')}</TableHead>
                  <TableHead>{t('admin.common.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crud.data.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell><LogoPreview src={partner.logoUrl} name={partner.name} /></TableCell>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      {partner.websiteUrl ? (
                        <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{partner.websiteUrl.replace(/^https?:\/\//, '')}</span>
                        </a>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-muted-foreground text-sm">{partner.description || '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">#{partner.ordering}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        partner.isActive
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                          : 'bg-gray-50 text-gray-600 ring-1 ring-gray-400/20'
                      }`}>
                        {partner.isActive ? t('admin.common.visible') : t('admin.common.hidden')}
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
                          sourceValues={{ name: partner.name, description: partner.description ?? '' }}
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
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? t('admin.partners.editTitle') : t('admin.partners.addTitle')}</DialogTitle>
            <DialogDescription>
              {editingItem ? t('admin.partners.editDesc') : t('admin.partners.addDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="p-name">{t('admin.partners.nameLabel')} *</Label>
              <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Royal Air Maroc" />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.partners.logoLabel')}</Label>
              <ImageUpload
                value={form.logoUrl}
                onChange={(url) => setForm(f => ({ ...f, logoUrl: url }))}
                description="PNG, JPG, SVG, WebP — transparent background recommended"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
              />
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground px-1">{t('admin.partners.orPasteUrl')}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Input id="p-logo" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-website">{t('admin.common.website')}</Label>
              <Input id="p-website" type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://www.example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-desc">{t('admin.common.description')}</Label>
              <Textarea id="p-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of the partnership…" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="p-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label htmlFor="p-active">{t('admin.common.visibleOnSite')}</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>{t('admin.common.cancel')}</Button>
            <Button onClick={handleSavePartner} disabled={isPending}>
              {isPending ? t('admin.events.saving') : editingItem ? t('admin.partners.updatePartner') : t('admin.partners.addPartner')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deletingId !== null}
        onConfirm={() => {
          if (deletingId !== null) crud.remove(deletingId).then(() => setDeletingId(null));
        }}
        onCancel={() => setDeletingId(null)}
        entityName="partner"
        description="This will permanently remove the partner from the carousel."
        isPending={crud.isRemoving}
      />
    </div>
  );
}
