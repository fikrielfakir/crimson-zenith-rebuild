import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Plus, Pencil, Trash2, Star, MessageSquare } from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { useAdminCRUD } from '@/hooks/useAdminCRUD';

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  feedback: string;
  rating: number;
  isApproved: boolean;
  isActive: boolean;
  ordering: number;
}

const emptyForm = { name: '', role: '', feedback: '', rating: 5, isApproved: true, isActive: true };

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsManagement() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const crud = useAdminCRUD<Testimonial>({
    readEndpoint: '/api/admin/cms/testimonials',
    writeEndpoint: '/api/admin/cms/testimonials',
    queryKey: ['admin-testimonials'],
    messages: {
      created: 'Testimonial added',
      updated: 'Testimonial updated',
      deleted: 'Testimonial deleted',
    },
  });

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      role: item.role ?? '',
      feedback: item.feedback,
      rating: item.rating,
      isApproved: item.isApproved,
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.feedback.trim()) return;
    if (editingItem) {
      await crud.update(editingItem.id, form);
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
          <h1 className="text-3xl font-bold">{t('admin.testimonials.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.testimonials.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.testimonials.addTestimonial')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.testimonials.cardTitle')}</CardTitle>
          <CardDescription>{crud.data.length} testimonial{crud.data.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {crud.isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">{t('admin.common.loading')}</div>
          ) : crud.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('admin.testimonials.noItems')}</p>
              <p className="text-sm mt-2">{t('admin.testimonials.clickToAdd')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.common.name')}</TableHead>
                  <TableHead>{t('admin.testimonials.colRole')}</TableHead>
                  <TableHead>{t('admin.testimonials.colRating')}</TableHead>
                  <TableHead>{t('admin.testimonials.colFeedback')}</TableHead>
                  <TableHead>{t('admin.common.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crud.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.role ?? '—'}</TableCell>
                    <TableCell><StarRating value={item.rating} /></TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{item.feedback}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.isApproved
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                            : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                        }`}>
                          {item.isApproved ? t('admin.common.approved') : t('admin.common.pending')}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.isActive
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                        }`}>
                          {item.isActive ? t('admin.common.visible') : t('admin.common.hidden')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TranslateDialog
                          entityType="testimonial"
                          entityId={item.id}
                          entityLabel={item.name}
                          fields={[
                            { key: 'name', label: 'Name' },
                            { key: 'role', label: 'Role' },
                            { key: 'feedback', label: 'Feedback', multiline: true },
                          ]}
                          sourceValues={{ name: item.name, role: item.role ?? '', feedback: item.feedback }}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)}>
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
            <DialogTitle>{editingItem ? t('admin.testimonials.editTitle') : t('admin.testimonials.addTitle')}</DialogTitle>
            <DialogDescription>
              {editingItem ? t('admin.testimonials.editDesc') : t('admin.testimonials.addDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="t-name">{t('admin.common.name')} *</Label>
              <Input id="t-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('admin.testimonials.namePlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-role">{t('admin.testimonials.roleTitle')}</Label>
              <Input id="t-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder={t('admin.testimonials.rolePlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-feedback">{t('admin.testimonials.colFeedback')} *</Label>
              <Textarea id="t-feedback" value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} rows={4} placeholder="Their testimonial text…" />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.testimonials.colRating')}</Label>
              <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {'★'.repeat(r)}{'☆'.repeat(5 - r)} ({r}/5)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch id="t-approved" checked={form.isApproved} onCheckedChange={(v) => setForm({ ...form, isApproved: v })} />
                <Label htmlFor="t-approved">{t('admin.common.approved')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="t-active" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                <Label htmlFor="t-active">{t('admin.common.visibleOnSite')}</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>{t('admin.common.cancel')}</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? t('admin.events.saving') : t('admin.common.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.testimonials.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the testimonial from the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {crud.isRemoving ? t('admin.common.deleting') : t('admin.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
