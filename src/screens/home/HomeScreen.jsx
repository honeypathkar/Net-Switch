import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, List, Avatar, useTheme } from 'react-native-paper';
import HeaderBar from '../../components/HeaderBar';

const HomeScreen = () => {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: theme.colors.background,
        },
        header: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 24,
          color: theme.colors.onSurface,
        },
        listItem: {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 10,
        },
        listItemTitle: {
          color: theme.colors.onSurface,
          fontWeight: 'bold',
          fontSize: 18,
        },
        listItemDescription: {
          color: theme.colors.onSurfaceVariant,
          fontSize: 14,
        },
        avatar: {
          backgroundColor: theme.colors.primaryContainer,
        },
        button: {
          marginTop: 30,
          backgroundColor: theme.colors.surface,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        },
        buttonContent: {
          paddingVertical: 10,
        },
        buttonLabel: {
          color: theme.colors.onSurface,
          fontWeight: 'bold',
          fontSize: 16,
        },
      }),
    [theme],
  );

  return (
    <>
      <HeaderBar />
      <View style={styles.container}>
        <Text style={styles.header}>Saved Location</Text>
        <List.Item
          style={styles.listItem}
          title="Home"
          description="Honey_WiFi"
          titleStyle={styles.listItemTitle}
          descriptionStyle={styles.listItemDescription}
          left={() => (
            <Avatar.Icon
              icon="home"
              color={theme.colors.onSurface}
              style={styles.avatar}
              size={50}
            />
          )}
        />
        <Button
          mode="contained"
          onPress={() => console.log('Add New Zone pressed')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Add New Zone
        </Button>
      </View>
    </>
  );
};

export default HomeScreen;
