// Füllstand-Prognose (USP aus dem Konzept).
// Berechnet aus den Community-Meldungen ein Ampel-Ergebnis.
import { AutomatStatus, Meldung } from "./types";

export type Ampel = "gruen" | "gelb" | "rot";

// Gemeldeter Status -> Zahlenwert (-1 = leer/defekt, +1 = verfügbar)
const wert: Record<AutomatStatus, number> = {
  verfuegbar: 1,
  fast_leer: 0,
  leer: -1,
  defekt: -1,
  unbekannt: 0,
};

const TAG = 1000 * 60 * 60 * 24;

// Gewichtung: neuere Meldungen zählen mehr (Halbwertszeit ~2 Tage).
function gewicht(alterMs: number): number {
  const tage = alterMs / TAG;
  return Math.pow(0.5, tage / 2); // exponentieller Zerfall
}

export type AmpelInfo = {
  ampel: Ampel;
  status: AutomatStatus;
  anzahl: number;
  letzteMeldung?: number;
};

export function berechneAmpel(
  meldungen: Meldung[],
  jetzt = Date.now()
): AmpelInfo {
  if (meldungen.length === 0) {
    return { ampel: "gelb", status: "unbekannt", anzahl: 0 };
  }

  let summeGewicht = 0;
  let summeWert = 0;
  let letzte = 0;

  for (const m of meldungen) {
    const g = gewicht(jetzt - m.zeitpunkt);
    summeGewicht += g;
    summeWert += g * wert[m.status];
    if (m.zeitpunkt > letzte) letzte = m.zeitpunkt;
  }

  // Letzte Meldung zu alt -> Daten unsicher (gelb)
  if (gewicht(jetzt - letzte) < 0.15) {
    return {
      ampel: "gelb",
      status: "unbekannt",
      anzahl: meldungen.length,
      letzteMeldung: letzte,
    };
  }

  const score = summeWert / summeGewicht; // -1 .. +1

  let ampel: Ampel;
  let status: AutomatStatus;
  if (score > 0.3) {
    ampel = "gruen";
    status = "verfuegbar";
  } else if (score < -0.3) {
    ampel = "rot";
    status = "leer";
  } else {
    ampel = "gelb";
    status = "fast_leer";
  }

  return { ampel, status, anzahl: meldungen.length, letzteMeldung: letzte };
}
