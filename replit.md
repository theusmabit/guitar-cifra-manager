# Guitar Tabs & Chords Manager

## Overview

A personal dashboard web application for managing guitar tabs and chords. Users can organize their song collection with features like favoriting, folder organization, transpose functionality, a built-in metronome, and tuner. The application stores all data locally in the browser using localStorage, making it a fully client-side solution with no backend requirements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16 with App Router**: Chosen for server-side rendering capabilities, file-based routing, and React Server Components support. The app uses the new App Router pattern with `app/` directory structure.
- **React 19**: Latest React version for UI rendering with hooks-based state management.
- **TypeScript**: Full type safety across the codebase for better developer experience and fewer runtime errors.

### UI Component System
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives. Components are located in `components/ui/` and should NOT be modified directly.
- **Radix UI**: Provides the underlying unstyled, accessible primitives for all UI components.
- **Tailwind CSS**: Utility-first styling approach with CSS variables for theming. Global styles defined in `app/globals.css`.
- **class-variance-authority (CVA)**: Used for creating component variants with type-safe props.

### State Management
- **React useState/useEffect**: Local component state management.
- **React Context**: Used implicitly through providers (ThemeProvider, SidebarProvider).
- **No external state library**: Application complexity doesn't warrant Redux or similar.

### Data Persistence
- **localStorage**: All song and folder data persists in browser storage via `lib/storage.ts`. No database or backend API.
- **Data Types**: Defined in `lib/types.ts` - `Song` and `Folder` interfaces.

### Key Features Architecture
- **Song Viewer**: Displays song content with transpose functionality (`lib/transpose.ts`), auto-scroll, and two-column mode.
- **Library Management**: CRUD operations for songs with search, filtering, and sorting.
- **Folder System**: Organize songs into custom folders.
- **Tools**: Built-in metronome and tuner components using Web Audio API.
- **Theme System**: Light/dark mode via `next-themes` with system preference detection.

### Routing Structure
- Single page application with view-based navigation managed by `currentView` state in `guitar-tabs-manager.tsx`.
- Views: home, library, favorites, folders, add, settings, song.

### Component Organization
- `components/ui/`: shadcn/ui components (immutable)
- `components/`: Application-specific components
- `hooks/`: Custom React hooks
- `lib/`: Utilities, types, and storage functions

## External Dependencies

### Core Framework
- **next**: 16.0.10 - React framework
- **react/react-dom**: 19.2.0 - UI library

### UI Libraries
- **@radix-ui/***: Multiple packages for accessible UI primitives
- **lucide-react**: Icon library for all application icons
- **tailwindcss**: CSS framework (via tw-animate-css)
- **class-variance-authority**: Component variant management
- **clsx/tailwind-merge**: Utility class merging

### Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation (implied by resolvers)

### Specialized Components
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Calendar/date picker
- **input-otp**: OTP input fields
- **recharts**: Data visualization/charts
- **vaul**: Drawer component
- **cmdk**: Command palette component
- **sonner**: Toast notifications

### Utilities
- **date-fns**: Date manipulation
- **next-themes**: Theme management

### Analytics
- **@vercel/analytics**: Usage analytics (production)

### Data Storage
- **Browser localStorage**: Primary data storage mechanism - no external database