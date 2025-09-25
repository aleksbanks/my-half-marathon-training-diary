import type { Workout } from '@/shared/model/types'
import type { WorkoutFormData } from '@/shared/ui/EditWorkoutForm/EditWorkoutForm'

import { EditWorkoutForm } from '@/shared/ui/EditWorkoutForm/EditWorkoutForm'
import { Modal } from '@/shared/ui/Modal/Modal'

interface EditWorkoutModalProps {
  isOpen: boolean
  workout: Workout | null
  onClose: () => void
  onSubmit: (workoutData: WorkoutFormData) => Promise<void>
}

export const EditWorkoutModal = ({ isOpen, workout, onClose, onSubmit }: EditWorkoutModalProps) => {
  const handleSubmit = async (workoutData: WorkoutFormData) => {
    await onSubmit(workoutData)
    onClose()
  }

  if (!workout) return null

  return (
    <Modal isOpen={isOpen} title={`Edit Workout - ${workout.date}`} onClose={onClose}>
      <EditWorkoutForm workout={workout} onCancel={onClose} onSubmit={handleSubmit} />
    </Modal>
  )
}
