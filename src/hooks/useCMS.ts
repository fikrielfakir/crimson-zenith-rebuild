import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Standard CMS query options — 5-minute client-side cache. */
const CMS_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  retry: 2,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30_000),
} as const;

async function cmsGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error(`CMS fetch failed: ${path} (${res.status})`);
  return res.json();
}

async function adminPut<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`CMS update failed: ${path} (${res.status})`);
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces (canonical — match arch doc exactly)
// ─────────────────────────────────────────────────────────────────────────────

export interface NavLink {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
  order: number;
  openInNewTab: boolean;
  children?: NavLink[];
}

export interface NavbarSettings {
  id: string;
  logoType: "image" | "text";
  logoId: number | null;
  logoImageId: number | null;
  logoSvg: string | null;
  logoText: string | null;
  logoUrl: string;
  logoSize?: number;
  logoLink?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  hoverColor?: string;
  fontFamily?: string;
  fontSize?: string;
  isSticky: boolean;
  isTransparent?: boolean;
  transparentBg?: string;
  scrolledBg?: string;
  height?: number;
  showLanguageSwitcher: boolean;
  showDarkModeToggle: boolean;
  showAuthButtons: boolean;
  showLoginButton: boolean;
  showJoinButton: boolean;
  loginButtonText: string;
  loginButtonLink: string;
  joinButtonText: string;
  joinButtonLink: string;
  joinButtonStyle: "filled" | "outlined" | "ghost";
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaButtonStyle: "filled" | "outlined" | "ghost";
  navLinks: NavLink[];
  navigationLinks: NavLink[];
  availableLanguages: string[];
  updatedAt: Date;
}

export interface HeroSettings {
  id: string;
  backgroundType: "image" | "video" | "gradient";
  backgroundImageId: number | null;
  backgroundMediaId: number | null;
  backgroundVideoUrl: string | null;
  overlayColor: string;
  backgroundOverlayColor: string;
  overlayOpacity: number;
  backgroundOverlayOpacity: number;
  title: string;
  subtitle: string;
  titleFontSize: string;
  titleColor: string;
  subtitleFontSize: string;
  subtitleColor: string;
  typewriterTexts: Array<{ text: string; twoLines: boolean }>;
  typewriterSpeed: number;
  enableTypewriter: boolean;
  primaryButtonText: string;
  ctaPrimaryText: string;
  primaryButtonLink: string;
  ctaPrimaryLink: string;
  secondaryButtonText: string;
  ctaSecondaryText: string;
  secondaryButtonLink: string;
  ctaSecondaryLink: string;
  showScrollIndicator: boolean;
  minHeight: string;
  contentAlignment: "left" | "center" | "right";
  parallaxEnabled: boolean;
  updatedAt: Date;
}

export interface ThemeSettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  customCss: string | null;
  updatedAt: Date;
}

export interface PresidentMessageSettings {
  isActive: boolean;
  title: string;
  presidentName: string;
  presidentRole: string;
  message: string;
  quote: string;
  photoId: number | null;
  signatureId: number | null;
  backgroundImageId: number | null;
  backgroundColor: string;
  backgroundGradient: string;
  titleFontFamily: string;
  titleFontSize: string;
  titleColor: string;
  titleAlignment: "left" | "center" | "right";
  nameFontFamily: string;
  nameFontSize: string;
  nameColor: string;
  roleFontFamily: string;
  roleFontSize: string;
  roleColor: string;
  messageFontFamily: string;
  messageFontSize: string;
  messageColor: string;
  quoteFontSize: string;
  quoteColor: string;
  imagePosition: "left" | "right";
  imageAlignment: "top" | "center" | "bottom";
  imageWidth: string;
  sectionPadding: string;
  contentGap: string;
}

export interface FocusItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  imageId: number | null;
  accentColor: string;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
}

