import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert, PermissionsAndroid, Image } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import GetLocation from 'react-native-get-location';
import { devURL } from '../constants/endpoints';
import { updateLocationIfNeeded_bg } from './coreTracking';
import useFetchMember from '../hooks/useFetchMember';

const Bg_for_v1 = ({ isBgAccess }) => {
  const { memberProfile, fetchMemberProfile } = useFetchMember();

  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [memberProfile, fetchMemberProfile]);

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const task = async (taskData, setLocation) => {
    console.log('Background task is running...');

    while (BackgroundActions.isRunning()) {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 45000,
        });
        // console.log('------- location ------------>', location.accuracy, taskData.delay);

        await updateLocationIfNeeded_bg(
          location?.latitude,
          location?.longitude,
          memberProfile?.location?.coordinates
        );

        setLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        const response = await fetch(`${devURL}/member/profile/live-update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        });

        const data = await response.json();
        console.log('Background API response:', data.message);
      } catch (error) {
        console.error(error)
      }

      await sleep(taskData.delay);
    }
  };

  const mapRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState(null);

  const requestBackgroundLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: 'Background Location Permission',
          message: 'This app needs access to your location in the background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Background location permission granted');
        return true;
      } else {
        console.log('Background location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const checkBackgroundLocationPermission = async () => {
    if (!isBgAccess) {
      console.log('Background access not required.');
      return true;
    }

    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
      if (granted) {
        console.log('Background location permission is granted');
        return true;
      } else {
        console.log('Background location permission is denied');
        return await requestBackgroundLocationPermission();
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const startBackgroundTask = async () => {
    if (!isBgAccess) {
      Alert.alert('Background access is disabled', 'Enable background access to start tracking.');
      return;
    }

    if (isRunning) {
      Alert.alert('Tracking is already running', 'Please stop the current task before starting a new one.');
      return;
    }

    const options = {
      taskName: 'Background API Task',
      taskTitle: 'Performing background API calls',
      taskDesc: 'Fetching data from the API',
      color: '#ff00ff',
      taskIcon: {
        name: 'ic_launcher_round',
        type: 'mipmap',
        package: 'com.digicare',
      },
      actions: [
        {
          type: 'button',
          text: 'Stop Task',
          callback: () => stopBackgroundTask(),
        },
      ],
      parameters: {
        // delay: 900000, // 15 minutes in milliseconds
        delay: 60000, // 15 minutes in milliseconds

      },
    };

    try {
      setIsRunning(true);
      await BackgroundActions.start((taskData) => task(taskData, setLocation), options);
    } catch (e) {
      console.log('Error starting task:', e);
      Alert.alert('Error', 'Failed to start background task');
      setIsRunning(false);
    }
  };

  const stopBackgroundTask = async () => {
    try {
      await BackgroundActions.stop();
      setIsRunning(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to stop background task');
    }
  };

  useEffect(() => {
    checkBackgroundLocationPermission();
  }, []);

  useEffect(() => {
    if (location) {
      mapRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [location]);
  

  return (
    <View style={styles.container}>
      <Button
        title={isRunning ? 'Stop Background Task' : 'Start Background Task'}
        onPress={isRunning ? stopBackgroundTask : startBackgroundTask}
      />
      {location && (
        <MapView ref={mapRef} style={styles.map}>
          <Camera
            zoomLevel={14}
            centerCoordinate={[location.longitude || 0.0, location.latitude || 0.0]}
          />
          <MarkerView
            allowOverlap={true}
            coordinate={[location.longitude || 0.0, location.latitude || 0.0]}
          >
            <View style={styles.customMarker}>
              <Image
                source={require('../components/Assets/pin.jpg')}
                style={styles.memberImage}
              />
            </View>
          </MarkerView>
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 20,
  },
  memberImage: {
    height: 40,
    width: 40,
  },
});

export default Bg_for_v1;
