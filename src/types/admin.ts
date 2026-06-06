// ─────────────────────────────────────────────────────────────────────────────
// Shared design system
// ─────────────────────────────────────────────────────────────────────────────

/** Design customization applied to any CMS landing section. */
export interface SectionDesign {
  colors?: {
    background?: string;
    text?: string;
    accent?: string;
    gradient?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    headingSize?: string;
    bodySize?: string;
    lineHeight?: string;
  };
  spacing?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
  layout?: {
    containerWidth?: string;
    columns?: number;
    alignment?: "left" | "center" | "right";
    direction?: "row" | "column";
  };
  effects?: {
    borderRadius?: string;
    shadow?: string;
    animation?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Landing page / CMS section models
// ─────────────────────────────────────────────────────────────────────────────

export interface LandingSection {
  id: number;
  pageId: number;
  /** Unique key: 'hero', 'clubs', 'events', 'testimonials', etc. */
  key: string;
  type:
    | "hero"
    | "activities"
    | "testimonials"
    | "stats"
    | "events"
    | "about"
    | "contact"
    | "gallery"
    | "clubs"
    | "team"
    | "partners"
    | "president"
    | "focus-areas"
    | "page-hero";
  title: string;
  subtitle?: string;
  /** JSON payload specific to each section type. */
  data: Record<string, unknown>;
  design?: SectionDesign;
  order: number;
  isVisible: boolean;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionBlock {
  id: number;
  sectionId: number;
  type: string;
  data: Record<string, unknown>;
  order: number;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  sections?: LandingSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Navbar
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

// ─────────────────────────────────────────────────────────────────────────────
// 2. Hero
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroSectionData {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. President Message
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. Focus Areas
// ─────────────────────────────────────────────────────────────────────────────

export interface FocusItem {
  id: number;
  title: string;
  description: string;
  /** Lucide icon component name, e.g. "Compass", "Mountain". */
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. Clubs
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 6. Events
// ─────────────────────────────────────────────────────────────────────────────

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

export interface EventsSectionData {
  title: string;
  subtitle: string;
  showUpcoming: boolean;
  maxEvents: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Stats / Impact
// ─────────────────────────────────────────────────────────────────────────────

export interface StatItem {
  id: string;
  /** Lucide icon component name. */
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

export interface StatsSectionData {
  title: string;
  stats: Array<{
    id: string;
    label: string;
    value: string;
    icon: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Team Members
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 9. Testimonials
// ─────────────────────────────────────────────────────────────────────────────

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

export interface TestimonialsSectionData {
  title: string;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. Partners
// ─────────────────────────────────────────────────────────────────────────────

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
  /** Moroccan geometric SVG pattern as background overlay. */
  patternOverlay: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. Page Heroes
// ─────────────────────────────────────────────────────────────────────────────

/** Valid page keys that have configurable hero sections. */
export type PageHeroKey =
  | "landing"
  | "clubs"
  | "events"
  | "about"
  | "contact"
  | "gallery"
  | "news"
  | "discover"
  | "join-us"
  | "projects"
  | "volunteers";

export interface PageHeroSettings {
  pageKey: PageHeroKey | string;
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

export interface PageHeroProps {
  pageKey: string;
  scrollY: number;
  breadcrumbs: { label: string; href?: string }[];
  defaultTitle: string;
  defaultSubtitle: string;
  defaultImage?: string;
  children?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Club membership & audit
// ─────────────────────────────────────────────────────────────────────────────

export interface ClubApplication {
  id: number;
  clubId?: number;
  applicantName: string;
  email: string;
  phone: string;
  preferredClub?: string;
  interests: string[];
  motivation: string;
  answers: Record<string, unknown>;
  status: "submitted" | "under_review" | "approved" | "rejected";
  reviewedBy?: number;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMembership {
  userId: number;
  clubId: number;
  role: "member" | "moderator" | "leader";
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actorUserId: number;
  entityType: string;
  entityId: number;
  action: string;
  diff: Record<string, unknown>;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Other section data shapes (legacy / convenience)
// ─────────────────────────────────────────────────────────────────────────────

export interface ActivitiesSectionData {
  title: string;
  subtitle: string;
  activities: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    difficulty: string;
    duration: string;
  }>;
}

export interface AboutSectionData {
  title: string;
  content: string;
  image: string;
  features: string[];
}

export interface ContactSectionData {
  title: string;
  subtitle: string;
  showForm: boolean;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
}

export interface GallerySectionData {
  title: string;
  subtitle: string;
  images: Array<{
    id: string;
    url: string;
    caption: string;
    alt: string;
  }>;
  layout: "grid" | "masonry" | "carousel";
}

// ─────────────────────────────────────────────────────────────────────────────
// Join Us page
// ─────────────────────────────────────────────────────────────────────────────

export interface JoinUsFormData {
  applicantName: string;
  email: string;
  phone: string;
  preferredClub?: string;
  interests: string[];
  motivation: string;
  agreeToTerms: boolean;
}

export interface JoinUsPageConfig {
  id: number;
  pageTitle: string;
  pageSubtitle: string;
  headerGradient: string;
  sections: {
    personalInfo: JoinUsFormSection;
    clubPreferences: JoinUsFormSection;
    interests: JoinUsFormSection;
    motivation: JoinUsFormSection;
    terms: JoinUsFormSection;
  };
  availableClubs: ClubOption[];
  availableInterests: string[];
  successPage: {
    title: string;
    subtitle: string;
    nextSteps: string[];
    returnButtonText: string;
  };
  termsText: string;
  termsDescription: string;
  validation: {
    nameMinLength: number;
    phoneMinLength: number;
    motivationMinLength: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JoinUsFormSection {
  isEnabled: boolean;
  title: string;
  description?: string;
  icon: string;
  order: number;
  fields: JoinUsFormField[];
}

export interface JoinUsFormField {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "multi-select";
  label: string;
  placeholder?: string;
  isRequired: boolean;
  isVisible: boolean;
  order: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  options?: string[];
}

export interface ClubOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: string;
  isActive: boolean;
  order: number;
}
