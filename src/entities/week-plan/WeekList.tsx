import { useCallback, useEffect, useState } from 'react'

import { createWorkout, fetchWeekPlansWithWorkouts } from './api'
import { WeekCard } from './WeekCard'

import type { WeekPlanWithWorkouts } from '@/shared/model/types'
import type { WorkoutFormData } from '@/shared/ui/AddWorkoutForm/AddWorkoutForm'

import styles from './WeekList.module.css'

import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'
import { convertDistance } from '@/shared/lib/distanceUtils'
import { AddWorkoutModal } from '@/shared/ui/AddWorkoutModal/AddWorkoutModal'

export const WeekList = () => {
  const [weekPlans, setWeekPlans] = useState<WeekPlanWithWorkouts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWeekPlan, setSelectedWeekPlan] = useState<WeekPlanWithWorkouts | null>(null)
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

  const calculateWeekProgress = useCallback(
    (weekPlan: WeekPlanWithWorkouts) => {
      const totalWorkoutDistance =
        weekPlans
          .find((wp) => wp.id === weekPlan.id)
          ?.workouts.reduce((sum, workout) => sum + workout.distance_km, 0) || 0

      const plannedDistance = convertDistance(weekPlan.planned_distance_km, unit)
      const currentDistance = convertDistance(totalWorkoutDistance, unit)

      return {
        current: currentDistance,
        total: plannedDistance,
        percentage: Math.min((totalWorkoutDistance / weekPlan.planned_distance_km) * 100, 100)
      }
    },
    [weekPlans, unit]
  )

  const canAddWorkout = useCallback((weekPlan: WeekPlanWithWorkouts) => {
    const startDate = new Date(weekPlan.start_date)
    const today = new Date()

    // Разрешаем добавление тренировок только для текущей и прошлых недель (сегодняшняя дата больше или равна startDate)
    return today >= startDate
  }, [])

  const handleAddWorkout = useCallback((weekPlan: WeekPlanWithWorkouts) => {
    setSelectedWeekPlan(weekPlan)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedWeekPlan(null)
  }, [])

  const handleSubmitWorkout = useCallback(
    async (workoutData: WorkoutFormData) => {
      console.log('workoutData', workoutData)
      if (!selectedWeekPlan) return

      try {
        const newWorkout = await createWorkout(workoutData)

        // Update the local state to include the new workout
        setWeekPlans((prev) =>
          prev.map((weekPlan) =>
            weekPlan.id === selectedWeekPlan.id
              ? { ...weekPlan, workouts: [...weekPlan.workouts, newWorkout] }
              : weekPlan
          )
        )
      } catch (error) {
        console.error('Failed to add workout:', error)
        // You might want to show an error message to the user here
      }
    },
    [selectedWeekPlan]
  )

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
        {weekPlans.map((weekPlan) => (
          <WeekCard
            calculateProgress={calculateWeekProgress}
            canAddWorkout={canAddWorkout}
            key={weekPlan.id}
            weekPlan={weekPlan}
            onAddWorkout={handleAddWorkout}
          />
        ))}
      </div>

      {selectedWeekPlan && (
        <AddWorkoutModal
          isOpen={isModalOpen}
          weekNumber={selectedWeekPlan.week_number}
          weekPlanId={selectedWeekPlan.id}
          onClose={handleCloseModal}
          onSubmit={handleSubmitWorkout}
        />
      )}
    </div>
  )
}
