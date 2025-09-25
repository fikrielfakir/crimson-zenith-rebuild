import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  MapPin, 
  Search,
  Filter 
} from "lucide-react";

interface Club {
  id: number;
  name: string;
  description: string;
  image: string;
  members: string;
  location: string;
  features: string[];
}

const ClubsManagement = () => {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: 1,
      name: "Marrakech Club",
      description: "Explore the vibrant souks and palaces of the Red City",
      image: "🏛️",
      members: "250+ Members",
      location: "Marrakech, Morocco",
      features: ["Historic Tours", "Local Cuisine", "Artisan Workshops"],
    },
    {
      id: 2,
      name: "Fez Club", 
      description: "Discover the ancient medina and cultural heritage",
      image: "🕌",
      members: "180+ Members",
      location: "Fez, Morocco", 
      features: ["Medina Walks", "Traditional Crafts", "Cultural Events"],
    },
    {
      id: 3,
      name: "Casablanca Club",
      description: "Experience the modern emerging art scene",
      image: "🌊",
      members: "320+ Members",
      location: "Casablanca, Morocco",
      features: ["Art Galleries", "Modern Culture", "Coastal Adventures"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClub, setNewClub] = useState<Partial<Club>>({
    name: '',
    description: '',
    image: '🏛️',
    members: '0 Members',
    location: '',
    features: []
  });

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClub = () => {
    // Validation
    if (!newClub.name?.trim()) {
      alert('Club name is required');
      return;
    }
    if (!newClub.description?.trim()) {
      alert('Club description is required');
      return;
    }
    if (!newClub.location?.trim()) {
      alert('Club location is required');
      return;
    }

    // Generate safe ID
    const nextId = clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) + 1 : 1;
    
    const club: Club = {
      id: nextId,
      name: newClub.name.trim(),
      description: newClub.description.trim(),
      image: newClub.image || '🏛️',
      members: newClub.members || '0 Members',
      location: newClub.location.trim(),
      features: newClub.features || []
    };
    setClubs([...clubs, club]);
    setNewClub({ name: '', description: '', image: '🏛️', members: '0 Members', location: '', features: [] });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateClub = () => {
    if (!editingClub) return;

    // Validation
    if (!editingClub.name?.trim()) {
      alert('Club name is required');
      return;
    }
    if (!editingClub.description?.trim()) {
      alert('Club description is required');
      return;
    }
    if (!editingClub.location?.trim()) {
      alert('Club location is required');
      return;
    }

    const updatedClub = {
      ...editingClub,
      name: editingClub.name.trim(),
      description: editingClub.description.trim(),
      location: editingClub.location.trim()
    };

    setClubs(clubs.map(club => club.id === editingClub.id ? updatedClub : club));
    setEditingClub(null);
  };

  const handleDeleteClub = (id: number) => {
    setClubs(clubs.filter(club => club.id !== id));
  };

  const addFeature = (clubRef: any, setClubRef: any) => {
    const feature = prompt('Enter new feature:');
    if (feature && feature.trim()) {
      setClubRef({
        ...clubRef,
        features: [...(clubRef.features || []), feature.trim()]
      });
    }
  };

  const removeFeature = (clubRef: any, setClubRef: any, index: number) => {
    setClubRef({
      ...clubRef,
      features: clubRef.features.filter((_: any, i: number) => i !== index)
    });
  };

  const ClubForm = ({ club, setClub, onSave, title }: any) => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Club Name</Label>
          <Input
            id="name"
            value={club.name}
            onChange={(e) => setClub({...club, name: e.target.value})}
            placeholder="Enter club name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emoji">Emoji</Label>
          <Input
            id="emoji"
            value={club.image}
            onChange={(e) => setClub({...club, image: e.target.value})}
            placeholder="🏛️"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={club.description}
          onChange={(e) => setClub({...club, description: e.target.value})}
          placeholder="Enter club description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={club.location}
            onChange={(e) => setClub({...club, location: e.target.value})}
            placeholder="City, Morocco"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="members">Members</Label>
          <Input
            id="members"
            value={club.members}
            onChange={(e) => setClub({...club, members: e.target.value})}
            placeholder="250+ Members"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {club.features?.map((feature: string, index: number) => (
            <Badge key={index} variant="secondary" className="cursor-pointer">
              {feature}
              <button
                onClick={() => removeFeature(club, setClub, index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addFeature(club, setClub)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
      <Button onClick={onSave} className="w-full">
        Save Club
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clubs Management</h1>
            <p className="text-muted-foreground">Manage your sports clubs and communities</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Club
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <ClubForm
                club={newClub}
                setClub={setNewClub}
                onSave={handleCreateClub}
                title="Create New Club"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubs.length}</div>
              <p className="text-xs text-muted-foreground">Across Morocco</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,755+</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(clubs.map(c => c.location.split(',')[0])).size}</div>
              <p className="text-xs text-muted-foreground">Moroccan cities</p>
            </CardContent>
          </Card>
        </div>

        {/* Clubs List */}
        <div className="grid gap-6">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{club.image}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                      <p className="text-muted-foreground mb-3">{club.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {club.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {club.members}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {club.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingClub(club)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        {editingClub && (
                          <ClubForm
                            club={editingClub}
                            setClub={setEditingClub}
                            onSave={handleUpdateClub}
                            title="Edit Club"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${club.name}?`)) {
                          handleDeleteClub(club.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClubsManagement;