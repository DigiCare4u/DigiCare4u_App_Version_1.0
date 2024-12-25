import React, { useEffect, useRef, useState } from 'react';
import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import { PermissionsAndroid, Platform } from 'react-native';

const useBackgroundLocationTracking = () => {
  const [location, setLocation] = useState(null); // State to store the latest location
  const isFetchingLocation = useRef(false);

  // Request permissions for background location tracking
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: "DigiCare4u Location Permission",
            message:
              "DigiCare4u needs access to your location " +
              "so we can track your position in the background.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permissions are handled automatically
  };

  // Step 1: Define the location fetching function
  const fetchLocation = async () => {
    if (isFetchingLocation.current) return; // Prevent overlapping requests
    isFetchingLocation.current = true;

    try {
      const locationData = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      console.log("Fetched Location:", locationData);
      setLocation(locationData); // Update location state

      return locationData;
    } catch (error) {
      console.error("Error fetching location in background:", error);
    } finally {
      isFetchingLocation.current = false;
    }
  };

  // Step 2: Define the background task with a controlled delay
  const backgroundTask = async (taskData) => {
    const { delay } = taskData;

    while (BackgroundActions.isRunning()) {
      await fetchLocation();
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  // Step 3: Configure background options
  const options = {
    taskName: 'DigiCare4u Location Tracking',
    taskTitle: 'DigiCare4u Location Tracking',
    taskDesc: 'Tracking user location in the background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
      delay: 60000, // Interval in milliseconds
    },
    notifications: {
      silent: false,
    },
  };


  const someTask = ()=>{
    console.log('someTask ...');
    
  }
  
  // Step 4: Start the background task inside useEffect
  const startBackgroundLocationTracking = async () => {
    const permissionGranted = await requestLocationPermission();
    console.log('permissionGranted :',permissionGranted);
    
    if (permissionGranted) {
      try {
        await BackgroundActions.start(backgroundTask, options);
      } catch (error) {
        console.error("Failed to start background task:", error);
      }
    } else {
      console.warn("Background location permission not granted");
    }
  };



  useEffect(() => {
      const intervalId = setInterval(() => {

      // startbgAction();
      startBackgroundLocationTracking();
      // someTask()
    }, 1000);


    // return () => {
    //   BackgroundActions.stop().catch((error) =>
    //     console.error("Failed to stop background task:", error)
    //   );
    // };
  }, []);

  // Return the latest location to be used in components
  return location;
};

export default useBackgroundLocationTracking;
