import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, PermissionsAndroid, Image } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";

import GetLocation from 'react-native-get-location';
import { devURL } from './constants/endpoints';
import { updateLocationIfNeeded, updateLocationIfNeeded_bg } from './services/coreTracking';
import useFetchMember from './hooks/useFetchMember';


const SimpleAction = () => {
  const { memberProfile, fetchMemberProfile } = useFetchMember()
  
  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [memberProfile, fetchMemberProfile]);
  
  
  //===============================
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const task = async (taskData, setLocation) => {
    console.log('Background task is running...');

    while (BackgroundActions.isRunning()) {
      // Perform API call here
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 45000,
        });
        // console.log('------- location ------------>', location.accuracy);
        updateLocationIfNeeded_bg(
          location?.latitude,
          location?.longitude,
          memberProfile?.location?.coordinates,
          // locationDetails
        )

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
        console.log('Background API response:', data.message);
      } catch (error) {
        console.error('Background API error', error);
      }

      await sleep(taskData.delay);
    }
  };
  //=================
  //================
  const mapRef = useRef(null);
  useEffect(() => {
    if (location) {
      mapRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [location]);

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

  const startBackgroundTask = async () => {
    if (isRunning) {
      Alert.alert("Tracking is already running", "Please stop the current task before starting a new one.");
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
      console.log('Error starting task:', e);
      Alert.alert('Error', 'Failed to start background task');
      setIsRunning(false); // Ensure state resets on failure
    }
  };


  // const startBackgroundTask = async () => {
  //   const options = {
  //     taskName: 'Background API Task',
  //     taskTitle: 'Performing background API calls',
  //     taskDesc: 'Fetching data from the API',
  //     color: '#ff00ff',
  //     taskIcon: {
  //       name: 'ic_launcher_round',
  //       type: 'mipmap',
  //       package: 'com.digicare'
  //     },
  //     actions: [
  //       {
  //         type: 'button',
  //         text: 'Stop Task',
  //         callback: () => stopBackgroundTask(),
  //       },
  //     ],
  //     parameters: {
  //       delay: 1000,
  //     },
  //   };

  //   try {
  //     setIsRunning(true);
  //     await BackgroundActions.start((taskData) => task(taskData, setLocation), options);
  //   } catch (e) {
  //     console.log('error--', e);
  //     Alert.alert('Error', 'Failed to start background task');
  //   }
  // };

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

  // console.log('------location[simlpeAction]------')
  // console.log(location)

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
            centerCoordinate={[location ? location.longitude : 0.0, location ? location.latitude : 0.0]}
          />
          <MarkerView
            allowOverlap={true}
            // key={index}
            coordinate={[
              location ? location?.longitude : 0.0, // longitude
              location ? location?.latitude : 0.0, // latitude
            ]}
          >
            <View>
              {/* <Button style={styles.markerTitle}
                title={`  accuracy : ${location?.accuracy}m`}
              /> */}
            </View>
            <View style={styles.customMarker}>
              {/* <MySvgComponent /> */}
              <Image
                source={require("./components/Assets/pin.jpg")}
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
    backgroundColor:"#fff",
    borderRadius:12,
    marginTop:10,
  },
  title: {
    fontSize: 22,
  },
  map: {
    width: '100%',
    height: 300, // Adjust the height as needed
    marginTop: 10,
    borderRadius:20,
  },
  memberImage:{
    height:40,
    width:40,
  }
});

export default SimpleAction;
