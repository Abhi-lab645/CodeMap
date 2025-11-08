# CodeMap - Programming Learning Platform

## Overview

CodeMap is a web-based educational platform that teaches programming through project-based learning. Students master coding by building one large project broken down into hundreds of mini-projects, each with theory, examples, and hands-on coding exercises. The platform features an interactive code workspace, progress tracking, gamification through badges, and an AI tutor assistant.

**Current Status:** Production-Ready with Advanced Features (November 8, 2025)
- Complete PostgreSQL database integration with Drizzle ORM
- Real OpenAI GPT-4 AI Tutor with context-aware assistance
- Full gamification system (XP points, streak tracking, badges)
- End-to-end user journeys verified working
- Protected routes with JWT authentication functional
- Glassmorphism UI design fully implemented
- Comprehensive E2E test coverage passing

## Recent Changes

**November 8, 2025 - Major Feature Rollout:**
- **Database Migration**: PostgreSQL integration complete with Drizzle ORM. All entities (users, projects, progress, badges) persist in database. Idempotent seeding ensures clean initialization.
- **AI Tutor Integration**: Real OpenAI GPT-4o-mini integration with context-aware programming assistance. Markdown rendering with rehype-highlight for code syntax highlighting. Graceful fallback for API quota errors.
- **Gamification System**: XP points (100 per mini-project completion) and streak tracking (consecutive days). Profile page displays total XP, current streak, and longest streak with visual indicators. Backend calculates streaks automatically based on last activity date.
- **Protected Routes**: ProtectedRoute HOC guards authenticated pages. 401 error handling clears expired tokens.
- **Navigation Fixes**: Removed invalid routes, fixed nested `<a>` tags in wouter Links
- **E2E Testing**: Complete user journeys verified: signup → projects → theory → workspace → completion → XP/badges → profile
- All LSP diagnostics resolved

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state
- **UI Library:** Radix UI components with shadcn/ui styling system
- **Styling:** TailwindCSS with custom design tokens
- **Code Editor:** Monaco Editor (VS Code editor component)
- **Forms:** React Hook Form with Zod validation

**Design System:**
- Custom theming with light/dark mode support
- Typography: Inter for UI/text, JetBrains Mono for code
- Glassmorphic and neumorphic design elements
- Consistent spacing using Tailwind's 8px grid system
- Component variants using class-variance-authority

**Key Pages:**
1. **Landing:** Marketing page with hero section and project showcase
2. **Authentication:** Login/signup with JWT-based auth
3. **Projects:** Browse and filter available big projects
4. **Dashboard:** Learning path visualization with mini-project cards
5. **Theory:** Content presentation before coding exercises
6. **Workspace:** Split-pane code editor with task description and output
7. **Profile:** User progress, statistics, and earned badges

**Component Architecture:**
- Reusable UI primitives from Radix UI
- Custom composite components (ProjectCard, MiniProjectCard, BadgeCard, ProgressRing, AITutor)
- ProtectedRoute component wrapping authenticated pages (redirects to /auth if not logged in)
- Theme provider with context-based theme switching
- Auth provider managing user session state (isAuthenticated, user data, login/logout/signup)
- Monaco Editor integration for code display and editing
- All components follow design_guidelines.md (glassmorphism, Inter/JetBrains Mono fonts, consistent spacing)

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express
- **Language:** TypeScript with ES modules
- **Database ORM:** Drizzle ORM
- **Authentication:** JWT tokens with bcrypt password hashing
- **Development:** Vite for development server with HMR

**API Design:**
- RESTful API endpoints under `/api` prefix
- JWT bearer token authentication via Authorization header
- JSON request/response format
- Error handling with appropriate HTTP status codes

**Core API Routes:**
1. **Authentication:**
   - POST `/api/auth/signup` - User registration
   - POST `/api/auth/login` - User login with JWT generation

2. **Projects:**
   - GET `/api/projects` - List all big projects
   - GET `/api/projects/:id` - Get specific big project
   - GET `/api/projects/:id/mini-projects` - Get mini-projects for a big project

