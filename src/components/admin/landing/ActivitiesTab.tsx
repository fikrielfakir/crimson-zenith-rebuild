import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";

interface LandingSection {
  id: number;
  key: string;
  type: string;
  title: string;
  subtitle?: string;
  order: number;
  isVisible: boolean;
}

const ActivitiesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LandingSection | null>(null);
  const [formData, setFormData] = useState<Partial<LandingSection>>({});

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['landing-sections'],
    queryFn: async () => {
      const response = await fetch('/api/cms/sections');
      if (!response.ok) throw new Error('Failed to fetch landing sections');
      return response.json();
    },
  });

  const activitiesSections = sections.filter((s: any) => s.type === 'activities' || s.key.includes('activit'));

  const createMutation = useMutation({
    mutationFn: async (data: Partial<LandingSection>) => {
      const response = await fetch('/api/admin/cms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'activities' }),
      });
      if (!response.ok) throw new Error('Failed to create section');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: "Success", description: "Activities section created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<LandingSection> & { id: number }) => {
      const response = await fetch(`/api/admin/cms/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update section');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      setEditingItem(null);
      setFormData({});
      toast({ title: "Success", description: "Activities section updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cms/sections/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete section');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-sections'] });
      toast({ title: "Success", description: "Activities section deleted" });
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

  const openEdit = (item: LandingSection) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ key: 'activities', type: 'activities', isVisible: true, order: sections.length + 1 });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {activitiesSections.length} activities section{activitiesSections.length !== 1 ? 's' : ''}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Activities Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Create'} Activities Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Section Key *</Label>
                <Input
                  value={formData.key || ''}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="activities-main"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Our Activities"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Explore what we offer..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={formData.isVisible !== false}
                    onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                  />
                  <Label>Visible</Label>
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
        {activitiesSections.map((section: LandingSection) => (
          <Card key={section.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{section.title}</h4>
                    <Badge variant={section.isVisible ? "default" : "secondary"}>
                      {section.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Key: {section.key} • Order: {section.order}</p>
                  {section.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(section)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(section.id)}>
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

export default ActivitiesTab;
