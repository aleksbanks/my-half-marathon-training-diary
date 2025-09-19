import { useEffect, useRef, useState } from 'react'

import styles from './UserInfo.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectUserRole } from '@/app/store/selectors/authSelectors'
import { logoutUser } from '@/app/store/slices/authSlice'
import { USER_ROLES } from '@/shared/lib/authUtils'

type RoleDisplayInfo = {
  name: string
  description: string
}

const roleDisplayInfo: Record<string, RoleDisplayInfo> = {
  [USER_ROLES.VIEWER]: {
    name: 'Viewer',
    description: 'Only reading'
  },
  [USER_ROLES.EDITOR]: {
    name: 'Sasha',
    description: 'Full access'
  }
}

export function UserInfo() {
  const dispatch = useAppDispatch()
  const userRole = useAppSelector(selectUserRole)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    dispatch(logoutUser())
    setIsPopupOpen(false)
  }

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  // Close the popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false)
      }
    }

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPopupOpen])

  if (!userRole) return null

  const roleInfo = roleDisplayInfo[userRole]

  return (
    <div className={styles.userInfoContainer} ref={popupRef}>
      <button className={`${styles.userIcon} ${styles[userRole]}`} title='User menu' onClick={togglePopup}>
        {roleInfo.name.charAt(0)}
      </button>

      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div className={styles.userDetails}>
              <div className={`${styles.popupUserIcon} ${styles[userRole]}`}>{roleInfo.name.charAt(0)}</div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{roleInfo.name}</p>
                <p className={styles.userDescription}>{roleInfo.description}</p>
              </div>
            </div>
            <button className={styles.logoutButton} title='Exit the system' onClick={handleLogout}>
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
