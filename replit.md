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

- **September 25, 2025**: Fresh GitHub import successfully set up and verified in Replit environment
- Successfully resolved all missing dependencies by running full `npm install`
- Verified development workflow ("Dev Server") running successfully with concurrent setup
- Frontend Vite server running on port 5000 (properly configured for Replit proxy with host: 0.0.0.0, allowedHosts: true)
- Backend Express server running on port 3001 for image serving API with health check endpoint
- All LSP TypeScript diagnostics resolved - code is clean and error-free
- Configured autoscale deployment (build: `npm run build`, start: `npm run start`)
- Tested both frontend and backend components - all endpoints responding correctly
- All setup tasks completed - application is fully functional and ready for development and deployment

## User Preferences
- Follows modern React patterns with TypeScript
- Uses shadcn/ui component library
- Maintains responsive design principles