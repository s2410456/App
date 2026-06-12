// Datenmodell. Spiegelt später 1:1 die Supabase-Tabellen wider.

export type AutomatStatus =
  | "verfuegbar"
  | "fast_leer"
  | "leer"
  | "defekt"
  | "unbekannt";

export type Produkttyp = "zigaretten" | "snus" | "beides";
export type Zahlung = "bar" | "karte" | "beides" | "unbekannt";
export type Zugang = "24_7" | "oeffnungszeiten" | "unsicher";

export type Automat = {
  id: string;
  name: string;
  beschreibung: string; // z. B. "neben Trafik", "beim Bahnhof"
  lat: number;
  lng: number;
  produkt: Produkttyp;
  zahlung: Zahlung;
  zugang: Zugang;
  fotoUrl?: string;
};

export type Meldung = {
  id: string;
  automatId: string;
  status: AutomatStatus; // gemeldeter Zustand
  zeitpunkt: number; // Date.now()
  // Später für Anti-Fake: userId, lat, lng (Standort beim Melden)
};
