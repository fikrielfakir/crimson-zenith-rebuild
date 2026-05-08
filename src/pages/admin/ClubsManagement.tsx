import { apiFetch } from '@/lib/apiFetch';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

// ── Leaflet icon fix for Vite ─────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
});

const BLUE_ICON = L.divIcon({
  className: '',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
      fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  iconSize:    [28, 42],
  iconAnchor:  [14, 42],
  popupAnchor: [0, -42],
});

const ESRI_SAT_URL   = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_LABEL_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const MOROCCO_CENTER: L.LatLngTuple = [31.7917, -7.0926];

// ── Clubs map component ───────────────────────────────────────────────────────
function ClubsMap({ clubs }: { clubs: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: MOROCCO_CENTER,
      zoom: 5,
      scrollWheelZoom: false,
    });

    L.tileLayer(ESRI_SAT_URL, { maxZoom: 18, attribution: '© Esri' }).addTo(mapRef.current);
    L.tileLayer(ESRI_LABEL_URL, { maxZoom: 18, opacity: 0.8 }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-draw markers whenever clubs list changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) layer.remove();
    });

    const pinned = clubs.filter((c) => c.latitude != null && c.longitude != null);

    pinned.forEach((club) => {
      const marker = L.marker([+club.latitude, +club.longitude], { icon: BLUE_ICON })
        .addTo(mapRef.current!);

      marker.bindPopup(`
        <div style="min-width:180px">
          ${club.image ? `<img src="${club.image}" style="width:100%;height:80px;object-fit:cover;border-radius:4px;margin-bottom:6px" />` : ''}
          <strong style="font-size:14px">${club.name}</strong><br/>
          <span style="font-size:12px;color:#666">${club.location ?? ''}</span><br/>
          <a href="/admin/clubs/${club.id}/edit"
             style="display:inline-block;margin-top:6px;font-size:12px;color:#2563eb;text-decoration:underline">
            Edit club
          </a>
        </div>
      `);
    });

    // Fit map to pins if any exist
    if (pinned.length > 0) {
      const bounds = L.latLngBounds(pinned.map((c) => [+c.latitude, +c.longitude] as L.LatLngTuple));
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [clubs]);

  const pinned = clubs.filter((c) => c.latitude != null && c.longitude != null);

  return (
    <div className="space-y-2">
      <div className="relative rounded-lg overflow-hidden border" style={{ height: 520 }}>
        <div ref={containerRef} className="w-full h-full" />
        <div className="absolute bottom-8 left-2 z-[1000] bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded pointer-events-none">
          {pinned.length} of {clubs.length} clubs have map coordinates
        </div>
      </div>
      {pinned.length < clubs.length && (
        <p className="text-xs text-muted-foreground">
          {clubs.length - pinned.length} club(s) are not shown — they have no coordinates set. Edit them to add a map pin.
        </p>
      )}
    </div>
  );
}

async function fetchClubs(params: any) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    perPage: params.perPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
  });
  
  const response = await apiFetch(`/api/admin/clubs?${queryParams}`, { credentials: 'include' });
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
      const response = await apiFetch(`/api/admin/clubs/${clubId}/approve`, {
        method: 'POST',
        credentials: 'include',
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
      const response = await apiFetch(`/api/admin/clubs/${clubId}`, {
        method: 'DELETE',
        credentials: 'include',
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
      const response = await apiFetch(`/api/admin/clubs/${clubId}/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
        credentials: 'include',
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
                            <Link to={`/club/${encodeURIComponent(club.name)}`}>
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
        isLoading ? (
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ClubsMap clubs={data?.clubs ?? []} />
        )
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
