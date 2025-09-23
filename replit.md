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
- Interactive Morocco map with club locations
- Event calendar
- Club listings with member statistics
- Contact form
- Testimonials
- Responsive design with modern UI components

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Production**: `npm run start` (serves built files)

## Deployment
- **Target**: Autoscale deployment
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Recent Changes
- Configured Vite to run on port 5000 with host 0.0.0.0 for Replit compatibility
- Added `allowedHosts: true` to Vite config to fix blocked request errors in Replit proxy environment
- Added production start script using `vite preview`
- Verified build process and deployment readiness

## User Preferences
- Follows modern React patterns with TypeScript
- Uses shadcn/ui component library
- Maintains responsive design principles