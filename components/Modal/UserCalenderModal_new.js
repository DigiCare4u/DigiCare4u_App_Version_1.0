import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

function Calender_new({ visible, setVisible, openCalenderModalData }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);

  // Format the attendance data into a format suitable for the calendar
  useEffect(() => {
    const formatAttendanceData = () => {
      if (!openCalenderModalData || !Array.isArray(openCalenderModalData)) {
        return;
      }

      const formattedData = openCalenderModalData.reduce((acc, entry) => {
        const { date, status,time } = entry;
        acc[date] = {
          marked: true,
          dotColor: status === 'present' ? 'green' : 'red',
          selected: selectedDate === date,
          selectedColor: selectedDate === date ? 'blue' : undefined,
          time: time ,
        };
        return acc;
      }, {});
      setAttendanceData(formattedData);
    };

    formatAttendanceData();
  }, [openCalenderModalData, selectedDate]);

  const markedDates = attendanceData;
  // console.log(markedDates);

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
          <View style={styles.header}>
            <Text style={styles.statusText}>
              Status: {attendanceData[selectedDate]?.dotColor === 'green' ? 'Present' : 'Absent'}
            </Text>

            <Text style={styles.statusText}>
              Time: {attendanceData[selectedDate]?.dotColor === 'green' ? attendanceData[selectedDate]?.time : 'n/a'}
            </Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
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
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '60%',
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
  },
  header: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
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
    marginBottom: 17,
  },
});

export default Calender_new;
