import { apiFetch } from '@/lib/apiFetch';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Images, Upload, Star, StarOff, Pencil, Trash2,
  Search, Plus, Loader2, ImageIcon, X, CloudUpload,
  LayoutGrid, List, Eye, MapPin, User, Tag, Globe,
  ScanLine, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── types ─────────────────────────────────────────────────────────── */
interface GalleryItem {
  id: number;
  title: string;
  location: string | null;
  category: string | null;
  photographer: string | null;
  description: string | null;
  image_url: string;
  panorama_url: string | null;
  has_360: boolean;
  is_featured: boolean;
  sort_order: number;
  aspect: 'landscape' | 'portrait';
  created_at: string;
  updated_at: string;
}

interface GalleryResponse {
  items: GalleryItem[];
  total: number;
  featured_count: number;
  count_360: number;
}

type ViewMode = 'grid' | 'list';

const CATEGORIES = [
  { value: 'all',       label: 'All Categories' },
  { value: 'mountain',  label: 'Mountains' },
  { value: 'desert',    label: 'Desert' },
  { value: 'cultural',  label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'coastal',   label: 'Coastal' },
  { value: 'city',      label: 'City' },
];

const BLANK_FORM = {
  title: '',
  location: '',
  category: 'cultural',
  photographer: '',
  description: '',
  image_url: '',
  panorama_url: '',
  has_360: false,
  is_featured: false,
  aspect: 'landscape' as 'landscape' | 'portrait',
};

