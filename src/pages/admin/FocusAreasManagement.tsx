import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Target,
  Users,
  Lightbulb,
  Heart,
  Globe,
  Save,
  AlignLeft,
  Loader2,
  MoreVertical,
  Search,
  ArrowUp,
  ArrowDown,
  Mountain,
  Leaf,

} from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';

const iconOptions = [
  { value: 'target', label: 'Target', Icon: Target },
  { value: 'users', label: 'Users', Icon: Users },
  { value: 'lightbulb', label: 'Lightbulb', Icon: Lightbulb },
  { value: 'heart', label: 'Heart', Icon: Heart },
  { value: 'globe', label: 'Globe', Icon: Globe },
  { value: 'mountain', label: 'Mountain', Icon: Mountain },
  { value: 'leaf', label: 'Leaf', Icon: Leaf },
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

function getIconComponent(iconValue: string) {
  return iconOptions.find((o) => o.value === iconValue)?.Icon ?? Target;
}

export default function FocusAreasManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FocusItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [showSectionSettings, setShowSectionSettings] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');

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

  const saveSectionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/admin/cms/focus-section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: sectionTitle, subtitle: sectionSubtitle }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to save section settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusSection'] });
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
    const allItems = data?.items || [];
    const idx = allItems.findIndex((i: FocusItem) => i.id === item.id);
    if (idx > 0) {
      const newItems = [...allItems];
      [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
      bulkReorderMutation.mutate(newItems.map((it: FocusItem, i: number) => ({ id: it.id, ordering: i })));
    }
  };

  const handleMoveDown = (item: FocusItem) => {
    const allItems = data?.items || [];
    const idx = allItems.findIndex((i: FocusItem) => i.id === item.id);
    if (idx < allItems.length - 1) {
      const newItems = [...allItems];
      [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      bulkReorderMutation.mutate(newItems.map((it: FocusItem, i: number) => ({ id: it.id, ordering: i })));
    }
  };

  const allItems: FocusItem[] = data?.items || [];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && item.isActive) ||
      (statusFilter === 'inactive' && !item.isActive);
    return matchesSearch && matchesStatus;
  });

  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Focus Areas Management</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowSectionSettings(true)}>
            <AlignLeft className="mr-2 h-4 w-4" />
            Section Settings
          </Button>
          <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Focus Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search focus items..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead className="w-20">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Target className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>{search || statusFilter !== 'all' ? 'No items match your filters' : 'No focus items yet'}</p>
                  {!search && statusFilter === 'all' && (
                    <p className="text-sm mt-1">Click "Add Focus Item" to get started</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const IconComponent = getIconComponent(item.icon);
                const isFirst = allItems[0]?.id === item.id;
                const isLast = allItems[allItems.length - 1]?.id === item.id;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={isFirst || bulkReorderMutation.isPending}
                          onClick={() => handleMoveUp(item)}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={isLast || bulkReorderMutation.isPending}
                          onClick={() => handleMoveDown(item)}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
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
                    <TableCell>
                      <p className="font-medium">{item.title}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-xs truncate">{item.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'outline'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <TranslateDialog
                          entityType="focus_item"
                          entityId={item.id}
                          entityLabel={item.title}
                          fields={[
                            { key: 'title', label: 'Title' },
                            { key: 'description', label: 'Description', multiline: true },
                          ]}
                          sourceValues={{ title: item.title, description: item.description ?? '' }}
                          onSaved={() => queryClient.invalidateQueries({ queryKey: ['focusItems'] })}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeletingItemId(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleCloseForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Focus Item' : 'Add Focus Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the focus item details' : 'Create a new focus area item'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Adventure & Exploration"
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
              <Label htmlFor="icon">Icon (shown when no image)</Label>
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
                <span className="text-sm text-muted-foreground">Icon preview</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />{editingItem ? 'Update' : 'Create'}</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingItemId !== null} onOpenChange={(open) => { if (!open) setDeletingItemId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Focus Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this focus item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeletingItemId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deletingItemId && deleteMutation.mutate(deletingItemId)}
            >
              {deleteMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" />Delete</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Section Settings Dialog */}
      <Dialog open={showSectionSettings} onOpenChange={setShowSectionSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlignLeft className="h-5 w-5" />
              Section Header Settings
            </DialogTitle>
            <DialogDescription>Edit the main title and subtitle of the Focus Areas section</DialogDescription>
          </DialogHeader>
          {sectionLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="sectionTitle">Section Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="sectionTitle"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="e.g., Our Focus"
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
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowSectionSettings(false)}>Cancel</Button>
            <Button
              onClick={() => saveSectionMutation.mutate()}
              disabled={saveSectionMutation.isPending}
            >
              {saveSectionMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Save Settings</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
