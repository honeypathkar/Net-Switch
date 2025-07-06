import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  List,
  Avatar,
  useTheme,
  IconButton,
} from 'react-native-paper';
import HeaderBar from '../../components/HeaderBar';

const trustedZones = [
  { name: 'Home', address: '123 Elm St' },
  { name: 'Work', address: '456 Maple Ave' },
  { name: 'Cafe', address: '789 Cedar Ln' },
];

const SettingScreen = () => {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 20,
        },
        sectionTitle: {
          fontSize: 22,
          fontWeight: 'bold',
          color: theme.colors.onSurface,
          marginTop: 24,
          marginBottom: 16,
        },
        textInput: {
          backgroundColor: theme.colors.surfaceVariant,
          marginBottom: 10,
        },
        multilineTextInput: {
          height: 120,
          textAlignVertical: 'top',
        },
        listItem: {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 16,
          paddingVertical: 4,
          marginBottom: 8,
          paddingHorizontal: 10,
        },
        listItemTitle: {
          color: theme.colors.onSurface,
          fontWeight: 'bold',
        },
        listItemDescription: {
          color: theme.colors.onSurfaceVariant,
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
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TextInput
            label="Display Name"
            mode="outlined"
            style={styles.textInput}
          />

          <Text style={styles.sectionTitle}>Notifications</Text>
          <TextInput
            label="Notification Message"
            mode="outlined"
            multiline
            style={[styles.textInput, styles.multilineTextInput]}
          />

          <Text style={styles.sectionTitle}>Trusted Zones</Text>
          {trustedZones.map((zone, index) => (
            <List.Item
              key={index}
              style={styles.listItem}
              title={zone.name}
              description={zone.address}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
              left={() => (
                <Avatar.Icon
                  icon="wifi"
                  color={theme.colors.onSurface}
                  style={styles.avatar}
                  size={50}
                />
              )}
              right={() => (
                <IconButton
                  icon="pencil"
                  iconColor={theme.colors.onSurfaceVariant}
                  size={24}
                  onPress={() => console.log(`Edit ${zone.name}`)}
                />
              )}
            />
          ))}

          <Button
            mode="contained"
            onPress={() => console.log('Add New Trusted Zone pressed')}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Add New Trusted Zone
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default SettingScreen;