/* ─── API helpers ────────────────────────────────────────────────────── */
async function fetchGallery(category: string, search: string): Promise<GalleryResponse> {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (search) params.set('search', search);
  const res = await apiFetch(`/api/admin/gallery?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}

async function createItem(data: typeof BLANK_FORM): Promise<GalleryItem> {
  const res = await apiFetch('/api/admin/gallery', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
}

async function updateItem(id: number, data: Partial<typeof BLANK_FORM>): Promise<GalleryItem> {
  const res = await apiFetch(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

async function deleteItem(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/gallery/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete item');
}

async function toggleFeatured(id: number): Promise<GalleryItem> {
  const res = await apiFetch(`/api/admin/gallery/${id}/toggle-featured`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to toggle featured');
  return res.json();
}

/* ─── panorama uploader ──────────────────────────────────────────────── */
function PanoramaUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Only image files are supported', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('alt', file.name.replace(/\.[^.]+$/, ''));
      const res = await apiFetch('/api/admin/media', { method: 'POST', credentials: 'include', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.fileUrl || data.url || '');
      toast({ title: '360° panorama uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }, [onChange, toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0]; if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <Globe className="h-4 w-4 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Use an equirectangular (2:1 ratio) image — max 4096×2048px for best performance.
        </p>
      </div>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border bg-muted" style={{ height: 120 }}>
          <img src={value} alt="panorama preview" className="w-full h-full object-cover" style={{ filter: 'brightness(0.75)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">360° Preview</span>
          </div>
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:opacity-90">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
            dragging ? 'border-blue-400 bg-blue-50/30' : 'border-muted-foreground/25 hover:border-blue-400/50 hover:bg-muted/50'
          )}
          style={{ height: 110 }}
        >
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
          ) : (
            <>
              <Globe className="h-7 w-7 text-blue-400" />
              <p className="text-sm text-muted-foreground">Drop 360° equirectangular image here</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div className="flex gap-2 items-center">
        <span className="text-xs text-muted-foreground">Or paste URL:</span>
        <Input placeholder="https://…" value={value} onChange={e => onChange(e.target.value)} className="flex-1 h-8 text-sm" />
      </div>
    </div>
  );
}

/* ─── image uploader ─────────────────────────────────────────────────── */
function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Only image files are supported', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('alt', file.name.replace(/\.[^.]+$/, ''));
      const res = await apiFetch('/api/admin/media', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.fileUrl || data.url || '');
      toast({ title: 'Image uploaded successfully' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }, [onChange, toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border bg-muted" style={{ height: 180 }}>
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:opacity-90"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
            dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          )}
          style={{ height: 140 }}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <CloudUpload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drop image here or click to browse</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div className="flex gap-2 items-center">
        <span className="text-xs text-muted-foreground">Or paste URL:</span>
        <Input
          placeholder="https://..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 h-8 text-sm"
        />
      </div>
    </div>
  );
}

/* ─── gallery item form dialog ───────────────────────────────────────── */
function ItemFormDialog({
  open, item, onClose
}: {
  open: boolean;
  item: GalleryItem | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<typeof BLANK_FORM>(
    item
      ? {
          title:         item.title,
          location:      item.location || '',
          category:      item.category || 'cultural',
          photographer:  item.photographer || '',
          description:   item.description || '',
          image_url:     item.image_url,
          panorama_url:  item.panorama_url || '',
          has_360:       item.has_360 ?? false,
          is_featured:   item.is_featured,
          aspect:        item.aspect,
        }
      : BLANK_FORM
  );
  const qc = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setForm(
        item
          ? {
              title:         item.title,
              location:      item.location || '',
              category:      item.category || 'cultural',
              photographer:  item.photographer || '',
              description:   item.description || '',
              image_url:     item.image_url,
              panorama_url:  item.panorama_url || '',
              has_360:       item.has_360 ?? false,
              is_featured:   item.is_featured,
              aspect:        item.aspect,
            }
          : BLANK_FORM
      );
    }
  }, [open, item]);

  const createMut = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Gallery item created' });
      onClose();
    },
    onError: () => toast({ title: 'Failed to create item', variant: 'destructive' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<typeof BLANK_FORM> }) => updateItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Gallery item updated' });
      onClose();
    },
    onError: () => toast({ title: 'Failed to update item', variant: 'destructive' }),
  });

  const isPending = createMut.isPending || updateMut.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image_url) {
      toast({ title: 'Title and image are required', variant: 'destructive' });
      return;
    }
    if (item) {
      updateMut.mutate({ id: item.id, data: form });
    } else {
      createMut.mutate(form);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update this gallery image and its metadata.' : 'Upload a new image to the public gallery.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Image *</Label>
            <ImageUploader
              value={form.image_url}
              onChange={url => setForm(f => ({ ...f, image_url: url }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="High Atlas Mountains"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Location</Label>
              <Input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Imlil, Morocco"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Photographer</Label>
              <Input
                value={form.photographer}
                onChange={e => setForm(f => ({ ...f, photographer: e.target.value }))}
                placeholder="Ahmed K."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Aspect Ratio</Label>
              <Select value={form.aspect} onValueChange={v => setForm(f => ({ ...f, aspect: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape (wide)</SelectItem>
                  <SelectItem value="portrait">Portrait (tall)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="A brief description of this photo..."
              rows={3}
            />
          </div>

          {/* ── 360° panorama section ── */}
          <div className="rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">360° Panorama View</p>
                  <p className="text-xs text-muted-foreground">Optional — enables immersive virtual tour on this image</p>
                </div>
              </div>
              <Switch
                checked={form.has_360}
                onCheckedChange={v => setForm(f => ({ ...f, has_360: v, panorama_url: v ? f.panorama_url : '' }))}
              />
            </div>

            {form.has_360 && (
              <div className="space-y-1.5 pt-1">
                <Label className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-500" />
                  360° Equirectangular Image
                </Label>
                <PanoramaUploader
                  value={form.panorama_url}
                  onChange={url => setForm(f => ({ ...f, panorama_url: url }))}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <Star className="h-4 w-4 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Featured Image</p>
              <p className="text-xs text-muted-foreground">Featured images appear prominently in the public gallery</p>
            </div>
            <Switch
              checked={form.is_featured}
              onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {item ? 'Save Changes' : 'Add to Gallery'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── preview dialog ─────────────────────────────────────────────────── */
function PreviewDialog({ item, onClose }: { item: GalleryItem | null; onClose: () => void }) {
  const [show360, setShow360] = useState(false);

  useEffect(() => { if (!item) setShow360(false); }, [item]);

  return (
    <Dialog open={!!item} onOpenChange={v => { if (!v) { setShow360(false); onClose(); } }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        {item && (
          <>
            <div className="relative bg-black" style={{ maxHeight: '65vh' }}>
              {show360 && item.panorama_url ? (
                <div style={{ height: '65vh' }}>
                  <iframe
                    src={`https://photo-sphere-viewer-data.netlify.app/assets/sphere-iframe.html?url=${encodeURIComponent(item.panorama_url)}`}
                    className="w-full h-full border-0"
                    title="360° preview"
                    onError={() => setShow360(false)}
                  />
                </div>
              ) : (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full object-contain"
                  style={{ maxHeight: '65vh' }}
                />
              )}
              {item.is_featured && !show360 && (
                <Badge className="absolute top-3 left-3 bg-yellow-500 text-black">
                  <Star className="h-3 w-3 mr-1" /> Featured
                </Badge>
              )}
              {item.has_360 && item.panorama_url && (
                <button
                  onClick={() => setShow360(v => !v)}
                  className={cn(
                    'absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    show360
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                  {show360 ? 'View Photo' : 'View 360°'}
                </button>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-xl font-bold">{item.title}</h2>
                {item.has_360 && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-1 shrink-0">
                    <Globe className="h-3 w-3" /> 360° Tour
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                {item.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.location}</span>
                )}
                {item.photographer && (
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{item.photographer}</span>
                )}
                {item.category && (
                  <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                )}
              </div>
              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── main page ──────────────────────────────────────────────────────── */
export default function GalleryManagement() {
  const [category, setCategory]       = useState('all');
  const [search,   setSearch]         = useState('');
  const [viewMode, setViewMode]       = useState<ViewMode>('grid');
  const [editItem, setEditItem]       = useState<GalleryItem | null>(null);
  const [formOpen, setFormOpen]       = useState(false);
  const [deleteId, setDeleteId]       = useState<number | null>(null);
  const [preview,  setPreview]        = useState<GalleryItem | null>(null);

  const qc     = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<GalleryResponse>({
    queryKey: ['admin-gallery', category, search],
    queryFn:  () => fetchGallery(category, search),
  });

  const deleteMut = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({ title: 'Item deleted' });
      setDeleteId(null);
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const featuredMut = useMutation({
    mutationFn: toggleFeatured,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gallery'] }),
    onError: () => toast({ title: 'Failed to toggle featured', variant: 'destructive' }),
  });

  const items         = data?.items ?? [];
  const total         = data?.total ?? 0;
  const featuredCount = data?.featured_count ?? 0;
  const count360      = data?.count_360 ?? items.filter(i => i.has_360).length;

  const openAdd  = () => { setEditItem(null); setFormOpen(true); };
  const openEdit = (item: GalleryItem) => { setEditItem(item); setFormOpen(true); };

  return (
    <div>
      {/* ── header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Images className="h-6 w-6 text-primary" />
            Gallery Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage images that appear in the public gallery
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Image
        </Button>
      </div>

      {/* ── stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Images', value: total,              icon: ImageIcon, color: 'text-blue-500' },
          { label: 'Featured',     value: featuredCount,      icon: Star,      color: 'text-yellow-500' },
          { label: '360° Views',   value: count360,           icon: Globe,     color: 'text-cyan-500' },
          { label: 'Categories',   value: CATEGORIES.length - 1, icon: Tag,   color: 'text-purple-500' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-4 flex items-center gap-3">
              <s.icon className={cn('h-8 w-8', s.color)} />
              <div>
                <p className="text-2xl font-bold">{isLoading ? '—' : s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── filters bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1 ml-auto">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── content ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-3">Could not load gallery items. Make sure the Laravel API is running.</p>
            <Button variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ['admin-gallery'] })}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-4">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
            <div className="text-center">
              <p className="font-medium">No gallery images yet</p>
              <p className="text-sm text-muted-foreground">Add your first image to get started</p>
            </div>
            <Button onClick={openAdd} className="gap-2">
              <Plus className="h-4 w-4" /> Add First Image
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* ── GRID VIEW ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item.id} className="group overflow-hidden">
              <div className="relative bg-muted overflow-hidden" style={{ paddingTop: item.aspect === 'portrait' ? '133%' : '66%' }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/400x266/1e3a5f/7eb3ff?text=${encodeURIComponent(item.title)}`;
                  }}
                />

                {/* overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setPreview(item)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {item.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-1.5 py-0.5">
                    <Star className="h-3 w-3 mr-0.5" /> Featured
                  </Badge>
                )}

                {item.has_360 && (
                  <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-1.5 py-0.5 gap-1">
                    <Globe className="h-2.5 w-2.5" /> 360°
                  </Badge>
                )}

                <button
                  onClick={() => featuredMut.mutate(item.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                  title={item.is_featured ? 'Remove featured' : 'Mark as featured'}
                >
                  {item.is_featured
                    ? <StarOff className="h-3.5 w-3.5" />
                    : <Star className="h-3.5 w-3.5" />}
                </button>
              </div>

              <CardContent className="p-3">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {item.location && (
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5 truncate">
                      <MapPin className="h-3 w-3 shrink-0" />{item.location}
                    </span>
                  )}
                  {item.category && (
                    <Badge variant="outline" className="ml-auto text-xs capitalize shrink-0">{item.category}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add more card */}
          <Card
            className="border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-2 min-h-[160px]"
            onClick={openAdd}
          >
            <Upload className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Add Image</p>
          </Card>
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <Card>
          <div className="divide-y">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="w-16 h-12 rounded overflow-hidden bg-muted shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        `https://placehold.co/64x48/1e3a5f/7eb3ff?text=?`;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    {item.is_featured && (
                      <Badge className="bg-yellow-500 text-black text-xs shrink-0">Featured</Badge>
                    )}
                    {item.has_360 && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs shrink-0 gap-1">
                        <Globe className="h-2.5 w-2.5" /> 360°
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    {item.location && (
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{item.location}</span>
                    )}
                    {item.photographer && (
                      <span className="flex items-center gap-0.5"><User className="h-3 w-3" />{item.photographer}</span>
                    )}
                    {item.category && (
                      <Badge variant="outline" className="capitalize">{item.category}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setPreview(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => featuredMut.mutate(item.id)}
                    title={item.is_featured ? 'Remove featured' : 'Mark as featured'}
                  >
                    {item.is_featured
                      ? <StarOff className="h-4 w-4 text-yellow-500" />
                      : <Star className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── dialogs ── */}
      <ItemFormDialog
        open={formOpen}
        item={editItem}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
      />

      <PreviewDialog
        item={preview}
        onClose={() => setPreview(null)}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={v => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete gallery image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the image from the gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId !== null && deleteMut.mutate(deleteId)}
            >
              {deleteMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
