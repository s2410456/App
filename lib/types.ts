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

export type AutomatQuelle = "offiziell" | "vorschlag";
export type Verifizierung = "ausstehend" | "bestaetigt" | "abgelehnt";

export type Automat = {
  id: string;
  name: string;
  beschreibung: string;
  lat: number;
  lng: number;
  produkt: Produkttyp;
  zahlung: Zahlung;
  zugang: Zugang;
  fotoUrl?: string;

  // Nur bei User-Vorschlägen (Anti-Fake / Verifizierung):
  quelle?: AutomatQuelle;
  verifizierung?: Verifizierung;
  bestaetigungen?: number;
  gemeldetVon?: string;
  gemeldetAm?: number;
};

// ----- Produkte (Bestand) -----
export type ProduktArt = "zigaretten" | "snus";

// Katalog: einzelne Marke/Sorte
export type Produkt = { id: string; name: string; art: ProduktArt };

// n:m-Zuordnung: welcher Automat führt welches Produkt
export type Sortiment = { automatId: string; produktId: string };

export type Meldung = {
  id: string;
  automatId: string;
  produktId?: string; // gesetzt -> Meldung betrifft EIN Produkt; leer -> ganzer Automat
  status: AutomatStatus;
  zeitpunkt: number;
};
