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