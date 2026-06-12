// Platzhalter-Daten (Wien). Werden später durch Overpass-API + Supabase ersetzt.
import { Automat, Meldung } from "./types";

export const mockAutomaten: Automat[] = [
  {
    id: "a1",
    name: "Trafik Stephansplatz",
    beschreibung: "Neben dem Domeingang",
    lat: 48.2082,
    lng: 16.3738,
    produkt: "beides",
    zahlung: "beides",
    zugang: "24_7",
  },
  {
    id: "a2",
    name: "Automat Karlsplatz",
    beschreibung: "U-Bahn-Ausgang Resselpark",
    lat: 48.2008,
    lng: 16.3695,
    produkt: "zigaretten",
    zahlung: "bar",
    zugang: "24_7",
  },
  {
    id: "a3",
    name: "Praterstern Nord",
    beschreibung: "Beim Bahnhofseingang",
    lat: 48.2185,
    lng: 16.3917,
    produkt: "beides",
    zahlung: "karte",
    zugang: "24_7",
  },
  {
    id: "a4",
    name: "Mariahilfer Straße",
    beschreibung: "Vor der Trafik Nr. 45",
    lat: 48.1975,
    lng: 16.3508,
    produkt: "zigaretten",
    zahlung: "beides",
    zugang: "oeffnungszeiten",
  },
  {
    id: "a5",
    name: "Westbahnhof",
    beschreibung: "Haupteingang rechts",
    lat: 48.1965,
    lng: 16.338,
    produkt: "snus",
    zahlung: "karte",
    zugang: "24_7",
  },
  {
    id: "a6",
    name: "Schwedenplatz",
    beschreibung: "Beim Würstelstand",
    lat: 48.2115,
    lng: 16.3779,
    produkt: "beides",
    zahlung: "bar",
    zugang: "24_7",
  },
];

const STUNDE = 1000 * 60 * 60;
const jetzt = Date.now();

// Meldungen mit unterschiedlichem Alter/Status -> ergibt verschiedene Ampelfarben
export const mockMeldungen: Meldung[] = [
  // a1: mehrere frische "verfügbar" -> grün
  { id: "m1", automatId: "a1", status: "verfuegbar", zeitpunkt: jetzt - 2 * STUNDE },
  { id: "m2", automatId: "a1", status: "verfuegbar", zeitpunkt: jetzt - 5 * STUNDE },
  // a2: frisch "leer" -> rot
  { id: "m3", automatId: "a2", status: "leer", zeitpunkt: jetzt - 1 * STUNDE },
  // a3: widersprüchlich/teilweise -> gelb
  { id: "m4", automatId: "a3", status: "verfuegbar", zeitpunkt: jetzt - 3 * STUNDE },
  { id: "m5", automatId: "a3", status: "leer", zeitpunkt: jetzt - 4 * STUNDE },
  // a4: "defekt" frisch -> rot
  { id: "m6", automatId: "a4", status: "defekt", zeitpunkt: jetzt - 2 * STUNDE },
  // a5: alte Meldung -> gelb (veraltet)
  { id: "m7", automatId: "a5", status: "verfuegbar", zeitpunkt: jetzt - 9 * 24 * STUNDE },
  // a6: keine Meldungen -> gelb (unbekannt)
];
