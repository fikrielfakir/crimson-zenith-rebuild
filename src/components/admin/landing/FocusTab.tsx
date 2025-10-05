import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";

interface FocusItem {
  id: number;
  title: string;
  icon?: string;
  description?: string;
  ordering: number;
  isActive: boolean;
}

const FocusTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FocusItem | null>(null);
  const [formData, setFormData] = useState<Partial<FocusItem>>({});

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['focus-items'],
    queryFn: async () => {
      const response = await fetch('/api/cms/focus-items');
      if (!response.ok) throw new Error('Failed to fetch focus items');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<FocusItem>) => {
      const response = await fetch('/api/admin/cms/focus-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ordering: items.length + 1, isActive: true }),
      });
      if (!response.ok) throw new Error('Failed to create focus item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-items'] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: "Success", description: "Focus item created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<FocusItem> & { id: number }) => {
      const response = await fetch(`/api/admin/cms/focus-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update focus item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-items'] });
      setEditingItem(null);
      setFormData({});
      toast({ title: "Success", description: "Focus item updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cms/focus-items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete focus item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus-items'] });
      toast({ title: "Success", description: "Focus item deleted" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: FocusItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {items.length} focus item{items.length !== 1 ? 's' : ''}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Focus Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Create'} Focus Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="mountain, globe, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  {item.icon && <p className="text-xs text-muted-foreground">Icon: {item.icon}</p>}
                  {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FocusTab;
