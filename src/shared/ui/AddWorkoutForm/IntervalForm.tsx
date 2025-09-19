import { memo } from 'react'

import type { DistanceUnit, Interval } from '@/shared/model/types'

import styles from './AddWorkoutForm.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectIsIntervalFormCollapsed } from '@/app/store/selectors/uiSelector'
import { toggleIntervalFormCollapsed } from '@/app/store/slices/uiSlice'

// Convert decimal minutes to "minutes:seconds" format
const formatPace = (decimalMinutes: number): string => {
  const minutes = Math.floor(decimalMinutes)
  const seconds = Math.round((decimalMinutes - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export type IntervalFormData = Omit<Interval, 'id' | 'duration_min'> & {
  duration_minutes: number
  duration_seconds: number
}

interface IntervalFormProps {
  interval: IntervalFormData
  index: number
  onUpdate: (index: number, data: IntervalFormData) => void
  onRemove: (index: number) => void
  onCopy: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  unit: DistanceUnit
}

export const IntervalForm = memo(
  ({ interval, index, onUpdate, onRemove, onCopy, onReorder, unit }: IntervalFormProps) => {
    const dispatch = useAppDispatch()

    const isCollapsed = useAppSelector((state) => selectIsIntervalFormCollapsed(state, `interval-${index}`))

    const handleToggleCollapsed = () => {
      dispatch(toggleIntervalFormCollapsed(`interval-${index}`))
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
      if (fromIndex !== index) {
        onReorder(fromIndex, index)
      }
    }

    const handleChange = (field: keyof IntervalFormData, value: string | number | boolean) => {
      const newInterval = { ...interval, [field]: value }

      // Auto-calculate pace if both distance and duration are provided
      if (
        field === 'distance_km' ||
        field === 'distance_miles' ||
        field === 'duration_minutes' ||
        field === 'duration_seconds'
      ) {
        let distanceKm = interval.distance_km || 0
        let distanceMiles = interval.distance_miles || 0

        if (field === 'distance_km') {
          distanceKm = value as number
          distanceMiles = Number(((value as number) / 1.60934).toFixed(2))

          newInterval.distance_km = distanceKm
          newInterval.distance_miles = distanceMiles
        }
        if (field === 'distance_miles') {
          distanceKm = Number(((value as number) * 1.60934).toFixed(2))
          distanceMiles = value as number

          newInterval.distance_km = distanceKm
          newInterval.distance_miles = distanceMiles
        }

        const totalMinutes = field === 'duration_minutes' ? (value as number) : interval.duration_minutes
        const totalSeconds = field === 'duration_seconds' ? (value as number) : interval.duration_seconds
        const totalDurationMinutes = totalMinutes + totalSeconds / 60

        // Use the appropriate distance based on the unit
        const distance = unit === 'miles' ? distanceMiles : distanceKm

        if (distance > 0 && totalDurationMinutes > 0) {
          const paceKm = Number((totalDurationMinutes / distanceKm).toFixed(2))

          const paceMiles = Number((totalDurationMinutes / distanceMiles).toFixed(2))

          newInterval.pace_km = paceKm
          newInterval.pace_miles = paceMiles
        }
      }

      onUpdate(index, newInterval)
    }

    return (
      <div className={styles.intervalForm} onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className={styles.intervalHeader}>
          <div className={styles.intervalTitle}>
            <div
              draggable
              className={styles.dragHandle}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}>
              ⋮⋮
            </div>
            <h4>Interval {index + 1}</h4>
            <button
              aria-label={isCollapsed ? 'Expand interval' : 'Collapse interval'}
              className={styles.collapseButton}
              type='button'
              onClick={handleToggleCollapsed}>
              <svg
                className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ''}`}
                fill='none'
                height='20'
                viewBox='0 0 20 20'
                width='20'>
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
          <div className={styles.intervalActions}>
            <button
              aria-label='Copy interval'
              className={styles.iconButton}
              title='Copy interval'
              type='button'
              onClick={() => onCopy(index)}>
              <svg className={styles.icon} fill='none' height='24' viewBox='0 0 24 24' width='24'>
                <path
                  clipRule='evenodd'
                  d='M3.99622 4.99705C3.99622 4.4443 4.44431 3.99622 4.99705 3.99622H15.0012C15.554 3.99622 16.0021 4.4443 16.0021 4.99705V5.99792H8.99793C7.34107 5.99792 5.99793 7.34107 5.99793 8.99793V16.002H4.99705C4.44431 16.002 3.99622 15.554 3.99622 15.0012V4.99705ZM5.99793 18.002H4.99705C3.33974 18.002 1.99622 16.6585 1.99622 15.0012V4.99705C1.99622 3.33973 3.33974 1.99622 4.99705 1.99622H15.0012C16.6585 1.99622 18.0021 3.33973 18.0021 4.99705V5.99792H19.0038C20.6606 5.99792 22.0038 7.34107 22.0038 8.99792V19.0038C22.0038 20.6606 20.6606 22.0038 19.0038 22.0038H8.99793C7.34108 22.0038 5.99793 20.6606 5.99793 19.0038V18.002ZM7.99793 8.99793C7.99793 8.44564 8.44564 7.99792 8.99793 7.99792H19.0038C19.556 7.99792 20.0038 8.44564 20.0038 8.99792V19.0038C20.0038 19.556 19.556 20.0038 19.0038 20.0038H8.99793C8.44564 20.0038 7.99793 19.556 7.99793 19.0038V8.99793Z'
                  fill='currentColor'
                  fillRule='evenodd'
                />
              </svg>
            </button>
            <button
              aria-label='Remove interval'
              className={styles.iconButton}
              title='Remove interval'
              type='button'
              onClick={() => onRemove(index)}>
              <svg className={styles.icon} fill='none' height='24' viewBox='0 0 24 24' width='24'>
                <path
                  d='M9.75 10.4118V16.7647M14.25 10.4118V16.7647M18.75 6.17647V18.8824C18.75 20.0519 17.7426 21 16.5 21H7.5C6.25736 21 5.25 20.0519 5.25 18.8824V6.17647M3 6.17647H21M15.375 6.17647V5.11765C15.375 3.9481 14.3676 3 13.125 3H10.875C9.63236 3 8.625 3.9481 8.625 5.11765V6.17647'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                />
              </svg>
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                placeholder='e.g., Warm up, Fast interval, Cool down'
                type='text'
                value={interval.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Distance ({unit})</label>
              <input
                className={styles.input}
                min='0.01'
                step='0.01'
                type='number'
                value={unit === 'miles' ? interval.distance_miles : interval.distance_km}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    if (unit === 'miles') {
                      handleChange('distance_miles', value)
                    } else {
                      handleChange('distance_km', value)
                    }
                  }
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Duration</label>
              <div className={styles.durationInputs}>
                <div className={styles.durationField}>
                  <input
                    className={styles.input}
                    min='0'
                    type='number'
                    value={interval.duration_minutes}
                    onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value) || 0)}
                  />
                  <span className={styles.durationLabel}>min</span>
                </div>
                <div className={styles.durationField}>
                  <input
                    className={styles.input}
                    max='59'
                    min='0'
                    type='number'
                    value={interval.duration_seconds}
                    onChange={(e) => handleChange('duration_seconds', parseInt(e.target.value) || 0)}
                  />
                  <span className={styles.durationLabel}>sec</span>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Pace</label>
              <div className={styles.paceDisplay}>
                <span className={styles.paceValue}>
                  {unit === 'miles' ? formatPace(interval.pace_miles || 0) : formatPace(interval.pace_km || 0)} min/
                  {unit}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  checked={interval.has_rest_after}
                  type='checkbox'
                  onChange={(e) => handleChange('has_rest_after', e.target.checked)}
                />
                Rest period after this interval
              </label>
            </div>

            {interval.has_rest_after && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Rest Duration (seconds)</label>
                <input
                  className={styles.input}
                  min='0'
                  type='number'
                  value={interval.rest_duration_seconds}
                  onChange={(e) => handleChange('rest_duration_seconds', parseInt(e.target.value) || 0)}
                />
              </div>
            )}
          </>
        )}
      </div>
    )
  }
)

IntervalForm.displayName = 'IntervalForm'
