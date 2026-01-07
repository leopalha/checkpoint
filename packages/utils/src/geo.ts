// Geolocation Utilities

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const lat1Rad = toRadians(point1.latitude);
  const lat2Rad = toRadians(point2.latitude);
  const deltaLat = toRadians(point2.latitude - point1.latitude);
  const deltaLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Check if a point is within a radius of another point
 * @param point User's current location
 * @param center Event location
 * @param radiusMeters Allowed radius in meters
 */
export function isWithinRadius(
  point: Coordinates,
  center: Coordinates,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(point, center);
  return distance <= radiusMeters;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const MIN_GPS_RADIUS_METERS = 200;
export const DEFAULT_GPS_RADIUS_METERS = 500;
export const MAX_GPS_RADIUS_METERS = 2000;
