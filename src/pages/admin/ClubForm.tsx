import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const clubFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  image: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
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
    defaultValues: {
      isActive: true,
    },
  });

  const isActive = watch('isActive');
  const clubName = watch('name');

  // Auto-generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Auto-generate slug when name changes (only for new clubs)
  useEffect(() => {
    if (!id && clubName) {
      setValue('slug', generateSlug(clubName));
    }
  }, [clubName, id, setValue]);

  useEffect(() => {
    if (id) {
      setIsFetching(true);
      fetch(`/api/admin/clubs/${id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch club');
          const data = await res.json();
          
          setValue('name', data.name);
          setValue('slug', data.slug || generateSlug(data.name));
          setValue('description', data.description);
          setValue('longDescription', data.longDescription || '');
          setValue('image', data.image || '');
          setValue('location', data.location);
          setValue('contactPhone', data.contactPhone || '');
          setValue('contactEmail', data.contactEmail || '');
          setValue('website', data.website || '');
          setValue('established', data.established || '');
          setValue('isActive', data.isActive ?? true);
          setValue('latitude', data.latitude?.toString() || '');
          setValue('longitude', data.longitude?.toString() || '');
          
          if (data.socialMedia) {
            setValue('facebook', data.socialMedia.facebook || '');
            setValue('instagram', data.socialMedia.instagram || '');
            setValue('twitter', data.socialMedia.twitter || '');
          }
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to load club',
            variant: 'destructive',
          });
          navigate('/admin/clubs');
        })
        .finally(() => setIsFetching(false));
    }
  }, [id, setValue, toast, navigate]);

  const onSubmit = async (data: ClubFormValues) => {
    setIsLoading(true);
    
    try {
      const socialMedia: any = {};
      if (data.facebook) socialMedia.facebook = data.facebook;
      if (data.instagram) socialMedia.instagram = data.instagram;
      if (data.twitter) socialMedia.twitter = data.twitter;

      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        longDescription: data.longDescription || null,
        image: data.image || null,
        location: data.location,
        contactPhone: data.contactPhone || null,
        contactEmail: data.contactEmail || null,
        website: data.website || null,
        established: data.established || null,
        isActive: data.isActive,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : null,
      };

      const response = await fetch(
        id ? `/api/admin/clubs/${id}` : '/api/admin/clubs',
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save club');
      }

      toast({
        title: 'Success',
        description: `Club ${id ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin/clubs');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${id ? 'update' : 'create'} club`,
        variant: 'destructive',
      });
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/clubs')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Club' : 'Add New Club'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Club Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter club name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="club-slug"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from name. Edit if needed (lowercase, hyphens only).
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter a brief description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              {...register('longDescription')}
              placeholder="Enter detailed description"
              rows={6}
            />
            {errors.longDescription && (
              <p className="text-sm text-destructive">{errors.longDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="established">Established</Label>
            <Input
              id="established"
              {...register('established')}
              placeholder="e.g., 2020 or January 2020"
            />
            {errors.established && (
              <p className="text-sm text-destructive">{errors.established.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              {...register('contactPhone')}
              placeholder="+1 234 567 8900"
            />
            {errors.contactPhone && (
              <p className="text-sm text-destructive">{errors.contactPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              placeholder="contact@club.com"
            />
            {errors.contactEmail && (
              <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://www.club.com"
            />
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              {...register('latitude')}
              placeholder="31.791702"
            />
            {errors.latitude && (
              <p className="text-sm text-destructive">{errors.latitude.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              {...register('longitude')}
              placeholder="-7.092620"
            />
            {errors.longitude && (
              <p className="text-sm text-destructive">{errors.longitude.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-lg font-semibold">Social Media</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              {...register('facebook')}
              placeholder="https://facebook.com/club"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              {...register('instagram')}
              placeholder="https://instagram.com/club"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              {...register('twitter')}
              placeholder="https://twitter.com/club"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active Club
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Inactive clubs won't appear in public listings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {id ? 'Update Club' : 'Create Club'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/clubs')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
