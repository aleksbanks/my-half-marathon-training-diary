import { useState } from 'react'

import styles from './AuthPage.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectAuth } from '@/app/store/selectors/authSelectors'
import { loginUser } from '@/app/store/slices/authSlice'
import { type UserRole } from '@/shared/lib/authUtils'

/**
 * Auth page component (for viewer and editor)
 * Fallback here if there is no role selected
 */
export function AuthPage() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector(selectAuth)

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [password, setPassword] = useState('')

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role)
    setPassword('')

    if (role === 'viewer') {
      try {
        await dispatch(loginUser({ selectedRole: role, password: undefined })).unwrap()
      } catch (error) {
        console.error('Viewr login failed:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRole || selectedRole === 'viewer') return

    try {
      await dispatch(
        loginUser({
          selectedRole,
          password: password
        })
      ).unwrap()
    } catch (error) {
      // Error is handled in Redux slice
      console.error('Login failed:', error)
    }
  }

  const canSubmit = Boolean(selectedRole && selectedRole === 'editor' && password.trim().length)

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Sasha's Running Diary</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.roleSection}>
            <div className={styles.roleButtons}>
              <button className={styles.roleButton} type='button' onClick={() => handleRoleSelect('viewer')}>
                Viewer
              </button>
              <button
                className={`${styles.roleButton} ${selectedRole === 'editor' ? styles.active : ''}`}
                type='button'
                onClick={() => handleRoleSelect('editor')}>
                Editor
              </button>
            </div>
          </div>

          {selectedRole === 'editor' && (
            <div className={`${styles.roleInfo} ${styles[selectedRole]}`}>
              Full access: viewing, editing and adding workouts
            </div>
          )}

          {selectedRole === 'editor' && (
            <div className={`${styles.passwordSection} ${selectedRole === 'editor' ? styles.visible : ''}`}>
              <label className={styles.passwordLabel}>Password</label>
              <input
                className={styles.passwordInput}
                disabled={isLoading}
                placeholder='Enter password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {selectedRole === 'editor' && (
            <button className={styles.loginButton} disabled={!canSubmit || isLoading} type='submit'>
              {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  Login...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
