import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import HomeScreen from './src/screens/HomeScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import { initShareHandler } from './src/engine/ShareHandler';
import { Colors } from './src/utils/colors';

const Stack = createNativeStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.surface,
    card: Colors.surfaceVar,
    text: Colors.onSurface,
    border: Colors.outline,
    notification: Colors.tertiary,
  },
};

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Analysis: 'analyze',
    },
  },
};

export default function App() {
  useEffect(() => {
    initShareHandler();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DarkTheme} linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: Colors.surface },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Analysis" component={AnalysisScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
