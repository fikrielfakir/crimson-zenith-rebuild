import { useState } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Pencil, Trash2, Search, RefreshCw, FolderOpen, MapPin, Users, Star } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';

interface Project {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  status: 'active' | 'ongoing' | 'planning' | 'completed';
  progress: number;
  image: string | null;
  location: string | null;
  participants_count: number;
  impact_people: number;
  impact_co2: string | null;
  impact_sites: number;
  is_featured: boolean;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  active:    'bg-green-50 text-green-700 ring-green-600/20',
  ongoing:   'bg-blue-50 text-blue-700 ring-blue-600/20',
  planning:  'bg-amber-50 text-amber-700 ring-amber-600/20',
  completed: 'bg-gray-50 text-gray-600 ring-gray-400/20',
};

const emptyForm = {
  title: '', description: '', category: '', status: 'planning' as const,
  progress: 0, image: '', location: '', participants_count: 0,
  impact_people: 0, impact_co2: '', impact_sites: 0, is_featured: false,
};
type FormState = typeof emptyForm;

async function fetchProjects(status: string, search: string) {
  const params = new URLSearchParams({ per_page: '50' });
  if (status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const res = await apiFetch(`/api/admin/projects?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return (data.data ?? data) as Project[];
}

export default function ProjectsAdmin() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-projects', statusFilter, search],
    queryFn: () => fetchProjects(statusFilter, search),
  });

  const saveMutation = useMutation({
    mutationFn: async (f: FormState) => {
      const url = editing ? `/api/admin/projects/${editing.id}` : '/api/admin/projects';
      const res = await apiFetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: editing ? 'Project updated' : 'Project created' });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({ title: 'Deleted' });
      setDeletingId(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/projects/${id}/toggle-featured`, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title, description: p.description ?? '', category: p.category ?? '',
      status: p.status, progress: p.progress, image: p.image ?? '',
      location: p.location ?? '', participants_count: p.participants_count,
      impact_people: p.impact_people, impact_co2: p.impact_co2 ?? '',
      impact_sites: p.impact_sites, is_featured: p.is_featured,
    });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage association projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />Refresh</Button>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Project</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }} className="flex gap-2 flex-1">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search projects…" className="pl-9" value={searchInput} onChange={e => setSearchInput(e.target.value)} /></div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5" />Projects ({data.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>No projects yet. Create one to get started.</p></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Project</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        {p.image && <img src={p.image} alt={p.title} className="h-10 w-10 rounded object-cover flex-shrink-0" />}
                        <div>
                          <p className="font-medium">{p.title}</p>
                          {p.category && <p className="text-xs text-muted-foreground">{p.category}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{p.location ?? '—'}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={p.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8 text-right">{p.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 capitalize ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><Users className="h-3.5 w-3.5 text-muted-foreground" />{p.participants_count}</span></TableCell>
                    <TableCell>
                      <button onClick={() => toggleFeaturedMutation.mutate(p.id)} className="flex items-center">
                        <Star className={`h-4 w-4 ${p.is_featured ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                      </button>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <TranslateDialog
                          entityType="project"
                          entityId={p.id}
                          entityLabel={p.title}
                          fields={[
                            { key: 'title', label: 'Title' },
                            { key: 'description', label: 'Description', multiline: true },
                          ]}
                          sourceValues={{ title: p.title, description: p.description ?? '' }}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(p)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingId(p.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Atlas Reforestation Initiative" /></div>
              <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Environment" /></div>
              <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="High Atlas Mountains" /></div>
              <div className="space-y-1.5"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="planning">Planning</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: +e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Cover Image URL</Label><Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" /></div>
              <div className="space-y-1.5"><Label>Participants</Label><Input type="number" min={0} value={form.participants_count} onChange={e => setForm(f => ({ ...f, participants_count: +e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Impact: People</Label><Input type="number" min={0} value={form.impact_people} onChange={e => setForm(f => ({ ...f, impact_people: +e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Impact: CO₂ reduction</Label><Input value={form.impact_co2} onChange={e => setForm(f => ({ ...f, impact_co2: e.target.value }))} placeholder="50 tons" /></div>
              <div className="space-y-1.5"><Label>Impact: Sites</Label><Input type="number" min={0} value={form.impact_sites} onChange={e => setForm(f => ({ ...f, impact_sites: +e.target.value }))} /></div>
              <div className="col-span-2 flex items-center gap-3">
                <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
                <Label>Featured on homepage</Label>
              </div>
              <div className="col-span-2 space-y-1.5"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the project…" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate(form)} disabled={!form.title.trim() || saveMutation.isPending}>{saveMutation.isPending ? 'Saving…' : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete project?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
