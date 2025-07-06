import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, View, Platform, Alert, ToastAndroid } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { showAlert } from '../utils/alert';

const AddZoneModal = ({ onClose, onZoneAdded }) => {
  const theme = useTheme();
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: 26.9124,
    longitude: 75.7873,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialRegion);
  const [markerPosition, setMarkerPosition] = useState(initialRegion);
  const [wifiName, setWifiName] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const fetchWifi = async () => {
      try {
        const state = await NetInfo.fetch();
        if (state.type === 'wifi') {
          const ssid = state.details?.ssid;
          if (ssid) setWifiName(ssid);
        }
      } catch (error) {
        showAlert({ msg: 'Could not fetch Wi-Fi name' });
      }
    };
    fetchWifi();
  }, []);

  const handleSaveZone = async () => {
    if (!wifiName.trim()) {
      showAlert({ msg: 'Please enter a WiFi Network Name.' });
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('userData');
      const data = existingData ? JSON.parse(existingData) : {};

      if (!data['location-wifi'] || typeof data['location-wifi'] !== 'object') {
        data['location-wifi'] = {};
      }

      const zones = Object.values(data['location-wifi']);

      const isDuplicateName = zones.some(
        zone =>
          zone.name?.trim().toLowerCase() === wifiName.trim().toLowerCase(),
      );

      const isDuplicateLocation = zones.some(
        zone =>
          Math.abs(zone.lat - markerPosition.latitude) < 0.0001 &&
          Math.abs(zone.long - markerPosition.longitude) < 0.0001,
      );

      if (isDuplicateName) {
        showAlert({ msg: 'This WiFi name already exists.' });
        return;
      }

      if (isDuplicateLocation) {
        showAlert({ msg: 'This location is already saved.' });
        return;
      }

      const newKeyIndex = Object.keys(data['location-wifi']).length + 1;
      const newWifiKey = `wifi-${newKeyIndex}`;

      data['location-wifi'][newWifiKey] = {
        name: wifiName,
        lat: markerPosition.latitude,
        long: markerPosition.longitude,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(data));

      showAlert({ msg: 'Trusted zone & WiFi info saved.' });
      onZoneAdded?.();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      showAlert({ msg: 'Failed to save the trusted zone.' });
    }
  };

  const onMapPress = e => {
    setMarkerPosition(e.nativeEvent.coordinate);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalContent: {
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
          alignItems: 'center',
        },
        handleBar: {
          width: 40,
          height: 5,
          backgroundColor: theme.colors.outline,
          borderRadius: 2.5,
          marginBottom: 20,
        },
        header: {
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20,
          color: theme.colors.onSurface,
        },
        mapContainer: {
          width: '100%',
          height: 200,
          borderRadius: 16,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceVariant,
          overflow: 'hidden',
        },
        button: {
          width: '100%',
          borderRadius: 50,
          marginTop: 10,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        },
        buttonContent: {
          paddingVertical: 8,
        },
        buttonLabel: {
          color: theme.colors.onSurface,
          fontWeight: 'bold',
          fontSize: 16,
        },
        textInput: {
          width: '100%',
          marginVertical: 15,
          backgroundColor: theme.colors.surfaceVariant,
        },
        mapNote: {
          color: theme.colors.onSurfaceVariant,
          fontSize: 12,
          textAlign: 'center',
          marginTop: 4,
          marginBottom: 8,
          paddingHorizontal: 10,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.modalContent}>
      <View style={styles.handleBar} />
      <Text style={styles.header}>Add New Trusted Zone</Text>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider="google"
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          showsUserLocation={isMapReady}
          showsMyLocationButton={false}
          onMapReady={() => setIsMapReady(true)}
          //           ref={mapRef}
          // style={StyleSheet.absoluteFillObject}
          // initialRegion={region}
          // onMapReady={() => setIsMapReady(true)}
          // onPress={onMapPress}
          // showsUserLocation={isMapReady}
          // showsMyLocationButton={false}
          onPress={onMapPress}
          onUserLocationChange={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;

            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };

            setRegion(newRegion);
            setMarkerPosition(newRegion); // Set the marker at current location
            mapRef.current?.animateToRegion(newRegion, 1000);
          }}
        >
          {isMapReady && (
            <Marker
              coordinate={markerPosition}
              title="Selected Location"
              draggable
              onDragEnd={onMapPress}
            />
          )}
        </MapView>
        {isLocating && (
          <ActivityIndicator
            style={StyleSheet.absoluteFillObject}
            animating={true}
            size="large"
          />
        )}
      </View>
      <Text style={styles.mapNote}>
        * Select location using the location icon on map above.{'\n'}* Location
        is important — use the correct one.
      </Text>

      <TextInput
        label="WiFi Network Name"
        value={wifiName}
        onChangeText={setWifiName}
        mode="outlined"
        style={styles.textInput}
        outlineStyle={{ borderRadius: 10, borderWidth: 0 }}
        contentStyle={{ paddingHorizontal: 15 }}
        theme={{ roundness: 16 }}
      />

      <Button
        mode="contained"
        onPress={handleSaveZone}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Add Zone
      </Button>
      <Button
        mode="outlined"
        onPress={onClose}
        style={[styles.button, { marginBottom: 10 }]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Close
      </Button>
    </View>
  );
};

export default AddZoneModal;
