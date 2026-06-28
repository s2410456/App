// Homescreen: Branding, Schnellbutton "Nächster funktionierender Automat", Einstiegskacheln.
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, getMeldungen } from "../../lib/dataService";
import { berechneAmpel } from "../../lib/status";
import { distanzMeter, formatDistanz } from "../../lib/distance";
import { colors, radius, space } from "../../theme";

type Naechster = { id: string; name: string; distanz: number | null } | null;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { standort } = useLocation();
  const [naechster, setNaechster] = useState<Naechster>(null);
  const [anzahlGruen, setAnzahlGruen] = useState(0);

  useEffect(() => {
    (async () => {
      const automaten = await getAutomaten();
      const meldungen = await getMeldungen();
      const mitAmpel = automaten.map((a) => ({
        automat: a,
        ampel: berechneAmpel(meldungen.filter((m) => m.automatId === a.id && !m.produktId)).ampel,
        distanz: standort ? distanzMeter(standort.lat, standort.lng, a.lat, a.lng) : null,
      }));
      const gruen = mitAmpel.filter((x) => x.ampel === "gruen");
      setAnzahlGruen(gruen.length);
      const kandidaten = (gruen.length ? gruen : mitAmpel)
        .slice()
        .sort((x, y) => (x.distanz ?? Infinity) - (y.distanz ?? Infinity));
      const top = kandidaten[0];
      setNaechster(top ? { id: top.automat.id, name: top.automat.name, distanz: top.distanz } : null);
    })();
  }, [standort]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space(5), paddingTop: insets.top + space(6) }}
    >
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Ionicons name="navigate" size={28} color="#fff" />
        </View>
        <Text style={styles.appName}>QuickTschick</Text>
        <Text style={styles.slogan}>Finde den nächsten Automaten in Linz.</Text>
      </View>

      <Pressable
        style={[styles.quickBtn, !naechster && { opacity: 0.6 }]}
        disabled={!naechster}
        onPress={() => naechster && router.push({ pathname: "/automat/[id]", params: { id: naechster.id } })}
      >
        <Ionicons name="flash" size={22} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.quickTitel}>Nächster funktionierender Automat</Text>
          <Text style={styles.quickSub}>
            {naechster
              ? `${naechster.name}${naechster.distanz != null ? " · " + formatDistanz(naechster.distanz) : ""}`
              : "Wird gesucht…"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </Pressable>

      <View style={styles.kacheln}>
        <Kachel icon="map" label="Karte" onPress={() => router.navigate("/karte")} />
        <Kachel icon="list" label="Liste" onPress={() => router.navigate("/liste")} />
        <Kachel icon="star" label="Favoriten" onPress={() => router.navigate("/favoriten")} />
      </View>

      <Text style={styles.info}>
        {anzahlGruen} {anzahlGruen === 1 ? "Automat ist" : "Automaten sind"} gerade wahrscheinlich verfügbar.
      </Text>
    </ScrollView>
  );
}

function Kachel({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.kachel} onPress={onPress}>
      <Ionicons name={icon} size={26} color={colors.accent} />
      <Text style={styles.kachelText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: "center", marginBottom: space(8) },
  logo: {
    width: 64, height: 64, borderRadius: 18, backgroundColor: colors.accent,
    alignItems: "center", justifyContent: "center", marginBottom: space(3),
  },
  appName: { fontSize: 28, fontWeight: "800", color: colors.text },
  slogan: { fontSize: 15, color: colors.textMuted, marginTop: 4 },
  quickBtn: {
    flexDirection: "row", alignItems: "center", gap: space(3),
    backgroundColor: colors.accent, borderRadius: radius, padding: space(4),
    marginBottom: space(5),
  },
  quickTitel: { color: "#fff", fontWeight: "700", fontSize: 15 },
  quickSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 2 },
  kacheln: { flexDirection: "row", gap: space(3) },
  kachel: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius, borderWidth: 1,
    borderColor: colors.border, paddingVertical: space(5), alignItems: "center", gap: space(2),
  },
  kachelText: { fontSize: 14, fontWeight: "600", color: colors.text },
  info: { marginTop: space(6), textAlign: "center", color: colors.textMuted, fontSize: 13 },
});
