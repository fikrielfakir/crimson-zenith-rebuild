import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ContactSettings {
  id?: string;
  officeAddress?: string;
  email?: string;
  phone?: string;
  officeHours?: string;
  mapLatitude?: string;
  mapLongitude?: string;
  formRecipients?: string[];
  autoReplyEnabled?: boolean;
  autoReplyMessage?: string;
  socialLinks?: Record<string, string>;
}

const ContactTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ContactSettings>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      const response = await fetch('/api/cms/contact');
      if (!response.ok) throw new Error('Failed to fetch contact settings');
      return response.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: ContactSettings) => {
      const response = await fetch('/api/admin/cms/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update contact settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-settings'] });
      toast({ title: "Success", description: "Contact settings updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update contact settings", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Office Address</Label>
            <Textarea
              value={formData.officeAddress || ''}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Office Hours</Label>
            <Textarea
              value={formData.officeHours || ''}
              onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
              rows={3}
              placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Map Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              value={formData.mapLatitude || ''}
              onChange={(e) => setFormData({ ...formData, mapLatitude: e.target.value })}
              placeholder="31.6295"
            />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input
              value={formData.mapLongitude || ''}
              onChange={(e) => setFormData({ ...formData, mapLongitude: e.target.value })}
              placeholder="-7.9811"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Auto-Reply Settings</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.autoReplyEnabled || false}
            onCheckedChange={(checked) => setFormData({ ...formData, autoReplyEnabled: checked })}
          />
          <Label>Enable auto-reply for contact form submissions</Label>
        </div>
        {formData.autoReplyEnabled && (
          <div className="space-y-2">
            <Label>Auto-Reply Message</Label>
            <Textarea
              value={formData.autoReplyMessage || ''}
              onChange={(e) => setFormData({ ...formData, autoReplyMessage: e.target.value })}
              rows={3}
              placeholder="Thank you for contacting us! We'll get back to you soon."
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setFormData(settings || {})}>
          Reset
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ContactTab;
