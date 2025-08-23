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

// Functions for testing logic

const getPluralForm = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural
}

const formatCountdown = (testDate: Date) => {
  const duration = intervalToDuration({
    start: testDate,
    end: RACE_DATE
  })

  const totalDays = differenceInDays(RACE_DATE, testDate)
  const weeks = Math.floor(totalDays / DAYS_IN_WEEK)

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
}

// Tests
const runTests = () => {
  const tests = [
    { name: 'September 1, 2025 (more than 10 weeks)', date: new Date(2025, 8, 1) },
    { name: 'November 1, 2025 (1-10 weeks)', date: new Date(2025, 10, 1) },
    { name: 'December 1, 2025 (1 week or less)', date: new Date(2025, 11, 1) },
    { name: 'December 13, 2025 (1 day before start)', date: new Date(2025, 11, 13) },
    { name: 'October 1, 2025 (more than 10 weeks)', date: new Date(2025, 9, 1) },
    { name: 'December 12, 10:00 AM (1 day, 20 hours before start)', date: new Date(2025, 11, 12, 10, 0, 0) },
    { name: 'December 14, 2:00 AM (4 hours before start)', date: new Date(2025, 11, 14, 2, 0, 0) },
    { name: 'December 14, 5:30 AM (30 minutes before start)', date: new Date(2025, 11, 14, 5, 30, 0) }
  ]

  return tests.map((test, index) => ({
    testNumber: index + 1,
    testName: test.name,
    result: formatCountdown(test.date)
  }))
}

// Run tests and display results
const results = runTests()

// eslint-disable-next-line no-console
console.log('=== Tests for RaceCountdown component ===')

results.forEach((test) => {
  // eslint-disable-next-line no-console
  console.log(`Test ${test.testNumber} (${test.testName}): ${test.result}`)
})

// eslint-disable-next-line no-console
console.log('=== Tests completed ===')
