# Components and Pages Hierarchy

## Page Component Tree

### Public Pages

#### 1. Index (Home) - `/`
```
Index
├── Header
├── Hero
├── About
├── Stats
├── OurTeam
├── Testimonials
├── Footer
└── CookieConsent
```

#### 2. Discover - `/discover`
```
Discover
├── Header
├── Breadcrumbs
├── MoroccoMap
├── City Cards
│   ├── Card (UI)
│   ├── AspectRatio (UI)
│   └── Button (UI)
└── Footer
```

#### 3. Clubs - `/clubs`
```
Clubs
├── Header
├── Breadcrumbs
├── ClubsWithMap
│   ├── Search/Filter UI
│   ├── Map Component
│   └── Club Cards Grid
│       ├── Card (UI)
│       ├── Badge (UI)
│       └── Avatar (UI)
└── Footer
```

#### 4. Club Detail - `/club/:id`
```
ClubDetail
├── Header
├── Breadcrumbs
├── Hero Section
│   ├── Image Gallery
│   └── Join Button
├── Tabs (UI)
│   ├── About Tab
│   │   ├── Description
│   │   ├── Contact Info
│   │   └── Social Links
│   ├── Events Tab
│   │   └── EventCalendar
│   ├── Gallery Tab
│   │   └── Image Grid
│   └── Reviews Tab
│       ├── Rating Display
│       └── Review Form
└── Footer
```

#### 5. Events & Activities - `/events-activities`
```
EventsActivities
├── Header
├── Breadcrumbs
├── EventsActivitiesCalendar
│   ├── Calendar (UI)
│   ├── Filter Controls
│   │   ├── Select (UI)
│   │   └── Input (UI)
│   └── Event Cards
└── Footer
```

#### 6. Smart Events - `/smart-events`
```
SmartEvents
├── Header
├── SmartEventCalendar
│   ├── Calendar View
│   ├── AI Recommendations
│   └── Event Cards
└── Footer
```

#### 7. Activity Detail - `/activity/:id`
```
ActivityDetail
├── Header
├── Hero Section
├── Activity Info
│   ├── Date/Time
│   ├── Location
│   ├── Price
│   └── Description
├── Registration Form
│   ├── Form (UI)
│   ├── Input (UI)
│   └── Button (UI)
└── Footer
```

#### 8. Book Events - `/book`
```
Book
├── Header
├── Event Selection
├── Booking Form
│   ├── Date Picker (Calendar UI)
│   ├── Time Picker
│   ├── Participant Info
│   └── Payment Section
│       ├── Stripe Elements
│       └── PayPal Button
├── Summary
└── Footer
```

#### 9. Projects - `/projects`
```
Projects
├── Header
├── Breadcrumbs
├── Filter Section
│   └── Tabs (UI)
├── Project Cards Grid
│   ├── Card (UI)
│   ├── Badge (UI)
│   └── Button (UI)
└── Footer
```

#### 10. Gallery - `/gallery`
```
Gallery
├── Header
├── Breadcrumbs
├── Filter Controls
│   ├── Select (UI)
│   └── Input (UI)
├── Media Grid
│   ├── Image Cards
│   └── Lightbox Dialog (UI)
└── Footer
```

#### 11. News - `/news`
```
News
├── Header
├── Breadcrumbs
├── Search Bar
│   └── Input (UI)
├── Categories Sidebar
├── Blog Post Cards
│   ├── Card (UI)
│   ├── Avatar (UI)
│   └── Badge (UI)
└── Footer
```

#### 12. Blog Post - `/news/:id`
```
BlogPost
├── Header
├── Breadcrumbs
├── Article Header
│   ├── Title
│   ├── Author Info
│   └── Meta Data
├── Article Content
├── Share Buttons
├── Related Posts
├── Comments Section
└── Footer
```

#### 13. Talents & Experts - `/talents`
```
TalentsExperts
├── Header
├── Breadcrumbs
├── Filter Section
├── Expert Cards Grid
│   ├── Card (UI)
│   ├── Avatar (UI)
│   ├── Badge (UI)
│   └── Button (UI)
├── Contact Dialog
└── Footer
```

#### 14. Join Us - `/join`
```
JoinUs
├── Header
├── Benefits Section
├── Multi-Step Form
│   ├── Step 1: Personal Info
│   ├── Step 2: Interests
│   ├── Step 3: Membership Tier
│   └── Step 4: Payment
│       ├── Stripe/PayPal
│       └── Confirmation
└── Footer
```

