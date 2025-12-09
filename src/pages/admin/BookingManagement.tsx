import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, Users, DollarSign, Download, MoreHorizontal, Eye, Edit, Trash2, XCircle, Ticket, X, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import logoImg from '@/assets/logo.png';

interface Booking {
  id: number;
  bookingReference: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  eventDate: string;
  attendees: number;
  totalAmount: number;
  status: string;
  ticketNumber?: string;
  createdAt: string;
}

async function fetchBookings() {
  const response = await fetch('/api/admin/bookings');
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
}

async function updateBookingStatus(bookingReference: string, status: string) {
  const response = await fetch(`/api/admin/bookings/${bookingReference}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update booking status');
  return response.json();
}

async function deleteBooking(bookingReference: string) {
  const response = await fetch(`/api/admin/bookings/${bookingReference}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete booking');
  return response.json();
}

function TicketModal({ booking, isOpen, onClose }: { booking: Booking | null; isOpen: boolean; onClose: () => void }) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = ticketRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Ticket - ${booking?.ticketNumber || booking?.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
            .ticket { 
              max-width: 500px; 
              margin: 0 auto; 
              border: 2px solid #1a1a2e;
              border-radius: 16px;
              overflow: hidden;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              color: white;
            }
            .ticket-header {
              background: linear-gradient(135deg, #c4a052 0%, #d4b062 100%);
              padding: 24px;
              text-align: center;
            }
            .logo { width: 80px; height: 80px; margin-bottom: 12px; }
            .ticket-title { font-size: 24px; font-weight: bold; color: #1a1a2e; }
            .ticket-subtitle { font-size: 14px; color: #1a1a2e; opacity: 0.8; }
            .ticket-body { padding: 24px; }
            .ticket-row { display: flex; justify-content: space-between; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed rgba(255,255,255,0.2); }
            .ticket-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .ticket-label { font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }
            .ticket-value { font-size: 16px; font-weight: 600; color: white; margin-top: 4px; }
            .ticket-footer { 
              background: rgba(196, 160, 82, 0.1); 
              padding: 16px 24px; 
              text-align: center;
              border-top: 2px dashed rgba(196, 160, 82, 0.3);
            }
            .ticket-number { font-size: 20px; font-weight: bold; color: #c4a052; letter-spacing: 2px; }
            .ticket-qr { margin-top: 16px; }
            .status-badge {
              display: inline-block;
              background: #22c55e;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!booking) return null;

  const ticketNumber = booking.ticketNumber || `TKT-${String(booking.id).padStart(6, '0')}`;
  const eventDate = new Date(booking.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-semibold">Booking Ticket</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div ref={ticketRef} className="ticket rounded-2xl overflow-hidden border-2 border-[#1a1a2e] shadow-2xl">
            <div className="ticket-header bg-gradient-to-r from-[#c4a052] to-[#d4b062] p-6 text-center">
              <img src={logoImg} alt="Logo" className="logo w-20 h-20 mx-auto mb-3 object-contain" />
              <h2 className="ticket-title text-2xl font-bold text-[#1a1a2e]">The Journey Association</h2>
              <p className="ticket-subtitle text-sm text-[#1a1a2e]/80 mt-1">Event Booking Confirmation</p>
            </div>
            
            <div className="ticket-body bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 text-white">
              <div className="ticket-row flex justify-between items-start pb-4 mb-4 border-b border-dashed border-white/20">
                <div>
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Event</p>
                  <p className="ticket-value text-lg font-semibold mt-1">{booking.eventTitle}</p>
                </div>
                <span className={`status-badge text-white px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  booking.status === 'accepted' ? 'bg-green-500' :
                  booking.status === 'confirmed' ? 'bg-blue-500' :
                  booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-dashed border-white/20">
                <div>
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Guest Name</p>
                  <p className="ticket-value font-semibold mt-1">{booking.userName}</p>
                </div>
                <div>
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Attendees</p>
                  <p className="ticket-value font-semibold mt-1">{booking.attendees} {booking.attendees > 1 ? 'persons' : 'person'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-dashed border-white/20">
                <div>
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Date</p>
                  <p className="ticket-value font-semibold mt-1">{formattedDate}</p>
                </div>
                <div>
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Time</p>
                  <p className="ticket-value font-semibold mt-1">{formattedTime}</p>
                </div>
              </div>
              
              <div className="ticket-row flex justify-between items-center">
                <div>
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Total Amount</p>
                  <p className="ticket-value text-xl font-bold text-[#c4a052] mt-1">${booking.totalAmount}</p>
                </div>
                <div className="text-right">
                  <p className="ticket-label text-xs text-white/60 uppercase tracking-wider">Booking Date</p>
                  <p className="ticket-value font-semibold mt-1">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="ticket-footer bg-[#1a1a2e]/50 p-4 text-center border-t-2 border-dashed border-[#c4a052]/30">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Ticket Number</p>
              <p className="ticket-number text-xl font-bold text-[#c4a052] tracking-widest">{ticketNumber}</p>
              <p className="text-xs text-white/40 mt-3">Present this ticket at the event entrance</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handlePrint} className="bg-[#c4a052] hover:bg-[#b3903f] text-white">
            <Printer className="mr-2 h-4 w-4" />
            Print Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ViewBookingModal({ booking, isOpen, onClose }: { booking: Booking | null; isOpen: boolean; onClose: () => void }) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>View complete booking information</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground text-sm">Event</Label>
              <p className="font-medium">{booking.eventTitle}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Status</Label>
              <p className="font-medium">"{booking.status}"</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Guest Name</Label>
              <p className="font-medium">{booking.userName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Email</Label>
              <p className="font-medium">{booking.userEmail || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Event Date</Label>
              <p className="font-medium">{new Date(booking.eventDate).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Attendees</Label>
              <p className="font-medium">{booking.attendees}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Total Amount</Label>
              <p className="font-medium">${booking.totalAmount}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Booking Date</Label>
              <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditBookingModal({ booking, isOpen, onClose, onSave }: { booking: Booking | null; isOpen: boolean; onClose: () => void; onSave: (status: string) => void }) {
  const [status, setStatus] = useState(booking?.status || 'pending');

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>Update booking status</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Event</Label>
            <p className="font-medium text-muted-foreground">{booking.eventTitle}</p>
          </div>
          <div>
            <Label>Guest</Label>
            <p className="font-medium text-muted-foreground">{booking.userName}</p>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">"pending"</SelectItem>
                <SelectItem value="confirmed">"confirmed"</SelectItem>
                <SelectItem value="accepted">"accepted"</SelectItem>
                <SelectItem value="cancelled">"cancelled"</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(status)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BookingManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingReference, status }: { bookingReference: string; status: string }) => updateBookingStatus(bookingReference, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking status updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update booking status', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bookingReference: string) => deleteBooking(bookingReference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete booking', variant: 'destructive' });
    },
  });

  const bookings = data?.bookings || [];

  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesSearch = booking.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
                         booking.userName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
      confirmed: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
      accepted: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
      pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30' },
      cancelled: { variant: 'destructive', className: '' },
    };

    const config = statusConfig[status] || { variant: 'outline' as const, className: '' };

    return (
      <Badge variant={config.variant} className={config.className}>
        "{status}"
      </Badge>
    );
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditModalOpen(true);
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleViewTicket = (booking: Booking) => {
    setSelectedBooking(booking);
    setTicketModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      deleteMutation.mutate(selectedBooking.bookingReference);
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const confirmCancel = () => {
    if (selectedBooking) {
      updateStatusMutation.mutate({ bookingReference: selectedBooking.bookingReference, status: 'cancelled' });
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  const handleSaveEdit = (status: string) => {
    if (selectedBooking) {
      updateStatusMutation.mutate({ bookingReference: selectedBooking.bookingReference, status });
      setEditModalOpen(false);
      setSelectedBooking(null);
    }
  };

  const stats = {
    total: bookings.length,
    active: bookings.filter((b: Booking) => b.status === 'confirmed' || b.status === 'accepted').length,
    pending: bookings.filter((b: Booking) => b.status === 'pending').length,
    revenue: bookings.reduce((sum: number, b: Booking) => sum + (b.totalAmount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage event bookings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Confirmed & accepted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>View and manage event bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
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
                <SelectItem value="confirmed">"confirmed"</SelectItem>
                <SelectItem value="accepted">"accepted"</SelectItem>
                <SelectItem value="pending">"pending"</SelectItem>
                <SelectItem value="cancelled">"cancelled"</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading bookings...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-muted-foreground">Create your first booking to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: Booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.eventTitle}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.attendees}</TableCell>
                    <TableCell>${booking.totalAmount}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(booking.status === 'accepted' || booking.status === 'confirmed') && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewTicket(booking)}
                            className="text-[#c4a052] border-[#c4a052] hover:bg-[#c4a052] hover:text-white"
                          >
                            <Ticket className="h-4 w-4 mr-1" />
                            Ticket
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(booking)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(booking)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {booking.status !== 'cancelled' && (
                              <DropdownMenuItem 
                                onClick={() => handleCancel(booking)}
                                className="text-orange-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(booking)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ViewBookingModal 
        booking={selectedBooking} 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
      />

      <EditBookingModal 
        booking={selectedBooking} 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <TicketModal 
        booking={selectedBooking} 
        isOpen={ticketModalOpen} 
        onClose={() => setTicketModalOpen(false)} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking for "{selectedBooking?.eventTitle}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking for "{selectedBooking?.eventTitle}"? 
              The booking status will be changed to "cancelled".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-orange-600 hover:bg-orange-700">
              Yes, cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
