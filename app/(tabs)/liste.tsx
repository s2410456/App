// Listen-Screen: Automaten nach Entfernung sortiert, mit Ampel-Status.
import { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, getMeldungen } from "../../lib/dataService";
import { berechneAmpel, Ampel } from "../../lib/status";
import { distanzMeter, formatDistanz } from "../../lib/distance";
import { Automat, AutomatStatus, Meldung } from "../../lib/types";
import StatusPunkt from "../../components/StatusPunkt";
import { colors, radius, space } from "../../theme";

const statusLabel: Record<AutomatStatus, string> = {
  verfuegbar: "Wahrscheinlich verfügbar",
  fast_leer: "Unsicher / fast leer",
  leer: "Wahrscheinlich leer",
  defekt: "Defekt gemeldet",
  unbekannt: "Keine aktuellen Daten",
};

type Zeile = {
  automat: Automat;
  ampel: Ampel;
  statusText: string;
  distanz: number | null;
};

export default function ListeScreen() {
  const { standort } = useLocation();
  const [automaten, setAutomaten] = useState<Automat[]>([]);
  const [meldungen, setMeldungen] = useState<Meldung[]>([]);
  const [laedt, setLaedt] = useState(true);

  useEffect(() => {
    (async () => {
      setAutomaten(await getAutomaten());
      setMeldungen(await getMeldungen());
      setLaedt(false);
    })();
  }, []);

  const zeilen = useMemo<Zeile[]>(() => {
    const z = automaten.map((a) => {
      const info = berechneAmpel(meldungen.filter((m) => m.automatId === a.id));
      const distanz = standort
        ? distanzMeter(standort.lat, standort.lng, a.lat, a.lng)
        : null;
      return { automat: a, ampel: info.ampel, statusText: statusLabel[info.status], distanz };
    });
    z.sort((x, y) => (x.distanz ?? Infinity) - (y.distanz ?? Infinity));
    return z;
  }, [automaten, meldungen, standort]);

  if (laedt) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={zeilen}
      keyExtractor={(z) => z.automat.id}
      contentContainerStyle={{ padding: space(4) }}
      ItemSeparatorComponent={() => <View style={{ height: space(2) }} />}
      ListEmptyComponent={
        <Text style={styles.leer}>Noch keine Automaten in der Nähe.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.karte}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.automat.name}</Text>
            <Text style={styles.beschreibung}>{item.automat.beschreibung}</Text>
            <View style={styles.statusReihe}>
              <StatusPunkt ampel={item.ampel} />
              <Text style={styles.statusText}>{item.statusText}</Text>
            </View>
          </View>
          <Text style={styles.distanz}>
            {item.distanz != null ? formatDistanz(item.distanz) : "–"}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  leer: { textAlign: "center", color: colors.textMuted, marginTop: space(8) },
  karte: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(3),
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space(4),
  },
  name: { fontSize: 16, fontWeight: "600", color: colors.text },
  beschreibung: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  statusReihe: { flexDirection: "row", alignItems: "center", gap: space(2), marginTop: space(2) },
  statusText: { fontSize: 13, color: colors.text },
  distanz: { fontSize: 15, fontWeight: "600", color: colors.accent },
});
