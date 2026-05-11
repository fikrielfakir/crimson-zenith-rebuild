import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Plus, Pencil, Trash2, MapPin, RefreshCw, Settings, Globe, Save,
  ImageIcon, Search, Check, Link as LinkIcon, Eye, EyeOff, ArrowUp, ArrowDown, X, GripVertical,
  Mountain, Waves, Coffee, Map, Compass, Camera, Bike, Car, Plane, Ship,
  Tent, Flame, Sun, Moon, Star, Heart, Music, Book, TreePine, Fish,
  Anchor, Zap, Wind, Cloud, Umbrella, Leaf, Utensils, ShoppingBag,
  Trophy, Flag, Landmark, Building2, Palette, Dumbbell, Flower2, Pizza,
  Mic, Layers, Activity, Users, Sparkles, Aperture, Feather, Shell,
} from 'lucide-react';

/* ─────────────────────────────── types ─────────────────────────────── */
interface MediaFile {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  altText?: string | null;
}

interface CityActivity { name: string; icon: string; description: string; }
interface CuisineDish  { name: string; description: string; }
interface HighlightItem { text: string; image?: string; }

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

interface DiscoverSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  intro_heading: string;
  intro_description: string;
  cta_heading: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

/* ─────────────────── built-in city images ─────────────────── */
const BUILTIN_IMAGES = [
  { url: '/attached_assets/generated_images/Tangier_city_aerial_view_03330006.png',           label: 'Tangier — Aerial View' },
  { url: '/attached_assets/generated_images/Tetouan_medina_panorama_b1f6dcbc.png',            label: 'Tetouan — Medina Panorama' },
  { url: '/attached_assets/generated_images/Al_Hoceima_coastal_view_9e4e9e0c.png',            label: 'Al Hoceima — Coastal View' },
  { url: '/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png',           label: 'Chefchaouen — Blue Streets' },
  { url: '/attached_assets/generated_images/Fes_medina_and_tanneries_3e9a2ff0.png',           label: 'Fes — Medina & Tanneries' },
  { url: '/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png',   label: 'Essaouira — Coastal Fortifications' },
  { url: '/attached_assets/generated_images/Moroccan_cultural_heritage_architecture_19572d75.png', label: 'Moroccan Heritage Architecture' },
  { url: '/attached_assets/generated_images/Moroccan_entertainment_festival_performance_51d1857c.png', label: 'Moroccan Festival' },
];

