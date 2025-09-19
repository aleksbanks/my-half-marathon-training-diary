# Running Diary

A comprehensive React application for tracking running activities and training progress. Built with TypeScript, Vite, Redux Toolkit, and Supabase for a complete training management solution.

## Features

- **Race Countdown**: Smart countdown component that displays time until race start with proper English pluralization
- **Weekly Training Plans**: Comprehensive week-by-week training plan management with progress tracking
- **Workout Management**: Add, view, and manage individual workouts with detailed tracking
- **Progress Visualization**: Interactive charts showing planned vs actual distance progress
- **Authentication System**: Role-based access with viewer and editor permissions
- **Unit Management**: Toggle between kilometers and miles with persistent storage
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **State Management**: Redux Toolkit with Redux Persist for robust state management
- **Real-time Data**: Supabase integration for real-time data synchronization
- **Modern Tech Stack**: React 19, TypeScript, Vite, ESLint, Prettier
- **Clean Architecture**: Feature-based folder structure with entities, features, and shared components

## Components

### Entities

#### RaceCountdown

A React component that displays a countdown to the half-marathon on December 14, 2025 at 6:00 AM.

**Features:**

- Smart formatting based on time remaining
- Proper English pluralization (1 day vs 2 days)
- Three display modes:
  - More than 10 weeks: "3 months 1 week 6 days (14 training weeks)"
  - 1-10 weeks: "6 weeks 1 day"
  - Less than 1 week: "1 day 6 hours" or "4 hours"
  - Very close to start: "Race starts soon!"

#### WeekList

A comprehensive component for managing weekly training plans with collapsible cards and progress tracking.

**Features:**

- **Collapsible Cards**: Each week plan in an expandable card
- **Progress Tracking**: Visual progress bars showing completed vs planned distance
- **Unit Toggle**: Switch between kilometers and miles with persistent storage
- **Workout Management**: View workouts with dates, distances, and notes
- **Smart Buttons**: Add workout button enabled only for current/future weeks
- **Real-time Data**: Fetches from Supabase week_plans and workouts tables

#### WeeklyProgressChart

An interactive chart component using Recharts to visualize weekly training progress.

**Features:**

- **Bar Chart Visualization**: Shows planned vs actual distance for each week
- **Responsive Design**: Adapts to different screen sizes (mobile, tablet, desktop)
- **Unit Support**: Displays data in selected unit (km/miles)
- **Interactive Tooltips**: Hover to see detailed information
- **Dynamic Labels**: Week labels adapt to screen size

### UI Components

#### Authentication

- **AuthPage**: Role-based authentication with viewer and editor access
- **ProtectedRoute**: Route protection based on authentication status
- **RoleGuard**: Component-level access control
- **UserInfo**: User information display and logout functionality

#### Workout Management

- **AddWorkoutForm**: Comprehensive form for adding new workouts
- **AddWorkoutModal**: Modal wrapper for the workout form
- **WorkoutList**: Display list of workouts with filtering and sorting
- **WorkoutView**: Detailed view of individual workouts
- **WorkoutViewModal**: Modal wrapper for workout details
- **IntervalForm**: Specialized form for interval workouts

#### UI Elements

- **Button**: Reusable button component with multiple variants
- **Modal**: Base modal component with overlay and close functionality
- **CollapsibleCard**: Expandable card component for week plans
- **ProgressBar**: Visual progress indicator for training completion
- **UnitToggle**: Toggle between kilometers and miles
- **WorkoutType**: Workout type indicator component

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd running-diary

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SASHA_EMAIL=your_email
```

### Database Setup

The application uses Supabase with the following tables:

- **week_plans**: Weekly training plans with planned distances
- **workouts**: Individual workout records with distances and notes
- **users**: User authentication and role management

Make sure your Supabase database has the appropriate tables and RLS policies configured.

### Development

```bash
# Start development server
npm run dev

# Run tests
npx tsx src/entities/race-countdown/RaceCountdown.test.ts

