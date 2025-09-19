import styles from './App.module.css'

import { RaceCountdown } from '@/entities/race-countdown/RaceCountdown'
import { WeekList } from '@/entities/week-plan/WeekList'
import { useAuthInit } from '@/shared/hooks/useAuthInit'
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute/ProtectedRoute'
import { UnitToggle } from '@/shared/ui/UnitToggle/UnitToggle'
import { UserInfo } from '@/shared/ui/UserInfo/UserInfo'

function App() {
  // Initialize authentication when the app loads
  useAuthInit()

  return (
    <ProtectedRoute>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Running Diary</h1>
          <div className={styles.headerControls}>
            <UnitToggle />
            <UserInfo />
          </div>
        </header>
        <main className={styles.main}>
          <RaceCountdown />
          <WeekList />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default App
