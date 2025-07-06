import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useMemo } from 'react';

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFFFFF',
    onPrimary: '#000000',
    primaryContainer: '#333333',
    background: '#101010',
    surface: '#1c1c1c',
    onSurface: '#FFFFFF',
    surfaceVariant: '#2a2a2a',
    onSurfaceVariant: '#a0a0a0',
    outline: '#444444',
  },
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FFFFFF',
    onPrimary: '#000000',
    primaryContainer: '#333333',
    background: '#f7f7f7',
    surface: '#000000',
    onSurface: '#000000',
    surfaceVariant: '#e7e7e7',
    onSurfaceVariant: '#a0a0a0',
    outline: '#cccccc',
  },
};
