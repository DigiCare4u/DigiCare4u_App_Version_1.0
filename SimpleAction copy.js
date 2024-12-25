import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import BackgroundActions from 'react-native-background-actions';

import GetLocation from 'react-native-get-location';
import MapView, { Marker } from 'react-native-maps';
import { devURL } from './constants/endpoints';
import useFetchMember from './hooks/useFetchMember';
import { updateLocationIfNeeded } from './services/coreTracking';


const SimpleAction_new = () => {
  const { memberProfile, fetchMemberProfile } = useFetchMember()

  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [ fetchMemberProfile]);


  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState(null);

  const requestBackgroundLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, {
        title: 'Background Location Permission',
        message: 'This app needs access to your location in the background.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Background location permission granted');
      } else {
        console.log('Background location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const checkBackgroundLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
      if (granted) {
        console.log('Background location permission is granted');
        return true;
      } else {
        console.log('Background location permission is denied');
        await requestBackgroundLocationPermission();
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  const task = async (taskData, setLocation) => {
    console.log(' Task chalaa .........--------------------------------- ...');
    
    while (BackgroundActions.isRunning()) {
      // Perform API call here
      console.log(' inside while                           ...');
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 45000,
        });
        console.log('------- location ------------', location?.latitude);
        // console.log('------- xxxx------------', memberProfile?.location?.coordinates);

        // Update location in the state
        setLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        if (location) {

          // console.log('------- Before------------');
          updateLocationIfNeeded(
            location?.latitude, location?.longitude,
            memberProfile?.location?.coordinates)

        }
        // console.log('------- After------------');
        // const response = await fetch(`${devURL}/member/profile/live-update`, {
        //   method: 'PATCH',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     latitude: location.latitude,
        //     longitude: location.longitude,
        //   }),
        // });

        // const data = await response.json();
        // console.log('Background API response:', data.message);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        console.error('Background API error:', error);
      }

      await sleep(taskData.delay);
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
      await BackgroundActions.start((taskData) => task(taskData, setLocation), options);
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

  useEffect(() => {
    checkBackgroundLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background Task Example</Text>
      <Button
        title={isRunning ? 'Stop Background Task' : 'Start Background Task'}
        onPress={isRunning ? stopBackgroundTask : startBackgroundTask}
      />
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

export default SimpleAction_new;
