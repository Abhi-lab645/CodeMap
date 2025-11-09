# 🗺️ CodeMap - Interactive Programming Learning Platform

**CodeMap** is a comprehensive web-based educational platform that teaches programming through project-based learning. Students master coding by building complete projects broken down into 300-500 interconnected mini-projects, each with theory lessons, code examples, and hands-on exercises.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Core Learning Experience
- **📚 Project-Based Learning**: Master programming by building real-world projects (E-Commerce Platform, Social Media App, Task Manager, etc.)
- **🎯 Mini-Projects System**: Each big project contains 300-500 mini-projects with progressive difficulty
- **📖 Theory + Practice**: Every mini-project includes theory lessons, code examples, and hands-on workspace
- **💻 Interactive Code Editor**: Monaco Editor (VS Code core) integrated for live coding exercises
- **✅ Progress Tracking**: Real-time tracking of completed mini-projects and overall learning progress

### Gamification & Motivation
- **⭐ XP Points System**: Earn 100 XP for each completed mini-project
- **🔥 Streak Tracking**: Daily activity streaks with visual indicators (current streak & longest streak)
- **🏆 Achievement Badges**: Unlock badges for milestones (First Steps, Quick Learner, Marathon Runner, etc.)
- **📊 Profile Dashboard**: Comprehensive stats showing XP, streaks, badges, and completion rates

### AI-Powered Assistance
- **🤖 AI Tutor**: Real OpenAI GPT-4o-mini integration for context-aware programming help
- **💬 Smart Context**: AI understands your current mini-project, code, and learning progress
- **🎨 Rich Formatting**: Markdown rendering with syntax highlighting for code examples
- **⚡ Error Handling**: Graceful fallback for API quota limits with helpful error messages

### Modern Tech Stack
- **🎨 Glassmorphism UI**: Beautiful, modern design with backdrop-blur effects
- **🌓 Dark/Light Mode**: Full theme support with seamless switching
- **📱 Responsive Design**: Mobile-first approach, works on all devices
- **🔐 Secure Authentication**: JWT-based auth with bcrypt password hashing
- **💾 PostgreSQL Database**: Persistent storage with Drizzle ORM

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** - Lightweight client-side routing
- **TanStack Query (React Query)** - Server state management
- **Radix UI + shadcn/ui** - Accessible component library
- **TailwindCSS** - Utility-first styling
- **Monaco Editor** - VS Code editor component
- **React Hook Form + Zod** - Form handling and validation
- **React Markdown** - Markdown rendering with syntax highlighting

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe backend code
- **Drizzle ORM** - SQL database toolkit
- **PostgreSQL (NeonDB)** - Serverless database
- **JWT + bcrypt** - Authentication and password security
- **OpenAI API** - AI-powered tutor integration

### Development Tools
- **Vite** - Fast build tool with HMR
- **esbuild** - JavaScript bundler
- **Drizzle Kit** - Database migrations
- **tsx** - TypeScript execution

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **PostgreSQL** database (NeonDB or local)
- **OpenAI API Key** (for AI Tutor feature)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd codemap
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# PostgreSQL Connection Details (Auto-configured on Replit)
PGHOST=your-db-host
PGPORT=5432
PGUSER=your-db-user
PGPASSWORD=your-db-password
PGDATABASE=your-db-name

# Authentication
SESSION_SECRET=your-super-secret-jwt-key-change-in-production

# OpenAI Integration (for AI Tutor)
OPENAI_API_KEY=sk-your-openai-api-key

# Environment
NODE_ENV=development
```

4. **Initialize the database**

The database schema will be automatically created on first run. To manually push schema changes:

```bash
npm run db:push
```

If you encounter data-loss warnings:
```bash
npm run db:push --force
```

5. **Seed the database**

The database is automatically seeded when the DbStorage class initializes. Seeding occurs in `server/storage.ts` and is idempotent - it checks for existing data before seeding. The seed data includes:
- 4 big projects (E-Commerce Platform, Social Media App, Task Manager, Weather Dashboard)
- Multiple mini-projects for each big project
- 6 achievement badges

Seeding runs automatically on first server startup. If the database already contains data, seeding is skipped.

## 🎮 Running the Project

### Development Mode
```bash
npm run dev
```

This starts:
- Express backend server on port 5000
- Vite frontend dev server with HMR
- Both accessible at `http://localhost:5000`

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run check
```

## 📁 Project Structure

```
codemap/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── ai-tutor.tsx  # AI chat interface
│   │   │   ├── badge-card.tsx
│   │   │   ├── mini-project-card.tsx
│   │   │   ├── progress-ring.tsx
│   │   │   └── project-card.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configs
│   │   │   ├── auth-context.tsx  # Auth state management
│   │   │   └── queryClient.ts    # TanStack Query setup
│   │   ├── pages/            # Route pages
│   │   │   ├── auth.tsx      # Login/Signup
│   │   │   ├── landing.tsx   # Marketing page
│   │   │   ├── projects.tsx  # Browse projects
│   │   │   ├── dashboard.tsx # Learning dashboard
│   │   │   ├── theory.tsx    # Theory lessons
│   │   │   ├── workspace.tsx # Code workspace
│   │   │   └── profile.tsx   # User profile
│   │   ├── App.tsx           # Route configuration
│   │   └── index.css         # Global styles + theme
│   └── index.html
├── server/                    # Backend Express application
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Database abstraction layer + seeding
│   ├── vite.ts               # Vite middleware
│   └── index.ts              # Server entry point
├── shared/                    # Shared types and schemas
│   └── schema.ts             # Drizzle database schema + Zod validation
├── design_guidelines.md       # UI/UX design system
├── replit.md                 # Project documentation
├── drizzle.config.ts         # Database configuration
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user data (authenticated)

