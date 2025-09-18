import type { RootState } from '../store'

// Selector for isSubmitting from the store
export const selectIsSubmitting = (state: RootState) => state.workoutForm.isSubmitting

// Selector for errors from the store
export const selectErrors = (state: RootState) => state.workoutForm.errors

// Selector for formData from the store
export const selectFormData = (state: RootState) => state.workoutForm.formData

// Selector for intervals from the store
export const selectIntervals = (state: RootState) => state.workoutForm.intervals
