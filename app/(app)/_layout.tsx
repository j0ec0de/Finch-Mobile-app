import { Stack } from 'expo-router';
import type { ComponentProps } from 'react';

type ScreenOptions = ComponentProps<typeof Stack.Screen>['options'];

export const unstable_settings = {
  anchor: '(tabs)',
};

const sheet = (title: string): ScreenOptions => ({
  presentation: 'formSheet',
  title,
  headerShown: true,
  sheetAllowedDetents: [0.9],
  sheetGrabberVisible: true,
});

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="accounts/index" options={{ headerShown: true, title: 'Accounts' }} />
      <Stack.Screen name="accounts/new" options={sheet('New account')} />
      <Stack.Screen name="accounts/[id]" options={sheet('Edit account')} />
      <Stack.Screen name="transactions/new" options={sheet('New transaction')} />
      <Stack.Screen name="transactions/[id]" options={sheet('Transaction')} />
    </Stack>
  );
}
