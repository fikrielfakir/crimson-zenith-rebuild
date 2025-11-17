import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Calendar,
  Star,
  Check,
  X,
  Loader2,
  Map as MapIcon,
  Table as TableIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

async function fetchClubs(params: any) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    perPage: params.perPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
  });
  
  const response = await fetch(`/api/admin/clubs?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch clubs');
  return response.json();
}

export default function ClubsManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [selectedClubs, setSelectedClubs] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['clubs', { search, statusFilter, page, perPage }],
    queryFn: () => fetchClubs({
      search,
      status: statusFilter,
      page,
      perPage,
    }),
  });

  const approveClubMutation = useMutation({
    mutationFn: async (clubId: number) => {
      const response = await fetch(`/api/admin/clubs/${clubId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve club');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({ title: 'Club approved successfully' });
    },
  });

  const deleteClubMutation = useMutation({
    mutationFn: async (clubId: number) => {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete club');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({ title: 'Club deleted successfully' });
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ clubId, featured }: { clubId: number; featured: boolean }) => {
      const response = await fetch(`/api/admin/clubs/${clubId}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      });
      if (!response.ok) throw new Error('Failed to update feature status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({ title: 'Feature status updated' });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClubs(data?.clubs.map((c: any) => c.id) || []);
    } else {
      setSelectedClubs([]);
    }
  };

  const handleSelectClub = (clubId: number, checked: boolean) => {
    if (checked) {
      setSelectedClubs([...selectedClubs, clubId]);
    } else {
      setSelectedClubs(selectedClubs.filter(id => id !== clubId));
    }
  };

  const handleExport = () => {
    toast({ title: 'Exporting clubs...', description: 'Download will start shortly' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clubs Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link to="/admin/clubs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Club
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-lg">
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedClubs.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <span className="text-sm">{selectedClubs.length} clubs selected</span>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedClubs.length === data?.clubs?.length && data?.clubs?.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : data?.clubs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No clubs found
                  </TableCell>
                </TableRow>
              ) : (
                data?.clubs?.map((club: any) => (
                  <TableRow key={club.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClubs.includes(club.id)}
                        onCheckedChange={(checked) => handleSelectClub(club.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={club.image || '/placeholder-club.jpg'}
                          alt={club.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{club.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {club.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{club.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/profile/${club.owner?.username}`} className="text-sm hover:underline">
                        {club.owner?.username || 'N/A'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{club.memberCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{club.eventCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{club.rating || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          club.isActive === true ? 'default' :
                          club.isActive === false ? 'outline' :
                          'secondary'
                        }
                      >
                        {club.isActive === true ? 'Active' :
                         club.isActive === false ? 'Inactive' :
                         'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/clubs/${club.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Club Page
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/clubs/${club.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Club
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/clubs/${club.id}/members`}>
                              <Users className="mr-2 h-4 w-4" />
                              View Members
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/clubs/${club.id}/events`}>
                              <Calendar className="mr-2 h-4 w-4" />
                              View Events
                            </Link>
                          </DropdownMenuItem>
                          {club.isActive === null && (
                            <DropdownMenuItem onClick={() => approveClubMutation.mutate(club.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Approve Club
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toggleFeatureMutation.mutate({ clubId: club.id, featured: club.featured })}>
                            <Star className="mr-2 h-4 w-4" />
                            {club.featured ? 'Unfeature' : 'Feature on Homepage'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteClubMutation.mutate(club.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Club
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="border rounded-lg p-8 text-center">
          <MapIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Map View</p>
          <p className="text-sm text-muted-foreground">
            Interactive map showing all club locations will be displayed here
          </p>
        </div>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, data?.total || 0)} of {data?.total || 0} clubs
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, data?.totalPages || 0) }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))}
              disabled={page === data?.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
