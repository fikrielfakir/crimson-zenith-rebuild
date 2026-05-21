import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Plus, Pencil, Trash2, Star, MessageSquare } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  feedback: string;
  rating: number;
  is_approved: boolean;
  is_active: boolean;
  ordering: number;
}

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await apiFetch('/api/admin/cms/stats?type=testimonials', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  const data = await res.json();
  return data.testimonials ?? [];
}

async function saveTestimonial(item: Partial<Testimonial> & { id?: number }): Promise<void> {
  const res = await apiFetch('/api/admin/cms/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ type: 'testimonials', items: [item] }),
  });
  if (!res.ok) throw new Error('Failed to save testimonial');
}

async function deleteTestimonial(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/cms/stats/testimonials/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete testimonial');
}

const emptyForm = { name: '', role: '', feedback: '', rating: 5, is_approved: true, is_active: true };

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: fetchTestimonials,
  });

  const saveMutation = useMutation({
    mutationFn: saveTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: `Testimonial ${editingItem ? 'updated' : 'created'} successfully` });
      handleClose();
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: 'Testimonial deleted' });
      setDeletingId(null);
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      role: item.role ?? '',
      feedback: item.feedback,
      rating: item.rating,
      is_approved: item.is_approved,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.feedback.trim()) {
      toast({ title: 'Error', description: 'Name and feedback are required', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(editingItem ? { ...form, id: editingItem.id } : form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage community testimonials shown on the landing page</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No testimonials yet</p>
              <p className="text-sm mt-2">Click "Add Testimonial" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.role ?? '—'}</TableCell>
                    <TableCell><StarRating value={item.rating} /></TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{item.feedback}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.is_approved
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                            : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                        }`}>
                          {item.is_approved ? 'Approved' : 'Pending'}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.is_active
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                        }`}>
                          {item.is_active ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)}>
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
            <DialogTitle>{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update testimonial details' : 'Add a new testimonial to the landing page'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="t-name">Name *</Label>
              <Input id="t-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Member name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-role">Role / Title</Label>
              <Input id="t-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g., Club Member, Volunteer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-feedback">Feedback *</Label>
              <Textarea id="t-feedback" value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} rows={4} placeholder="Their testimonial text..." />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {'★'.repeat(r)}{'☆'.repeat(5 - r)} ({r}/5)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch id="t-approved" checked={form.is_approved} onCheckedChange={(v) => setForm({ ...form, is_approved: v })} />
                <Label htmlFor="t-approved">Approved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="t-active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label htmlFor="t-active">Visible on site</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the testimonial from the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
