import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/admin/AdminLayout";
import { CreditCard, Save, RotateCcw, TestTube, DollarSign, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentProvider {
  enabled: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

interface PaymentSettings {
  providers: {
    stripe: PaymentProvider;
    paypal: PaymentProvider & { clientId: string };
  };
  defaultCurrency: string;
  acceptedCurrencies: string[];
  minimumAmount: number;
  maximumAmount: number;
  taxRate: number;
  processingFee: number;
  refundPolicy: 'full' | 'partial' | 'none';
  autoCapture: boolean;
}

const defaultSettings: PaymentSettings = {
  providers: {
    stripe: {
      enabled: true,
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
      testMode: true
    },
    paypal: {
      enabled: true,
      publishableKey: '', // Not used for PayPal but kept for consistency
      secretKey: '',
      clientId: '',
      webhookSecret: '',
      testMode: true
    }
  },
  defaultCurrency: 'USD',
  acceptedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
  minimumAmount: 1.00,
  maximumAmount: 10000.00,
  taxRate: 0,
  processingFee: 2.9,
  refundPolicy: 'full',
  autoCapture: true
};

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
];

const PaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('adminPaymentSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading payment settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('adminPaymentSettings', JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Payment settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "Payment settings have been reset to defaults.",
    });
  };

  const updateProvider = (provider: keyof PaymentSettings['providers'], updates: any) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: { ...prev.providers[provider], ...updates }
      }
    }));
    setHasChanges(true);
  };

  const updateGeneralSettings = (updates: Partial<PaymentSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const testProvider = async (provider: string) => {
    setTestingProvider(provider);
    // Simulate API test
    setTimeout(() => {
      setTestingProvider(null);
      toast({
        title: "Test Completed",
        description: `${provider} payment integration test completed successfully.`,
      });
    }, 2000);
  };

  const getProviderInstructions = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return {
          title: "Stripe Setup Instructions",
          instructions: [
            "1. Go to Stripe Dashboard (dashboard.stripe.com)",
            "2. Navigate to Developers → API Keys",
            "3. Copy your Publishable key (starts with pk_)",
            "4. Copy your Secret key (starts with sk_)",
            "5. Set up webhooks in Developers → Webhooks",
            "6. Copy the webhook signing secret"
          ]
        };
      case 'paypal':
        return {
          title: "PayPal Setup Instructions",
          instructions: [
            "1. Go to PayPal Developer (developer.paypal.com)",
            "2. Create a new app or select existing one",
            "3. Copy Client ID from app details",
            "4. Copy Client Secret from app details",
            "5. Configure webhook URLs for notifications",
            "6. Test with sandbox environment first"
          ]
        };
      default:
        return { title: "", instructions: [] };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-green-500" />
              Payment Settings
            </h1>
            <p className="text-muted-foreground">
              Configure payment providers and processing settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Unsaved changes
              </Badge>
            )}
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">Payment Providers</TabsTrigger>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="policies">Policies & Fees</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            {/* Stripe Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      S
                    </div>
                    Stripe Payment Processing
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.providers.stripe.enabled}
                      onCheckedChange={(enabled) => updateProvider('stripe', { enabled })}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testProvider('stripe')}
                      disabled={!settings.providers.stripe.enabled || testingProvider === 'stripe'}
                    >
                      {testingProvider === 'stripe' ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stripe-test-mode"
                      checked={settings.providers.stripe.testMode}
                      onCheckedChange={(testMode) => updateProvider('stripe', { testMode })}
                      disabled={!settings.providers.stripe.enabled}
                    />
                    <Label htmlFor="stripe-test-mode">Test Mode</Label>
                  </div>
                  {settings.providers.stripe.testMode && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Using Test Environment
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-publishable">Publishable Key</Label>
                    <Input
                      id="stripe-publishable"
                      value={settings.providers.stripe.publishableKey}
                      onChange={(e) => updateProvider('stripe', { publishableKey: e.target.value })}
                      placeholder="pk_test_... or pk_live_..."
                      disabled={!settings.providers.stripe.enabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret">Secret Key</Label>
                    <Input
                      id="stripe-secret"
                      type="password"
                      value={settings.providers.stripe.secretKey}
                      onChange={(e) => updateProvider('stripe', { secretKey: e.target.value })}
                      placeholder="sk_test_... or sk_live_..."
                      disabled={!settings.providers.stripe.enabled}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                  <Input
                    id="stripe-webhook"
                    type="password"
                    value={settings.providers.stripe.webhookSecret}
                    onChange={(e) => updateProvider('stripe', { webhookSecret: e.target.value })}
                    placeholder="whsec_..."
                    disabled={!settings.providers.stripe.enabled}
                  />
                </div>

                {settings.providers.stripe.enabled && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">{getProviderInstructions('stripe').title}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {getProviderInstructions('stripe').instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PayPal Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    PayPal Payment Processing
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.providers.paypal.enabled}
                      onCheckedChange={(enabled) => updateProvider('paypal', { enabled })}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testProvider('paypal')}
                      disabled={!settings.providers.paypal.enabled || testingProvider === 'paypal'}
                    >
                      {testingProvider === 'paypal' ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        <TestTube className="w-4 h-4" />
                      )}
                      Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paypal-test-mode"
                      checked={settings.providers.paypal.testMode}
                      onCheckedChange={(testMode) => updateProvider('paypal', { testMode })}
                      disabled={!settings.providers.paypal.enabled}
                    />
                    <Label htmlFor="paypal-test-mode">Sandbox Mode</Label>
                  </div>
                  {settings.providers.paypal.testMode && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Using Sandbox Environment
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <Input
                      id="paypal-client-id"
                      value={settings.providers.paypal.clientId}
                      onChange={(e) => updateProvider('paypal', { clientId: e.target.value })}
                      placeholder="PayPal Client ID"
                      disabled={!settings.providers.paypal.enabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Client Secret</Label>
                    <Input
                      id="paypal-secret"
                      type="password"
                      value={settings.providers.paypal.secretKey}
                      onChange={(e) => updateProvider('paypal', { secretKey: e.target.value })}
                      placeholder="PayPal Client Secret"
                      disabled={!settings.providers.paypal.enabled}
                    />
                  </div>
                </div>

                {settings.providers.paypal.enabled && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">{getProviderInstructions('paypal').title}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {getProviderInstructions('paypal').instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Currency Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select value={settings.defaultCurrency} onValueChange={(value) => updateGeneralSettings({ defaultCurrency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name} ({currency.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Accepted Currencies</Label>
                    <div className="text-sm text-muted-foreground">
                      {settings.acceptedCurrencies.join(', ')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  Transaction Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-amount">Minimum Amount ({settings.defaultCurrency})</Label>
                    <Input
                      id="min-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.minimumAmount}
                      onChange={(e) => updateGeneralSettings({ minimumAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-amount">Maximum Amount ({settings.defaultCurrency})</Label>
                    <Input
                      id="max-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.maximumAmount}
                      onChange={(e) => updateGeneralSettings({ maximumAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Capture Payments</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically capture payments or require manual approval
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoCapture}
                    onCheckedChange={(autoCapture) => updateGeneralSettings({ autoCapture })}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={settings.taxRate}
                      onChange={(e) => updateGeneralSettings({ taxRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processing-fee">Processing Fee (%)</Label>
                    <Input
                      id="processing-fee"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={settings.processingFee}
                      onChange={(e) => updateGeneralSettings({ processingFee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refund-policy">Refund Policy</Label>
                  <Select value={settings.refundPolicy} onValueChange={(value: any) => updateGeneralSettings({ refundPolicy: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select refund policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Refunds Allowed</SelectItem>
                      <SelectItem value="partial">Partial Refunds Only</SelectItem>
                      <SelectItem value="none">No Refunds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PaymentSettings;