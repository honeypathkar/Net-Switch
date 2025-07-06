import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Button,
  List,
  Avatar,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBar from '../../components/HeaderBar';
import AddZoneModal from '../../components/AddZoneModal';
import { showAlert } from '../../utils/alert';

const HomeScreen = () => {
  const theme = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [savedZones, setSavedZones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadSavedZones = useCallback(async () => {
    try {
      const rawData = await AsyncStorage.getItem('userData');
      if (rawData !== null) {
        const parsedData = JSON.parse(rawData);
        const zonesObject = parsedData['location-wifi'] || {};
        const zonesArray = Object.keys(zonesObject).map(key => ({
          id: key,
          ...zonesObject[key],
        }));
        setSavedZones(zonesArray);
        console.log(zonesArray);
      }
    } catch (error) {
      console.error('Failed to load zones from storage', error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadSavedZones();
    }
  }, [isFocused, loadSavedZones]);

  const handleDeleteZone = async zoneId => {
    try {
      const existingData = await AsyncStorage.getItem('userData');
      const data = existingData ? JSON.parse(existingData) : {};

      if (data['location-wifi'] && data['location-wifi'][zoneId]) {
        delete data['location-wifi'][zoneId];
        await AsyncStorage.setItem('userData', JSON.stringify(data));

        const updatedZones = savedZones.filter(zone => zone.id !== zoneId);
        setSavedZones(updatedZones);

        showAlert({ msg: 'Trusted zone deleted.' });
      }
    } catch (error) {
      console.error('Failed to delete zone:', error);
      showAlert({ msg: 'Error deleting zone' });
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavedZones();
    setRefreshing(false);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: 20,
          backgroundColor: theme.colors.background,
        },
        headerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        },
        header: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.colors.onSurface,
        },
        listContainer: {
          flex: 1,
        },
        listItem: {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 10,
          marginBottom: 12,
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
        modalOverlay: {
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        emptyListText: {
          textAlign: 'center',
          marginTop: 50,
          fontSize: 16,
          color: theme.colors.onSurfaceVariant,
        },
      }),
    [theme],
  );

  const renderZone = ({ item, index }) => (
    <List.Item
      style={styles.listItem}
      title={`Trusted Zone ${index + 1}`}
      description={`WiFi: ${item.name}\nLat: ${item.lat?.toFixed(
        4,
      )}, Lng: ${item.long?.toFixed(4)}`}
      titleStyle={styles.listItemTitle}
      descriptionNumberOfLines={3}
      descriptionStyle={styles.listItemDescription}
      left={() => (
        <Avatar.Icon
          icon="wifi-check"
          color={theme.colors.onSurface}
          style={styles.avatar}
          size={50}
        />
      )}
      right={() => (
        <Button
          icon="trash-can-outline"
          onPress={() => handleDeleteZone(item.id)}
          compact
          textColor={theme.colors.error}
        />
      )}
    />
  );

  return (
    <>
      <HeaderBar />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Saved Zones</Text>
          <IconButton
            icon="refresh"
            onPress={handleRefresh}
            iconColor={theme.colors.primary}
          />
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={savedZones}
            renderItem={renderZone}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyListText}>
                No saved zones yet. Add one!
              </Text>
            }
          />
        </View>

        <Button
          mode="contained"
          onPress={toggleModal}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Add New Zone
        </Button>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <AddZoneModal onClose={toggleModal} onZoneAdded={handleRefresh} />
        </View>
      </Modal>
    </>
  );
};

export default HomeScreen;
