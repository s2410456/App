// Wurzel-Layout. Versteckt den Stack-Header, da die Tabs eigene Header haben.
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