3. **Progress Tracking:**
   - GET `/api/progress` - Get all user progress
   - GET `/api/progress/:projectId` - Get progress for specific project
   - POST `/api/progress/start` - Initialize progress for new project
   - POST `/api/progress/complete` - Mark mini-project as complete

4. **Gamification:**
   - GET `/api/badges` - List all available badges
   - GET `/api/user-badges` - Get user's earned badges

5. **AI Tutor:**
   - POST `/api/tutor` - Send message to AI assistant

**Authentication Flow:**
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT signed with SESSION_SECRET environment variable
- Token stored in localStorage as "auth_token"
- User data cached in localStorage as "user_data" for session persistence
- Automatic redirect to /auth on 401 responses (via queryClient error handler)
- ProtectedRoute HOC checks isAuthenticated before rendering protected pages
- Authorization header automatically added to all API requests when token exists
- Logout clears both localStorage keys and updates AuthContext state

### Data Schema

**Database Tables:**

1. **users**
   - id (UUID primary key)
   - email (unique, not null)
   - password (hashed, not null)
   - name (not null)
   - role (default: "student")
   - createdAt (timestamp)

2. **big_projects**
   - id (UUID primary key)
   - title, description
   - language (programming language)
   - difficulty (Beginner/Intermediate/Advanced)
   - totalMiniProjects (count)
   - icon (identifier)

3. **mini_projects**
   - id (UUID primary key)
   - bigProjectId (foreign key)
   - miniId (sequential number)
   - title, description
   - concepts (array)
   - theory, examples, hints
   - taskDescription
   - codeTemplate, solution
   - expectedOutput

4. **user_progress**
   - id (UUID primary key)
   - userId, bigProjectId (composite tracking)
   - currentMiniId
   - completedMiniIds (array)
   - streak (consecutive days)
   - lastActivityDate
   - totalTimeSpent

5. **badges**
   - id (UUID primary key)
   - name, description
   - icon, criteria

6. **user_badges**
   - id (UUID primary key)
   - userId, badgeId
   - earnedAt (timestamp)

**Storage Implementation:**
- Currently uses in-memory storage (MemStorage class)
- Implements IStorage interface for future database integration
- Configured for PostgreSQL via Drizzle (NeonDB serverless driver)
- Schema validation using Zod schemas

### Security Considerations

- Password hashing before storage
- JWT tokens with configurable secret
- Environment variable for sensitive configuration
- Authorization middleware for protected routes
- Raw body verification for request integrity
- CORS and credential handling configured

### Development Workflow

**Build System:**
- Vite for frontend bundling and dev server
- esbuild for backend compilation
- TypeScript strict mode enabled
- Path aliases for clean imports (@/, @shared/, @assets/)

**Scripts:**
- `dev` - Development with hot reload
- `build` - Production build (client + server)
- `start` - Production server
- `check` - TypeScript type checking
- `db:push` - Push schema changes to database

**Development Features:**
- Replit-specific plugins for cartographer and dev banner
- Runtime error overlay during development
- Request/response logging for API calls
- Automatic Vite middleware integration

## External Dependencies

### Third-Party Services

**Database:**
- NeonDB Serverless PostgreSQL (via `@neondatabase/serverless`)
- Configured via DATABASE_URL environment variable
- Connection pooling with connect-pg-simple for sessions

**UI Component Libraries:**
- Radix UI: Accessible, unstyled component primitives
- shadcn/ui: Pre-styled components built on Radix
- Lucide React: Icon library
- React Icons: Additional icon sets (Si* for tech logos)

**Code Editor:**
- Monaco Editor: Full-featured code editor (VS Code core)
- Language support and syntax highlighting
- Theme integration with application theme

**Development Tools:**
- Replit-specific plugins for enhanced DX
- Vite plugins for error handling and monitoring

**Authentication:**
- bcryptjs: Password hashing
- jsonwebtoken: JWT creation and verification

**Validation:**
- Zod: Schema validation for forms and API requests
- Drizzle-Zod: Integration for database schema validation

### Environment Configuration

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - JWT signing secret (defaults to development key)
- `NODE_ENV` - Environment mode (development/production)
- `REPL_ID` - Replit-specific identifier for conditional plugins

**Font Resources:**
- Google Fonts: Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter
- Preconnected for performance optimization