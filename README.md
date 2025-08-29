# Running Diary

A React application for tracking running activities and training progress. Built with TypeScript, Vite, and modern React patterns.

## Features

- **Race Countdown**: Smart countdown component that displays time until race start with proper English pluralization
- **Modern Tech Stack**: React 19, TypeScript, Vite, ESLint, Prettier
- **Clean Architecture**: Feature-based folder structure with entities, features, and shared components

## Components

### RaceCountdown

A React component that displays a countdown to the half-marathon on December 14, 2025 at 6:00 AM.

**Features:**

- Smart formatting based on time remaining
- Proper English pluralization (1 day vs 2 days)
- Three display modes:
  - More than 10 weeks: "3 months 1 week 6 days (14 training weeks)"
  - 1-10 weeks: "6 weeks 1 day"
  - Less than 1 week: "1 day 6 hours" or "4 hours"
  - Very close to start: "Race starts soon!"

### WeekList

A comprehensive component for managing weekly training plans with collapsible cards and progress tracking.

**Features:**

- **Collapsible Cards**: Each week plan in an expandable card
- **Progress Tracking**: Visual progress bars showing completed vs planned distance
- **Unit Toggle**: Switch between kilometers and miles with persistent storage
- **Workout Management**: View workouts with dates, distances, and notes
- **Smart Buttons**: Add workout button enabled only for current/future weeks
- **Real-time Data**: Fetches from Supabase week_plans and workouts tables

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
├── entities/           # Business entities
│   └── race-countdown/ # Race countdown component
├── features/           # Feature modules
├── pages/             # Page components
├── shared/            # Shared utilities and components
│   ├── config/        # Configuration files
│   ├── lib/           # Utility libraries
│   ├── model/         # Type definitions
│   └── ui/            # UI components
└── App.tsx            # Main application component
```

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

- **React 19** - Latest React with new features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **date-fns** - Date manipulation library
- **ESLint** - Code linting
- **Prettier** - Code formatting

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
