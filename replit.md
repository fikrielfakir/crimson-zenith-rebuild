# Morocco Clubs Website

## Overview
A React + Vite frontend application designed to showcase Morocco's sports clubs and activities. It features an interactive map, event calendar, club information, and a comprehensive content management system. The project aims to provide a modern, responsive platform for clubs and users, with advanced administrative capabilities for content and user management.

## Recent Changes (November 21, 2025)
- **Enhanced Navbar Dropdown System**: Added flexible dropdown display types to navbar customization system while preserving original "Discover" and "Talents" dropdown designs. The admin panel (`/admin/customization/navbar`) now supports three dropdown display modes:
  - **Simple List**: Clean text-only links (default)
  - **List with Images**: Vertical list with thumbnail images beside each item
  - **Carousel/Slide**: Horizontal scrollable carousel with image cards, navigation arrows, and dot indicators
  - Admins can upload images from media library, add descriptions, and configure dropdown types per navigation item
  - Original hardcoded dropdowns for "Discover" (cities carousel) and "Talents" (nested menu) are preserved for backward compatibility
  - New `DropdownRenderer` component dynamically handles all three display types with graceful fallbacks

## Recent Changes (November 20, 2025)
- **Events & Activities Calendar Data Source Update**: Modified EventsActivitiesCalendar component to fetch data from the unified `booking_events` table instead of multiple endpoints. Updated backend `getBookingEvents()` method to include club information via LEFT JOIN with clubs table. The component now supports flexible date handling (both eventDate and startDate/endDate formats) and displays all events (association and club events) from a single source of truth.
- **Event Details Page Rebuild**: Completely redesigned Book.tsx with condensed hero section (h-64), three-column layout with satellite map on the right side, and date range selector that derives valid booking dates from each event's startDate/endDate fields.
- **Database Schema Updates**: Added latitude, longitude, startDate, and endDate fields to booking_events table with idempotent migration and data backfill for existing events (Atlas Mountains, Sahara Desert, Atlantic Coast).
- **Map Integration**: Implemented MapLibre GL satellite map integration on event details page showing event location with Esri World Imagery tiles.

## User Preferences
- Follows modern React patterns with TypeScript
- Uses shadcn/ui component library
- Maintains responsive design principles

## System Architecture
The application is a full-stack project utilizing a React + TypeScript + Vite frontend and an Express.js backend.
-   **Frontend**: React, TypeScript, Vite, React Router DOM for routing, TanStack Query for state management, and Tailwind CSS for styling. UI components are built with shadcn/ui and Radix UI primitives. Map integration is handled by MapLibre GL JS with free Esri satellite imagery.
-   **Backend**: Express.js server providing RESTful APIs.
-   **Database**: MySQL (Hostinger) is the primary database, managed with Drizzle ORM and the mysql2 driver. The schema includes 23 tables for clubs, events, users, CMS content, and more. PostgreSQL environment variables exist in Replit but are not utilized.
    -   **Clubs Table Schema**: Includes all required fields: name, slug, location, short description (description), long description (long_description), images (image), logo, established, phone (contact_phone), email (contact_email), website, latitude, longitude, social media (social_media), and is_active status.
    -   **Dual Event System**: The database implements two separate event systems:
        -   `club_events` table: Club-specific events managed by individual clubs and displayed on club detail pages via `/api/clubs/:id/events` endpoint
        -   `booking_events` table: Journey-wide bookable events for the organization, managed through admin panel
-   **UI/UX Decisions**: The application adopts a modern, responsive design with a consistent theme using primary color #112250 (navy blue) and secondary color #D8C18D (gold/beige). The Events & Activities Calendar section features a clean, modern design with yellow accents (#FBBF24) and orange pricing (#F97316), Inter/Poppins typography, and perfect vertical alignment between the calendar sidebar and event cards. The admin interface is comprehensive, featuring sidebar navigation, form validation, and error handling.
-   **Key Features**:
    -   **Public Website**: Interactive map with club locations, event calendar, club listings, contact form, testimonials, and responsive design. The landing page features sections in the following order: Hero, "Message from the President", "Our Mission & Focus", "Our Clubs & Initiatives", "Events & Activities Calendar", "Our Impact", "Member Stories", "Our Partners & Supporters", and Contact form. This structure follows professional association website best practices for clarity and narrative flow.
        -   **Club Detail Pages**: Slug-based routing for individual club pages (`/clubs/:slug`). Each page displays comprehensive club information including location on interactive map, club-specific events, contact details, and social media links. Data is fetched from MySQL database using the `/api/clubs/slug/:slug` endpoint implemented in server.ts.
    -   **Rebuilt Admin Interface** (November 2025): Completely rebuilt with modern React patterns, accessible via `/admin/login`.
        -   **Authentication**: Secure login with ProtectedRoute component for role-based access control
        -   **AdminLayout**: Responsive layout with collapsible sidebar, breadcrumbs, search, notifications, and theme toggle
        -   **Dashboard**: Comprehensive overview with metrics cards (users, clubs, events, revenue), charts (user growth, revenue), activity feed, and quick actions
        -   **Analytics**: Multi-tab analytics interface with traffic, users, events, revenue, and clubs metrics
        -   **User Management**: Full CRUD operations with search, filters, bulk actions (activate/deactivate/delete), and form dialogs with validation
        -   **Clubs Management**: Table and map views with approval workflow, search, and filters. Individual club pages now display club-specific events from the `club_events` table.
        -   **Journey Events Management**: Manages organization-wide bookable events from the `booking_events` table (Journey events)
        -   **Booking Management**: Booking administration and tracking
        -   **Content Management**: News management, landing page CMS, media library
        -   **Email Campaigns**: Campaign creation and tracking interface
        -   **System Monitoring**: Server health, performance metrics, and logs
        -   **Settings Pages**: Site settings, theme customization, payment configuration, authentication settings, cookie preferences, join us configuration
        -   **Nested Routes**: User roles management (/admin/users/roles), pending club approvals (/admin/clubs/pending)
        -   All pages use shadcn/ui components with proper form validation, error handling, and responsive design
    -   **Join Us Application System**: Professional application form with validation and a comprehensive admin review system for managing applications.
-   **Development Workflow**: `npm run dev` for concurrent frontend (port 5000) and backend (port 3001) execution. `npm run build` for production build and `npm run start` to serve built files.
-   **Deployment**: Configured for autoscale deployment with `npm run build` as the build command and `npm run start` as the start command.

## External Dependencies
-   **Database**: MySQL (Hostinger)
-   **ORM**: Drizzle ORM
-   **UI Components**: shadcn/ui, Radix UI
-   **Mapping**: MapLibre GL JS (with Esri satellite tiles)
-   **Frontend Framework**: React
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Routing**: React Router DOM
-   **State Management**: TanStack Query
-   **Backend Framework**: Express.js
-   **Database Driver**: mysql2