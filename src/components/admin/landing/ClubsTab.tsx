import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Eye, Loader2 } from "lucide-react";

interface Club {
  id: number;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
  memberCount?: number;
  isActive: boolean;
}

const ClubsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewingClub, setViewingClub] = useState<Club | null>(null);

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await fetch('/api/clubs');
      if (!response.ok) throw new Error('Failed to fetch clubs');
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {clubs.length} club{clubs.length !== 1 ? 's' : ''} • Managed in Clubs section
        </p>
        <Button onClick={() => window.location.href = '/admin/clubs'}>
          Go to Clubs Management
        </Button>
      </div>

      <div className="grid gap-3">
        {clubs.map((club) => (
          <Card key={club.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{club.name}</h4>
                  {club.category && <Badge variant="outline">{club.category}</Badge>}
                </div>
                {club.location && <p className="text-xs text-muted-foreground">{club.location}</p>}
                {club.description && <p className="text-sm mt-2 line-clamp-2">{club.description}</p>}
                {club.memberCount !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">{club.memberCount} members</p>
                )}
              </div>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setViewingClub(club)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{club.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {club.imageUrl && (
                        <img src={club.imageUrl} alt={club.name} className="w-full h-48 object-cover rounded" />
                      )}
                      <div>
                        <Label>Description</Label>
                        <p className="text-sm mt-1">{club.description || 'No description'}</p>
                      </div>
                      {club.category && (
                        <div>
                          <Label>Category</Label>
                          <p className="text-sm mt-1">{club.category}</p>
                        </div>
                      )}
                      {club.location && (
                        <div>
                          <Label>Location</Label>
                          <p className="text-sm mt-1">{club.location}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Clubs are fully managed in the dedicated Clubs Management section. 
          This tab provides a quick overview of all clubs that will be displayed on the landing page.
        </p>
      </div>
    </div>
  );
};

export default ClubsTab;
