import React, { useState } from 'react';
import { View, Text, Button, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

// Example usage inside a component
const BackgroundLocationComponent = () => {
  const [casePermission, setCasePermision] = useState(false)

  const requestBackgroundLocationPermission = async () => {
    try {
      // Check foreground location permission first
      const foregroundStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('----------- foregroundStatus  --------------', foregroundStatus);
      const corseStatus = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      console.log('----------- corseStatus  --------------', corseStatus);

      if (foregroundStatus === RESULTS.DENIED) {
        // Request foreground location permission
        const foregroundGranted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (foregroundGranted !== RESULTS.GRANTED) {
          console.log('Foreground location permission denied');
          return false;
        }
      }

      // Now check and request background location permission
      const backgroundStatus = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);

      if (backgroundStatus === RESULTS.DENIED) {
        setCasePermision(false)
        const backgroundGranted = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);

        if (backgroundGranted === RESULTS.GRANTED) {
          setCasePermision(true)
          console.log('Background location permission granted');
          return true;
        } else if (backgroundGranted === RESULTS.BLOCKED) {
          console.log('Permission blocked. Asking to open settings.');
          Alert.alert(
            'Background Location Permission Denied',
            'The app requires background location access to track location. Please enable it in the app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
        }
      } else if (backgroundStatus === RESULTS.BLOCKED) {
        // Handle case where permission is permanently denied
        Alert.alert(
          'Background Location Permission Denied',
          'The app requires background location access. Please enable it in the settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else if (backgroundStatus === RESULTS.GRANTED) {
        console.log('Background location permission already granted');
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };


  return (
    <View>
      <Text>Request Background Location Permission</Text>
      {casePermission ? (
        <Button
          title="Request Permission"
          onPress={requestBackgroundLocationPermission}
        />
      ) : null}
    </View>
  );
};

export default BackgroundLocationComponent;