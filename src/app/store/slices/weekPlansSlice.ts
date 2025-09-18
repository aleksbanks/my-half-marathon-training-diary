import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { WeekPlanWithWorkouts, Workout } from '@/shared/model/types'
import type { WorkoutFormData } from '@/shared/ui/AddWorkoutForm/AddWorkoutForm'

import { createWorkout, fetchWeekPlansWithWorkouts } from '@/entities/week-plan/api'

interface WeekPlansState {
  weekPlans: WeekPlanWithWorkouts[]
  loading: boolean
  error: string | null
  selectedWeekPlan: WeekPlanWithWorkouts | null
  selectedWorkout: Workout | null
}

const initialState: WeekPlansState = {
  weekPlans: [],
  loading: false,
  error: null,
  selectedWeekPlan: null,
  selectedWorkout: null
}

// Async thunks
export const fetchWeekPlans = createAsyncThunk('weekPlans/fetchWeekPlans', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchWeekPlansWithWorkouts()
    return data
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to load week plans')
  }
})

export const addWorkout = createAsyncThunk(
  'weekPlans/addWorkout',
  async (workoutData: WorkoutFormData, { rejectWithValue }) => {
    try {
      // Convert intervals to the format expected by the API
      const intervals = workoutData.intervals?.map((interval) => ({
        ...interval,
        duration_min: interval.duration_minutes + interval.duration_seconds / 60
      }))
      const newWorkout = await createWorkout({
        ...workoutData,
        intervals
      })
      return { newWorkout, weekPlanId: workoutData.week_plan_id }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add workout')
    }
  }
)

export const weekPlansSlice = createSlice({
  name: 'weekPlans',
  initialState,
  reducers: {
    setSelectedWeekPlan: (state, action: PayloadAction<WeekPlanWithWorkouts | null>) => {
      state.selectedWeekPlan = action.payload
    },
    setSelectedWorkout: (state, action: PayloadAction<Workout | null>) => {
      state.selectedWorkout = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch week plans
      .addCase(fetchWeekPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeekPlans.fulfilled, (state, action) => {
        state.loading = false
        state.weekPlans = action.payload
      })
      .addCase(fetchWeekPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Add workout
      .addCase(addWorkout.fulfilled, (state, action) => {
        const { newWorkout, weekPlanId } = action.payload
        state.weekPlans = state.weekPlans.map((weekPlan) =>
          weekPlan.id === weekPlanId ? { ...weekPlan, workouts: [...weekPlan.workouts, newWorkout] } : weekPlan
        )
      })
      .addCase(addWorkout.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const { setSelectedWeekPlan, setSelectedWorkout, clearError } = weekPlansSlice.actions
