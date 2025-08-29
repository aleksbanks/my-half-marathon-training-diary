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
