// Datenschicht: einziger Zugriffspunkt für die UI.
// Heute: Mock-Daten + AsyncStorage. Später: hier intern auf Supabase umstellen,
// die UI muss NICHT geändert werden (saubere Trennung Client/Server).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Automat, Meldung } from "./types";
import { mockAutomaten, mockMeldungen } from "./mockData";

const KEY_MELDUNGEN = "smokefinder:meldungen";
const KEY_FAVORITEN = "smokefinder:favoriten";

export async function getAutomaten(): Promise<Automat[]> {
  // Später: const { data } = await supabase.from("automaten").select("*");
  return mockAutomaten;
}

export async function getMeldungen(): Promise<Meldung[]> {
  const raw = await AsyncStorage.getItem(KEY_MELDUNGEN);
  const eigene: Meldung[] = raw ? JSON.parse(raw) : [];
  return [...mockMeldungen, ...eigene];
}

export async function addMeldung(m: Meldung): Promise<void> {
  const raw = await AsyncStorage.getItem(KEY_MELDUNGEN);
  const eigene: Meldung[] = raw ? JSON.parse(raw) : [];
  eigene.push(m);
  await AsyncStorage.setItem(KEY_MELDUNGEN, JSON.stringify(eigene));
}

export async function getFavoriten(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY_FAVORITEN);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFavorit(automatId: string): Promise<string[]> {
  const aktuell = await getFavoriten();
  const neu = aktuell.includes(automatId)
    ? aktuell.filter((id) => id !== automatId)
    : [...aktuell, automatId];
  await AsyncStorage.setItem(KEY_FAVORITEN, JSON.stringify(neu));
  return neu;
}
