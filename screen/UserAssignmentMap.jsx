import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { devURL } from '../constants/endpoints';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLocation from '../hooks/useLocation';
import Goback from '../components/GoBack';
import Loader from '../components/Loader';

import { Alert, Linking } from 'react-native';
import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import { getDistanceFromLatLonInMeters } from '../services/util/distanceMatrix';
import { updateLocationIfNeeded_bg } from '../services/coreTracking';
import useFetchMember from '../hooks/useFetchMember';

function UserAssignmentMap({ navigation, item }) {
  const options = {
    taskName: 'Background API Task',
    taskTitle: 'Performing background API calls',
    taskDesc: 'Fetching data from the API',
    color: '#ff00ff',
    taskIcon: {
      name: 'ic_launcher_round',
      type: 'mipmap',
      package: 'com.app',
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
      delay: 3000, // 1 minutes in milliseconds
    },
    type: BackgroundActions.TYPE_FOREGROUND,
  };



  const route = useRoute();

  const { taskId } = route.params; // Getting taskId from the route params
  const { memberId } = route.params; // Getting taskId from the route params
  
  console.log(';route.params',route.params);
  
  
  
  const [isRunning, setIsRunning] = useState(false);
  const [stateApp, setStateApp] = useState('');
  const [isAnyAssignmentUpdated, setIsAnyAssignmentUpdated] = useState(false);

  const { location, error, getCurrentLocation } = useLocation();
  const [userLocation, setUserLocation] = useState(location);
  const [taskLocation, setTaskLocation] = useState(null);
  const [assignmentData, setAssignmentData] = useState(null);
  const [region, setRegion] = useState({
    latitude: 21.7679, // Default to the center of India
    longitude: 78.8718,
    latitudeDelta: 10.0, // Default zoom level
    longitudeDelta: 10.0,
  });

  const { memberProfile, fetchMemberProfile } = useFetchMember();

  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [memberProfile, fetchMemberProfile]);









  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  const fetchData = async () => {
    try {
      // Retrieve the JWT token from AsyncStorage
      const jwtToken = await AsyncStorage.getItem('token');
      if (!jwtToken) {
        console.log('No JWT token found');
        return;
      }

      // API call to fetch task location data
      const response = await axios.get(`${devURL}/user/members/assignments/${taskId}/${memberId}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200 && response.data.assignment.length > 0) {
        const assignment = response.data.assignment[0];

        const taskCoordinates = {
          latitude: assignment.coordinates.lat,
          longitude: assignment.coordinates.lng,
        };
        setTaskLocation(taskCoordinates);
        setAssignmentData(assignment);

        // Update the region to focus on the task location
        setRegion({
          ...taskCoordinates,
          latitudeDelta: 0.02, // Zoom level for closer view
          longitudeDelta: 0.02,
        });
      }
    } catch (error) {
      console.error('Error fetching assignment data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [taskId]);

  useEffect(() => {
    if (location) {
      // Update the region to focus on the user's location when available
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02, // Zoom level for closer view
        longitudeDelta: 0.02,
      });
    }
  }, [location]);



  const handleBgAssignmentAction = async () => {
    // Check if the user has background location access
    const hasBgLocationAccess = await checkLocationPermission();
    console.log('permission hai ? -------------------', hasBgLocationAccess);

    if (!hasBgLocationAccess) {
      Alert.alert(
        'Permission Required',
        'You need to grant background location access to proceed.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Go to Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }
    BackgroundActions.start(task, options)
      .then(async () => {
        await AsyncStorage.setItem('isRunning', 'true'); // Save the state

        setIsRunning(true);
      })
      .catch(err => console.error('Error starting background task:', err));

    // Fetch assignments
    const memberId = '67722da24f2f69ad7d15d391'; // Replace with actual member ID
    const assignments = await fetchAssignments(memberId);

    // Fetch and store assignments
    await fetchAndStoreAssignments(assignments);

    // Get the current state (isRunning) from AsyncStorage

    // Start background task if not already running
    // if (!isRunning) {
    //   setIsRunning(true);
    //   await task({ delay: 10000 }, setLocation); // Pass any necessary data (taskData)
    // }
  };
  useEffect(() => {
    // Call getState when the component mounts
    getState();
  }, []);

  const checkLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS); // Use LOCATION_WHEN_IN_USE for foreground
        if (permissionStatus === RESULTS.GRANTED) {
          return true;
        } else if (permissionStatus === RESULTS.DENIED) {
          // Handle denied permission
          console.log('Location permission denied');
          return false;
        }
      } else if (Platform.OS === 'android') {
        const permissionStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log('permissionStatus', permissionStatus);

        if (permissionStatus) {
          return true;
        } else {
          console.log('Location permission denied');
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  };
  const fetchAssignments = async (memberId) => {
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - 3))
      .toISOString()
      .split('T')[0];
    const endDate = new Date(today.setDate(today.getDate() + 4))
      .toISOString()
      .split('T')[0];

    const jwtToken = await AsyncStorage.getItem('token');

    const response = await axios.get(
      `${devURL}/assignment/member/${startDate}/${endDate}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    return response?.data?.member?.tasks || [];
  };

  const fetchAndStoreAssignments = async (assignments) => {
    try {
      const assignmentsData = assignments?.map(item => ({
        id: item.taskId,
        coordinates: [item.location.lat, item.location.lng],
        status: item.status,
      }));

      await AsyncStorage.setItem('assignments', JSON.stringify(assignmentsData));
      console.log('Assignments stored in AsyncStorage');
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const getState = async () => {
    try {
      const state = await AsyncStorage.getItem('isRunning');
      console.log('Fetched state:', state);

      const isRunningState = state === 'true';
      console.log('isRunningState:', isRunningState);
      setIsRunning(isRunningState);
      setStateApp(state);
      console.log('Updated isRunning:', isRunningState);
    } catch (error) {
      console.error('Error fetching state:', error);
    }
  };


  
  const updateAssignmentStatus = async (
    assignmentId,
    prevStatus,
    statusToBeAdded,
  ) => {
    try {
      // console.log(
      //   'updateAssignmentStatus  ==== -------',
      //   assignmentId,
      //   prevStatus,
      //   statusToBeAdded,
      // );

      // Check if the status is already completed
      if (prevStatus === 'completed') {
        console.log(
          `Assignment ${assignmentId} is already completed. No API call needed.`,
        );
        return; // Exit the function early
      }

      const jwtToken = await AsyncStorage.getItem('token');
      // setIsAnyAssignmentUpdated(false)
      const response = await axios.patch(
        `${devURL}/assignment/member`,
        {
          taskId: assignmentId,
          status: statusToBeAdded,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log('response__________', response.status);
      console.log(
        `Updating assignment ${assignmentId} status to ${statusToBeAdded}`,
      );
      setIsAnyAssignmentUpdated(false);
    } catch (error) {
      console.error('Error updating assignment status:', error);
    }
  };

  const task = async (taskData, setLocation) => {
    console.log('Background task is running...');
    while (BackgroundActions.isRunning()) {
      try {
        setIsAnyAssignmentUpdated(false);

        // Fetch the current location once
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });

        console.log('Fetched location:', location.latitude, location.longitude);

        // Handle assignments and check radius
        const storedAssignments = await AsyncStorage.getItem('assignments');
        if (storedAssignments) {
          const assignments = JSON.parse(storedAssignments);

          for (const assignment of assignments) {
            const isInRadius = checkIfInRadius(location, assignment.coordinates);
            if (isInRadius) {
              await updateAssignmentStatus(assignment.id, assignment.status, 'completed');
            }
          }
        } else {
          console.log('No assignments found in AsyncStorage');
        }

        // Update location logic
        await updateLocationIfNeeded_bg(location.latitude, location.longitude, memberProfile?.location?.coordinates);

        // setLocation({
        //   latitude: location.latitude,
        //   longitude: location.longitude,
        // });

        // Send live update to server
        const response = await fetch(`${devURL}/member/profile/live-update`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        });
        const data = await response.json();
        console.log('Background API response:', data.message);
      } catch (error) {
        console.error('Error in background task:', error);
      }

      await sleep(taskData.delay);
    }
  };

  const checkIfInRadius = (locationLive, assignmentCoordinates) => {
    const radius = 100; // Desired radius in meters

    const distance = getDistanceFromLatLonInMeters(
      locationLive.latitude,
      locationLive.longitude,
      assignmentCoordinates[0],
      assignmentCoordinates[1]
    );

    return distance <= radius;
  };

  // Utility function to sleep for a specified time
  const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));




  const stopBackgroundTask = async () => {
    try {
      await BackgroundActions.stop();
      await AsyncStorage.setItem('isRunning', 'false');
      setIsRunning(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to stop background task');
    }
  };


  // console.log('_____________ isRunning _____________', isRunning);



  return (
    <SafeAreaView style={styles.container}>
      <Goback />
      {location && assignmentData ? (
        <MapView
          style={styles.map}
          region={region} // Use the dynamic region state
        >
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
          />
          {taskLocation && <Marker coordinate={taskLocation} title="Task Location" />}
          {location && taskLocation && (
            <Polyline
              coordinates={[location, taskLocation]}
              strokeColor="blue"
              strokeWidth={4}
            />
          )}
        </MapView>
      ) : (
        <Loader />
      )}

      {/* Info Box */}
      {assignmentData && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Task Details</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>⏰ Time:</Text>
            <Text style={styles.infoText}>{assignmentData.time}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📅 Assigned At:</Text>
            <Text style={styles.infoText}>{new Date(assignmentData.assignedAt).toLocaleString()}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>🔄 Status:</Text>
            <Text style={styles.infoText}>{assignmentData.status}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📍 Event Name:</Text>
            <Text style={styles.infoText}>{assignmentData.locationName}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionBox}>
        <TouchableOpacity
          onPress={isRunning ? stopBackgroundTask : handleBgAssignmentAction}
          style={isRunning ? styles.actionStopButton : styles.actionButton}>
          <Text style={styles.actionButtonText}>{isRunning ? 'Stop Journey' : "Start Journey"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={assignmentData?.status == 'pending' ? styles.actionButton : styles.actionMarkedCompleteButton}>
          <Text style={styles.actionButtonText}>{assignmentData?.status == 'pending' ? 'Set as Completed' : 'Task Completed'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.mapText}>{assignmentData?.eventName}</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: '50%',
    width: '100%',
  },
  // Info Box Styles
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },

  // Action Buttons Styles
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  actionMarkedCompleteButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  actionStopButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '45%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },


  // Text Container Styles
  textContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007BFF',
    textAlign: 'center',
  },
});


export default UserAssignmentMap;
