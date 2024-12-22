import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Theme from "../constants/Theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar translucent backgroundColor={Theme.Colors.background} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cleaning-logs" options={{ headerShown: false }} />
        <Stack.Screen name="fish-type" options={{ headerShown: false }} />
        <Stack.Screen
          name="device-information"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
