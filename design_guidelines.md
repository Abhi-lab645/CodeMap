# CodeMap Platform Design Guidelines

## Design Approach
**Hybrid Approach**: Drawing from educational platforms (Duolingo, Khan Academy) for engagement patterns and developer tools (Linear, Replit, VS Code) for code workspace functionality.

**Core Principles**:
- Clear information hierarchy for learning content
- Motivational progress visualization
- Distraction-free coding environment
- Modern, tech-forward aesthetic

## Typography

**Font System**:
- Primary: Inter (headings, UI elements, navigation)
- Code: JetBrains Mono (code blocks, editor)
- Body: Inter (all text content)

**Scale**:
- Hero: text-5xl to text-6xl, font-bold
- Page titles: text-3xl to text-4xl, font-semibold
- Section headings: text-2xl, font-semibold
- Card titles: text-xl, font-medium
- Body: text-base
- Small UI text: text-sm
- Code snippets: text-sm (mono)

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 8, 12, 16, 20, 24
- Micro spacing (buttons, inputs): p-2, p-4, gap-2
- Component spacing: p-8, gap-8, mb-12
- Section spacing: py-20, py-24
- Large spacing: gap-16, py-32

**Grid Structure**:
- Max container width: max-w-7xl
- Dashboard sidebar: w-64 (desktop), hidden on mobile
- Code editor workspace: 60/40 split (editor/output)
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Landing Page
**Header**: Sticky nav with logo left, links center, auth buttons right (gap-8 spacing)

**Hero Section**: 
- Height: min-h-[600px]
- Large hero image showing students coding/learning with glassmorphic overlay card
- Centered content with max-w-4xl
- Primary CTA button + secondary outlined button (gap-4)
- Animated language icons floating in background (subtle motion)

**Project Cards Grid**: 
- 3-column grid (lg), 2-column (md), 1-column (mobile)
- Each card: rounded-2xl, p-8, backdrop-blur glass effect
- Includes: project icon, title, language badge, difficulty tag, mini-project count, "Start Learning" button

### Learning Dashboard
**Layout**: Fixed sidebar navigation (left) + main content area
- Sidebar: User profile card at top, progress ring, module list with completion indicators
- Main: Module cards in vertical timeline with connection lines showing progression
- Each module card shows: number, title, concepts (pills), lock/progress/completed icon, expand button

### Theory + Examples Page
**Structure**: 
- Page title + breadcrumb navigation (top)
- Theory content: max-w-3xl prose formatting
- Code examples: Full-width Monaco editor instances with rounded-xl borders
- 3-5 example cards, each with: example title, code block, "Run" button, output panel
- Bottom: Large "Proceed to Mini Project" button (w-full on mobile, w-auto on desktop)

### Mini Project Workspace
**Split View**:
- Left panel (60%): Monaco editor with task description collapsible panel above
- Right panel (40%): Live output iframe with tabs (Output, Console, Hints)
- Top bar: Project title, progress indicator, "Mark Complete" button
- Bottom: Integration map preview showing where this fits in big project

### Progress Tracking
**Profile Dashboard**:
- Hero stats: Completed projects (large number), total XP, current streak
- Progress bars: Overall completion, module breakdowns
- Badge showcase: Grid of earned badges (locked shown as grayscale)
- Certificate download card (when 100% complete)

### AI Tutor
**Fixed chat button**: Bottom-right floating button (rounded-full, w-14, h-14)
**Chat panel**: Slides in from right, w-96, backdrop-blur overlay
- Input at bottom, message list above
- Placeholder text: "Ask CodeMap Tutor anything..."

## Visual Treatment

**Glassmorphism Effects**:
- Cards: backdrop-blur-lg with subtle border (border-white/20)
- Panels: Semi-transparent backgrounds (bg-white/10 dark mode, bg-white/80 light mode)
- Shadows: Use shadow-xl for elevation

**Status Indicators**:
- Locked: Grayscale with lock icon
- In Progress: Accent border with pulsing dot
- Completed: Success state with checkmark

**Interactive States**:
- Buttons: No hover effects on glass overlays
- Code blocks: Subtle border highlight on focus
- Cards: Gentle scale transform (scale-105) on hover

## Responsive Behavior

**Breakpoints**:
- Mobile (<768px): Single column, hidden sidebar (hamburger menu)
- Tablet (768-1024px): 2-column grids, persistent bottom nav
- Desktop (>1024px): Full layout with sidebar, 3-column grids

**Mobile Adaptations**:
- Code editor: Full-screen modal on mobile
- Dashboard: Bottom tab navigation
- Progress rings: Horizontal scroll on mobile

## Images

**Hero Section**: Large background image (1920x1080) showing diverse students collaborating at laptops with code on screens - modern, bright, inspirational
**Project Cards**: Icon-based instead of photos - use programming language logos and project type icons
**Profile Section**: User avatar upload area
**Certificate**: Downloadable PDF with CodeMap branding

**Image Treatment**: All hero images use backdrop-blur on overlay cards with glass effect