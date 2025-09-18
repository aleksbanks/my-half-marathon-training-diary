import type { RootState } from '../store'

// Selector for isAddWorkoutModalOpen from the store
export const selectIsAddWorkoutModalOpen = (state: RootState) => state.ui.isAddWorkoutModalOpen

// Selector for isWorkoutViewModalOpen from the store
export const selectIsWorkoutViewModalOpen = (state: RootState) => state.ui.isWorkoutViewModalOpen

// Selector for isIntervalFormCollapsed from the store
export const selectIsIntervalFormCollapsed = (state: RootState, intervalId: string) =>
  state.ui.isIntervalFormCollapsed[intervalId] ?? false

// Selector for isCollapsibleCardExpanded from the store by cardId
export const selectIsCollapsibleCardExpanded = (state: RootState, cardId: string) =>
  state.ui.isCollapsibleCardExpanded[cardId] ?? false
