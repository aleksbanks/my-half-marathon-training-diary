import { useMemo, useState } from 'react'

import { differenceInDays, intervalToDuration } from 'date-fns'

import { WeeklyProgressChart } from '../weekly-progress-chart/WeeklyProgressChart'

import styles from './RaceCountdown.module.css'

import { useAppSelector } from '@/app/store/hooks'
import { selectWeekPlans } from '@/app/store/selectors/weekPlansSelector'

const START_DATE = new Date(2025, 7, 25, 6, 0, 0) // August 25, 2025 at 6:00 AM
const RACE_DATE = new Date(2025, 11, 14, 6, 0, 0) // December 14, 2025 at 6:00 AM

const TOTAL_DAYS = differenceInDays(RACE_DATE, START_DATE)

const WEEKS_THRESHOLD = 10 // Threshold for switching display format
const DAYS_IN_WEEK = 7
const SINGULAR_FORMS = {
  day: 'day',
  hour: 'hour',
  month: 'month',
  week: 'week'
}
const PLURAL_FORMS = {
  day: 'days',
  hour: 'hours',
  month: 'months',
  week: 'weeks'
}

export const RaceCountdown = () => {
  const [isChartShown, setIsChartShown] = useState(false)

  const now = new Date()
  const duration = intervalToDuration({
    start: now,
    end: RACE_DATE
  })

  const totalDays = differenceInDays(RACE_DATE, now)
  const weeks = Math.floor(totalDays / DAYS_IN_WEEK)
  const weekPlans = useAppSelector(selectWeekPlans)

  const getPluralForm = (count: number, singular: string, plural: string) => {
    return count === 1 ? singular : plural
  }

  const formattedDuration = useMemo(() => {
    if (weeks <= 1) {
      const days = duration.days || 0
      const hours = duration.hours || 0

      const daysText = days ? `${days} ${getPluralForm(days, SINGULAR_FORMS.day, PLURAL_FORMS.day)}` : ''
      const hoursText = hours ? `${hours} ${getPluralForm(hours, SINGULAR_FORMS.hour, PLURAL_FORMS.hour)}` : ''

      const result = daysText + (daysText && hoursText ? ' ' : '') + hoursText
      return result || 'Race starts soon!'
    }

    if (weeks > WEEKS_THRESHOLD) {
      const months = duration.months || 0
      const weeksInMonth = Math.floor((duration.days || 0) / DAYS_IN_WEEK) || 0
      const days = (duration.days || 0) % DAYS_IN_WEEK || 0

      const monthsText = months ? `${months} ${getPluralForm(months, SINGULAR_FORMS.month, PLURAL_FORMS.month)}` : ''
      const weeksText = weeksInMonth
        ? `${weeksInMonth} ${getPluralForm(weeksInMonth, SINGULAR_FORMS.week, PLURAL_FORMS.week)}`
        : ''
      const daysText = days ? `${days} ${getPluralForm(days, SINGULAR_FORMS.day, PLURAL_FORMS.day)}` : ''
      const hoursText = duration.hours
        ? `${duration.hours} ${getPluralForm(duration.hours, SINGULAR_FORMS.hour, PLURAL_FORMS.hour)}`
        : ''

      return [monthsText, weeksText, daysText, hoursText].filter(Boolean).join(' ')
    }

    const weeksInMonth = Math.floor((totalDays || 0) / DAYS_IN_WEEK) || 0
    const days = (totalDays || 0) % DAYS_IN_WEEK || 0

    const weeksText = weeksInMonth
      ? `${weeksInMonth} ${getPluralForm(weeksInMonth, SINGULAR_FORMS.week, PLURAL_FORMS.week)}`
      : ''
    const daysText = days ? `${days} ${getPluralForm(days, SINGULAR_FORMS.day, PLURAL_FORMS.day)}` : ''

    return [weeksText, daysText].filter(Boolean).join(' ')
  }, [duration.days, duration.hours, duration.months, totalDays, weeks])

  const trainingWeeksText = useMemo(() => {
    return weeks ? `${weeks} full training ${getPluralForm(weeks, SINGULAR_FORMS.week, PLURAL_FORMS.week)}` : ''
  }, [weeks])

  const currentDay = differenceInDays(now, START_DATE) + 1
  const progressPercentage = Math.round((currentDay / TOTAL_DAYS) * 100)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Half Marathon Countdown</h2>
      <p className={styles.raceDate}>Race date: {RACE_DATE.toLocaleDateString()}</p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Time Remaining</span>
          <span className={styles.statValue} title={trainingWeeksText}>
            {formattedDuration}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>
            Progress
            <button
              aria-expanded={isChartShown}
              aria-label={isChartShown ? 'Collapse Weekly Distance Progress' : 'Expand chart'}
              className={`${styles.toggleButton} ${isChartShown ? styles.expanded : ''}`}
              title={isChartShown ? 'Collapse chart' : 'Expand chart'}
              type='button'
              onClick={() => setIsChartShown((prev) => !prev)}>
              <svg className={styles.chevron} fill='none' height='24' viewBox='0 0 20 20' width='24'>
                <path
                  d='M6 8L10 12L14 8'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.3'
                />
              </svg>
            </button>
          </span>
          <span
            className={styles.statValue}
            title={`Today is day ${currentDay} out of ${TOTAL_DAYS} days. ${progressPercentage}% done`}>
            {differenceInDays(now, START_DATE) + 1}/{TOTAL_DAYS}
          </span>
        </div>
      </div>

      {Boolean(weekPlans.length) && isChartShown && (
        <div className={`${styles.stats} ${styles.chartStats}`}>
          <WeeklyProgressChart weekPlans={weekPlans} />
        </div>
      )}
    </div>
  )
}
