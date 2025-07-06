import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { LightTheme, DarkTheme } from './theme/theme';
import BottomTabNavigator from './navigator/BottomTabNavigator';
import SplashScreen from './screens/splash/SplashScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { isDarkMode } = useThemeContext();

  const paperTheme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        backgroundColor={paperTheme.colors.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={paperTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