#### 15. Volunteers Spontaneous - `/volunteers/spontaneous`
```
VolunteersSpontaneous
├── Header
├── Breadcrumbs
├── Opportunity Cards
│   ├── Card (UI)
│   ├── Badge (UI)
│   └── Button (UI)
├── Quick Application Dialog
│   └── Form (UI)
└── Footer
```

#### 16. Volunteers Posts - `/volunteers/posts`
```
VolunteersPosts
├── Header
├── Breadcrumbs
├── Filter Section
├── Volunteer Post Cards
│   ├── Card (UI)
│   ├── Badge (UI)
│   └── Button (UI)
├── Application Dialog
└── Footer
```

#### 17. Work Offers - `/work-offers`
```
WorkOffers
├── Header
├── Breadcrumbs
├── Filter Section
│   ├── Select (UI)
│   └── Checkbox (UI)
├── Job Cards
│   ├── Card (UI)
│   ├── Badge (UI)
│   └── Button (UI)
├── Application Dialog
└── Footer
```

#### 18. Contact - `/contact`
```
Contact (Page)
├── Header
├── Breadcrumbs
├── Contact (Component)
│   ├── Contact Info Cards
│   ├── Contact Form
│   │   ├── Form (UI)
│   │   ├── Input (UI)
│   │   ├── Textarea (UI)
│   │   └── Button (UI)
│   └── Map
└── Footer
```

#### 19. Learn More - `/learn-more`
```
LearnMore
├── Header
├── Breadcrumbs
├── Hero Section
├── Mission & Vision
├── PresidentMessage
│   ├── Avatar (UI)
│   └── Card (UI)
├── Information Sections
└── Footer
```

#### 20. User Login - `/login`
```
UserLogin
├── Logo
├── Login Form
│   ├── Form (UI)
│   ├── Input (UI)
│   ├── Button (UI)
│   └── Checkbox (UI)
├── Social Login Buttons
├── Password Reset Link
└── Register Link
```

#### 21. User Profile - `/profile`
```
UserProfile
├── Header
├── Tabs (UI)
│   ├── Profile Tab
│   │   ├── Avatar Upload
│   │   ├── Edit Form
│   │   └── Save Button
│   ├── Memberships Tab
│   │   └── Club Cards
│   ├── Events Tab
│   │   └── Event Cards
│   └── Settings Tab
│       └── Settings Form
└── Footer
```

#### 22. Club Profile Edit - `/club/edit/:id`
```
ClubProfileEdit
├── Header
├── Tabs (UI)
│   ├── Basic Info Tab
│   │   ├── Form (UI)
│   │   └── Image Upload
│   ├── Events Tab
│   │   ├── Event List
│   │   └── Add Event Form
│   ├── Gallery Tab
│   │   ├── Image Grid
│   │   └── Upload Button
│   └── Members Tab
│       ├── Member List
│       └── Role Management
└── Footer
```

#### 23. City Detail - `/city/:name`
```
CityDetail
├── Header
├── Breadcrumbs
├── City Hero
├── City Info
├── Clubs in City
│   └── Club Cards
├── Events in City
│   └── Event Cards
└── Footer
```

#### 24-26. Legal Pages
```
PrivacyPolicy / TermsOfService / CookiePolicy
├── Header
├── Legal Content
│   ├── Table of Contents
│   └── Content Sections
└── Footer
```

#### 27. 404 Not Found - `*`
```
NotFound
├── Error Icon
├── Error Message
└── Back to Home Button
```

---

### Admin Pages

#### 1. Admin Login - `/admin/login`
```
AdminLogin
├── Logo
├── Login Form
│   ├── Form (UI)
│   ├── Input (UI)
│   └── Button (UI)
└── Remember Me Checkbox
```

#### 2. Admin Dashboard - `/admin`
```
AdminLayout
└── AdminDashboard
    ├── Stats Cards
    │   ├── Card (UI)
    │   └── Badge (UI)
    ├── Charts
    │   └── Chart (UI)
    ├── Recent Activity Feed
    │   └── Table (UI)
    └── Quick Actions
        └── Button (UI)
```

