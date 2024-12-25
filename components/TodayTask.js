import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { devURL } from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistanceFromLatLonInMeters } from '../services/util/distanceMatrix';
import useLocation from '../hooks/useLocation';

const TodayTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [currentProximity, setCurrentProximity] = useState(null);


  // console.log('currentProximity', currentProximity);

  const { location, getCurrentLocation } = useLocation()


  console.log('location========', location)

  useEffect(() => {
    if (!location) {

      getCurrentLocation();
    }
  }, [getCurrentLocation]);



  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/assign/location`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setTasks(response.data?.assignedLocations || []);
    } catch (err) {
      setError('Failed to fetch tasks.');
      Alert.alert('Error', 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  // const [tasks, setTasks] = useState(initialTasks);

  const PROXIMITY_RADIUS = 100; // Proximity radius in meters
  // const updateTaskInState = (updatedTask) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task._id === updatedTask._id ? updatedTask : task
  //     )
  //   );
  // };
  const calculateProximity = async (task) => {
    try {
      const distance = await getDistanceFromLatLonInMeters(
        location?.latitude,
        location?.longitude,
        task.coordinates?.lat,
        task.coordinates?.lng
      );

      setCurrentProximity(distance);

      // Check if the task is within proximity radius
      if (distance <= PROXIMITY_RADIUS) {
        // Update task status to "completed" via API
        const jwtToken = await AsyncStorage.getItem('token');
        const response = await axios.patch(
          `${devURL}/assign/location`, // Adjust the endpoint as per your API
          {
            status: 'completed',
            taskId: task?._id
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        // Dynamically update the task status in UI
        // const updatedTask = { ...task, status: 'completed' };
        // updateTaskInState(updatedTask); // Function to update the task in local state or global store
      }

      return distance;
    } catch (error) {
      console.error('Error calculating proximity or updating task:', error);
      throw error; // Optionally rethrow the error for upstream handling
    }
  };



  // Handle task status updates based on proximity
  const handleTaskStatus = async (task) => {
    const distance = await calculateProximity(task);
    if (distance <= 50) {
      // Example: Make an API call if the member is at the assigned location
      Alert.alert('You have arrived!', `Task: ${task.locationName}`);
      // Call your API here to mark the task as completed
    } else {
      Alert.alert(
        'Not Yet!',
        `You're ${Math.round(distance)} meters away from the assigned location.`
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderTaskStatus = (status) => {
    switch (status) {
      case 'Completed':
        return { label: 'Completed', color: '#25D366' };
      case 'Inactive':
        return { label: 'Inactive', color: '#FF5252' };
      case 'Pending':
        return { label: 'Pending', color: '#FFA500' };
      default:
        return { label: 'Unknown', color: '#000' };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Tasks</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#376ADA" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.accordionToggle}
        onPress={() => setAccordionOpen(!accordionOpen)}
      >
        <Text style={styles.accordionText}>
          {accordionOpen ? 'Hide Tasks' : 'Show Tasks'}
        </Text>
        <MaterialIcons
          name={accordionOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {accordionOpen &&
        tasks?.map((task) => {
          const { label, color } = renderTaskStatus(task.status);
          return (
            <View style={styles.taskCard} key={task._id}>
              <View style={styles.taskDetails}>
                <MaterialIcons name="location-on" size={24} color="#376ADA" />
                <View>
                  <Text style={styles.taskLocation}>{task.locationName}</Text>
                  <Text style={styles.taskTime}>
                    {new Date(task.assignedAt).toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={[styles.taskStatus, { backgroundColor: color }]}>
                <Text style={styles.taskStatusText}>{label}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkProximityButton}
                onPress={() => handleTaskStatus(task)}
              >
                <Text style={styles.buttonText}>Check Proximity</Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </ScrollView>
  );
};

export default TodayTask;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    padding: 15,
  },
  header: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#376ADA',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  accordionToggle: {
    backgroundColor: '#376ADA',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  accordionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  taskTime: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  taskStatus: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  taskStatusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  checkProximityButton: {
    marginTop: 10,
    backgroundColor: '#376ADA',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
