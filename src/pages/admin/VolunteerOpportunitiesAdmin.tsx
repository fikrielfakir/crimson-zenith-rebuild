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
import { Plus, MoreHorizontal, Pencil, Trash2, Search, RefreshCw, Users, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  location: string | null;
  duration: string | null;
  max_participants: number;
  current_participants: number;
  description: string | null;
  skills: string[] | null;
  urgency: 'high' | 'medium' | 'low';
  status: 'draft' | 'published';
  created_at: string;
}

const URGENCY_COLORS = {
  high:   'bg-red-50 text-red-700 ring-red-600/20',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  low:    'bg-green-50 text-green-700 ring-green-600/20',
};

const emptyForm = {
  title: '', location: '', duration: '', max_participants: 10, current_participants: 0,
  description: '', skills: '', urgency: 'medium' as const, status: 'draft' as const,
};

type FormState = typeof emptyForm;

async function fetchOpportunities(status: string, search: string) {
  const params = new URLSearchParams({ per_page: '50' });
  if (status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const res = await apiFetch(`/api/admin/volunteer-opportunities?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return (data.data ?? data) as Opportunity[];
}

export default function VolunteerOpportunitiesAdmin() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-volunteer-opps', statusFilter, search],
    queryFn: () => fetchOpportunities(statusFilter, search),
  });

  const saveMutation = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = { ...f, skills: f.skills ? f.skills.split(',').map(s => s.trim()).filter(Boolean) : [] };
      const url = editing ? `/api/admin/volunteer-opportunities/${editing.id}` : '/api/admin/volunteer-opportunities';
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
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-opps'] });
      toast({ title: editing ? 'Opportunity updated' : 'Opportunity created' });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/volunteer-opportunities/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer-opps'] });
      toast({ title: 'Deleted' });
      setDeletingId(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(o: Opportunity) {
    setEditing(o);
    setForm({
      title: o.title, location: o.location ?? '', duration: o.duration ?? '',
      max_participants: o.max_participants, current_participants: o.current_participants,
      description: o.description ?? '', skills: (o.skills ?? []).join(', '),
      urgency: o.urgency, status: o.status,
    });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Opportunities</h1>
          <p className="text-muted-foreground mt-1">Spontaneous volunteer calls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New Opportunity</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search…" className="pl-9" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Opportunities ({data.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No opportunities found. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="pl-6">
                      <p className="font-medium">{o.title}</p>
                      {o.duration && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" />{o.duration}</p>}
                    </TableCell>
                    <TableCell><span className="flex items-center gap-1 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{o.location ?? '—'}</span></TableCell>
                    <TableCell><span className="text-sm">{o.current_participants}/{o.max_participants}</span></TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${URGENCY_COLORS[o.urgency]}`}>
                        <AlertTriangle className="h-3 w-3" />{o.urgency.charAt(0).toUpperCase() + o.urgency.slice(1)}
                      </span>
                    </TableCell>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Opportunity' : 'New Opportunity'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Trail clean-up weekend" />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Marrakech" />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="2 days" />
              </div>
              <div className="space-y-1.5">
                <Label>Max Participants</Label>
                <Input type="number" min={1} value={form.max_participants} onChange={e => setForm(f => ({ ...f, max_participants: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Current Participants</Label>
                <Input type="number" min={0} value={form.current_participants} onChange={e => setForm(f => ({ ...f, current_participants: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Urgency</Label>
                <Select value={form.urgency} onValueChange={v => setForm(f => ({ ...f, urgency: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Skills (comma-separated)</Label>
                <Input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="Hiking, First Aid, Photography" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the opportunity…" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate(form)} disabled={!form.title.trim() || saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving…' : editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deletingId !== null} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete opportunity?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