#### 3. User Management - `/admin/users`
```
AdminLayout
└── UserManagement
    ├── Search & Filter
    │   ├── Input (UI)
    │   └── Select (UI)
    ├── BulkOperations
    │   ├── Checkbox (UI)
    │   └── Dropdown Menu (UI)
    ├── Users Table
    │   ├── Table (UI)
    │   ├── Badge (UI)
    │   └── Actions Dropdown
    ├── Edit User Dialog
    │   ├── Dialog (UI)
    │   ├── Form (UI)
    │   └── Tabs (UI)
    └── Export Button
```

#### 4. Clubs Management - `/admin/clubs`
```
AdminLayout
└── ClubsManagement
    ├── Filter Controls
    ├── BulkOperations
    ├── Clubs Table
    │   ├── Table (UI)
    │   ├── Badge (UI)
    │   └── Actions Menu
    ├── Approval Dialog
    └── Edit Club Dialog
```

#### 5. Events Management - `/admin/events`
```
AdminLayout
└── EventsManagement
    ├── View Toggle (Calendar/Table)
    ├── Calendar View
    │   └── EventCalendar
    ├── Table View
    │   └── Table (UI)
    ├── Create Event Dialog
    └── Participants Dialog
```

#### 6. Applications Management - `/admin/applications`
```
AdminLayout
└── ApplicationsManagement
    ├── Filter Controls
    ├── BulkOperations
    ├── Applications Table
    │   └── Table (UI)
    ├── Review Dialog
    │   ├── Application Details
    │   ├── Approve/Reject Buttons
    │   └── Notes Textarea
    └── Export Button
```

#### 7. Booking Management - `/admin/bookings`
```
AdminLayout
└── BookingManagement
    ├── Filter Controls
    ├── Bookings Table
    │   └── Table (UI)
    ├── Booking Details Dialog
    ├── Refund Dialog
    └── Reports Section
        └── Chart (UI)
```

#### 8. News Management - `/admin/news`
```
AdminLayout
└── NewsManagement
    ├── News List
    │   └── Table (UI)
    ├── Create/Edit Dialog
    │   ├── Rich Text Editor
    │   ├── MediaUpload
    │   ├── Category Select
    │   └── SEO Fields
    └── Preview Button
```

#### 9. Media Library - `/admin/media`
```
AdminLayout
└── MediaLibrary
    ├── MediaUpload
    │   ├── Dropzone
    │   ├── Progress Bar
    │   └── Preview Grid
    ├── Search & Filter
    ├── Media Grid View
    │   ├── Image Cards
    │   └── Actions Menu
    ├── Edit Media Dialog
    │   ├── Image Editor
    │   └── Metadata Form
    └── BulkOperations
```

#### 10. Landing Page Management - `/admin/landing`
```
AdminLayout
└── LandingManagement
    ├── Tabs (UI)
    │   ├── NavbarTab
    │   │   ├── Logo Settings
    │   │   ├── Navigation Links
    │   │   └── Button Settings
    │   ├── HeroTab
    │   │   ├── Text Settings
    │   │   ├── Background Settings
    │   │   └── Button Settings
    │   ├── FocusTab
    │   │   ├── Focus Items List
    │   │   └── Add/Edit Form
    │   ├── ClubsTab
    │   │   └── Featured Clubs Selection
    │   ├── ActivitiesTab
    │   │   └── Featured Activities Selection
    │   ├── EventsTab
    │   │   └── Featured Events Selection
    │   ├── TeamTab
    │   │   ├── Team Members List
    │   │   └── Add/Edit Form
    │   ├── TestimonialsTab
    │   │   ├── Testimonials List
    │   │   └── Approval System
    │   ├── StatsTab
    │   │   ├── Stats List
    │   │   └── Add/Edit Form
    │   ├── ContactTab
    │   │   └── Contact Settings Form
    │   ├── FooterTab
    │   │   └── Footer Settings Form
    │   └── SeoTab
    │       └── SEO Settings Form
    └── Live Preview Panel
```

#### 11. Theme Customization - `/admin/theme`
```
AdminLayout
└── ThemeCustomization
    ├── Color Pickers
    │   ├── Primary Color
    │   └── Secondary Color
    ├── Font Selection
    ├── Custom CSS Editor
    ├── Preview Panel
    └── Reset Button
```

#### 12. Analytics - `/admin/analytics`
```
AdminLayout
└── Analytics
    ├── Date Range Picker
    ├── Stats Cards
    ├── Traffic Charts
    │   └── Chart (UI)
    ├── User Engagement
    │   └── Chart (UI)
    ├── Event Analytics
    │   └── Chart (UI)
    ├── Revenue Reports
    │   └── Chart (UI)
    └── Export Data Button
```

