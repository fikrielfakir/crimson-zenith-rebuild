import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Upload, 
  Search,
  Filter,
  Image,
  Video,
  FileText,
  Download,
  Trash2,
  Eye,
  Copy,
  FolderPlus,
  Grid,
  List,
  Calendar,
  HardDrive
} from "lucide-react";

interface MediaFile {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadDate: string;
  url: string;
  thumbnail?: string;
  folder: string;
  alt?: string;
  description?: string;
  tags: string[];
  dimensions?: { width: number; height: number };
  format: string;
}

const MediaLibrary = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: 1,
      name: "atlas-mountains-hero.jpg",
      type: "image",
      size: 2048576,
      uploadDate: "2024-12-15",
      url: "/api/placeholder/800/400",
      thumbnail: "/api/placeholder/150/150",
      folder: "heroes",
      alt: "Atlas Mountains landscape",
      description: "Stunning view of Atlas Mountains for hero sections",
      tags: ["mountains", "landscape", "hero"],
      dimensions: { width: 1920, height: 1080 },
      format: "JPEG"
    },
    {
      id: 2,
      name: "club-activity-video.mp4",
      type: "video",
      size: 15728640,
      uploadDate: "2024-12-10",
      url: "/api/placeholder/video",
      thumbnail: "/api/placeholder/150/150",
      folder: "videos",
      description: "Club activity promotional video",
      tags: ["clubs", "activity", "promo"],
      format: "MP4"
    },
    {
      id: 3,
      name: "event-guidelines.pdf",
      type: "document",
      size: 512000,
      uploadDate: "2024-12-05",
      url: "/api/placeholder/document",
      folder: "documents",
      description: "Guidelines for event organization",
      tags: ["events", "guidelines", "pdf"],
      format: "PDF"
    },
    {
      id: 4,
      name: "morocco-map-regions.png",
      type: "image",
      size: 1024000,
      uploadDate: "2024-12-01",
      url: "/api/placeholder/600/400",
      thumbnail: "/api/placeholder/150/150",
      folder: "maps",
      alt: "Morocco regions map",
      description: "Detailed map of Morocco regions",
      tags: ["morocco", "map", "regions"],
      dimensions: { width: 1200, height: 800 },
      format: "PNG"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterFolder, setFilterFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  const folders = Array.from(new Set(mediaFiles.map(file => file.folder)));
  const fileTypes = ['image', 'video', 'document'];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesFolder = filterFolder === 'all' || file.folder === filterFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    // Mock file upload - in real app would upload to server
    files.forEach(file => {
      const newFile: MediaFile = {
        id: Math.max(...mediaFiles.map(f => f.id)) + 1,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        folder: 'uploads',
        description: '',
        tags: [],
        format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN'
      };
      setMediaFiles(prev => [...prev, newFile]);
    });
    setIsUploadDialogOpen(false);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      setMediaFiles(files => files.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const copyFileUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const getTotalStorage = () => {
    return mediaFiles.reduce((total, file) => total + file.size, 0);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Media Library</h1>
            <p className="text-muted-foreground">Manage your images, videos, and documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Files</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg mb-2">Drag & drop files here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaFiles.length}</div>
              <p className="text-xs text-muted-foreground">All uploaded files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mediaFiles.filter(f => f.type === 'image').length}
              </div>
              <p className="text-xs text-muted-foreground">Image files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mediaFiles.filter(f => f.type === 'video').length}
              </div>
              <p className="text-xs text-muted-foreground">Video files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(getTotalStorage())}</div>
              <p className="text-xs text-muted-foreground">Of total space</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterFolder} onValueChange={setFilterFolder}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map(folder => (
                <SelectItem key={folder} value={folder}>
                  {folder}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedFiles.length} file(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    // Mock bulk download
                    alert('Downloading selected files...');
                  }}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Grid/List */}
        <Card>
          <CardHeader>
            <CardTitle>Files ({filteredFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="absolute top-2 left-2 z-10"
                      />
                      {file.type === 'image' ? (
                        <img 
                          src={file.thumbnail || file.url} 
                          alt={file.alt || file.name}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2 text-sm">{file.format}</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => setPreviewFile(file)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => copyFileUrl(file.url)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(file.type)}>
                          {file.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      </div>
                      <h3 className="font-medium text-sm truncate" title={file.name}>{file.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{file.uploadDate}</p>
                      {file.dimensions && (
                        <p className="text-xs text-muted-foreground">
                          {file.dimensions.width} × {file.dimensions.height}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                    />
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{file.name}</h3>
                        <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadDate} • {file.folder}
                        {file.dimensions && ` • ${file.dimensions.width}×${file.dimensions.height}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setPreviewFile(file)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyFileUrl(file.url)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" 
                              onClick={() => {
                                if (confirm(`Delete ${file.name}?`)) {
                                  setMediaFiles(files => files.filter(f => f.id !== file.id));
                                }
                              }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Preview Dialog */}
        {previewFile && (
          <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{previewFile.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {previewFile.type === 'image' ? (
                  <img 
                    src={previewFile.url} 
                    alt={previewFile.alt || previewFile.name}
                    className="w-full max-h-96 object-contain"
                  />
                ) : previewFile.type === 'video' ? (
                  <video controls className="w-full max-h-96">
                    <source src={previewFile.url} />
                  </video>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <FileText className="w-16 h-16 mx-auto mb-4" />
                    <p>Document preview not available</p>
                    <Button className="mt-4" onClick={() => window.open(previewFile.url, '_blank')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Size:</strong> {formatFileSize(previewFile.size)}
                  </div>
                  <div>
                    <strong>Format:</strong> {previewFile.format}
                  </div>
                  <div>
                    <strong>Uploaded:</strong> {previewFile.uploadDate}
                  </div>
                  <div>
                    <strong>Folder:</strong> {previewFile.folder}
                  </div>
                  {previewFile.dimensions && (
                    <div className="col-span-2">
                      <strong>Dimensions:</strong> {previewFile.dimensions.width} × {previewFile.dimensions.height}
                    </div>
                  )}
                  {previewFile.description && (
                    <div className="col-span-2">
                      <strong>Description:</strong> {previewFile.description}
                    </div>
                  )}
                  {previewFile.tags.length > 0 && (
                    <div className="col-span-2">
                      <strong>Tags:</strong> {previewFile.tags.join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => copyFileUrl(previewFile.url)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button onClick={() => window.open(previewFile.url, '_blank')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;