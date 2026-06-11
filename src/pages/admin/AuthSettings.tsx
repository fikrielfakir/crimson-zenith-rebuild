import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, UserPlus, Lock, Clock, AlertTriangle, Chrome, Copy, CheckCheck, Eye, EyeOff } from 'lucide-react';
import {
  AdminPageHeader,
  AdminCard,
  AdminSaveButton,
  AdminFormSkeleton,
  AdminPageError,
  LABEL_CN,
  HINT_CN,
} from '@/components/admin/AdminPageShell';

interface AuthSettingsData {
  allowRegistration: boolean;
  passwordMinLength: number;
  sessionDurationHours: number;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  googleOauthEnabled: boolean;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
}

const defaults: AuthSettingsData = {
  allowRegistration: true,
  passwordMinLength: 8,
  sessionDurationHours: 24,
  requireEmailVerification: false,
  maxLoginAttempts: 5,
  googleOauthEnabled: false,
  googleClientId: '',
  googleClientSecret: '',
  googleCallbackUrl: '',
};

export default function AuthSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AuthSettingsData>(defaults);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<AuthSettingsData>({
    queryKey: ['admin-auth-settings'],
    queryFn: async () => {
      const res = await apiFetch('/api/admin/auth-settings');
      if (!res.ok) throw new Error('Failed to fetch auth settings');
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setForm({ ...defaults, ...data });
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: AuthSettingsData) => {
      const res = await apiFetch('/api/admin/auth-settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['admin-auth-settings'] });
      setForm(f => ({ ...f, googleClientSecret: saved.googleClientSecret ?? f.googleClientSecret }));
      toast({ title: t('admin.auth.toastSaved') });
    },
    onError: () => toast({ title: t('admin.auth.toastSaveFailed'), variant: 'destructive' }),
  });

  const set = <K extends keyof AuthSettingsData>(key: K, value: AuthSettingsData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const copyCallbackUrl = () => {
    navigator.clipboard.writeText(form.googleCallbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <AdminFormSkeleton rows={5} className="max-w-xl" />;
  if (isError) return (
    <AdminPageError
      title={t('admin.auth.loadFailed')}
      message={t('admin.auth.loadFailedDesc')}
      onRetry={refetch}
      className="max-w-xl"
    />
  );

  return (
    <div className="space-y-6 max-w-xl">
      <AdminPageHeader
        title={t('admin.auth.title')}
        description={t('admin.auth.pageDesc')}
      />

      {/* Registration & Security */}
      <AdminCard
        title={t('admin.auth.registrationTitle')}
        description={t('admin.auth.registrationDesc')}
        footer={
          <AdminSaveButton
            isPending={saveMutation.isPending}
            onClick={() => saveMutation.mutate(form)}
            label={t('admin.settings.saveSettings')}
            pendingLabel={t('admin.common.saving')}
            icon={<ShieldCheck className="h-4 w-4" />}
          />
        }
      >
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <UserPlus className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className={LABEL_CN}>{t('admin.auth.allowNewRegistrations')}</p>
              <p className={HINT_CN}>{t('admin.auth.allowNewRegistrationsHint')}</p>
            </div>
          </div>
          <Switch
            checked={form.allowRegistration}
            onCheckedChange={v => set('allowRegistration', v)}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className={LABEL_CN}>{t('admin.auth.requireEmailVerificationLabel')}</p>
              <p className={HINT_CN}>{t('admin.auth.requireEmailVerificationHint')}</p>
            </div>
          </div>
          <Switch
            checked={form.requireEmailVerification}
            onCheckedChange={v => set('requireEmailVerification', v)}
          />
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-muted-foreground" />
            {t('admin.auth.passwordPolicy')}
          </div>
          <p className={HINT_CN}>{t('admin.auth.passwordPolicyHint')}</p>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>{t('admin.auth.minPasswordLength')}</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={4}
              max={32}
              value={form.passwordMinLength}
              onChange={e => set('passwordMinLength', Math.max(4, Math.min(32, parseInt(e.target.value) || 8)))}
              className="w-24"
            />
            <span className={HINT_CN}>{t('admin.auth.minPasswordLengthHint')}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {t('admin.auth.sessionSecurity')}
          </div>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>{t('admin.auth.sessionDuration')}</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={720}
              value={form.sessionDurationHours}
              onChange={e => set('sessionDurationHours', Math.max(1, Math.min(720, parseInt(e.target.value) || 24)))}
              className="w-24"
            />
            <span className={HINT_CN}>{t('admin.auth.sessionDurationHint')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>{t('admin.auth.maxLoginAttemptsLabel')}</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={20}
              value={form.maxLoginAttempts}
              onChange={e => set('maxLoginAttempts', Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
              className="w-24"
            />
            <span className={HINT_CN}>{t('admin.auth.maxLoginAttemptsHint')}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{t('admin.common.sessionNote')}</span>
        </div>
      </AdminCard>

      {/* Google OAuth */}
      <AdminCard
        title="Google Sign-In"
        description="Allow users to log in or register using their Google account."
        footer={
          <AdminSaveButton
            isPending={saveMutation.isPending}
            onClick={() => saveMutation.mutate(form)}
            label="Save Google Settings"
            pendingLabel={t('admin.common.saving')}
            icon={<Chrome className="h-4 w-4" />}
          />
        }
      >
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Chrome className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className={LABEL_CN}>Enable Google Sign-In</p>
              <p className={HINT_CN}>Show "Continue with Google" button on login and signup pages.</p>
            </div>
          </div>
          <Switch
            checked={form.googleOauthEnabled}
            onCheckedChange={v => set('googleOauthEnabled', v)}
          />
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>Google Client ID</Label>
          <Input
            type="text"
            placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
            value={form.googleClientId}
            onChange={e => set('googleClientId', e.target.value)}
            className="font-mono text-xs"
          />
          <p className={HINT_CN}>From your Google Cloud Console → APIs &amp; Services → Credentials.</p>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>Google Client Secret</Label>
          <div className="relative">
            <Input
              type={showSecret ? 'text' : 'password'}
              placeholder="GOCSPX-…"
              value={form.googleClientSecret}
              onChange={e => set('googleClientSecret', e.target.value)}
              className="font-mono text-xs pr-10"
            />
            <button
              type="button"
              onClick={() => setShowSecret(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className={HINT_CN}>Leave unchanged to keep the existing secret. Changing it will overwrite it.</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className={LABEL_CN}>Authorized Redirect URI</Label>
          <p className={HINT_CN}>
            Add this URL to your Google Cloud Console → Credentials → OAuth 2.0 Client → Authorized redirect URIs.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted rounded-md px-3 py-2 break-all font-mono">
              {form.googleCallbackUrl || '(saved URL will appear here)'}
            </code>
            <button
              type="button"
              onClick={copyCallbackUrl}
              className="shrink-0 p-2 rounded-md border hover:bg-muted transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-3 text-sm text-blue-800 dark:text-blue-300">
          <Chrome className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Go to <strong>console.cloud.google.com</strong> → APIs &amp; Services → Credentials → your OAuth client → add the redirect URI above → paste Client ID &amp; Secret here → Enable.
          </span>
        </div>
      </AdminCard>
    </div>
  );
}
