import type { UserRole } from '@/shared/lib/authUtils'
import type { User } from '@supabase/supabase-js'

/**
 * Authentication state of the user
 */
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  role: UserRole | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

/**
 * User profile from the user_profiles table
 */
export interface UserProfile {
  id: string // UUID, associated with auth.users.id
  role: UserRole
  created_at: string
  updated_at: string
}

/**
 * Login form payload
 */
export interface LoginForm {
  selectedRole: UserRole // UI selection
  password?: string // Password only for editor
}

/**
 * Credentials for Supabase authentication
 */
export interface AuthCredentials {
  email: string
  password: string
}
