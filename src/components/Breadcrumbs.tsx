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
    <section 
      className="py-16 px-6"
      style={{ backgroundColor: '#112250' }}
    >
      <div className="container mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-white/70 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center hover:text-white transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-2 text-white/40" />
                {item.href && index < items.length - 1 ? (
                  <Link
                    to={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        
        {/* Page Title */}
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            {items[items.length - 1]?.label || 'Page'}
          </h1>
          <div className="w-20 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumbs;