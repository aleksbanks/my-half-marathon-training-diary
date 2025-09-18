import { memo, useEffect } from 'react'

import { IntervalForm, type IntervalFormData } from './IntervalForm'

import type { WorkoutType } from '@/shared/model/types'

import styles from './AddWorkoutForm.module.css'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectDistanceUnit } from '@/app/store/selectors/unitSelectors'
import {
  selectErrors,
  selectFormData,
  selectIntervals,
  selectIsSubmitting
} from '@/app/store/selectors/workoutFormSelector'
import {
  addInterval,
  copyInterval,
  removeInterval,
  reorderIntervals,
  resetForm,
  setErrors,
  setSubmitting,
  updateFormData,
  updateInterval
} from '@/app/store/slices/workoutFormSlice'
import { WORKOUT_TYPE_INFO } from '@/shared/lib/workoutUtils'
import { Button } from '@/shared/ui/Button/Button'

interface AddWorkoutFormProps {
  weekPlanId: number
  onCancel: () => void
  onSubmit: (workoutData: WorkoutFormData) => Promise<void>
}

export interface WorkoutFormData {
  week_plan_id: number
  date: string
  type: WorkoutType
  distance_km: number
  distance_miles: number
  duration_minutes: number
  duration_seconds: number
  notes?: string
  intervals?: IntervalFormData[]
}

const WORKOUT_TYPES: { value: WorkoutType; label: string }[] = Object.entries(WORKOUT_TYPE_INFO).map(
  ([value, info]) => ({
    value: value as WorkoutType,
    label: info.name
  })
)

const INTERVAL_WORKOUT_TYPES: WorkoutType[] = ['interval', 'tempo']

