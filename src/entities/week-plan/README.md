# WeekList Component

React component for displaying weekly training plans with collapsible cards, progress tracking, and workout management.

## Features

- **Collapsible Cards**: Each week plan is displayed in an expandable card
- **Progress Tracking**: Visual progress bar showing completed vs planned distance
- **Unit Toggle**: Switch between kilometers and miles
- **Workout List**: Detailed view of workouts for each week
- **Smart Buttons**: Add workout button is enabled only for current/future weeks
- **Real-time Data**: Fetches data from Supabase week_plans and workouts tables

## Structure

### Week Plan Card

- **Title**: "Week {week_number}"
- **Progress Bar**: Shows current distance / planned distance with percentage
- **Collapsible Content**:
  - List of workouts with date, day of week, and distance
  - Add workout button (enabled/disabled based on week end date)

### Unit System

- Toggle between kilometers (km) and miles
- Stored in Zustand store with persistence
- Automatically converts all distance displays

## Data Flow

1. **Fetch Week Plans**: Load all week_plans from Supabase
2. **Fetch Workouts**: For each week plan, load related workouts
3. **Calculate Progress**: Sum workout distances and compare with planned distance
4. **Render Cards**: Display each week with progress and workout list

## Components

### Main Components

- `WeekList` - Main container component
- `CollapsibleCard` - Expandable card wrapper
- `ProgressBar` - Visual progress indicator
- `WorkoutList` - List of workouts for a week
- `UnitToggle` - Distance unit switcher

### Utility Functions

- `fetchWeekPlansWithWorkouts()` - API function for data fetching
- `convertDistance()` - Unit conversion utility
- `formatDate()` / `formatWeekday()` - Date formatting utilities
- `isDateInFuture()` - Date comparison for button state

## Usage

```tsx
import { WeekList } from '@/entities/week-plan/WeekList'

function App() {
  return (
    <div>
      <WeekList />
    </div>
  )
}
```

## Database Schema

### week_plans table

- `id` (number)
- `week_number` (number)
- `planned_distance_km` (number)
- `start_date` (string, ISO date)
- `end_date` (string, ISO date)

### workouts table

- `id` (number)
- `week_plan_id` (number, foreign key)
- `date` (string, ISO date)
- `distance_km` (number)
- `notes` (string, optional)

## Styling

Uses CSS modules for scoped styling:

- Responsive design with max-width container
- Smooth animations for collapsible cards
- Modern UI with hover effects and transitions
- Consistent color scheme and typography
