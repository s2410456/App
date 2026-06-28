// Platzhalter-Daten (Linz, OÖ). Werden später durch Overpass-API + Supabase ersetzt.
import { Automat, Meldung, Produkt, Sortiment } from "./types";

export const mockAutomaten: Automat[] = [
{ id: "a1", name: "Trafik Hauptplatz Linz", beschreibung: "Ecke Hauptplatz / Rathausgasse", lat: 48.3059, lng: 14.2862, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a2", name: "Hauptbahnhof Linz", beschreibung: "Beim Haupteingang", lat: 48.2904, lng: 14.2920, produkt: "zigaretten", zahlung: "karte", zugang: "24_7" },
{ id: "a3", name: "Landstraße / Taubenmarkt", beschreibung: "Vor der Trafik", lat: 48.3017, lng: 14.2870, produkt: "beides", zahlung: "bar", zugang: "oeffnungszeiten" },
{ id: "a4", name: "Lentos / Donaulände", beschreibung: "Beim Kunstmuseum", lat: 48.3106, lng: 14.2872, produkt: "zigaretten", zahlung: "beides", zugang: "24_7" },
{ id: "a5", name: "JKU Campus Linz", beschreibung: "Nähe Mensa-Eingang", lat: 48.3370, lng: 14.3194, produkt: "snus", zahlung: "karte", zugang: "oeffnungszeiten" },
{ id: "a6", name: "Urfahr Hauptstraße", beschreibung: "Nahe Neues Rathaus", lat: 48.3170, lng: 14.2840, produkt: "beides", zahlung: "bar", zugang: "24_7" },

{ id: "a7", name: "PlusCity Pasching", beschreibung: "Beim Haupteingang Süd", lat: 48.2424, lng: 14.2361, produkt: "beides", zahlung: "beides", zugang: "oeffnungszeiten" },
{ id: "a8", name: "Leonding Zentrum", beschreibung: "Bei der Straßenbahnhaltestelle", lat: 48.2793, lng: 14.2530, produkt: "zigaretten", zahlung: "karte", zugang: "24_7" },
{ id: "a9", name: "Traun Hauptplatz", beschreibung: "Neben der Trafik am Hauptplatz", lat: 48.2209, lng: 14.2380, produkt: "beides", zahlung: "bar", zugang: "24_7" },
{ id: "a10", name: "Ansfelden Zentrum", beschreibung: "Bei der Bushaltestelle im Ortszentrum", lat: 48.2097, lng: 14.2901, produkt: "zigaretten", zahlung: "beides", zugang: "24_7" },

{ id: "a11", name: "Wels Bahnhof", beschreibung: "Beim Vorplatz des Hauptbahnhofs", lat: 48.1668, lng: 14.0275, produkt: "beides", zahlung: "karte", zugang: "24_7" },
{ id: "a12", name: "Wels Stadtplatz", beschreibung: "Seitlich beim Stadtplatz", lat: 48.1575, lng: 14.0246, produkt: "zigaretten", zahlung: "bar", zugang: "oeffnungszeiten" },
{ id: "a13", name: "Marchtrenk Zentrum", beschreibung: "Nahe Gemeindeamt", lat: 48.1921, lng: 14.1145, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a14", name: "Eferding Stadtplatz", beschreibung: "Neben Trafik und Bankfiliale", lat: 48.3080, lng: 14.0229, produkt: "zigaretten", zahlung: "karte", zugang: "oeffnungszeiten" },
{ id: "a15", name: "Grieskirchen Zentrum", beschreibung: "Beim Kirchenplatz", lat: 48.2335, lng: 13.8314, produkt: "beides", zahlung: "beides", zugang: "24_7" },

{ id: "a16", name: "Steyr Stadtplatz", beschreibung: "In der Nähe vom Rathaus", lat: 48.0404, lng: 14.4213, produkt: "beides", zahlung: "bar", zugang: "24_7" },
{ id: "a17", name: "Steyr Bahnhof", beschreibung: "Beim Bahnhofsvorplatz", lat: 48.0431, lng: 14.4188, produkt: "zigaretten", zahlung: "karte", zugang: "24_7" },
{ id: "a18", name: "Enns Hauptplatz", beschreibung: "Bei der Trafik am Hauptplatz", lat: 48.2134, lng: 14.4767, produkt: "beides", zahlung: "beides", zugang: "oeffnungszeiten" },
{ id: "a19", name: "St. Valentin Bahnhof", beschreibung: "Beim Zugang zum Bahnhof", lat: 48.1761, lng: 14.5219, produkt: "zigaretten", zahlung: "bar", zugang: "24_7" },
{ id: "a20", name: "Sankt Florian Zentrum", beschreibung: "Nahe Marktplatz und Stift", lat: 48.2062, lng: 14.3786, produkt: "snus", zahlung: "karte", zugang: "oeffnungszeiten" },

{ id: "a21", name: "Perg Hauptplatz", beschreibung: "Vor der Trafik beim Hauptplatz", lat: 48.2507, lng: 14.6334, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a22", name: "Freistadt Hauptplatz", beschreibung: "Beim Durchgang zur Altstadt", lat: 48.5114, lng: 14.5041, produkt: "beides", zahlung: "bar", zugang: "oeffnungszeiten" },
{ id: "a23", name: "Gallneukirchen Zentrum", beschreibung: "Nahe Marktplatz", lat: 48.3538, lng: 14.4168, produkt: "zigaretten", zahlung: "karte", zugang: "24_7" },
{ id: "a24", name: "Bad Leonfelden Zentrum", beschreibung: "Bei der Hauptstraße im Ortskern", lat: 48.5209, lng: 14.2946, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a25", name: "Rohrbach-Berg Stadtplatz", beschreibung: "Neben Trafik und Café", lat: 48.5734, lng: 13.9882, produkt: "zigaretten", zahlung: "bar", zugang: "oeffnungszeiten" },

{ id: "a26", name: "Schärding Stadtplatz", beschreibung: "Beim Oberen Stadtplatz", lat: 48.4569, lng: 13.4312, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a27", name: "Ried im Innkreis Hauptplatz", beschreibung: "Nahe Innenstadt-Trafik", lat: 48.2108, lng: 13.4892, produkt: "beides", zahlung: "karte", zugang: "oeffnungszeiten" },
{ id: "a28", name: "Braunau Stadtplatz", beschreibung: "Beim Stadtplatz Richtung Inn", lat: 48.2585, lng: 13.0354, produkt: "zigaretten", zahlung: "beides", zugang: "24_7" },
{ id: "a29", name: "Mattighofen Zentrum", beschreibung: "Nahe Bahnhofstraße", lat: 48.1060, lng: 13.1495, produkt: "beides", zahlung: "bar", zugang: "24_7" },
{ id: "a30", name: "Altheim Marktplatz", beschreibung: "Beim Marktplatz neben der Trafik", lat: 48.2519, lng: 13.2344, produkt: "snus", zahlung: "karte", zugang: "oeffnungszeiten" },

{ id: "a31", name: "Vöcklabruck Stadtplatz", beschreibung: "Seitlich beim Stadtplatz", lat: 48.0087, lng: 13.6554, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a32", name: "Attnang-Puchheim Bahnhof", beschreibung: "Beim Bahnhofsvorplatz", lat: 48.0110, lng: 13.7195, produkt: "zigaretten", zahlung: "karte", zugang: "24_7" },
{ id: "a33", name: "Gmunden Rathausplatz", beschreibung: "Nähe Rathausplatz und Seepromenade", lat: 47.9184, lng: 13.7993, produkt: "beides", zahlung: "bar", zugang: "oeffnungszeiten" },
{ id: "a34", name: "Bad Ischl Zentrum", beschreibung: "Nahe Esplanade und Innenstadt", lat: 47.7111, lng: 13.6209, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a35", name: "Mondsee Marktplatz", beschreibung: "Beim Marktplatz Richtung Seepromenade", lat: 47.8565, lng: 13.3491, produkt: "zigaretten", zahlung: "karte", zugang: "oeffnungszeiten" },

{ id: "a36", name: "Kirchdorf an der Krems Zentrum", beschreibung: "Beim Hauptplatz nahe Trafik", lat: 47.9056, lng: 14.1227, produkt: "beides", zahlung: "beides", zugang: "24_7" },
{ id: "a37", name: "Micheldorf Zentrum", beschreibung: "Bei der Hauptstraße im Ortszentrum", lat: 47.8775, lng: 14.1268, produkt: "zigaretten", zahlung: "bar", zugang: "24_7" },
{ id: "a38", name: "Kremsmünster Marktplatz", beschreibung: "Nahe Marktplatz und Stift", lat: 48.0525, lng: 14.1295, produkt: "beides", zahlung: "karte", zugang: "oeffnungszeiten" },
{ id: "a39", name: "Bad Hall Zentrum", beschreibung: "Beim Kurpark-Eingang", lat: 48.0386, lng: 14.2083, produkt: "snus", zahlung: "beides", zugang: "oeffnungszeiten" },
{ id: "a40", name: "Windischgarsten Zentrum", beschreibung: "Nahe Marktplatz und Bushaltestelle", lat: 47.7227, lng: 14.3273, produkt: "zigaretten", zahlung: "bar", zugang: "24_7" }
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