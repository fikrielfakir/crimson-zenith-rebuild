import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'server' | 'local'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Convert to base64 first — this always persists (unlike blob URLs)
      const base64 = await fileToBase64(file);

      // Try uploading to the server as imageData JSON
      try {
        const res = await fetch('/api/admin/cms/media', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ imageData: base64, alt: file.name }),
        });

        if (res.ok) {
          const data = await res.json();
          // The endpoint returns the MediaAsset model; `url` is the base64 data URL stored in DB
          const serverUrl: string = data.url || data.imageUrl || data.file_url || data.fileUrl || '';
          if (serverUrl) {
            setPreview(serverUrl);
            onChange(serverUrl);
            setUploadStatus('server');
            return;
          }
        }
      } catch {
        // Network error — fall through to base64 fallback
      }

      // Fallback: store the base64 data URL directly
      // This is persistent (survives page reloads) unlike blob: URLs
      setPreview(base64);
      onChange(base64);
      setUploadStatus('local');
    } catch {
      alert('Failed to read the image file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setUploadStatus('idle');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

          {/* Upload status badge */}
          {!isUploading && uploadStatus !== 'idle' && (
            <div className={cn(
              'absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
              uploadStatus === 'server'
                ? 'bg-green-600/90 text-white'
                : 'bg-amber-500/90 text-white'
            )}>
              {uploadStatus === 'server' ? (
                <><CheckCircle className="h-3 w-3" /> Saved to server</>
              ) : (
                <><AlertCircle className="h-3 w-3" /> Saved locally (embedded)</>
              )}
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
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading…' : 'Drop your image here, or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
