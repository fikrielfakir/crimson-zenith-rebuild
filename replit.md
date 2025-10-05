# Morocco Clubs Website

## Overview
A React + Vite frontend application showcasing Morocco sports clubs and activities. Features an interactive map, event calendar, and club information.

## Project Structure
- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Map Integration**: Mapbox GL JS (requires user-provided API token)

## Key Features

### Public Website
- Interactive Morocco map with club locations
- Event calendar
- Club listings with member statistics
- Contact form
- Testimonials
- Responsive design with modern UI components

### Advanced Admin Interface
**Access:** `/admin/login` (Username: `admin`, Password: `admin123`)

**Core Admin Features:**
- **Dashboard**: Overview with statistics and quick actions
- **CRUD Management**: Complete club, event, and news management with validation
- **Settings**: Site configuration and customization options

**Advanced Admin Features:**
- **Analytics**: Traffic analysis, user engagement, content performance with exportable reports
- **User Management**: Role-based access control, bulk operations, activity tracking
- **Media Library**: File upload/management, grid/list views, search/filtering, storage analytics
- **Email Campaigns**: Newsletter management, subscriber tracking, campaign analytics
- **System Monitoring**: Real-time system metrics, service health, logs, performance tracking

**Technical Features:**
- Protected routes with authentication
- Responsive admin interface with sidebar navigation
- Comprehensive form validation and error handling
- Modern React patterns with TypeScript
- Ready for backend API integration

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Production**: `npm run start` (serves built files)

## Deployment
- **Target**: Autoscale deployment
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Recent Changes

