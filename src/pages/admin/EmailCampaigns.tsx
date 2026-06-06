import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Mail, Server, Send, Eye, EyeOff, AlertTriangle, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AdminPageHeader,
  AdminCard,
  AdminSaveButton,
  AdminFormSkeleton,
  AdminPageError,
  LABEL_CN,
  HINT_CN,
} from '@/components/admin/AdminPageShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SmtpData {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
}

const smtpDefaults: SmtpData = {
  enabled: false,
  host: '',
  port: 587,
  secure: false,
  username: '',
  password: '',
  fromName: 'The Journey Association',
  fromEmail: '',
};

interface ComposeForm {
  to: string;
  subject: string;
  body: string;
}

function PasswordField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 font-mono text-sm"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function EmailCampaigns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [smtp, setSmtp] = useState<SmtpData>(smtpDefaults);
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [compose, setCompose] = useState<ComposeForm>({ to: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<SmtpData>({
    queryKey: ['admin-smtp-settings'],
    queryFn: async () => {
      const res = await apiFetch('/api/admin/smtp-settings');
      if (!res.ok) throw new Error('Failed to fetch SMTP settings');
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setSmtp({ ...smtpDefaults, ...data });
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: SmtpData) => {
      const res = await apiFetch('/api/admin/smtp-settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-smtp-settings'] });
      toast({ title: 'SMTP settings saved' });
    },
    onError: () => toast({ title: 'Save failed', variant: 'destructive' }),
  });

  const setS = <K extends keyof SmtpData>(key: K, value: SmtpData[K]) =>
    setSmtp(f => ({ ...f, [key]: value }));

  const handleTest = async () => {
    if (!testEmail) {
      toast({ title: 'Enter a test email address', variant: 'destructive' });
      return;
    }
    setTesting(true);
    try {
      const res = await apiFetch('/api/admin/smtp/test', {
        method: 'POST',
        body: JSON.stringify({ to: testEmail }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? 'Test failed');
      toast({ title: 'Test email sent!', description: `Check ${testEmail} for the test message.` });
    } catch (err: any) {
      toast({ title: 'Test failed', description: err.message, variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  const handleSend = async () => {
    if (!compose.to || !compose.subject || !compose.body) {
      toast({ title: 'Fill in all fields', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await apiFetch('/api/admin/smtp/send', {
        method: 'POST',
        body: JSON.stringify(compose),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? 'Send failed');
      toast({ title: 'Email sent!', description: `Message delivered to ${compose.to}` });
      setCompose({ to: '', subject: '', body: '' });
    } catch (err: any) {
      toast({ title: 'Send failed', description: err.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email"
        description="Configure outgoing email (SMTP) and send messages to members."
      />

      <Tabs defaultValue="smtp">
        <TabsList className="mb-5">
          <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
          <TabsTrigger value="compose">Compose &amp; Send</TabsTrigger>
        </TabsList>

        {/* ── SMTP Tab ── */}
        <TabsContent value="smtp">
          {isLoading ? (
            <AdminFormSkeleton rows={6} className="max-w-xl" />
          ) : isError ? (
            <AdminPageError
              title="Couldn't load SMTP settings"
              message="Email settings failed to load."
              onRetry={refetch}
              className="max-w-xl"
            />
          ) : (
            <div className="space-y-4 max-w-xl">
              <AdminCard
                title="SMTP Server"
                description="Outgoing mail server credentials. Used for all transactional and campaign emails."
                footer={
                  <AdminSaveButton
                    isPending={saveMutation.isPending}
                    onClick={() => saveMutation.mutate(smtp)}
                    label="Save SMTP Settings"
                    pendingLabel="Saving…"
                    icon={<Server className="h-4 w-4" />}
                  />
                }
              >
                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <p className={LABEL_CN}>Enable SMTP</p>
                    <p className={HINT_CN}>When off, no emails are sent from this server.</p>
                  </div>
                  <Switch checked={smtp.enabled} onCheckedChange={v => setS('enabled', v)} />
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={LABEL_CN}>SMTP Host</Label>
                    <Input
                      placeholder="smtp.gmail.com"
                      value={smtp.host}
                      onChange={e => setS('host', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={LABEL_CN}>Port</Label>
                    <Input
                      type="number"
                      placeholder="587"
                      value={smtp.port}
                      onChange={e => setS('port', parseInt(e.target.value) || 587)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className={LABEL_CN}>Use TLS / SSL (port 465)</p>
                    <p className={HINT_CN}>Enable for port 465. Leave off for STARTTLS (port 587).</p>
                  </div>
                  <Switch checked={smtp.secure} onCheckedChange={v => setS('secure', v)} />
                </div>

                <div className="space-y-1.5">
                  <Label className={LABEL_CN}>Username</Label>
                  <Input
                    placeholder="you@example.com"
                    value={smtp.username}
                    onChange={e => setS('username', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className={LABEL_CN}>Password / App Password</Label>
                  <PasswordField
                    value={smtp.password}
                    onChange={v => setS('password', v)}
                    placeholder="••••••••"
                  />
                  <p className={HINT_CN}>For Gmail, use an App Password — not your account password.</p>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className={LABEL_CN}>From Name</Label>
                    <Input
                      placeholder="The Journey Association"
                      value={smtp.fromName}
                      onChange={e => setS('fromName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={LABEL_CN}>From Email</Label>
                    <Input
                      type="email"
                      placeholder="noreply@thejourney-ma.com"
                      value={smtp.fromEmail}
                      onChange={e => setS('fromEmail', e.target.value)}
                    />
                  </div>
                </div>
              </AdminCard>

              {/* Test connection */}
              <AdminCard
                title="Test Connection"
                description="Send a test email to verify your SMTP configuration is working."
              >
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleTest}
                    disabled={testing || !smtp.enabled}
                    className="shrink-0"
                  >
                    {testing ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    ) : (
                      <FlaskConical className="h-4 w-4 mr-2" />
                    )}
                    {testing ? 'Sending…' : 'Send Test'}
                  </Button>
                </div>
                {!smtp.enabled && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Enable SMTP above and save before testing.
                  </div>
                )}
              </AdminCard>
            </div>
          )}
        </TabsContent>

        {/* ── Compose Tab ── */}
        <TabsContent value="compose">
          <AdminCard
            title="Compose Email"
            description="Send a one-off email to any address. SMTP must be enabled and saved first."
            className="max-w-xl"
            footer={
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSend}
                  disabled={sending || !smtp.enabled}
                  className="flex items-center gap-2"
                >
                  {sending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {sending ? 'Sending…' : 'Send Email'}
                </Button>
                {!smtp.enabled && (
                  <span className="text-xs text-muted-foreground">Enable SMTP first</span>
                )}
              </div>
            }
          >
            <div className="space-y-1.5">
              <Label className={LABEL_CN}>To</Label>
              <Input
                type="email"
                placeholder="recipient@example.com"
                value={compose.to}
                onChange={e => setCompose(f => ({ ...f, to: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={LABEL_CN}>Subject</Label>
              <Input
                placeholder="Email subject"
                value={compose.subject}
                onChange={e => setCompose(f => ({ ...f, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={LABEL_CN}>Message</Label>
              <Textarea
                placeholder="Write your message here…"
                value={compose.body}
                onChange={e => setCompose(f => ({ ...f, body: e.target.value }))}
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 mt-0.5" />
              <span>The message is sent as plain text. HTML support and bulk campaigns are coming soon.</span>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
