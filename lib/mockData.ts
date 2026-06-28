// Platzhalter-Daten (Linz, OÖ). Werden später durch Overpass-API + Supabase ersetzt.
import { Automat, Meldung, Produkt, Sortiment } from "./types";

export const mockAutomaten: Automat[] = [
  { id: "a1", name: "Trafik Hauptplatz", beschreibung: "Ecke Hauptplatz / Rathausgasse", lat: 48.3059, lng: 14.2862, produkt: "beides", zahlung: "beides", zugang: "24_7" },
  { id: "a2", name: "Hauptbahnhof Linz", beschreibung: "Beim Haupteingang", lat: 48.2904, lng: 14.292, produkt: "zigaretten", zahlung: "karte", zugang: "24_7" },
  { id: "a3", name: "Landstraße / Taubenmarkt", beschreibung: "Vor der Trafik", lat: 48.3017, lng: 14.287, produkt: "beides", zahlung: "bar", zugang: "oeffnungszeiten" },
  { id: "a4", name: "Lentos / Donaulände", beschreibung: "Beim Kunstmuseum", lat: 48.3106, lng: 14.2872, produkt: "zigaretten", zahlung: "beides", zugang: "24_7" },
  { id: "a5", name: "JKU Campus", beschreibung: "Nähe Mensa-Eingang", lat: 48.337, lng: 14.3194, produkt: "snus", zahlung: "karte", zugang: "oeffnungszeiten" },
  { id: "a6", name: "Urfahr Hauptstraße", beschreibung: "Nahe Neues Rathaus", lat: 48.317, lng: 14.284, produkt: "beides", zahlung: "bar", zugang: "24_7" },
];

// Produktkatalog (Marken/Sorten)
export const mockProdukte: Produkt[] = [
  { id: "p1", name: "Marlboro Red", art: "zigaretten" },
  { id: "p2", name: "Marlboro Gold", art: "zigaretten" },
  { id: "p3", name: "Lucky Strike", art: "zigaretten" },
  { id: "p4", name: "Memphis Blue", art: "zigaretten" },
  { id: "p5", name: "Velo Mint", art: "snus" },
  { id: "p6", name: "Velo Ice Cool", art: "snus" },
];

// Welcher Automat führt welche Produkte (n:m)
export const mockSortiment: Sortiment[] = [
  { automatId: "a1", produktId: "p1" }, { automatId: "a1", produktId: "p2" }, { automatId: "a1", produktId: "p5" },
  { automatId: "a2", produktId: "p1" }, { automatId: "a2", produktId: "p3" }, { automatId: "a2", produktId: "p4" },
  { automatId: "a3", produktId: "p2" }, { automatId: "a3", produktId: "p3" }, { automatId: "a3", produktId: "p6" },
  { automatId: "a4", produktId: "p1" }, { automatId: "a4", produktId: "p4" },
  { automatId: "a5", produktId: "p5" }, { automatId: "a5", produktId: "p6" },
  { automatId: "a6", produktId: "p1" }, { automatId: "a6", produktId: "p2" }, { automatId: "a6", produktId: "p5" },
];

const STUNDE = 1000 * 60 * 60;
const jetzt = Date.now();

export const mockMeldungen: Meldung[] = [
  // --- Automaten-Meldungen (ohne produktId) -> Gesamtstatus ---
  { id: "m1", automatId: "a1", status: "verfuegbar", zeitpunkt: jetzt - 2 * STUNDE },
  { id: "m2", automatId: "a1", status: "verfuegbar", zeitpunkt: jetzt - 5 * STUNDE },
  { id: "m3", automatId: "a2", status: "leer", zeitpunkt: jetzt - 1 * STUNDE },
  { id: "m4", automatId: "a3", status: "verfuegbar", zeitpunkt: jetzt - 3 * STUNDE },
  { id: "m5", automatId: "a3", status: "leer", zeitpunkt: jetzt - 4 * STUNDE },
  { id: "m6", automatId: "a4", status: "defekt", zeitpunkt: jetzt - 2 * STUNDE },
  { id: "m7", automatId: "a5", status: "verfuegbar", zeitpunkt: jetzt - 9 * 24 * STUNDE },

  // --- Produkt-Meldungen (mit produktId) -> Bestand einzelner Produkte ---
  // a1 ist gesamt grün, aber Marlboro Gold ist leer gemeldet:
  { id: "mp1", automatId: "a1", produktId: "p2", status: "leer", zeitpunkt: jetzt - 2 * STUNDE },
  { id: "mp2", automatId: "a1", produktId: "p1", status: "verfuegbar", zeitpunkt: jetzt - 1 * STUNDE },
  { id: "mp3", automatId: "a3", produktId: "p3", status: "leer", zeitpunkt: jetzt - 3 * STUNDE },
];
