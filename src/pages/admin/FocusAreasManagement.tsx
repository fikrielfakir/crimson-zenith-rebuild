import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Image as ImageIcon, Target, Users, Lightbulb, Heart, Globe, Save, AlignLeft, AlertTriangle, Copy, CheckCheck, Languages, Check, Minus } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const iconOptions = [
  { value: 'target', label: 'Target', Icon: Target },
  { value: 'users', label: 'Users', Icon: Users },
  { value: 'lightbulb', label: 'Lightbulb', Icon: Lightbulb },
  { value: 'heart', label: 'Heart', Icon: Heart },
  { value: 'globe', label: 'Globe', Icon: Globe },
];

interface FocusItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  ordering: number;
  isActive: boolean;
}

interface SectionSettings {
  title: string;
  subtitle: string;
  isActive: boolean;
}

export default function FocusAreasManagement() {
  const [editingItem, setEditingItem] = useState<FocusItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [showMigrationAlert, setShowMigrationAlert] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['focusItems'],
    queryFn: async () => {
      const res = await apiFetch('/api/admin/cms/focus-items');
      if (!res.ok) throw new Error('Failed to fetch focus items');
      return res.json();
    },
  });

  const { data: translationsData, isLoading: translationsLoading } = useQuery<any[]>({
    queryKey: ['focusItemTranslations'],
    queryFn: async () => {
      const res = await fetch('/api/translations/focus_item');
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 30_000,
  });

  const { data: sectionData, isLoading: sectionLoading } = useQuery<SectionSettings>({
    queryKey: ['focusSection'],
    queryFn: async () => {
      const res = await apiFetch('/api/admin/cms/focus-section');
      if (!res.ok) throw new Error('Failed to fetch section settings');
      return res.json();
    },
  });

  useEffect(() => {
    if (sectionData) {
      setSectionTitle((sectionData as any).title ?? '');
      setSectionSubtitle((sectionData as any).subtitle ?? '');
    }
  }, [sectionData]);

  const MIGRATION_SQL = `ALTER TABLE \`focus_items\`
  ADD COLUMN IF NOT EXISTS \`image_url\` VARCHAR(1000) NULL AFTER \`media_id\`;

CREATE TABLE IF NOT EXISTS \`focus_section_settings\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL DEFAULT 'Our Focus',
  \`subtitle\` VARCHAR(500) DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`updated_by\` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO \`focus_section_settings\` (\`id\`, \`title\`, \`subtitle\`, \`is_active\`)
VALUES ('default', 'Our Focus', 'Tourism, Culture, Entertainment', 1);`;

  const saveSectionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/admin/cms/focus-section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: sectionTitle, subtitle: sectionSubtitle }),
        credentials: 'include',
      });
      // 500 = DB table missing on production — show migration dialog, don't throw
      if (res.status === 500 || res.status === 503) {
        return { migrationNeeded: true };
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `HTTP ${res.status}: Failed to save section settings`);
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data?.migrationNeeded) {
        setShowMigrationAlert(true);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['focusSection'] });
      queryClient.invalidateQueries({ queryKey: ['cms', 'focus-section'] });
      toast({ title: 'Section settings saved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const url = editingItem?.id
        ? `/api/admin/cms/focus-items/${editingItem.id}`
        : '/api/admin/cms/focus-items';
      const method = editingItem?.id ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to save focus item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      queryClient.invalidateQueries({ queryKey: ['cms', 'focus-items'] });
      toast({ title: `Focus item ${editingItem?.id ? 'updated' : 'created'} successfully` });
      handleCloseForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/cms/focus-items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete focus item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      queryClient.invalidateQueries({ queryKey: ['cms', 'focus-items'] });
      toast({ title: 'Focus item deleted successfully' });
      setDeletingItemId(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const bulkReorderMutation = useMutation({
    mutationFn: async (items: Array<{ id: number; ordering: number }>) => {
      const res = await apiFetch('/api/admin/cms/focus-items/bulk-reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to reorder items');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      toast({ title: 'Items reordered successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleEdit = (item: FocusItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setSelectedIcon(item.icon || 'target');
    setImageUrl(item.imageUrl || '');
    setIsActive(item.isActive);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setSelectedIcon('target');
    setImageUrl('');
    setIsActive(true);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Error', description: 'Title and description are required', variant: 'destructive' });
      return;
    }
    saveMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      icon: selectedIcon,
      imageUrl: imageUrl.trim() || null,
      isActive,
    });
  };

  const handleMoveUp = (item: FocusItem) => {
    const items = data?.items || [];
    const idx = items.findIndex((i: FocusItem) => i.id === item.id);
    if (idx > 0) {
      const newItems = [...items];
      [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
      bulkReorderMutation.mutate(newItems.map((it, i) => ({ id: it.id, ordering: i })));
    }
  };

  const handleMoveDown = (item: FocusItem) => {
    const items = data?.items || [];
    const idx = items.findIndex((i: FocusItem) => i.id === item.id);
    if (idx < items.length - 1) {
      const newItems = [...items];
      [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      bulkReorderMutation.mutate(newItems.map((it, i) => ({ id: it.id, ordering: i })));
    }
  };

  const items = data?.items || [];
  const SelectedIconComponent = iconOptions.find(opt => opt.value === selectedIcon)?.Icon || Target;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Focus Areas Management</h1>
          <p className="text-muted-foreground mt-1">Manage the "Our Focus" section on your landing page</p>
        </div>
        <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleCloseForm(); else setShowForm(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Focus Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Focus Item' : 'Add Focus Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the focus item details' : 'Create a new focus area item'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Tourism"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this focus area..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Background Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <div className="relative h-32 w-full rounded-md overflow-hidden border mt-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (fallback when no image)</Label>
                <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(({ value, label, Icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2 p-3 border rounded-md bg-muted/30">
                  <SelectedIconComponent className="h-6 w-6 text-primary" />
                  <span className="text-sm">Preview</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Section Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlignLeft className="h-5 w-5" />
            Section Header Settings
          </CardTitle>
          <CardDescription>Edit the main title and subtitle of the Focus Areas section</CardDescription>
        </CardHeader>
        <CardContent>
          {sectionLoading ? (
            <LoadingSpinner message="Loading section settings..." />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionTitle">Section Title</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sectionTitle"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      placeholder="e.g., Our Focus / تركيزنا"
                    />
                    <TranslateDialog
                      entityType="focus_section"
                      entityId="default"
                      entityLabel="Section Title"
                      fields={[{ key: 'title', label: 'Section Title' }]}
                      sourceValues={{ title: sectionTitle }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sectionSubtitle"
                      value={sectionSubtitle}
                      onChange={(e) => setSectionSubtitle(e.target.value)}
                      placeholder="e.g., Tourism, Culture, Entertainment"
                    />
                    <TranslateDialog
                      entityType="focus_section"
                      entityId="default"
                      entityLabel="Section Subtitle"
                      fields={[{ key: 'subtitle', label: 'Section Subtitle' }]}
                      sourceValues={{ subtitle: sectionSubtitle }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => saveSectionMutation.mutate()}
                  disabled={saveSectionMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saveSectionMutation.isPending ? 'Saving...' : 'Save Section Settings'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Items</CardTitle>
          <CardDescription>
            {items.length} item{items.length !== 1 ? 's' : ''} • Use arrows to reorder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner message="Loading focus items..." />
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No focus items yet</p>
              <p className="text-sm mt-2">Click "Add Focus Item" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: FocusItem) => {
                  const IconComponent = iconOptions.find(opt => opt.value === item.icon)?.Icon || Target;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleMoveUp(item)}>▲</Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleMoveDown(item)}>▼</Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.imageUrl ? (
                          <div className="h-12 w-16 rounded overflow-hidden border">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-16 rounded border flex items-center justify-center bg-muted">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-md truncate text-muted-foreground text-sm">{item.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TranslateDialog
                            entityType="focus_item"
                            entityId={item.id}
                            entityLabel={item.title}
                            fields={[
                              { key: 'title', label: 'Title' },
                              { key: 'description', label: 'Description', multiline: true },
                            ]}
                            sourceValues={{ title: item.title, description: item.description ?? '' }}
                          />
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingItemId(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Translations Matrix Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Focus Items — Translations
              </CardTitle>
              <CardDescription>
                Overview of all translations for each focus item. Click Translate to add or edit.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['focusItemTranslations'] })}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {translationsLoading ? (
            <LoadingSpinner message="Loading translations..." />
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No focus items yet — add items first.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Focus Item</TableHead>
                  <TableHead className="text-center" colSpan={2}>🇲🇦 Arabic</TableHead>
                  <TableHead className="text-center" colSpan={2}>🇫🇷 French</TableHead>
                  <TableHead className="text-center" colSpan={2}>🇪🇸 Spanish</TableHead>
                  <TableHead className="text-right">Translate</TableHead>
                </TableRow>
                <TableRow className="text-xs text-muted-foreground">
                  <TableHead />
                  <TableHead className="text-center font-normal">Title</TableHead>
                  <TableHead className="text-center font-normal">Description</TableHead>
                  <TableHead className="text-center font-normal">Title</TableHead>
                  <TableHead className="text-center font-normal">Description</TableHead>
                  <TableHead className="text-center font-normal">Title</TableHead>
                  <TableHead className="text-center font-normal">Description</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: FocusItem) => {
                  const tl = translationsData ?? [];
                  const get = (lang: string, field: string) =>
                    tl.find((t: any) => t.entityId === String(item.id) && t.language === lang && t.field === field)?.value;

                  const Cell = ({ lang, field }: { lang: string; field: string }) => {
                    const val = get(lang, field);
                    return (
                      <TableCell className="text-center">
                        {val ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5 max-w-[110px] truncate"
                            title={val}
                          >
                            <Check className="h-3 w-3 shrink-0" />
                            <span className="truncate">{val}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Minus className="h-3 w-3" />
                          </span>
                        )}
                      </TableCell>
                    );
                  };

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-sm">{item.title}</TableCell>
                      <Cell lang="ar" field="title" />
                      <Cell lang="ar" field="description" />
                      <Cell lang="fr" field="title" />
                      <Cell lang="fr" field="description" />
                      <Cell lang="es" field="title" />
                      <Cell lang="es" field="description" />
                      <TableCell className="text-right">
                        <TranslateDialog
                          entityType="focus_item"
                          entityId={item.id}
                          entityLabel={item.title}
                          fields={[
                            { key: 'title', label: 'Title' },
                            { key: 'description', label: 'Description', multiline: true },
                          ]}
                          onSaved={() => queryClient.invalidateQueries({ queryKey: ['focusItemTranslations'] })}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      {deletingItemId && (
        <Dialog open={!!deletingItemId} onOpenChange={() => setDeletingItemId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Focus Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this focus item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeletingItemId(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => deletingItemId && deleteMutation.mutate(deletingItemId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Migration Required Dialog */}
      <Dialog open={showMigrationAlert} onOpenChange={setShowMigrationAlert}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Database Migration Required
            </DialogTitle>
            <DialogDescription>
              The section settings table doesn't exist yet on your production database.
              Run the following SQL in your Hostinger MySQL panel, then try saving again.
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-2">
            <pre className="bg-muted rounded-md p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {MIGRATION_SQL}
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => {
                navigator.clipboard.writeText(MIGRATION_SQL);
                setSqlCopied(true);
                setTimeout(() => setSqlCopied(false), 2000);
              }}
            >
              {sqlCopied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1">{sqlCopied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            After running the SQL, click Save again — the settings will persist permanently.
          </p>
          <div className="flex justify-end mt-2">
            <Button onClick={() => setShowMigrationAlert(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
