// Detail-Ansicht (dynamische Route /automat/[id]).
// Maschinen-Status + Infos + Route + Sortiment (Produkt-Bestand) + "Status melden" (geofenced).
import { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import StatusPunkt from "../../components/StatusPunkt";
import { useLocation } from "../../lib/useLocation";
import {
  getAutomaten, getMeldungen, addMeldung, getFavoriten, toggleFavorit,
  bestaetigeVorschlag, VERIFY_SCHWELLE, getSortiment,
} from "../../lib/dataService";
import { berechneAmpel, Ampel } from "../../lib/status";
import { distanzMeter, formatDistanz } from "../../lib/distance";
import { GEOFENCE_RADIUS, istInReichweite } from "../../lib/geofence";
import { openInMaps } from "../../lib/navigation";
import { produktLabel, zahlungLabel, zugangLabel, statusLabel } from "../../lib/labels";
import { Automat, AutomatStatus, Meldung, Produkt } from "../../lib/types";
import { colors, radius, space } from "../../theme";

function zeitHer(ts: number): string {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 60) return `vor ${min} Min.`;
  const std = Math.round(min / 60);
  if (std < 24) return `vor ${std} Std.`;
  return `vor ${Math.round(std / 24)} Tag(en)`;
}

export default function AutomatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { standort } = useLocation();

  const [automat, setAutomat] = useState<Automat | null>(null);
  const [meldungen, setMeldungen] = useState<Meldung[]>([]);
  const [sortiment, setSortiment] = useState<Produkt[]>([]);
  const [istFavorit, setIstFavorit] = useState(false);
  const [demoModus, setDemoModus] = useState(false);
  const [laedt, setLaedt] = useState(true);

  const laden = useCallback(async () => {
    const automaten = await getAutomaten();
    setAutomat(automaten.find((x) => x.id === id) ?? null);
    setMeldungen(await getMeldungen());
    setSortiment(await getSortiment(id as string));
    const favs = await getFavoriten();
    setIstFavorit(favs.includes(id as string));
    setLaedt(false);
  }, [id]);

  useFocusEffect(useCallback(() => { laden(); }, [laden]));

  if (laedt || !automat) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  // Gesamt-Status: nur Maschinen-Meldungen (ohne produktId)
  const info = berechneAmpel(meldungen.filter((m) => m.automatId === automat.id && !m.produktId));
  const distanz = standort ? distanzMeter(standort.lat, standort.lng, automat.lat, automat.lng) : null;
  const inReichweite =
    demoModus || (standort != null && istInReichweite(standort.lat, standort.lng, automat.lat, automat.lng));
  const istVorschlag = automat.verifizierung === "ausstehend";

  // Pro-Produkt-Ampel: dieselbe Logik, nur nach produktId gefiltert
  const ampelFuerProdukt = (produktId: string): Ampel =>
    berechneAmpel(meldungen.filter((m) => m.automatId === automat.id && m.produktId === produktId)).ampel;

  const melden = async (status: AutomatStatus) => {
    await addMeldung({ id: `u-${Date.now()}`, automatId: automat.id, status, zeitpunkt: Date.now() });
    setMeldungen(await getMeldungen());
    Alert.alert("Danke!", "Deine Meldung wurde gespeichert.");
  };

  const meldenProdukt = async (produktId: string, status: AutomatStatus) => {
    await addMeldung({ id: `up-${Date.now()}`, automatId: automat.id, produktId, status, zeitpunkt: Date.now() });
    setMeldungen(await getMeldungen()); // Ampel des Produkts aktualisiert sich sofort
  };

  const bestaetigen = async () => {
    const v = await bestaetigeVorschlag(automat.id);
    await laden();
    Alert.alert(
      v && v.verifizierung === "bestaetigt" ? "Bestätigt!" : "Danke!",
      v && v.verifizierung === "bestaetigt"
        ? "Dieser Automat ist jetzt offiziell sichtbar."
        : "Deine Bestätigung wurde gezählt."
    );
  };

  const favUmschalten = async () => {
    const neu = await toggleFavorit(automat.id);
    setIstFavorit(neu.includes(automat.id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + space(2) }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitel} numberOfLines={1}>{automat.name}</Text>
        <Pressable onPress={favUmschalten} hitSlop={8}>
          <Ionicons name={istFavorit ? "star" : "star-outline"} size={24} color={istFavorit ? colors.gelb : colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: space(5), gap: space(4) }}>
        {istVorschlag ? (
          <View style={styles.vorschlagBanner}>
            <Ionicons name="alert-circle" size={22} color={colors.gelb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vorschlagTitel}>Vorschlag – noch nicht bestätigt</Text>
              <Text style={styles.vorschlagSub}>{automat.bestaetigungen ?? 0} von {VERIFY_SCHWELLE} Bestätigungen</Text>
            </View>
            <Pressable style={[styles.bestBtn, !inReichweite && { opacity: 0.4 }]} disabled={!inReichweite} onPress={bestaetigen}>
              <Text style={styles.bestBtnText}>Bestätigen</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.statusCard}>
          <StatusPunkt ampel={info.ampel} size={16} />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusText}>{statusLabel[info.status]}</Text>
            <Text style={styles.statusSub}>
              {info.letzteMeldung ? `Letzte Meldung ${zeitHer(info.letzteMeldung)} · ${info.anzahl} Meldung(en)` : "Noch keine Meldungen"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <InfoZeile icon="location-outline" label={automat.beschreibung} />
          <InfoZeile icon="pricetag-outline" label={produktLabel[automat.produkt]} />
          <InfoZeile icon="card-outline" label={zahlungLabel[automat.zahlung]} />
          <InfoZeile icon="time-outline" label={zugangLabel[automat.zugang]} />
          {distanz != null ? <InfoZeile icon="walk-outline" label={`${formatDistanz(distanz)} entfernt`} /> : null}
        </View>

        <Pressable style={styles.routeBtn} onPress={() => openInMaps(automat.lat, automat.lng, automat.name)}>
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.routeText}>Route starten</Text>
        </Pressable>

        {/* Sortiment / Bestand */}
        <Text style={styles.sektion}>Sortiment</Text>
        {sortiment.length === 0 ? (
          <Text style={styles.geoHint}>Für diesen Automaten sind noch keine Produkte hinterlegt.</Text>
        ) : (
          <>
            <Text style={styles.geoHint}>
              Tippe „Leer", wenn ein Produkt fehlt, oder „Da", wenn es wieder verfügbar ist
              {inReichweite ? "." : ` (möglich ab ${GEOFENCE_RADIUS} m).`}
            </Text>
            <View style={styles.card}>
              {sortiment.map((p, i) => (
                <View key={p.id} style={[styles.prodZeile, i > 0 && styles.prodTrenner]}>
                  <StatusPunkt ampel={ampelFuerProdukt(p.id)} />
                  <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
                  <Pressable
                    style={[styles.prodBtn, { borderColor: colors.gruen }, !inReichweite && { opacity: 0.4 }]}
                    disabled={!inReichweite}
                    onPress={() => meldenProdukt(p.id, "verfuegbar")}
                  >
                    <Text style={[styles.prodBtnText, { color: colors.gruen }]}>Da</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.prodBtn, { borderColor: colors.rot }, !inReichweite && { opacity: 0.4 }]}
                    disabled={!inReichweite}
                    onPress={() => meldenProdukt(p.id, "leer")}
                  >
                    <Text style={[styles.prodBtnText, { color: colors.rot }]}>Leer</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Maschinen-Status melden */}
        <Text style={styles.sektion}>Automat-Status melden</Text>
        <Text style={styles.geoHint}>
          {inReichweite
            ? "Du bist nah genug – danke fürs Melden!"
            : distanz != null
              ? `Melden ab ${GEOFENCE_RADIUS} m möglich (du bist ${formatDistanz(distanz)} entfernt).`
              : "Standort wird ermittelt…"}
        </Text>
        <View style={styles.meldeReihe}>
          <MeldeBtn farbe={colors.gruen} label="Verfügbar" disabled={!inReichweite} onPress={() => melden("verfuegbar")} />
          <MeldeBtn farbe={colors.gelb} label="Fast leer" disabled={!inReichweite} onPress={() => melden("fast_leer")} />
        </View>
        <View style={styles.meldeReihe}>
          <MeldeBtn farbe={colors.rot} label="Leer" disabled={!inReichweite} onPress={() => melden("leer")} />
          <MeldeBtn farbe={colors.grau} label="Defekt" disabled={!inReichweite} onPress={() => melden("defekt")} />
        </View>

        <View style={styles.demoReihe}>
          <Text style={styles.demoText}>Standort-Check ignorieren (Demo)</Text>
          <Switch value={demoModus} onValueChange={setDemoModus} trackColor={{ true: colors.accent, false: "#ccc" }} />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoZeile({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.infoZeile}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
}

function MeldeBtn({ farbe, label, disabled, onPress }: { farbe: string; label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.meldeBtn, { borderColor: farbe }, disabled && { opacity: 0.4 }]} disabled={disabled} onPress={onPress}>
      <View style={[styles.meldeDot, { backgroundColor: farbe }]} />
      <Text style={styles.meldeBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space(3),
    paddingHorizontal: space(4), paddingBottom: space(3),
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitel: { flex: 1, fontSize: 18, fontWeight: "700", color: colors.text },
  vorschlagBanner: {
    flexDirection: "row", alignItems: "center", gap: space(3),
    backgroundColor: "#fff8e7", borderWidth: 1, borderColor: colors.gelb, borderRadius: radius, padding: space(4),
  },
  vorschlagTitel: { fontSize: 15, fontWeight: "700", color: colors.text },
  vorschlagSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  bestBtn: { backgroundColor: colors.gelb, borderRadius: radius, paddingVertical: space(2), paddingHorizontal: space(3) },
  bestBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  statusCard: {
    flexDirection: "row", alignItems: "center", gap: space(3),
    backgroundColor: colors.surface, borderRadius: radius, borderWidth: 1, borderColor: colors.border, padding: space(4),
  },
  statusText: { fontSize: 16, fontWeight: "600", color: colors.text },
  statusSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface, borderRadius: radius, borderWidth: 1, borderColor: colors.border,
    padding: space(4), gap: space(3),
  },
  infoZeile: { flexDirection: "row", alignItems: "center", gap: space(3) },
  infoText: { fontSize: 15, color: colors.text, flex: 1 },
  // Sortiment-Zeile
  prodZeile: { flexDirection: "row", alignItems: "center", gap: space(3), paddingTop: space(3) },
  prodTrenner: { borderTopWidth: 1, borderTopColor: colors.border },
  prodName: { flex: 1, fontSize: 15, color: colors.text },
  prodBtn: { borderWidth: 1.5, borderRadius: 999, paddingVertical: space(1), paddingHorizontal: space(3) },
  prodBtnText: { fontSize: 13, fontWeight: "700" },
  routeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space(2),
    backgroundColor: colors.accent, borderRadius: radius, paddingVertical: space(4),
  },
  routeText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  sektion: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: space(2) },
  geoHint: { fontSize: 13, color: colors.textMuted, marginTop: -space(2) },
  meldeReihe: { flexDirection: "row", gap: space(3) },
  meldeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space(2),
    borderWidth: 2, borderRadius: radius, paddingVertical: space(3), backgroundColor: colors.surface,
  },
  meldeDot: { width: 12, height: 12, borderRadius: 6 },
  meldeBtnText: { fontSize: 15, fontWeight: "600", color: colors.text },
  demoReihe: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginTop: space(2), paddingVertical: space(2),
  },
  demoText: { fontSize: 13, color: colors.textMuted },
});
