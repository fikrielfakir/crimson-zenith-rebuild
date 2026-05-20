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
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Pencil, Trash2, Search, RefreshCw, Briefcase, MapPin, Building2, DollarSign } from 'lucide-react';

interface WorkOffer {
  id: number;
  title: string;
  company: string | null;
  location: string | null;
  type: string | null;
  salary: string | null;
  experience_level: string | null;
  description: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  category: string | null;
  status: 'draft' | 'published';
  created_at: string;
}

const emptyForm = {
  title: '', company: '', location: '', type: '', salary: '', experience_level: '',
  description: '', responsibilities: '', requirements: '', benefits: '',
  category: '', status: 'draft' as const,
};
type FormState = typeof emptyForm;

async function fetchOffers(status: string, search: string) {
  const params = new URLSearchParams({ per_page: '50' });
  if (status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const res = await apiFetch(`/api/admin/work-offers?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return (data.data ?? data) as WorkOffer[];
}

export default function WorkOffersAdmin() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkOffer | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-work-offers', statusFilter, search],
    queryFn: () => fetchOffers(statusFilter, search),
  });

  const saveMutation = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        ...f,
        responsibilities: f.responsibilities ? f.responsibilities.split('\n').map(s => s.trim()).filter(Boolean) : [],
        requirements: f.requirements ? f.requirements.split('\n').map(s => s.trim()).filter(Boolean) : [],
        benefits: f.benefits ? f.benefits.split('\n').map(s => s.trim()).filter(Boolean) : [],
      };
      const url = editing ? `/api/admin/work-offers/${editing.id}` : '/api/admin/work-offers';
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
      queryClient.invalidateQueries({ queryKey: ['admin-work-offers'] });
      toast({ title: editing ? 'Offer updated' : 'Offer created' });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/work-offers/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-work-offers'] });
      toast({ title: 'Deleted' });
      setDeletingId(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  function openCreate() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(o: WorkOffer) {
    setEditing(o);
    setForm({
      title: o.title, company: o.company ?? '', location: o.location ?? '',
      type: o.type ?? '', salary: o.salary ?? '', experience_level: o.experience_level ?? '',
      description: o.description ?? '',
      responsibilities: (o.responsibilities ?? []).join('\n'),
      requirements: (o.requirements ?? []).join('\n'),
      benefits: (o.benefits ?? []).join('\n'),
      category: o.category ?? '', status: o.status,
    });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Work Offers</h1>
          <p className="text-muted-foreground mt-1">Job and work opportunity listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />Refresh</Button>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Offer</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }} className="flex gap-2 flex-1">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by title or company…" className="pl-9" value={searchInput} onChange={e => setSearchInput(e.target.value)} /></div>
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
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Offers ({data.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>No work offers yet.</p></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="pl-6">
                      <p className="font-medium">{o.title}</p>
                      {o.category && <p className="text-xs text-muted-foreground">{o.category}</p>}
                    </TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />{o.company ?? '—'}</span></TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{o.location ?? '—'}</span></TableCell>
                    <TableCell><span className="text-sm">{o.type ?? '—'}</span></TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" />{o.salary ?? '—'}</span></TableCell>
                    <TableCell><Badge variant={o.status === 'published' ? 'default' : 'secondary'}>{o.status}</Badge></TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(o)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingId(o.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Work Offer' : 'New Work Offer'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Eco-Tourism Guide" /></div>
              <div className="space-y-1.5"><Label>Company</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Journey Association" /></div>
              <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Agadir" /></div>
              <div className="space-y-1.5"><Label>Type</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Full-time, Seasonal…" /></div>
              <div className="space-y-1.5"><Label>Salary</Label><Input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="5,000–8,000 MAD/month" /></div>
              <div className="space-y-1.5"><Label>Experience Level</Label><Input value={form.experience_level} onChange={e => setForm(f => ({ ...f, experience_level: e.target.value }))} placeholder="2+ years" /></div>
              <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Tourism" /></div>
              <div className="space-y-1.5 col-span-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select>
              </div>
              <div className="col-span-2 space-y-1.5"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role…" /></div>
              <div className="col-span-2 space-y-1.5"><Label>Responsibilities (one per line)</Label><Textarea rows={3} value={form.responsibilities} onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))} /></div>
              <div className="col-span-2 space-y-1.5"><Label>Requirements (one per line)</Label><Textarea rows={3} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} /></div>
              <div className="col-span-2 space-y-1.5"><Label>Benefits (one per line)</Label><Textarea rows={3} value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} /></div>
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
          <AlertDialogHeader><AlertDialogTitle>Delete offer?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
