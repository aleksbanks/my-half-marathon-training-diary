import type { RootState } from '../store'

// Selector for weekPlans from the store
export const selectWeekPlans = (state: RootState) => state.weekPlans.weekPlans

// Selector for loading from the store
export const selectLoading = (state: RootState) => state.weekPlans.loading

// Selector for error from the store
export const selectError = (state: RootState) => state.weekPlans.error

// Selector for selectedWeekPlan from the store
export const selectSelectedWeekPlan = (state: RootState) => state.weekPlans.selectedWeekPlan

// Selector for selectedWorkout from the store
export const selectSelectedWorkout = (state: RootState) => state.weekPlans.selectedWorkout
