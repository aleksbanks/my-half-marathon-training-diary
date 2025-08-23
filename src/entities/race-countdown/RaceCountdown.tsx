import { useMemo } from 'react'

import { differenceInDays, intervalToDuration } from 'date-fns'

const RACE_DATE = new Date(2025, 11, 14, 6, 0, 0) // December 14, 2025 at 6:00 AM
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
  const now = new Date()
  const duration = intervalToDuration({
    start: now,
    end: RACE_DATE
  })

  const totalDays = differenceInDays(RACE_DATE, now)
  const weeks = Math.floor(totalDays / DAYS_IN_WEEK)

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
      const trainingWeeksText = weeks
        ? `(${weeks} training ${getPluralForm(weeks, SINGULAR_FORMS.week, PLURAL_FORMS.week)})`
        : ''

      return [monthsText, weeksText, daysText, hoursText, trainingWeeksText].filter(Boolean).join(' ')
    }

    const weeksInMonth = Math.floor((totalDays || 0) / DAYS_IN_WEEK) || 0
    const days = (totalDays || 0) % DAYS_IN_WEEK || 0

    const weeksText = weeksInMonth
      ? `${weeksInMonth} ${getPluralForm(weeksInMonth, SINGULAR_FORMS.week, PLURAL_FORMS.week)}`
      : ''
    const daysText = days ? `${days} ${getPluralForm(days, SINGULAR_FORMS.day, PLURAL_FORMS.day)}` : ''

    return [weeksText, daysText].filter(Boolean).join(' ')
  }, [duration.days, duration.hours, duration.months, totalDays, weeks])

  return (
    <div>
      <h2>Half Marathon Countdown</h2>
      <h3>Race date: {RACE_DATE.toLocaleDateString()}</h3>
      <h4>Until start: {formattedDuration}</h4>
    </div>
  )
}