#### 13. Email Campaigns - `/admin/email`
```
AdminLayout
└── EmailCampaigns
    ├── Campaigns List
    │   └── Table (UI)
    ├── Create Campaign Dialog
    │   ├── Template Editor
    │   ├── Recipient Selection
    │   ├── Schedule Settings
    │   └── Test Email Button
    └── Campaign Analytics
        └── Chart (UI)
```

#### 14. Payment Settings - `/admin/payments`
```
AdminLayout
└── PaymentSettings
    ├── Tabs (UI)
    │   ├── Stripe Tab
    │   │   ├── API Keys
    │   │   ├── Webhook URL
    │   │   └── Test Mode Toggle
    │   └── PayPal Tab
    │       ├── Client ID/Secret
    │       └── Sandbox Toggle
    ├── Payment Methods Toggle
    └── Transaction Fees Settings
```

#### 15. Auth Settings - `/admin/auth`
```
AdminLayout
└── AuthSettings
    ├── OAuth Providers
    │   ├── Google Toggle
    │   ├── Facebook Toggle
    │   └── Replit Toggle
    ├── Registration Settings
    ├── Password Policy
    ├── Session Timeout
    └── 2FA Settings
```

#### 16. Cookie Settings - `/admin/cookies`
```
AdminLayout
└── CookieSettings
    ├── Banner Customization
    ├── Cookie Categories
    │   └── Table (UI)
    ├── Compliance Settings
    └── Privacy Policy Link
```

#### 17. Join Us Config - `/admin/join-config`
```
AdminLayout
└── JoinUsConfig
    ├── Form Fields Configuration
    │   └── Drag-and-Drop Form Builder
    ├── Membership Tiers
    │   └── Table (UI)
    ├── Pricing Settings
    └── Welcome Email Template
```

#### 18. System Monitoring - `/admin/system`
```
AdminLayout
└── SystemMonitoring
    ├── Server Status
    │   └── Badge (UI)
    ├── Database Status
    │   └── Badge (UI)
    ├── Error Logs
    │   └── Table (UI)
    ├── Performance Metrics
    │   └── Chart (UI)
    └── Backup Management
        └── Table (UI)
```

#### 19. Admin Settings - `/admin/settings`
```
AdminLayout
└── AdminSettings
    ├── Tabs (UI)
    │   ├── Site Settings Tab
    │   ├── Admin Users Tab
    │   ├── Notifications Tab
    │   ├── API Keys Tab
    │   └── Backup/Restore Tab
    └── Save Button
```

---

## Reusable Component Library

### Layout Components
```
Header (Navigation)
├── Logo (Image/SVG/Text)
├── Navigation Menu
│   └── NavigationMenu (UI)
├── Language Switcher
│   └── Select (UI)
├── Dark Mode Toggle
│   └── Switch (UI)
├── Login Button
└── Join Button
```

```
Footer
├── Logo
├── Description
├── Links Grid
├── Social Links
└── Newsletter Form
    ├── Input (UI)
    └── Button (UI)
```

```
AdminLayout
├── Sidebar
│   ├── Logo
│   ├── Navigation Links
│   └── User Dropdown
├── Header
│   ├── Breadcrumbs
│   └── User Menu
└── Main Content Area
```

### Content Components
```
Hero
├── Background (Image/Video)
├── Overlay
├── Title (with Typewriter)
├── Subtitle
└── Action Buttons
```

```
Stats
└── Stat Cards
    ├── Icon
    ├── Value (Animated Counter)
    ├── Label
    └── Suffix
```

```
Testimonials
└── Carousel (UI)
    └── Testimonial Cards
        ├── Avatar (UI)
        ├── Name
        ├── Role
        ├── Rating
        └── Feedback
```

```
ClubsWithMap
├── Map Panel
│   └── MapLibre
│       └── Markers
└── List Panel
    ├── Search Bar
    ├── Filters
    └── Club Cards
```

---

## UI Component Dependencies (shadcn/ui)

All pages and components rely on these base UI components:

