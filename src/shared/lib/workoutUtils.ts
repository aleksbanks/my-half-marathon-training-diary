import type { WorkoutType } from '@/shared/model/types'

type WorkoutTypeInfo = { name: string; className: string }

// Record object for workout type information
export const WORKOUT_TYPE_INFO: Record<WorkoutType, WorkoutTypeInfo> = {
  easy: { name: 'Easy Run', className: 'workoutTypeEasy' },
  long: { name: 'Long Run', className: 'workoutTypeLong' },
  interval: { name: 'Interval Training', className: 'workoutTypeInterval' },
  social: { name: 'Social Run', className: 'workoutTypeSocial' },
  tempo: { name: 'Tempo Run', className: 'workoutTypeTempo' }
} as const

export const getWorkoutTypeInfo = (type: WorkoutType): WorkoutTypeInfo => {
  return WORKOUT_TYPE_INFO[type] || { name: type, className: 'workoutTypeEasy' }
}

/**
 * Format duration in hours, minutes and seconds
 * @param minutes - The duration in minutes
 * @param restSeconds - Optional rest duration in seconds to subtract
 * @returns The formatted duration in hours, minutes and seconds
 */
export const formatDuration = (minutes: number, restSeconds?: number): string => {
  let totalMinutes = minutes

  // Subtract rest time if provided
  if (restSeconds) {
    totalMinutes -= restSeconds / 60
  }

  const hours = Math.floor(totalMinutes / 60)
  const mins = Math.floor(totalMinutes % 60)
  const secs = Math.round((totalMinutes % 1) * 60)

  return `${hours ? `${hours}h ` : ''}${mins ? `${mins}m ` : ''}${secs ? `${secs}s` : ''}`
}

/**
 * Format pace in minutes and seconds
 * @param pace - The pace in minutes per unit
 * @param unit - The unit of the pace
 * @returns The formatted pace in minutes and seconds per unit
 */
export const formatPace = (pace: number, unit: string): string => {
  const minutes = Math.floor(pace)
  const seconds = Math.round((pace - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')} /${unit}`
}
