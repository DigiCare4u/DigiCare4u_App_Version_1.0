import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import useFetchMember from '../hooks/useFetchMember';

const options = {
  taskName: 'Location Logging',
  taskTitle: 'Logging location in the background',
  taskDesc: 'Tracking your location for updates',
  taskIcon: {
    name: 'ic_launcher_round',
    type: 'mipmap',
    package: 'com.app',
  },
  parameters: {
    delay: 2000, // 10 seconds for demonstration
  },
};

const Bg_for_v2 = ({ isBgAccess }) => {
  //===========================================
  const { memberProfile, fetchMemberProfile } = useFetchMember()
  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [memberProfile, fetchMemberProfile]);
  let memberLastLocationCoordinates = memberProfile?.location?.coordinates
  // console.log('memberLastLocationCoordinates', memberLastLocationCoordinates);

  //===========================================




  const [isRunning, setIsRunning] = useState(false);

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const logLocationTask = async (taskData) => {
    console.log('Background task is running...');
    while (BackgroundActions.isRunning()) {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 45000,
        });
        console.log(`logged after ${options.parameters.delay} `, location.latitude, location.longitude);

        // // Simulate API call for logging
        // await fetch('https://example.com/log-location', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     latitude: location.latitude,
        //     longitude: location.longitude,
        //   }),
        // });

        // console.log('Location logged to server successfully');
      } catch (error) {
        console.error('Error logging location:', error);
      }

      await sleep(taskData.delay);
    }
  };

  const requestBackgroundPermission = async () => {
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
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const checkBackgroundPermission = async () => {
    if (!isBgAccess) {
      return true;
    }

    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
    if (!granted) {
      return await requestBackgroundPermission();
    }
    return true;
  };

  const startBackgroundTask = async () => {
    if (!isBgAccess) {
      Alert.alert('Background access is disabled', 'Enable background access to start tracking.');
      return;
    }

    if (isRunning) {
      Alert.alert('Task already running', 'Stop the current task first.');
      return;
    }



    try {
      setIsRunning(true);
      await BackgroundActions.start(logLocationTask, options);
    } catch (error) {
      console.error('Error starting background task:', error);
      setIsRunning(false);
      Alert.alert('Error', 'Failed to start background task.');
    }
  };

  const stopBackgroundTask = async () => {
    try {
      await BackgroundActions.stop();
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping background task:', error);
      Alert.alert('Error', 'Failed to stop background task.');
    }
  };

  useEffect(() => {
    checkBackgroundPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={isRunning ? 'Stop Logging' : 'Start Logging'}
        onPress={isRunning ? stopBackgroundTask : startBackgroundTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Bg_for_v2;
