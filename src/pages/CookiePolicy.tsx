import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderSpacer from "@/components/HeaderSpacer";
import { apiFetch } from '@/lib/apiFetch';
import { Loader2 } from 'lucide-react';

const PAGE_KEY = 'cookie-policy';

const DEFAULT_TITLE = 'Cookie Policy';
const DEFAULT_CONTENT = `What Are Cookies

Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.

How We Use Cookies

When you use and access The Journey Association platform, we may place cookie files in your web browser. We use cookies for the following purposes:
- To enable certain functions of the service
- To provide analytics
- To store your preferences
- To enable advertisements delivery, including behavioral advertising

Types of Cookies We Use

Essential Cookies — These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.

Analytics Cookies — These cookies collect information that is used to help us understand how our website is being used and how effective our marketing campaigns are.

Functionality Cookies — These cookies allow the website to remember choices you make and provide enhanced, more personal features.

Third-Party Cookies

In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.

Your Choices

If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer.

Contact Us

If you have any questions about this Cookie Policy, please contact us at cookies@thejourney-ma.org`;

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    if (line.startsWith('- ')) return <li key={i} className="text-gray-700 ml-4">{line.slice(2)}</li>;
    return <p key={i} className="text-gray-700">{line}</p>;
  });
}

const CookiePolicy = () => {
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

export default CookiePolicy;