- **October 5, 2025**: **CMS INFRASTRUCTURE COMPLETED** - Dynamic Content Management System
  - **New Color Theme**: Updated entire application with primary color #112250 (navy blue) and secondary color #D8C18D (gold/beige)
  - **CMS Database Architecture**: Comprehensive schema for managing all landing page content
    - `theme_settings`: Global theme configuration (colors, fonts, logos, branding)
    - `hero_settings`: Hero section content (title, subtitle, buttons, background media, typewriter effect)
    - `landing_sections`: Page sections (about, activities, testimonials, stats, events, gallery)
    - `section_blocks`: Individual content blocks within sections (editable text, images, icons)
    - `media_assets`: Centralized media management (images, videos, icons with metadata)
  - **CMS Backend Infrastructure**:
    - Complete CRUD operations in `server/storage.ts` for all CMS entities
    - RESTful API routes in `server.ts`: `/api/cms/hero`, `/api/cms/theme`, etc.
    - Admin-protected endpoints for content updates
  - **Dynamic Hero Component**: 
    - Fully database-driven with support for both image and video backgrounds
    - Typewriter effect for animated text
    - Customizable overlay colors and opacity
    - Editable button texts, links, font sizes, and colors
  - **React Hooks for CMS**: Custom hooks in `src/hooks/useCMS.ts` for fetching and updating CMS data
  - **Status**: CMS backend and Hero component working perfectly. Next steps: build admin UI panel for content editing
  - **Technical Notes**: 
    - Routes defined inline in server.ts (no separate routes.ts file)
    - Server requires restart after adding new routes (tsx doesn't hot-reload route additions)
    - Hero component uses fallback to default values if database returns no data

- **September 25, 2025**: **MAJOR FEATURE ADDITION** - Landing Page Management & Club Application System
  - **Landing Page Management** (`/admin/landing`): Full CRUD interface for managing homepage sections (hero, activities, testimonials, stats, events, about, contact, gallery)
  - **Join Us Application System** (`/join`): Professional application form with validation, club preferences, interests selection, and motivation text
  - **Applications Management** (`/admin/applications`): Comprehensive review system with bulk actions, status management, detailed views, and admin notes
  - **Enhanced Navigation**: "Join Us" button in header now links to application form, added new admin menu items
  - **Complete Data Models**: TypeScript interfaces for sections, applications, form validation with Zod schemas
  - **Modern UX**: React Hook Form integration, responsive design, professional styling matching Morocco theme
  - **Note**: Current implementation uses frontend state management (demonstration/prototype level) - ready for backend integration

- **September 25, 2025**: **Previous Features** - Comprehensive Advanced Admin Interface
  - Added Analytics Dashboard with traffic analysis, user engagement metrics, and performance insights
  - Implemented User Management system with roles, permissions, and bulk operations
  - Created Media Library with file upload, organization, and management capabilities
  - Built Email Campaign Management with subscriber tracking and campaign analytics
  - Added System Monitoring with real-time metrics, service health, and log management
  - Enhanced admin navigation with 12 comprehensive admin sections total
  - All admin features use modern React patterns with TypeScript and shadcn/ui components
  - Professional admin interface ready for backend integration

- **October 4, 2025**: **FRESH GITHUB IMPORT SUCCESSFULLY COMPLETED IN REPLIT** (Latest Setup - Current)
  - **Project Import**: Successfully imported and configured Morocco Clubs website from GitHub in Replit environment
  - **Dependencies**: Resolved all npm dependencies (614 packages installed successfully)
  - **Database Setup**: PostgreSQL database successfully provisioned and schema applied via Drizzle ORM
    - Database tables created with comprehensive schema (users, clubs, events, memberships, reviews, gallery, booking events, booking page settings)
    - Database seeded with sample club data (3 clubs: Atlas Hikers Club, Desert Explorers, Coastal Adventures)
    - Database seeded with booking events data (3 events: Atlas Mountains Trek, Sahara Desert Adventure, Atlantic Coast Surf Camp)
    - Database integration working correctly with full API functionality
  - **Development Workflow**: "Dev Server" workflow configured and running successfully
    - Frontend: Vite + React server on port 5000 (properly configured for Replit proxy with host: 0.0.0.0, allowedHosts: true)
    - Backend: Express.js server on port 3001 for API endpoints and image serving
    - Database: PostgreSQL with Drizzle ORM integration
    - Proxy: Frontend proxies `/api` requests to backend server for seamless development
    - Concurrent execution: Both frontend and backend run simultaneously via npm concurrently
  - **Production Deployment**: Configured autoscale deployment
    - Build Command: `npm run build` (Vite build process)
    - Start Command: `npm run start` (NODE_ENV=production tsx server.ts)
    - Deployment Target: Autoscale (suitable for stateless web application)
  - **Verification**: All components tested and working correctly
    - ✅ Database API successfully retrieving clubs from PostgreSQL (3 clubs confirmed)
    - ✅ Frontend loading and displaying website content properly (hero section, navigation, branding)
    - ✅ Vite HMR (Hot Module Replacement) working correctly
    - ✅ React Router navigation functional
    - ✅ Backend serving API endpoints and placeholder images
    - ✅ PostgreSQL database connected and operational with seeded data
    - ✅ Full stack integration working (frontend + backend + database)
    - ✅ No LSP errors detected in codebase
  - **Status**: Application is fully functional and ready for development and deployment in Replit environment

- **October 3, 2025**: **PREVIOUS GITHUB IMPORT** (Archived)

- **September 28, 2025**: **PREVIOUS GITHUB IMPORT SUCCESSFULLY COMPLETED IN REPLIT** (Archived)

- **September 26, 2025**: **PREVIOUS GITHUB IMPORT SUCCESSFULLY COMPLETED IN REPLIT** (Archived)

- **September 25, 2025**: **ORIGINAL GITHUB IMPORT SUCCESSFULLY COMPLETED IN REPLIT**
  - **Project Setup**: Successfully imported and configured Morocco Clubs website from GitHub
  - **Dependencies**: Resolved all missing dependencies by running full `npm install` (618 packages installed)
  - **Database Setup**: Successfully created PostgreSQL database and applied Drizzle schema migrations
    - Database tables created with comprehensive schema (users, clubs, events, memberships, reviews, gallery)
    - Database seeded with sample club data (3 clubs added automatically)
    - Database integration working correctly with full API functionality
  - **Development Workflow**: "Dev Server" running successfully with concurrent setup
    - Frontend: Vite + React server on port 5000 (properly configured for Replit proxy with host: 0.0.0.0, allowedHosts: true)
    - Backend: Express server on port 3001 for API endpoints and image serving
    - Database: PostgreSQL with Drizzle ORM integration
    - Proxy: Frontend proxies `/api` requests to backend server for seamless development
  - **Production Deployment**: Configured autoscale deployment
    - Build Command: `npm run build` (Vite build process)
    - Start Command: `npm run start` (NODE_ENV=production node server.js)
    - Deployment Target: Autoscale (suitable for stateless web application)
  - **Verification**: All components tested and working correctly
    - ✅ Database API successfully retrieving clubs: "Retrieved 3 clubs from database"
    - ✅ Frontend loading and displaying website content properly (hero section, navigation working)
    - ✅ Vite HMR (Hot Module Replacement) working correctly
    - ✅ React Router navigation functional
    - ✅ Backend serving API endpoints and placeholder images
    - ✅ PostgreSQL database connected and operational
  - **Status**: Application is fully functional and ready for development and deployment in Replit environment

## User Preferences
- Follows modern React patterns with TypeScript
- Uses shadcn/ui component library
- Maintains responsive design principles