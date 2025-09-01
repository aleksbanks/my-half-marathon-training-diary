export type DistanceUnit = 'km' | 'miles'
export type WorkoutType = 'easy' | 'long' | 'interval' | 'social' | 'tempo'

export interface WeekPlan {
  id: number
  week_number: number
  planned_distance_km: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface Interval {
  id: number
  name: string
  distance_km: number
  distance_miles: number
  duration_min: number
  pace_km: number
  pace_miles: number
  has_rest_after?: boolean
  rest_duration_seconds?: number
}

export interface Workout {
  id: number
  week_plan_id: number
  date: string
  distance_km: number
  notes?: string
  created_at: string
  updated_at: string
  type: WorkoutType
  distance_miles: number
  duration_min: number
  pace_km: number
  pace_miles: number
  intervals: Interval[]
}

export interface WeekPlanWithWorkouts extends WeekPlan {
  workouts: Workout[]
}