export interface FocusAreasSectionSettings {
  title: string;
  subtitle: string;
  layout: "grid" | "masonry" | "carousel";
  columns: 2 | 3 | 4;
  cardStyle: "elevated" | "flat" | "bordered" | "image-bg";
  showIcons: boolean;
  showImages: boolean;
  items: FocusItem[];
}

export interface Club {
  id: number;
  name: string;
  slug: string;
  description: string;
  city: string;
  citySlug: string;
  coverImageId: number | null;
  logoId: number | null;
  memberCount: number;
  isActive: boolean;
  isFeatured: boolean;
  category: string;
  tags: string[];
}

export interface ClubsShowcaseSettings {
  title: string;
  subtitle: string;
  maxDisplayed: number;
  showFeaturedOnly: boolean;
  filterByCity: string | null;
  layout: "grid" | "list" | "map";
  showMemberCount: boolean;
  showCityBadge: boolean;
  ctaText: string;
}

export interface BookingEvent {
  id: number;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  cityId: number | null;
  coverImageId: number | null;
  capacity: number;
  ticketsRemaining: number;
  price: number;
  currency: string;
  clubId: number | null;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: "draft" | "published" | "cancelled" | "completed";
}

export interface EventsShowcaseSettings {
  title: string;
  subtitle: string;
  viewMode: "grid" | "list" | "calendar" | "timeline";
  maxEvents: number;
  showUpcomingOnly: boolean;
  showPastEvents: boolean;
  filterByClub: number | null;
  showTicketCount: boolean;
  showPrice: boolean;
  showCalendarToggle: boolean;
}

export interface StatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
  description: string;
  accentColor: string;
  animateCountUp: boolean;
  order: number;
}

export interface ImpactSectionSettings {
  title: string;
  subtitle: string;
  backgroundType: "solid" | "gradient" | "image";
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImageId: number | null;
  textColor: string;
  accentColor: string;
  layout: "2-col" | "3-col" | "4-col" | "horizontal-scroll";
  showDividers: boolean;
  stats: StatItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoId: number | null;
  email: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  location: string;
  department: string;
  isActive: boolean;
  order: number;
}

