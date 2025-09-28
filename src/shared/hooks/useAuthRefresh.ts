import { useEffect } from 'react'

import { useAppDispatch } from '@/app/store/hooks'
import { logoutUser } from '@/app/store/slices/authSlice'
import { refreshSession, signOut } from '@/shared/api/authApi'

/**
 * Hook for refreshing authentication session on app start
 * - Attempts to refresh the session token
 * - If refresh fails or token is invalid, signs out and redirects to login
 */
export const useAuthRefresh = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleAuthRefresh = async () => {
      try {
        // Attempt to refresh the session
        const refreshResult = await refreshSession()

        if (!refreshResult || !refreshResult.user || !refreshResult.session) {
          // If refresh failed or no valid session, sign out
          console.log('Session refresh failed, signing out...')
          await signOut()
          dispatch(logoutUser())
          return
        }

        // Check if the session is valid (not expired)
        const now = Math.floor(Date.now() / 1000)
        if (refreshResult.session.expires_at && refreshResult.session.expires_at < now) {
          console.log('Session expired, signing out...')
          await signOut()
          dispatch(logoutUser())
          return
        }

        console.log('Session refreshed successfully')
      } catch (error) {
        console.error('Error during auth refresh:', error)
        // On any error, sign out and redirect to login
        await signOut()
        dispatch(logoutUser())
      }
    }

    // Run refresh on app start
    handleAuthRefresh()
  }, [dispatch])
}
