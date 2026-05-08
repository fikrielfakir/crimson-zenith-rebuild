import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiFetch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard, Banknote, Shield, Eye, EyeOff, Save,
  CheckCircle2, AlertCircle, Loader2, RefreshCw, ExternalLink, Info,
} from 'lucide-react';

interface PaymentSettingsData {
  cmi_enabled: boolean;
  cash_enabled: boolean;
  cmi_merchant_id: string;
  cmi_store_key: string;
  cmi_gateway_url: string;
  cmi_currency: string;
  cmi_mode: 'test' | 'live';
  cmi_ok_url: string;
  cmi_fail_url: string;
  cmi_callback_url: string;
  stripe_enabled: boolean;
  stripe_publishable_key: string;
  stripe_secret_key: string;
  stripe_mode: 'test' | 'live';
}

const defaultSettings: PaymentSettingsData = {
  cmi_enabled: false,
  cash_enabled: true,
  cmi_merchant_id: '',
  cmi_store_key: '',
  cmi_gateway_url: 'https://testpayment.cmi.co.ma/fim/est3Dgate',
  cmi_currency: '504',
  cmi_mode: 'test',
  cmi_ok_url: '',
  cmi_fail_url: '',
  cmi_callback_url: '',
  stripe_enabled: false,
  stripe_publishable_key: '',
  stripe_secret_key: '',
  stripe_mode: 'test',
};

