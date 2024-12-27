import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import useFetchUser from '../hooks/useFetchUser';
import MapSchedule from './MapSchedule';
import {devURL} from '../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateAndTimePicker from './TimeAndDatePicker';

const TaskSchedule = () => {
  const [selectedLocation, setSelectedLocationForAPI] = useState(null);

  const [query, setQuery] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {fetchUserMembersList, userMembersList} = useFetchUser();
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    fetchUserMembersList();
  }, []);

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const handleSelectMember = id => {
    setSelectedMemberId(id);
  };

  const handleAssignSchedule = async () => {
    console.log('handleAssignSchedule===', handleAssignSchedule);

    if (!query) {
      Alert.alert('Error', 'Please enter a location name.');
      return;
    }

    if (!selectedMemberId) {
      Alert.alert('Error', 'Please select a team member.');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }
    try {
      const payload = {
        locationName: query,
        memberId: selectedMemberId,
        date: date.toISOString(),
        coordinates: {
          lat: selectedLocation?.latitude,
          lng: selectedLocation?.longitude,
        },
      };

      console.log('Sending Payload:', payload);

      // Get the JWT token from AsyncStorage
      const jwtToken = await AsyncStorage.getItem('token');

      // Make the API call to assign the schedule
      const response = await axios.post(
        `${devURL}/assignment/location`,
        payload, // Send the payload directly, no need to wrap it in an object
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log('Response received _________:', response.status);

      // Handle success, show an alert with a success message
      Alert.alert(
        'Success',
        response.data.message || 'Schedule assigned successfully',
      );
    } catch (error) {
      console.log('error ___________',error);
      Alert.alert(
        'Success',
        error || 'Schedule assigned successfully',
      );
    }
  };

  // console.log('setDate-------- ----------------', date)

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#376ADA',
          fontSize: 20,
          fontWeight: '600',
          marginVertical: 10,
        }}>
        Task Schedule
      </Text>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapSchedule
          setSelectedLocationForAPI={setSelectedLocationForAPI}
          setQuery={setQuery}
        />
      </View>

      {/* Team Members - Horizontal Scroll */}
      <View style={styles.teamContainer}>
        <FlatList
          data={userMembersList}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => handleSelectMember(item._id)}
                style={[
                  styles.teamMember,
                  selectedMemberId === item._id && styles.selectedMember, // Highlight the selected item
                ]}>
                <Image
                  source={{
                    uri:
                      item.image ||
                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                  }}
                  style={styles.teamImage}
                />
                <Text style={styles.teamName}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <DateAndTimePicker />

      <View style={styles.bottomSection}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAssignSchedule}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                backgroundColor: '#376ADA',
                padding: 10,
                borderRadius: 7,
                fontSize: 14,
                fontWeight: '500',
              }}>
              Assign Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TaskSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    borderRadius: 10,
    marginBottom: 15,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    zIndex: 100,
  },
  teamMember: {
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 5,
    padding: 8,
  },
  teamImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  teamName: {
    fontSize: 10,
    textAlign: 'center',
    color: 'black',
  },
  buttonContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#376ADA',
    padding: 10,
    borderRadius: 7,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedMember: {
    backgroundColor: '#fff',
    shadowColor: '#376ADA',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
    shadowRadius: 20,
    marginBottom: 10,
  },
});
