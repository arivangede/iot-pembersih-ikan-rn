import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../constants/Theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.Colors.primary,
        tabBarInactiveTintColor: Theme.Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Theme.Colors.card,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: Theme.Typography.fontSizes.small,
          fontWeight: Theme.Typography.fontWeights.bold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Clean Fish",
          tabBarIcon: ({ color }) => (
            <Ionicons name="fish" size={28} color={color} />
          ),
          headerShown: false, // Menyembunyikan header di halaman ini
        }}
      />
      <Tabs.Screen
        name="seeLogs"
        options={{
          title: "See Logs",
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums" size={28} color={color} />
          ),
          headerShown: false, // Menyembunyikan header di halaman ini
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
