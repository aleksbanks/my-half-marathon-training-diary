import type { DistanceUnit } from '@/shared/model/types'

const KM_TO_MILES = 0.621371

export const convertDistance = (distanceKm: number, targetUnit: DistanceUnit): number => {
  if (targetUnit === 'miles') {
    return distanceKm * KM_TO_MILES
  }
  return distanceKm
}

export const formatDistance = (distanceKm: number, unit: DistanceUnit): string => {
  const convertedDistance = convertDistance(distanceKm, unit)
  return `${convertedDistance.toFixed(1)} ${unit}`
}
