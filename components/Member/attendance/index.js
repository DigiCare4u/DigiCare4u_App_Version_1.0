import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getDistanceFromLatLonInMeters } from '../../../services/distanceMatrix';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../../constants/endpoints';
import useLocation from '../../../hooks/useLocation';
import Loader from '../../Loader';


const LiveAttendance = () => {


  const [alreadyMarked, setAlreadyMarked] = useState(false);

  const [isAtParentLocation, setIsAtParentLocation] = useState(false);
  const [membersParentDetails, setMembersParentDetails] = useState([]);
  const [membersParentId, setMembersParentId] = useState('');
  const [loading, setLoading] = useState(true);


  

  const { location, getCurrentLocation } = useLocation()

  useEffect(() => {
    if (!location) {

      getCurrentLocation();
    }
  }, [getCurrentLocation]);
  const [proximityResults, setProximityResults] = useState({});

  const PROXIMITY_RADIUS = 100; // Proximity radius in meters

  const fetchMemberParentDetails = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/member/parent`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });


      const parentLocations = response?.data?.data?.parentUser?.location?.coordinates

      setMembersParentId(response?.data?.data?.parentUser?._id)
      setMembersParentDetails(parentLocations);
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to members parent.');
    } finally {
      setLoading(false);
    }
  };


  const markAttendance = async () => {
    try {
      console.log('Attempting to mark attendance...');

      // Retrieve the JWT token from AsyncStorage
      const jwtToken = await AsyncStorage.getItem('token');

      if (!jwtToken) {
        console.error('JWT token is missing');
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Make the API call
      const response = await axios.post(
        `${devURL}/member/attendance`, // URL
        { // Request body (data)
          // memberId: "60c72b2f9b1e8d1f4f3c8b2b", // ID of the member
          parentId: membersParentId, // ID of the user (parent) who is tracking the member
          latitude: location?.latitude, // Latitude at the time of punch-in
          longitude: location?.longitude// Longitude at the time of punch-in
        },
        { // Request headers
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` // Pass the token for authentication
          }
        }
      );
      setAlreadyMarked(false)
      console.log('Attendance marked successfully:', response.data);
      setAlreadyMarked(true)
      return response.data; // Return the response data for further processing
    } catch (error) {
      // Handle API or other errors
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        const serverMessage = error.response.data.message;

        if (serverMessage === 'Attendance already marked for today.') {
          console.log(serverMessage);
          setAlreadyMarked(true)
          return { alreadyMarked_: true, message: serverMessage };
        }

        console.error('Server response:', error.response.data);
        throw new Error(serverMessage || 'Failed to mark attendance.');
      } else if (error.request) {
        // Request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your network connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
  };










  const checkProximity = (memberLocation) => {
    const distance = getDistanceFromLatLonInMeters(
      location?.latitude,
      location?.longitude,
      memberLocation[0],
      memberLocation[1]
    );
    setProximityResults(distance)
    return distance <= PROXIMITY_RADIUS;
  };

  useEffect(() => {
    if (location) {

      fetchMemberParentDetails();
    }
  }, [location]);
  useEffect(() => {
    if (membersParentDetails && location) {

      checkProximity(membersParentDetails)


    }
  }, [membersParentDetails, location]);
  useEffect(() => {
    if (proximityResults <= PROXIMITY_RADIUS) {

      setIsAtParentLocation(true)
      markAttendance()



    }
  }, [proximityResults]);
  useEffect(() => {

  }, [alreadyMarked])

  //=============================

  // console.log('proximityResults', proximityResults, isAtParentLocation, location.accuracy);

  return (
    <View style={styles.container}>
      {isAtParentLocation ? (
        <>
          <Text style={styles.headerText}>Live Attendance</Text>
          <View style={styles.attendanceCard}>
            {alreadyMarked ? (
              <>
                <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
                <Text style={styles.attendanceText}>Member Present 🙋🏻‍♂️</Text>
                <Text style={styles.attendanceSubText}>Attendance already marked for today.</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="cancel" size={48} color="#F44336" />
                <Text style={styles.attendanceText}>Member is Away ❗</Text>
                <Text style={styles.attendanceSubText}>No attendance recorded yet.</Text>
              </>
            )}
          </View>

        </>

      ) : (
        <Loader />
      )}
    </View>
  );
};

export default LiveAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#376ADA',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  attendanceCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  attendanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  attendanceSubText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },

});
