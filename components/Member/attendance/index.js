import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useLocation from '../../../hooks/useLocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../../constants/endpoints';

const LiveAttendance = () => {
  const [doesMemberParentUserHasGeoFencing, setDoesMemberParentUserHasGeoFencing] = useState(false);
  const [doesMemberHasDailyAssignment, setDoesMemberHasDailyAssignment] = useState(false);
  const [memberHasDailyAssignment, setMemberHasDailyAssignment] = useState([]);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState({});
  const [MembersParentId, setMembersParentId] = useState('');
  const [isAtParentLocation, setIsAtParentLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0)); // For smooth fade-in animation

  const { location, getCurrentLocation } = useLocation();

  useEffect(() => {
    if (!location) {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  const fetchMemberParentDetails_ = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/member/parent`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const parentLocations = response?.data?.data?.parentUser?.geoFenced?.coordinates;
      setDoesMemberParentUserHasGeoFencing(parentLocations?.length > 0);
      setMembersParentId(response?.data?.data?.parentUser?._id);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to fetch parent details.');
    } finally {
      setLoading(false);
    }
  };
  const fetchMemberParentDetails = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');

      // Fetch parent details first
      const response = await axios.get(`${devURL}/member/parent`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const parentLocations = response?.data?.data?.parentUser?.geoFenced?.coordinates;
      setDoesMemberParentUserHasGeoFencing(parentLocations?.length > 0);
      setMembersParentId(response?.data?.data?.parentUser?._id);

      // Now fetch the daily assignments for the member
      const assignmentsResponse = await axios.post(`${devURL}/assignment/member/daily`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      // console.log('assignmentsResponse___________----->', assignmentsResponse.data.data);

      // Check if the daily assignments data exists and has any tasks
      if (assignmentsResponse.data.data.length > 0) {
        setDoesMemberHasDailyAssignment(true)
        setMemberHasDailyAssignment(assignmentsResponse?.data?.data[0])
        // If there are daily assignments, perform necessary actions (e.g., update state)
        // console.log('Daily assignments found:', assignmentsResponse?.data?.member);
        // Add further logic here to process the assignments if needed
      } else {
        setDoesMemberHasDailyAssignment(false)
        // If no daily assignments are found, you can handle accordingly
        console.log('No daily assignments found.');
      }
    } catch (error) {
      console.log(error);
      // Alert.alert('Error', 'Failed to fetch parent details or daily assignments.');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (location) {
      fetchMemberParentDetails();
      isWithinParentGeoFenced();
    }
  }, [location]);

  const markAttendance = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${devURL}/member/attendance`,
        {
          parentId: MembersParentId,
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setAlreadyMarked(response?.data?.alreadyMarked);
      setExistingAttendance(response?.data?.existingAttendance);
    } catch (error) {
      console.error(error.message);
    }
  };

  const isWithinParentGeoFenced = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${devURL}/member/parent/is-within-geo-fenced/${location?.latitude}/${location?.longitude}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setIsAtParentLocation(response?.data?.withinRange);
    } catch (error) {
      Alert.alert('Error', 'Failed to check geo-fence status.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (location) isWithinParentGeoFenced();
  // }, [location]);

  useEffect(() => {
    if (isAtParentLocation && MembersParentId) markAttendance();
  }, [isAtParentLocation, MembersParentId]);

  useEffect(() => {
    // Fade-in animation when location status changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isAtParentLocation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Checking location...</Text>
      </View>
    );
  }

  // if (!doesMemberParentUserHasGeoFencing ) {
  if (!doesMemberHasDailyAssignment) {
    return (
      <View style={styles.container}>
        <View style={styles.alertCard}>
          <MaterialIcons name="error" size={48} color="#FF4C4C" />
          <Text style={styles.alertText}>
            🚨 Your parent has no geofencing set up. 🚨







          </Text>
        </View>
      </View>
    );
  }
  // console.log('memberHasDailyAssignment------->', memberHasDailyAssignment);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        <Text style={styles.headerText}>Live Attendance</Text>
        {isAtParentLocation ? (
          <View style={styles.attendanceCard}>
            {alreadyMarked ? (
              <>
                <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
                <Text style={styles.attendanceText}>You're Present 🙋🏻‍♂️</Text>
                <Text style={styles.attendanceSubText}>
                  Attendance already marked for today.
                </Text>

                <View style={styles.taskCard}>

                  <MaterialIcons name="event" size={48} color="#4CAF50" />
                  <Text style={styles.taskHeader}>GeoFenced Assignment</Text>
                  <View style={styles.taskDetail}>
                    {/* <Text style={styles.taskLabel}>Location:</Text> */}
                    <Text style={styles.taskValue}>
                      {memberHasDailyAssignment?.tasks[0]?.locationName}
                    </Text>
                  </View>
                  <View >
                    {/* <Text style={styles.taskLabel}>Time:</Text> */}
                    <Text style={styles.taskValue}>
                      Scheduled Time :{memberHasDailyAssignment?.tasks[0]?.time}
                    </Text>
                  </View>
                  {/* <View style={styles.taskDetail}>
                    <Text style={styles.taskLabel}>Event Name:</Text>
                    <Text style={styles.taskValue}>
                      {memberHasDailyAssignment?.tasks[0]?.eventName}
                    </Text>
                  </View> */}

                  <View style={styles.taskDetail}>
                    {/* <Text style={styles.taskLabel}>Date:</Text> */}
                    <Text style={styles.taskValue}>
                      {existingAttendance?.punchInTime && memberHasDailyAssignment?.tasks[0]?.time
                        ? (() => {
                          const punchInDateTime = new Date(existingAttendance.punchInTime);
                          console.log('punchInDateTime', punchInDateTime);

                          // Extract the date part from punchInDateTime
                          const punchInDate = punchInDateTime.toISOString().split('T')[0];
                          console.log('punchInDate', punchInDate);

                          // Combine the date part with the task time
                          const assignedTaskDateTime = new Date(`${punchInDate} ${memberHasDailyAssignment.tasks[0].time}`);
                          console.log('assignedTaskDateTime', assignedTaskDateTime);

                          const timeDifference = punchInDateTime - assignedTaskDateTime; // Difference in milliseconds

                          const hours = Math.floor(Math.abs(timeDifference) / (1000 * 60 * 60));
                          const minutes = Math.floor((Math.abs(timeDifference) % (1000 * 60 * 60)) / (1000 * 60));
                          const sign = timeDifference < 0 ? '-' : '+';

                          return `Difference: ${sign}${hours}h ${minutes}m`;
                        })()
                        : 'No time data available'}
                    </Text>

                  </View>

                </View>


              </>
            ) : (
              <>
                <MaterialIcons name="hourglass-empty" size={48} color="#FF9800" />
                <Text style={styles.attendanceText}>Marking Attendance...</Text>
              </>
            )}
          </View>
        ) : (
          <View style={styles.alertCard}>
            <MaterialIcons name="error" size={48} color="#FF4C4C" />
            <Text style={styles.alertText}>
              🚨 You're away from the parent location 🚨
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default LiveAttendance;

// Add the styles as is from your code


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#376ADA',
    marginBottom: 20,
  },
  attendanceCard: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  attendanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  attendanceSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#FFECEC',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  alertText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF4C4C',
    marginVertical: 10,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 15,
  },
  taskHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 10,
  },
  taskDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  taskLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555',
  },
});
