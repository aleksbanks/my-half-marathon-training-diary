import { memo, useMemo } from 'react'

import type { WeekPlanWithWorkouts, Workout } from '@/shared/model/types'

import styles from './WeekList.module.css'

import { formatDate } from '@/shared/lib/dateUtils'
import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'
import { CollapsibleCard } from '@/shared/ui/CollapsibleCard/CollapsibleCard'
import { ProgressBar } from '@/shared/ui/ProgressBar/ProgressBar'
import { WorkoutList } from '@/shared/ui/WorkoutList/WorkoutList'

interface WeekCardProps {
  weekPlan: WeekPlanWithWorkouts
  onAddWorkout: (weekPlan: WeekPlanWithWorkouts) => void
  onWorkoutClick?: (workout: Workout) => void
}

export const WeekCard = memo(({ weekPlan, onAddWorkout, onWorkoutClick }: WeekCardProps) => {
  const { unit } = useDistanceUnitStore()
  const progress = useMemo(() => {
    const plannedDistance = unit === 'km' ? weekPlan.planned_distance_km : weekPlan.planned_distance_miles
    const totalWorkoutDistance = weekPlan.workouts.reduce(
      (sum, workout) => sum + (unit === 'km' ? workout.distance_km : workout.distance_miles),
      0
    )
    return {
      current: totalWorkoutDistance,
      total: plannedDistance,
      percentage: Math.min((totalWorkoutDistance / plannedDistance) * 100, 100)
    }
  }, [weekPlan, unit])
  const canAddWorkout = useMemo(() => {
    const startDate = new Date(weekPlan.start_date)
    const today = new Date()

    // Разрешаем добавление тренировок только для текущей и прошлых недель (сегодняшняя дата больше или равна startDate)
    return today >= startDate
  }, [weekPlan.start_date])

  return (
    <CollapsibleCard
      headerContent={<ProgressBar current={progress.current} total={progress.total} unit={unit} />}
      title={`Week ${weekPlan.week_number}`}>
      <div className={styles.cardContent}>
        <p className={styles.weekDays}>
          <b>Days:</b> {formatDate(weekPlan.start_date)} - {formatDate(weekPlan.end_date)}
        </p>
        <WorkoutList workouts={weekPlan.workouts} onWorkoutClick={onWorkoutClick} />

        <div className={styles.actions}>
          <button
            className={`${styles.addButton} ${!canAddWorkout ? styles.disabled : ''}`}
            disabled={!canAddWorkout}
            type='button'
            onClick={() => onAddWorkout(weekPlan)}>
            {canAddWorkout ? 'Add Workout' : 'Week disabled'}
          </button>
        </div>
      </div>
    </CollapsibleCard>
  )
})

WeekCard.displayName = 'WeekCard'