export const AddWorkoutForm = memo(({ weekPlanId, onCancel, onSubmit }: AddWorkoutFormProps) => {
  const dispatch = useAppDispatch()
  const unit = useAppSelector(selectDistanceUnit)
  const isSubmitting = useAppSelector(selectIsSubmitting)
  const errors = useAppSelector(selectErrors)
  const formData = useAppSelector(selectFormData)
  const intervals = useAppSelector(selectIntervals)

  useEffect(() => {
    // Reset form when component mounts
    dispatch(resetForm())
  }, [dispatch])

  const handleInputChange = (field: keyof WorkoutFormData, value: string | number) => {
    dispatch(updateFormData({ field, value }))
  }

  const handleAddInterval = () => {
    dispatch(addInterval())
  }

  const handleUpdateInterval = (index: number, data: IntervalFormData) => {
    dispatch(updateInterval({ index, data }))
  }

  const handleRemoveInterval = (index: number) => {
    dispatch(removeInterval(index))
  }

  const handleCopyInterval = (index: number) => {
    dispatch(copyInterval(index))
  }

  const handleReorderIntervals = (fromIndex: number, toIndex: number) => {
    dispatch(reorderIntervals({ fromIndex, toIndex }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (formData.type !== 'interval' && formData.type !== 'tempo' && formData.distance_km <= 0) {
      newErrors.distance = 'Distance must be greater than 0'
    }

    if (
      formData.type !== 'interval' &&
      formData.type !== 'tempo' &&
      formData.duration_minutes <= 0 &&
      formData.duration_seconds <= 0
    ) {
      newErrors.duration = 'Duration must be greater than 0'
    }

    // Validate intervals if this is an interval/tempo workout
    if (INTERVAL_WORKOUT_TYPES.includes(formData.type)) {
      if (intervals.length === 0) {
        newErrors.intervals = 'At least one interval is required for interval/tempo workouts'
      } else {
        intervals.forEach((interval, index) => {
          if (!interval.name.trim()) {
            newErrors[`interval_${index}_name`] = 'Interval name is required'
          }
          if (!interval.distance_km || interval.distance_km <= 0) {
            newErrors[`interval_${index}_distance`] = 'Interval distance must be greater than 0'
          }
          if (interval.duration_minutes <= 0 && interval.duration_seconds <= 0) {
            newErrors[`interval_${index}_duration`] = 'Interval duration must be greater than 0'
          }
          if (interval.has_rest_after && (interval.rest_duration_seconds ?? 0) < 0) {
            newErrors[`interval_${index}_rest`] = 'Rest duration must be non-negative'
          }
        })
      }
    }

    dispatch(setErrors(newErrors))

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    dispatch(setSubmitting(true))
    try {
      const workoutData: WorkoutFormData = {
        ...formData,
        week_plan_id: weekPlanId
      }

      // Add intervals if this is an interval/tempo workout
      if (INTERVAL_WORKOUT_TYPES.includes(formData.type) && intervals.length > 0) {
        workoutData.intervals = intervals.map((interval) => ({
          name: interval.name,
          distance_km: interval.distance_km || 0,
          distance_miles: interval.distance_miles || 0,
          duration_minutes: interval.duration_minutes,
          duration_seconds: interval.duration_seconds,
          pace_km: interval.pace_km,
          pace_miles: interval.pace_miles,
          has_rest_after: interval.has_rest_after,
          rest_duration_seconds: interval.rest_duration_seconds
        }))
      }

      await onSubmit(workoutData)
    } catch (error) {
      console.error('Failed to add workout:', error)
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  const showIntervals = INTERVAL_WORKOUT_TYPES.includes(formData.type)

  return (
    <form className={styles.form} id='workout-form' onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor='date'>
          Date
        </label>
        <input
          className={`${styles.input} ${errors.date ? styles.error : ''}`}
          id='date'
          type='date'
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
        />
        {errors.date && <span className={styles.errorText}>{errors.date}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor='type'>
          Workout Type
        </label>
        <select
          className={styles.select}
          id='type'
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value as WorkoutType)}>
          {WORKOUT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {!showIntervals && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor='distance'>
              Distance ({unit})
            </label>
            <input
              className={`${styles.input} ${errors.distance ? styles.error : ''}`}
              id='distance'
              min='0.01'
              step='0.01'
              type='number'
              value={unit === 'miles' ? formData.distance_miles : formData.distance_km}
              onChange={(e) => {
                const value = parseFloat(e.target.value)
                if (!isNaN(value)) {
                  if (unit === 'miles') {
                    handleInputChange('distance_miles', value)
                  } else {
                    handleInputChange('distance_km', value)
                  }
                }
              }}
            />
            {errors.distance && <span className={styles.errorText}>{errors.distance}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor='duration'>
              Duration (minutes)
            </label>
            <div className={styles.durationInputs}>
              <div className={styles.durationField}>
                <input
                  className={`${styles.input} ${errors.duration ? styles.error : ''}`}
                  id='duration_minutes'
                  min='0'
                  type='number'
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                />
                <span className={styles.durationLabel}>min</span>
              </div>
              <div className={styles.durationField}>
                <input
                  className={`${styles.input} ${errors.duration ? styles.error : ''}`}
                  id='duration_seconds'
                  max='59'
                  min='0'
                  type='number'
                  value={formData.duration_seconds}
                  onChange={(e) => handleInputChange('duration_seconds', parseInt(e.target.value) || 0)}
                />
                <span className={styles.durationLabel}>sec</span>
              </div>
            </div>
            {errors.duration && <span className={styles.errorText}>{errors.duration}</span>}
          </div>
        </>
      )}

      {showIntervals && (
        <div className={styles.intervalsSection}>
          <div className={styles.intervalsHeader}>
            <h3>Intervals</h3>
            <Button size='small' type='button' variant='secondary' onClick={handleAddInterval}>
              Add Interval
            </Button>
          </div>

          {errors.intervals && <span className={styles.errorText}>{errors.intervals}</span>}

          {intervals.map((interval, index) => (
            <IntervalForm
              index={index}
              interval={interval}
              key={index}
              unit={unit}
              onCopy={handleCopyInterval}
              onRemove={handleRemoveInterval}
              onReorder={handleReorderIntervals}
              onUpdate={handleUpdateInterval}
            />
          ))}

          {!intervals.length && (
            <p className={styles.noIntervals}>Click "Add Interval" to start building your {formData.type} workout</p>
          )}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor='notes'>
          Notes (optional)
        </label>
        <textarea
          className={styles.textarea}
          id='notes'
          placeholder='Add any notes about your workout...'
          rows={3}
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <Button disabled={isSubmitting} type='button' variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} type='submit' variant='primary'>
          {isSubmitting ? 'Adding...' : 'Add Workout'}
        </Button>
      </div>
    </form>
  )
})

AddWorkoutForm.displayName = 'AddWorkoutForm'