function SecretInput({
  id, label, value, onChange, placeholder, hint,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; placeholder?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-semibold text-sm">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10 font-mono text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function PaymentSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PaymentSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/payment-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load payment settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const set = <K extends keyof PaymentSettingsData>(key: K, value: PaymentSettingsData[K]) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/payment-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings({ ...defaultSettings, ...data });
        toast({ title: 'Saved', description: 'Payment settings updated successfully.' });
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiFetch('/api/admin/payment-settings/test', { method: 'POST' });
      const data = await res.json();
      setTestResult(data.checks || {});
    } catch {
      toast({ title: 'Test failed', variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4B26A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111f50]">Payment Settings</h1>
          <p className="text-muted-foreground mt-1">Configure payment gateways and methods for bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTest} disabled={testing}>
            {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Test Connections
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#111f50] hover:bg-[#1a2d5a]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4 space-y-2">
            <p className="font-semibold text-blue-800 text-sm mb-2">Connection Test Results:</p>
            {Object.entries(testResult).map(([key, val]: [string, any]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {val.configured
                  ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                  : <AlertCircle className="w-4 h-4 text-red-500" />
                }
                <span className="uppercase font-semibold text-blue-800">{key}:</span>
                <span className={val.configured ? 'text-green-700' : 'text-red-600'}>
                  {val.configured ? 'Configured' : 'Missing credentials'}
                </span>
                <Badge variant="outline" className="text-xs">{val.mode}</Badge>
              </div>
            ))}
            {Object.keys(testResult).length === 0 && (
              <p className="text-sm text-muted-foreground">No payment gateways are currently enabled.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cash Payment */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Cash Payment</CardTitle>
                <CardDescription>Accept payments on-site; requires manual admin approval</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.cash_enabled ? 'default' : 'secondary'} className={settings.cash_enabled ? 'bg-green-500' : ''}>
                {settings.cash_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch
                checked={settings.cash_enabled}
                onCheckedChange={v => set('cash_enabled', v)}
              />
            </div>
          </div>
        </CardHeader>
        {settings.cash_enabled && (
          <CardContent>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Cash bookings will have <strong>pending</strong> status until manually confirmed by an admin in the Bookings panel.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* CMI Payment */}
      <Card className={settings.cmi_enabled ? 'border-[#111f50]/30 shadow-md' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111f50]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#111f50]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">CMI Payment Gateway</CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">Centre Monétique Interbancaire</Badge>
                </div>
                <CardDescription>Moroccan bank card payment via CMI 3D Secure hosted page</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.cmi_enabled ? 'default' : 'secondary'} className={settings.cmi_enabled ? 'bg-[#111f50]' : ''}>
                {settings.cmi_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch
                checked={settings.cmi_enabled}
                onCheckedChange={v => set('cmi_enabled', v)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Mode selector */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Environment:</span>
            <div className="flex gap-2">
              {(['test', 'live'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    set('cmi_mode', m);
                    set('cmi_gateway_url', m === 'test'
                      ? 'https://testpayment.cmi.co.ma/fim/est3Dgate'
                      : 'https://payment.cmi.co.ma/fim/est3Dgate');
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    settings.cmi_mode === m
                      ? m === 'live'
                        ? 'bg-green-500 text-white shadow'
                        : 'bg-blue-500 text-white shadow'
                      : 'bg-white border text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {m === 'test' ? 'Test Mode' : 'Live Mode'}
                </button>
              ))}
            </div>
            {settings.cmi_mode === 'live' && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Real transactions active
              </span>
            )}
          </div>

          <Separator />

          {/* Credentials */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Merchant Credentials
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cmi_merchant_id" className="font-semibold text-sm">Merchant ID (ClientID)</Label>
                <Input
                  id="cmi_merchant_id"
                  value={settings.cmi_merchant_id}
                  onChange={e => set('cmi_merchant_id', e.target.value)}
                  placeholder="e.g. 123456789"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">Provided by CMI / your bank acquirer</p>
              </div>
              <SecretInput
                id="cmi_store_key"
                label="Store Key (StoreKey)"
                value={settings.cmi_store_key}
                onChange={v => set('cmi_store_key', v)}
                placeholder="Your secret CMI store key"
                hint="Used to generate HMAC-SHA512 signatures. Keep this confidential."
              />
            </div>
          </div>

          <Separator />

          {/* Gateway & Currency */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Gateway Configuration</h3>
            <div className="space-y-2">
              <Label htmlFor="cmi_gateway_url" className="font-semibold text-sm">Gateway URL</Label>
              <div className="flex gap-2">
                <Input
                  id="cmi_gateway_url"
                  value={settings.cmi_gateway_url}
                  onChange={e => set('cmi_gateway_url', e.target.value)}
                  className="font-mono text-sm"
                />
                <Button
                  type="button" variant="outline" size="icon"
                  onClick={() => window.open(settings.cmi_gateway_url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => set('cmi_gateway_url', 'https://testpayment.cmi.co.ma/fim/est3Dgate')}
                  className="text-xs text-blue-600 hover:underline">Use Test URL</button>
                <span className="text-xs text-gray-400">|</span>
                <button type="button" onClick={() => set('cmi_gateway_url', 'https://payment.cmi.co.ma/fim/est3Dgate')}
                  className="text-xs text-green-600 hover:underline">Use Live URL</button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cmi_currency" className="font-semibold text-sm">Currency Code</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="cmi_currency"
                  value={settings.cmi_currency}
                  onChange={e => set('cmi_currency', e.target.value)}
                  placeholder="504"
                  className="w-32 font-mono"
                />
                <span className="text-sm text-muted-foreground">504 = MAD (Moroccan Dirham)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Redirect URLs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Redirect & Callback URLs</h3>
            <p className="text-xs text-muted-foreground">
              Leave blank to use auto-generated URLs. Set explicit URLs if your app is deployed to a custom domain.
            </p>
            {[
              { key: 'cmi_ok_url' as const, label: 'Success URL (okUrl)', placeholder: 'https://yoursite.com/book/payment/success' },
              { key: 'cmi_fail_url' as const, label: 'Failure URL (failUrl)', placeholder: 'https://yoursite.com/book/payment/fail' },
              { key: 'cmi_callback_url' as const, label: 'Server Callback URL', placeholder: 'https://yourapi.com/api/payments/cmi/callback' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="font-semibold text-sm">{label}</Label>
                <Input
                  id={key}
                  value={(settings as any)[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>

          {settings.cmi_enabled && (!settings.cmi_merchant_id || !settings.cmi_store_key) && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">
                CMI is enabled but <strong>Merchant ID</strong> and/or <strong>Store Key</strong> are missing.
                Payments will fail until both credentials are set.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe (future) */}
      <Card className="opacity-75">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">Stripe</CardTitle>
                <CardDescription>International card payments via Stripe</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={settings.stripe_enabled ? 'default' : 'secondary'} className={settings.stripe_enabled ? 'bg-purple-500' : ''}>
                {settings.stripe_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch
                checked={settings.stripe_enabled}
                onCheckedChange={v => set('stripe_enabled', v)}
              />
            </div>
          </div>
        </CardHeader>
        {settings.stripe_enabled && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Mode:</span>
              <div className="flex gap-2">
                {(['test', 'live'] as const).map(m => (
                  <button key={m} type="button" onClick={() => set('stripe_mode', m)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      settings.stripe_mode === m ? 'bg-purple-500 text-white shadow' : 'bg-white border text-gray-500'
                    }`}>{m === 'test' ? 'Test Mode' : 'Live Mode'}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe_pub" className="font-semibold text-sm">Publishable Key</Label>
              <Input id="stripe_pub" value={settings.stripe_publishable_key}
                onChange={e => set('stripe_publishable_key', e.target.value)}
                placeholder="pk_test_..." className="font-mono text-sm" />
            </div>
            <SecretInput id="stripe_secret" label="Secret Key"
              value={settings.stripe_secret_key}
              onChange={v => set('stripe_secret_key', v)}
              placeholder="sk_test_..."
              hint="Never expose your secret key in client-side code." />
          </CardContent>
        )}
      </Card>

      {/* Save button at bottom */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} size="lg" className="bg-[#111f50] hover:bg-[#1a2d5a] px-8">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Payment Settings
        </Button>
      </div>
    </div>
  );
}
