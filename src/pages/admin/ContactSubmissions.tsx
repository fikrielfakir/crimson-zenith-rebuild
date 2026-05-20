import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Search,
  Eye,
  Trash2,
  MessageSquare,
  CheckCheck,
  Archive,
  Clock,
  Filter,
  RefreshCw,
  Phone,
  User,
  Calendar,
  StickyNote,
  Inbox,
  MailOpen,
} from 'lucide-react';

type Status = 'new' | 'read' | 'replied' | 'archived';

interface Submission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: Status;
  admin_notes?: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Submission[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

/* ── Status config ───────────────────────────────────────── */

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: any }> = {
  new:      { label: 'New',      color: 'bg-blue-50 text-blue-700 ring-blue-600/20',    icon: Mail },
  read:     { label: 'Read',     color: 'bg-gray-50 text-gray-600 ring-gray-400/20',    icon: MailOpen },
  replied:  { label: 'Replied',  color: 'bg-green-50 text-green-700 ring-green-600/20', icon: CheckCheck },
  archived: { label: 'Archived', color: 'bg-amber-50 text-amber-700 ring-amber-600/20', icon: Archive },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.read;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

/* ── API helpers ─────────────────────────────────────────── */

async function fetchSubmissions(status: string, search: string, page: number): Promise<PaginatedResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (status !== 'all') params.set('status', status);
  if (search.trim()) params.set('search', search.trim());
  const res = await apiFetch(`/api/admin/contact-submissions?${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}

async function fetchSubmission(id: number): Promise<Submission> {
  const res = await apiFetch(`/api/admin/contact-submissions/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch submission');
  return res.json();
}

async function updateSubmission(id: number, data: Partial<Pick<Submission, 'status' | 'admin_notes'>>): Promise<Submission> {
  const res = await apiFetch(`/api/admin/contact-submissions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update submission');
  return res.json();
}

async function deleteSubmission(id: number): Promise<void> {
  const res = await apiFetch(`/api/admin/contact-submissions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete submission');
}

/* ── Helpers ─────────────────────────────────────────────── */

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

/* ── Detail drawer ───────────────────────────────────────── */

interface DetailDialogProps {
  submissionId: number | null;
  onClose: () => void;
  onUpdated: () => void;
}

function DetailDialog({ submissionId, onClose, onUpdated }: DetailDialogProps) {
  const [notes, setNotes] = useState('');
  const [notesLoaded, setNotesLoaded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sub, isLoading } = useQuery({
    queryKey: ['contact-submission', submissionId],
    queryFn: () => fetchSubmission(submissionId!),
    enabled: submissionId !== null,
    onSuccess: (data) => {
      if (!notesLoaded) {
        setNotes(data.admin_notes ?? '');
        setNotesLoaded(true);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Pick<Submission, 'status' | 'admin_notes'>>) =>
      updateSubmission(submissionId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submission', submissionId] });
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      onUpdated();
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const handleStatusChange = (status: Status) => {
    updateMutation.mutate({ status });
    toast({ title: `Marked as ${STATUS_CONFIG[status].label}` });
  };

  const handleSaveNotes = () => {
    updateMutation.mutate({ admin_notes: notes });
    toast({ title: 'Notes saved' });
  };

  const handleClose = () => {
    setNotesLoaded(false);
    onClose();
  };

  return (
    <Dialog open={submissionId !== null} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Message
          </DialogTitle>
          <DialogDescription>
            View the full message and manage its status
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : sub ? (
          <div className="space-y-5">

            {/* Sender info */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                {initials(sub.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-base">{sub.name}</span>
                  <StatusBadge status={sub.status} />
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <a href={`mailto:${sub.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {sub.email}
                  </a>
                  {sub.phone && (
                    <a href={`tel:${sub.phone}`} className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {sub.phone}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(sub.created_at).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            {/* Subject */}
            {sub.subject && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{sub.subject}</p>
              </div>
            )}

            <Separator />

            {/* Message body */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Message</p>
              <div className="bg-muted/40 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border">
                {sub.message}
              </div>
            </div>

            <Separator />

            {/* Status actions */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Change Status</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  const Icon = cfg.icon;
                  return (
                    <Button
                      key={s}
                      variant={sub.status === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(s)}
                      disabled={sub.status === s || updateMutation.isPending}
                    >
                      <Icon className="mr-1.5 h-3.5 w-3.5" />
                      {cfg.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Admin notes */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5" />
                Admin Notes (internal only)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add private notes about this message (not visible to sender)…"
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving…' : 'Save Notes'}
                </Button>
              </div>
            </div>

            {/* Quick reply link */}
            <div className="rounded-lg border bg-blue-50 p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Reply via email</p>
                <p className="text-xs text-blue-700 mt-0.5">Opens your mail client addressed to the sender</p>
              </div>
              <a
                href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject ?? 'Your message')}`}
                onClick={() => handleStatusChange('replied')}
              >
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">
                  <Mail className="mr-1.5 h-3.5 w-3.5" />
                  Reply
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Submission not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function ContactSubmissions() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['contact-submissions', statusFilter, search, page],
    queryFn: () => fetchSubmissions(statusFilter, search, page),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({ title: 'Submission deleted' });
      setDeletingId(null);
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const quickStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Status }) =>
      updateSubmission(id, { status }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({ title: `Marked as ${STATUS_CONFIG[vars.status].label}` });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
  };

  const submissions = data?.data ?? [];
  const total = data?.total ?? 0;
  const lastPage = data?.last_page ?? 1;

  const countsByStatus = {
    new: submissions.filter(s => s.status === 'new').length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Inbox</h1>
          <p className="text-muted-foreground mt-1">Messages submitted via the contact form</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total, color: 'text-foreground' },
          { label: 'New', value: data?.data.filter ? (data.data as Submission[]).filter(s => s.status === 'new').length : '—', color: 'text-blue-600' },
          { label: 'Replied', value: data?.data ? (data.data as Submission[]).filter(s => s.status === 'replied').length : '—', color: 'text-green-600' },
          { label: 'Archived', value: data?.data ? (data.data as Submission[]).filter(s => s.status === 'archived').length : '—', color: 'text-amber-600' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or message…"
                  className="pl-9"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
              {search && (
                <Button type="button" variant="ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
                  Clear
                </Button>
              )}
            </form>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Messages
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Loading…' : `${total} message${total !== 1 ? 's' : ''}${search ? ` matching "${search}"` : ''}${statusFilter !== 'all' ? ` — ${STATUS_CONFIG[statusFilter as Status]?.label ?? statusFilter}` : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <div className="text-center space-y-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                <p className="text-sm">Loading messages…</p>
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-base">No messages found</p>
              <p className="text-sm mt-1">
                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'When visitors submit the contact form, messages will appear here'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Sender</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="max-w-xs">Preview</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow
                      key={sub.id}
                      className={`cursor-pointer transition-colors ${sub.status === 'new' ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'hover:bg-muted/40'}`}
                      onClick={() => setSelectedId(sub.id)}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                            {initials(sub.name)}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm truncate max-w-[140px] ${sub.status === 'new' ? 'font-semibold' : 'font-medium'}`}>
                              {sub.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{sub.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm truncate max-w-[160px] block ${sub.status === 'new' ? 'font-medium' : ''}`}>
                          {sub.subject || '(No subject)'}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate max-w-[220px]">{sub.message}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={sub.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(sub.created_at)}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View message"
                            onClick={() => setSelectedId(sub.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {sub.status !== 'replied' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                              title="Mark as replied"
                              onClick={() => quickStatusMutation.mutate({ id: sub.id, status: 'replied' })}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}

                          {sub.status !== 'archived' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                              title="Archive"
                              onClick={() => quickStatusMutation.mutate({ id: sub.id, status: 'archived' })}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                            title="Delete"
                            onClick={() => setDeletingId(sub.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {data?.current_page} of {lastPage} · {total} total
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1 || isFetching}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                      disabled={page >= lastPage || isFetching}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <DetailDialog
        submissionId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdated={handleUpdated}
      />

      {/* Delete confirm */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the contact submission. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
