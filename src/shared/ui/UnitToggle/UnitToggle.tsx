import { memo } from 'react'

import styles from './UnitToggle.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectDistanceUnit } from '@/app/store/selectors/unitSelectors'
import { toggleUnit } from '@/app/store/slices/distanceUnitSlice'

export const UnitToggle = memo(
  ({ size = 'medium', showLabel = true }: { size?: 'medium' | 'small'; showLabel?: boolean }) => {
    const dispatch = useAppDispatch()
    const unit = useAppSelector(selectDistanceUnit)

    const handleToggleUnit = () => {
      dispatch(toggleUnit())
    }

    return (
      <div className={`${styles.container} ${styles[size]}`}>
        {showLabel && <label className={styles.label}>Distance Unit:</label>}
        <button
          className={`${styles.toggle} ${unit !== 'km' ? styles.active : ''}`}
          type='button'
          onClick={handleToggleUnit}>
          <span className={styles.option}>km</span>
          <span className={styles.option}>miles</span>
          <div className={styles.slider} />
        </button>
      </div>
    )
  }
)

UnitToggle.displayName = 'UnitToggle'
