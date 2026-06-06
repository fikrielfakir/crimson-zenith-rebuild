import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TranslateDialog } from '@/components/admin/TranslateDialog';
import { Save, Loader2, FileText, Shield, Cookie } from 'lucide-react';

const PAGES = [
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    icon: Shield,
    route: '/privacy-policy',
    defaultTitle: 'Privacy Policy',
    defaultContent: `Information We Collect\n\nWe collect information you provide directly to us, such as when you create an account, join a club, register for events, or contact us for support.\n\n- Name and email address\n- Profile information and preferences\n- Event participation and activity data\n- Communication preferences\n\nHow We Use Your Information\n\nWe use the information we collect to provide, maintain, and improve our services, process transactions, and send you technical notices and support messages.\n\nContact Us\n\nIf you have questions about this Privacy Policy, please contact us at privacy@thejourney-ma.org`,
  },
  {
    key: 'terms-of-service',
    label: 'Terms of Service',
    icon: FileText,
    route: '/terms-of-service',
    defaultTitle: 'Terms of Service',
    defaultContent: `Acceptance of Terms\n\nBy accessing and using The Journey Association platform, you accept and agree to be bound by the terms and provisions of this agreement.\n\nUse License\n\nPermission is granted to temporarily use The Journey Association platform for personal, non-commercial transitory viewing only.\n\nDisclaimer\n\nThe materials on The Journey Association platform are provided on an 'as is' basis. The Journey Association makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.\n\nContact Us\n\nIf you have questions about these Terms, please contact us at legal@thejourney-ma.org`,
  },
  {
    key: 'cookie-policy',
    label: 'Cookie Policy',
    icon: Cookie,
    route: '/cookie-policy',
    defaultTitle: 'Cookie Policy',
    defaultContent: `What Are Cookies\n\nCookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier.\n\nHow We Use Cookies\n\nWhen you use and access The Journey Association platform, we may place cookie files in your web browser. We use cookies to enable certain functions, provide analytics, store your preferences, and enable advertisements delivery.\n\nTypes of Cookies We Use\n\nEssential Cookies — required for the website to function properly.\nAnalytics Cookies — help us understand how our website is being used.\nFunctionality Cookies — allow the website to remember choices you make.\n\nContact Us\n\nIf you have questions about this Cookie Policy, please contact us at cookies@thejourney-ma.org`,
  },
];

interface LegalPageData {
  id?: number;
  pageKey: string;
  title: string;
  content: string;
  updatedAt?: string;
}

function LegalPageEditor({ pageKey, label, defaultTitle, defaultContent }: { pageKey: string; label: string; defaultTitle: string; defaultContent: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data, isLoading } = useQuery<LegalPageData | null>({
    queryKey: ['/api/cms/legal', pageKey],
    queryFn: async () => {
      const res = await apiFetch(`/api/cms/legal/${pageKey}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title || defaultTitle);
      setContent(data.content || defaultContent);
    } else if (!isLoading) {
      setTitle(defaultTitle);
      setContent(defaultContent);
    }
  }, [data, isLoading, defaultTitle, defaultContent]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/admin/cms/legal/${pageKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/legal', pageKey] });
      toast({ title: 'Saved', description: `${label} has been updated.` });
    },
    onError: (e: any) => {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString()}` : 'Not yet saved — using defaults'}
        </p>
        <div className="flex items-center gap-2">
          <TranslateDialog
            entityType="legal_page"
            entityId={pageKey}
            entityLabel={label}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'content', label: 'Content', multiline: true },
            ]}
            sourceValues={{ title, content }}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ['/api/cms/legal', pageKey] })}
          />
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save</>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`title-${pageKey}`}>Page Title</Label>
        <Input
          id={`title-${pageKey}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`content-${pageKey}`}>
          Content
          <span className="ml-2 text-xs text-muted-foreground font-normal">Use plain paragraphs separated by blank lines. Start a section with its heading on its own line.</span>
        </Label>
        <Textarea
          id={`content-${pageKey}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={22}
          className="font-mono text-sm leading-relaxed resize-y"
          placeholder="Enter page content…"
        />
      </div>

      <div className="rounded-lg border bg-muted/40 p-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">Preview (English)</p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function LegalPagesSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Legal Pages</h1>
        <p className="text-muted-foreground mt-1">
          Edit the content of your Privacy Policy, Terms of Service, and Cookie Policy pages. Use the translate button to add Arabic, French, and Spanish versions.
        </p>
      </div>

      <Tabs defaultValue="privacy-policy">
        <TabsList className="mb-6">
          {PAGES.map((p) => {
            const Icon = p.icon;
            return (
              <TabsTrigger key={p.key} value={p.key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {p.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PAGES.map((p) => (
          <TabsContent key={p.key} value={p.key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <p.icon className="h-5 w-5 text-primary" />
                  {p.label}
                </CardTitle>
                <CardDescription>
                  Visible at <a href={p.route} target="_blank" rel="noreferrer" className="underline">{p.route}</a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LegalPageEditor
                  pageKey={p.key}
                  label={p.label}
                  defaultTitle={p.defaultTitle}
                  defaultContent={p.defaultContent}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
