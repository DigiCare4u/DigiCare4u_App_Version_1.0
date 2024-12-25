import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Assinement from './Assinement';
import { devURL } from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodayTask from '../TodayTask';

function Calender() {
  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Returns 'hh:mm AM/PM'
  };


  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const jwtToken = await AsyncStorage.getItem('token');

      const response = await fetch(`${devURL}/member/attendance/${startDate}/${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`, // Replace with actual token
        },
      });
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
    // Calculate the first date of the current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const currentDate = today.toISOString().split('T')[0]; // Get today's date

    fetchAttendanceData(firstDayOfMonth, currentDate); // Fetch data from first day of the month to current date
  }, []);

  // Convert attendanceData to markedDates format for the calendar
  const markedDates = Object.entries(attendanceData).reduce((acc, [date, { dotColor, selected }]) => {
    acc[date] = { marked: true, dotColor, selected, selectedColor: 'blue' };
    return acc;
  }, {});
  // console.log('attendanceData___', attendanceData);

  return (
    <SafeAreaView style={styles.container}>
      {/* <TodayTask /> */}
      <View style={styles.header}>
        <Text style={styles.statusText}>
          Status: {attendanceData[selectedDate]?.status || 'No Data'}
        </Text>
        <Text style={styles.statusText}>
          Punch In: {attendanceData[selectedDate]?.timeIn == 'Invalid Date' ? 'No Time' : attendanceData[selectedDate]?.timeIn}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)} // Update selected date on press
          markedDates={markedDates} // Show attendance statuses
          theme={{
            todayTextColor: 'red',
            selectedDayBackgroundColor: 'blue',
            arrowColor: 'blue',
          }}
        />
      )}
      <Assinement />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default Calender;
