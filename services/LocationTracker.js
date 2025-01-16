import React, { useCallback, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import { updateLocationIfNeeded_bg } from './coreTracking';
import useFetchMember from '../hooks/useFetchMember';

const LocationTracker = () => {

    const { memberProfile, fetchMemberProfile } = useFetchMember();

    useEffect(() => {
      if (!memberProfile) {
        fetchMemberProfile();
      }
    }, [memberProfile, fetchMemberProfile]);
  

console.log('memberProfile)____',            memberProfile?.location?.coordinates);

  const taskName = 'LocationTracker';
  const taskOptions = {
    taskName,
    taskTitle: 'DigiCare4u Location Tracker',
    taskDesc: 'Tracking your location in the background',
    taskIcon: {
        name: 'ic_launcher_round',
        type: 'mipmap',
        package: 'com.app',
      },
    color: '#FF5733', // Notification icon color
    linkingURI: 'digicare4u://tracking', // Deep link (optional)
    parameters: {
      delay: 2000, // Location fetch interval in milliseconds
    },
     // Add this flag to indicate long-running service
  type: BackgroundActions.TYPE_FOREGROUND,
  };

  // Function to fetch location and send to the backend
  const trackLocation = async (taskData) => {
    try {
      while (BackgroundActions.isRunning()) {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 45000,
        });
        console.log(`________________ FETCHED after ${((taskOptions.parameters.delay)/60000)*60} seconds _____________________________:`, location?.accuracy);

        await updateLocationIfNeeded_bg(
            location?.latitude,
            location?.longitude,
            memberProfile?.location?.coordinates
          )
        
        // Send location to your backend
        // await fetch('https://your-backend-url.com/api/location', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     latitude: location.latitude,
        //     longitude: location.longitude,
        //     timestamp: new Date().toISOString(),
        //   }),
        // });

        // Wait for the specified delay before fetching again
        await new Promise((resolve) => setTimeout(resolve, taskData.delay));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  // Start the background task
  const startTracking = useCallback(async () => {
    try {
      await BackgroundActions.start(trackLocation, taskOptions);
      console.log('Location tracking started.');
    } catch (error) {
      console.error('Error starting background service:', error);
    }
  }, []);

  // Stop the background task
  const stopTracking = useCallback(async () => {
    try {
      await BackgroundActions.stop();
      console.log('Location tracking stopped.');
    } catch (error) {
      console.error('Error stopping background service:', error);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>DigiCare4u Tracker</Text>
      <Button title="Start Tracking" onPress={startTracking} />
      <Button title="Stop Tracking" onPress={stopTracking} style={{ marginTop: 10 }} />
    </View>
  );
};

export default LocationTracker;