# Lint code
npm run lint

# Format code
npm run format
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/                    # Redux store and state management
│   └── store/
│       ├── hooks.ts        # Typed Redux hooks
│       ├── store.ts        # Store configuration
│       ├── selectors/      # Redux selectors
│       └── slices/         # Redux slices (auth, ui, data)
├── entities/               # Business entities and domain logic
│   ├── race-countdown/     # Race countdown component
│   ├── week-plan/          # Weekly training plan management
│   ├── weekly-progress-chart/ # Progress visualization
│   └── workout/            # Workout-related entities
├── features/               # Feature modules (currently empty)
├── pages/                  # Page components
│   ├── auth/              # Authentication page
│   └── home/              # Home page components
├── shared/                 # Shared utilities and components
│   ├── api/               # API clients and endpoints
│   ├── config/            # Configuration files (Supabase)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── model/             # Type definitions and interfaces
│   ├── ui/                # Reusable UI components
│   └── utils/             # Utility functions
└── App.tsx                 # Main application component
```

### State Management Architecture

The application uses Redux Toolkit with the following slices:

- **authSlice**: User authentication and role management
- **distanceUnitSlice**: Unit preference (km/miles) with persistence
- **uiSlice**: UI state management (modals, loading states)
- **weekPlansSlice**: Weekly training plans data
- **workoutFormSlice**: Workout form state management

### Component Organization

- **Entities**: Business logic components that represent core domain concepts
- **Shared/UI**: Reusable UI components that can be used across the application
- **Pages**: Top-level page components that compose entities and UI components
- **Features**: Feature-specific modules (currently empty, ready for future features)

## Authentication & Authorization

The application implements a role-based authentication system with two user roles:

### User Roles

#### Viewer

- **Access**: Read-only access to all training data
- **Authentication**: No password required
- **Capabilities**:
  - View race countdown
  - Browse weekly training plans
  - View workout details
  - See progress charts
  - Toggle between units (km/miles)

#### Editor

- **Access**: Full read/write access to training data
- **Authentication**: Password required
- **Capabilities**:
  - All viewer capabilities
  - Add new workouts
  - Edit existing workouts
  - Manage training plans
  - Full CRUD operations

### Authentication Flow

1. **Initial Load**: App checks for existing authentication state
2. **Role Selection**: User chooses between Viewer and Editor roles
3. **Password Entry**: Editor role requires password verification
4. **State Persistence**: Authentication state is persisted in localStorage
5. **Route Protection**: All routes are protected and require authentication

### Security Features

- **Role-based Access Control**: Components check user role before rendering
- **Protected Routes**: All application routes require authentication
- **State Persistence**: Authentication state survives browser refreshes
- **Automatic Logout**: Session management with proper cleanup

## Testing

The project includes comprehensive tests for the RaceCountdown component:

```bash
# Run component tests
npx tsx src/entities/race-countdown/RaceCountdown.test.ts
```

Test cases cover various scenarios:

- More than 10 weeks until race
- 1-10 weeks until race
- Less than 1 week until race
- Hours and minutes before race start

## Tech Stack

### Core Framework

- **React 19** - Latest React with new features and concurrent rendering
- **TypeScript** - Type-safe development with strict type checking
- **Vite** - Fast build tool and dev server with HMR

### State Management

- **Redux Toolkit** - Modern Redux with simplified syntax and best practices
- **Redux Persist** - Persistent state storage in localStorage
- **React Redux** - React bindings for Redux

### Data & Backend

- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **@supabase/supabase-js** - JavaScript client for Supabase

### UI & Visualization

- **Recharts** - Composable charting library for React
- **CSS Modules** - Scoped CSS for component styling

### Utilities

- **date-fns** - Modern JavaScript date utility library

### Development Tools

- **ESLint** - Code linting with TypeScript and React rules
- **Prettier** - Code formatting
- **TypeScript ESLint** - ESLint rules for TypeScript
- **Vite TSConfig Paths** - Path mapping support for Vite

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
])
```
