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
- **September 25, 2025**: **MAJOR FEATURE ADDITION** - Comprehensive Advanced Admin Interface
  - Added Analytics Dashboard with traffic analysis, user engagement metrics, and performance insights
  - Implemented User Management system with roles, permissions, and bulk operations
  - Created Media Library with file upload, organization, and management capabilities
  - Built Email Campaign Management with subscriber tracking and campaign analytics
  - Added System Monitoring with real-time metrics, service health, and log management
  - Enhanced admin navigation with 10 comprehensive admin sections
  - All admin features use modern React patterns with TypeScript and shadcn/ui components
  - Professional admin interface ready for backend integration

- **September 24, 2025**: Fresh GitHub import successfully set up and verified
- Resolved missing dependencies by installing concurrently and running full `npm install`
- Verified development workflow ("Dev Server") running successfully on port 5000
- Backend Express server running on port 3001 for image serving API
- Confirmed Vite configuration properly set for Replit environment (host: 0.0.0.0, allowedHosts: true)
- Tested application loads correctly in Replit proxy environment showing ATJ logo and "Explore Morocco's Best Sports Clubs" header
- Configured autoscale deployment (build: `npm run build`, start: `npm run start`)
- All LSP diagnostics resolved - code is clean and error-free
- All setup tasks completed - application is fully functional and ready for development and deployment

## User Preferences
- Follows modern React patterns with TypeScript
- Uses shadcn/ui component library
- Maintains responsive design principles