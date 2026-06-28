// Hook für den Gerätestandort (Device API: expo-location).
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export type Standort = { lat: number; lng: number };

export function useLocation() {
  const [standort, setStandort] = useState<Standort | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [laedt, setLaedt] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setFehler("Standort-Berechtigung wurde abgelehnt.");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        setStandort({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        setFehler("Standort konnte nicht ermittelt werden.");
      } finally {
        setLaedt(false);
      }
    })();
  }, []);

  return { standort, fehler, laedt };
}
