import type { RootState } from '../store'

// Selector for distance unit from the store
export const selectDistanceUnit = (state: RootState) => state.distanceUnit.unit
