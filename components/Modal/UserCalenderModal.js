import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {devURL} from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

function Calender({visible, setVisible}) {
  const formatTime = isoDate => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const jwtToken = await AsyncStorage.getItem('token');

      const response = await fetch(
        `${devURL}/member/attendance/${startDate}/${endDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`, // Replace with actual token
          },
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch attendance data');
      }

      // Transform API response to markedDates format
      const transformedData = result.data.reduce((acc, record) => {
        // If the status is "present", include the time
        const status = record.status === 'present' ? 'Present' : 'Absent';
        const attendanceDetails = {
          marked: true,
          dotColor: record.status === 'present' ? 'green' : 'red',
          status: status, // "Present" or "Absent"
          timeIn: formatTime(record.punchInTime), // "Present" or "Absent"
          selected: false,
        };

        // If the status is "Present", include the time as well
        if (record.status === 'present' && record.timeIn) {
          attendanceDetails.timeIn = record.timeIn; // Assuming the API provides a timeIn field
        }

        acc[record.date] = attendanceDetails;
        return acc;
      }, {});

      setAttendanceData(transformedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const currentDate = today.toISOString().split('T')[0];

    fetchAttendanceData(firstDayOfMonth, currentDate);
  }, []);

  const markedDates = Object.entries(attendanceData).reduce(
    (acc, [date, {dotColor, selected}]) => {
      acc[date] = {marked: true, dotColor, selected, selectedColor: 'blue'};
      return acc;
    },
    {},
  );
  // console.log('attendanceData___', attendanceData);

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}>
      <SafeAreaView style={styles.modalContent}>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeIndicator}></Text>
        </TouchableOpacity>
        <View style={styles.container}>
          {/* <TodayTask /> */}
          <View style={styles.header}>
            <Text style={styles.statusText}>
              Status: {attendanceData[selectedDate]?.status || 'No Data'}
            </Text>
            <Text style={styles.statusText}>
              Punch In:{' '}
              {attendanceData[selectedDate]?.timeIn == 'Invalid Date'
                ? 'No Time'
                : attendanceData[selectedDate]?.timeIn}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Calendar
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={{
                todayTextColor: 'red',
                selectedDayBackgroundColor: 'blue',
                arrowColor: 'blue',
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0, // No margin for full width
    justifyContent: 'flex-end',
    // backgroundColor:"red"
  },
  modalContent: {
    height: '60%', // 80% of the screen height
    width: '100%', // Full width
    backgroundColor: '#fff', 
    padding:15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    //  backgroundColor:"red"
  },
  container: {
    backgroundColor: '#fff',
    width:"100%"
  },
  header: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
  },
  closeIndicator: {
    backgroundColor: 'black',
    width: 220,
    height: 4,
    borderRadius: 9,
    marginVertical: 0,
    marginBottom: 17,
  },
});

export default Calender;
