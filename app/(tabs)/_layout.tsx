// Tab-Navigation. Start (Home) ist der erste Tab -> App öffnet nicht mehr direkt die Karte.
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.accent,
                headerStyle: { backgroundColor: colors.surface },
                headerTitleStyle: { color: colors.text },
                sceneStyle: { backgroundColor: colors.bg },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Start",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="karte"
                options={{
                    title: "Karte",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="liste"
                options={{
                    title: "Liste",
                    tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="favoriten"
                options={{
                    title: "Favoriten",
                    tabBarIcon: ({ color, size }) => <Ionicons name="star-outline" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
