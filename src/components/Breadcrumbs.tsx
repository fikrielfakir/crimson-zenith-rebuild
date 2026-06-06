import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
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
      >
        <div className="container mx-auto px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-gray-600 text-xs md:text-sm">
              <li>
                <Link
                  to="/"
                  className="flex items-center hover:text-gray-900 transition-colors duration-200"
                >
                  <Home className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              {items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 mx-1 text-gray-400" />
                  {item.href && index < items.length - 1 ? (
                    <Link
                      to={item.href}
                      className="hover:text-gray-900 transition-colors duration-200 font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-800 font-semibold">{item.label}</span>
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
      >
        <div className="container mx-auto">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
              {items[items.length - 1]?.label || 'Page'}
            </h1>
            <div className="w-20 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Breadcrumbs;