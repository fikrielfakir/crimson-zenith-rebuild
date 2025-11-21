import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Ticket,
  FileText,
  FileEdit,
  BarChart3,
  Settings,
  Server,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  icon: any;
  href?: string;
  children?: Array<{ label: string; href: string }>;
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  {
    label: 'Users',
    icon: Users,
    children: [
      { label: 'All Users', href: '/admin/users' },
      { label: 'Roles & Permissions', href: '/admin/users/roles' }
    ]
  },
  {
    label: 'Clubs',
    icon: Building,
    children: [
      { label: 'All Clubs', href: '/admin/clubs' },
      { label: 'Pending Approval', href: '/admin/clubs/pending' }
    ]
  },
  { label: 'Events', icon: Calendar, href: '/admin/events' },
  { label: 'Bookings', icon: Ticket, href: '/admin/bookings' },
  { label: 'Applications', icon: FileText, href: '/admin/applications' },
  {
    label: 'Content',
    icon: FileEdit,
    children: [
      { label: 'News/Blog', href: '/admin/news' },
      { label: 'Media Library', href: '/admin/media' }
    ]
  },
  {
    label: 'Customization',
    icon: Palette,
    children: [
      { label: 'Navbar Settings', href: '/admin/customization/navbar' },
      { label: 'Hero Section', href: '/admin/customization/hero' },
      { label: 'About President', href: '/admin/customization/about-president' },
      { label: 'Focus Areas', href: '/admin/customization/focus-areas' },
      { label: 'Clubs Section', href: '/admin/customization/clubs' },
      { label: 'Events Section', href: '/admin/customization/events' },
      { label: 'Impact Section', href: '/admin/customization/impact' },
      { label: 'Testimonials', href: '/admin/customization/testimonials' },
      { label: 'Partners', href: '/admin/customization/partners' }
    ]
  },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  {
    label: 'Settings',
    icon: Settings,
    children: [
      { label: 'Site Settings', href: '/admin/settings' },
      { label: 'Theme', href: '/admin/theme' },
      { label: 'Payments', href: '/admin/payments' },
      { label: 'Email', href: '/admin/email' },
      { label: 'Auth', href: '/admin/auth' },
      { label: 'Cookies', href: '/admin/cookies' }
    ]
  },
  { label: 'System', icon: Server, href: '/admin/system' }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('admin-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        toast({ title: 'Logged out successfully' });
        navigate('/admin/login');
      }
    } catch (error) {
      toast({ title: 'Error logging out', variant: 'destructive' });
    }
  };

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      return { label, href, isLast: index === paths.length - 1 };
    });
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link to="/admin" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            JA
          </div>
          {!sidebarCollapsed && <span className="font-semibold text-lg">Journey Admin</span>}
        </Link>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", !sidebarCollapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.label);
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                    onClick={() => toggleExpand(item.label)}
                  >
                    <Icon className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </>
                    )}
                  </Button>
                  {isExpanded && !sidebarCollapsed && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} to={child.href}>
                          <Button
                            variant={isActive(child.href) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => isMobile && setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.label} to={item.href || '#'}>
                <Button
                  variant={isActive(item.href || '') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  <Icon className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@journey.ma</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className={cn("w-full", sidebarCollapsed && "px-2")}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
          {!sidebarCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Breadcrumbs */}
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search... (Cmd+K)"
              className="pl-8 w-full"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
