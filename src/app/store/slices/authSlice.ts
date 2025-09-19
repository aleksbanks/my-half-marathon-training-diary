import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthState, LoginForm } from '@/shared/model/authTypes'
import type { User } from '@supabase/supabase-js'

import { authenticateSasha, createViewerSession, getCurrentUser, getUserProfile, signOut } from '@/shared/api/authApi'
import { type UserRole } from '@/shared/lib/authUtils'

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  isLoading: false,
  isInitialized: false,
  error: null
}

/**
 * Async thunk for login
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ selectedRole, password }: LoginForm, { rejectWithValue }) => {
    try {
      // For viewer create local session
      if (selectedRole === 'viewer') {
        const session = createViewerSession()
        return { user: null, role: session.role }
      }

      // For Sasha authentication through Supabase
      if (selectedRole === 'editor') {
        if (!password) {
          return rejectWithValue('Password is required for Sasha')
        }

        const result = await authenticateSasha(password)
        if (!result) {
          return rejectWithValue('Invalid password or authentication error')
        }

        return { user: result.user, role: result.role }
      }

      return rejectWithValue('Unknown user type')
    } catch (error) {
      return rejectWithValue('Error during login')
    }
  }
)

/**
 * Async thunk for initializing authentication when loading
 */
export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { user: null, role: null }
    }

    // Get user profile with role
    const profile = await getUserProfile(user.id)
    if (!profile) {
      return rejectWithValue('User profile not found')
    }

    return { user, role: profile.role }
  } catch (error) {
    return rejectWithValue('Authentication initialization error')
  }
})

/**
 * Async thunk for logout
 */
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut()
    return null
  } catch (error) {
    return rejectWithValue('Error signing out')
  }
})

/**
 * Auth slice
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null
    },

    /**
     * Manual setting of state (for restoring from localStorage)
     */
    setAuthState: (state, action: PayloadAction<{ user: User | null; role: UserRole }>) => {
      // state.isAuthenticated = true
      state.user = action.payload.user
      state.role = action.payload.role
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      // Login fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.role = action.payload.role
        state.error = null
      })
      // Login rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.role = null
        state.error = action.payload as string
      })
      // Initialize auth pending
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true
      })
      // Initialize auth fulfilled
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.isInitialized = true
        if (action.payload.user && action.payload.role) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.role = action.payload.role
        } else {
          state.isAuthenticated = false
          state.user = null
          state.role = null
        }
        state.error = null
      })
      // Initialize auth rejected
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false
        state.isInitialized = true
        state.isAuthenticated = false
        state.user = null
        state.role = null
        state.error = action.payload as string
      })
      // Logout fulfilled
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.role = null
        state.error = null
      })
      // Logout rejected
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const { clearError, setAuthState } = authSlice.actions
