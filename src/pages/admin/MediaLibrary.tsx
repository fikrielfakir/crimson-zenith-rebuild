import { apiFetch } from '@/lib/apiFetch';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Image, File, Video, Music, Search, Copy, Check } from 'lucide-react';

interface MediaFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize?: number;
  fileUrl: string;
  thumbnailUrl?: string | null;
  altText?: string | null;
  createdAt: string;
}

async function fetchMedia(): Promise<MediaFile[]> {
  const response = await apiFetch('/api/admin/media', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch media files');
  const data = await response.json();
  return Array.isArray(data) ? data : (data.media ?? []);
}

async function deleteMedia(id: number): Promise<void> {
  const response = await apiFetch(`/api/admin/media/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete media file');
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return <Image className="h-8 w-8 text-blue-400" />;
  if (fileType.startsWith('video/')) return <Video className="h-8 w-8 text-purple-400" />;
  if (fileType.startsWith('audio/')) return <Music className="h-8 w-8 text-green-400" />;
  return <File className="h-8 w-8 text-gray-400" />;
}

function MediaCard({ file, onDelete }: { file: MediaFile; onDelete: (id: number) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(file.fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-muted flex items-center justify-center">
        {file.fileType.startsWith('image/') ? (
          <img
            src={file.thumbnailUrl || file.fileUrl}
            alt={file.altText || file.fileName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            {getFileIcon(file.fileType)}
            <span className="text-xs text-muted-foreground uppercase">
              {file.fileType.split('/')[1] || 'file'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopyUrl}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(file.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-2">
        <p className="text-xs font-medium truncate" title={file.fileName}>
          {file.fileName}
        </p>
        <div className="flex items-center justify-between mt-1">
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {file.fileType.split('/')[1] || file.fileType}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MediaLibrary() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['admin-media'],
    queryFn: fetchMedia,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast({ title: 'File deleted successfully' });
      setDeletingId(null);
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to delete file', description: err.message, variant: 'destructive' });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of Array.from(selectedFiles)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiFetch('/api/admin/media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast({
        title: `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully`,
        ...(failCount > 0 && { description: `${failCount} file(s) failed` }),
      });
    } else {
      toast({ title: 'Upload failed', description: 'No files were uploaded', variant: 'destructive' });
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'image' && file.fileType.startsWith('image/')) ||
      (typeFilter === 'video' && file.fileType.startsWith('video/')) ||
      (typeFilter === 'other' && !file.fileType.startsWith('image/') && !file.fileType.startsWith('video/'));
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'image', 'video', 'other'].map((t) => (
            <Button
              key={t}
              variant={typeFilter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Loading media files...
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48 text-destructive">
            Failed to load media files. Please try again.
          </CardContent>
        </Card>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
            <Image className="h-12 w-12 opacity-30" />
            <p>{search || typeFilter !== 'all' ? 'No files match your filters.' : 'No media files yet. Upload your first file.'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <MediaCard key={file.id} file={file} onDelete={setDeletingId} />
          ))}
        </div>
      )}

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file. Any content using this file will lose its reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