/* ─────────────────── MediaPickerDialog ─────────────────── */
function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (url: string) => void;
}) {
  const [tab, setTab]         = useState<'builtin' | 'library' | 'url'>('builtin');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [media, setMedia]     = useState<MediaFile[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    if (open && tab === 'library' && media.length === 0) {
      setLoadingMedia(true);
      apiFetch('/api/admin/media', { credentials: 'include' })
        .then(r => r.json())
        .then(d => { setMedia(Array.isArray(d) ? d : (d.media ?? [])); })
        .catch(() => {})
        .finally(() => setLoadingMedia(false));
    }
  }, [open, tab]);

  function confirm() {
    const url = tab === 'url' ? urlInput : selected;
    if (url) { onSelect(url); onOpenChange(false); setSelected(''); setUrlInput(''); }
  }

  const filteredBuiltin = BUILTIN_IMAGES.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMedia = media
    .filter(m => m.fileType.startsWith('image/'))
    .filter(m => (m.fileName ?? '').toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Choose Image
          </DialogTitle>
          <DialogDescription>Select from built-in city images, your media library, or enter a custom URL.</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b pb-2 shrink-0">
          {(['builtin', 'library', 'url'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(''); setSelected(''); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t === 'builtin' ? '📸 Built-in Images' : t === 'library' ? '🗂 Media Library' : '🔗 Custom URL'}
            </button>
          ))}
        </div>

        {/* Search */}
        {tab !== 'url' && (
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search images…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {tab === 'builtin' && (
            <div className="grid grid-cols-3 gap-3 p-1">
              {filteredBuiltin.map(img => (
                <button
                  key={img.url}
                  onClick={() => setSelected(img.url)}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    selected === img.url
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-white text-xs p-2 font-medium">{img.label}</p>
                  </div>
                  {selected === img.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <p className="text-xs text-center py-1.5 text-muted-foreground truncate px-1">{img.label}</p>
                </button>
              ))}
              {filteredBuiltin.length === 0 && (
                <p className="col-span-3 text-center py-8 text-muted-foreground">No images match your search.</p>
              )}
            </div>
          )}

          {tab === 'library' && (
            loadingMedia ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                Loading media library…
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{search ? 'No images match your search.' : 'No images in your media library yet.'}</p>
                <p className="text-sm mt-1">Upload images in the Media Library section.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 p-1">
                {filteredMedia.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item.fileUrl)}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                      selected === item.fileUrl
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={item.fileUrl}
                      alt={item.altText || item.fileName}
                      className="w-full h-36 object-cover bg-muted"
                      onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                    />
                    {selected === item.fileUrl && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <p className="text-xs text-center py-1.5 text-muted-foreground truncate px-1">{item.fileName}</p>
                  </button>
                ))}
              </div>
            )
          )}

          {tab === 'url' && (
            <div className="space-y-4 p-1 py-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg or /uploads/..."
                    className="flex-1"
                  />
                </div>
              </div>
              {urlInput && (
                <div className="rounded-xl overflow-hidden border aspect-video bg-muted">
                  <img src={urlInput} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview + Actions */}
        {selected && tab !== 'url' && (
          <div className="shrink-0 flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <img src={selected} alt="Selected" className="w-16 h-10 object-cover rounded" />
            <p className="text-sm text-muted-foreground flex-1 truncate">{selected}</p>
            <button onClick={() => setSelected('')} className="text-muted-foreground hover:text-foreground text-xs">Clear</button>
          </div>
        )}

        <div className="flex justify-end gap-3 shrink-0 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={confirm}
            disabled={tab === 'url' ? !urlInput : !selected}
          >
            <Check className="w-4 h-4 mr-2" />
            Use This Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────── ImageField ─────────────────── */
function ImageField({
  value,
  onChange,
  label = 'Image',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/attached_assets/..."
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          className="shrink-0 gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          Browse
        </Button>
      </div>
      {value && (
        <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
      <MediaPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} onSelect={onChange} />
    </div>
  );
}

/* ─────────────────── icon registry ─────────────────── */
const COMMON_ICONS: { name: string; Icon: React.FC<any> }[] = [
  { name: 'mountain',    Icon: Mountain },
  { name: 'waves',       Icon: Waves },
  { name: 'coffee',      Icon: Coffee },
  { name: 'map',         Icon: Map },
  { name: 'compass',     Icon: Compass },
  { name: 'camera',      Icon: Camera },
  { name: 'bike',        Icon: Bike },
  { name: 'car',         Icon: Car },
  { name: 'plane',       Icon: Plane },
  { name: 'ship',        Icon: Ship },
  { name: 'tent',        Icon: Tent },
  { name: 'flame',       Icon: Flame },
  { name: 'sun',         Icon: Sun },
  { name: 'moon',        Icon: Moon },
  { name: 'star',        Icon: Star },
  { name: 'heart',       Icon: Heart },
  { name: 'music',       Icon: Music },
  { name: 'book',        Icon: Book },
  { name: 'tree',        Icon: TreePine },
  { name: 'fish',        Icon: Fish },
  { name: 'anchor',      Icon: Anchor },
  { name: 'zap',         Icon: Zap },
  { name: 'wind',        Icon: Wind },
  { name: 'cloud',       Icon: Cloud },
  { name: 'umbrella',    Icon: Umbrella },
  { name: 'leaf',        Icon: Leaf },
  { name: 'utensils',    Icon: Utensils },
  { name: 'shopping',    Icon: ShoppingBag },
  { name: 'trophy',      Icon: Trophy },
  { name: 'flag',        Icon: Flag },
  { name: 'landmark',    Icon: Landmark },
  { name: 'building',    Icon: Building2 },
  { name: 'palette',     Icon: Palette },
  { name: 'dumbbell',    Icon: Dumbbell },
  { name: 'flower',      Icon: Flower2 },
  { name: 'pizza',       Icon: Pizza },
  { name: 'mic',         Icon: Mic },
  { name: 'layers',      Icon: Layers },
  { name: 'activity',    Icon: Activity },
  { name: 'users',       Icon: Users },
  { name: 'sparkles',    Icon: Sparkles },
  { name: 'globe',       Icon: Globe },
  { name: 'map-pin',     Icon: MapPin },
  { name: 'aperture',    Icon: Aperture },
  { name: 'feather',     Icon: Feather },
  { name: 'shell',       Icon: Shell },
  { name: 'settings',    Icon: Settings },
];

function renderLucideIcon(iconName: string, className = 'w-5 h-5') {
  const found = COMMON_ICONS.find(i => i.name === iconName);
  const Icon = found ? found.Icon : MapPin;
  return <Icon className={className} />;
}

/* ─────────────────── IconPickerDialog ─────────────────── */
function IconPickerDialog({
  open, onOpenChange, onSelect, current,
}: { open: boolean; onOpenChange: (v: boolean) => void; onSelect: (name: string) => void; current?: string }) {
  const [search, setSearch] = useState('');
  const filtered = COMMON_ICONS.filter(i => i.name.includes(search.toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Icon</DialogTitle>
          <DialogDescription>Pick an icon for this activity</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search icons…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="grid grid-cols-7 gap-1.5 max-h-64 overflow-y-auto py-1">
          {filtered.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => { onSelect(name); onOpenChange(false); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all hover:border-primary ${
                current === name ? 'border-primary bg-primary/10' : 'border-transparent bg-muted/40'
              }`}
              title={name}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] text-muted-foreground leading-none text-center truncate w-full">{name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────── SortableCard ─────────────────── */
function SortableCard({ id, children }: { id: string; children: (handle: React.ReactNode) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }}
      className={isDragging ? 'opacity-50 shadow-lg' : ''}
    >
      {children(
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...listeners}
          {...attributes}
          className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors shrink-0 mt-1"
          tabIndex={-1}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────── empty city ─────────────────── */
const emptyCity: Omit<City, 'id'> = {
  name: '', slug: '', title: '', description: '', image: '',
  highlights: [], activities: [], travelTips: [],
  culture: { title: 'Culture & Heritage', description: '', highlights: [] },
  cuisine: { title: 'Local Cuisine', dishes: [] },
  bestTime: { season: '', months: '', description: '', temperature: '' },
  gettingThere: { airport: '', transport: [], localTransport: '' },
  isActive: true, ordering: 0,
};

/* ─────────────────── fetchers ─────────────────── */
async function fetchCities() {
  const res = await apiFetch('/api/admin/cities');
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

async function fetchDiscoverSettings(): Promise<DiscoverSettings> {
  const res = await apiFetch('/api/cms/discover');
  if (!res.ok) throw new Error('Failed to fetch discover settings');
  return res.json();
}

/* ═══════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════ */
export default function CitiesManagement() {
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<City | null>(null);
  const [form, setForm]             = useState<any>(emptyCity);
  const [deleteId, setDeleteId]           = useState<number | null>(null);
  const [discoverForm, setDiscoverForm]   = useState<DiscoverSettings | null>(null);
  const [iconPickerFor, setIconPickerFor] = useState<number | null>(null);
  const [hlPickerFor, setHlPickerFor]     = useState<{ section: 'main' | 'culture'; idx: number } | null>(null);
  const { toast }                         = useToast();
  const queryClient                       = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-cities'], queryFn: fetchCities });
  const cities: City[] = data?.cities ?? [];

  const { data: discoverData } = useQuery({
    queryKey: ['discover-settings'],
    queryFn: fetchDiscoverSettings,
    onSuccess: (d: DiscoverSettings) => {
      if (!discoverForm) setDiscoverForm(d);
    },
  });

  const currentDiscover: DiscoverSettings = discoverForm ?? discoverData ?? {} as DiscoverSettings;

  /* city form helpers */
  function openCreate() {
    setEditing(null);
    setForm({ ...emptyCity, highlights: [], cultureHighlights: [], activities: [], dishes: [] });
    setShowForm(true);
  }

  function openEdit(city: City) {
    setEditing(city);
    setForm({
      ...city,
      highlights:         (city.highlights ?? []).map((h: any) => typeof h === 'string' ? { text: h, image: '' } : h),
      cultureHighlights:  (city.culture?.highlights ?? []).map((h: any) => typeof h === 'string' ? { text: h, image: '' } : h),
      activities:         city.activities ?? [],
      dishes:             city.cuisine?.dishes ?? [],
      travelTipsText:     (city.travelTips ?? []).join('\n'),
      transportText:      (city.gettingThere?.transport ?? []).join('\n'),
    });
    setShowForm(true);
  }

  function formToPayload(f: any) {
    return {
      name:        f.name,
      slug:        f.slug,
      title:       f.title,
      description: f.description,
      image:       f.image,
      highlights:  (f.highlights ?? []).map((h: HighlightItem) => h.text).filter(Boolean),
      activities:  f.activities ?? [],
      travelTips:  (f.travelTipsText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      culture: f.culture ? {
        ...f.culture,
        highlights: (f.cultureHighlights ?? []).map((h: HighlightItem) => h.text).filter(Boolean),
      } : null,
      cuisine:      f.cuisine ? { ...f.cuisine, dishes: f.dishes ?? [] } : null,
      bestTime:     f.bestTime,
      gettingThere: f.gettingThere ? {
        ...f.gettingThere,
        transport: (f.transportText || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      } : null,
      isActive:  f.isActive,
      ordering:  Number(f.ordering) || 0,
    };
  }

  /* array item helpers */
  function addActivity() {
    setForm((p: any) => ({ ...p, activities: [...(p.activities ?? []), { name: '', icon: 'map-pin', description: '' }] }));
  }
  function removeActivity(i: number) {
    setForm((p: any) => ({ ...p, activities: (p.activities ?? []).filter((_: any, idx: number) => idx !== i) }));
  }
  function updateActivity(i: number, key: string, val: string) {
    setForm((p: any) => { const a = [...(p.activities ?? [])]; a[i] = { ...a[i], [key]: val }; return { ...p, activities: a }; });
  }

  function addDish() {
    setForm((p: any) => ({ ...p, dishes: [...(p.dishes ?? []), { name: '', description: '' }] }));
  }
  function removeDish(i: number) {
    setForm((p: any) => ({ ...p, dishes: (p.dishes ?? []).filter((_: any, idx: number) => idx !== i) }));
  }
  function updateDish(i: number, key: string, val: string) {
    setForm((p: any) => { const d = [...(p.dishes ?? [])]; d[i] = { ...d[i], [key]: val }; return { ...p, dishes: d }; });
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(key: string, prefix: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = parseInt(String(active.id).replace(`${prefix}-`, ''));
    const newIndex = parseInt(String(over.id).replace(`${prefix}-`, ''));
    setForm((p: any) => ({ ...p, [key]: arrayMove(p[key] ?? [], oldIndex, newIndex) }));
  }

  function addHighlight(section: 'main' | 'culture') {
    const key = section === 'main' ? 'highlights' : 'cultureHighlights';
    setForm((p: any) => ({ ...p, [key]: [...(p[key] ?? []), { text: '', image: '' }] }));
  }
  function removeHighlight(section: 'main' | 'culture', i: number) {
    const key = section === 'main' ? 'highlights' : 'cultureHighlights';
    setForm((p: any) => ({ ...p, [key]: (p[key] ?? []).filter((_: any, idx: number) => idx !== i) }));
  }
  function updateHighlight(section: 'main' | 'culture', i: number, field: string, val: string) {
    const key = section === 'main' ? 'highlights' : 'cultureHighlights';
    setForm((p: any) => { const arr = [...(p[key] ?? [])]; arr[i] = { ...arr[i], [field]: val }; return { ...p, [key]: arr }; });
  }

  function setField(path: string, value: any) {
    setForm((prev: any) => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      const top = parts[0];
      return { ...prev, [top]: { ...(prev[top] || {}), [parts[1]]: value } };
    });
  }

  function setDiscoverField(key: keyof DiscoverSettings, value: string) {
    setDiscoverForm(prev => ({ ...(prev ?? discoverData ?? {} as DiscoverSettings), [key]: value }));
  }

  /* mutations */
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = formToPayload(form);
      const url    = editing ? `/api/admin/cities/${editing.id}` : '/api/admin/cities';
      const method = editing ? 'PUT' : 'POST';
      const res    = await apiFetch(url, { method, body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Save failed'); }
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
    onSuccess: (d) => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast({ title: d.message });
    },
    onError: () => toast({ title: 'Seed failed', variant: 'destructive' }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiFetch(`/api/admin/cities/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-cities'] }),
    onError: () => toast({ title: 'Failed to toggle visibility', variant: 'destructive' }),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, ordering }: { id: number; ordering: number }) => {
      const res = await apiFetch(`/api/admin/cities/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ordering }),
      });
      if (!res.ok) throw new Error('Reorder failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-cities'] }),
  });

  const saveDiscoverMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch('/api/admin/cms/discover', {
        method: 'PUT',
        body: JSON.stringify(currentDiscover),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Save failed'); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-settings'] });
      toast({ title: 'Discover page settings saved' });
    },
    onError: (e: any) => toast({ title: 'Error saving settings', description: e.message, variant: 'destructive' }),
  });

  /* sorted cities */
  const sortedCities = [...cities].sort((a, b) => a.ordering - b.ordering);

  function moveCity(city: City, direction: 'up' | 'down') {
    const idx = sortedCities.findIndex(c => c.id === city.id);
    const neighbor = direction === 'up' ? sortedCities[idx - 1] : sortedCities[idx + 1];
    if (!neighbor) return;
    reorderMutation.mutate({ id: city.id, ordering: neighbor.ordering });
    reorderMutation.mutate({ id: neighbor.id, ordering: city.ordering });
  }

  /* ── render ── */
  return (
    <>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discover Page</h1>
          <p className="text-muted-foreground mt-1">Edit the Discover page content and manage city destination cards</p>
        </div>

        <Tabs defaultValue="cities">
          <TabsList className="mb-6">
            <TabsTrigger value="cities" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Cities
              {cities.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">{cities.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="page-settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Page Settings
            </TabsTrigger>
          </TabsList>

          {/* ══════════ CITIES TAB ══════════ */}
          <TabsContent value="cities">
            <div className="space-y-5">
              {/* toolbar */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {cities.length > 0
                    ? `${cities.filter(c => c.isActive).length} active · ${cities.filter(c => !c.isActive).length} hidden`
                    : 'No cities yet'}
                </p>
                <div className="flex gap-2">
                  {cities.length === 0 && (
                    <Button variant="outline" size="sm" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
                      Seed Defaults
                    </Button>
                  )}
                  <Button onClick={openCreate} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add City
                  </Button>
                </div>
              </div>

              {/* city cards grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-muted animate-pulse h-72" />
                  ))}
                </div>
              ) : cities.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-20 text-center">
                    <MapPin className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold text-foreground mb-1">No cities yet</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Click "Seed Defaults" to populate with Morocco's best destinations, or create a city from scratch.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Seed Defaults
                      </Button>
                      <Button onClick={openCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add City
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sortedCities.map((city, idx) => (
                    <div
                      key={city.id}
                      className={`group relative rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-all duration-300 ${
                        !city.isActive ? 'opacity-60' : ''
                      }`}
                    >
                      {/* image */}
                      <div className="relative h-44 bg-muted overflow-hidden">
                        {city.image ? (
                          <img
                            src={city.image}
                            alt={city.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-10 h-10 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* status badge */}
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant={city.isActive ? 'default' : 'secondary'}
                            className="text-xs shadow"
                          >
                            {city.isActive ? 'Active' : 'Hidden'}
                          </Badge>
                        </div>

                        {/* order badge */}
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{city.ordering}</span>
                        </div>

                        {/* city name over image */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-bold text-xl leading-tight drop-shadow">{city.name}</h3>
                          <p className="text-white/80 text-xs italic truncate">{city.title}</p>
                        </div>
                      </div>

                      {/* card body */}
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {city.description || <span className="italic opacity-50">No description</span>}
                        </p>

                        {/* highlights */}
                        {(city.highlights || []).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {city.highlights.slice(0, 3).map((h, i) => (
                              <span key={i} className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
                                {h}
                              </span>
                            ))}
                            {city.highlights.length > 3 && (
                              <span className="text-xs text-muted-foreground px-2 py-0.5">+{city.highlights.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* actions */}
                        <div className="flex items-center gap-1 pt-1 border-t">
                          {/* reorder */}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            disabled={idx === 0}
                            onClick={() => moveCity(city, 'up')}
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            disabled={idx === sortedCities.length - 1}
                            onClick={() => moveCity(city, 'down')}
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>

                          {/* toggle visibility */}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => toggleActiveMutation.mutate({ id: city.id, isActive: !city.isActive })}
                            title={city.isActive ? 'Hide city' : 'Show city'}
                          >
                            {city.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>

                          <div className="flex-1" />

                          {/* edit */}
                          <Button size="sm" variant="outline" onClick={() => openEdit(city)} className="h-8 gap-1.5">
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          {/* delete */}
                          <Button size="sm" variant="destructive" onClick={() => setDeleteId(city.id)} className="h-8">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ══════════ PAGE SETTINGS TAB ══════════ */}
          <TabsContent value="page-settings">
            <div className="space-y-6 max-w-3xl">
              {/* Hero */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hero Section</CardTitle>
                  <p className="text-sm text-muted-foreground">The full-screen banner at the top of the Discover page</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input value={currentDiscover.hero_title ?? ''} onChange={e => setDiscoverField('hero_title', e.target.value)} placeholder="Discover" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea rows={3} value={currentDiscover.hero_subtitle ?? ''} onChange={e => setDiscoverField('hero_subtitle', e.target.value)} placeholder="Embark on a journey…" />
                  </div>
                  <ImageField
                    label="Background Image"
                    value={currentDiscover.hero_bg_image ?? ''}
                    onChange={url => setDiscoverField('hero_bg_image', url)}
                  />
                </CardContent>
              </Card>

              {/* Intro */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Introduction Section</CardTitle>
                  <p className="text-sm text-muted-foreground">The text section below the hero banner</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input value={currentDiscover.intro_heading ?? ''} onChange={e => setDiscoverField('intro_heading', e.target.value)} placeholder="Morocco, a melting pot…" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={5} value={currentDiscover.intro_description ?? ''} onChange={e => setDiscoverField('intro_description', e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Call-to-Action Section</CardTitle>
                  <p className="text-sm text-muted-foreground">The banner at the bottom of the Discover page</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input value={currentDiscover.cta_heading ?? ''} onChange={e => setDiscoverField('cta_heading', e.target.value)} placeholder="Ready to Start Your Journey?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={2} value={currentDiscover.cta_description ?? ''} onChange={e => setDiscoverField('cta_description', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={currentDiscover.cta_button_text ?? ''} onChange={e => setDiscoverField('cta_button_text', e.target.value)} placeholder="JOIN THE JOURNEY" />
                    </div>
                    <div className="space-y-2">
                      <Label>Button Link</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={currentDiscover.cta_button_link ?? ''} onChange={e => setDiscoverField('cta_button_link', e.target.value)} placeholder="/join-us" className="pl-9" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => saveDiscoverMutation.mutate()} disabled={saveDiscoverMutation.isPending} size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  {saveDiscoverMutation.isPending ? 'Saving…' : 'Save Page Settings'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      {/* ── City Edit/Create Dialog ── */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : 'Add New City'}</DialogTitle>
            <DialogDescription>
              {editing
                ? `Changes will appear on /discover and /discover/cities?city=${editing.slug}`
                : 'Add a new city destination to the Discover page.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {/* Basic */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City Name *</Label>
                <Input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Marrakech" />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="marrakech" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="The Red City" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Describe this city…" />
            </div>

            {/* Image picker */}
            <ImageField
              label="City Hero Image"
              value={form.image}
              onChange={url => setField('image', url)}
            />

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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Highlights</Label>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd('highlights', 'hl-main', e)}>
                <SortableContext items={(form.highlights ?? []).map((_: any, i: number) => `hl-main-${i}`)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {(form.highlights ?? []).map((h: HighlightItem, i: number) => (
                      <SortableCard key={`hl-main-${i}`} id={`hl-main-${i}`}>
                        {handle => (
                          <div className="flex gap-2 items-start p-3 border rounded-lg bg-card">
                            {handle}
                            <div className="flex-1 space-y-2">
                              <Input value={h.text} onChange={e => updateHighlight('main', i, 'text', e.target.value)} placeholder="e.g. Historic Kasbah" />
                              <div className="flex items-center gap-2">
                                {h.image
                                  ? <img src={h.image} alt="" className="w-10 h-10 object-cover rounded border shrink-0" />
                                  : <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center shrink-0"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                                }
                                <button type="button" onClick={() => setHlPickerFor({ section: 'main', idx: i })} className="text-xs text-muted-foreground border rounded px-2 py-1 hover:bg-muted transition-colors">
                                  {h.image ? 'Change Image' : '+ Image'}
                                </button>
                                {h.image && <button type="button" onClick={() => updateHighlight('main', i, 'image', '')} className="text-xs text-destructive hover:underline">Remove</button>}
                              </div>
                            </div>
                            <button type="button" onClick={() => removeHighlight('main', i)} className="text-muted-foreground hover:text-destructive mt-1 shrink-0"><X className="w-4 h-4" /></button>
                          </div>
                        )}
                      </SortableCard>
                    ))}
                    <button type="button" onClick={() => addHighlight('main')} className="w-full border-dashed border-2 rounded-lg py-3 text-muted-foreground hover:text-foreground hover:border-primary text-sm transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Highlight
                    </button>
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Culture */}
            <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Culture & Heritage</h3>
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input value={form.culture?.title ?? ''} onChange={e => setField('culture.title', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={2} value={form.culture?.description ?? ''} onChange={e => setField('culture.description', e.target.value)} />
              </div>
              <div className="space-y-3">
                <Label>Highlights</Label>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd('cultureHighlights', 'hl-culture', e)}>
                  <SortableContext items={(form.cultureHighlights ?? []).map((_: any, i: number) => `hl-culture-${i}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {(form.cultureHighlights ?? []).map((h: HighlightItem, i: number) => (
                        <SortableCard key={`hl-culture-${i}`} id={`hl-culture-${i}`}>
                          {handle => (
                            <div className="flex gap-2 items-start p-3 border rounded-lg bg-card">
                              {handle}
                              <div className="flex-1 space-y-2">
                                <Input value={h.text} onChange={e => updateHighlight('culture', i, 'text', e.target.value)} placeholder="e.g. Ancient Medina" />
                                <div className="flex items-center gap-2">
                                  {h.image
                                    ? <img src={h.image} alt="" className="w-10 h-10 object-cover rounded border shrink-0" />
                                    : <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center shrink-0"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                                  }
                                  <button type="button" onClick={() => setHlPickerFor({ section: 'culture', idx: i })} className="text-xs text-muted-foreground border rounded px-2 py-1 hover:bg-muted transition-colors">
                                    {h.image ? 'Change Image' : '+ Image'}
                                  </button>
                                  {h.image && <button type="button" onClick={() => updateHighlight('culture', i, 'image', '')} className="text-xs text-destructive hover:underline">Remove</button>}
                                </div>
                              </div>
                              <button type="button" onClick={() => removeHighlight('culture', i)} className="text-muted-foreground hover:text-destructive mt-1 shrink-0"><X className="w-4 h-4" /></button>
                            </div>
                          )}
                        </SortableCard>
                      ))}
                      <button type="button" onClick={() => addHighlight('culture')} className="w-full border-dashed border-2 rounded-lg py-3 text-muted-foreground hover:text-foreground hover:border-primary text-sm transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Culture Highlight
                      </button>
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* Cuisine */}
            <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Local Cuisine</h3>
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input value={form.cuisine?.title ?? ''} onChange={e => setField('cuisine.title', e.target.value)} />
              </div>
              <div className="space-y-3">
                <Label>Dishes</Label>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd('dishes', 'dish', e)}>
                  <SortableContext items={(form.dishes ?? []).map((_: any, i: number) => `dish-${i}`)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {(form.dishes ?? []).map((dish: CuisineDish, i: number) => (
                        <SortableCard key={`dish-${i}`} id={`dish-${i}`}>
                          {handle => (
                            <div className="flex gap-2 items-start p-3 border rounded-lg bg-card">
                              {handle}
                              <div className="flex-1 space-y-2">
                                <Input value={dish.name} onChange={e => updateDish(i, 'name', e.target.value)} placeholder="Dish name (e.g. Tagine)" />
                                <Textarea rows={2} value={dish.description} onChange={e => updateDish(i, 'description', e.target.value)} placeholder="Short description…" />
                              </div>
                              <button type="button" onClick={() => removeDish(i)} className="text-muted-foreground hover:text-destructive mt-1 shrink-0"><X className="w-4 h-4" /></button>
                            </div>
                          )}
                        </SortableCard>
                      ))}
                      <button type="button" onClick={addDish} className="w-full border-dashed border-2 rounded-lg py-3 text-muted-foreground hover:text-foreground hover:border-primary text-sm transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Dish
                      </button>
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* Activities */}
            <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Activities</h3>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd('activities', 'act', e)}>
                <SortableContext items={(form.activities ?? []).map((_: any, i: number) => `act-${i}`)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {(form.activities ?? []).map((act: CityActivity, i: number) => (
                      <SortableCard key={`act-${i}`} id={`act-${i}`}>
                        {handle => (
                          <div className="p-3 border rounded-lg bg-card space-y-2">
                            <div className="flex items-center gap-2">
                              {handle}
                              <button
                                type="button"
                                onClick={() => setIconPickerFor(i)}
                                className="shrink-0 w-10 h-10 rounded-lg border bg-muted flex items-center justify-center hover:border-primary transition-colors"
                                title="Choose icon"
                              >
                                {renderLucideIcon(act.icon)}
                              </button>
                              <Input value={act.name} onChange={e => updateActivity(i, 'name', e.target.value)} placeholder="Activity name" className="flex-1" />
                              <button type="button" onClick={() => removeActivity(i)} className="text-muted-foreground hover:text-destructive shrink-0"><X className="w-4 h-4" /></button>
                            </div>
                            <Textarea rows={2} value={act.description} onChange={e => updateActivity(i, 'description', e.target.value)} placeholder="Description…" />
                          </div>
                        )}
                      </SortableCard>
                    ))}
                    <button type="button" onClick={addActivity} className="w-full border-dashed border-2 rounded-lg py-3 text-muted-foreground hover:text-foreground hover:border-primary text-sm transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Activity
                    </button>
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Best Time */}
            <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Best Time to Visit</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Season</Label>
                  <Input value={form.bestTime?.season ?? ''} onChange={e => setField('bestTime.season', e.target.value)} placeholder="Spring & Fall" />
                </div>
                <div className="space-y-2">
                  <Label>Months</Label>
                  <Input value={form.bestTime?.months ?? ''} onChange={e => setField('bestTime.months', e.target.value)} placeholder="April-May, Sept-Oct" />
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
            <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Getting There</h3>
              <div className="space-y-2">
                <Label>Airport</Label>
                <Input value={form.gettingThere?.airport ?? ''} onChange={e => setField('gettingThere.airport', e.target.value)} placeholder="City Airport (IATA)" />
              </div>
              <div className="space-y-2">
                <Label>Transport Options <span className="text-muted-foreground font-normal text-xs ml-1">— one per line</span></Label>
                <Textarea rows={3} value={form.transportText ?? (form.gettingThere?.transport ?? []).join('\n')} onChange={e => setField('transportText', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Local Transport</Label>
                <Textarea rows={2} value={form.gettingThere?.localTransport ?? ''} onChange={e => setField('gettingThere.localTransport', e.target.value)} />
              </div>
            </div>

            {/* Travel Tips */}
            <div className="space-y-2">
              <Label>Travel Tips <span className="text-muted-foreground font-normal text-xs ml-1">— one per line</span></Label>
              <Textarea rows={5} value={form.travelTipsText ?? (form.travelTips ?? []).join('\n')} onChange={e => setField('travelTipsText', e.target.value)} placeholder="Wear comfortable shoes…" />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name}>
                {saveMutation.isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create City'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Icon picker for activities ── */}
      <IconPickerDialog
        open={iconPickerFor !== null}
        onOpenChange={v => { if (!v) setIconPickerFor(null); }}
        current={iconPickerFor !== null ? (form.activities ?? [])[iconPickerFor]?.icon : undefined}
        onSelect={name => { if (iconPickerFor !== null) updateActivity(iconPickerFor, 'icon', name); }}
      />

      {/* ── Image picker for highlights ── */}
      <MediaPickerDialog
        open={hlPickerFor !== null}
        onOpenChange={v => { if (!v) setHlPickerFor(null); }}
        onSelect={url => {
          if (hlPickerFor !== null) {
            updateHighlight(hlPickerFor.section, hlPickerFor.idx, 'image', url);
            setHlPickerFor(null);
          }
        }}
      />

      {/* ── Delete confirmation ── */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete City</DialogTitle>
            <DialogDescription>
              This will permanently remove this city from the Discover page. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete City'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
