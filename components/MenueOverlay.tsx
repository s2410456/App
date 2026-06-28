// Slide-in-Menü als Overlay über der Karte.
// Schiebt sich von links ein, mit abgedunkeltem Hintergrund (Backdrop).
import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, space } from "../theme";

export type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
};

export default function MenueOverlay({ visible, onClose, items }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const panelWidth = Math.min(300, width * 0.82);

  // Animationswerte: Panel-Position (x) und Backdrop-Deckkraft
  const translateX = useRef(new Animated.Value(-panelWidth)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -panelWidth,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, panelWidth, translateX, backdrop]);

  return (
    // pointerEvents="none" wenn geschlossen -> Taps gehen an die Karte durch
    <View pointerEvents={visible ? "auto" : "none"} style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { width: panelWidth, paddingTop: insets.top + space(4), transform: [{ translateX }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.titel}>QuickTschick</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        {items.map((it, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [styles.eintrag, pressed && styles.eintragAktiv]}
            onPress={() => {
              onClose();
              it.onPress();
            }}
          >
            <Ionicons name={it.icon} size={20} color={colors.accent} />
            <Text style={styles.eintragText}>{it.label}</Text>
          </Pressable>
        ))}

        <View style={{ flex: 1 }} />
        <Text style={styles.hinweis}>Nur für Personen ab 18 Jahren.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: space(4),
    paddingBottom: space(6),
    borderTopRightRadius: radius,
    borderBottomRightRadius: radius,
    // Schatten
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 2, height: 0 },
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space(4),
  },
  titel: { fontSize: 20, fontWeight: "700", color: colors.text },
  eintrag: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(3),
    paddingVertical: space(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eintragAktiv: { backgroundColor: colors.bg },
  eintragText: { fontSize: 16, color: colors.text },
  hinweis: { fontSize: 12, color: colors.textMuted, textAlign: "center" },
});
