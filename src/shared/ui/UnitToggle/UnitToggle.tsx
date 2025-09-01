import { memo } from 'react'

import styles from './UnitToggle.module.css'

import { useDistanceUnitStore } from '@/shared/lib/distanceUnitStore'

export const UnitToggle = memo(
  ({ size = 'medium', showLabel = true }: { size?: 'medium' | 'small'; showLabel?: boolean }) => {
    const { unit, toggleUnit } = useDistanceUnitStore()

    return (
      <div className={`${styles.container} ${styles[size]}`}>
        {showLabel && <label className={styles.label}>Distance Unit:</label>}
        <button className={`${styles.toggle} ${unit !== 'km' ? styles.active : ''}`} type='button' onClick={toggleUnit}>
          <span className={styles.option}>km</span>
          <span className={styles.option}>miles</span>
          <div className={styles.slider} />
        </button>
      </div>
    )
  }
)

UnitToggle.displayName = 'UnitToggle'
