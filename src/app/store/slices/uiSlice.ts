import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// State for UI
interface UiState {
  isAddWorkoutModalOpen: boolean
  isWorkoutViewModalOpen: boolean
  isIntervalFormCollapsed: Record<string, boolean> // key: intervalId, value: isCollapsed
  isCollapsibleCardExpanded: Record<string, boolean> // key: cardId, value: isExpanded
}

const initialState: UiState = {
  isAddWorkoutModalOpen: false,
  isWorkoutViewModalOpen: false,
  isIntervalFormCollapsed: {},
  isCollapsibleCardExpanded: {}
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAddWorkoutModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddWorkoutModalOpen = action.payload
    },
    setWorkoutViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWorkoutViewModalOpen = action.payload
    },
    toggleIntervalFormCollapsed: (state, action: PayloadAction<string>) => {
      const intervalId = action.payload
      state.isIntervalFormCollapsed[intervalId] = !state.isIntervalFormCollapsed[intervalId]
    },
    setIntervalFormCollapsed: (state, action: PayloadAction<{ intervalId: string; isCollapsed: boolean }>) => {
      const { intervalId, isCollapsed } = action.payload
      state.isIntervalFormCollapsed[intervalId] = isCollapsed
    },
    toggleCollapsibleCardExpanded: (state, action: PayloadAction<string>) => {
      const cardId = action.payload
      state.isCollapsibleCardExpanded[cardId] = !state.isCollapsibleCardExpanded[cardId]
    },
    setCollapsibleCardExpanded: (state, action: PayloadAction<{ cardId: string; isExpanded: boolean }>) => {
      const { cardId, isExpanded } = action.payload
      state.isCollapsibleCardExpanded[cardId] = isExpanded
    }
  }
})

export const {
  setAddWorkoutModalOpen,
  setWorkoutViewModalOpen,
  toggleIntervalFormCollapsed,
  setIntervalFormCollapsed,
  toggleCollapsibleCardExpanded,
  setCollapsibleCardExpanded
} = uiSlice.actions
