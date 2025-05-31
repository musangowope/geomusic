import { router, Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function AuthLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(playlists)" options={{ headerShown: false }} />
    </Stack>
  );
}
