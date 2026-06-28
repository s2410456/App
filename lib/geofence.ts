// Anti-Fake (Konzept): Eine Statusmeldung ist nur erlaubt, wenn man nah genug
// am Automaten steht. Geprüft über die Luftlinie zum eigenen GPS-Standort.
import { distanzMeter } from "./distance";

export const GEOFENCE_RADIUS = 100; // Meter (Konzept: 50–100 m)

export function istInReichweite(
  userLat: number,
  userLng: number,
  automatLat: number,
  automatLng: number,
  radius = GEOFENCE_RADIUS
): boolean {
  return distanzMeter(userLat, userLng, automatLat, automatLng) <= radius;
}
