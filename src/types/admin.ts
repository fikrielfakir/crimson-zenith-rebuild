// Landing Page Management Types
export interface LandingSection {
  id: number;
  pageId: number;
  key: string; // unique key like 'hero', 'activities', 'testimonials'
  type: 'hero' | 'activities' | 'testimonials' | 'stats' | 'events' | 'about' | 'contact' | 'gallery';
  title: string;
  subtitle?: string;
  data: Record<string, any>; // JSON data specific to each section type
  design?: SectionDesign; // Design customization data
  order: number;
  isVisible: boolean;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

// Design customization interface
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
    alignment?: 'left' | 'center' | 'right';
    direction?: 'row' | 'column';
  };
  effects?: {
    borderRadius?: string;
    shadow?: string;
    animation?: string;
  };
}

export interface SectionBlock {
  id: number;
  sectionId: number;
  type: string;
  data: Record<string, any>;
  order: number;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  sections?: LandingSection[];
}

// Club Application Types
export interface ClubApplication {
  id: number;
  clubId?: number; // nullable - user can apply generally or to specific club
  applicantName: string;
  email: string;
  phone: string;
  preferredClub?: string;
  interests: string[];
  motivation: string;
  answers: Record<string, any>; // JSON for additional questions
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: number; // user ID of admin who reviewed
  reviewedAt?: string;
  notes?: string; // admin notes
  createdAt: string;
  updatedAt: string;
}

export interface ClubMembership {
  userId: number;
  clubId: number;
  role: 'member' | 'moderator' | 'leader';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actorUserId: number;
  entityType: string;
  entityId: number;
  action: string;
  diff: Record<string, any>;
  createdAt: string;
}

// Form validation types
export interface JoinUsFormData {
  applicantName: string;
  email: string;
  phone: string;
  preferredClub?: string;
  interests: string[];
  motivation: string;
  agreeToTerms: boolean;
}

// Section-specific data types
export interface HeroSectionData {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
}

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

export interface StatsSectionData {
  title: string;
  stats: Array<{
    id: string;
    label: string;
    value: string;
    icon: string;
  }>;
}

export interface EventsSectionData {
  title: string;
  subtitle: string;
  showUpcoming: boolean;
  maxEvents: number;
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
  layout: 'grid' | 'masonry' | 'carousel';
}

// Join Us Page Configuration Types
export interface JoinUsPageConfig {
  id: number;
  // Page Content
  pageTitle: string;
  pageSubtitle: string;
  headerGradient: string;
  
  // Form Sections Configuration
  sections: {
    personalInfo: JoinUsFormSection;
    clubPreferences: JoinUsFormSection;
    interests: JoinUsFormSection;
    motivation: JoinUsFormSection;
    terms: JoinUsFormSection;
  };
  
  // Available Options
  availableClubs: ClubOption[];
  availableInterests: string[];
  
  // Success Page Configuration
  successPage: {
    title: string;
    subtitle: string;
    nextSteps: string[];
    returnButtonText: string;
  };
  
  // Terms and Conditions
  termsText: string;
  termsDescription: string;
  
  // Form Behavior
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
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'multi-select';
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
  options?: string[]; // for select, radio, multi-select fields
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