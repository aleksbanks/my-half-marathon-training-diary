import type { Workout } from '@/shared/model/types'

import { Modal } from '@/shared/ui/Modal/Modal'
import { WorkoutView } from '@/shared/ui/WorkoutView/WorkoutView'

interface WorkoutViewModalProps {
  isOpen: boolean
  workout: Workout | null
  onClose: () => void
}

export const WorkoutViewModal = ({ isOpen, workout, onClose }: WorkoutViewModalProps) => {
  if (!workout) return null

  return (
    <Modal isOpen={isOpen} title='Workout Details' onClose={onClose}>
      <WorkoutView workout={workout} />
    </Modal>
  )
}
