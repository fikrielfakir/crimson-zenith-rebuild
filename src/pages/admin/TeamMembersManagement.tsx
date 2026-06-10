import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { useAdminCRUD } from '@/hooks/useAdminCRUD';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  ordering: number;
  isActive: boolean;
}

const emptyForm = { name: '', role: '', bio: '', email: '', phone: '', isActive: true };

export default function TeamMembersManagement() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const crud = useAdminCRUD<TeamMember>({
    readEndpoint: '/api/admin/cms/team-members',
    writeEndpoint: '/api/admin/cms/team-members',
    queryKey: ['admin-team-members'],
    messages: {
      created: 'Team member added',
      updated: 'Team member updated',
      deleted: 'Team member deleted',
    },
  });

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio ?? '',
      email: member.email ?? '',
      phone: member.phone ?? '',
      isActive: member.isActive,
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingMember(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    if (editingMember) {
      await crud.update(editingMember.id, form);
    } else {
      await crud.create(form);
    }
    handleClose();
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    await crud.remove(deletingId);
    setDeletingId(null);
  };

  const isPending = crud.isCreating || crud.isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground mt-1">Manage the team section on the landing page</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>{crud.data.length} member{crud.data.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {crud.isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">Loading…</div>
          ) : crud.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No team members yet</p>
              <p className="text-sm mt-2">Click t('admin.team.addMember') to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.team.colName')}</TableHead>
                  <TableHead>{t('admin.team.colRole')}</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">{t('admin.common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crud.data.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email ?? '—'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        member.isActive
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                          : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TranslateDialog
                          entityType="team_member"
                          entityId={member.id}
                          entityLabel={member.name}
                          fields={[
                            { key: 'name', label: 'Name' },
                            { key: 'role', label: 'Role' },
                            { key: 'bio', label: 'Bio', multiline: true },
                          ]}
                          sourceValues={{ name: member.name, role: member.role, bio: member.bio ?? '' }}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(member.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update member details' : 'Add a new team member to the landing page'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tm-name">Name *</Label>
              <Input id="tm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tm-role">Role *</Label>
              <Input id="tm-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g., President, Treasurer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tm-bio">Bio</Label>
              <Textarea id="tm-bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Short biography…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tm-email">Email</Label>
                <Input id="tm-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tm-phone">Phone</Label>
                <Input id="tm-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 600 000000" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="tm-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label htmlFor="tm-active">Visible on site</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the team member from the landing page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {crud.isRemoving ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
