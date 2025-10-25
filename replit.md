# Overview

This is a professional portfolio web application built with React, TypeScript, and Vite. The application showcases projects, work experience, skills, competitions, endorsements, and professional profiles across various platforms. It features a modern, responsive design with interactive components and supports both GitHub integration and manual project uploads.

The portfolio serves as a comprehensive digital resume and project showcase, allowing users to present their work in a visually appealing and organized manner.

## Recent Changes (October 25, 2025)

### GitHub Integration Enhancement
- Created Express.js backend server (port 5001) to handle GitHub API calls securely
- Implemented proper token retrieval using Replit's GitHub connector
- Added search and scroll functionality for repository selection
- Repositories now automatically fetch live demo URLs from GitHub homepage field
- GitHub logo set as default cover image for all imported projects

### File Upload & Display
- Added attachments section to project details dialog
- Uploaded files (PDF, PPT, DOCX, images) now display with preview and download options
- Form data properly resets when dialog is closed or canceled

### Architecture Updates
- Frontend (Vite) runs on port 5000
- Backend (Express) runs on port 3001
- Vite proxy configured to forward /api requests to backend
- Both servers run concurrently via `bun run dev` command
- Frontend uses relative URLs (/api/*) for API calls to work across all hosting platforms

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build Tool**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR and optimized builds
- **React Router** for client-side routing (single-page application)

**UI Component System**
- **Shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for managing component variants
- **Manrope** custom font for typography

**State Management & Data Fetching**
- **TanStack Query** (React Query) for server state management and caching
- **localStorage** for persisting user-created projects
- Custom hooks (`useProjectStorage`) for managing portfolio data

**Design System**
- HSL-based color system with CSS variables for theming
- Light/dark mode support via `next-themes`
- Consistent spacing, typography, and component styling through Tailwind configuration
- Custom gradient colors for portfolio-specific branding

## Backend Architecture

**Server Framework**
- **Express.js** server running on port 5001
- **Bun** runtime for executing TypeScript server code
- **CORS** enabled for cross-origin requests from the frontend

**API Proxy Pattern**
- Vite development server proxies `/api` requests to backend (port 5001)
- Backend acts as a secure intermediary for GitHub API calls
- Prevents exposure of authentication tokens to the client

**Authentication Flow**
- Uses Replit Connectors system for GitHub OAuth
- Server retrieves access tokens via environment variables (`REPL_IDENTITY`, `WEB_REPL_RENEWAL`)
- Tokens are cached and refreshed automatically when expired
- Access tokens never exposed to frontend

## External Dependencies

### Third-Party APIs

**GitHub API Integration**
- **Octokit REST** client for GitHub API interactions
- Fetches authenticated user repositories
- Retrieves repository details including README, languages, and metadata
- Rate-limited by GitHub (typically 5000 requests/hour for authenticated users)
- Backend endpoint: `/api/github/repos` and `/api/github/repos/:owner/:repo`

**Replit Connectors**
- Managed OAuth service for GitHub authentication
- Accessed via `REPLIT_CONNECTORS_HOSTNAME` environment variable
- Handles token refresh and credential management

### File Processing Libraries

**Document Parsing**
- **pdf-lib** - PDF document manipulation and rendering
- **pdfjs-dist** - PDF.js for text extraction and page rendering
- **mammoth** - Microsoft Word document (.docx) to text conversion
- Used for processing uploaded project attachments and extracting content

### UI & Visualization

**Component Libraries**
- **Radix UI** - Accessible, unstyled component primitives (25+ components)
- **React Flow** - Interactive node-based skill tree visualization
- **Embla Carousel** - Touch-friendly carousel for project galleries
- **React Hook Form** with Zod resolvers for form validation
- **React Day Picker** for date selection
- **Lucide React** and **React Icons** for iconography

### Development Tools

**Code Quality**
- **ESLint** with TypeScript support for code linting
- **PostCSS** with Tailwind and Autoprefixer for CSS processing
- **Lovable Tagger** (development-only) for component tracking

### Data Storage

**Client-Side Storage**
- **localStorage** - Persists portfolio projects, skill trees, and user preferences
- Storage key: `portfolio_projects`
- No database required - fully client-side application
- Data survives page refreshes and browser restarts

### Asset Management

**Static Assets**
- Images stored in `/src/assets` and `/public` directories
- Base64 encoding for uploaded file attachments
- Preview generation for PDFs and documents

## Key Architectural Decisions

### Monorepo Structure
- Combined frontend and backend in single repository
- `dev` script runs both servers concurrently using Bun
- Frontend on port 5000, backend on port 5001
- Simplifies deployment and development workflow

### Component-Based Architecture
- Atomic design pattern with reusable UI components
- Separation of concerns: UI components in `/components/ui`, feature components in `/components`
- Type-safe props using TypeScript interfaces
- Custom hooks for shared logic

### Secure API Pattern
- GitHub tokens never exposed to client
- Backend acts as authentication proxy
- Environment-based configuration for different deployment environments

### File Upload Strategy
- Client-side file processing and preview generation
- Base64 encoding for storage without server uploads
- Supports multiple file types (PDF, DOCX, images)
- No external file storage service required

### Skill Visualization
- Interactive node-based skill tree using React Flow
- Visual representation of learning paths and dependencies
- Supports custom categories and progress tracking
- Drag-and-drop interface for organization