export interface TeamSectionSettings {
  title: string;
  subtitle: string;
  layout: "grid" | "list" | "featured-first";
  columns: 2 | 3 | 4;
  cardStyle: "photo-top" | "photo-left" | "circular-photo" | "minimal";
  showSocials: boolean;
  showLocation: boolean;
  showEmail: boolean;
  groupByDepartment: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  feedback: string;
  avatarId: number | null;
  rating: number;
  date: string;
  clubId: number | null;
  eventId: number | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface TestimonialsSectionSettings {
  title: string;
  subtitle: string;
  displayMode: "grid" | "carousel" | "masonry" | "featured-quote";
  autoPlay: boolean;
  autoPlaySpeed: number;
  showRating: boolean;
  showDate: boolean;
  showOrganization: boolean;
  showRelatedBadge: boolean;
  maxDisplay: number;
}

export interface Partner {
  id: number;
  name: string;
  logoId: number | null;
  websiteUrl: string | null;
  description: string | null;
  category: "sponsor" | "partner" | "media" | "ngo";
  ordering: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface PartnerSettings {
  title: string;
  subtitle: string;
  isActive: boolean;
  displayMode: "logo-scroll" | "grid" | "list-with-desc";
  autoScrollSpeed: number;
  showNames: boolean;
  showCategories: boolean;
  groupByCategory: boolean;
  backgroundColor: string;
  patternOverlay: boolean;
}

export interface PageHeroSettings {
  pageKey: string;
  title: string | null;
  subtitle: string | null;
  backgroundType: "image" | "video" | "gradient" | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  overlayColor: string;
  overlayOpacity: number;
  isActive: boolean;
  textAlignment: "left" | "center" | "right";
  minHeight: string;
  showBreadcrumbs: boolean;
  breadcrumbStyle: "default" | "pills" | "minimal";
}

export interface MediaAsset {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  altText: string | null;
  focalPoint: unknown;
  metadata: unknown;
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Read hooks (public CMS endpoints)
// ─────────────────────────────────────────────────────────────────────────────

export function useNavbarSettings() {
  return useQuery({
    queryKey: ["cms", "navbar"],
    queryFn: () => cmsGet<NavbarSettings>("/api/cms/navbar"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useHeroSettings() {
  return useQuery({
    queryKey: ["cms", "hero"],
    queryFn: () => cmsGet<HeroSettings>("/api/cms/hero"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useThemeSettings() {
  return useQuery({
    queryKey: ["cms", "theme"],
    queryFn: () => cmsGet<ThemeSettings>("/api/cms/theme"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function usePresidentMessageSettings() {
  return useQuery({
    queryKey: ["cms", "president-message"],
    queryFn: () => cmsGet<PresidentMessageSettings>("/api/cms/president-message"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useFocusItems() {
  return useQuery({
    queryKey: ["cms", "focus-items"],
    queryFn: () => cmsGet<FocusItem[]>("/api/cms/focus-items"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["cms", "stats"],
    queryFn: () => cmsGet<ImpactSectionSettings>("/api/cms/stats"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["cms", "team-members"],
    queryFn: () => cmsGet<TeamMember[]>("/api/cms/team-members"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["cms", "testimonials"],
    queryFn: () => cmsGet<Testimonial[]>("/api/cms/testimonials"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function usePartnerSettings() {
  return useQuery({
    queryKey: ["cms", "partner-settings"],
    queryFn: () => cmsGet<PartnerSettings>("/api/cms/partner-settings"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function usePageHeroSettings(pageKey: string) {
  return useQuery({
    queryKey: ["cms", "page-hero", pageKey],
    queryFn: () => cmsGet<PageHeroSettings>(`/api/cms/page-hero/${pageKey}`),
    enabled: !!pageKey,
    ...CMS_QUERY_OPTIONS,
  });
}

export function useContactSettings() {
  return useQuery({
    queryKey: ["cms", "contact"],
    queryFn: () => cmsGet<Record<string, unknown>>("/api/cms/contact"),
    ...CMS_QUERY_OPTIONS,
  });
}

export function useFooterSettings() {
  return useQuery({
    queryKey: ["cms", "footer"],
    queryFn: () => cmsGet<Record<string, unknown>>("/api/cms/footer"),
    ...CMS_QUERY_OPTIONS,
  });
}

// Admin media assets (authenticated)
export function useMediaAssets() {
  return useQuery({
    queryKey: ["cms", "media"],
    queryFn: () => cmsGet<MediaAsset[]>("/api/admin/cms/media"),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Write mutations (admin endpoints)
// ─────────────────────────────────────────────────────────────────────────────

function useAdminUpdate<T>(queryKey: unknown[], adminPath: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<T>) => adminPut<T>(adminPath, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateNavbarSettings() {
  return useAdminUpdate<NavbarSettings>(["cms", "navbar"], "/api/admin/cms/navbar");
}

export function useUpdateHeroSettings() {
  return useAdminUpdate<HeroSettings>(["cms", "hero"], "/api/admin/cms/hero");
}

export function useUpdateThemeSettings() {
  return useAdminUpdate<ThemeSettings>(["cms", "theme"], "/api/admin/cms/theme");
}

export function useUpdatePresidentMessageSettings() {
  return useAdminUpdate<PresidentMessageSettings>(
    ["cms", "president-message"],
    "/api/admin/cms/president-message",
  );
}

export function useUpdatePartnerSettings() {
  return useAdminUpdate<PartnerSettings>(
    ["cms", "partner-settings"],
    "/api/admin/cms/partner-settings",
  );
}

export function useUpdatePageHeroSettings(pageKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<PageHeroSettings>) =>
      adminPut<PageHeroSettings>(`/api/admin/cms/page-hero/${pageKey}`, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "page-hero", pageKey] });
    },
  });
}
