import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="[logsID]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
