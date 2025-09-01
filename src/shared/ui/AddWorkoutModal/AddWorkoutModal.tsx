import type { WorkoutFormData } from '@/shared/ui/AddWorkoutForm/AddWorkoutForm'

import { AddWorkoutForm } from '@/shared/ui/AddWorkoutForm/AddWorkoutForm'
import { Modal } from '@/shared/ui/Modal/Modal'

interface AddWorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  weekPlanId: number
  weekNumber: number
  onSubmit: (workoutData: WorkoutFormData) => Promise<void>
}

export const AddWorkoutModal = ({ isOpen, onClose, weekPlanId, weekNumber, onSubmit }: AddWorkoutModalProps) => {
  const handleSubmit = async (workoutData: WorkoutFormData) => {
    await onSubmit(workoutData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} title={`Add Workout - Week ${weekNumber}`} onClose={onClose}>
      <AddWorkoutForm weekPlanId={weekPlanId} onCancel={onClose} onSubmit={handleSubmit} />
    </Modal>
  )
}
