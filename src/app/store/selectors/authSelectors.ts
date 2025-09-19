import type { RootState } from '../store'

/**
 * Selector for getting the authentication state
 */
export const selectAuth = (state: RootState) => state.auth

/**
 * Selector for checking authentication
 */
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated

/**
 * Selector for getting the user role
 */
export const selectUserRole = (state: RootState) => state.auth.role

/**
 * Selector for checking loading
 */
export const selectAuthLoading = (state: RootState) => state.auth.isLoading

/**
 * Selector for getting the authentication error
 */
export const selectAuthError = (state: RootState) => state.auth.error
