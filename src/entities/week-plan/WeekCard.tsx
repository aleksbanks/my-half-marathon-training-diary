import { memo } from 'react'

import type { WeekPlanWithWorkouts } from '@/shared/model/types'

import styles from './WeekList.module.css'

import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'
import { CollapsibleCard } from '@/shared/ui/CollapsibleCard/CollapsibleCard'
import { ProgressBar } from '@/shared/ui/ProgressBar/ProgressBar'
import { WorkoutList } from '@/shared/ui/WorkoutList/WorkoutList'

interface WeekCardProps {
  weekPlan: WeekPlanWithWorkouts
  onAddWorkout: (weekPlan: WeekPlanWithWorkouts) => void
  canAddWorkout: (weekPlan: WeekPlanWithWorkouts) => boolean
  calculateProgress: (weekPlan: WeekPlanWithWorkouts) => {
    current: number
    total: number
    percentage: number
  }
}

export const WeekCard = memo(({ weekPlan, onAddWorkout, canAddWorkout, calculateProgress }: WeekCardProps) => {
  const { unit } = useDistanceUnitStore()
  const progress = calculateProgress(weekPlan)
  const canAdd = canAddWorkout(weekPlan)

  return (
    <CollapsibleCard
      headerContent={<ProgressBar current={progress.current} total={progress.total} unit={unit} />}
      title={`Week ${weekPlan.week_number}`}>
      <div className={styles.cardContent}>
        <WorkoutList workouts={weekPlan.workouts} />

        <div className={styles.actions}>
          <button
            className={`${styles.addButton} ${!canAdd ? styles.disabled : ''}`}
            disabled={!canAdd}
            type='button'
            onClick={() => onAddWorkout(weekPlan)}>
            {canAdd ? 'Add Workout' : 'Week disabled'}
          </button>
        </div>
      </div>
    </CollapsibleCard>
  )
})

WeekCard.displayName = 'WeekCard'
