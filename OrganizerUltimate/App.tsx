import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { AppNavigator } from './src/navigation';
import { useSettingsStore } from './src/store';
import { COLORS } from './src/constants';

const queryClient = new QueryClient();

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
  },
};

export default function App() {
  const { settings } = useSettingsStore();
  const isDark = settings.theme === 'dark';
  
  const theme = isDark ? customDarkTheme : customLightTheme;
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}