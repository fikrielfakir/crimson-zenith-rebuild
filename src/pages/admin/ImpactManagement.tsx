import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';

interface SiteStat {
  id: number;
  label: string;
  value: string;
  icon?: string | null;
  suffix?: string | null;
  ordering: number;
  isActive: boolean;
}

const QUERY_KEY = ['admin-site-stats'] as const;

async function fetchStats(): Promise<SiteStat[]> {
  const res = await apiFetch('/api/cms/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

async function createStat(stat: Omit<SiteStat, 'id' | 'ordering'>): Promise<SiteStat> {
  const res = await apiFetch('/api/admin/cms/stats', {
    method: 'POST',
    body: JSON.stringify(stat),
  });
  if (!res.ok) throw new Error('Failed to create stat');
  return res.json();
}

async function updateStat(id: number, stat: Partial<SiteStat>): Promise<SiteStat> {
  const res = await apiFetch(`/api/admin/cms/stats/${id}`, {
    method: 'PUT',
    body: JSON.stringify(stat),
  });
  if (!res.ok) throw new Error('Failed to update stat');
  return res.json();
}

async function deleteStat(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/cms/stats/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete stat');
}

const emptyForm = { label: '', value: '', icon: '', suffix: '', isActive: true };

const ICON_SUGGESTIONS = ['Users', 'MapPin', 'Calendar', 'Award', 'Globe', 'Heart', 'Star', 'TrendingUp', 'Zap', 'Mountain'];

export default function ImpactManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingStat, setEditingStat] = useState<SiteStat | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: stats = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchStats,
  });

  const createMutation = useMutation({
    mutationFn: createStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: 'Stat added' });
      handleClose();
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<SiteStat>) => updateStat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: 'Stat updated' });
      handleClose();
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: 'Stat deleted' });
      setDeletingId(null);
    },
    onError: (err: Error) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const handleEdit = (stat: SiteStat) => {
    setEditingStat(stat);
    setForm({
      label: stat.label,
      value: stat.value,
      icon: stat.icon ?? '',
      suffix: stat.suffix ?? '',
      isActive: stat.isActive,
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingStat(null);
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.value.trim()) {
      toast({ title: 'Validation error', description: 'Label and value are required', variant: 'destructive' });
      return;
    }
    if (editingStat) {
      updateMutation.mutate({ id: editingStat.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Impact Stats</h1>
          <p className="text-muted-foreground mt-1">Manage the key impact numbers shown on the landing page</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stat
        </Button>
      </div>

      {/* Preview strip */}
      {stats.filter(s => s.isActive).length > 0 && (
        <div className="rounded-xl border bg-[#112250] p-6">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-4 text-center">Live preview</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.filter(s => s.isActive).slice(0, 4).map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-3xl font-bold text-white">
                  {stat.value}{stat.suffix && <span className="text-[#C9A35B]">{stat.suffix}</span>}
                </div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Stats</CardTitle>
          <CardDescription>{stats.length} stat{stats.length !== 1 ? 's' : ''} · {stats.filter(s => s.isActive).length} active</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">Loading…</div>
          ) : stats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No stats yet</p>
              <p className="text-sm mt-2">Click "Add Stat" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Suffix</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.label}</TableCell>
                    <TableCell className="text-xl font-bold text-primary">{stat.value}</TableCell>
                    <TableCell className="text-muted-foreground">{stat.suffix ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{stat.icon ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">#{stat.ordering}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        stat.isActive
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                          : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                      }`}>
                        {stat.isActive ? 'Visible' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TranslateDialog
                          entityType="site_stat"
                          entityId={stat.id}
                          entityLabel={stat.label}
                          fields={[
                            { key: 'label', label: 'Label' },
                            { key: 'value', label: 'Value' },
                          ]}
                          sourceValues={{ label: stat.label, value: stat.value }}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(stat)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(stat.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStat ? 'Edit Stat' : 'Add Impact Stat'}</DialogTitle>
            <DialogDescription>
              {editingStat ? 'Update this impact number' : 'Add a new key metric to the landing page'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="s-label">Label *</Label>
              <Input id="s-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g., Active Members, Events Organized" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="s-value">Value *</Label>
                <Input id="s-value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g., 1200, 50" />
                <p className="text-xs text-muted-foreground">The displayed number</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-suffix">Suffix</Label>
                <Input id="s-suffix" value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="e.g., +, k" />
                <p className="text-xs text-muted-foreground">Shown after value in gold</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-icon">Icon (Lucide name)</Label>
              <Input id="s-icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g., Users, MapPin, Calendar" />
              <div className="flex flex-wrap gap-1 mt-1">
                {ICON_SUGGESTIONS.map(ic => (
                  <button key={ic} type="button"
                    className="text-xs px-2 py-0.5 rounded border bg-muted hover:bg-muted/80 font-mono"
                    onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="s-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label htmlFor="s-active">Visible on site</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete stat?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this impact number from the site.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
