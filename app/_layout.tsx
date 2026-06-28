// Wurzel-Layout: Stack ohne Header + globale 18+-Abfrage.
import { Stack } from "expo-router";
import AltersCheck from "../components/AltersCheck";

export default function RootLayout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }} />
            <AltersCheck />
        </>
    );
}
