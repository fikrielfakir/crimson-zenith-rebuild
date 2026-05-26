import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from '@/lib/apiFetch';
import { Loader2 } from 'lucide-react';

const PAGE_KEY = 'terms-of-service';

const DEFAULT_TITLE = 'Terms of Service';
const DEFAULT_CONTENT = `Acceptance of Terms

By accessing and using The Journey Association platform, you accept and agree to be bound by the terms and provisions of this agreement.

Use License

Permission is granted to temporarily use The Journey Association platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
- Modify or copy the materials
- Use the materials for any commercial purpose
- Transfer the materials to another person

Disclaimer

The materials on The Journey Association platform are provided on an 'as is' basis. The Journey Association makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.

Limitations

In no event shall The Journey Association or its suppliers be liable for any damages arising out of the use or inability to use the materials on the platform.

Contact Us

If you have questions about these Terms, please contact us at legal@thejourney-ma.org`;

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    if (line.startsWith('- ')) return <li key={i} className="text-gray-700 ml-4">{line.slice(2)}</li>;
    return <p key={i} className="text-gray-700">{line}</p>;
  });
}

const TermsOfService = () => {
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
      <div className="container mx-auto px-4 py-20">
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

export default TermsOfService;
