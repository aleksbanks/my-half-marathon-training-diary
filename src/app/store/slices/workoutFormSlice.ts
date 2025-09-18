import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { WorkoutType } from '@/shared/model/types'
import type { IntervalFormData } from '@/shared/ui/AddWorkoutForm/IntervalForm'

interface WorkoutFormState {
  isSubmitting: boolean
  errors: Record<string, string>
  formData: {
    date: string
    type: WorkoutType
    distance_km: number
    distance_miles: number
    duration_minutes: number
    duration_seconds: number
    notes: string
    intervals: IntervalFormData[]
  }
  intervals: IntervalFormData[]
}

const initialFormData = {
  date: new Date().toISOString().split('T')[0],
  type: 'easy' as WorkoutType,
  distance_km: 0,
  distance_miles: 0,
  duration_minutes: 0,
  duration_seconds: 0,
  notes: '',
  intervals: []
}

const initialState: WorkoutFormState = {
  isSubmitting: false,
  errors: {},
  formData: initialFormData,
  intervals: []
}

export const workoutFormSlice = createSlice({
  name: 'workoutForm',
  initialState,
  reducers: {
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload]
    },
    updateFormData: (state, action: PayloadAction<{ field: string; value: string | number }>) => {
      const { field, value } = action.payload
      let distanceKm = state.formData.distance_km
      let distanceMiles = state.formData.distance_miles

      if (field === 'distance_km') {
        distanceKm = value as number
        distanceMiles = Number(((value as number) / 1.60934).toFixed(2))
      }
      if (field === 'distance_miles') {
        distanceKm = Number(((value as number) * 1.60934).toFixed(2))
        distanceMiles = value as number
      }

      state.formData = {
        ...state.formData,
        [field]: value,
        distance_km: distanceKm,
        distance_miles: distanceMiles
      }

      // Clear error when user starts typing
      if (state.errors[field]) {
        delete state.errors[field]
      }
    },
    addInterval: (state) => {
      const newInterval: IntervalFormData = {
        name: '',
        distance_km: 0,
        distance_miles: 0,
        duration_minutes: 0,
        duration_seconds: 0,
        pace_km: 0,
        pace_miles: 0,
        has_rest_after: false,
        rest_duration_seconds: 60
      }
      state.intervals.push(newInterval)
    },
    updateInterval: (state, action: PayloadAction<{ index: number; data: IntervalFormData }>) => {
      const { index, data } = action.payload
      state.intervals[index] = data
    },
    removeInterval: (state, action: PayloadAction<number>) => {
      state.intervals.splice(action.payload, 1)
    },
    copyInterval: (state, action: PayloadAction<number>) => {
      const intervalToCopy = state.intervals[action.payload]
      if (intervalToCopy) {
        state.intervals.splice(action.payload + 1, 0, { ...intervalToCopy })
      }
    },
    reorderIntervals: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [movedInterval] = state.intervals.splice(fromIndex, 1)
      state.intervals.splice(toIndex, 0, movedInterval)
    },
    resetForm: (state) => {
      state.formData = initialFormData
      state.intervals = []
      state.errors = {}
      state.isSubmitting = false
    }
  }
})

export const {
  setSubmitting,
  setErrors,
  clearError,
  updateFormData,
  addInterval,
  updateInterval,
  removeInterval,
  copyInterval,
  reorderIntervals,
  resetForm
} = workoutFormSlice.actions
