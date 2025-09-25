import { useState } from 'react'

import type { Workout } from '@/shared/model/types'
import type { WorkoutFormData } from '@/shared/ui/EditWorkoutForm/EditWorkoutForm'

import { useAppDispatch } from '@/app/store/hooks'
import { updateWorkoutAction } from '@/app/store/slices/weekPlansSlice'
import { EditWorkoutModal } from '@/shared/ui/EditWorkoutModal/EditWorkoutModal'
import { Modal } from '@/shared/ui/Modal/Modal'
import { WorkoutView } from '@/shared/ui/WorkoutView/WorkoutView'

interface WorkoutViewModalProps {
  isOpen: boolean
  workout: Workout | null
  onClose: () => void
}

export const WorkoutViewModal = ({ isOpen, workout, onClose }: WorkoutViewModalProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const dispatch = useAppDispatch()

  if (!workout) return null

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleEditClose = () => {
    setIsEditModalOpen(false)
  }

  const handleUpdateWorkout = async (workoutData: WorkoutFormData) => {
    try {
      await dispatch(updateWorkoutAction({ workoutId: workout.id, workoutData }))
      // Close edit modal after successful update
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Failed to update workout:', error)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} title='Workout Details' onClose={onClose}>
        <WorkoutView workout={workout} onEdit={handleEdit} />
      </Modal>

      <EditWorkoutModal
        isOpen={isEditModalOpen}
        workout={workout}
        onClose={handleEditClose}
        onSubmit={handleUpdateWorkout}
      />
    </>
  )
}