### Projects
- `GET /api/projects` - List all big projects
- `GET /api/projects/:id` - Get specific project details
- `GET /api/projects/:projectId/mini-projects` - Get mini-projects for a project
- `GET /api/mini-projects/:id` - Get specific mini-project details

### Progress Tracking
- `GET /api/progress` - Get all user progress (authenticated)
- `GET /api/progress/:projectId` - Get progress for specific project (authenticated)
- `POST /api/progress/start` - Start a new project (authenticated)
- `POST /api/progress/complete` - Mark mini-project complete (+100 XP, streak update) (authenticated)

### Gamification
- `GET /api/badges` - List all available badges
- `GET /api/user-badges` - Get user's earned badges (authenticated)

### AI Tutor
- `POST /api/tutor` - Send message to AI assistant

## 🎨 Design System

CodeMap uses a **glassmorphism** design aesthetic inspired by:
- **Educational platforms**: Duolingo, Khan Academy (for engagement patterns)
- **Developer tools**: Linear, Replit, VS Code (for code workspace)

### Typography
- **UI/Text**: Inter font family
- **Code**: JetBrains Mono font family

### Color Scheme
- Customizable theme system with light/dark mode
- Glassmorphic cards with backdrop-blur effects
- Semantic color tokens for consistent theming

### Key Components
- **Project Cards**: Display big projects with glassmorphic styling
- **Mini-Project Cards**: Timeline-style learning progression
- **Progress Ring**: Circular progress visualization
- **Badge Cards**: Achievement showcase with unlock states
- **AI Tutor**: Floating chat interface with markdown support

See `design_guidelines.md` for complete design specifications.

## 🗄️ Database Schema

### Users
- User accounts with email/password authentication
- XP tracking (`totalXp`, `currentStreak`, `longestStreak`, `lastActivityDate`)

### Big Projects
- Large learning projects (E-Commerce, Social Media, etc.)
- Language, difficulty, and mini-project count

### Mini Projects
- Individual coding exercises within big projects
- Theory content, code examples, tasks, solutions

### User Progress
- Tracks completion status per user per project
- Completed mini-project IDs, streak tracking

### Badges & User Badges
- Achievement system with unlock criteria
- Junction table for earned badges per user

## 🧪 Testing

The platform includes comprehensive E2E testing using Playwright:

- ✅ User signup and authentication flow
- ✅ Project browsing and starting
- ✅ Theory page navigation
- ✅ Mini-project completion workflow
- ✅ XP and streak tracking verification
- ✅ Badge earning and display
- ✅ Profile statistics accuracy

## 🎯 Gamification Details

### XP System
- **100 XP** per mini-project completion
- Displayed on profile dashboard
- Tracked in real-time via `/api/auth/me` endpoint

### Streak Tracking
- Counts consecutive days of activity
- Updates automatically when completing mini-projects
- Displays:
  - **Current Streak**: Active consecutive days
  - **Longest Streak**: All-time best streak
- Resets if no activity for 24+ hours

### Achievement Badges
Current badges include:
- **First Steps** (🎯): Complete your first mini-project
- **Quick Learner** (⚡): Complete 10 mini-projects
- **Marathon Runner** (🏃): Complete 50 mini-projects
- **Century Club** (💯): Complete 100 mini-projects
- **Master Builder** (🏗️): Complete an entire big project
- **Streak Warrior** (🔥): Maintain a 7-day streak

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **bcrypt Password Hashing**: 10 salt rounds for password security
- **Protected Routes**: HOC-based route protection on frontend
- **Token Validation**: Middleware-based auth checks on backend
- **Automatic Token Refresh**: Handles expired tokens gracefully
- **Environment Variables**: Sensitive data isolated in .env

## 🚢 Deployment

The application is configured for deployment on Replit or any Node.js hosting platform:

1. Set environment variables on your hosting platform
2. Run `npm run build` to create production build
3. Run `npm start` to start production server
4. Ensure PostgreSQL database is accessible
5. Configure OpenAI API key for AI Tutor feature

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o-mini API
- **shadcn/ui** for beautiful component library
- **Radix UI** for accessible primitives
- **Monaco Editor** for VS Code editor integration
- **NeonDB** for serverless PostgreSQL

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for aspiring developers learning to code through hands-on projects.**
