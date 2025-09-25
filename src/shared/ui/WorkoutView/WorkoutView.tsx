import type { Workout } from '@/shared/model/types'

import styles from './WorkoutView.module.css'

import { useAppSelector } from '@/app/store/hooks'
import { selectDistanceUnit } from '@/app/store/selectors/unitSelectors'
import { formatDate, formatWeekday } from '@/shared/lib/dateUtils'
import { formatDuration, formatPace, getWorkoutTypeInfo } from '@/shared/lib/workoutUtils'
import { Button } from '@/shared/ui/Button/Button'
import { RoleGuard } from '@/shared/ui/RoleGuard/RoleGuard'
import workoutTypeStyles from '@/shared/ui/WorkoutType/WorkoutType.module.css'

interface WorkoutViewProps {
  workout: Workout
  onEdit?: () => void
}

export const WorkoutView = ({ workout, onEdit }: WorkoutViewProps) => {
  const unit = useAppSelector(selectDistanceUnit)
  const typeInfo = getWorkoutTypeInfo(workout.type)

  const distance = unit === 'km' ? workout.distance_km : workout.distance_miles

  // Calculate total rest time from intervals
  const totalRestSeconds =
    workout.intervals?.reduce((total, interval) => {
      return total + (interval.has_rest_after && interval.rest_duration_seconds ? interval.rest_duration_seconds : 0)
    }, 0) || 0

  // Calculate running pace (excluding rest time)
  const runningTimeMinutes = workout.duration_min - totalRestSeconds / 60
  const calculatedPace = distance > 0 ? runningTimeMinutes / distance : 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.dateInfo}>
          <h3 className={styles.weekday}>{formatWeekday(workout.date)}</h3>
          <p className={styles.date}>{formatDate(workout.date)}</p>
        </div>
        <div className={styles.headerActions}>
          <span
            className={`${workoutTypeStyles.workoutType} ${workoutTypeStyles.workoutTypeLarge} ${workoutTypeStyles[typeInfo.className]}`}>
            {typeInfo.name}
          </span>
          {onEdit && (
            <RoleGuard requireEdit>
              <Button size='small' variant='secondary' onClick={onEdit}>
                <svg fill='none' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    clipRule='evenodd'
                    d='M13.0817 6.41609C13.0685 6.42795 13.0556 6.44022 13.0429 6.4529C13.0302 6.46558 13.0179 6.47851 13.0061 6.49169L4.58778 14.91L4.58679 14.911C4.20968 15.2866 4 15.7958 4 16.325V19C4 19.5523 4.44772 20 5 20H7.675C8.20405 20 8.71307 19.7904 9.08866 19.4135L9.08999 19.4122L17.5303 10.9735C17.536 10.9681 17.5416 10.9627 17.5471 10.9571C17.5526 10.9516 17.558 10.9461 17.5634 10.9405L19.4151 9.0891C20.1956 8.30857 20.1956 7.04241 19.4151 6.26188L17.7391 4.58588C16.9586 3.80536 15.6924 3.80536 14.9119 4.58588L13.0817 6.41609ZM15.1652 7.161L16.3255 6.0007L18.0003 7.67549L16.8399 8.83567L15.1652 7.161ZM15.4255 10.2497L7.67378 18H6L6.00011 16.3261L13.751 8.57521L15.4255 10.2497Z'
                    fill='currentColor'
                    fillRule='evenodd'
                  />
                </svg>
              </Button>
            </RoleGuard>
          )}
        </div>
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
        {!isNaN(calculatedPace) && calculatedPace > 0 && (
          <div className={styles.stat}>
            <span className={styles.statLabel} title='Pace from running time only (excluding rest periods)'>
              Average Pace
            </span>
            <span className={styles.statValue}>{formatPace(calculatedPace, unit)}</span>
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
                ? formatDuration(Math.ceil(interval.rest_duration_seconds / 60), interval.rest_duration_seconds % 60)
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
