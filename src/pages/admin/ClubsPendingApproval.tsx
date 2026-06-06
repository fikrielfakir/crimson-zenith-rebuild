import { apiFetch } from '@/lib/apiFetch';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, MapPin, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useToast } from '@/hooks/use-toast';

async function fetchPendingClubs() {
  const response = await apiFetch('/api/admin/clubs?status=pending', { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch pending clubs');
  return response.json();
}

type PendingAction = {
  clubId: number;
  clubName: string;
  action: 'approve' | 'reject';
};

export default function ClubsPendingApproval() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['clubs', 'pending'],
    queryFn: fetchPendingClubs,
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
      queryClient.invalidateQueries({ queryKey: ['clubs', 'pending'] });
      toast({ title: 'Club approved successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to approve club', variant: 'destructive' });
    },
  });

  const rejectClubMutation = useMutation({
    mutationFn: async (clubId: number) => {
      const response = await apiFetch(`/api/admin/clubs/${clubId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to reject club');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', 'pending'] });
      toast({ title: 'Club rejected' });
    },
    onError: () => {
      toast({ title: 'Failed to reject club', variant: 'destructive' });
    },
  });

  const isMutating = approveClubMutation.isPending || rejectClubMutation.isPending;

  const handleConfirm = () => {
    if (!pendingAction) return;
    if (pendingAction.action === 'approve') {
      approveClubMutation.mutate(pendingAction.clubId);
    } else {
      rejectClubMutation.mutate(pendingAction.clubId);
    }
    setPendingAction(null);
  };

  const pendingCount = data?.clubs?.length || 0;
  const isApproving = pendingAction?.action === 'approve';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Club Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve new club registrations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : (data?.total ?? 0)}</div>
            <p className="text-xs text-muted-foreground">Across all pages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clubs Awaiting Approval</CardTitle>
          <CardDescription>Review club applications and approve or reject them</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendingCount === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground">No clubs pending approval at the moment</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Club</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.clubs?.map((club: any) => (
                  <TableRow key={club.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={club.image} />
                          <AvatarFallback>{club.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{club.name}</p>
                          <p className="text-sm text-muted-foreground">{club.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {club.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="mr-1 h-3 w-3" />
                        {club.memberCount || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(club.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/clubs/${club.id}/edit`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => setPendingAction({ clubId: club.id, clubName: club.name, action: 'approve' })}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => setPendingAction({ clubId: club.id, clubName: club.name, action: 'reject' })}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingAction} onOpenChange={(open) => { if (!open) setPendingAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isApproving ? 'Approve this club?' : 'Reject this club?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isApproving
                ? <>You are about to approve <strong>{pendingAction?.clubName}</strong>. It will become publicly visible and members will be able to join.</>
                : <>You are about to reject <strong>{pendingAction?.clubName}</strong>. It will be marked inactive and hidden from public listings. This can be reversed later from the edit page.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={isApproving ? '' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
            >
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isApproving ? 'Yes, approve' : 'Yes, reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
