import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Upload, X, ImageIcon, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Zod schema ──────────────────────────────────────────────────────────────
const clubFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(1, 'Location is required').max(255),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.string().email('Must be a valid email').or(z.literal('')).optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  established: z.string().max(100).optional(),
  isActive: z.boolean().default(true),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

type ClubFormValues = z.infer<typeof clubFormSchema>;

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { setPreview(value || ''); }, [value]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be under 5 MB.', variant: 'destructive' });
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await apiFetch('/api/admin/clubs/upload-image', { method: 'POST', body: fd });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Upload failed');
      const { url } = await res.json();
      setPreview(url);
      onChange(url);
      toast({ title: 'Image uploaded successfully' });
    } catch (err: any) {
      setPreview(value || '');
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {preview ? (
        <div className="relative group w-full max-w-sm">
          <img src={preview} alt="Club" className="w-full h-48 object-cover rounded-lg border" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              Replace
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => { setPreview(''); onChange(''); if (inputRef.current) inputRef.current.value = ''; }} disabled={uploading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          className="w-full max-w-sm h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground font-medium">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground/70">JPEG, PNG, WebP — max 5 MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Fix Leaflet's broken default icon paths in Vite builds ──────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
});

// Blue pin icon matching the site's primary colour
const BLUE_ICON = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
      fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  iconSize:   [28, 42],
  iconAnchor: [14, 42],
  popupAnchor:[0, -42],
});

const MOROCCO_CENTER: L.LatLngTuple = [31.7917, -7.0926];

// ─── Esri tile layers (same imagery as ClubsWithMap landing section) ──────────
const ESRI_SAT_URL   = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_LABEL_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

