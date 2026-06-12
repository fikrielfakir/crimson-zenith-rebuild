import { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/apiFetch';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  accept?: string;
  previewClass?: string;
  className?: string;
  endpoint?: string;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export function ImageUpload({
  value = '',
  onChange,
  label,
  description = 'PNG, JPG, WebP, SVG — max 50 MB',
  accept = 'image/*',
  previewClass,
  className,
  endpoint = '/api/admin/media',
  onUploadStart,
  onUploadEnd,
}: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef  = useRef<HTMLInputElement>(null);
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    onUploadStart?.();
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch(endpoint, { method: 'POST', body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? body.message ?? `Upload failed (${res.status})`);
      }
      const data = await res.json();
      const url: string = data.fileUrl ?? data.url ?? '';
      if (!url) throw new Error('No URL returned from server');
      onChange(url);
    } catch (err: any) {
      const msg = err.message ?? 'Upload failed';
      setError(msg);
      toast({ title: 'Upload failed', description: msg, variant: 'destructive' });
    } finally {
      setUploading(false);
      onUploadEnd?.();
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && <p className="text-sm font-medium leading-none">{label}</p>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer select-none',
          dragging   ? 'border-primary bg-primary/5'
                     : 'border-border hover:border-primary/50 hover:bg-muted/30',
          uploading && 'opacity-60 pointer-events-none'
        )}
      >
        {uploading
          ? <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          : <Upload className="h-8 w-8 text-muted-foreground" />}
        <div className="text-center">
          <p className="text-sm font-medium">
            {uploading ? 'Uploading…' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value && !uploading && (
        <div className={cn(
          'border rounded-lg p-4 bg-muted/30 flex items-center justify-center gap-3',
          previewClass ?? 'min-h-[80px]'
        )}>
          <img
            src={value}
            alt="Preview"
            className="max-h-20 max-w-[220px] object-contain rounded"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setError(null); onChange(''); }}
            className="text-xs text-destructive hover:underline self-start shrink-0"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
