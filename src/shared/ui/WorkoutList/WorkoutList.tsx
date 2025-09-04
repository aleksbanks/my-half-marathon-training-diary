import type { Workout, WorkoutType } from '@/shared/model/types'

import styles from './WorkoutList.module.css'

import { formatDate, formatWeekday } from '@/shared/lib/dateUtils'
import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'

interface WorkoutListProps {
  workouts: Workout[]
}

// Record object for workout type information
const WORKOUT_TYPE_INFO: Record<WorkoutType, { name: string; className: string }> = {
  easy: { name: 'Easy', className: styles.workoutTypeEasy },
  long: { name: 'Long', className: styles.workoutTypeLong },
  interval: { name: 'Interval', className: styles.workoutTypeInterval },
  social: { name: 'Social', className: styles.workoutTypeSocial },
  tempo: { name: 'Tempo', className: styles.workoutTypeTempo }
} as const

// Функция для получения названия и стилей типа тренировки
const getWorkoutTypeInfo = (type: WorkoutType) => {
  return WORKOUT_TYPE_INFO[type]
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
        {workouts.map((workout) => {
          const typeInfo = getWorkoutTypeInfo(workout.type)

          return (
            <div className={styles.workout} key={workout.id}>
              <div className={styles.dateInfo}>
                <span className={styles.weekday}>{formatWeekday(workout.date)}</span>
                <span className={styles.date}>{formatDate(workout.date)}</span>
              </div>
              <div className={styles.distance}>
                {(unit === 'km' ? workout.distance_km : workout.distance_miles).toFixed(2)} {unit}
              </div>
              <span className={`${styles.workoutType} ${typeInfo.className}`}>{typeInfo.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
