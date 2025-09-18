import { useEffect } from 'react'

import { WeekCard } from './WeekCard'

import type { WeekPlanWithWorkouts, Workout } from '@/shared/model/types'
import type { WorkoutFormData } from '@/shared/ui/AddWorkoutForm/AddWorkoutForm'

import styles from './WeekList.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectIsAddWorkoutModalOpen, selectIsWorkoutViewModalOpen } from '@/app/store/selectors/uiSelector'
import {
  selectError,
  selectLoading,
  selectSelectedWeekPlan,
  selectSelectedWorkout,
  selectWeekPlans
} from '@/app/store/selectors/weekPlansSelector'
import { setAddWorkoutModalOpen, setWorkoutViewModalOpen } from '@/app/store/slices/uiSlice'
import { addWorkout, fetchWeekPlans, setSelectedWeekPlan, setSelectedWorkout } from '@/app/store/slices/weekPlansSlice'
import { AddWorkoutModal } from '@/shared/ui/AddWorkoutModal/AddWorkoutModal'
import { WorkoutViewModal } from '@/shared/ui/WorkoutViewModal/WorkoutViewModal'

export const WeekList = () => {
  const dispatch = useAppDispatch()
  const weekPlans = useAppSelector(selectWeekPlans)
  const loading = useAppSelector(selectLoading)
  const error = useAppSelector(selectError)
  const selectedWeekPlan = useAppSelector(selectSelectedWeekPlan)
  const selectedWorkout = useAppSelector(selectSelectedWorkout)
  const isAddWorkoutModalOpen = useAppSelector(selectIsAddWorkoutModalOpen)
  const isWorkoutViewModalOpen = useAppSelector(selectIsWorkoutViewModalOpen)

  useEffect(() => {
    dispatch(fetchWeekPlans())
  }, [dispatch])

  const handleAddWorkout = (weekPlan: WeekPlanWithWorkouts) => {
    dispatch(setSelectedWeekPlan(weekPlan))
    dispatch(setAddWorkoutModalOpen(true))
  }

  const handleCloseModal = () => {
    dispatch(setAddWorkoutModalOpen(false))
    dispatch(setSelectedWeekPlan(null))
  }

  const handleWorkoutClick = (workout: Workout) => {
    dispatch(setSelectedWorkout(workout))
    dispatch(setWorkoutViewModalOpen(true))
  }

  const handleCloseWorkoutView = () => {
    dispatch(setWorkoutViewModalOpen(false))
    dispatch(setSelectedWorkout(null))
  }

  const handleSubmitWorkout = async (workoutData: WorkoutFormData) => {
    dispatch(addWorkout(workoutData))
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
        {weekPlans.map((weekPlan: WeekPlanWithWorkouts) => (
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
          isOpen={isAddWorkoutModalOpen}
          weekNumber={selectedWeekPlan.week_number}
          weekPlanId={selectedWeekPlan.id}
          onClose={handleCloseModal}
          onSubmit={handleSubmitWorkout}
        />
      )}

      {selectedWorkout && (
        <WorkoutViewModal isOpen={isWorkoutViewModalOpen} workout={selectedWorkout} onClose={handleCloseWorkoutView} />
      )}
    </div>
  )
}
