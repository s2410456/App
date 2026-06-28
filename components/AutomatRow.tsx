// Wiederverwendbare Listenzeile für Liste + Favoriten.
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusPunkt from "./StatusPunkt";
import { Ampel } from "../lib/status";
import { Automat } from "../lib/types";
import { formatDistanz } from "../lib/distance";
import { colors, radius, space } from "../theme";

type Props = {
  automat: Automat;
  ampel: Ampel;
  statusText: string;
  distanz: number | null;
  istFavorit?: boolean;
  onPress: () => void;
  onFavorit?: () => void;
};

export default function AutomatRow({
  automat,
  ampel,
  statusText,
  distanz,
  istFavorit,
  onPress,
  onFavorit,
}: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.karte, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{automat.name}</Text>
        <Text style={styles.beschreibung}>{automat.beschreibung}</Text>
        <View style={styles.statusReihe}>
          <StatusPunkt ampel={ampel} />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end", gap: space(2) }}>
        <Text style={styles.distanz}>{distanz != null ? formatDistanz(distanz) : "–"}</Text>
        {onFavorit ? (
          <Pressable onPress={onFavorit} hitSlop={8}>
            <Ionicons
              name={istFavorit ? "star" : "star-outline"}
              size={22}
              color={istFavorit ? colors.gelb : colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
