import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { DistanceUnit } from '@/shared/model/types'

interface DistanceUnitState {
  unit: DistanceUnit
  setUnit: (unit: DistanceUnit) => void
  toggleUnit: () => void
}

export const useDistanceUnitStore = create<DistanceUnitState>()(
  persist(
    (set, get) => ({
      unit: 'km',
      setUnit: (unit) => set({ unit }),
      toggleUnit: () => set({ unit: get().unit === 'km' ? 'miles' : 'km' })
    }),
    {
      name: 'distance-unit-storage'
    }
  )
)
