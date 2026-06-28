// Listen-Screen: nach Entfernung sortiert, mit Status-Filterchips, Favoriten-Stern und Detail-Sprung.
import { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, getMeldungen, getFavoriten, toggleFavorit } from "../../lib/dataService";
import { berechneAmpel } from "../../lib/status";
import { distanzMeter } from "../../lib/distance";
import { statusLabel } from "../../lib/labels";
import { Automat, Meldung } from "../../lib/types";
import AutomatRow from "../../components/AutomatRow";
import { colors, radius, space } from "../../theme";

type Filter = "alle" | "gruen" | "gelb" | "rot";

export default function ListeScreen() {
  const router = useRouter();
  const { standort } = useLocation();
  const [automaten, setAutomaten] = useState<Automat[]>([]);
  const [meldungen, setMeldungen] = useState<Meldung[]>([]);
  const [favoriten, setFavoriten] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("alle");
  const [laedt, setLaedt] = useState(true);

  const laden = useCallback(async () => {
    setAutomaten(await getAutomaten());
    setMeldungen(await getMeldungen());
    setFavoriten(await getFavoriten());
    setLaedt(false);
  }, []);
  useFocusEffect(useCallback(() => { laden(); }, [laden]));

  const zeilen = useMemo(() => {
    const z = automaten.map((a) => {
      const info = berechneAmpel(meldungen.filter((m) => m.automatId === a.id && !m.produktId));
      const distanz = standort ? distanzMeter(standort.lat, standort.lng, a.lat, a.lng) : null;
      return { automat: a, ampel: info.ampel, statusText: statusLabel[info.status], distanz };
    });
    const gefiltert = filter === "alle" ? z : z.filter((x) => x.ampel === filter);
    gefiltert.sort((x, y) => (x.distanz ?? Infinity) - (y.distanz ?? Infinity));
    return gefiltert;
  }, [automaten, meldungen, standort, filter]);

  const favUmschalten = async (id: string) => setFavoriten(await toggleFavorit(id));

  if (laedt) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.chips}>
        <Chip label="Alle" aktiv={filter === "alle"} onPress={() => setFilter("alle")} />
        <Chip label="Verfügbar" aktiv={filter === "gruen"} farbe={colors.gruen} onPress={() => setFilter("gruen")} />
        <Chip label="Unsicher" aktiv={filter === "gelb"} farbe={colors.gelb} onPress={() => setFilter("gelb")} />
        <Chip label="Leer" aktiv={filter === "rot"} farbe={colors.rot} onPress={() => setFilter("rot")} />
      </View>

      <FlatList
        data={zeilen}
        keyExtractor={(z) => z.automat.id}
        contentContainerStyle={{ padding: space(4) }}
        ItemSeparatorComponent={() => <View style={{ height: space(2) }} />}
        ListEmptyComponent={<Text style={styles.leer}>Keine Automaten für diesen Filter.</Text>}
        renderItem={({ item }) => (
          <AutomatRow
            automat={item.automat}
            ampel={item.ampel}
            statusText={item.statusText}
            distanz={item.distanz}
            istFavorit={favoriten.includes(item.automat.id)}
            onPress={() => router.push({ pathname: "/automat/[id]", params: { id: item.automat.id } })}
            onFavorit={() => favUmschalten(item.automat.id)}
          />
        )}
      />
    </View>
  );
}

function Chip({ label, aktiv, onPress, farbe }: { label: string; aktiv: boolean; onPress: () => void; farbe?: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, aktiv && styles.chipAktiv]}>
      {farbe ? <View style={[styles.chipDot, { backgroundColor: farbe }]} /> : null}
      <Text style={[styles.chipText, aktiv && styles.chipTextAktiv]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  leer: { textAlign: "center", color: colors.textMuted, marginTop: space(8) },
  chips: { flexDirection: "row", gap: space(2), paddingHorizontal: space(4), paddingTop: space(3), flexWrap: "wrap" },
  chip: {
    flexDirection: "row", alignItems: "center", gap: space(1),
    paddingVertical: space(2), paddingHorizontal: space(3),
    borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  chipAktiv: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: 13, color: colors.text },
  chipTextAktiv: { color: "#fff", fontWeight: "600" },
});
