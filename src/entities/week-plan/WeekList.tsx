import { useEffect, useState } from 'react'

import { createWorkout, fetchWeekPlansWithWorkouts } from './api'
import { WeekCard } from './WeekCard'

import type { WeekPlanWithWorkouts, Workout } from '@/shared/model/types'
import type { WorkoutFormData } from '@/shared/ui/AddWorkoutForm/AddWorkoutForm'

import styles from './WeekList.module.css'

import { AddWorkoutModal } from '@/shared/ui/AddWorkoutModal/AddWorkoutModal'
import { WorkoutViewModal } from '@/shared/ui/WorkoutViewModal/WorkoutViewModal'

export const WeekList = () => {
  const [weekPlans, setWeekPlans] = useState<WeekPlanWithWorkouts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWeekPlan, setSelectedWeekPlan] = useState<WeekPlanWithWorkouts | null>(null)
  const [isWorkoutViewOpen, setIsWorkoutViewOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)

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

  const handleAddWorkout = (weekPlan: WeekPlanWithWorkouts) => {
    setSelectedWeekPlan(weekPlan)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedWeekPlan(null)
  }

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout)
    setIsWorkoutViewOpen(true)
  }

  const handleCloseWorkoutView = () => {
    setIsWorkoutViewOpen(false)
    setSelectedWorkout(null)
  }

  const handleSubmitWorkout = async (workoutData: WorkoutFormData) => {
    if (!selectedWeekPlan) return

    try {
      const newWorkout = await createWorkout(workoutData)

      // Update the local state to include the new workout
      setWeekPlans((prev) =>
        prev.map((weekPlan) =>
          weekPlan.id === selectedWeekPlan.id ? { ...weekPlan, workouts: [...weekPlan.workouts, newWorkout] } : weekPlan
        )
      )
    } catch {
      console.error('Failed to add workout:', error)
    }
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
        {weekPlans.map((weekPlan) => (
          <WeekCard
            key={weekPlan.id}
            weekPlan={weekPlan}
            onAddWorkout={handleAddWorkout}
            onWorkoutClick={handleWorkoutClick}
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

      {isWorkoutViewOpen && (
        <WorkoutViewModal isOpen={isWorkoutViewOpen} workout={selectedWorkout} onClose={handleCloseWorkoutView} />
      )}
    </div>
  )
}
