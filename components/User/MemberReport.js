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
import Loader from '../Loader';
import AssignmentModal from '../Modal/UserModel/AssignmentModal';

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

const MemberReport = ({ selectedChannelId, dateRange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);

  const [combinedData, setCombinedData] = useState([]);
  const fetchChannelData = async () => {
    try {
      setIsLoading(true)
      const jwtToken = await AsyncStorage.getItem('token');

      const assignmentsUrl = `${devURL}/user/members/assignments-records/${selectedChannelId}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      const attendanceUrl = `${devURL}/user/members/attendance/records_new?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}&channelId=${selectedChannelId}`;

      const [assignmentsResponse, attendanceResponse] = await Promise.all([
        axios.post(assignmentsUrl, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }),
        axios.get(attendanceUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }),
      ]);

      // Extract data from responses
      const assignments = assignmentsResponse?.data?.data || [];
      const attendanceRecords = attendanceResponse?.data?.attendance || [];

      // Merge data and add type for differentiation
      const groupedData = {};

      // Process assignments
      assignments.forEach(item => {
        if (!groupedData[item.name]) {
          groupedData[item.name] = { name: item.name, attendance: [], assignments: [] };
        }
        groupedData[item.name].assignments.push(item);
      });

      // Process attendance records
      attendanceRecords.forEach(item => {
        if (!groupedData[item.name]) {
          groupedData[item.name] = { name: item.name, attendance: [], assignments: [] };
        }
        groupedData[item.name].attendance.push(item);
      });

      // Convert grouped data into an array
      const combinedData = Object.values(groupedData);

      setCombinedData(combinedData);
      // Set combined data to state
      setCombinedData(combinedData);
    } catch (error) {
      console.error('Error fetching channel data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchChannelData();
  }, [selectedChannelId, dateRange]);


  const [openCalenderModal, setOpenCalenderModal] = useState(false);
  const [openCalenderModalData, setOpenCalenderModalData] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);


  const renderItem = ({ item }) => {

    return (
      <View style={styles.channelCard}>


        {isLoading ? <Loader /> : (
          <View style={styles.channelInfo}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item?.profileImage || 'https://via.placeholder.com/50' }}
                style={styles.userImage}
              />
              <Text style={styles.userName}>{item?.name || 'User Name'}</Text>
              {/* Calendar Action */}
            </View>
            <TouchableOpacity
              onPress={() => {
                setOpenCalenderModal(true);
                setOpenCalenderModalData(item?.attendance[0]?.data);
              }}
              style={styles.calendarRow}>
              <Icon name="calendar-today" size={20} color="#007BFF" />
              <Text style={styles.calendarText}>View Attendance  🙋🏻‍♂️ {item?.attendance[0].totalPresent} 🅰️ {item?.attendance[0].totalAbsent}</Text>
            </TouchableOpacity>

            {/* Task Details Section */}
            <TouchableOpacity
              onPress={() => {
                setOpenAssignmentModal(true)
                // console.log('task aaya -------',task.pending);
                setPendingTasks(item?.assignments[0]?.pending?.details)
                setCompletedTasks(item?.assignments[0]?.completed?.details)
              }}
              style={styles.taskDetails}>
              <View style={styles.taskDetailItem}>
                <Icon name="format-list-numbered" size={20} color="#4CAF50" />
                <Text style={styles.taskDetailText}>
                  Total: <Text style={styles.taskCount}>{item?.assignments[0]?.totalAssignments || 0}</Text>
                </Text>
              </View>
              <View style={styles.taskDetailItem}>
                <Icon name="hourglass-empty" size={20} color="#FFC107" />
                <Text style={styles.taskDetailText}>
                  Pending: <Text style={styles.taskCount}>{item?.assignments[0]?.pending.count || 0}</Text>
                </Text>
              </View>
              <View style={styles.taskDetailItem}>
                <Icon name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.taskDetailText}>
                  Completed: <Text style={styles.taskCount}>{item?.assignments[0]?.completed.count || 0}</Text>
                </Text>
              </View>
            </TouchableOpacity>


          </View>
        )
        }


      </View >
    );
  };



  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#007BFF', marginTop: 10, }}> Attendance </Text>
        <DownloadButton />
      </View>

      {isLoading ? (
        <Text>Loading attendance records...</Text>
      ) : (
        <FlatList
          data={combinedData} // Merge the arrays
          // data={[...attendanceRecords, ...assignments]} // Merge the arrays
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* <AssignmentCard
        dateRange={dateRange}
        selectedChannelId={selectedChannelId}
      /> */}

      <Calender_new
        openCalenderModalData={openCalenderModalData}
        visible={openCalenderModal}
        setVisible={setOpenCalenderModal}
      />

      <AssignmentModal
        visible={openAssignmentModal}
        setVisible={setOpenAssignmentModal}
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
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
  // channelCard: {
  //   backgroundColor: '#ffffff',
  //   borderRadius: 10,
  //   padding: 15,
  //   marginBottom: 10,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 6,
  //   shadowOffset: { width: 0, height: 2 },
  // },
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


  channelCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  channelInfo: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: '#FAF9F6',
    padding: 5,
    borderRadius: 4,
    elevation: 3,

  },
  taskDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  taskCount: {
    fontWeight: 'bold',
    color: '#333',
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  calendarText: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 5,
  },




});

export default MemberReport;
