export type AdminRole = 'admin' | 'moderator' | 'club_manager' | 'event_organizer';

export const STAFF_ROLES: AdminRole[] = ['admin', 'moderator', 'club_manager', 'event_organizer'];

export const ADMIN_ROLE_META: Record<AdminRole, {
  label: string;
  description: string;
  colorClass: string;
}> = {
  admin: {
    label: 'Super Admin',
    description: 'Full system access — users, settings, everything',
    colorClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  moderator: {
    label: 'Moderator',
    description: 'Content, clubs, events, analytics & CMS',
    colorClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  club_manager: {
    label: 'Club Manager',
    description: 'Clubs, events, bookings & applications',
    colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  event_organizer: {
    label: 'Event Organizer',
    description: 'Events & bookings only',
    colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
};

/**
 * Which roles can see each sidebar navigation section.
 * Key = NavigationItem.labelKey from AdminLayout.
 * Omitted keys → visible to all authenticated staff.
 */
export const NAV_ROLES: Record<string, AdminRole[]> = {
  'admin.nav.dashboard':     ['admin', 'moderator', 'club_manager', 'event_organizer'],
  'admin.nav.users':         ['admin'],
  'admin.nav.clubs':         ['admin', 'moderator', 'club_manager'],
  'admin.nav.events':        ['admin', 'moderator', 'club_manager', 'event_organizer'],
  'admin.nav.cities':        ['admin', 'moderator'],
  'admin.nav.bookings':      ['admin', 'moderator', 'club_manager', 'event_organizer'],
  'admin.nav.applications':  ['admin', 'moderator', 'club_manager'],
  'admin.nav.contactInbox':  ['admin', 'moderator'],
  'admin.nav.content':       ['admin', 'moderator'],
  'admin.nav.customization': ['admin', 'moderator'],
  'admin.nav.talents':       ['admin', 'moderator'],
  'admin.nav.translations':  ['admin', 'moderator'],
  'admin.nav.projects':      ['admin', 'moderator'],
  'admin.nav.analytics':     ['admin', 'moderator'],
  'admin.nav.settings':      ['admin'],
  'admin.nav.system':        ['admin'],
};

/**
 * Which roles can access each admin route prefix.
 * The longest matching prefix wins.
 */
export const ROUTE_ROLES: Record<string, AdminRole[]> = {
  '/admin/users':               ['admin'],
  '/admin/analytics':           ['admin', 'moderator'],
  '/admin/clubs':               ['admin', 'moderator', 'club_manager'],
  '/admin/events':              ['admin', 'moderator', 'club_manager', 'event_organizer'],
  '/admin/news':                ['admin', 'moderator'],
  '/admin/media':               ['admin', 'moderator'],
  '/admin/gallery':             ['admin', 'moderator'],
  '/admin/email':               ['admin'],
  '/admin/monitor':             ['admin'],
  '/admin/system':              ['admin'],
  '/admin/settings':            ['admin'],
  '/admin/landing':             ['admin', 'moderator'],
  '/admin/cms':                 ['admin', 'moderator'],
  '/admin/applications':        ['admin', 'moderator', 'club_manager'],
  '/admin/contact-submissions': ['admin', 'moderator'],
  '/admin/join-config':         ['admin'],
  '/admin/cookies':             ['admin'],
  '/admin/legal-pages':         ['admin'],
  '/admin/auth':                ['admin'],
  '/admin/payments':            ['admin'],
  '/admin/bookings':            ['admin', 'moderator', 'club_manager', 'event_organizer'],
  '/admin/booking':             ['admin', 'moderator', 'club_manager', 'event_organizer'],
  '/admin/theme':               ['admin'],
  '/admin/customization':       ['admin', 'moderator'],
  '/admin/cities':              ['admin', 'moderator'],
  '/admin/talents':             ['admin', 'moderator'],
  '/admin/translations':        ['admin', 'moderator'],
  '/admin/projects':            ['admin', 'moderator'],
};

/** Returns true if the role is allowed to see this nav section. */
export function canSeeNav(labelKey: string, role: AdminRole): boolean {
  const allowed = NAV_ROLES[labelKey];
  if (!allowed) return true;
  return allowed.includes(role);
}

/** Returns true if the role is allowed to access this route path. */
export function canAccessRoute(path: string, role: AdminRole): boolean {
  const match = Object.keys(ROUTE_ROLES)
    .filter(prefix => path === prefix || path.startsWith(prefix + '/') || path.startsWith(prefix + '?'))
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return true;
  return ROUTE_ROLES[match].includes(role);
}
