import { StyleSheet, View, Text, Image } from 'react-native';
import React, { useMemo } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useThemeContext } from '../context/ThemeContext';

const HeaderBar = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        appBar: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.onSurface,
        },
        title: {
          fontWeight: 'bold',
          color: theme.colors.onSurface,
          fontSize: 22,
        },
        logo: {
          width: 28,
          height: 28,
          marginRight: 8,
          borderRadius: 8,
        },
      }),
    [theme],
  );

  return (
    <Appbar.Header style={styles.appBar} statusBarHeight={0}>
      <Appbar.Content
        title={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>Net Switch</Text>
          </View>
        }
      />
      {/* <Appbar.Action
        icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
        onPress={toggleTheme}
        color={theme.colors.onSurface}
      /> */}
    </Appbar.Header>
  );
};

export default HeaderBar;
