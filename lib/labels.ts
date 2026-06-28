// Anzeige-Texte für die Enum-Werte aus types.ts.
import { AutomatStatus, Produkttyp, Zahlung, Zugang } from "./types";

export const produktLabel: Record<Produkttyp, string> = {
  zigaretten: "Zigaretten",
  snus: "Snus / Pouches",
  beides: "Zigaretten & Snus",
};

export const zahlungLabel: Record<Zahlung, string> = {
  bar: "Bargeld",
  karte: "Karte",
  beides: "Bar & Karte",
  unbekannt: "Zahlung unbekannt",
};

export const zugangLabel: Record<Zugang, string> = {
  "24_7": "0–24 Uhr",
  oeffnungszeiten: "Nur zu Öffnungszeiten",
  unsicher: "Zugang unsicher",
};

export const statusLabel: Record<AutomatStatus, string> = {
  verfuegbar: "Wahrscheinlich verfügbar",
  fast_leer: "Unsicher / fast leer",
  leer: "Wahrscheinlich leer",
  defekt: "Defekt gemeldet",
  unbekannt: "Keine aktuellen Daten",
};
