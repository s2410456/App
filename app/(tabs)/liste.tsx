// Listen-Screen: nach Entfernung sortiert, mit Art-/Produkt-/Status-Filtern, Favoriten-Stern und Detail-Sprung.
import { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getAutomaten, getMeldungen, getFavoriten, toggleFavorit, getProdukte, getSortimentAlle } from "../../lib/dataService";
import { berechneAmpel } from "../../lib/status";
import { distanzMeter } from "../../lib/distance";
import { statusLabel } from "../../lib/labels";
import { useLocation } from "../../lib/useLocation";
import { Automat, Meldung, Produkt, ProduktArt, Sortiment } from "../../lib/types";
import AutomatRow from "../../components/AutomatRow";
import { colors, space } from "../../theme";

type StatusFilter = "alle" | "gruen" | "gelb" | "rot";
type ArtFilter = "alle" | ProduktArt;

export default function ListeScreen() {
    const router = useRouter();
    const { standort } = useLocation();
    const [automaten, setAutomaten] = useState<Automat[]>([]);
    const [meldungen, setMeldungen] = useState<Meldung[]>([]);
    const [favoriten, setFavoriten] = useState<string[]>([]);
    const [produkte, setProdukte] = useState<Produkt[]>([]);
    const [sortiment, setSortiment] = useState<Sortiment[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");
    const [art, setArt] = useState<ArtFilter>("alle");
    const [produktId, setProduktId] = useState<string | null>(null);
    const [laedt, setLaedt] = useState(true);

    const laden = useCallback(async () => {
        setAutomaten(await getAutomaten());
        setMeldungen(await getMeldungen());
        setFavoriten(await getFavoriten());
        setProdukte(await getProdukte());
        setSortiment(await getSortimentAlle());
        setLaedt(false);
    }, []);
    useFocusEffect(useCallback(() => { laden(); }, [laden]));

    // Produkt-Chips richten sich nach der gewählten Art.
    const sichtbareProdukte = useMemo(
        () => produkte.filter((p) => art === "alle" || p.art === art),
        [produkte, art]
    );

    // Art wechseln -> ggf. gewähltes Produkt zurücksetzen (passt sonst nicht zur Art).
    const artWaehlen = (neu: ArtFilter) => {
        setArt(neu);
        if (produktId) {
            const p = produkte.find((x) => x.id === produktId);
            if (!p || (neu !== "alle" && p.art !== neu)) setProduktId(null);
        }
    };

    const zeilen = useMemo(() => {
        // Automaten, die das gewählte Produkt führen (nur wenn ein Produkt gewählt ist).
        const automatenMitProdukt = produktId
            ? new Set(sortiment.filter((s) => s.produktId === produktId).map((s) => s.automatId))
            : null;

        const z = automaten.map((a) => {
            const info = berechneAmpel(meldungen.filter((m) => m.automatId === a.id && !m.produktId));
            const distanz = standort ? distanzMeter(standort.lat, standort.lng, a.lat, a.lng) : null;
            return { automat: a, ampel: info.ampel, statusText: statusLabel[info.status], distanz };
        });

        const gefiltert = z.filter((x) => {
            // 1) Status (Ampel)
            if (statusFilter !== "alle" && x.ampel !== statusFilter) return false;
            // 2) Art über das produkt-Feld; "beides" zählt für beide Arten
            if (art !== "alle" && x.automat.produkt !== art && x.automat.produkt !== "beides") return false;
            // 3) Einzelnes Produkt über die Sortiment-Zuordnung
            if (automatenMitProdukt && !automatenMitProdukt.has(x.automat.id)) return false;
            return true;
        });

        gefiltert.sort((x, y) => (x.distanz ?? Infinity) - (y.distanz ?? Infinity));
        return gefiltert;
    }, [automaten, meldungen, standort, statusFilter, art, produktId, sortiment]);

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
            {/* Art-Filter */}
            <View style={styles.chips}>
                <Chip label="Alle Arten" aktiv={art === "alle"} onPress={() => artWaehlen("alle")} />
                <Chip label="Zigaretten" aktiv={art === "zigaretten"} onPress={() => artWaehlen("zigaretten")} />
                <Chip label="Snus" aktiv={art === "snus"} onPress={() => artWaehlen("snus")} />
            </View>

            {/* Produkt-Filter (umbrechend, nicht scrollend) */}
            <View style={styles.chips}>
                <Chip label="Alle Produkte" aktiv={produktId === null} onPress={() => setProduktId(null)} />
                {sichtbareProdukte.map((p) => (
                    <Chip
                        key={p.id}
                        label={p.name}
                        aktiv={produktId === p.id}
                        onPress={() => setProduktId(produktId === p.id ? null : p.id)}
                    />
                ))}
            </View>

            {/* Status-Filter */}
            <View style={styles.chips}>
                <Chip label="Alle" aktiv={statusFilter === "alle"} onPress={() => setStatusFilter("alle")} />
                <Chip label="Verfügbar" aktiv={statusFilter === "gruen"} farbe={colors.gruen} onPress={() => setStatusFilter("gruen")} />
                <Chip label="Unsicher" aktiv={statusFilter === "gelb"} farbe={colors.gelb} onPress={() => setStatusFilter("gelb")} />
                <Chip label="Leer" aktiv={statusFilter === "rot"} farbe={colors.rot} onPress={() => setStatusFilter("rot")} />
            </View>

            <FlatList
                data={zeilen}
                keyExtractor={(z) => z.automat.id}
                contentContainerStyle={{ padding: space(4) }}
                ItemSeparatorComponent={() => <View style={{ height: space(2) }} />}
                ListEmptyComponent={<Text style={styles.leer}>Keine Automaten für diese Filter.</Text>}
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