import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Palette,
  MapPin,
  Images,
  Inbox,
  Languages,
  Globe,
  Check,
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

const ADMIN_LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'English', dir: 'ltr' as const },
  { code: 'fr', flag: '🇫🇷', label: 'Français', dir: 'ltr' as const },
  { code: 'ar', flag: '🇲🇦', label: 'العربية', dir: 'rtl' as const },
  { code: 'es', flag: '🇪🇸', label: 'Español', dir: 'ltr' as const },
];

interface NavigationItem {
  labelKey: string;
  icon: any;
  href?: string;
  children?: Array<{ labelKey: string; href: string }>;
}

const navigationItems: NavigationItem[] = [
  { labelKey: 'admin.nav.dashboard', icon: LayoutDashboard, href: '/admin' },
  {
    labelKey: 'admin.nav.users',
    icon: Users,
    children: [
      { labelKey: 'admin.nav.allUsers', href: '/admin/users' },
      { labelKey: 'admin.nav.rolesPermissions', href: '/admin/users/roles' },
    ],
  },
  {
    labelKey: 'admin.nav.clubs',
    icon: Building,
    children: [
      { labelKey: 'admin.nav.allClubs', href: '/admin/clubs' },
      { labelKey: 'admin.nav.pendingApproval', href: '/admin/clubs/pending' },
    ],
  },
  { labelKey: 'admin.nav.events', icon: Calendar, href: '/admin/events' },
  { labelKey: 'admin.nav.cities', icon: MapPin, href: '/admin/cities' },
  { labelKey: 'admin.nav.bookings', icon: Ticket, href: '/admin/bookings' },
  { labelKey: 'admin.nav.applications', icon: FileText, href: '/admin/applications' },
  { labelKey: 'admin.nav.contactInbox', icon: Inbox, href: '/admin/contact-submissions' },
  {
    labelKey: 'admin.nav.content',
    icon: FileEdit,
    children: [
      { labelKey: 'admin.nav.newsBlog', href: '/admin/news' },
      { labelKey: 'admin.nav.mediaLibrary', href: '/admin/media' },
      { labelKey: 'admin.nav.gallery', href: '/admin/gallery' },
    ],
  },
  {
    labelKey: 'admin.nav.customization',
    icon: Palette,
    children: [
      { labelKey: 'admin.nav.navbarSettings', href: '/admin/customization/navbar' },
      { labelKey: 'admin.nav.heroSection', href: '/admin/customization/hero' },
      { labelKey: 'admin.nav.aboutPresident', href: '/admin/customization/about-president' },
      { labelKey: 'admin.nav.focusAreas', href: '/admin/customization/focus-areas' },
      { labelKey: 'admin.nav.clubsShowcase', href: '/admin/customization/clubs' },
      { labelKey: 'admin.nav.eventsShowcase', href: '/admin/customization/events' },
      { labelKey: 'admin.nav.impactSection', href: '/admin/customization/impact' },
      { labelKey: 'admin.nav.teamMembers', href: '/admin/customization/team' },
      { labelKey: 'admin.nav.testimonials', href: '/admin/customization/testimonials' },
      { labelKey: 'admin.nav.partners', href: '/admin/customization/partners' },
      { labelKey: 'admin.nav.pageHeroes', href: '/admin/customization/page-heroes' },
    ],
  },
  {
    labelKey: 'admin.nav.talents',
    icon: Users,
    children: [
      { labelKey: 'admin.nav.volunteerOpportunities', href: '/admin/talents/opportunities' },
      { labelKey: 'admin.nav.volunteerPosts', href: '/admin/talents/posts' },
      { labelKey: 'admin.nav.experts', href: '/admin/talents/experts' },
      { labelKey: 'admin.nav.workOffers', href: '/admin/talents/work-offers' },
    ],
  },
  { labelKey: 'admin.nav.translations', icon: Languages, href: '/admin/translations' },
  { labelKey: 'admin.nav.projects', icon: Building, href: '/admin/projects' },
  { labelKey: 'admin.nav.analytics', icon: BarChart3, href: '/admin/analytics' },
  {
    labelKey: 'admin.nav.settings',
    icon: Settings,
    children: [
      { labelKey: 'admin.nav.siteSettings', href: '/admin/settings' },
      { labelKey: 'admin.nav.theme', href: '/admin/theme' },
      { labelKey: 'admin.nav.payments', href: '/admin/payments' },
      { labelKey: 'admin.nav.email', href: '/admin/email' },
      { labelKey: 'admin.nav.auth', href: '/admin/auth' },
      { labelKey: 'admin.nav.cookies', href: '/admin/cookies' },
    ],
  },
  { labelKey: 'admin.nav.system', icon: Server, href: '/admin/system' },
];

