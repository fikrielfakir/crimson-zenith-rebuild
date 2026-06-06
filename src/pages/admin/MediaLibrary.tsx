import { apiFetch } from '@/lib/apiFetch';
import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
  Upload, Trash2, ImageIcon, File, Video, Music, Search,
  Copy, Check, X, Loader2, CheckCircle2, AlertCircle, CloudUpload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

interface QueueItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  previewUrl: string;
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
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-blue-400" />;
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
    <Card className="overflow-hidden group cursor-default">
      <div className="relative aspect-square bg-muted flex items-center justify-center">
        {file.fileType.startsWith('image/') ? (
          <img
            src={file.thumbnailUrl || file.fileUrl}
            alt={file.altText || file.fileName}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
          <Button size="sm" variant="secondary" onClick={handleCopyUrl} title="Copy URL">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(file.id)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-2">
        <p className="text-xs font-medium truncate" title={file.fileName}>{file.fileName}</p>
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

function QueueItemRow({ item, onRemove }: { item: QueueItem; onRemove: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/40 border border-border/40">
      {item.file.type.startsWith('image/') ? (
        <img src={item.previewUrl} alt={item.file.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
          {getFileIcon(item.file.type)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>
        {item.status === 'uploading' && (
          <Progress value={item.progress} className="h-1.5 mt-1" />
        )}
        {item.status === 'error' && (
          <p className="text-xs text-destructive mt-0.5">{item.error ?? 'Upload failed'}</p>
        )}
      </div>

      <div className="flex-shrink-0">
        {item.status === 'pending'   && <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />}
        {item.status === 'uploading' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
        {item.status === 'done'      && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        {item.status === 'error'     && (
          <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function MediaLibrary() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [queue, setQueue]           = useState<QueueItem[]>([]);
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

  function buildQueueItems(fileList: FileList | File[]): QueueItem[] {
    return Array.from(fileList).map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      status: 'pending' as UploadStatus,
      progress: 0,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));
  }

  const uploadFiles = useCallback(async (items: QueueItem[]) => {
    if (items.length === 0) return;
    setIsUploading(true);

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      setQueue(q => q.map(x => x.id === item.id ? { ...x, status: 'uploading', progress: 10 } : x));

      const formData = new FormData();
      formData.append('file', item.file);

      try {
        setQueue(q => q.map(x => x.id === item.id ? { ...x, progress: 40 } : x));

        const response = await apiFetch('/api/admin/media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        setQueue(q => q.map(x => x.id === item.id ? { ...x, progress: 90 } : x));

        if (response.ok) {
          setQueue(q => q.map(x => x.id === item.id ? { ...x, status: 'done', progress: 100 } : x));
          successCount++;
        } else {
          const data = await response.json().catch(() => ({}));
          const errMsg = data?.message ?? `Server error (${response.status})`;
          setQueue(q => q.map(x => x.id === item.id ? { ...x, status: 'error', error: errMsg } : x));
          failCount++;
        }
      } catch (err) {
        setQueue(q => q.map(x => x.id === item.id ? { ...x, status: 'error', error: 'Network error' } : x));
        failCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast({
        title: `${successCount} file${successCount > 1 ? 's' : ''} uploaded`,
        ...(failCount > 0 && { description: `${failCount} failed — check the queue for details` }),
      });
      setTimeout(() => {
        setQueue(q => q.filter(x => x.status !== 'done'));
      }, 2000);
    }
    if (successCount === 0) {
      toast({ title: 'All uploads failed', description: 'Check the queue for details', variant: 'destructive' });
    }
  }, [queryClient, toast]);

  function addToQueue(fileList: FileList | File[]) {
    const newItems = buildQueueItems(fileList);
    setQueue(q => [...q, ...newItems]);
    uploadFiles(newItems);
  }

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addToQueue(e.dataTransfer.files);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addToQueue(e.target.files);
      e.target.value = '';
    }
  };

  const removeFromQueue = (id: string) => {
    setQueue(q => q.filter(x => x.id !== id));
  };

  const clearDoneItems = () => setQueue(q => q.filter(x => x.status !== 'done'));

  const activeQueue   = queue.filter(x => x.status !== 'done');
  const doneCount     = queue.filter(x => x.status === 'done').length;
  const pendingCount  = queue.filter(x => x.status === 'pending' || x.status === 'uploading').length;

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={onFileInput}
        />
      </div>

      {/* Drag-and-drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-10 text-center transition-all duration-200 cursor-pointer select-none',
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40',
          isUploading && 'pointer-events-none opacity-70'
        )}
      >
        <div className={cn(
          'flex items-center justify-center w-14 h-14 rounded-full transition-colors',
          isDragOver ? 'bg-primary/15' : 'bg-muted'
        )}>
          <CloudUpload className={cn('w-7 h-7 transition-colors', isDragOver ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isDragOver ? 'Drop files to upload' : 'Drag & drop files here, or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Images, videos, audio, PDFs — up to 10 MB each · Multiple files supported
          </p>
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading {pendingCount} file{pendingCount !== 1 ? 's' : ''}…
          </div>
        )}
      </div>

      {/* Upload queue */}
      {queue.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">
              Upload Queue
              {pendingCount > 0 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {pendingCount} in progress
                </span>
              )}
            </p>
            {doneCount > 0 && (
              <button
                onClick={clearDoneItems}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {queue.map(item => (
              <QueueItemRow key={item.id} item={item} onRemove={removeFromQueue} />
            ))}
          </div>
          {queue.length > 1 && (
            <div className="pt-2 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {queue.filter(x => x.status === 'done').length} done
              </span>
              <span className="flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 text-primary" />
                {queue.filter(x => x.status === 'uploading').length} uploading
              </span>
              {queue.filter(x => x.status === 'error').length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  {queue.filter(x => x.status === 'error').length} failed
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search & filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-48 max-w-sm">
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

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading media files…
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 gap-3 text-destructive">
            <AlertCircle className="h-10 w-10 opacity-50" />
            <p>Failed to load media files. Please try again.</p>
          </CardContent>
        </Card>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
            <ImageIcon className="h-12 w-12 opacity-30" />
            <p>
              {search || typeFilter !== 'all'
                ? 'No files match your filters.'
                : 'No media files yet — drag files above to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <MediaCard key={file.id} file={file} onDelete={setDeletingId} />
          ))}
        </div>
      )}

      {/* Delete dialog */}
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
