import { RaceCountdown } from '@/entities/race-countdown/RaceCountdown'
import { WeekList } from '@/entities/week-plan/WeekList'
import { UnitToggle } from '@/shared/ui/UnitToggle/UnitToggle'

function App() {
  return (
    <div>
      <h1>Running Diary</h1>
      <UnitToggle />
      <RaceCountdown />
      <WeekList />
    </div>
  )
}

export default App
