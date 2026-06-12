// Zentrale Design-Tokens. Ampel-Farben sind das "Signature"-Element der App.
export const colors = {
  bg: "#f5f7f9",
  surface: "#ffffff",
  text: "#1b2733",
  textMuted: "#667586",
  border: "#e2e8ee",
  accent: "#1f7a8c",
  // Ampelsystem (siehe Konzept)
  gruen: "#2e9e4f",
  gelb: "#e0a323",
  rot: "#d64545",
  grau: "#9aa7b4",
};

export const radius = 14;
// kleiner Helfer für konsistente Abstände (4er-Raster)
export const space = (n: number) => n * 4;
