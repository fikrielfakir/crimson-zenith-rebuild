import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Image, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaUploadProps {
  mediaType: 'image' | 'video';
  currentMediaId?: number | null;
  currentMediaUrl?: string | null;
  onMediaChange: (mediaId: number | null, mediaUrl: string | null) => void;
  onTypeChange: (type: 'image' | 'video') => void;
}

export const MediaUpload = ({ 
  mediaType, 
  currentMediaId, 
  currentMediaUrl,
  onMediaChange,
  onTypeChange
}: MediaUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentMediaUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentMediaUrl || null);
  }, [currentMediaUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const validVideoTypes = ['video/mp4', 'video/webm'];
    const maxSize = mediaType === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;

    if (mediaType === 'image' && !validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    if (mediaType === 'video' && !validVideoTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4 or WebM video",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum size is ${mediaType === 'image' ? '10MB' : '50MB'}`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/admin/cms/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileUrl: base64,
          altText: `Hero background ${mediaType}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setPreviewUrl(base64);
      onMediaChange(data.id, base64);

      toast({
        title: "Upload successful",
        description: `${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onMediaChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Background Type</Label>
        <Select
          value={mediaType}
          onValueChange={(value: 'image' | 'video') => onTypeChange(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span>Image</span>
              </div>
            </SelectItem>
            <SelectItem value="video">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Video</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Background Media</Label>
        
        {previewUrl ? (
          <div className="relative border rounded-lg overflow-hidden">
            {mediaType === 'image' ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
            ) : (
              <video 
                src={previewUrl} 
                className="w-full h-48 object-cover"
                muted
                loop
                autoPlay
              />
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm'}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {mediaType === 'image' ? 'Image' : 'Video'}
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              {mediaType === 'image' 
                ? 'JPG, PNG, or WebP (max 10MB)' 
                : 'MP4 or WebM (max 50MB)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
