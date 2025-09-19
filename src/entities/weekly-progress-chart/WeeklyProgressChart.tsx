import { useEffect, useMemo, useState } from 'react'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { WeekPlanWithWorkouts } from '@/shared/model/types'

import styles from './WeeklyProgressChart.module.css'

import { useAppSelector } from '@/app/store/hooks'
import { selectDistanceUnit } from '@/app/store/selectors/unitSelectors'

interface WeeklyProgressChartProps {
  weekPlans: WeekPlanWithWorkouts[]
}
interface ChartData {
  week: number
  planned: number
  actual: number
  weekLabel: string
}

export const WeeklyProgressChart = ({ weekPlans }: WeeklyProgressChartProps) => {
  const unit = useAppSelector(selectDistanceUnit)

  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsSmallMobile(width <= 480)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const chartData = useMemo((): ChartData[] => {
    return weekPlans.map((weekPlan) => {
      const plannedDistance = unit === 'km' ? weekPlan.planned_distance_km : weekPlan.planned_distance_miles
      const actualDistance = weekPlan.workouts.reduce(
        (sum, workout) => sum + (unit === 'km' ? workout.distance_km : workout.distance_miles),
        0
      )

      return {
        week: weekPlan.week_number,
        planned: Math.round(plannedDistance * 10) / 10, // Round to 1 decimal place
        actual: Math.round(actualDistance * 10) / 10,
        weekLabel: isSmallMobile
          ? `W${weekPlan.week_number}`
          : isMobile
            ? `W${weekPlan.week_number}`
            : `Week ${weekPlan.week_number}`
      }
    })
  }, [weekPlans, unit, isMobile, isSmallMobile])

  const formatTooltipValue = (value: number) => {
    return `${value} ${unit}`
  }

  const formatYAxisValue = (value: number) => {
    return `${value}${unit}`
  }

  if (!chartData.length) {
    return null
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Weekly Distance Progress</h3>

      <div className={styles.chartContainer}>
        <ResponsiveContainer height={isSmallMobile ? 400 : 320} width='100%'>
          <BarChart
            data={chartData}
            margin={{
              right: isSmallMobile ? 20 : 30,
              left: isSmallMobile ? 5 : isMobile ? 10 : 20,
              bottom: isSmallMobile ? 100 : isMobile ? 80 : 60
            }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              angle={isSmallMobile ? -90 : isMobile ? -90 : -45}
              dataKey='weekLabel'
              height={isSmallMobile ? 120 : isMobile ? 100 : 80}
              interval={isSmallMobile ? 0 : 0}
              textAnchor='end'
              tick={{ fontSize: isSmallMobile ? 8 : isMobile ? 9 : 10 }}
            />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={formatYAxisValue} width={40} />
            <Tooltip
              formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey='planned' fill='var(--color-500)' name='Planned' radius={[2, 2, 0, 0]} />
            <Bar dataKey='actual' fill='var(--pink-500)' name='Actual' radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
