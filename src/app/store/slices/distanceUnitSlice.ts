import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { DistanceUnit } from '@/shared/model/types'

interface DistanceUnitState {
  unit: DistanceUnit
}

const initialState: DistanceUnitState = {
  unit: 'km'
}

export const distanceUnitSlice = createSlice({
  name: 'distanceUnit',
  initialState,
  reducers: {
    setUnit: (state, action: PayloadAction<DistanceUnit>) => {
      state.unit = action.payload
    },
    toggleUnit: (state) => {
      state.unit = state.unit === 'km' ? 'miles' : 'km'
    }
  }
})

export const { setUnit, toggleUnit } = distanceUnitSlice.actions
