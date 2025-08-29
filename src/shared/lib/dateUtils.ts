import { format, isAfter, isBefore, isSameDay, parseISO } from 'date-fns'

// Format date to MM/DD/YYYY
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, 'MMM dd')
}

// Format date to EEEE
export const formatWeekday = (dateString: string): string => {
  const date = parseISO(dateString)
  return format(date, 'EEEE')
}

// Check if date is in the past
export const isDateInPast = (dateString: string): boolean => {
  const date = parseISO(dateString)
  const today = new Date()
  return isBefore(date, today) && !isSameDay(date, today)
}

// Check if date is in the future
export const isDateInFuture = (dateString: string): boolean => {
  const date = parseISO(dateString)
  const today = new Date()
  return isAfter(date, today) || isSameDay(date, today)
}
