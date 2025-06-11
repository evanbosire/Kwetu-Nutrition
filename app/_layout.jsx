import { Stack } from "expo-router";
import "../global.css";
import { BookingsProvider } from './context/BookingsContext';

export default function RootLayout() {
  return (
    <BookingsProvider>
      <Stack>
        <Stack.Screen
          name="dashboards/customer"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="dashboards/inventory" options={{ headerShown: false }} />
        <Stack.Screen name="dashboards/finance" options={{ headerShown: false }} />
        <Stack.Screen name="dashboards/supplier" options={{ headerShown: false }} />
        <Stack.Screen name="dashboards/service" options={{ headerShown: false }} />
        <Stack.Screen name="dashboards/supervisor" options={{ headerShown: false }} />
        <Stack.Screen name="dashboards/gymcoach" options={{ headerShown: false }} />
      </Stack>
    </BookingsProvider>
    
  );
}
