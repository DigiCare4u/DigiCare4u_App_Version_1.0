import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BackgroundActions from 'react-native-background-actions';
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import { devURL } from '../constants/endpoints';
import { updateLocationIfNeeded_bg } from './coreTracking';
import { getDistanceFromLatLonInMeters } from './util/distanceMatrix';
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import useFetchMember from '../hooks/useFetchMember';
 
// Dummy data for testing
const fetchAssignments = async (memberId) => {
  const today = new Date();
  const startDate = new Date(today.setDate(today.getDate() - 3)).toISOString().split('T')[0];
  // const endDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(today.setDate(today.getDate() + 4)).toISOString().split('T')[0];
 
  const jwtToken = await AsyncStorage.getItem('token');
 
 
 
 
  const response = await axios.get(
    `${devURL}/assignment/member/${startDate}/${endDate}`,
 
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  );
 
  // console.log('data_______________________',response.data.member.tasks);
 
 
  // const response = await fetch(`${devURL}/assignment/member/${startDate}/${endDate}`);
  // const data = await response.json();
  const data = response?.data?.member?.tasks;
 
 
 
  return data;
};
 
 
 
 
 
 
const checkIfInRadius = (assignmentCoordinates) => {
  // console.log('assignmentddddddddddddddddddd', assignmentCoordinates);
 
  const currentLocation = { lat: 26.855273, lon: 81.056825 }; // Replace with actual current coordinates
  const radius = 20000; // Set your desired radius in meters
  const distance = getDistanceFromLatLonInMeters(currentLocation.lat, currentLocation.lon, assignmentCoordinates[0], assignmentCoordinates[1]);
 
  // console.log('----- distance', distance);
 
 
  return distance <= radius;
};
 
const updateAssignmentStatus = async (assignmentId, prevStatus, statusToBeAdded) => {
  try {
    console.log('updateAssignmentStatus  ==== -------', assignmentId, prevStatus, statusToBeAdded);
 
    // Check if the status is already completed
    if (prevStatus === 'completed') {
      console.log(`Assignment ${assignmentId} is already completed. No API call needed.`);
      return; // Exit the function early
    }
 
    const jwtToken = await AsyncStorage.getItem('token');
 
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
      }
    );
 
    console.log('response__________', response.status);
    console.log(`Updating assignment ${assignmentId} status to ${statusToBeAdded}`);
  } catch (error) {
    console.error('Error updating assignment status:', error);
  }
};
 
const startBackgroundAction = async () => {
  try {
    const storedAssignments = await AsyncStorage.getItem('assignments');
    console.log('assignments_________________', storedAssignments);
 
 
 
 
    if (storedAssignments) {
      const assignments = JSON.parse(storedAssignments);
      assignments.forEach(async (assignment) => {
 
 
 
        const isInRadius = checkIfInRadius(assignment.coordinates);
        console.log('isInRadius_________________', isInRadius);
        if (isInRadius) {
          await updateAssignmentStatus(assignment.id, assignment.status, 'completed');
        }
      });
 
 
 
 
    } else {
      console.log('No assignments found in AsyncStorage');
    }
  } catch (error) {
    console.error('Error starting background action:', error);
  }
};
 
const Bg_for_v1 = ({ isBgAccess }) => {
 
 
  //========================
  const fetchAndStoreAssignments = async () => {
    try {
      const assignments = await fetchAssignments();
      setAss(assignments)
 
      // console.log('assignments ------', assignments[0]);
 
      const assignmentsData = assignments?.map(item => ({
        id: item.taskId,
        coordinates: [item.location.lat, item.location.lng],
        status: item.status,
      }));
 
      // console.log('assignment Data_____________ ------', assignmentsData);
 
 
      await AsyncStorage.setItem('assignments', JSON.stringify(assignmentsData));
      console.log('Assignments stored in AsyncStorage');
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
 
  //========================
  const { memberProfile, fetchMemberProfile } = useFetchMember();
 
  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile();
    }
  }, [memberProfile, fetchMemberProfile]);
 
  //=======================
 
 
 
  const [isRunning, setIsRunning] = useState(false);
  const [ass, setAss] = useState(false);
  const [location, setLocation_] = useState(null);
  const mapRef = useRef(null);
 
 
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
 
  const task = async (taskData, setLocation) => {
    console.log('Background task is running...');
    while (BackgroundActions.isRunning()) {
      startBackgroundAction()
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        console.log('____ FETCHED ___________', location?.accuracy);
 
        await updateLocationIfNeeded_bg(
          location?.latitude,
          location?.longitude,
          memberProfile?.location?.coordinates
        );
 
        setLocation_({
          latitude: location.latitude,
          longitude: location.longitude,
        });
 
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
        console.error(error);
      }
 
      await sleep(taskData.delay);
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
        delay: 3000, // 15 minutes in milliseconds
 
      },
      type: BackgroundActions.TYPE_FOREGROUND,
 
 
    };
    BackgroundActions.start(task, options)
      .then(() => setIsRunning(true))
      .catch((err) => console.error('Error starting background task:', err));
  };
 
  useEffect(() => {
    if (!ass) {
 
      fetchAndStoreAssignments();
    }
  }, [fetchAndStoreAssignments]);
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignment Tracker</Text>
      <Text style={styles.text}>
        Fetch assignments, store in AsyncStorage, and start the background action to check if a member has arrived at the location.
      </Text>
      <Button
        title={isRunning ? 'Tracking in Progress...' : 'Start Background Task'}
        onPress={startBackgroundTask}
        disabled={isRunning}
      />
      {location && (
        <MapView style={styles.map} ref={mapRef}>
          <Camera zoomLevel={12} centerCoordinate={[location.longitude, location.latitude]} />
          <MarkerView coordinate={[location.longitude, location.latitude]} />
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
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '70%',
  },
});
 
export default Bg_for_v1;