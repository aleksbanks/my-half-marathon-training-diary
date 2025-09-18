import { memo } from 'react'

import styles from './CollapsibleCard.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectIsCollapsibleCardExpanded } from '@/app/store/selectors/uiSelector'
import { toggleCollapsibleCardExpanded } from '@/app/store/slices/uiSlice'

interface CollapsibleCardProps {
  title: string
  children: React.ReactNode
  headerContent?: React.ReactNode
  defaultExpanded?: boolean
}

export const CollapsibleCard = memo(
  ({ title, children, headerContent, defaultExpanded = false }: CollapsibleCardProps) => {
    const dispatch = useAppDispatch()
    const cardId = `card-${title.replace(/\s+/g, '-').toLowerCase()}`
    const isExpanded = useAppSelector((state) => selectIsCollapsibleCardExpanded(state, cardId)) ?? defaultExpanded

    const toggleExpanded = () => {
      dispatch(toggleCollapsibleCardExpanded(cardId))
    }

    return (
      <div className={styles.card}>
        <div className={styles.header} onClick={toggleExpanded}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{title}</h3>
            {headerContent && <div className={styles.headerContent}>{headerContent}</div>}
          </div>
          <button
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
            type='button'>
            <svg className={styles.chevron} fill='none' height='30' viewBox='0 0 20 20' width='30'>
              <path
                d='M6 8L10 12L14 8'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              />
            </svg>
          </button>
        </div>

        <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
          <div className={styles.contentInner}>{children}</div>
        </div>
      </div>
    )
  }
)

CollapsibleCard.displayName = 'CollapsibleCard'
