// 18+-Altersabfrage beim ersten Start (Konzept). Einmal bestätigt -> dauerhaft (AsyncStorage).
import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, radius, space } from "../theme";

const KEY = "quicktschick:alter_bestaetigt";

export default function AltersCheck() {
  const [pruefend, setPruefend] = useState(true);
  const [bestaetigt, setBestaetigt] = useState(true);
  const [abgelehnt, setAbgelehnt] = useState(false);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(KEY);
      setBestaetigt(v === "ja");
      setPruefend(false);
    })();
  }, []);

  if (pruefend) return null; // verhindert kurzes Aufblitzen des Dialogs

  const bestaetigen = async () => {
    await AsyncStorage.setItem(KEY, "ja");
    setBestaetigt(true);
  };

  return (
    <Modal visible={!bestaetigt} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.titel}>Bist du über 18?</Text>
          <Text style={styles.text}>
            QuickTschick zeigt Standorte von Zigarettenautomaten. Die Nutzung ist nur für
            Personen ab 18 Jahren.
          </Text>
          {abgelehnt ? (
            <Text style={styles.hinweis}>Diese App ist nur für Personen ab 18 Jahren.</Text>
          ) : null}
          <Pressable style={styles.btnPrimary} onPress={bestaetigen}>
            <Text style={styles.btnPrimaryText}>Ja, ich bin 18 oder älter</Text>
          </Pressable>
          <Pressable style={styles.btnGhost} onPress={() => setAbgelehnt(true)}>
            <Text style={styles.btnGhostText}>Nein</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: space(6),
  },
  box: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius,
    padding: space(6),
    gap: space(3),
  },
  titel: { fontSize: 20, fontWeight: "700", color: colors.text },
  text: { fontSize: 15, color: colors.textMuted, lineHeight: 21 },
  hinweis: { fontSize: 14, color: colors.rot },
  btnPrimary: {
    backgroundColor: colors.accent,
    borderRadius: radius,
    paddingVertical: space(3),
    alignItems: "center",
    marginTop: space(2),
  },
  btnPrimaryText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  btnGhost: { paddingVertical: space(2), alignItems: "center" },
  btnGhostText: { color: colors.textMuted, fontSize: 15 },
});
