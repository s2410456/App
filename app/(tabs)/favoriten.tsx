// Favoriten-Screen: zeigt nur gespeicherte Automaten (Local Storage / AsyncStorage).
import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, getMeldungen, getFavoriten, toggleFavorit } from "../../lib/dataService";
import { berechneAmpel } from "../../lib/status";
import { distanzMeter } from "../../lib/distance";
import { statusLabel } from "../../lib/labels";
import { Automat, Meldung } from "../../lib/types";
import AutomatRow from "../../components/AutomatRow";
import { colors, space } from "../../theme";

export default function FavoritenScreen() {
  const router = useRouter();
  const { standort } = useLocation();
  const [automaten, setAutomaten] = useState<Automat[]>([]);
  const [meldungen, setMeldungen] = useState<Meldung[]>([]);
  const [favoriten, setFavoriten] = useState<string[]>([]);

  const laden = useCallback(async () => {
    setAutomaten(await getAutomaten());
    setMeldungen(await getMeldungen());
    setFavoriten(await getFavoriten());
  }, []);
  useFocusEffect(useCallback(() => { laden(); }, [laden]));

  const zeilen = automaten
    .filter((a) => favoriten.includes(a.id))
    .map((a) => {
      const info = berechneAmpel(meldungen.filter((m) => m.automatId === a.id && !m.produktId));
      const distanz = standort ? distanzMeter(standort.lat, standort.lng, a.lat, a.lng) : null;
      return { automat: a, ampel: info.ampel, statusText: statusLabel[info.status], distanz };
    })
    .sort((x, y) => (x.distanz ?? Infinity) - (y.distanz ?? Infinity));

  const favUmschalten = async (id: string) => setFavoriten(await toggleFavorit(id));

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      data={zeilen}
      keyExtractor={(z) => z.automat.id}
      contentContainerStyle={{ padding: space(4), flexGrow: 1 }}
      ItemSeparatorComponent={() => <View style={{ height: space(2) }} />}
      ListEmptyComponent={
        <View style={styles.leerBox}>
          <Text style={styles.leerTitel}>Noch keine Favoriten</Text>
          <Text style={styles.leerText}>
            Tippe bei einem Automaten auf den Stern, um ihn hier zu speichern.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <AutomatRow
          automat={item.automat}
          ampel={item.ampel}
          statusText={item.statusText}
          distanz={item.distanz}
          istFavorit
          onPress={() => router.push({ pathname: "/automat/[id]", params: { id: item.automat.id } })}
          onFavorit={() => favUmschalten(item.automat.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  leerBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: space(8), gap: space(2) },
  leerTitel: { fontSize: 17, fontWeight: "600", color: colors.text },
  leerText: { fontSize: 14, color: colors.textMuted, textAlign: "center", lineHeight: 20 },
});
