import type { AuthCredentials, UserProfile } from '@/shared/model/authTypes'
import type { User } from '@supabase/supabase-js'

import { supabase } from '@/shared/config/supabase'
import { SASHA_CREDENTIALS, USER_ROLES, type UserRole } from '@/shared/lib/authUtils'

/**
 * Authentication through Supabase Auth
 */
export const signInWithCredentials = async (credentials: AuthCredentials): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) {
      console.error('Supabase auth error:', error.message)
      return null
    }

    return data.user
  } catch (error) {
    console.error('Error signing in:', error)
    return null
  }
}

/**
 * Getting user profile with role
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Creating profile for viewer (temporary user)
 * Viewer is not authenticated through Supabase, it exists only in the client
 */
export const createViewerSession = (): { role: UserRole } => {
  return { role: USER_ROLES.VIEWER }
}

/**
 * Authentication with password
 */
export const authenticateSasha = async (password: string): Promise<{ user: User; role: UserRole } | null> => {
  try {
    // Authenticate in Supabase with hidden credentials
    const user = await signInWithCredentials({
      email: SASHA_CREDENTIALS.email,
      password
    })

    if (!user) {
      return null
    }

    // Getting profile with role
    const profile = await getUserProfile(user.id)

    if (!profile || profile.role !== USER_ROLES.EDITOR) {
      console.error('User profile not found or invalid role')
      await supabase.auth.signOut() // Exit if role is invalid
      return null
    }

    return { user, role: profile.role }
  } catch (error) {
    console.error('Error authenticating Sasha:', error)
    return null
  }
}

/**
 * Logout
 */
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

/**
 * Getting current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
