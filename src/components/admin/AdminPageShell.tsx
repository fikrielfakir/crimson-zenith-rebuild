/**
 * AdminPageShell — Unified design system for admin pages.
 *
 * Exports:
 *  - AdminPageHeader       — consistent h1 + description block
 *  - AdminCard             — Card with consistent padding & radius
 *  - AdminSaveButton       — Save/submit button with spinner state
 *  - AdminFormSkeleton     — Skeleton for a settings/form card
 *  - AdminTableSkeleton    — Skeleton for a data table card
 *  - AdminStatsSkeleton    — Skeleton for 4-column stat cards
 *  - AdminPageError        — Inline card-level error with retry
 *  - AdminEmptyState       — Empty table/list placeholder
 */
import { ReactNode } from 'react';
import { Loader2, AlertTriangle, RefreshCw, InboxIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ── Typography tokens ─────────────────────────────────────────────────────────
export const PAGE_TITLE_CN   = 'text-2xl font-bold tracking-tight';
export const PAGE_DESC_CN    = 'text-sm text-muted-foreground mt-1';
export const CARD_TITLE_CN   = 'text-base font-semibold';
export const CARD_DESC_CN    = 'text-sm text-muted-foreground';
export const LABEL_CN        = 'text-sm font-medium leading-none';
export const HINT_CN         = 'text-xs text-muted-foreground';

// ── AdminPageHeader ───────────────────────────────────────────────────────────
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function AdminPageHeader({ title, description, action, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h1 className={PAGE_TITLE_CN}>{title}</h1>
        {description && <p className={PAGE_DESC_CN}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ── AdminCard ─────────────────────────────────────────────────────────────────
interface AdminCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  footer?: ReactNode;
}

export function AdminCard({
  title,
  description,
  children,
  className,
  contentClassName,
  footer,
}: AdminCardProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className={CARD_TITLE_CN}>{title}</CardTitle>}
          {description && <CardDescription className={CARD_DESC_CN}>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn('space-y-4', contentClassName)}>{children}</CardContent>
      {footer && (
        <div className="border-t px-6 py-4 flex items-center gap-3">{footer}</div>
      )}
    </Card>
  );
}

// ── AdminSaveButton ───────────────────────────────────────────────────────────
interface AdminSaveButtonProps {
  isPending: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  label?: string;
  pendingLabel?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

export function AdminSaveButton({
  isPending,
  onClick,
  type = 'button',
  label = 'Save Changes',
  pendingLabel = 'Saving…',
  icon,
  className,
  disabled,
  size = 'default',
}: AdminSaveButtonProps) {
  return (
    <Button
      type={type}
      size={size}
      disabled={isPending || disabled}
      onClick={onClick}
      className={cn('gap-2', className)}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon ?? null
      )}
      {isPending ? pendingLabel : label}
    </Button>
  );
}

// ── AdminFormSkeleton ─────────────────────────────────────────────────────────
/** Skeleton for a settings/form card — title, description, N field rows. */
export function AdminFormSkeleton({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-72 mt-1" />
      </CardHeader>
      <CardContent className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-md mt-2" />
      </CardContent>
    </Card>
  );
}

// ── AdminTableSkeleton ────────────────────────────────────────────────────────
/** Skeleton for a data-table card — toolbar, header, N rows. */
export function AdminTableSkeleton({ rows = 6, cols = 5, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-64 rounded-md mt-2" />
      </CardHeader>
      <CardContent className="p-0">
        {/* Table header */}
        <div className="flex gap-4 px-6 py-3 border-b">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 px-6 py-4 border-b last:border-0">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton
                key={j}
                className={cn('h-4', j === 0 ? 'w-8 shrink-0' : 'flex-1')}
              />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── AdminStatsSkeleton ────────────────────────────────────────────────────────
/** Skeleton for 4 stat cards in a row. */
export function AdminStatsSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── AdminPageError ────────────────────────────────────────────────────────────
interface AdminPageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function AdminPageError({
  title = 'Failed to load',
  message = 'There was a problem loading this content. Check your connection and try again.',
  onRetry,
  className,
}: AdminPageErrorProps) {
  return (
    <Card className={cn('shadow-sm border-destructive/30', className)}>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1 max-w-sm">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 mt-1">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ── AdminEmptyState ───────────────────────────────────────────────────────────
interface AdminEmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function AdminEmptyState({
  title = 'No items yet',
  message = 'Nothing to show here.',
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-14 text-center', className)}>
      <div className="rounded-full bg-muted p-4">
        <InboxIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      </div>
      {action}
    </div>
  );
}
