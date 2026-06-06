import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Server, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorKind = 'network' | 'server' | 'timeout';

interface BackendOfflinePageProps {
  kind?: ErrorKind;
  onRetry: () => void;
  retrying?: boolean;
}

const CONFIG: Record<ErrorKind, {
  icon: typeof WifiOff;
  color: string;
  bg: string;
  ring: string;
  title: string;
  description: string;
}> = {
  network: {
    icon: WifiOff,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    ring: 'ring-amber-200 dark:ring-amber-800',
    title: 'Connection Lost',
    description: 'The admin panel can\'t reach the backend server. Check your internet connection or try again in a moment.',
  },
  server: {
    icon: Server,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    ring: 'ring-red-200 dark:ring-red-800',
    title: 'Server Error',
    description: 'The backend server responded with an unexpected error. This is usually temporary — please try again shortly.',
  },
  timeout: {
    icon: Clock,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    ring: 'ring-orange-200 dark:ring-orange-800',
    title: 'Request Timed Out',
    description: 'The server took too long to respond. The service may be under heavy load. Please wait a moment and retry.',
  },
};

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full bg-current animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}

export function BackendOfflinePage({ kind = 'network', onRetry, retrying = false }: BackendOfflinePageProps) {
  const [countdown, setCountdown] = useState(30);
  const cfg = CONFIG[kind];
  const Icon = cfg.icon;

  // Auto-retry countdown
  useEffect(() => {
    if (retrying) { setCountdown(30); return; }
    if (countdown <= 0) { onRetry(); setCountdown(30); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, retrying, onRetry]);

  // Reset countdown on kind change
  useEffect(() => { setCountdown(30); }, [kind]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-full px-6 py-16 bg-background">
      {/* Animated rings */}
      <div className="relative mb-10">
        <div className={cn('absolute inset-0 rounded-full animate-ping opacity-20', cfg.bg)} style={{ margin: '-12px' }} />
        <div className={cn('absolute inset-0 rounded-full opacity-30 ring-2', cfg.ring)} style={{ margin: '-8px' }} />
        <div className={cn('relative flex h-20 w-20 items-center justify-center rounded-full ring-2', cfg.bg, cfg.ring)}>
          <Icon className={cn('h-9 w-9', cfg.color)} />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">{cfg.title}</h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground leading-relaxed mb-8">
        {cfg.description}
      </p>

      {/* Status pill */}
      <div className={cn(
        'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium mb-8 ring-1',
        cfg.bg, cfg.ring, cfg.color,
      )}>
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        Backend unreachable · Auto-retry in {countdown}s
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          size="lg"
          onClick={() => { setCountdown(30); onRetry(); }}
          disabled={retrying}
          className="gap-2 min-w-36"
        >
          {retrying ? (
            <>
              <span className="flex gap-1">
                <Dot delay="0ms" />
                <Dot delay="150ms" />
                <Dot delay="300ms" />
              </span>
              Connecting
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Retry Now
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => window.location.reload()}
          className="gap-2 text-muted-foreground"
        >
          Reload Page
        </Button>
      </div>

      {/* Diagnostic hints */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
        {[
          { icon: WifiOff, label: 'Check internet', hint: 'Make sure your network is active' },
          { icon: Server,  label: 'Backend server', hint: 'The API server may be restarting' },
          { icon: RefreshCw, label: 'Clear cache', hint: 'Hard-refresh with Ctrl+Shift+R' },
        ].map(({ icon: HintIcon, label, hint }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-muted/40 p-4 text-center"
          >
            <HintIcon className="h-5 w-5 text-muted-foreground" />
            <p className="text-xs font-medium">{label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
