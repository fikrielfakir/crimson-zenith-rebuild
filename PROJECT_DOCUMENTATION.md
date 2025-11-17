# Journey Association - Complete Project Documentation

## Table of Contents
1. [User-Facing Pages](#user-facing-pages)
2. [Admin Pages](#admin-pages)
3. [Shared Components](#shared-components)
4. [Database Schema](#database-schema)
5. [Integration Setup](#integration-setup)

---

## User-Facing Pages

### 1. Index (Home Page) - `/`
**File:** `src/pages/Index.tsx`
**Purpose:** Landing page of the website

**Components Used:**
- `Header` - Navigation bar
- `Hero` - Hero section with typewriter effect
- `About` - About section
- `Stats` - Statistics display
- `OurTeam` - Team members section
- `Testimonials` - User testimonials
- `Footer` - Footer section
- `CookieConsent` - Cookie consent banner

---

### 2. Discover Page - `/discover`
**File:** `src/pages/Discover.tsx`
**Purpose:** Explore cities and destinations

**Components Used:**
- `Header` - Navigation
- `Breadcrumbs` - Navigation breadcrumbs
- `MoroccoMap` - Interactive map of Morocco
- City cards with images and descriptions
- `Footer`

---

### 3. Clubs Page - `/clubs`
**File:** `src/pages/Clubs.tsx`
**Purpose:** Browse and search clubs

**Components Used:**
- `Header`
- `Breadcrumbs`
- `ClubsWithMap` - Clubs listing with map integration
- Search and filter functionality
- Club cards grid
- `Footer`

---

### 4. Club Detail Page - `/club/:id`
**File:** `src/pages/ClubDetail.tsx`
**Purpose:** Detailed view of a specific club

**Components Used:**
- `Header`
- `Breadcrumbs`
- Club hero section with image
- Club information tabs (About, Events, Gallery, Reviews)
- Join club button
- Rating and review system
- Event calendar
- Image gallery
- `Footer`

---

### 5. Events & Activities Page - `/events-activities`
**File:** `src/pages/EventsActivities.tsx`
**Purpose:** View all events and activities

**Components Used:**
- `Header`
- `Breadcrumbs`
- `EventsActivitiesCalendar` - Calendar view of events
- Event filtering by category, date, location
- Event cards
- `Footer`

---

### 6. Smart Events Page - `/smart-events`
**File:** `src/pages/SmartEvents.tsx`
**Purpose:** AI-powered event recommendations

**Components Used:**
- `Header`
- `SmartEventCalendar` - Advanced calendar with filters
- Event recommendation engine
- `Footer`

---

### 7. Activity Detail Page - `/activity/:id`
**File:** `src/pages/ActivityDetail.tsx`
**Purpose:** Detailed view of a specific activity

**Components Used:**
- `Header`
- Activity hero section
- Activity details (time, location, price)
- Registration form
- `Footer`

---

### 8. Book Events Page - `/book`
**File:** `src/pages/Book.tsx`
**Purpose:** Booking system for events

**Components Used:**
- `Header`
- Booking form with Stripe/PayPal integration
- Event selection
- Date and time picker
- Payment processing
- Confirmation system
- `Footer`

---

### 9. Projects Page - `/projects`
**File:** `src/pages/Projects.tsx`
**Purpose:** Showcase community projects

**Components Used:**
- `Header`
- `Breadcrumbs`
- Project cards grid
- Project categories filter
- `Footer`

---

### 10. Gallery Page - `/gallery`
**File:** `src/pages/Gallery.tsx`
**Purpose:** Photo and video gallery

**Components Used:**
- `Header`
- `Breadcrumbs`
- Image grid with lightbox
- Video player
- Gallery filters (by club, event, date)
- `Footer`

---

### 11. News/Blog Page - `/news`
**File:** `src/pages/News.tsx`
**Purpose:** News articles and blog posts

**Components Used:**
- `Header`
- `Breadcrumbs`
- Blog post cards
- Search and filter
- Categories sidebar
- `Footer`

---

### 12. Blog Post Page - `/news/:id`
**File:** `src/pages/BlogPost.tsx`
**Purpose:** Individual blog post view

**Components Used:**
- `Header`
- `Breadcrumbs`
- Article content
- Author information
- Related posts
- Comments section
- Share buttons
- `Footer`

---

### 13. Talents & Experts Page - `/talents`
**File:** `src/pages/TalentsExperts.tsx`
**Purpose:** Showcase talents and experts

**Components Used:**
- `Header`
- `Breadcrumbs`
- Expert profiles grid
- Skills filter
- Contact form
- `Footer`

---

### 14. Join Us Page - `/join`
**File:** `src/pages/JoinUs.tsx`
**Purpose:** Membership registration

**Components Used:**
- `Header`
- Multi-step registration form
- Membership benefits section
- Payment integration
- `Footer`

---

### 15. Volunteers - Spontaneous Page - `/volunteers/spontaneous`
**File:** `src/pages/VolunteersSpontaneous.tsx`
**Purpose:** Spontaneous volunteer opportunities

**Components Used:**
- `Header`
- `Breadcrumbs`
- Volunteer opportunity cards
- Quick application form
- `Footer`

---

### 16. Volunteers - Posts Page - `/volunteers/posts`
**File:** `src/pages/VolunteersPosts.tsx`
**Purpose:** Posted volunteer positions

**Components Used:**
- `Header`
- `Breadcrumbs`
- Volunteer post listings
- Application form
- `Footer`

---

### 17. Work Offers Page - `/work-offers`
**File:** `src/pages/WorkOffers.tsx`
**Purpose:** Job postings and work opportunities

**Components Used:**
- `Header`
- `Breadcrumbs`
- Job listings
- Job filters (location, type, category)
- Application form
- `Footer`

---

### 18. Contact Page - `/contact`
**File:** `src/pages/Contact.tsx`
**Purpose:** Contact form and information

**Components Used:**
- `Header`
- `Breadcrumbs`
- `Contact` component
- Contact form
- Office location map
- Contact information
- `Footer`

---

### 19. Learn More Page - `/learn-more`
**File:** `src/pages/LearnMore.tsx`
**Purpose:** Additional information about the organization

**Components Used:**
- `Header`
- `Breadcrumbs`
- Information sections
- `PresidentMessage` component
- Mission and vision
- `Footer`

---

### 20. User Login Page - `/login`
**File:** `src/pages/UserLogin.tsx`
**Purpose:** User authentication

**Components Used:**
- Login form
- Password reset link
- Social login options
- Registration link

---

### 21. User Profile Page - `/profile`
**File:** `src/pages/UserProfile.tsx`
**Purpose:** User profile management

**Components Used:**
- `Header`
- Profile edit form
- Profile image upload
- User statistics
- Membership status
- Event history
- `Footer`

---

### 22. Club Profile Edit Page - `/club/edit/:id`
**File:** `src/pages/ClubProfileEdit.tsx`
**Purpose:** Edit club profile (for club owners/admins)

**Components Used:**
- `Header`
- Club edit form
- Image upload
- Event management
- Member management
- `Footer`

---

### 23. City Detail Page - `/city/:name`
**File:** `src/pages/CityDetail.tsx`
**Purpose:** Detailed information about a city

**Components Used:**
- `Header`
- `Breadcrumbs`
- City hero section
- City information
- Clubs in the city
- Events in the city
- `Footer`

---

### 24. Privacy Policy Page - `/privacy`
**File:** `src/pages/PrivacyPolicy.tsx`
**Purpose:** Privacy policy

**Components Used:**
- `Header`
- Policy content
- `Footer`

---

### 25. Terms of Service Page - `/terms`
**File:** `src/pages/TermsOfService.tsx`
**Purpose:** Terms and conditions

**Components Used:**
- `Header`
- Terms content
- `Footer`

---

### 26. Cookie Policy Page - `/cookie-policy`
**File:** `src/pages/CookiePolicy.tsx`
**Purpose:** Cookie usage policy

**Components Used:**
- `Header`
- Cookie policy content
- `Footer`

---

### 27. 404 Not Found Page - `*`
**File:** `src/pages/NotFound.tsx`
**Purpose:** Error page for invalid routes

**Components Used:**
- Error message
- Back to home button

---

## Admin Pages

### 1. Admin Login - `/admin/login`
**File:** `src/pages/admin/AdminLogin.tsx`
**Purpose:** Admin authentication

**Components Used:**
- Admin login form
- Authentication logic
- Session management

---

### 2. Admin Dashboard - `/admin`
**File:** `src/pages/admin/AdminDashboard.tsx`
**Purpose:** Admin overview and quick stats

**Components Used:**
- `AdminLayout` wrapper
- Statistics cards (users, clubs, events, revenue)
- Recent activity feed
- Quick action buttons
- Charts and graphs

---

### 3. User Management - `/admin/users`
**File:** `src/pages/admin/UserManagement.tsx`
**Purpose:** Manage users

**Components Used:**
- `AdminLayout`
- User table with search/filter
- `BulkOperations` component
- User edit dialog
- User creation form
- Role assignment
- Ban/unban functionality
- Export users data

---

### 4. Clubs Management - `/admin/clubs`
**File:** `src/pages/admin/ClubsManagement.tsx`
**Purpose:** Manage clubs

**Components Used:**
- `AdminLayout`
- Clubs table
- `BulkOperations`
- Club approval system
- Club edit form
- Featured clubs management
- Club deletion

---

### 5. Events Management - `/admin/events`
**File:** `src/pages/admin/EventsManagement.tsx`
**Purpose:** Manage events

**Components Used:**
- `AdminLayout`
- Events calendar view
- Events table
- Event creation form
- Event approval workflow
- Event participants list
- Event cancellation

---

### 6. Applications Management - `/admin/applications`
**File:** `src/pages/admin/ApplicationsManagement.tsx`
**Purpose:** Manage membership applications

**Components Used:**
- `AdminLayout`
- Applications table
- Application review form
- Approval/rejection workflow
- Application status tracking
- Bulk approval

---

### 7. Booking Management - `/admin/bookings`
**File:** `src/pages/admin/BookingManagement.tsx`
**Purpose:** Manage event bookings

**Components Used:**
- `AdminLayout`
- Bookings table
- Booking details view
- Payment status tracking
- Refund processing
- Booking reports

---

### 8. News Management - `/admin/news`
**File:** `src/pages/admin/NewsManagement.tsx`
**Purpose:** Manage blog posts and news

**Components Used:**
- `AdminLayout`
- News articles table
- Rich text editor
- Image upload
- Category management
- Publishing workflow
- SEO settings per post

---

### 9. Media Library - `/admin/media`
**File:** `src/pages/admin/MediaLibrary.tsx`
**Purpose:** Manage uploaded media

**Components Used:**
- `AdminLayout`
- `MediaUpload` component
- Media grid view
- File upload dropzone
- Image editor (crop, resize)
- Media metadata editor
- Search and filter
- Bulk delete

---

### 10. Landing Page Management - `/admin/landing`
**File:** `src/pages/admin/LandingManagement.tsx`
**Purpose:** Manage landing page content

**Components Used:**
- `AdminLayout`
- Tabbed interface for sections:
  - `NavbarTab` - Navigation settings
  - `HeroTab` - Hero section settings
  - `FocusTab` - Focus items
  - `ClubsTab` - Featured clubs
  - `ActivitiesTab` - Featured activities
  - `EventsTab` - Featured events
  - `TeamTab` - Team members
  - `TestimonialsTab` - Testimonials
  - `StatsTab` - Statistics
  - `ContactTab` - Contact info
  - `FooterTab` - Footer content
  - `SeoTab` - SEO settings
- Live preview
- Drag-and-drop section ordering

---

### 11. Theme Customization - `/admin/theme`
**File:** `src/pages/admin/ThemeCustomization.tsx`
**Purpose:** Customize website theme

**Components Used:**
- `AdminLayout`
- Color picker for primary/secondary colors
- Font selection
- Custom CSS editor
- Theme preview
- Reset to defaults button

---

### 12. Analytics - `/admin/analytics`
**File:** `src/pages/admin/Analytics.tsx`
**Purpose:** Website analytics and reports

**Components Used:**
- `AdminLayout`
- Traffic charts
- User engagement metrics
- Event analytics
- Revenue reports
- Export data functionality
- Date range selector

---

### 13. Email Campaigns - `/admin/email`
**File:** `src/pages/admin/EmailCampaigns.tsx`
**Purpose:** Email marketing campaigns

**Components Used:**
- `AdminLayout`
- Campaign list
- Email template editor
- Recipient list management
- Send test email
- Schedule campaigns
- Campaign analytics

---

### 14. Payment Settings - `/admin/payments`
**File:** `src/pages/admin/PaymentSettings.tsx`
**Purpose:** Configure payment integrations

**Components Used:**
- `AdminLayout`
- Stripe configuration
- PayPal configuration
- Payment methods toggle
- Transaction fees settings
- Webhook configuration
- Test mode toggle

---

### 15. Auth Settings - `/admin/auth`
**File:** `src/pages/admin/AuthSettings.tsx`
**Purpose:** Authentication settings

**Components Used:**
- `AdminLayout`
- OAuth providers toggle
- Registration settings
- Password policy
- Session timeout
- Two-factor authentication

---

### 16. Cookie Settings - `/admin/cookies`
**File:** `src/pages/admin/CookieSettings.tsx`
**Purpose:** Cookie consent settings

**Components Used:**
- `AdminLayout`
- Cookie banner customization
- Cookie categories
- Compliance settings
- Privacy policy link

---

### 17. Join Us Config - `/admin/join-config`
**File:** `src/pages/admin/JoinUsConfig.tsx`
**Purpose:** Configure membership registration

**Components Used:**
- `AdminLayout`
- Form fields configuration
- Membership tiers
- Pricing settings
- Welcome email template

---

### 18. System Monitoring - `/admin/system`
**File:** `src/pages/admin/SystemMonitoring.tsx`
**Purpose:** System health and performance

**Components Used:**
- `AdminLayout`
- Server status
- Database status
- Error logs
- Performance metrics
- Backup management

---

### 19. Admin Settings - `/admin/settings`
**File:** `src/pages/admin/AdminSettings.tsx`
**Purpose:** General admin settings

**Components Used:**
- `AdminLayout`
- Site settings
- Admin user management
- Notification preferences
- API keys management
- Backup/restore

---

## Shared Components

### Layout Components

#### Header
**File:** `src/components/Header.tsx`
**Purpose:** Main navigation bar

**Features:**
- Logo (image, SVG, or text)
- Navigation menu
- Language switcher (EN, FR, AR)
- Dark mode toggle
- Login button
- Join Us button
- Mobile responsive menu

---

#### Footer
**File:** `src/components/Footer.tsx`
**Purpose:** Website footer

**Features:**
- Copyright text
- Description
- Footer links
- Social media links
- Newsletter subscription form

---

#### BottomNavbar
**File:** `src/components/BottomNavbar.tsx`
**Purpose:** Mobile bottom navigation

**Features:**
- Quick access icons
- Active route highlighting
- Fixed bottom position

---

#### AdminLayout
**File:** `src/components/admin/AdminLayout.tsx`
**Purpose:** Layout wrapper for admin pages

**Features:**
- Admin sidebar navigation
- Admin header
- Breadcrumbs
- User dropdown
- Logout functionality

---

#### ProtectedRoute
**File:** `src/components/admin/ProtectedRoute.tsx`
**Purpose:** Route protection for admin pages

**Features:**
- Authentication check
- Admin role verification
- Redirect to login

---

### Content Components

#### Hero
**File:** `src/components/Hero.tsx`
**Purpose:** Hero section on landing page

**Features:**
- Title with typewriter effect
- Subtitle
- Primary and secondary buttons
- Background image/video
- Overlay customization

---

#### About
**File:** `src/components/About.tsx`
**Purpose:** About section

**Features:**
- Description text
- Images
- Call-to-action buttons

---

#### Stats
**File:** `src/components/Stats.tsx`
**Purpose:** Statistics display

**Features:**
- Animated counters
- Icons
- Labels
- Suffixes (e.g., "+", "K")

---

#### OurTeam
**File:** `src/components/OurTeam.tsx`
**Purpose:** Team members display

**Features:**
- Team member cards
- Photos
- Names and roles
- Bio
- Social links

---

#### Testimonials
**File:** `src/components/Testimonials.tsx`
**Purpose:** User testimonials carousel

**Features:**
- Testimonial cards
- Star ratings
- User photos
- Carousel navigation

---

#### Clubs
**File:** `src/components/Clubs.tsx`
**Purpose:** Clubs listing component

**Features:**
- Club cards grid
- Club images
- Member count
- Rating
- Location

---

#### ClubsWithMap
**File:** `src/components/ClubsWithMap.tsx`
**Purpose:** Clubs with map integration

**Features:**
- Interactive map
- Club markers
- Filter by location
- Map-list synchronization

---

#### MoroccoMap
**File:** `src/components/MoroccoMap.tsx`
**Purpose:** Interactive map of Morocco

**Features:**
- City markers
- Click to navigate
- Zoom controls
- Satellite/street view toggle

---

#### Events
**File:** `src/components/Events.tsx`
**Purpose:** Events listing

**Features:**
- Event cards
- Date display
- Location
- Registration button

---

#### Activities
**File:** `src/components/Activities.tsx`
**Purpose:** Activities listing

**Features:**
- Activity cards
- Category tags
- Pricing
- Difficulty level

---

#### EventCalendar
**File:** `src/components/EventCalendar.tsx`
**Purpose:** Basic event calendar

**Features:**
- Month view
- Event markers
- Click to view details

---

#### EventsActivitiesCalendar
**File:** `src/components/EventsActivitiesCalendar.tsx`
**Purpose:** Combined events and activities calendar

**Features:**
- Multiple views (month, week, day)
- Filter by type
- Color coding

---

#### SmartEventCalendar
**File:** `src/components/SmartEventCalendar.tsx`
**Purpose:** AI-powered event calendar

**Features:**
- Event recommendations
- Smart filtering
- User preferences
- Conflict detection

---

#### Contact
**File:** `src/components/Contact.tsx`
**Purpose:** Contact form and info

**Features:**
- Contact form (name, email, message)
- Office address
- Phone and email
- Office hours
- Map location

---

#### Breadcrumbs
**File:** `src/components/Breadcrumbs.tsx`
**Purpose:** Navigation breadcrumbs

**Features:**
- Current page path
- Clickable ancestors
- Auto-generation from route

---

#### CookieConsent
**File:** `src/components/CookieConsent.tsx`
**Purpose:** Cookie consent banner

**Features:**
- Accept/reject cookies
- Customize preferences
- Link to cookie policy

---

#### DonateDrawer
**File:** `src/components/DonateDrawer.tsx`
**Purpose:** Donation drawer

**Features:**
- Donation form
- Amount selection
- Payment integration
- Thank you message

---

#### PresidentMessage
**File:** `src/components/PresidentMessage.tsx`
**Purpose:** President's message section

**Features:**
- President photo
- Message text
- Signature

---

#### OurPartners
**File:** `src/components/OurPartners.tsx`
**Purpose:** Partner logos display

**Features:**
- Partner logos
- Partner links
- Carousel/grid layout

---

### Admin Components

#### MediaUpload
**File:** `src/components/admin/MediaUpload.tsx`
**Purpose:** Media upload component for admin

**Features:**
- Drag-and-drop upload
- Multiple file upload
- Preview thumbnails
- Progress bar
- File type validation
- Image cropping

---

#### BulkOperations
**File:** `src/components/admin/BulkOperations.tsx`
**Purpose:** Bulk operations for admin tables

**Features:**
- Select all/none
- Bulk delete
- Bulk status change
- Bulk export

---

### UI Components

Located in `src/components/ui/`, these are shadcn/ui components:

- **accordion** - Collapsible sections
- **alert-dialog** - Modal alerts
- **alert** - Notification alerts
- **aspect-ratio** - Maintain aspect ratio
- **avatar** - User avatars
- **badge** - Status badges
- **breadcrumb** - Navigation breadcrumbs
- **button** - Buttons
- **calendar** - Date picker
- **card** - Content cards
- **carousel** - Image carousels
- **chart** - Charts and graphs
- **checkbox** - Checkboxes
- **collapsible** - Collapsible content
- **command** - Command palette
- **context-menu** - Right-click menus
- **dialog** - Modal dialogs
- **drawer** - Side drawers
- **dropdown-menu** - Dropdown menus
- **form** - Form components
- **hover-card** - Hover popups
- **input-otp** - OTP input
- **input** - Text inputs
- **label** - Form labels
- **menubar** - Menu bars
- **navigation-menu** - Navigation menus
- **pagination** - Page navigation
- **popover** - Popovers
- **progress** - Progress bars
- **radio-group** - Radio buttons
- **resizable** - Resizable panels
- **scroll-area** - Scrollable areas
- **select** - Select dropdowns
- **separator** - Dividers
- **sheet** - Side sheets
- **sidebar** - Sidebars
- **skeleton** - Loading skeletons
- **slider** - Range sliders
- **sonner** - Toast notifications
- **switch** - Toggle switches
- **table** - Data tables
- **tabs** - Tabbed content
- **textarea** - Multi-line text input
- **toast** - Toast notifications
- **toaster** - Toast container
- **toggle-group** - Toggle button groups
- **toggle** - Toggle buttons
- **tooltip** - Tooltips
- **use-toast** - Toast hook

---

## Database Schema

### User & Authentication Tables

#### sessions
**Purpose:** Store user sessions

| Column | Type | Description |
|--------|------|-------------|
| sid | VARCHAR(255) | Session ID (Primary Key) |
| sess | JSON | Session data |
| expires | TIMESTAMP | Session expiration |

**Indexes:**
- IDX_session_expire on expires

---

#### users
**Purpose:** User accounts

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | User ID (Primary Key, UUID) |
| username | VARCHAR(255) | Username (Unique) |
| password | VARCHAR(255) | Hashed password |
| email | VARCHAR(255) | Email address (Unique) |
| firstName | VARCHAR(255) | First name |
| lastName | VARCHAR(255) | Last name |
| profileImageUrl | VARCHAR(500) | Profile image URL |
| bio | TEXT | User bio |
| phone | VARCHAR(50) | Phone number |
| location | VARCHAR(255) | User location |
| interests | JSON | Array of interests |
| isAdmin | BOOLEAN | Admin flag (default: false) |
| createdAt | TIMESTAMP | Account creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- One to many: ownedClubs, memberships, eventParticipations, reviews, uploadedImages

---

### Club Management Tables

#### clubs
**Purpose:** Club profiles

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Club ID (Primary Key, Auto-increment) |
| name | VARCHAR(255) | Club name (Not Null) |
| description | TEXT | Short description (Not Null) |
| longDescription | TEXT | Detailed description |
| image | VARCHAR(500) | Club image URL |
| location | VARCHAR(255) | Club location (Not Null) |
| memberCount | INT | Number of members (default: 0) |
| features | JSON | Array of features |
| contactPhone | VARCHAR(50) | Contact phone |
| contactEmail | VARCHAR(255) | Contact email |
| website | VARCHAR(500) | Website URL |
| socialMedia | JSON | Social media links |
| rating | INT | Club rating (default: 5) |
| established | VARCHAR(100) | Year established |
| isActive | BOOLEAN | Active status (default: true) |
| latitude | DECIMAL(9,6) | Location latitude |
| longitude | DECIMAL(9,6) | Location longitude |
| ownerId | VARCHAR(255) | Owner user ID (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: owner (users)
- One to many: memberships, events, gallery, reviews

---

#### clubMemberships
**Purpose:** User-club relationships

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Membership ID (Primary Key, Auto-increment) |
| userId | VARCHAR(255) | User ID (Foreign Key, Not Null) |
| clubId | INT | Club ID (Foreign Key, Not Null) |
| role | VARCHAR(50) | Role (member/moderator/admin, default: member) |
| joinedAt | TIMESTAMP | Join date |
| isActive | BOOLEAN | Active status (default: true) |

**Relations:**
- Many to one: user (users), club (clubs)

---

#### clubEvents
**Purpose:** Events organized by clubs

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Event ID (Primary Key, Auto-increment) |
| clubId | INT | Club ID (Foreign Key, Not Null) |
| title | VARCHAR(255) | Event title (Not Null) |
| description | TEXT | Event description |
| eventDate | TIMESTAMP | Event date (Not Null) |
| location | VARCHAR(255) | Event location |
| maxParticipants | INT | Maximum participants |
| currentParticipants | INT | Current participants (default: 0) |
| status | VARCHAR(20) | Status (upcoming/ongoing/completed/cancelled, default: upcoming) |
| createdBy | VARCHAR(255) | Creator user ID (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: club (clubs), creator (users)
- One to many: participants

---

#### eventParticipants
**Purpose:** Track event participants

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Participant ID (Primary Key, Auto-increment) |
| eventId | INT | Event ID (Foreign Key, Not Null) |
| userId | VARCHAR(255) | User ID (Foreign Key, Not Null) |
| registeredAt | TIMESTAMP | Registration date |
| attended | BOOLEAN | Attendance status (default: false) |

**Relations:**
- Many to one: event (clubEvents), user (users)

---

#### clubGallery
**Purpose:** Club images

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Gallery ID (Primary Key, Auto-increment) |
| clubId | INT | Club ID (Foreign Key, Not Null) |
| imageUrl | VARCHAR(500) | Image URL (Not Null) |
| caption | VARCHAR(255) | Image caption |
| uploadedBy | VARCHAR(255) | Uploader user ID (Foreign Key) |
| uploadedAt | TIMESTAMP | Upload date |

**Relations:**
- Many to one: club (clubs), uploader (users)

---

#### clubReviews
**Purpose:** Club reviews

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Review ID (Primary Key, Auto-increment) |
| clubId | INT | Club ID (Foreign Key, Not Null) |
| userId | VARCHAR(255) | User ID (Foreign Key, Not Null) |
| rating | INT | Rating (Not Null) |
| comment | TEXT | Review comment |
| createdAt | TIMESTAMP | Creation date |

**Relations:**
- Many to one: club (clubs), user (users)

---

### Booking Tables

#### bookingEvents
**Purpose:** Bookable events/experiences

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Event ID (Primary Key) |
| title | VARCHAR(255) | Event title (Not Null) |
| subtitle | VARCHAR(255) | Event subtitle |
| description | TEXT | Event description (Not Null) |
| location | VARCHAR(255) | Event location (Not Null) |
| duration | VARCHAR(100) | Duration |
| price | INT | Price (Not Null) |
| originalPrice | INT | Original price (before discount) |
| rating | INT | Rating (default: 5) |
| reviewCount | INT | Number of reviews (default: 0) |
| category | VARCHAR(100) | Event category |
| languages | JSON | Available languages (default: ['English']) |
| ageRange | VARCHAR(100) | Age range |
| groupSize | VARCHAR(100) | Group size |
| cancellationPolicy | TEXT | Cancellation policy |
| images | JSON | Array of image URLs |
| highlights | JSON | Array of highlights |
| included | JSON | What's included |
| notIncluded | JSON | What's not included |
| schedule | JSON | Event schedule |
| isActive | BOOLEAN | Active status (default: true) |
| createdBy | VARCHAR(255) | Creator user ID (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: creator (users)

---

#### bookingPageSettings
**Purpose:** Booking page configuration

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key) |
| title | VARCHAR(255) | Page title (Not Null) |
| subtitle | VARCHAR(255) | Page subtitle |
| headerBackgroundImage | VARCHAR(500) | Header background image |
| footerText | TEXT | Footer text |
| contactEmail | VARCHAR(255) | Contact email |
| contactPhone | VARCHAR(50) | Contact phone |
| enableReviews | BOOLEAN | Enable reviews (default: true) |
| enableSimilarEvents | BOOLEAN | Enable similar events (default: true) |
| enableImageGallery | BOOLEAN | Enable image gallery (default: true) |
| maxParticipants | INT | Max participants (default: 25) |
| minimumBookingHours | INT | Minimum booking hours (default: 24) |
| customCss | TEXT | Custom CSS |
| seoTitle | VARCHAR(255) | SEO title |
| seoDescription | TEXT | SEO description |
| updatedAt | TIMESTAMP | Last update date |

---

### CMS Tables

#### themeSettings
**Purpose:** Global theme settings

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key, default: "default") |
| primaryColor | VARCHAR(7) | Primary color hex (default: #112250) |
| secondaryColor | VARCHAR(7) | Secondary color hex (default: #D8C18D) |
| customCss | TEXT | Custom CSS |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: updatedBy (users)

---

#### mediaAssets
**Purpose:** Uploaded media files

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Asset ID (Primary Key, Auto-increment) |
| fileName | VARCHAR(255) | Original file name (Not Null) |
| fileType | VARCHAR(50) | File type (Not Null) |
| fileUrl | VARCHAR(1000) | File URL (Not Null) |
| thumbnailUrl | VARCHAR(1000) | Thumbnail URL |
| altText | VARCHAR(500) | Alt text for accessibility |
| focalPoint | JSON | Focal point coordinates |
| metadata | JSON | File metadata |
| uploadedBy | VARCHAR(255) | Uploader user ID (Foreign Key) |
| createdAt | TIMESTAMP | Upload date |

**Relations:**
- Many to one: uploadedBy (users)
- Referenced by: navbarSettings, heroSettings, landingSections, focusItems, teamMembers, landingTestimonials, seoSettings

---

#### navbarSettings
**Purpose:** Navigation bar configuration

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key, default: "default") |
| logoType | VARCHAR(20) | Logo type (image/svg/text, default: "image") |
| logoImageId | INT | Logo image ID (Foreign Key to mediaAssets) |
| logoSvg | TEXT | SVG logo code |
| logoText | VARCHAR(255) | Text logo |
| navigationLinks | JSON | Array of navigation links |
| showLanguageSwitcher | BOOLEAN | Show language switcher (default: true) |
| availableLanguages | JSON | Available languages (default: ['EN', 'FR', 'AR']) |
| showDarkModeToggle | BOOLEAN | Show dark mode toggle (default: true) |
| loginButtonText | VARCHAR(100) | Login button text (default: "Login") |
| loginButtonLink | VARCHAR(500) | Login button link (default: "/admin/login") |
| showLoginButton | BOOLEAN | Show login button (default: true) |
| joinButtonText | VARCHAR(100) | Join button text (default: "Join Us") |
| joinButtonLink | VARCHAR(500) | Join button link (default: "/join") |
| joinButtonStyle | VARCHAR(50) | Join button style (default: "secondary") |
| showJoinButton | BOOLEAN | Show join button (default: true) |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: logoImageId (mediaAssets), updatedBy (users)

---

#### heroSettings
**Purpose:** Hero section configuration

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key, default: "default") |
| title | TEXT | Hero title (Not Null) |
| subtitle | TEXT | Hero subtitle (Not Null) |
| primaryButtonText | VARCHAR(100) | Primary button text (default: "Start Your Journey") |
| primaryButtonLink | VARCHAR(500) | Primary button link (default: "/discover") |
| secondaryButtonText | VARCHAR(100) | Secondary button text (default: "Explore Clubs") |
| secondaryButtonLink | VARCHAR(500) | Secondary button link (default: "/clubs") |
| backgroundType | VARCHAR(20) | Background type (image/video, default: "image") |
| backgroundMediaId | INT | Background media ID (Foreign Key to mediaAssets) |
| backgroundOverlayColor | VARCHAR(50) | Overlay color (default: "rgba(26, 54, 93, 0.7)") |
| backgroundOverlayOpacity | INT | Overlay opacity (default: 70) |
| titleFontSize | VARCHAR(50) | Title font size (default: "65px") |
| titleColor | VARCHAR(50) | Title color (default: "#ffffff") |
| subtitleFontSize | VARCHAR(50) | Subtitle font size (default: "20px") |
| subtitleColor | VARCHAR(50) | Subtitle color (default: "#ffffff") |
| enableTypewriter | BOOLEAN | Enable typewriter effect (default: true) |
| typewriterTexts | JSON | Array of typewriter texts |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: backgroundMediaId (mediaAssets), updatedBy (users)

---

#### landingSections
**Purpose:** Landing page sections

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Section ID (Primary Key, Auto-increment) |
| slug | VARCHAR(100) | Section slug (Not Null, Unique) |
| title | VARCHAR(255) | Section title (Not Null) |
| sectionType | VARCHAR(50) | Section type (Not Null) |
| ordering | INT | Display order (default: 0, Not Null) |
| isActive | BOOLEAN | Active status (default: true) |
| backgroundColor | VARCHAR(50) | Background color |
| backgroundMediaId | INT | Background media ID (Foreign Key to mediaAssets) |
| titleFontSize | VARCHAR(50) | Title font size (default: "32px") |
| titleColor | VARCHAR(50) | Title color (default: "#112250") |
| customCss | TEXT | Custom CSS |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: backgroundMediaId (mediaAssets), updatedBy (users)
- One to many: blocks (sectionBlocks)

---

#### sectionBlocks
**Purpose:** Content blocks for landing sections

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Block ID (Primary Key, Auto-increment) |
| sectionId | INT | Section ID (Foreign Key to landingSections, Not Null) |
| blockType | VARCHAR(50) | Block type (Not Null) |
| ordering | INT | Display order (default: 0, Not Null) |
| content | JSON | Block content (Not Null) |
| isActive | BOOLEAN | Active status (default: true) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: sectionId (landingSections)

---

#### focusItems
**Purpose:** "Our Focus" section items

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Item ID (Primary Key, Auto-increment) |
| title | VARCHAR(255) | Item title (Not Null) |
| icon | VARCHAR(100) | Icon name |
| description | TEXT | Item description (Not Null) |
| ordering | INT | Display order (default: 0, Not Null) |
| isActive | BOOLEAN | Active status (default: true) |
| mediaId | INT | Media ID (Foreign Key to mediaAssets) |
| createdBy | VARCHAR(255) | Creator user ID (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: mediaId (mediaAssets), createdBy (users)

---

#### teamMembers
**Purpose:** Team members

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Member ID (Primary Key, Auto-increment) |
| name | VARCHAR(255) | Member name (Not Null) |
| role | VARCHAR(255) | Member role (Not Null) |
| bio | TEXT | Member bio |
| photoId | INT | Photo ID (Foreign Key to mediaAssets) |
| email | VARCHAR(255) | Email address |
| phone | VARCHAR(50) | Phone number |
| socialLinks | JSON | Social media links |
| ordering | INT | Display order (default: 0, Not Null) |
| isActive | BOOLEAN | Active status (default: true) |
| createdBy | VARCHAR(255) | Creator user ID (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: photoId (mediaAssets), createdBy (users)

---

#### landingTestimonials
**Purpose:** General testimonials

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Testimonial ID (Primary Key, Auto-increment) |
| name | VARCHAR(255) | Name (Not Null) |
| role | VARCHAR(255) | Role |
| photoId | INT | Photo ID (Foreign Key to mediaAssets) |
| rating | INT | Rating (default: 5) |
| feedback | TEXT | Testimonial feedback (Not Null) |
| isApproved | BOOLEAN | Approval status (default: false) |
| isActive | BOOLEAN | Active status (default: true) |
| ordering | INT | Display order (default: 0, Not Null) |
| userId | VARCHAR(255) | User ID (Foreign Key, optional) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: photoId (mediaAssets), userId (users)

---

#### siteStats
**Purpose:** Site statistics

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Stat ID (Primary Key, Auto-increment) |
| label | VARCHAR(255) | Stat label (Not Null) |
| value | VARCHAR(100) | Stat value (Not Null) |
| icon | VARCHAR(100) | Icon name |
| suffix | VARCHAR(20) | Value suffix (e.g., "+", "K") |
| ordering | INT | Display order (default: 0, Not Null) |
| isActive | BOOLEAN | Active status (default: true) |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: updatedBy (users)

---

#### contactSettings
**Purpose:** Contact information

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key, default: "default") |
| officeAddress | TEXT | Office address |
| email | VARCHAR(255) | Contact email |
| phone | VARCHAR(50) | Contact phone |
| officeHours | TEXT | Office hours |
| mapLatitude | DECIMAL(9,6) | Map latitude |
| mapLongitude | DECIMAL(9,6) | Map longitude |
| formRecipients | JSON | Form recipients array |
| autoReplyEnabled | BOOLEAN | Auto-reply enabled (default: false) |
| autoReplyMessage | TEXT | Auto-reply message |
| socialLinks | JSON | Social media links |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: updatedBy (users)

---

#### footerSettings
**Purpose:** Footer configuration

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key, default: "default") |
| copyrightText | VARCHAR(500) | Copyright text |
| description | TEXT | Footer description |
| links | JSON | Footer links array |
| socialLinks | JSON | Social media links |
| newsletterEnabled | BOOLEAN | Newsletter enabled (default: true) |
| newsletterTitle | VARCHAR(255) | Newsletter section title |
| newsletterDescription | TEXT | Newsletter description |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: updatedBy (users)

---

#### seoSettings
**Purpose:** SEO configuration

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(255) | Settings ID (Primary Key, default: "default") |
| siteTitle | VARCHAR(255) | Site title |
| siteDescription | TEXT | Site description |
| keywords | TEXT | SEO keywords |
| ogImage | INT | Open Graph image ID (Foreign Key to mediaAssets) |
| twitterHandle | VARCHAR(100) | Twitter handle |
| googleAnalyticsId | VARCHAR(100) | Google Analytics ID |
| facebookPixelId | VARCHAR(100) | Facebook Pixel ID |
| customHeadCode | TEXT | Custom head code |
| customBodyCode | TEXT | Custom body code |
| updatedBy | VARCHAR(255) | User who updated (Foreign Key) |
| updatedAt | TIMESTAMP | Last update date |

**Relations:**
- Many to one: ogImage (mediaAssets), updatedBy (users)

---

## Integration Setup

The application has the following integrations configured but requiring setup:

1. **javascript_log_in_with_replit** (v1.0.0)
   - Replit OAuth authentication
   - Status: Needs Setup

2. **javascript_database** (v1.0.0)
   - Database integration
   - Status: Needs Setup

3. **javascript_stripe** (v1.0.0)
   - Stripe payment processing
   - Status: Needs Setup

4. **javascript_paypal** (v1.0.0)
   - PayPal payment processing
   - Status: Needs Setup

---

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.8.3
- Vite 7.1.12
- React Router DOM 6.30.1
- TailwindCSS 3.4.17
- Shadcn/ui components
- Framer Motion 12.23.24
- React Query 5.83.0
- MapLibre GL 5.7.3
- Recharts 2.15.4
- Socket.io Client 4.8.1

### Backend
- Node.js with Express 5.1.0
- TypeScript with TSX 4.20.5
- Drizzle ORM 0.44.7
- MySQL2 3.15.3
- Passport.js 0.7.0 (Local strategy)
- Express Session 1.18.2
- BCrypt.js 3.0.2
- Socket.io 4.8.1

### Payment
- Stripe 18.5.0
- @stripe/react-stripe-js 4.0.2
- PayPal Server SDK 1.1.0

### Dev Tools
- ESLint 9.32.0
- PostCSS 8.5.6
- Autoprefixer 10.4.21
- Concurrently 9.2.1

---

## Project Structure

```
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   └── ui/          # UI library components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   │   └── admin/       # Admin pages
│   └── types/           # TypeScript types
├── server/              # Backend server code
├── shared/              # Shared code (schema, types)
├── public/              # Public static files
└── backend/             # Additional backend code
```

---

## Notes

- The application is built for a Moroccan journey/club association
- Supports multiple languages (EN, FR, AR)
- Features a comprehensive CMS for content management
- Includes payment processing for bookings and donations
- Has a complete club management system
- Includes event management and calendar features
- Mobile-responsive design
- Dark mode support
- SEO optimized
- Cookie consent management
