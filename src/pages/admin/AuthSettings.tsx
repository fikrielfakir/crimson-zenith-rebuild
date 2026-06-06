import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, UserPlus, Lock, Clock, AlertTriangle } from 'lucide-react';
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
}

const defaults: AuthSettingsData = {
  allowRegistration: true,
  passwordMinLength: 8,
  sessionDurationHours: 24,
  requireEmailVerification: false,
  maxLoginAttempts: 5,
};

export default function AuthSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AuthSettingsData>(defaults);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auth-settings'] });
      toast({ title: 'Authentication settings saved' });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });

  const set = <K extends keyof AuthSettingsData>(key: K, value: AuthSettingsData[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  if (isLoading) return <AdminFormSkeleton rows={5} className="max-w-xl" />;
  if (isError) return (
    <AdminPageError
      title="Couldn't load auth settings"
      message="Authentication settings failed to load."
      onRetry={refetch}
      className="max-w-xl"
    />
  );

  return (
    <div className="space-y-6 max-w-xl">
      <AdminPageHeader
        title="Authentication Settings"
        description="Control how users sign up and log in to the site."
      />

      {/* Registration */}
      <AdminCard
        title="User Registration"
        description="Allow or block new users from creating accounts."
        footer={
          <AdminSaveButton
            isPending={saveMutation.isPending}
            onClick={() => saveMutation.mutate(form)}
            label="Save Settings"
            pendingLabel="Saving…"
            icon={<ShieldCheck className="h-4 w-4" />}
          />
        }
      >
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <UserPlus className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className={LABEL_CN}>Allow New Registrations</p>
              <p className={HINT_CN}>When off, only existing users can log in. New sign-ups are blocked.</p>
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
              <p className={LABEL_CN}>Require Email Verification</p>
              <p className={HINT_CN}>New accounts must verify their email before they can log in.</p>
            </div>
          </div>
          <Switch
            checked={form.requireEmailVerification}
            onCheckedChange={v => set('requireEmailVerification', v)}
          />
        </div>

        <Separator />

        {/* Password Policy */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Password Policy
          </div>
          <p className={HINT_CN}>Minimum requirements for user passwords.</p>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>Minimum Password Length</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={4}
              max={32}
              value={form.passwordMinLength}
              onChange={e => set('passwordMinLength', Math.max(4, Math.min(32, parseInt(e.target.value) || 8)))}
              className="w-24"
            />
            <span className={HINT_CN}>characters (4 – 32)</span>
          </div>
        </div>

        <Separator />

        {/* Session & Security */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Session &amp; Security
          </div>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>Session Duration (hours)</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={720}
              value={form.sessionDurationHours}
              onChange={e => set('sessionDurationHours', Math.max(1, Math.min(720, parseInt(e.target.value) || 24)))}
              className="w-24"
            />
            <span className={HINT_CN}>hours before users are logged out (1 – 720)</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className={LABEL_CN}>Max Login Attempts</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={20}
              value={form.maxLoginAttempts}
              onChange={e => set('maxLoginAttempts', Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
              className="w-24"
            />
            <span className={HINT_CN}>failed attempts before account is temporarily locked</span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Session duration and login attempt lockout are enforced by the server. Changes take effect for new sessions immediately.</span>
        </div>
      </AdminCard>
    </div>
  );
}
