// app/_layout.tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { BudgetProvider } from '@/contexts/budget-context';
import { ShoppingListProvider } from '@/contexts/shopping-list-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Inter-Regular': require('../cheapcomp/assets/images/fonts/Inter-Regular.ttf'),
    'Inter-Italic': require('../cheapcomp/assets/images/fonts/Inter-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <BudgetProvider>
      <ShoppingListProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ShoppingListProvider>
    </BudgetProvider>
  );
}