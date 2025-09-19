import { useAppSelector } from '@/app/store/hooks'
import { selectUserRole } from '@/app/store/selectors/authSelectors'
import { hasEditPermission, hasViewPermission } from '@/shared/lib/authUtils'

interface RoleGuardProps {
  children: React.ReactNode
  requireEdit?: boolean
  requireView?: boolean
  fallback?: React.ReactNode
}

/**
 * Component for controlling access by roles
 */
export function RoleGuard({ children, requireEdit = false, requireView = false, fallback = null }: RoleGuardProps) {
  const userRole = useAppSelector(selectUserRole)

  // Check access permissions
  const hasAccess = (() => {
    if (requireEdit) {
      return hasEditPermission(userRole)
    }
    if (requireView) {
      return hasViewPermission(userRole)
    }
    // By default, don't allow access
    return true
  })()

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
