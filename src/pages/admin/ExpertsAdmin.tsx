import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Pencil, Trash2, Search, RefreshCw, Star, GraduationCap, MapPin, Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';

interface Expert {
  id: number;
  name: string;
  title: string | null;
  location: string | null;
  image: string | null;
  linkedin_url: string | null;
  contact_email: string | null;
  expertise: string[] | null;
  rating: number;
  projects_count: number;
  years_experience: number;
  languages: string[] | null;
  bio: string | null;
  achievements: string[] | null;
  certifications: string[] | null;
  is_available: boolean;
  status: 'draft' | 'published';
  created_at: string;
}

const emptyForm = {
  name: '', title: '', location: '', image: '', linkedin_url: '', contact_email: '',
  expertise: '', rating: 5.0, projects_count: 0, years_experience: 0, languages: '',
  bio: '', achievements: '', certifications: '',
  is_available: true, status: 'draft' as const,
};
type FormState = typeof emptyForm;

async function fetchExperts(status: string, search: string) {
  const params = new URLSearchParams({ per_page: '50' });
  if (status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const res = await apiFetch(`/api/admin/experts?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return (data.data ?? data) as Expert[];
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be under 5 MB.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiFetch('/api/admin/media', { method: 'POST', body: fd, credentials: 'include' });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url = data.fileUrl ?? data.url ?? '';
      onChange(url);
      toast({ title: 'Image uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {value ? (
        <div className="relative group w-32 h-32">
          <img src={value} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-border" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex flex-col items-center justify-center gap-1">
            <Button type="button" size="sm" variant="secondary" className="h-7 text-xs px-2" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3 mr-1" />}
              Change
            </Button>
            <Button type="button" size="sm" variant="destructive" className="h-7 text-xs px-2" onClick={() => { onChange(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} disabled={uploading}>
              <X className="h-3 w-3 mr-1" />Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer bg-muted/30"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs font-medium">Upload Photo</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function ExpertsAdmin() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Expert | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-experts', statusFilter, search],
    queryFn: () => fetchExperts(statusFilter, search),
  });

  const saveMutation = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        ...f,
        expertise: f.expertise ? f.expertise.split(',').map(s => s.trim()).filter(Boolean) : [],
        languages: f.languages ? f.languages.split(',').map(s => s.trim()).filter(Boolean) : [],
        achievements: f.achievements ? f.achievements.split('\n').map(s => s.trim()).filter(Boolean) : [],
        certifications: f.certifications ? f.certifications.split('\n').map(s => s.trim()).filter(Boolean) : [],
      };
      const url = editing ? `/api/admin/experts/${editing.id}` : '/api/admin/experts';
      const res = await apiFetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      toast({ title: editing ? 'Expert updated' : 'Expert created' });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/experts/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      toast({ title: 'Deleted' });
      setDeletingId(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(e: Expert) {
    setEditing(e);
    setForm({
      name: e.name, title: e.title ?? '', location: e.location ?? '', image: e.image ?? '',
      linkedin_url: e.linkedin_url ?? '', contact_email: e.contact_email ?? '',
      expertise: (e.expertise ?? []).join(', '), rating: e.rating,
      projects_count: e.projects_count, years_experience: e.years_experience,
      languages: (e.languages ?? []).join(', '), bio: e.bio ?? '',
      achievements: (e.achievements ?? []).join('\n'),
      certifications: (e.certifications ?? []).join('\n'),
      is_available: e.is_available, status: e.status,
    });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Experts</h1>
          <p className="text-muted-foreground mt-1">Manage expert profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />Refresh</Button>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Expert</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }} className="flex gap-2 flex-1">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search…" className="pl-9" value={searchInput} onChange={e => setSearchInput(e.target.value)} /></div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" />Experts ({data.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>No experts yet.</p></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        {e.image ? <img src={e.image} alt={e.name} className="h-9 w-9 rounded-full object-cover flex-shrink-0" /> : <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">{e.name.charAt(0)}</div>}
                        <div><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.title ?? ''}</p></div>
                      </div>
                    </TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{e.location ?? '—'}</span></TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{e.rating.toFixed(1)}</span></TableCell>
                    <TableCell><span className="text-sm">{e.years_experience} yrs · {e.projects_count} projects</span></TableCell>
                    <TableCell><Badge variant={e.is_available ? 'default' : 'secondary'}>{e.is_available ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell><Badge variant={e.status === 'published' ? 'default' : 'secondary'}>{e.status}</Badge></TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <TranslateDialog
                          entityType="expert"
                          entityId={e.id}
                          entityLabel={e.name}
                          fields={[
                            { key: 'name', label: 'Name' },
                            { key: 'title', label: 'Title' },
                            { key: 'bio', label: 'Bio', multiline: true },
                          ]}
                          sourceValues={{ name: e.name, title: e.title ?? '', bio: (e as any).bio ?? '' }}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(e)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingId(e.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Expert' : 'New Expert'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Profile Photo Upload */}
            <div className="flex items-start gap-6">
              <div className="space-y-1.5">
                <Label>Profile Photo</Label>
                <ImageUploader
                  value={form.image}
                  onChange={url => setForm(f => ({ ...f, image: url }))}
                />
              </div>
              <div className="flex-1 space-y-4 mt-0.5">
                <div className="space-y-1.5"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Amina Benali" /></div>
                <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Mountain Guide & Ecologist" /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Agadir" /></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Contact Email</Label><Input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="expert@example.com" /></div>
              <div className="space-y-1.5"><Label>LinkedIn URL</Label><Input value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/username" /></div>
              <div className="space-y-1.5"><Label>Rating (0–5)</Label><Input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Projects</Label><Input type="number" min={0} value={form.projects_count} onChange={e => setForm(f => ({ ...f, projects_count: +e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Years Experience</Label><Input type="number" min={0} value={form.years_experience} onChange={e => setForm(f => ({ ...f, years_experience: +e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label>Expertise (comma-separated)</Label><Input value={form.expertise} onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))} placeholder="Ecology, Trekking, Photography" /></div>
              <div className="space-y-1.5"><Label>Languages (comma-separated)</Label><Input value={form.languages} onChange={e => setForm(f => ({ ...f, languages: e.target.value }))} placeholder="Arabic, French, English" /></div>
              <div className="col-span-2 flex items-center gap-3">
                <Switch checked={form.is_available} onCheckedChange={v => setForm(f => ({ ...f, is_available: v }))} />
                <Label>Available for projects</Label>
              </div>
              <div className="col-span-2 space-y-1.5"><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short biography…" /></div>
              <div className="col-span-2 space-y-1.5"><Label>Achievements (one per line)</Label><Textarea rows={3} value={form.achievements} onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))} placeholder="Led 200+ expeditions&#10;National award 2023" /></div>
              <div className="col-span-2 space-y-1.5"><Label>Certifications (one per line)</Label><Textarea rows={3} value={form.certifications} onChange={e => setForm(f => ({ ...f, certifications: e.target.value }))} placeholder="IFMGA Mountain Guide&#10;Wilderness First Responder" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name.trim() || saveMutation.isPending}>{saveMutation.isPending ? 'Saving…' : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete expert?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
