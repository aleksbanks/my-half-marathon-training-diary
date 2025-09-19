import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { type PersistConfig, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { authSlice } from './slices/authSlice'
import { distanceUnitSlice } from './slices/distanceUnitSlice'
import { uiSlice } from './slices/uiSlice'
import { weekPlansSlice } from './slices/weekPlansSlice'
import { workoutFormSlice } from './slices/workoutFormSlice'

/**
 * Persist config for Redux
 */
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['distanceUnit', 'auth'] // distanceUnit and auth are persisted in localStorage
}

/**
 * Root reducer for Redux
 */
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  distanceUnit: distanceUnitSlice.reducer,
  weekPlans: weekPlansSlice.reducer,
  ui: uiSlice.reducer,
  workoutForm: workoutFormSlice.reducer
})

/**
 * Persisted reducer for Redux
 */
const persistedReducer = persistReducer(persistConfig, rootReducer)

/**
 * Store for Redux
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

/**
 * Persistor for Redux
 */
export const persistor = persistStore(store)

/**
 * Root state for Redux
 */
export type RootState = ReturnType<typeof rootReducer>

/**
 * App dispatch for Redux
 */
export type AppDispatch = typeof store.dispatch
