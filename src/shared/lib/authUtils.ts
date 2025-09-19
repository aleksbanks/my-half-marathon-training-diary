/**
 * User roles
 */
export const USER_ROLES = {
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/**
 * Check permissions for the role
 */
export const hasEditPermission = (role: UserRole | null): boolean => {
  return role === USER_ROLES.EDITOR
}

export const hasViewPermission = (role: UserRole | null): boolean => {
  return role === USER_ROLES.EDITOR || role === USER_ROLES.VIEWER
}

/**
 * Hidden credentials for Sasha
 */
export const SASHA_CREDENTIALS = {
  email: import.meta.env.VITE_SASHA_EMAIL
} as const
