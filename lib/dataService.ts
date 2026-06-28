// Datenschicht: einziger Zugriffspunkt für die UI.
// Heute: Mock-Daten + AsyncStorage. Später intern auf Supabase umstellen,
// die UI bleibt unverändert (saubere Trennung Client/Server).
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Automat, Meldung, Produkt, Sortiment } from "./types";
import { mockAutomaten, mockMeldungen, mockProdukte, mockSortiment } from "./mockData";

const KEY_MELDUNGEN = "quicktschick:meldungen";
const KEY_FAVORITEN = "quicktschick:favoriten";
const KEY_VORSCHLAEGE = "quicktschick:vorschlaege";

export const VERIFY_SCHWELLE = 3;

async function ladeVorschlaege(): Promise<Automat[]> {
  const raw = await AsyncStorage.getItem(KEY_VORSCHLAEGE);
  return raw ? JSON.parse(raw) : [];
}

export async function getAutomaten(inklAusstehend = true): Promise<Automat[]> {
  const offiziell: Automat[] = mockAutomaten.map((a) => ({ ...a, quelle: "offiziell" }));
  const vorschlaege = await ladeVorschlaege();
  const sichtbar = inklAusstehend
    ? vorschlaege
    : vorschlaege.filter((v) => v.verifizierung === "bestaetigt");
  return [...offiziell, ...sichtbar];
}

export async function addVorschlag(
  daten: Omit<Automat, "id" | "quelle" | "verifizierung" | "bestaetigungen" | "gemeldetAm">
): Promise<Automat> {
  const list = await ladeVorschlaege();
  const neu: Automat = {
    ...daten,
    id: `v-${Date.now()}`,
    quelle: "vorschlag",
    verifizierung: "ausstehend",
    bestaetigungen: 1,
    gemeldetAm: Date.now(),
  };
  list.push(neu);
  await AsyncStorage.setItem(KEY_VORSCHLAEGE, JSON.stringify(list));
  return neu;
}

export async function bestaetigeVorschlag(id: string): Promise<Automat | null> {
  const list = await ladeVorschlaege();
  const v = list.find((x) => x.id === id);
  if (!v) return null;
  v.bestaetigungen = (v.bestaetigungen ?? 0) + 1;
  if ((v.bestaetigungen ?? 0) >= VERIFY_SCHWELLE) v.verifizierung = "bestaetigt";
  await AsyncStorage.setItem(KEY_VORSCHLAEGE, JSON.stringify(list));
  return v;
}

// ---- Produkte / Sortiment ----
export async function getProdukte(): Promise<Produkt[]> {
  return mockProdukte;
  // Später: supabase.from("produkte").select("*")
}

// Liefert die Produkte, die ein bestimmter Automat führt.
export async function getSortiment(automatId: string): Promise<Produkt[]> {
  const ids = mockSortiment.filter((s) => s.automatId === automatId).map((s) => s.produktId);
  return mockProdukte.filter((p) => ids.includes(p.id));
  // Später: Join automaten_produkte -> produkte
}

// Komplette n:m-Zuordnung (für Filter über alle Automaten auf einmal).
export async function getSortimentAlle(): Promise<Sortiment[]> {
  return mockSortiment;
  // Später: supabase.from("automaten_produkte").select("*")
}

// ---- Meldungen (Automat ODER Produkt, je nach produktId) ----
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

// ---- Favoriten ----
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