import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Modal } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  List,
  Avatar,
  useTheme,
} from 'react-native-paper';
import HeaderBar from '../../components/HeaderBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddZoneModal from '../../components/AddZoneModal';
import { showAlert } from '../../utils/alert';

const SettingScreen = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [zones, setZones] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      console.log(storedData);
      const parsed = storedData ? JSON.parse(storedData) : {};

      const safeData = {
        name: parsed.name || '',
        notification_msg: parsed.notification_msg || [],
        'location-wifi': parsed['location-wifi'] || {},
      };

      setName(safeData.name);
      setNotificationMessage(
        safeData.notification_msg.length > 0
          ? safeData.notification_msg[0]
          : '',
      );

      const zonesArray = Object.keys(safeData['location-wifi']).map(key => ({
        id: key,
        ...safeData['location-wifi'][key],
      }));
      setZones(zonesArray);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      const parsed = storedData ? JSON.parse(storedData) : {};

      const updatedData = {
        name,
        notification_msg: [notificationMessage],
        'location-wifi': parsed['location-wifi'] || {},
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      showAlert({ msg: 'Profile updated.' });
    } catch (err) {
      console.error('Failed to save data:', err);
      showAlert({ msg: 'Failed to save profile.' });
    }
  };

  const toggleModal = () => setModalVisible(prev => !prev);

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
          marginTop: 20,
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
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />

          <Text style={styles.sectionTitle}>Notifications</Text>
          <TextInput
            label="Notification Message"
            mode="outlined"
            multiline
            value={notificationMessage}
            onChangeText={setNotificationMessage}
            style={[styles.textInput, styles.multilineTextInput]}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Save Changes
          </Button>

          <Text style={styles.sectionTitle}>Trusted Zones</Text>
          {zones.length === 0 ? (
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              No trusted zones added yet.
            </Text>
          ) : (
            zones.map((zone, index) => (
              <List.Item
                key={zone.id}
                style={styles.listItem}
                title={zone.name || `Zone ${index + 1}`}
                description={`Lat: ${zone.lat}, Long: ${zone.long}`}
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
              />
            ))
          )}

          <Button
            mode="contained"
            onPress={toggleModal}
            style={[styles.button, { marginBottom: 30 }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Add New Trusted Zone
          </Button>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <AddZoneModal
            onClose={toggleModal}
            onZoneAdded={() => {
              toggleModal();
              loadUserData(); // refresh after add
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default SettingScreen;
