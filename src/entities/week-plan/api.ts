import type { WeekPlan, WeekPlanWithWorkouts, Workout } from '@/shared/model/types'

import { supabase } from '@/shared/config/supabase'

// Fetch all week plans
export const fetchWeekPlans = async (): Promise<WeekPlan[]> => {
  const { data, error } = await supabase.from('week_plans').select('*').order('week_number', { ascending: true })

  if (error) {
    throw new Error(`Error fetching week plans: ${error.message}`)
  }

  return data || []
}

// Fetch workouts for a specific week plan
export const fetchWorkoutsForWeekPlan = async (weekPlanId: number): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('week_plan_id', weekPlanId)
    .order('date', { ascending: true })

  if (error) {
    throw new Error(`Error fetching workouts: ${error.message}`)
  }

  return data || []
}

// Fetch all week plans with their workouts
export const fetchWeekPlansWithWorkouts = async (): Promise<WeekPlanWithWorkouts[]> => {
  const weekPlans = await fetchWeekPlans()

  const weekPlansWithWorkouts = await Promise.all(
    weekPlans.map(async (weekPlan) => {
      const workouts = await fetchWorkoutsForWeekPlan(weekPlan.id)
      return {
        ...weekPlan,
        workouts
      }
    })
  )

  return weekPlansWithWorkouts
}

// Create a new workout
export const createWorkout = async (workoutData: {
  week_plan_id: number
  date: string
  type: string
  distance_km: number
  distance_miles: number
  duration_minutes?: number
  duration_seconds?: number
  notes?: string
  intervals?: Omit<import('@/shared/model/types').Interval, 'id'>[]
}): Promise<Workout> => {
  // Calculate distance in miles and km (look up what is provided and what is needed)
  let distanceKm = workoutData.distance_km
  let distanceMiles = workoutData.distance_miles

  if (workoutData.distance_miles && !workoutData.distance_km) {
    distanceKm = Number((workoutData.distance_miles / 1.60934).toFixed(2))
  }
  if (workoutData.distance_km && !workoutData.distance_miles) {
    distanceMiles = Number((workoutData.distance_km / 1.60934).toFixed(2))
  }

  // Calculate total duration in minutes
  let totalDurationMinutes = (workoutData.duration_minutes || 0) + (workoutData.duration_seconds || 0) / 60

  // Calculate pace (minutes per km)
  const paceKm = (totalDurationMinutes / distanceKm).toFixed(2)

  // Calculate distance in miles and pace in miles
  const paceMiles = (totalDurationMinutes / distanceMiles).toFixed(2)

  // If we work with intervals, we need to calculate the total duration of the intervals with the rest periods
  if (workoutData.intervals?.length) {
    const totalDuration = workoutData.intervals.reduce((acc, interval) => {
      return acc + interval.duration_min + (interval.rest_duration_seconds || 0) / 60
    }, 0)
    totalDurationMinutes = totalDuration
  }
  // If we work with intervals, we need to calculate the total distance of the intervals
  if (workoutData.intervals?.length) {
    const totalDistanceKm = workoutData.intervals.reduce((acc, interval) => {
      return acc + interval.distance_km
    }, 0)
    const totalDistanceMiles = workoutData.intervals.reduce((acc, interval) => {
      return acc + interval.distance_miles
    }, 0)
    distanceKm = totalDistanceKm
    distanceMiles = totalDistanceMiles
  }
  // If we work with intervals, we need to calculate the total distance of the intervals
  if (workoutData.intervals?.length) {
    const totalDistance = workoutData.intervals.reduce((acc, interval) => {
      return acc + interval.distance_km
    }, 0)
    distanceKm = totalDistance
  }

  delete workoutData.duration_minutes
  delete workoutData.duration_seconds

  const { data, error } = await supabase
    .from('workouts')
    .insert({
      ...workoutData,
      duration_min: totalDurationMinutes, // Convert to total minutes for database
      distance_miles: distanceMiles,
      distance_km: distanceKm,
      pace_km: paceKm,
      pace_miles: paceMiles,
      intervals: workoutData.intervals || [] // Use provided intervals or empty array
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating workout: ${error.message}`)
  }

  return data
}