interface SidebarContentProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  expandedItems: string[];
  toggleExpand: (labelKey: string) => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
  onLogout: () => void;
  currentPath: string;
  t: (key: string) => string;
}

function SidebarContent({
  sidebarCollapsed,
  setSidebarCollapsed,
  expandedItems,
  toggleExpand,
  isMobile = false,
  onMobileClose,
  onLogout,
  currentPath,
  t,
}: SidebarContentProps) {
  const isActive = (href: string) => currentPath === href;

  return (
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
            const isExpanded = expandedItems.includes(item.labelKey);
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div key={item.labelKey}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                    onClick={() => toggleExpand(item.labelKey)}
                  >
                    <Icon className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{t(item.labelKey)}</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </>
                    )}
                  </Button>
                  {isExpanded && !sidebarCollapsed && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children!.map((child) => (
                        <Link key={child.href} to={child.href}>
                          <Button
                            variant={isActive(child.href) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => isMobile && onMobileClose?.()}
                          >
                            {t(child.labelKey)}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.labelKey} to={item.href || '#'}>
                <Button
                  variant={isActive(item.href || '') ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  onClick={() => isMobile && onMobileClose?.()}
                >
                  <Icon className={cn("h-5 w-5", !sidebarCollapsed && "mr-3")} />
                  {!sidebarCollapsed && <span>{t(item.labelKey)}</span>}
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
          onClick={onLogout}
        >
          <LogOut className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
          {!sidebarCollapsed && <span>{t('admin.nav.logout')}</span>}
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

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

  const [adminLang, setAdminLang] = useState<string>(() => {
    return localStorage.getItem('tja_admin_language') || 'en';
  });

  const currentAdminLang = ADMIN_LANGUAGES.find((l) => l.code === adminLang) ?? ADMIN_LANGUAGES[0];

  useEffect(() => {
    // Capture the public-site language BEFORE i18n.changeLanguage overwrites tja_language
    const publicLangBackup = localStorage.getItem('tja_language') || 'en';

    localStorage.setItem('tja_admin_language', adminLang);
    const isRTL = adminLang === 'ar';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', adminLang);
    i18n.changeLanguage(adminLang);

    // i18n.changeLanguage() writes adminLang into tja_language — immediately restore
    // the public value so a hard reload always sees the correct public language.
    localStorage.setItem('tja_language', publicLangBackup);

    return () => {
      const publicLang = localStorage.getItem('tja_language') || publicLangBackup;
      const publicRTL = publicLang === 'ar';
      document.documentElement.setAttribute('dir', publicRTL ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', publicLang);
      i18n.changeLanguage(publicLang);
    };
  }, [adminLang, i18n]);

  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleExpand = (labelKey: string) => {
    setExpandedItems(prev =>
      prev.includes(labelKey) ? prev.filter(item => item !== labelKey) : [...prev, labelKey]
    );
  };

  const handleLogout = async () => {
    try {
      const { apiFetch } = await import('@/lib/apiFetch');
      const { clearAdminToken } = await import('@/lib/tokenStore');
      await apiFetch('/api/admin/logout', { method: 'POST' }).catch(() => null);
      clearAdminToken();
      toast({ title: t('admin.nav.logout') });
      navigate('/admin/login');
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

  const breadcrumbs = generateBreadcrumbs();

  const sharedSidebarProps = {
    sidebarCollapsed,
    setSidebarCollapsed,
    expandedItems,
    toggleExpand,
    onLogout: handleLogout,
    currentPath: location.pathname,
    t,
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      dir={currentAdminLang.dir}
      lang={adminLang}
    >
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent {...sharedSidebarProps} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            {...sharedSidebarProps}
            isMobile
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

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
              placeholder={t('admin.header.searchPlaceholder')}
              className="pl-8 w-full"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {/* Admin Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 px-2 text-xs font-medium"
                title={t('admin.header.adminInterfaceLanguage')}
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{currentAdminLang.flag}</span>
                <span className="hidden sm:inline uppercase">{currentAdminLang.code}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] z-[200]">
              <DropdownMenuLabel className="text-xs text-muted-foreground pb-1">
                {t('admin.header.adminInterfaceLanguage')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ADMIN_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setAdminLang(lang.code)}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {lang.dir === 'rtl' && (
                      <span className="text-[10px] text-muted-foreground border rounded px-1">RTL</span>
                    )}
                  </span>
                  {adminLang === lang.code && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuLabel>{t('admin.header.adminAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {t('admin.header.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                {t('admin.header.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('admin.header.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
