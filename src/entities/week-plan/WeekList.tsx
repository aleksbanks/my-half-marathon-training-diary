import { useEffect, useState } from 'react'

import { fetchWeekPlansWithWorkouts } from './api'

import type { WeekPlanWithWorkouts } from '@/shared/model/types'

import styles from './WeekList.module.css'

import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'
import { convertDistance } from '@/shared/lib/distanceUtils'
import { CollapsibleCard } from '@/shared/ui/CollapsibleCard/CollapsibleCard'
import { ProgressBar } from '@/shared/ui/ProgressBar/ProgressBar'
import { WorkoutList } from '@/shared/ui/WorkoutList/WorkoutList'

export const WeekList = () => {
  const [weekPlans, setWeekPlans] = useState<WeekPlanWithWorkouts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { unit } = useDistanceUnitStore()

  useEffect(() => {
    const loadWeekPlans = async () => {
      try {
        setLoading(true)
        const data = await fetchWeekPlansWithWorkouts()
        setWeekPlans(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load week plans')
      } finally {
        setLoading(false)
      }
    }

    loadWeekPlans()
  }, [])

  const calculateWeekProgress = (weekPlan: WeekPlanWithWorkouts) => {
    const totalWorkoutDistance =
      weekPlans.find((wp) => wp.id === weekPlan.id)?.workouts.reduce((sum, workout) => sum + workout.distance_km, 0) ||
      0

    const plannedDistance = convertDistance(weekPlan.planned_distance_km, unit)
    const currentDistance = convertDistance(totalWorkoutDistance, unit)

    return {
      current: currentDistance,
      total: plannedDistance,
      percentage: Math.min((totalWorkoutDistance / weekPlan.planned_distance_km) * 100, 100)
    }
  }

  const canAddWorkout = (weekPlan: WeekPlanWithWorkouts) => {
    const endDate = new Date(weekPlan.end_date)
    const startDate = new Date(weekPlan.start_date)
    const today = new Date()
    // Разрешаем добавление тренировок только для текущей и прошлых недель (сегодняшняя дата больше или равна startDate)
    return today >= startDate && today <= endDate
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading week plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.weekList}>
        {weekPlans.map((weekPlan) => {
          const progress = calculateWeekProgress(weekPlan)
          const canAdd = canAddWorkout(weekPlan)

          return (
            <CollapsibleCard
              headerContent={<ProgressBar current={progress.current} total={progress.total} unit={unit} />}
              key={weekPlan.id}
              title={`Week ${weekPlan.week_number}`}>
              <div className={styles.cardContent}>
                <WorkoutList workouts={weekPlan.workouts} />

                <div className={styles.actions}>
                  <button
                    className={`${styles.addButton} ${!canAdd ? styles.disabled : ''}`}
                    disabled={!canAdd}
                    type='button'
                    onClick={() => {
                      // TODO: Implement add workout functionality
                      console.log('Add workout for week', weekPlan.week_number)
                    }}>
                    {canAdd ? 'Add Workout' : 'Week disabled'}
                  </button>
                </div>
              </div>
            </CollapsibleCard>
          )
        })}
      </div>
    </div>
  )
}
