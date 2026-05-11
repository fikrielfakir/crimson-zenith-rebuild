import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, MapPin, RefreshCw } from 'lucide-react';

interface CityActivity {
  name: string;
  icon: string;
  description: string;
}

interface CuisineDish {
  name: string;
  description: string;
}

interface City {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
  culture: { title: string; description: string; highlights: string[] } | null;
  cuisine: { title: string; dishes: CuisineDish[] } | null;
  activities: CityActivity[];
  bestTime: { season: string; months: string; description: string; temperature: string } | null;
  gettingThere: { airport: string; transport: string[]; localTransport: string } | null;
  travelTips: string[];
  isActive: boolean;
  ordering: number;
}

const emptyCity: Omit<City, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', slug: '', title: '', description: '', image: '',
  highlights: [], activities: [], travelTips: [],
  culture: { title: 'Culture & Heritage', description: '', highlights: [] },
  cuisine: { title: 'Local Cuisine', dishes: [] },
  bestTime: { season: '', months: '', description: '', temperature: '' },
  gettingThere: { airport: '', transport: [], localTransport: '' },
  isActive: true, ordering: 0,
};

async function fetchCities() {
  const res = await apiFetch('/api/admin/cities');
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

export default function CitiesManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<City | null>(null);
  const [form, setForm] = useState<any>(emptyCity);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-cities'], queryFn: fetchCities });
  const cities: City[] = data?.cities ?? [];

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyCity });
    setShowForm(true);
  }

  function openEdit(city: City) {
    setEditing(city);
    setForm({
      ...city,
      highlightsText: (city.highlights ?? []).join('\n'),
      travelTipsText: (city.travelTips ?? []).join('\n'),
      cultureHighlightsText: (city.culture?.highlights ?? []).join('\n'),
      transportText: (city.gettingThere?.transport ?? []).join('\n'),
      activitiesJson: JSON.stringify(city.activities ?? [], null, 2),
      dishesJson: JSON.stringify(city.cuisine?.dishes ?? [], null, 2),
    });
    setShowForm(true);
  }

  function formToPayload(f: any) {
    let activities = f.activities ?? [];
    try { activities = JSON.parse(f.activitiesJson || '[]'); } catch {}

    let dishes = [];
    try { dishes = JSON.parse(f.dishesJson || '[]'); } catch {}

    return {
      name: f.name,
      slug: f.slug,
      title: f.title,
      description: f.description,
      image: f.image,
      highlights: (f.highlightsText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      activities,
      travelTips: (f.travelTipsText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      culture: f.culture ? {
        ...f.culture,
        highlights: (f.cultureHighlightsText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      } : null,
      cuisine: f.cuisine ? { ...f.cuisine, dishes } : null,
      bestTime: f.bestTime,
      gettingThere: f.gettingThere ? {
        ...f.gettingThere,
        transport: (f.transportText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      } : null,
      isActive: f.isActive,
      ordering: Number(f.ordering) || 0,
    };
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = formToPayload(form);
      const url = editing ? `/api/admin/cities/${editing.id}` : '/api/admin/cities';
      const method = editing ? 'PUT' : 'POST';
      const res = await apiFetch(url, { method, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Save failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast({ title: editing ? 'City updated' : 'City created' });
      setShowForm(false);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast({ title: 'City deleted' });
      setDeleteId(null);
    },
    onError: () => toast({ title: 'Error deleting city', variant: 'destructive' }),
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/admin/cities/seed', { method: 'POST' });
      if (!res.ok) throw new Error('Seed failed');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast({ title: data.message });
    },
    onError: () => toast({ title: 'Seed failed', variant: 'destructive' }),
  });

  function setField(path: string, value: any) {
    setForm((prev: any) => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      const top = parts[0];
      return { ...prev, [top]: { ...(prev[top] || {}), [parts[1]]: value } };
    });
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cities Management</h1>
            <p className="text-muted-foreground mt-1">Manage the cities shown on the Discover page</p>
          </div>
          <div className="flex gap-2">
            {cities.length === 0 && (
              <Button variant="outline" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Seed Defaults
              </Button>
            )}
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Cities ({cities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading cities...</div>
            ) : cities.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No cities yet. Click "Seed Defaults" to populate with the existing cities or "Add City" to create one.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Tagline</TableHead>
                    <TableHead>Highlights</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="text-muted-foreground">{city.ordering}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {city.image && (
                            <img src={city.image} alt={city.name} className="w-10 h-10 rounded object-cover" />
                          )}
                          <div>
                            <div className="font-semibold">{city.name}</div>
                            <div className="text-xs text-muted-foreground">/{city.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground italic max-w-[200px] truncate">{city.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(city.highlights || []).slice(0, 2).map((h, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
                          ))}
                          {(city.highlights || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">+{city.highlights.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={city.isActive ? 'default' : 'secondary'}>
                          {city.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(city)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteId(city.id)}>
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* City Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : 'Add New City'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City Name *</Label>
                <Input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Marrakech" />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="e.g. marrakech" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. The Red City" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Describe this city..." />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={e => setField('image', e.target.value)} placeholder="/attached_assets/..." />
              {form.image && <img src={form.image} alt="preview" className="h-24 rounded object-cover" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.ordering} onChange={e => setField('ordering', e.target.value)} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.isActive} onCheckedChange={v => setField('isActive', v)} />
                <Label>Active (visible on site)</Label>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <Label>Highlights (one per line)</Label>
              <Textarea rows={4} value={form.highlightsText ?? (form.highlights ?? []).join('\n')} onChange={e => setField('highlightsText', e.target.value)} placeholder="Historic Kasbah&#10;Café Hafa&#10;Strait of Gibraltar" />
            </div>

            {/* Culture */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Culture & Heritage</h3>
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input value={form.culture?.title ?? ''} onChange={e => setField('culture.title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={form.culture?.description ?? ''} onChange={e => setField('culture.description', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Culture Highlights (one per line)</Label>
                <Textarea rows={3} value={form.cultureHighlightsText ?? (form.culture?.highlights ?? []).join('\n')} onChange={e => setField('cultureHighlightsText', e.target.value)} />
              </div>
            </div>

            {/* Cuisine */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Local Cuisine</h3>
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input value={form.cuisine?.title ?? ''} onChange={e => setField('cuisine.title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Dishes (JSON array: [{`{"name":"...", "description":"..."}`}])</Label>
                <Textarea rows={5} value={form.dishesJson ?? JSON.stringify(form.cuisine?.dishes ?? [], null, 2)} onChange={e => setField('dishesJson', e.target.value)} className="font-mono text-xs" />
              </div>
            </div>

            {/* Activities */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Activities</h3>
              <div className="space-y-2">
                <Label>Activities JSON (icon: map | mountain | coffee | waves)</Label>
                <Textarea rows={8} value={form.activitiesJson ?? JSON.stringify(form.activities ?? [], null, 2)} onChange={e => setField('activitiesJson', e.target.value)} className="font-mono text-xs" />
              </div>
            </div>

            {/* Best Time */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Best Time to Visit</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Input value={form.bestTime?.season ?? ''} onChange={e => setField('bestTime.season', e.target.value)} placeholder="Spring & Fall" />
                </div>
                <div className="space-y-2">
                  <Label>Months</Label>
                  <Input value={form.bestTime?.months ?? ''} onChange={e => setField('bestTime.months', e.target.value)} placeholder="April-May, September-October" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={2} value={form.bestTime?.description ?? ''} onChange={e => setField('bestTime.description', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Temperature Range</Label>
                <Input value={form.bestTime?.temperature ?? ''} onChange={e => setField('bestTime.temperature', e.target.value)} placeholder="18-25°C (64-77°F)" />
              </div>
            </div>

            {/* Getting There */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Getting There</h3>
              <div className="space-y-2">
                <Label>Airport</Label>
                <Input value={form.gettingThere?.airport ?? ''} onChange={e => setField('gettingThere.airport', e.target.value)} placeholder="City Airport (IATA)" />
              </div>
              <div className="space-y-2">
                <Label>Transport Options (one per line)</Label>
                <Textarea rows={3} value={form.transportText ?? (form.gettingThere?.transport ?? []).join('\n')} onChange={e => setField('transportText', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Local Transport</Label>
                <Textarea rows={2} value={form.gettingThere?.localTransport ?? ''} onChange={e => setField('gettingThere.localTransport', e.target.value)} />
              </div>
            </div>

            {/* Travel Tips */}
            <div className="space-y-2">
              <Label>Travel Tips (one per line)</Label>
              <Textarea rows={5} value={form.travelTipsText ?? (form.travelTips ?? []).join('\n')} onChange={e => setField('travelTipsText', e.target.value)} placeholder="Wear comfortable shoes..." />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name}>
                {saveMutation.isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create City'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete City</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this city? This cannot be undone.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
