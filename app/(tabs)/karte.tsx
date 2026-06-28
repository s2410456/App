// Karten-Screen: Vollbild-Karte + Menü-Overlay + FAB zum Vorschlagen. Pin-Tap -> Detail.
import { useCallback, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AutomatenMap, { MarkerData } from "../../components/AutomatenMap";
import MenueOverlay from "../../components/MenueOverlay";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, getMeldungen } from "../../lib/dataService";
import { berechneAmpel } from "../../lib/status";
import { colors, radius } from "../../theme";

export default function KarteScreen() {
  const { standort } = useLocation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [marker, setMarker] = useState<MarkerData[]>([]);
  const [laedt, setLaedt] = useState(true);
  const [menuOffen, setMenuOffen] = useState(false);

  // useFocusEffect: neu laden, wenn man von einem neuen Vorschlag zurückkommt
  const laden = useCallback(async () => {
    const automaten = await getAutomaten();
    const meldungen = await getMeldungen();
    setMarker(
      automaten.map((a) => ({
        automat: a,
        ampel: berechneAmpel(meldungen.filter((m) => m.automatId === a.id && !m.produktId)).ampel,
      }))
    );
    setLaedt(false);
  }, []);
  useFocusEffect(useCallback(() => { laden(); }, [laden]));

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
        onMarkerPress={(id) => router.push({ pathname: "/automat/[id]", params: { id } })}
      />

      <Pressable
        onPress={() => setMenuOffen(true)}
        style={[styles.menuButton, { top: insets.top + 12 }]}
        hitSlop={8}
      >
        <Ionicons name="menu" size={24} color={colors.text} />
      </Pressable>

      {/* FAB: Automat vorschlagen */}
      <Pressable style={styles.fab} onPress={() => router.push("/automat/neu")}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <MenueOverlay
        visible={menuOffen}
        onClose={() => setMenuOffen(false)}
        items={[
          { icon: "add-circle-outline", label: "Automat vorschlagen", onPress: () => router.push("/automat/neu") },
          { icon: "list-outline", label: "Liste anzeigen", onPress: () => router.navigate("/liste") },
          { icon: "star-outline", label: "Favoriten", onPress: () => router.navigate("/favoriten") },
          {
            icon: "information-circle-outline",
            label: "Über QuickTschick",
            onPress: () =>
              Alert.alert(
                "QuickTschick",
                "Findet den nächsten Zigarettenautomaten in Linz. Grün = wahrscheinlich verfügbar, Gelb = unsicher, Rot = leer/defekt. Graue Pins sind unbestätigte Vorschläge. Nur für Personen ab 18."
              ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  menuButton: {
    position: "absolute", left: 12, width: 44, height: 44, borderRadius: radius,
    backgroundColor: colors.surface, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  fab: {
    position: "absolute", right: 16, bottom: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.accent, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
});
