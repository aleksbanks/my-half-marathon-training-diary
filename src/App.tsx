import styles from './App.module.css'

import { RaceCountdown } from '@/entities/race-countdown/RaceCountdown'
import { WeekList } from '@/entities/week-plan/WeekList'
import { UnitToggle } from '@/shared/ui/UnitToggle/UnitToggle'

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Running Diary</h1>
        <UnitToggle />
      </header>
      <main className={styles.main}>
        <RaceCountdown />
        <WeekList />
      </main>
    </div>
  )
}

export default App
