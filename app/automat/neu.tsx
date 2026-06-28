// "Automat vorschlagen": Formular. Standort kommt vom GPS (man muss davor stehen),
// vor dem Speichern Dublettencheck (existiert schon ein Automat < 30 m?).
import { ReactNode, useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocation } from "../../lib/useLocation";
import { getAutomaten, addVorschlag } from "../../lib/dataService";
import { distanzMeter } from "../../lib/distance";
import { Produkttyp, Zahlung, Zugang } from "../../lib/types";
import { colors, radius, space } from "../../theme";

const DUBLETTEN_RADIUS = 30; // m

export default function AutomatNeu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { standort, laedt: gpsLaedt } = useLocation();

  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [produkt, setProdukt] = useState<Produkttyp>("zigaretten");
  const [zahlung, setZahlung] = useState<Zahlung>("unbekannt");
  const [zugang, setZugang] = useState<Zugang>("unsicher");
  const [speichert, setSpeichert] = useState(false);

  const speichern = async () => {
    if (!name.trim()) {
      Alert.alert("Name fehlt", "Bitte gib dem Automaten einen Namen.");
      return;
    }
    if (!standort) {
      Alert.alert("Kein Standort", "Dein Standort wird noch ermittelt – bitte kurz warten.");
      return;
    }

    const speichereJetzt = async () => {
      setSpeichert(true);
      const neu = await addVorschlag({
        name: name.trim(),
        beschreibung: beschreibung.trim() || "Ohne Beschreibung",
        lat: standort.lat,
        lng: standort.lng,
        produkt,
        zahlung,
        zugang,
      });
      setSpeichert(false);
      router.replace({ pathname: "/automat/[id]", params: { id: neu.id } });
    };

    // Dublettencheck
    const automaten = await getAutomaten();
    const nah = automaten.find(
      (a) => distanzMeter(standort.lat, standort.lng, a.lat, a.lng) <= DUBLETTEN_RADIUS
    );
    if (nah) {
      const d = Math.round(distanzMeter(standort.lat, standort.lng, nah.lat, nah.lng));
      Alert.alert(
        "Schon ein Automat in der Nähe",
        `„${nah.name}" ist nur ${d} m entfernt. Trotzdem als neuen Automaten anlegen?`,
        [
          { text: "Abbrechen", style: "cancel" },
          { text: "Trotzdem", onPress: speichereJetzt },
        ]
      );
    } else {
      await speichereJetzt();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + space(2) }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitel}>Automat vorschlagen</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: space(5), gap: space(4) }}>
        <Feld label="Name *">
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="z. B. Trafik Hauptplatz"
            placeholderTextColor={colors.textMuted}
          />
        </Feld>

        <Feld label="Beschreibung">
          <TextInput
            style={styles.input}
            value={beschreibung}
            onChangeText={setBeschreibung}
            placeholder="z. B. neben dem Eingang"
            placeholderTextColor={colors.textMuted}
          />
        </Feld>

        <Feld label="Produkt">
          <Segment
            optionen={[["zigaretten", "Zigaretten"], ["snus", "Snus"], ["beides", "Beides"]]}
            wert={produkt}
            setWert={setProdukt}
          />
        </Feld>

        <Feld label="Zahlung">
          <Segment
            optionen={[["bar", "Bar"], ["karte", "Karte"], ["beides", "Beides"], ["unbekannt", "?"]]}
            wert={zahlung}
            setWert={setZahlung}
          />
        </Feld>

        <Feld label="Zugang">
          <Segment
            optionen={[["24_7", "0–24"], ["oeffnungszeiten", "Öffnungszeiten"], ["unsicher", "Unsicher"]]}
            wert={zugang}
            setWert={setZugang}
          />
        </Feld>

        <View style={styles.gpsBox}>
          <Ionicons name="location" size={20} color={colors.accent} />
          <Text style={styles.gpsText}>
            {standort
              ? `Standort: ${standort.lat.toFixed(5)}, ${standort.lng.toFixed(5)}`
              : gpsLaedt
                ? "Standort wird ermittelt…"
                : "Kein Standort verfügbar"}
          </Text>
        </View>
        <Text style={styles.hinweis}>
          Der Automat wird an deiner aktuellen Position gespeichert – du musst also davor stehen.
        </Text>

        <Pressable
          style={[styles.saveBtn, (!standort || speichert) && { opacity: 0.5 }]}
          disabled={!standort || speichert}
          onPress={speichern}
        >
          {speichert ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveText}>Vorschlag speichern</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Feld({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: space(2) }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Segment<T extends string>({
  optionen,
  wert,
  setWert,
}: {
  optionen: [T, string][];
  wert: T;
  setWert: (v: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {optionen.map(([v, label]) => (
        <Pressable
          key={v}
          onPress={() => setWert(v)}
          style={[styles.segItem, wert === v && styles.segItemAktiv]}
        >
          <Text style={[styles.segText, wert === v && styles.segTextAktiv]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space(3),
    paddingHorizontal: space(4), paddingBottom: space(3),
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitel: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700", color: colors.text },
  label: { fontSize: 14, fontWeight: "600", color: colors.text },
  input: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius,
    paddingHorizontal: space(3), paddingVertical: space(3), fontSize: 15, color: colors.text,
  },
  segment: { flexDirection: "row", gap: space(2), flexWrap: "wrap" },
  segItem: {
    paddingVertical: space(2), paddingHorizontal: space(3), borderRadius: 999,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  segItemAktiv: { backgroundColor: colors.accent, borderColor: colors.accent },
  segText: { fontSize: 14, color: colors.text },
  segTextAktiv: { color: "#fff", fontWeight: "600" },
  gpsBox: {
    flexDirection: "row", alignItems: "center", gap: space(2),
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius, padding: space(3),
  },
  gpsText: { fontSize: 14, color: colors.text, flex: 1 },
  hinweis: { fontSize: 12, color: colors.textMuted, marginTop: -space(2) },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space(2),
    backgroundColor: colors.accent, borderRadius: radius, paddingVertical: space(4), marginTop: space(2),
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
