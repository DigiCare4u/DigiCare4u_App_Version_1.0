import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AssignmentCard from './AssignmentCard';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCalender from '../Modal/UserCalenderModal'
import DownloadButton from '../DownloadBtn';
import Calender_new from '../Modal/UserCalenderModal_new';

// Function to fetch address from coordinates using Mapbox API
export const getAddressFromCoordinates_v1 = async ([latitude, longitude]) => {
  const accessToken =
    'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}&limit=1`;

  try {
    const response = await axios.get(url);
    if (response.data) {
      return (
        response.data.features[0].properties.formatted || 'Address not found'
      );
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address';
  }
};

const AttendanceList = ({ selectedChannelId, dateRange }) => {
  // console.log('____ dateRange __=__', dateRange.startDate);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState({});
  const [openCalenderModal, setOpenCalenderModal] = useState(false);

  const [openCalenderModalData, setOpenCalenderModalData] = useState([]);
  // console.log('attendanceRecords', attendanceRecords);

  // console.log('addresses',addresses)

  const fetchAttendanceRecords = async () => {
    try {
      if (!selectedChannelId) return;

      const startDate = '2024-12-16'; // You can dynamically set this
      const endDate = '2024-12-19'; // You can dynamically set this

      const jwtToken = await AsyncStorage.getItem('token');
      // console.log('dateRange_______________________', dateRange.startDate);

      const url = `${devURL}/user/members/attendance/records_new?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}&channelId=${selectedChannelId}`;

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      // console.log('response,_______________________', response.data.attendance[0]);
      setAttendanceRecords(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchAttendanceRecords();
  }, [selectedChannelId, dateRange]);

  useEffect(() => {
    // Fetch addresses for all records once the attendance records are fetched
    const fetchAddresses = async () => {
      const tempAddresses = {};
      for (const item of attendanceRecords) {
        if (
          item.locationDuringPunchIn?.latitude &&
          item.locationDuringPunchIn?.longitude
        ) {
          const address = await getAddressFromCoordinates_v1([
            item.locationDuringPunchIn.latitude,
            item.locationDuringPunchIn.longitude,
          ]);
          tempAddresses[item.id] = address;
        }
      }
      setAddresses(tempAddresses); // Store the fetched addresses in state
    };

    if (attendanceRecords.length > 0) {
      fetchAddresses();
    }
  }, [attendanceRecords]);


  const renderItem = ({ item }) => {
    // console.log(item.name);

    return (
      <TouchableOpacity
        style={styles.channelCard}
        onPress={() => {
          setOpenCalenderModal(true)
          setOpenCalenderModalData(item?.data)
        }} // Open calendar modal
      >
        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>{item.name || 'Channel Name'}</Text>
          <Text style={styles.channelDetails}>
            Total Attendance: {item.totalPresent || 0}
          </Text>
          <Text style={styles.channelDetails}>
            Total Absent: {item.totalAbsent || 0}
          </Text>
        </View>
        <Icon name="arrow-forward" size={24} color="#007BFF" />
      </TouchableOpacity>
    );
  };






  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#007BFF', marginTop: 10, }}> Attendance </Text>
        <DownloadButton attendanceRecords={attendanceRecords} />
      </View>

      {isLoading ? (
        <Text>Loading attendance records...</Text>
      ) : (
        <FlatList
          data={attendanceRecords}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <AssignmentCard
        dateRange={dateRange}
        selectedChannelId={selectedChannelId}
      />

      <Calender_new
        openCalenderModalData={openCalenderModalData}
        visible={openCalenderModal}
        setVisible={setOpenCalenderModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    marginHorizontal: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#007BFF',
    marginVertical: 2,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  presentButton: {
    backgroundColor: '#4CAF50',
  },
  absentButton: {
    backgroundColor: '#F44336',
  },
  notMarkedButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },




  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 15,
  },
  channelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 5,
  },
  channelDetails: {
    fontSize: 14,
    color: '#666',
  },








});

export default AttendanceList;
