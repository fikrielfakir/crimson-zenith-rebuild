import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";

interface SiteStat {
  id: number;
  label: string;
  value: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
  ordering: number;
  isActive: boolean;
}

const StatsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteStat | null>(null);
  const [formData, setFormData] = useState<Partial<SiteStat>>({});

  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      const response = await fetch('/api/cms/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<SiteStat>) => {
      const response = await fetch('/api/admin/cms/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ordering: stats.length + 1, isActive: true }),
      });
      if (!response.ok) throw new Error('Failed to create stat');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: "Success", description: "Statistic created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SiteStat> & { id: number }) => {
      const response = await fetch(`/api/admin/cms/stats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update stat');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      setEditingItem(null);
      setFormData({});
      toast({ title: "Success", description: "Statistic updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/cms/stats/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete stat');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-stats'] });
      toast({ title: "Success", description: "Statistic deleted" });
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

  const openEdit = (item: SiteStat) => {
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
          {stats.length} statistic{stats.length !== 1 ? 's' : ''}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Statistic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Create'} Statistic</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Happy Travelers"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Prefix</Label>
                  <Input
                    value={formData.prefix || ''}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    placeholder="$"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value *</Label>
                  <Input
                    value={formData.value || ''}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="1500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Suffix</Label>
                  <Input
                    value={formData.suffix || ''}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="+"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="users, mountain, award"
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
        {stats.map((stat) => (
          <Card key={stat.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {stat.icon && <p className="text-xs text-muted-foreground">Icon: {stat.icon}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(stat)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(stat.id)}>
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

export default StatsTab;
