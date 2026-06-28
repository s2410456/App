import React from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Automat } from "../lib/types";
import { Ampel } from "../lib/status";
import { colors } from "../theme";

export type MarkerData = { automat: Automat; ampel: Ampel };

type Props = {
  marker: MarkerData[];
  standort: { lat: number; lng: number } | null;
  onMarkerPress?: (automatId: string) => void;
};

const farbe: Record<Ampel, string> = { gruen: colors.gruen, gelb: colors.gelb, rot: colors.rot };

function buildHtml(marker: MarkerData[], standort: Props["standort"]) {
  const center = standort ?? { lat: 48.3069, lng: 14.2858 }; // Fallback: Linz Hauptplatz
  const punkte = marker.map((m) => ({
    id: m.automat.id,
    lat: m.automat.lat,
    lng: m.automat.lng,
    name: m.automat.name,
    farbe: farbe[m.ampel],
    pending: m.automat.verifizierung === "ausstehend", // unbestätigter Vorschlag
  }));

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
</head>
<body>
  <div id="map"></div>
  <script>
    function sende(id) {
      if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(id); }
      else if (window.parent) { window.parent.postMessage(id, '*'); }
    }
    const center = [${center.lat}, ${center.lng}];
    const map = L.map('map', { zoomControl: false }).setView(center, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '\u00A9 OpenStreetMap' }).addTo(map);
    ${standort ? `L.circleMarker(center, { radius: 8, color: '#1f7a8c', fillColor: '#1f7a8c', fillOpacity: 1, weight: 3 }).addTo(map).bindPopup('Du bist hier');` : ``}
    const punkte = ${JSON.stringify(punkte)};
    punkte.forEach(function (p) {
      const m = L.circleMarker([p.lat, p.lng], {
        radius: 11,
        color: p.pending ? '#7d8a97' : '#ffffff',
        weight: 2,
        fillColor: p.pending ? '#bcc6cf' : p.farbe,
        fillOpacity: p.pending ? 0.7 : 1,
        dashArray: p.pending ? '3' : null
      }).addTo(map);
      m.bindTooltip(p.name + (p.pending ? ' (Vorschlag)' : ''));
      m.on('click', function () { sende(p.id); });
    });
  </script>
</body>
</html>`;
}

export default function AutomatenMap({ marker, standort, onMarkerPress }: Props) {
  const html = buildHtml(marker, standort);

  if (Platform.OS === "web") {
    return React.createElement("iframe", {
      title: "Karte",
      srcDoc: html,
      style: { border: "none", width: "100%", height: "100%" },
    });
  }

  return (
    <WebView
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      source={{ html }}
      onMessage={(e) => onMarkerPress?.(e.nativeEvent.data)}
    />
  );
}
