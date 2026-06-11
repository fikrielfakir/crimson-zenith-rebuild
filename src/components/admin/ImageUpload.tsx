import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { apiFetch, resolveStorageUrl } from '@/lib/apiFetch';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'server' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (PNG, JPG, GIF, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be under 10 MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setUploadError(null);

    // Show a local blob preview immediately while uploading
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name);

      const res = await apiFetch('/api/admin/cms/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const rawUrl: string = data.fileUrl ?? data.url ?? data.imageUrl ?? '';
        const serverUrl = resolveStorageUrl(rawUrl) ?? rawUrl;

        if (serverUrl && !serverUrl.startsWith('data:')) {
          setPreview(serverUrl);
          onChange(serverUrl);
          setUploadStatus('server');
          return;
        }

        // Fallback: build a media proxy URL from the asset id
        const assetId: string = String(data.id ?? '');
        if (assetId) {
          const mediaUrl = `/api/cms/media/${assetId}`;
          onChange(mediaUrl);
          setUploadStatus('server');
          return;
        }
      }

      const status = res.status;
      const errText = status === 401
        ? 'Session expired — please log out and log in again to upload images.'
        : `Upload failed (${status}). Please try again.`;
      setUploadError(errText);
      setUploadStatus('error');
      setPreview(null);
      onChange('');
    } catch {
      setUploadError('Network error while uploading. Please check your connection and try again.');
      setUploadStatus('error');
      setPreview(null);
      onChange('');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setUploadStatus('idle');
    setUploadError(null);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />

      {uploadError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>

          {!isUploading && uploadStatus === 'server' && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-green-600/90 px-2 py-1 text-xs font-medium text-white">
              <CheckCircle className="h-3 w-3" /> Saved to server
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => { if (!isUploading) fileInputRef.current?.click(); }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            'relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
            isUploading && 'pointer-events-none opacity-70'
          )}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="rounded-full bg-muted p-4">
              {isUploading
                ? <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                : <ImageIcon className="h-8 w-8 text-muted-foreground" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading…' : 'Drop your image here, or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
