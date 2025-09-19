import { memo, useMemo } from 'react'

import type { WeekPlanWithWorkouts, Workout } from '@/shared/model/types'

import styles from './WeekList.module.css'

import { useAppSelector } from '@/app/store/hooks'
import { selectUserRole } from '@/app/store/selectors/authSelectors'
import { selectDistanceUnit } from '@/app/store/selectors/unitSelectors'
import { hasEditPermission } from '@/shared/lib/authUtils'
import { formatDate } from '@/shared/lib/dateUtils'
import { CollapsibleCard } from '@/shared/ui/CollapsibleCard/CollapsibleCard'
import { ProgressBar } from '@/shared/ui/ProgressBar/ProgressBar'
import { RoleGuard } from '@/shared/ui/RoleGuard/RoleGuard'
import { WorkoutList } from '@/shared/ui/WorkoutList/WorkoutList'

interface WeekCardProps {
  weekPlan: WeekPlanWithWorkouts
  onAddWorkout: (weekPlan: WeekPlanWithWorkouts) => void
  onWorkoutClick?: (workout: Workout) => void
}

export const WeekCard = memo(({ weekPlan, onAddWorkout, onWorkoutClick }: WeekCardProps) => {
  const unit = useAppSelector(selectDistanceUnit)
  const userRole = useAppSelector(selectUserRole)

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
    const hasPermission = hasEditPermission(userRole)

    // Allow adding workouts only for current and past weeks and only if there is edit permission
    return today >= startDate && hasPermission
  }, [weekPlan.start_date, userRole])

  return (
    <CollapsibleCard
      headerContent={<ProgressBar current={progress.current} total={progress.total} unit={unit} />}
      title={`Week ${weekPlan.week_number}`}>
      <div className={styles.cardContent}>
        <p className={styles.weekDays}>
          <b>Days:</b> {formatDate(weekPlan.start_date)} - {formatDate(weekPlan.end_date)}
        </p>
        <WorkoutList workouts={weekPlan.workouts} onWorkoutClick={onWorkoutClick} />

        <RoleGuard requireEdit fallback={null}>
          <div className={styles.actions}>
            <button
              className={`${styles.addButton} ${!canAddWorkout ? styles.disabled : ''}`}
              disabled={!canAddWorkout}
              type='button'
              onClick={() => onAddWorkout(weekPlan)}>
              {canAddWorkout ? 'Add Workout' : 'Week disabled'}
            </button>
          </div>
        </RoleGuard>
      </div>
    </CollapsibleCard>
  )
})

WeekCard.displayName = 'WeekCard'
