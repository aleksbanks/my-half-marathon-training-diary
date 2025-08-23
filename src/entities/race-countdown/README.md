# RaceCountdown Component

React component for displaying countdown to half-marathon on December 14, 2025.

## Description

Component automatically calculates time until race start and displays it in a readable English format.

## Behavior

### If more than 10 weeks until start:

Displays format: "X months Y weeks Z days (N training weeks)"

**Example:** "3 months 1 week 6 days (14 training weeks)"

### If 1-10 weeks until start:

Displays format: "X weeks Y days"

**Example:** "6 weeks 1 day"

### If 1 week or less until start:

Displays format: "X days Y hours" or "X hours"

**Examples:**

- "1 day 6 hours"
- "4 hours"
- "Race starts soon!" (when very close to start)

## Usage

```tsx
import { RaceCountdown } from '@/entities/race-countdown/RaceCountdown'

function App() {
  return (
    <div>
      <RaceCountdown />
    </div>
  )
}
```

## Technical Details

- **Target Date:** December 14, 2025 (hardcoded in component)
- **Library:** date-fns for time calculations
- **Updates:** On page load (no realtime required)
- **Language:** English

## Testing

To test the logic run:

```bash
npx tsx src/entities/race-countdown/RaceCountdown.test.ts
```
