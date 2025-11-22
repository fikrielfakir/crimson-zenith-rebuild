import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, Target, Users, Lightbulb, Heart, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const iconOptions = [
  { value: 'target', label: 'Target', Icon: Target },
  { value: 'users', label: 'Users', Icon: Users },
  { value: 'lightbulb', label: 'Lightbulb', Icon: Lightbulb },
  { value: 'heart', label: 'Heart', Icon: Heart },
  { value: 'globe', label: 'Globe', Icon: Globe },
];

async function fetchFocusItems() {
  const response = await fetch('/api/cms/focus-items');
  if (!response.ok) throw new Error('Failed to fetch focus items');
  return response.json();
}

interface FocusItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  ordering: number;
  isActive: boolean;
}

export default function FocusAreasManagement() {
  const [editingItem, setEditingItem] = useState<FocusItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [isActive, setIsActive] = useState(true);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['focusItems'],
    queryFn: fetchFocusItems,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingItem?.id 
        ? `/api/admin/cms/focus-items/${editingItem.id}` 
        : '/api/admin/cms/focus-items';
      const method = editingItem?.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save focus item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      toast({ title: `Focus item ${editingItem?.id ? 'updated' : 'created'} successfully` });
      handleCloseForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cms/focus-items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete focus item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      toast({ title: 'Focus item deleted successfully' });
      setDeletingItemId(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const bulkReorderMutation = useMutation({
    mutationFn: async (items: Array<{ id: number; ordering: number }>) => {
      const response = await fetch('/api/admin/cms/focus-items/bulk-reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) throw new Error('Failed to bulk reorder items');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      toast({ title: 'Items reordered successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleEdit = (item: FocusItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setSelectedIcon(item.icon || 'target');
    setIsActive(item.isActive);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setSelectedIcon('target');
    setIsActive(true);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Error', description: 'Title and description are required', variant: 'destructive' });
      return;
    }

    saveMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      icon: selectedIcon,
      isActive,
    });
  };

  const handleMoveUp = (item: FocusItem) => {
    const items = data?.items || [];
    const currentIndex = items.findIndex((i: FocusItem) => i.id === item.id);
    if (currentIndex > 0) {
      const newItems = [...items];
      [newItems[currentIndex], newItems[currentIndex - 1]] = [newItems[currentIndex - 1], newItems[currentIndex]];
      const reorderedItems = newItems.map((item, index) => ({ id: item.id, ordering: index }));
      bulkReorderMutation.mutate(reorderedItems);
    }
  };

  const handleMoveDown = (item: FocusItem) => {
    const items = data?.items || [];
    const currentIndex = items.findIndex((i: FocusItem) => i.id === item.id);
    if (currentIndex < items.length - 1) {
      const newItems = [...items];
      [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]];
      const reorderedItems = newItems.map((item, index) => ({ id: item.id, ordering: index }));
      bulkReorderMutation.mutate(reorderedItems);
    }
  };

  const items = data?.items || [];
  const SelectedIconComponent = iconOptions.find(opt => opt.value === selectedIcon)?.Icon || Target;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Focus Areas Management</h1>
          <p className="text-muted-foreground mt-1">Manage the focus areas section on your landing page</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Focus Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Focus Item' : 'Add Focus Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the focus item details' : 'Create a new focus area item'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Community Building"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this focus area..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(({ value, label, Icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-2 p-3 border rounded-md bg-muted/30">
                  <SelectedIconComponent className="h-6 w-6 text-primary" />
                  <span className="text-sm">Preview</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Focus Items</CardTitle>
          <CardDescription>
            {items.length} item{items.length !== 1 ? 's' : ''} • Drag to reorder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner message="Loading focus items..." />
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No focus items yet</p>
              <p className="text-sm mt-2">Click "Add Focus Item" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: FocusItem) => {
                  const IconComponent = iconOptions.find(opt => opt.value === item.icon)?.Icon || Target;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMoveUp(item)}
                          >
                            ▲
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMoveDown(item)}
                          >
                            ▼
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconComponent className="h-6 w-6 text-primary" />
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-md truncate">{item.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.isActive 
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingItemId(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {deletingItemId && (
        <Dialog open={!!deletingItemId} onOpenChange={() => setDeletingItemId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Focus Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this focus item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeletingItemId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deletingItemId && deleteMutation.mutate(deletingItemId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
