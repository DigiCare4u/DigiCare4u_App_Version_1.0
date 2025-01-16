import React, { useState, useEffect } from 'react';
import { View, Switch, Text, Button, StyleSheet, Alert, Platform, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import BackgroundActions from 'react-native-background-actions';
import { updateLocationIfNeeded_liveTracker } from './coreTracking';
import useFetchMember from '../hooks/useFetchMember';
import { devURL } from '../constants/endpoints';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let isTaskRunning = true;

const LiveLocationScreen = () => {
  // State for tracking and location sharing
  const [isTracking, setIsTracking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { memberProfile, fetchMemberProfile } = useFetchMember();

  // Effect to fetch member profile
  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [memberProfile, fetchMemberProfile]);

  // Function to toggle tracking status
  const toggleTracking = async() => {
    startSharingLocation()
    setIsTracking((prev) => !prev);
    if (!isTracking) {
      await startSharingLocation();

      setIsLoading(true);
      // Simulating location fetching
      setTimeout(() => {
        setIsLoading(false);
        setCurrentLocation({
          latitude: 37.78825,
          longitude: -122.4324,
        });
      }, 2000); // Simulating 2-second delay
    } else {
      // If tracking is active, stop sharing the location
      await stopSharingLocation();
    }
  };

  // Notify parent user when starting live tracking
  const notifyParentUser = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      if (!jwtToken) throw new Error('JWT token not found');

      const response = await axios.get(
        `${devURL}/assignment/member-start-live-tracking`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Notification sent successfully');
      } else {
        console.error('Failed to notify parent user');
      }
    } catch (error) {
      console.error('Error notifying parent user:', error);
    }
  };

  // Background task for live tracking
  const backgroundTask = async (taskData) => {
    const { delay } = taskData;

    try {
      await notifyParentUser();

      while (isTaskRunning) {
        try {
          const location_ = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 45000,
          });

          if (location_) {
            console.log('Fetched location:', location_);
            await updateLocationIfNeeded_liveTracker(
              location_.latitude,
              location_.longitude,
              memberProfile?.location?.coordinates
            );
          }
        } catch (locationError) {
          console.error('Error fetching location:', locationError);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (taskError) {
      console.error('Error in background task:', taskError);
    }
  };

  // Background task options
  const backgroundOptions = {
    taskName: 'Live Tracker',
    taskTitle: 'Live Tracker Is On',
    taskDesc: 'Sending your live location to ProGate',
    color: '#ff00ff',
    taskIcon: {
      name: 'ic_launcher_round',
      type: 'mipmap',
      package: 'com.app',
    },
    parameters: {
      delay: 15000, // 15 seconds
    },
    type: BackgroundActions.TYPE_FOREGROUND,
  };

  // Start sharing location
  const startSharingLocation = async () => {
    try {
      isTaskRunning = true;
      setIsSharing(true);
      await BackgroundActions.start(backgroundTask, backgroundOptions);
    } catch (error) {
      console.error('Error starting background actions:', error);
    }
  };

  // Stop sharing location
  const stopSharingLocation = async () => {
    try {
      isTaskRunning = false;
      setIsSharing(false);
      await BackgroundActions.stop();
    } catch (error) {
      console.error('Error stopping background actions:', error);
    }
  };

  // Handle the map view
  const renderMap = () => {
    if (currentLocation) {
      return (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={currentLocation} />
        </MapView>
      );
    } else {
      return <Text>Fetching location...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Location Sharing</Text>

      {/* Map and location status */}
      <View style={styles.mapContainer}>
        {renderMap()}
      </View>

      <View style={styles.trackerControls}>
        <Text style={styles.trackingStatus}>
          {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
        </Text>
        <Switch
          value={isTracking}
          onValueChange={toggleTracking}
          thumbColor={isTracking ? '#00ff00' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      {/* <Button
        title={isSharing ? 'Stop Sharing Location' : 'Start Sharing Location'}
        onPress={isSharing ? stopSharingLocation : startSharingLocation}
      /> */}
    </View>
  );
};

// Style Definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  trackerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  trackingStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default LiveLocationScreen;
