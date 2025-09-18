import type { Workout } from '@/shared/model/types'

import styles from './WorkoutView.module.css'

import { useAppSelector } from '@/app/store/hooks'
import { selectDistanceUnit } from '@/app/store/selectors/unitSelectors'
import { formatDate, formatWeekday } from '@/shared/lib/dateUtils'
import { formatDuration, formatPace, getWorkoutTypeInfo } from '@/shared/lib/workoutUtils'
import workoutTypeStyles from '@/shared/ui/WorkoutType/WorkoutType.module.css'

interface WorkoutViewProps {
  workout: Workout
}

export const WorkoutView = ({ workout }: WorkoutViewProps) => {
  const unit = useAppSelector(selectDistanceUnit)
  const typeInfo = getWorkoutTypeInfo(workout.type)

  const distance = unit === 'km' ? workout.distance_km : workout.distance_miles
  const pace = unit === 'km' ? workout.pace_km : workout.pace_miles

  // Calculate total rest time from intervals
  const totalRestSeconds =
    workout.intervals?.reduce((total, interval) => {
      return total + (interval.has_rest_after && interval.rest_duration_seconds ? interval.rest_duration_seconds : 0)
    }, 0) || 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dateInfo}>
          <h3 className={styles.weekday}>{formatWeekday(workout.date)}</h3>
          <p className={styles.date}>{formatDate(workout.date)}</p>
        </div>
        <span
          className={`${workoutTypeStyles.workoutType} ${workoutTypeStyles.workoutTypeLarge} ${workoutTypeStyles[typeInfo.className]}`}>
          {typeInfo.name}
        </span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel} title='Total distance of the workout'>
            Distance
          </span>
          <span className={styles.statValue}>
            {distance.toFixed(2)} {unit}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel} title='Duration excluding rest periods between intervals'>
            Duration
          </span>

          <span className={styles.statValue}>{formatDuration(workout.duration_min, totalRestSeconds)}</span>
        </div>
        {!isNaN(pace) && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Average Pace</span>
            <span className={styles.statValue}>{formatPace(pace, unit)}</span>
          </div>
        )}
      </div>

      {workout.intervals && workout.intervals.length > 0 && (
        <div className={styles.intervals}>
          <h4 className={styles.intervalsTitle}>Intervals</h4>
          <div className={styles.intervalsList}>
            {workout.intervals.map((interval, index) => {
              const duration = formatDuration(interval.duration_min)
              const pace = formatPace(unit === 'km' ? interval.pace_km : interval.pace_miles, unit)
              const rest = interval.rest_duration_seconds
                ? formatDuration(Math.floor(interval.rest_duration_seconds / 60), interval.rest_duration_seconds % 60)
                : ''

              return (
                <div className={styles.interval} key={interval.id || index}>
                  <div className={styles.intervalHeader}>
                    <span className={styles.intervalName}>{interval.name}</span>
                    <span className={styles.intervalDistance}>
                      {(unit === 'km' ? interval.distance_km : interval.distance_miles).toFixed(2)} {unit}
                    </span>
                  </div>
                  <div className={styles.intervalDetails}>
                    <span className={styles.intervalDuration}>{duration}</span>
                    <span className={styles.intervalPace}>{pace}</span>
                    {interval.has_rest_after && interval.rest_duration_seconds && (
                      <span className={styles.restDuration}>Rest: {rest}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {workout.notes && (
        <div className={styles.notes}>
          <h4 className={styles.notesTitle}>Notes</h4>
          <p className={styles.notesContent}>{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
