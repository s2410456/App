// Routenführung über Deep Links in die native Karten-App (kein Routing-API nötig).
import { Linking, Platform } from "react-native";

export function openInMaps(lat: number, lng: number, label?: string) {
  const ziel = `${lat},${lng}`;
  const url = Platform.select({
    ios: `maps://?daddr=${ziel}`,
    android: `google.navigation:q=${ziel}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${ziel}`,
  }) as string;

  Linking.openURL(url).catch(() => {
    // Fallback: Google Maps im Browser
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${ziel}`);
  });
}
