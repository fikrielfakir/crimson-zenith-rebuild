import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BreadcrumbItem {
  label: string;
  tKey?: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const lastItem = items[items.length - 1];
  const pageTitle = lastItem
    ? lastItem.tKey
      ? t(lastItem.tKey)
      : lastItem.label
    : 'Page';

  return (
    <section
      className="py-12 px-6"
      style={{
        backgroundColor: 'hsl(var(--primary))',
        marginTop: '10rem',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto">
        {/* Breadcrumb trail */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1 text-white/70 text-xs md:text-sm flex-wrap">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-white transition-colors duration-200"
              >
                <Home className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                <span className="font-medium">{t('breadcrumbs.home')}</span>
              </Link>
            </li>
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-1">
                <ChevronRight
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-white/40 ${isRTL ? 'rotate-180' : ''}`}
                />
                {item.href && index < items.length - 1 ? (
                  <Link
                    to={item.href}
                    className="hover:text-white transition-colors duration-200 font-medium"
                  >
                    {item.tKey ? t(item.tKey) : item.label}
                  </Link>
                ) : (
                  <span className="text-white font-semibold">
                    {item.tKey ? t(item.tKey) : item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Page title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-3">
          {pageTitle}
        </h1>
        <div className="w-20 h-1 bg-white/30 rounded-full" />
      </div>
    </section>
  );
};

export default Breadcrumbs;