// ─── Map Location Picker — Leaflet (no WebGL required) ───────────────────────
function MapLocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat?: number | null;
  lng?: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);

  const [search,           setSearch]           = useState('');
  const [searching,        setSearching]        = useState(false);
  const [scrollZoomActive, setScrollZoomActive] = useState(false);
  const [coords,           setCoords]           = useState<{ lat: number; lng: number } | null>(
    lat != null && lng != null ? { lat, lng } : null,
  );
  const { toast } = useToast();

  const enableScrollZoom = () => {
    mapRef.current?.scrollWheelZoom.enable();
    setScrollZoomActive(true);
  };

  const disableScrollZoom = () => {
    mapRef.current?.scrollWheelZoom.disable();
    setScrollZoomActive(false);
  };

  // Sync external lat/lng (fires when edit form data loads)
  useEffect(() => {
    if (lat != null && lng != null) setCoords({ lat, lng });
  }, [lat, lng]);

  const placeMarker = useCallback(
    (latlng: L.LatLngLiteral) => {
      if (!mapRef.current) return;
      const r = { lat: +latlng.lat.toFixed(6), lng: +latlng.lng.toFixed(6) };
      setCoords(r);
      onChange(r.lat, r.lng);

      if (markerRef.current) {
        markerRef.current.setLatLng([r.lat, r.lng]);
      } else {
        markerRef.current = L.marker([r.lat, r.lng], { icon: BLUE_ICON, draggable: true })
          .addTo(mapRef.current);

        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng();
          const d = { lat: +pos.lat.toFixed(6), lng: +pos.lng.toFixed(6) };
          setCoords(d);
          onChange(d.lat, d.lng);
        });
      }
    },
    [onChange],
  );

  // Init Leaflet map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: L.LatLngTuple =
      lat != null && lng != null ? [lat, lng] : MOROCCO_CENTER;
    const zoom = lat != null && lng != null ? 12 : 5;

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Satellite base layer
    L.tileLayer(ESRI_SAT_URL, {
      maxZoom: 18,
      attribution: '© Esri',
    }).addTo(mapRef.current);

    // Labels overlay (city names, roads)
    L.tileLayer(ESRI_LABEL_URL, {
      maxZoom: 18,
      opacity: 0.8,
    }).addTo(mapRef.current);

    // Click to place / move pin
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => placeMarker(e.latlng));

    // Restore existing pin for edit mode
    if (lat != null && lng != null) {
      placeMarker({ lat, lng });
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current  = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan + re-pin when external coords arrive after map ready (edit mode load)
  useEffect(() => {
    if (!mapRef.current || lat == null || lng == null) return;
    mapRef.current.flyTo([lat, lng], 12, { duration: 0.8 });
    placeMarker({ lat, lng });
  }, [lat, lng, placeMarker]);

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } },
      );
      const results = await res.json();
      if (!results.length) {
        toast({ title: 'No results', description: 'Try a different search term.', variant: 'destructive' });
        return;
      }
      const { lat: rlat, lon: rlon } = results[0];
      const rl = parseFloat(rlat);
      const rn = parseFloat(rlon);
      placeMarker({ lat: rl, lng: rn });
      mapRef.current?.flyTo([rl, rn], 13, { duration: 0.8 });
    } catch {
      toast({ title: 'Search failed', description: 'Could not reach geocoding service.', variant: 'destructive' });
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    markerRef.current?.remove();
    markerRef.current = null;
    setCoords(null);
    onChange(0, 0);
  };

  return (
    <div className="space-y-2">
      {/* Search — intentionally a div, NOT a form, to avoid nested-form bug */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(e as any); } }}
            placeholder="Search city or address…"
            className="pl-8"
          />
        </div>
        <Button type="button" variant="secondary" disabled={searching} size="sm" className="shrink-0" onClick={(e) => handleSearch(e as any)}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {/* Map */}
      <div
        className="relative rounded-lg overflow-hidden border"
        style={{ height: 340 }}
        onMouseLeave={disableScrollZoom}
      >
        <div ref={containerRef} className="w-full h-full" />

        {/* Scroll-zoom activation overlay — click to enable, auto-hides when active */}
        <div
          onClick={enableScrollZoom}
          className={`absolute inset-0 z-[1000] flex items-center justify-center transition-opacity duration-300 cursor-pointer select-none ${
            scrollZoomActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
            </svg>
            Click to enable scroll zoom
          </div>
        </div>

        {/* Pin hint — bottom left */}
        <div className="absolute bottom-8 left-2 z-[999] bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded pointer-events-none">
          Click on the map to pin location
        </div>
      </div>

      {/* Coords + clear */}
      {coords && coords.lat !== 0 && coords.lng !== 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground h-7 px-2">
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No location set — click the map or search above.</p>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function ClubForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClubFormValues>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: { isActive: true, latitude: null, longitude: null },
  });

  const isActive   = watch('isActive');
  const clubName   = watch('name');
  const imageValue = watch('image');
  const latValue   = watch('latitude');
  const lngValue   = watch('longitude');

  const generateSlug = (name: string) =>
    name.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  useEffect(() => {
    if (!id && clubName) setValue('slug', generateSlug(clubName));
  }, [clubName, id, setValue]);

  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    apiFetch(`/api/admin/clubs/${id}`)
      .then((r) => { if (!r.ok) throw new Error('Failed to fetch club'); return r.json(); })
      .then((data) => {
        setValue('name',            data.name            ?? '');
        setValue('slug',            data.slug            || generateSlug(data.name ?? ''));
        setValue('description',     data.description     ?? '');
        setValue('longDescription', data.longDescription ?? '');
        setValue('image',           data.image           ?? '');
        setValue('location',        data.location        ?? '');
        setValue('contactPhone',    data.contactPhone    ?? '');
        setValue('contactEmail',    data.contactEmail    ?? '');
        setValue('website',         data.website         ?? '');
        setValue('established',     data.established     ?? '');
        setValue('isActive',        data.isActive        ?? true);
        setValue('latitude',        data.latitude        != null ? +data.latitude  : null);
        setValue('longitude',       data.longitude       != null ? +data.longitude : null);
        if (data.socialMedia) {
          setValue('facebook',  data.socialMedia.facebook  ?? '');
          setValue('instagram', data.socialMedia.instagram ?? '');
          setValue('twitter',   data.socialMedia.twitter   ?? '');
        }
      })
      .catch((err) => {
        toast({ title: 'Error', description: err.message || 'Failed to load club', variant: 'destructive' });
        navigate('/admin/clubs');
      })
      .finally(() => setIsFetching(false));
  }, [id, setValue, toast, navigate]);

  const onSubmit = async (data: ClubFormValues) => {
    setIsLoading(true);
    try {
      const socialMedia: Record<string, string> = {};
      if (data.facebook)  socialMedia.facebook  = data.facebook;
      if (data.instagram) socialMedia.instagram = data.instagram;
      if (data.twitter)   socialMedia.twitter   = data.twitter;

      const payload = {
        name:            data.name,
        slug:            data.slug,
        description:     data.description,
        longDescription: data.longDescription  || null,
        image:           data.image            || null,
        location:        data.location,
        contactPhone:    data.contactPhone     || null,
        contactEmail:    data.contactEmail     || null,
        website:         data.website          || null,
        established:     data.established      || null,
        isActive:        data.isActive,
        latitude:        data.latitude  || null,
        longitude:       data.longitude || null,
        socialMedia:     socialMedia,
      };

      const res = await apiFetch(
        id ? `/api/admin/clubs/${id}` : '/api/admin/clubs',
        { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save club');
      }

      toast({ title: 'Success', description: `Club ${id ? 'updated' : 'created'} successfully` });
      navigate('/admin/clubs');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || `Failed to ${id ? 'update' : 'create'} club`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/clubs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{id ? 'Edit Club' : 'Add New Club'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Club Name *</Label>
            <Input id="name" {...register('name')} placeholder="Enter club name" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input id="slug" {...register('slug')} placeholder="club-slug" />
            <p className="text-xs text-muted-foreground">Auto-generated from name (lowercase, hyphens only).</p>
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" {...register('location')} placeholder="e.g. Casablanca, Morocco" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          {/* Established */}
          <div className="space-y-2">
            <Label htmlFor="established">Established</Label>
            <Input id="established" {...register('established')} placeholder="e.g., 2020 or January 2020" />
          </div>

          {/* Short description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea id="description" {...register('description')} placeholder="Enter a brief description" rows={3} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/* Long description */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea id="longDescription" {...register('longDescription')} placeholder="Enter detailed description" rows={6} />
          </div>

          {/* Featured image */}
          <div className="space-y-2 md:col-span-2">
            <Label>Featured Image</Label>
            <ImageUpload value={imageValue} onChange={(url) => setValue('image', url)} />
          </div>

          {/* ── Map location picker ── */}
          <div className="space-y-2 md:col-span-2">
            <Label>Location on Map</Label>
            <MapLocationPicker
              lat={latValue}
              lng={lngValue}
              onChange={(lat, lng) => {
                setValue('latitude',  lat  || null);
                setValue('longitude', lng || null);
              }}
            />
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" {...register('contactPhone')} placeholder="+212 600 000000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" {...register('contactEmail')} placeholder="contact@club.com" />
            {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register('website')} placeholder="https://www.club.com" />
            {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
          </div>

          {/* Social media */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-base font-semibold">Social Media</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" {...register('facebook')} placeholder="https://facebook.com/club" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...register('instagram')} placeholder="https://instagram.com/club" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input id="twitter" {...register('twitter')} placeholder="https://twitter.com/club" />
          </div>

          {/* Active toggle */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={(v) => setValue('isActive', v)} />
              <Label htmlFor="isActive" className="cursor-pointer">Active Club</Label>
            </div>
            <p className="text-sm text-muted-foreground">Inactive clubs won't appear in public listings</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {id ? 'Update Club' : 'Create Club'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/clubs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
