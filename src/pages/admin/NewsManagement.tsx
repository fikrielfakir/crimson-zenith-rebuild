import { useTranslation } from 'react-i18next';
import { apiFetch, resolveStorageUrl } from '@/lib/apiFetch';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  Loader2,
  ArrowLeft,
  Globe,
  ImageIcon,
  Calendar,
  Hash,
  AlignLeft,
  Upload,
  X,
  Wand2,
} from 'lucide-react';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

type PostFormData = z.infer<typeof postSchema>;

async function fetchPosts(params: { search?: string; status?: string; category?: string; page: number; perPage: number }) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    perPage: params.perPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
    ...(params.category && params.category !== 'all' && { category: params.category }),
  });
  const response = await apiFetch(`/api/admin/news?${queryParams}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'event', label: 'Event' },
  { value: 'blog', label: 'Blog' },
];

function PostEditor({
  post,
  onClose,
  onSaved,
}: {
  post: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isNew = !post?.id;
  const [autoTranslatingAll, setAutoTranslatingAll] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isDirty } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? '',
      content: post?.content ?? '',
      excerpt: post?.excerpt ?? '',
      category: post?.category ?? '',
      featuredImage: resolveStorageUrl(post?.featuredImage ?? post?.featured_image ?? '') ?? '',
      status: post?.status ?? 'draft',
    },
  });

  const status = watch('status');
  const featuredImage = watch('featuredImage');


  async function handleAutoTranslateAll() {
    const currentTitle = watch('title');
    const currentExcerpt = watch('excerpt');
    const currentContent = watch('content');

    const sourceValues = {
      title: currentTitle ?? post?.title ?? '',
      excerpt: currentExcerpt ?? post?.excerpt ?? '',
      content: currentContent ?? post?.content ?? '',
    };

    const texts = [
      { key: 'title', value: sourceValues.title },
      { key: 'excerpt', value: sourceValues.excerpt },
      { key: 'content', value: sourceValues.content },
    ].filter(t => t.value.trim());

    if (texts.length === 0) {
      toast({ title: 'Nothing to translate', description: 'Add some content first.', variant: 'destructive' });
      return;
    }

    const LANGUAGES = ['ar', 'fr', 'es'];
    setAutoTranslatingAll(true);
    let successCount = 0;
    try {
      for (const lang of LANGUAGES) {
        const res = await apiFetch('/api/admin/translations/auto-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts, targetLanguage: lang }),
          credentials: 'include',
        });
        if (!res.ok) continue;
        const data = await res.json();
        const fields = Object.entries(data.results as Record<string, string>);
        await Promise.all(fields.map(([field, value]) =>
          apiFetch('/api/admin/translations', {
            method: 'POST',
            body: JSON.stringify({
              entityType: 'blog_post',
              entityId: String(post.id),
              field,
              language: lang,
              value,
            }),
          })
        ));
        successCount++;
      }
      toast({ title: `Auto-translated to ${successCount} language${successCount !== 1 ? 's' : ''}`, description: 'AR, FR, ES translations saved.' });
    } catch (err: any) {
      toast({ title: 'Translation error', description: err.message, variant: 'destructive' });
    } finally {
      setAutoTranslatingAll(false);
    }
  }

  const saveMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const url = isNew ? '/api/admin/news' : `/api/admin/news/${post.id}`;
      const res = await apiFetch(url, {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save post');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: isNew ? t('admin.news.toastCreated') : t('admin.news.toastUpdated') });
      onSaved();
    },
    onError: (error: Error) => {
      toast({ title: t('admin.news.toastSaveFailed'), description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = (data: PostFormData) => saveMutation.mutate(data);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('admin.common.back', 'Back')}
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-muted-foreground">
            {isNew ? t('admin.news.createPostTitle') : t('admin.news.editPost')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === 'published' ? 'default' : 'secondary'} className="capitalize">
            {status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('status', 'draft')}
            disabled={status === 'draft'}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setValue('status', 'published');
              handleSubmit(onSubmit)();
            }}
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <Globe className="h-3.5 w-3.5" />
            {status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 min-h-0 gap-0">
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div>
            <Input
              {...register('title')}
              placeholder="Post title…"
              className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto py-2 placeholder:text-muted-foreground/50"
              style={{ fontSize: '1.5rem', fontWeight: 700 }}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <AlignLeft className="h-3 w-3" /> Excerpt / Summary
            </Label>
            <Textarea
              {...register('excerpt')}
              placeholder="A short summary that appears in article listings…"
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Start writing your article content here…"
                  minHeight={480}
                />
              )}
            />
            {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
          </div>
        </div>

        <div className="w-72 border-l overflow-y-auto bg-muted/20 flex-shrink-0">
          <div className="p-4 space-y-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Settings</h3>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-1.5 flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Category
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <Label className="text-xs mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Status
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Featured Image
              </h3>
              <input type="hidden" {...register('featuredImage')} />
              <ImageUpload
                value={featuredImage}
                onChange={(url) => setValue('featuredImage', url, { shouldDirty: true })}
                description="JPG, PNG, WebP — max 50 MB"
              />
            </div>

            {!isNew && post?.id && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Translations
                  </h3>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 h-9"
                      onClick={handleAutoTranslateAll}
                      disabled={autoTranslatingAll}
                    >
                      {autoTranslatingAll ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" />Translating All…</>
                      ) : (
                        <><Wand2 className="h-3.5 w-3.5" />Auto Translate All</>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">Auto-generates AR · FR · ES</p>
                    <TranslateDialog
                      entityType="blog_post"
                      entityId={post.id}
                      entityLabel={post.title}
                      fields={[
                        { key: 'title', label: 'Title' },
                        { key: 'excerpt', label: 'Excerpt', multiline: true },
                        { key: 'content', label: 'Content', multiline: true },
                      ]}
                      sourceValues={{
                        title: watch('title') || post.title,
                        excerpt: watch('excerpt') || post.excerpt || '',
                        content: watch('content') || post.content || '',
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {!isNew && (
              <>
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  {post?.views !== undefined && (
                    <div className="flex justify-between">
                      <span>Views</span>
                      <span className="font-medium">{post.views.toLocaleString()}</span>
                    </div>
                  )}
                  {post?.publishedAt && (
                    <div className="flex justify-between">
                      <span>Published</span>
                      <span className="font-medium">{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewsManagement() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 25;
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-news', { search, statusFilter, categoryFilter, page, perPage }],
    queryFn: () => fetchPosts({ search, status: statusFilter, category: categoryFilter, page, perPage }),
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiFetch(`/api/admin/news/${postId}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to delete post');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: t('admin.news.toastDeleted') });
      setDeletingPostId(null);
    },
    onError: (error: Error) => {
      toast({ title: t('admin.news.toastDeleteFailed'), description: error.message, variant: 'destructive' });
    },
  });

  if (editingPost !== null) {
    return (
      <div className="h-full flex flex-col -m-6">
        <PostEditor
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-news'] });
            setEditingPost(null);
          }}
        />
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.news.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.news.subtitle')}</p>
        </div>
        <Button onClick={() => setEditingPost({})}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.news.newPost')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.news.searchPlaceholder')}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('admin.news.selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t('admin.common.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">{t('admin.common.published')}</SelectItem>
            <SelectItem value="draft">{t('admin.common.draft')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.news.colTitle')}</TableHead>
              <TableHead>{t('admin.news.colAuthor')}</TableHead>
              <TableHead>{t('admin.news.colCategory')}</TableHead>
              <TableHead>{t('admin.news.colPublished')}</TableHead>
              <TableHead>{t('admin.news.colViews')}</TableHead>
              <TableHead>{t('admin.common.status')}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full rounded" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium text-foreground">{t('admin.news.failedLoad')}</p>
                    <button onClick={() => refetch()} className="text-xs text-primary underline">{t('admin.common.retry')}</button>
                  </div>
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm font-medium">{t('admin.news.noPosts')}</p>
                    <p className="text-xs text-muted-foreground">{t('admin.news.createFirst')}</p>
                    <Button size="sm" className="mt-2" onClick={() => setEditingPost({})}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Create your first post
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post: any) => (
                <TableRow key={post.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setEditingPost(post)}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold text-sm">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback className="text-xs">{post.authorName?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{post.authorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : <span className="text-muted-foreground/50">—</span>}
                  </TableCell>
                  <TableCell className="text-sm">{post.views?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('admin.common.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.open(`/news/${post.slug}`, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t('admin.news.viewPost')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingPost(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('admin.news.editPost')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeletingPostId(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('admin.news.deletePost')}
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

      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t('admin.news.showing', {
              from: ((page - 1) * perPage) + 1,
              to: Math.min(page * perPage, data?.total || 0),
              total: data?.total || 0,
            })}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              {t('admin.common.previous')}
            </Button>
            {Array.from({ length: Math.min(data?.totalPages || 0, 5) }, (_, i) => {
              const pageNum = page <= 3 ? i + 1 : page - 2 + i;
              if (pageNum > (data?.totalPages || 0)) return null;
              return (
                <Button key={pageNum} variant={page === pageNum ? 'default' : 'outline'} size="sm" onClick={() => setPage(pageNum)}>
                  {pageNum}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))} disabled={page === data?.totalPages}>
              {t('admin.common.next')}
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deletingPostId !== null} onOpenChange={(open) => !open && setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.news.deletePost')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.news.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingPostId && deletePostMutation.mutate(deletingPostId)}
            >
              {t('admin.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
