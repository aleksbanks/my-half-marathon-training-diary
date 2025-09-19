import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/app/store/selectors/authSelectors'
import { AuthPage } from '@/pages/auth/AuthPage'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Component for protecting routes
 * Shows the authentication page if the user is not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return <>{children}</>
}
