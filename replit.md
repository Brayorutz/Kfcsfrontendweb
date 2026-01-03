# Kabianga Farmers Cooperative Society (KFCS) Website

## Overview

This is a full-stack web application for Kabianga Farmers Cooperative Society Limited, a dairy farming cooperative based in Kericho County, Kenya. The platform serves multiple purposes:

- **Public-facing website** showcasing the cooperative's products, mission, and services
- **Member portal** for existing members to access statements, loans, and account information
- **Admin dashboard** for managing members, content, and operations
- **E-commerce shop** for ordering dairy products (milk, yoghurt)
- **Membership application system** for new farmers to join the cooperative

The application is built with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and interactive elements
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based structure under `client/src/pages/` with reusable components in `client/src/components/`. Path aliases are configured: `@/` maps to `client/src/`, `@shared/` maps to `shared/`.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Structure**: RESTful endpoints under `/api/` prefix
- **Session Management**: Express-session with connect-pg-simple for PostgreSQL session storage
- **Password Hashing**: bcrypt for secure credential storage

The server code is organized with:
- `server/index.ts` - Main entry point and middleware setup
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Database access layer (implements IStorage interface)
- `server/db.ts` - Database connection configuration

### Data Layer
- **Schema Definition**: `shared/schema.ts` contains all Drizzle table definitions
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Key Entities**: Users, Members, Products, Orders, News, Loans, Admin accounts, Member statements

### Build System
- Development: Vite dev server for frontend, tsx for backend hot-reloading
- Production: Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations stored in `/migrations` directory
- Push schema changes with `npm run db:push`

### Third-Party UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Recharts**: Data visualization for investor relations charts
- **Embla Carousel**: Product carousels and image galleries

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner
- Custom `vite-plugin-meta-images.ts`: Updates OpenGraph meta tags for deployment

### Asset Management
- Static assets served from `attached_assets/` directory
- Product images and generated images stored in `attached_assets/generated_images/`
- Public static files in `client/public/`

### Fonts
- Google Fonts: Inter (sans-serif) and Playfair Display (serif) loaded via CDN