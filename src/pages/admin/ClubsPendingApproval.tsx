import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, MapPin, Users, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

async function fetchPendingClubs() {
  const response = await fetch('/api/admin/clubs?status=pending');
  if (!response.ok) throw new Error('Failed to fetch pending clubs');
  return response.json();
}

export default function ClubsPendingApproval() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['clubs', 'pending'],
    queryFn: fetchPendingClubs,
  });

  const approveClubMutation = useMutation({
    mutationFn: async (clubId: number) => {
      const response = await fetch(`/api/admin/clubs/${clubId}/approve`, {
        method: 'POST',
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
      const response = await fetch(`/api/admin/clubs/${clubId}/reject`, {
        method: 'POST',
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

  const pendingCount = data?.clubs?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Club Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve new club registrations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Review Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Per application</p>
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
              <div className="text-muted-foreground">Loading pending clubs...</div>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => approveClubMutation.mutate(club.id)}
                        disabled={approveClubMutation.isPending}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => rejectClubMutation.mutate(club.id)}
                        disabled={rejectClubMutation.isPending}
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
    </div>
  );
}
