import { ReactNode, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Menu,
  LogOut,
  Home,
  TrendingUp,
  UserCog,
  Image,
  Mail,
  Monitor
} from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Clubs', href: '/admin/clubs', icon: Users },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'News', href: '/admin/news', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: UserCog },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Email', href: '/admin/email', icon: Mail },
    { name: 'Monitor', href: '/admin/monitor', icon: Monitor },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full w-64 flex-col bg-card border-r", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-secondary font-medium"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>
      <div className="border-t p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="flex h-16 items-center border-b bg-background px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground">
            {navigation.find(item => item.href === location.pathname)?.name || 'Admin'}
          </h2>
        </div>
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;