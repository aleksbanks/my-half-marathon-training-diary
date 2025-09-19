import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectAuth } from '@/app/store/selectors/authSelectors'
import { initializeAuth } from '@/app/store/slices/authSlice'

/**
 * Hook for initializing authentication when the app loads
 * Checks the current user in Supabase and restores the session
 */
export const useAuthInit = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)

  useEffect(() => {
    // Only initialize authentication once when the app loads
    if (!auth.isInitialized) {
      dispatch(initializeAuth())
    }
  }, [dispatch, auth.isInitialized])

  return auth
}
