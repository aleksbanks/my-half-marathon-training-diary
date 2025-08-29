import styles from './WorkoutList.module.css'

import type { Workout } from '@/shared/model/types'

import { formatDate, formatWeekday } from '@/shared/lib/dateUtils'
import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'
import { formatDistance } from '@/shared/lib/distanceUtils'

interface WorkoutListProps {
  workouts: Workout[]
}

export const WorkoutList = ({ workouts }: WorkoutListProps) => {
  const { unit } = useDistanceUnitStore()

  if (workouts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No workouts recorded for this week</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Workouts</h4>
      <div className={styles.list}>
        {workouts.map((workout) => (
          <div className={styles.workout} key={workout.id}>
            <div className={styles.dateInfo}>
              <span className={styles.weekday}>{formatWeekday(workout.date)}</span>
              <span className={styles.date}>{formatDate(workout.date)}</span>
            </div>
            <div className={styles.distance}>{formatDistance(workout.distance_km, unit)}</div>
            {workout.notes && <div className={styles.notes}>{workout.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
