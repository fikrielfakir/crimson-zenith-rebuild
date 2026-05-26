import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderSpacer from "@/components/HeaderSpacer";
import { apiFetch } from '@/lib/apiFetch';
import { Loader2 } from 'lucide-react';

const PAGE_KEY = 'privacy-policy';

const DEFAULT_TITLE = 'Privacy Policy';
const DEFAULT_CONTENT = `Information We Collect

We collect information you provide directly to us, such as when you create an account, join a club, register for events, or contact us for support.

- Name and email address
- Profile information and preferences
- Event participation and activity data
- Communication preferences

How We Use Your Information

We use the information we collect to provide, maintain, and improve our services, process transactions, and send you technical notices and support messages.

Contact Us

If you have questions about this Privacy Policy, please contact us at privacy@thejourney-ma.org`;

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    if (line.startsWith('- ')) return <li key={i} className="text-gray-700 ml-4">{line.slice(2)}</li>;
    return <p key={i} className="text-gray-700">{line}</p>;
  });
}

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';

  const { data: page, isLoading } = useQuery({
    queryKey: ['/api/cms/legal', PAGE_KEY],
    queryFn: async () => {
      const res = await apiFetch(`/api/cms/legal/${PAGE_KEY}`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: translations } = useQuery({
    queryKey: ['/api/translations/legal_page', PAGE_KEY],
    queryFn: async () => {
      const res = await apiFetch(`/api/translations/legal_page/${PAGE_KEY}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: lang !== 'en',
  });

  const getField = (field: string, fallback: string) => {
    if (lang !== 'en' && translations) {
      const t = translations.find((t: any) => t.field === field && t.language === lang);
      if (t?.value) return t.value;
    }
    return page?.[field] || fallback;
  };

  const title = getField('title', DEFAULT_TITLE);
  const content = getField('content', DEFAULT_CONTENT);
  const lastUpdated = page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      <HeaderSpacer />
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">Last updated: {lastUpdated}</p>
                <ul className="space-y-0 list-none p-0 m-0">{renderContent(content)}</ul>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
