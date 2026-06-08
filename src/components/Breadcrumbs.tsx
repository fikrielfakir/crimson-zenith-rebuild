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

  return (
    <>
      {/* Breadcrumb Navigation Section - Separated from Navbar */}
      <section 
        className="w-full border-b border-gray-200/20"
        style={{ 
          backgroundColor: 'rgba(248, 249, 250, 0.85)',
          backdropFilter: 'blur(8px)',
          marginTop: '10rem',
          paddingTop: '12px',
          paddingBottom: '12px'
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-gray-600 text-xs md:text-sm">
              <li>
                <Link
                  to="/"
                  className="flex items-center hover:text-gray-900 transition-colors duration-200"
                >
                  <Home className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span className="font-medium">{t('breadcrumbs.home')}</span>
                </Link>
              </li>
              {items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <ChevronRight className={`w-3.5 h-3.5 md:w-4 md:h-4 mx-1 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                  {item.href && index < items.length - 1 ? (
                    <Link
                      to={item.href}
                      className="hover:text-gray-900 transition-colors duration-200 font-medium"
                    >
                      {item.tKey ? t(item.tKey) : item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-800 font-semibold">
                      {item.tKey ? t(item.tKey) : item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>
      
      {/* Page Title Section - Part of Page Content */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: 'hsl(var(--primary))' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
              {(() => {
                const last = items[items.length - 1];
                return last ? (last.tKey ? t(last.tKey) : last.label) : 'Page';
              })()}
            </h1>
            <div className="w-20 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumbs;