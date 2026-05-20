import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Pencil, Trash2, Handshake, ExternalLink, Globe } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logo_id?: string;
  website_url?: string;
  description?: string;
  ordering: number;
  is_active: boolean;
}

type PartnerForm = {
  name: string;
  logo_id: string;
  website_url: string;
  description: string;
  is_active: boolean;
};

async function fetchPartners(): Promise<Partner[]> {
  const res = await apiFetch('/api/admin/cms/stats?type=partners', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch partners');
  const data = await res.json();
  return data.partners ?? [];
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

const emptyForm: PartnerForm = {
  name: '',
  logo_id: '',
  website_url: '',
  description: '',
  is_active: true,
};

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

export default function PartnersManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: fetchPartners,
  });

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

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation error', description: 'Partner name is required', variant: 'destructive' });
      return;
    }
    const payload = {
      ...form,
      ...(editingItem ? { id: editingItem.id } : {}),
    };
    saveMutation.mutate(payload);
  };

  const activeCount = partners.filter((p) => p.is_active).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partners</h1>
          <p className="text-muted-foreground mt-1">
            Manage partner organisations displayed on the landing page
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
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

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Partners</CardTitle>
          <CardDescription>
            {partners.length} partner{partners.length !== 1 ? 's' : ''} · ordered by display position
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                          <span className="truncate max-w-[140px]">{partner.website_url.replace(/^https?:\/\//, '')}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                      {partner.description || '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">#{partner.ordering}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          partner.is_active
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                            : 'bg-gray-50 text-gray-600 ring-1 ring-gray-400/20'
                        }`}
                      >
                        {partner.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
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

      {/* Add / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update partner details shown on the landing page'
                : 'Add a new partner organisation to the landing page'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="p-name">Partner Name *</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Royal Air Maroc"
              />
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="p-logo">Logo URL</Label>
              <Input
                id="p-logo"
                value={form.logo_id}
                onChange={(e) => setForm({ ...form, logo_id: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              {form.logo_id && (
                <div className="flex items-center gap-3 p-2 rounded-md border bg-gray-50">
                  <span className="text-xs text-muted-foreground">Preview:</span>
                  <img
                    src={form.logo_id}
                    alt="Logo preview"
                    className="h-8 max-w-[120px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Website URL */}
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

            {/* Description */}
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

            {/* Visibility */}
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
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving…' : editingItem ? 'Save Changes' : 'Add Partner'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove partner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the partner from the landing page. This action cannot be undone.
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
