import { Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import { devURL } from '../constants/endpoints';
import GetLocation from 'react-native-get-location';
import MapView, { Marker } from 'react-native-maps';
import BackgroundLocationComponent from './ask';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const task = async (taskData, setLocation) => {
  console.log('Background task is running...');

  while (BackgroundActions.isRunning()) {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      console.log('------- location ------------', location);

      // Update location in the state
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
      console.log( data.message);
    } catch (error) {
      console.error( error);
    }

    await sleep(taskData.delay);
  }
};

const GoogleMapWithBGTracking = () => {

  const [isBackgroundPermissioned, setIsBackgroundPermissioned] = useState(null)
  
  
  
  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState(null);
  
  const requestBackgroundLocationPermission = async () => {
    try {
      console.log('Requesting background location permission...');
      const bgPermission = check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
      setIsBackgroundPermissioned(bgPermission ? true : false)

      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, {
        title: 'Background Location Permission',
        message: 'This app needs access to your location in the background.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      console.log('Permission result:', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission denied with never ask again');
        Alert.alert(
          'Permission Denied',
          'Background location access is required to run this feature. Please enable it manually in the app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        console.log('Permission denied');
      }

      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };


  const checkBackgroundLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
      if (!granted) {
        const permissionGranted = await requestBackgroundLocationPermission();
        if (!permissionGranted) {
          Alert.alert('Permission Denied', 'Background location access is required to run the app.');
        }
        return permissionGranted;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const startBackgroundTask = async () => {
    const options = {
      taskName: 'Background API Task',
      taskTitle: 'Performing background API calls',
      taskDesc: 'Fetching data from the API',
      color: '#ff00ff',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
        package: 'com.digicare'
      },
      actions: [
        {
          type: 'button',
          text: 'Stop Task',
          callback: () => stopBackgroundTask(),
        },
      ],
      parameters: {
        delay: 1000,
      },
    };

    try {
      setIsRunning(true);

      const isPermissioned = await checkBackgroundLocationPermission();
      console.log('isPermissioned', isPermissioned);

      if (isPermissioned) {
        await BackgroundActions.start((taskData) => task(taskData, setLocation), options);
      } else {
        setIsRunning(false); // Ensure task is not started if permission is denied
      }
    } catch (e) {
      console.log('error--', e);
      Alert.alert('Error', 'Failed to start background task');
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

  return (
    <View style={styles.container}>
      <Button
        title={isRunning ? 'Stop Background Task' : 'Start Background Task'}
        onPress={isRunning ? stopBackgroundTask : startBackgroundTask}
        style={{marginTop:"red"}}
      />
      {isBackgroundPermissioned ? (
        <BackgroundLocationComponent />

      ) : null}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="Your Location" />
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 400, // Adjust the height as needed
    marginTop: 20,
  },
});

export default GoogleMapWithBGTracking;
