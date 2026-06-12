// Karten-Screen: lädt Automaten + Meldungen, berechnet die Ampel und zeigt Pins.
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AutomatenMap, { MarkerData } from "../../components/AutomatenMap";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, getMeldungen } from "../../lib/dataService";
import { berechneAmpel } from "../../lib/status";
import { colors } from "../../theme";

export default function KarteScreen() {
  const { standort } = useLocation();
  const [marker, setMarker] = useState<MarkerData[]>([]);
  const [laedt, setLaedt] = useState(true);

  useEffect(() => {
    (async () => {
      const automaten = await getAutomaten();
      const meldungen = await getMeldungen();
      const data: MarkerData[] = automaten.map((a) => ({
        automat: a,
        ampel: berechneAmpel(meldungen.filter((m) => m.automatId === a.id)).ampel,
      }));
      setMarker(data);
      setLaedt(false);
    })();
  }, []);

  if (laedt) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AutomatenMap
        marker={marker}
        standort={standort}
        onMarkerPress={(id) => {
          // TODO: Detail-Ansicht / Bottom Sheet öffnen
          console.log("Automat angetippt:", id);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
});