- **Form Controls**: Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider
- **Navigation**: Breadcrumb, NavigationMenu, Tabs, Pagination
- **Layout**: Card, Separator, ScrollArea, ResizablePanel, Sidebar
- **Feedback**: Toast, Alert, AlertDialog, Dialog, Drawer, Sheet
- **Data Display**: Table, Badge, Avatar, Chart, Progress
- **Overlay**: Dialog, DropdownMenu, ContextMenu, HoverCard, Popover, Tooltip
- **Interactive**: Button, Calendar, Carousel, Collapsible, Command
- **Misc**: AspectRatio, Skeleton (loading states)

---

## Component File Count

### Total Component Files: ~90

- **Page Components**: 27 user pages + 19 admin pages = 46 pages
- **Shared Components**: ~25 components
- **UI Components**: ~50 shadcn/ui components
- **Admin Components**: ~15 components (including landing tabs)

---

## Component Dependencies Map

### Most Used Components
1. **Card** - Used in almost every page
2. **Button** - Universal across all pages
3. **Form/Input** - All forms and inputs
4. **Dialog** - Modals and popups
5. **Table** - Admin pages and listings
6. **Badge** - Status indicators
7. **Tabs** - Multi-section pages
8. **Avatar** - User/member displays

### Key Third-Party Components
1. **MapLibre GL** - Maps
2. **Recharts** - Analytics charts
3. **React Calendar** - Event calendars
4. **Framer Motion** - Animations
5. **React Dropzone** - File uploads
6. **React Query** - Data fetching
7. **Socket.io** - Real-time updates
8. **Stripe/PayPal** - Payment processing

---

## State Management

### Global State (React Query)
- User authentication state
- Theme settings
- CMS content
- Club data
- Event data

### Local State (useState)
- Form inputs
- UI toggles
- Filter states
- Modal visibility

### Server State (React Query)
- API data caching
- Background refetching
- Optimistic updates

---

## Routing Structure

```
/                           → Index
/discover                   → Discover
/city/:name                 → CityDetail
/clubs                      → Clubs
/club/:id                   → ClubDetail
/club/edit/:id              → ClubProfileEdit
/events-activities          → EventsActivities
/smart-events               → SmartEvents
/activity/:id               → ActivityDetail
/book                       → Book
/projects                   → Projects
/gallery                    → Gallery
/news                       → News
/news/:id                   → BlogPost
/talents                    → TalentsExperts
/join                       → JoinUs
/volunteers/spontaneous     → VolunteersSpontaneous
/volunteers/posts           → VolunteersPosts
/work-offers                → WorkOffers
/contact                    → Contact
/learn-more                 → LearnMore
/login                      → UserLogin
/profile                    → UserProfile (Protected)
/privacy                    → PrivacyPolicy
/terms                      → TermsOfService
/cookie-policy              → CookiePolicy

/admin/login                → AdminLogin
/admin                      → AdminDashboard (Protected)
/admin/users                → UserManagement (Protected)
/admin/clubs                → ClubsManagement (Protected)
/admin/events               → EventsManagement (Protected)
/admin/applications         → ApplicationsManagement (Protected)
/admin/bookings             → BookingManagement (Protected)
/admin/news                 → NewsManagement (Protected)
/admin/media                → MediaLibrary (Protected)
/admin/landing              → LandingManagement (Protected)
/admin/theme                → ThemeCustomization (Protected)
/admin/analytics            → Analytics (Protected)
/admin/email                → EmailCampaigns (Protected)
/admin/payments             → PaymentSettings (Protected)
/admin/auth                 → AuthSettings (Protected)
/admin/cookies              → CookieSettings (Protected)
/admin/join-config          → JoinUsConfig (Protected)
/admin/system               → SystemMonitoring (Protected)
/admin/settings             → AdminSettings (Protected)

*                           → NotFound
```

---

## Component Naming Conventions

### Pages
- PascalCase
- Descriptive of route
- Examples: `ClubDetail`, `EventsActivities`, `UserProfile`

### Components
- PascalCase
- Descriptive of function
- Examples: `Header`, `EventCalendar`, `MediaUpload`

### UI Components
- kebab-case files (shadcn convention)
- PascalCase exports
- Examples: `button.tsx` exports `Button`

---

## Best Practices Used

1. **Component Composition** - Small, reusable components
2. **Props Typing** - TypeScript interfaces for all props
3. **Separation of Concerns** - UI, logic, and data layers separated
4. **Consistent Naming** - Clear, descriptive component names
5. **Accessibility** - ARIA labels, semantic HTML
6. **Responsive Design** - Mobile-first approach
7. **Performance** - Lazy loading, code splitting
8. **Error Boundaries** - Graceful error handling
