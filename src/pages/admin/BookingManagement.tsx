import { apiFetch } from '@/lib/apiFetch';
import { generateTicketPDF } from '@/lib/generateTicketPDF';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, Users, DollarSign, Download, MoreHorizontal, Eye, Edit, Trash2, XCircle, Ticket, X } from 'lucide-react';
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
  const response = await apiFetch('/api/admin/bookings', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
}

async function updateBookingStatus(bookingReference: string, status: string) {
  const response = await apiFetch(`/api/admin/bookings/${bookingReference}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update booking status');
  return response.json();
}

async function deleteBooking(bookingReference: string) {
  const response = await apiFetch(`/api/admin/bookings/${bookingReference}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete booking');
  return response.json();
}

function TicketModal({ booking, isOpen, onClose }: { booking: Booking | null; isOpen: boolean; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState<string | null>(null);

  if (!booking) return null;

  const eventDate = new Date(booking.eventDate);
  const fmtDate = eventDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const fmtTime = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const handleDownload = async () => {
    setDlError(null);
    setDownloading(true);
    try {
      await generateTicketPDF({
        bookingReference:     booking.bookingReference,
        customerName:         booking.userName,
        customerEmail:        booking.userEmail,
        numberOfParticipants: booking.attendees,
        eventTitle:           booking.eventTitle,
        eventDate:            booking.eventDate,
        totalPrice:           booking.totalAmount,
        paymentStatus:        booking.status,
      });
    } catch (err) {
      console.error('[TicketPDF] download failed:', err);
      setDlError(err instanceof Error ? err.message : 'PDF generation failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden bg-transparent border-0 shadow-none">

        {/* ── Luxury vertical ticket ── */}
        <div
          className="relative mx-auto select-none"
          style={{ width: 300, fontFamily: 'sans-serif' }}
        >
          {/* Outer gold border wrapper */}
          <div className="rounded-2xl p-[2px]" style={{ background: 'linear-gradient(180deg,#D4B26A 0%,#8B6914 60%,#D4B26A 100%)' }}>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff' }}>

              {/* ── TOP STUB ── */}
              <div className="relative px-6 pt-6 pb-5 text-center"
                style={{ background: '#112250' }}>

                {/* Corner fan lines */}
                <svg className="absolute top-0 right-0 opacity-30" width="60" height="60" viewBox="0 0 60 60">
                  {[8,16,24,32].map((o,i) => (
                    <line key={i} x1={60-o} y1="0" x2="60" y2={o+8}
                      stroke="#D4B26A" strokeWidth={0.6 - i*0.1} />
                  ))}
                </svg>

                {/* Logo */}
                <img src={logoImg} alt="Logo" className="w-14 h-14 mx-auto mb-2 object-contain drop-shadow-lg" />

                <p className="font-bold tracking-widest text-white text-[11px] leading-tight">THE JOURNEY</p>

                {/* Flanking rules */}
                <div className="flex items-center gap-2 my-1 px-4">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,#D4B26A)' }} />
                  <p className="text-[8px] tracking-[3px] font-medium" style={{ color: '#D4B26A' }}>ASSOCIATION</p>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg,transparent,#D4B26A)' }} />
                </div>

                <div className="h-px w-4/5 mx-auto mb-3 opacity-40" style={{ background: '#D4B26A' }} />

                <p className="font-bold text-white text-base tracking-[2px]">EVENT  TICKET</p>

                {/* Confirmed pill */}
                <div className="inline-block mt-2 px-5 py-1 rounded-full text-[9px] font-bold tracking-widest"
                  style={{ background: 'linear-gradient(90deg,#D4B26A,#C9A758)', color: '#07153A' }}>
                  *&nbsp;&nbsp;CONFIRMED&nbsp;&nbsp;*
                </div>
              </div>

              {/* ── PERFORATION ── */}
              <div className="relative flex items-center" style={{ height: 24 }}>
                {/* Left notch */}
                <div className="absolute -left-3 w-6 h-6 rounded-full bg-white" />
                {/* Right notch */}
                <div className="absolute -right-3 w-6 h-6 rounded-full bg-white" />
                {/* Gold rules + dashes */}
                <div className="flex-1 mx-5 flex flex-col gap-[5px]">
                  <div className="h-px opacity-40" style={{ background: '#D4B26A' }} />
                  <div className="flex gap-[5px]">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <div key={i} className="h-[2px] flex-1 rounded-full" style={{ background: '#D4B26A', opacity: 0.8 }} />
                    ))}
                  </div>
                  <div className="h-px opacity-40" style={{ background: '#D4B26A' }} />
                </div>
              </div>

              {/* ── BOTTOM SECTION ── */}
              <div className="px-5 pt-4 pb-5 relative">

                {/* Subtle Moroccan star overlays */}
                <svg className="absolute top-2 left-1 opacity-[0.12]" width="38" height="38" viewBox="-19 -19 38 38">
                  {Array.from({length:8}).map((_,i) => {
                    const a = (i*Math.PI/4)-Math.PI/2, b = a+Math.PI/8;
                    const o=15,n=6;
                    return <line key={i} x1={Math.cos(a)*o} y1={Math.sin(a)*o} x2={Math.cos(b)*n} y2={Math.sin(b)*n} stroke="#D4B26A" strokeWidth="0.8"/>;
                  })}
                  <circle r="6" fill="none" stroke="#D4B26A" strokeWidth="0.5"/>
                </svg>

                {/* Event label + title */}
                <p className="text-center text-[8px] tracking-[3px] font-bold mb-1" style={{ color: '#B8952A' }}>
                  E &nbsp; V &nbsp; E &nbsp; N &nbsp; T
                </p>
                <p className="text-center font-bold text-[13px] leading-snug mb-3 line-clamp-2" style={{ color: '#07153A' }}>
                  {booking.eventTitle}
                </p>

                {/* Diamond divider */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px opacity-40" style={{ background: '#B8952A' }} />
                  <svg width="12" height="8" viewBox="-6 -4 12 8">
                    <polygon points="0,-4 5,0 0,4 -5,0" fill="none" stroke="#B8952A" strokeWidth="0.8"/>
                  </svg>
                  <div className="flex-1 h-px opacity-40" style={{ background: '#B8952A' }} />
                </div>

                {/* Info grid */}
                {[
                  [['GUEST NAME', booking.userName], ['ATTENDEES', `${booking.attendees} person${booking.attendees !== 1 ? 's' : ''}`]],
                  [['DATE', fmtDate], ['TIME', fmtTime]],
                ].map((row, ri) => (
                  <div key={ri}>
                    <div className="grid grid-cols-2 gap-3 py-2">
                      {row.map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[7px] tracking-[2px] font-bold mb-1" style={{ color: '#B8952A' }}>{label}</p>
                          <p className="font-bold text-[10px] leading-tight" style={{ color: '#07153A' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    {ri < 1 && <div className="h-px opacity-20" style={{ background: '#B8952A' }} />}
                  </div>
                ))}

                <div className="h-px opacity-20 mt-1 mb-2" style={{ background: '#B8952A' }} />

                <div className="py-2">
                  <p className="text-[7px] tracking-[2px] font-bold mb-1" style={{ color: '#B8952A' }}>TOTAL AMOUNT</p>
                  <p className="font-bold text-[13px]" style={{ color: '#07153A' }}>{Number(booking.totalAmount).toFixed(2)} MAD</p>
                </div>

                {/* Separator */}
                <div className="h-px opacity-30 my-3" style={{ background: '#B8952A' }} />

                {/* Booking reference */}
                <p className="text-center text-[7px] tracking-[3px] font-bold mb-1" style={{ color: '#B8952A' }}>
                  BOOKING  REFERENCE
                </p>
                <p className="text-center font-bold text-[11px] tracking-wider mb-3" style={{ color: '#07153A' }}>
                  {booking.bookingReference}
                </p>

                {/* QR placeholder */}
                <div className="flex justify-center mb-4">
                  <div className="p-1.5 rounded-lg" style={{ border: '1.5px solid #D4B26A', background: 'white' }}>
                    <svg width="64" height="64" viewBox="0 0 64 64" className="opacity-80">
                      <rect x="2" y="2" width="20" height="20" fill="none" stroke="#07153A" strokeWidth="2"/>
                      <rect x="6" y="6" width="12" height="12" fill="#07153A"/>
                      <rect x="42" y="2" width="20" height="20" fill="none" stroke="#07153A" strokeWidth="2"/>
                      <rect x="46" y="6" width="12" height="12" fill="#07153A"/>
                      <rect x="2" y="42" width="20" height="20" fill="none" stroke="#07153A" strokeWidth="2"/>
                      <rect x="6" y="46" width="12" height="12" fill="#07153A"/>
                      <rect x="26" y="2" width="4" height="4" fill="#07153A"/>
                      <rect x="32" y="2" width="4" height="4" fill="#07153A"/>
                      <rect x="26" y="8" width="8" height="4" fill="#07153A"/>
                      <rect x="26" y="26" width="12" height="4" fill="#07153A"/>
                      <rect x="40" y="26" width="4" height="8" fill="#07153A"/>
                      <rect x="46" y="26" width="4" height="4" fill="#07153A"/>
                      <rect x="26" y="40" width="4" height="4" fill="#07153A"/>
                      <rect x="34" y="40" width="8" height="4" fill="#07153A"/>
                      <rect x="26" y="48" width="8" height="4" fill="#07153A"/>
                      <rect x="46" y="46" width="4" height="4" fill="#07153A"/>
                      <rect x="54" y="40" width="4" height="8" fill="#07153A"/>
                    </svg>
                  </div>
                </div>

                {/* Footer rule */}
                <div className="h-px opacity-30 mb-2" style={{ background: '#B8952A' }} />
                <p className="text-center text-[7px] tracking-[1.5px] font-medium" style={{ color: '#B8952A' }}>
                  PRESENT THIS TICKET AT THE EVENT ENTRANCE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        {dlError && (
          <p className="mt-3 px-1 text-center text-[11px] text-red-600 font-medium">{dlError}</p>
        )}
        <div className="flex gap-2 mt-3 px-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 font-semibold"
            style={{ background: 'linear-gradient(90deg,#D4B26A,#C9A758)', color: '#07153A' }}
          >
            {downloading ? (
              <><span className="animate-spin mr-2">⟳</span> Generating…</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> Download PDF</>
            )}
          </Button>
        </div>

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

  const { data, isLoading, isError, refetch } = useQuery({
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
    active: bookings.filter((b: Booking) => b.status === 'confirmed').length,
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
            <p className="text-xs text-muted-foreground">Confirmed bookings</p>
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
        <CardContent className="overflow-x-auto">
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
                <SelectItem value="pending">"pending"</SelectItem>
                <SelectItem value="cancelled">"cancelled"</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <p className="text-sm font-medium text-foreground">Failed to load bookings</p>
              <button onClick={() => refetch()} className="text-xs text-primary underline">Retry</button>
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
                        {booking.status === 'confirmed' && (
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
