import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, GripVertical, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  feedback: string;
  rating: number;
  imageUrl?: string;
  isApproved: boolean;
  ordering: number;
  isActive: boolean;
}

const TestimonialsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/cms/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Testimonial>) => {
      const response = await fetch('/api/admin/cms/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ordering: testimonials.length + 1, isActive: true, isApproved: true }),
      });
      if (!response.ok) throw new Error('Failed to create testimonial');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: "Success", description: "Testimonial created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Testimonial> & { id: number }) => {
      const response = await fetch(`/api/admin/cms/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update testimonial');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setEditingItem(null);
      setFormData({});
      toast({ title: "Success", description: "Testimonial updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cms/testimonials/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({ title: "Success", description: "Testimonial deleted" });
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

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ rating: 5 });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Create'} Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Customer, Client, etc."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Feedback *</Label>
                <Textarea
                  value={formData.feedback || ''}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/avatars/person.jpg"
                  />
                </div>
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
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  {testimonial.role && <p className="text-xs text-muted-foreground">{testimonial.role}</p>}
                  <p className="text-sm mt-2 line-clamp-2">{testimonial.feedback}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(testimonial)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(testimonial.id)}>
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

export default TestimonialsTab;
