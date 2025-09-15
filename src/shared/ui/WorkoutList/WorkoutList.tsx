import type { Workout } from '@/shared/model/types'

import styles from './WorkoutList.module.css'

import { formatDate, formatWeekday } from '@/shared/lib/dateUtils'
import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'
import { getWorkoutTypeInfo } from '@/shared/lib/workoutUtils'
import workoutTypeStyles from '@/shared/ui/WorkoutType/WorkoutType.module.css'

interface WorkoutListProps {
  workouts: Workout[]
  onWorkoutClick?: (workout: Workout) => void
}

export const WorkoutList = ({ workouts, onWorkoutClick }: WorkoutListProps) => {
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
        {workouts.map((workout) => {
          const typeInfo = getWorkoutTypeInfo(workout.type)

          return (
            <div
              className={`${styles.workout} ${onWorkoutClick ? styles.clickable : ''}`}
              key={workout.id}
              onClick={() => onWorkoutClick?.(workout)}>
              <div className={styles.dateInfo}>
                <span className={styles.weekday}>{formatWeekday(workout.date)}</span>
                <span className={styles.date}>{formatDate(workout.date)}</span>
              </div>
              <div className={styles.distance}>
                {(unit === 'km' ? workout.distance_km : workout.distance_miles).toFixed(2)} {unit}
              </div>
              <span
                className={`${workoutTypeStyles.workoutType} ${workoutTypeStyles.workoutTypeCompact} ${workoutTypeStyles[typeInfo.className]}`}>
                {typeInfo.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
