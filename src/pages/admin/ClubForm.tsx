import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

const clubFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(1, 'Location is required').max(255),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.string().email('Must be a valid email').or(z.literal('')).optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  established: z.string().max(100).optional(),
  isActive: z.boolean().default(true),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

type ClubFormValues = z.infer<typeof clubFormSchema>;

function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be under 5 MB.', variant: 'destructive' });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiFetch('/api/admin/clubs/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div className="relative group w-full max-w-sm">
          <img
            src={preview}
            alt="Club image"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={uploading}
            >
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
          onDrop={handleDrop}
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
    defaultValues: { isActive: true },
  });

  const isActive = watch('isActive');
  const clubName = watch('name');
  const imageValue = watch('image');

  const generateSlug = (name: string): string =>
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
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch club');
        return res.json();
      })
      .then((data) => {
        setValue('name', data.name ?? '');
        setValue('slug', data.slug || generateSlug(data.name ?? ''));
        setValue('description', data.description ?? '');
        setValue('longDescription', data.longDescription ?? '');
        setValue('image', data.image ?? '');
        setValue('location', data.location ?? '');
        setValue('contactPhone', data.contactPhone ?? '');
        setValue('contactEmail', data.contactEmail ?? '');
        setValue('website', data.website ?? '');
        setValue('established', data.established ?? '');
        setValue('isActive', data.isActive ?? true);
        setValue('latitude', data.latitude?.toString() ?? '');
        setValue('longitude', data.longitude?.toString() ?? '');
        if (data.socialMedia) {
          setValue('facebook', data.socialMedia.facebook ?? '');
          setValue('instagram', data.socialMedia.instagram ?? '');
          setValue('twitter', data.socialMedia.twitter ?? '');
        }
      })
      .catch((error) => {
        toast({ title: 'Error', description: error.message || 'Failed to load club', variant: 'destructive' });
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
        latitude:        data.latitude  ? parseFloat(data.latitude)  : null,
        longitude:       data.longitude ? parseFloat(data.longitude) : null,
        socialMedia:     Object.keys(socialMedia).length > 0 ? socialMedia : null,
      };

      const res = await apiFetch(
        id ? `/api/admin/clubs/${id}` : '/api/admin/clubs',
        {
          method:  id ? 'PUT' : 'POST',
          body:    JSON.stringify(payload),
        }
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

          <div className="space-y-2">
            <Label htmlFor="name">Club Name *</Label>
            <Input id="name" {...register('name')} placeholder="Enter club name" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input id="slug" {...register('slug')} placeholder="club-slug" />
            <p className="text-xs text-muted-foreground">Auto-generated from name. Edit if needed (lowercase, hyphens only).</p>
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" {...register('location')} placeholder="Enter location" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea id="description" {...register('description')} placeholder="Enter a brief description" rows={3} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea id="longDescription" {...register('longDescription')} placeholder="Enter detailed description" rows={6} />
          </div>

          {/* Image Upload */}
          <div className="space-y-2 md:col-span-2">
            <Label>Featured Image</Label>
            <ImageUpload
              value={imageValue}
              onChange={(url) => setValue('image', url)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="established">Established</Label>
            <Input id="established" {...register('established')} placeholder="e.g., 2020 or January 2020" />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" {...register('latitude')} placeholder="31.791702" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" {...register('longitude')} placeholder="-7.092620" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-lg font-semibold">Social Media</Label>
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

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
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
