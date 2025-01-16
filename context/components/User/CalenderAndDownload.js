import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

function CalenderAndDownload() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const handleDownload = () => {
    if (startDate && endDate) {
      Alert.alert(
        'Download Started',
        `Downloading data from ${startDate} to ${endDate}`
      );
    } else {
      Alert.alert('Select Dates', 'Please select both start and end dates.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Start Date Picker */}
      <TouchableOpacity
        style={styles.inlineButton}
        onPress={() => setStartDatePickerVisible(true)}
      >
        <Icon name="date-range" size={24} color="#007BFF" />
        <Text style={styles.buttonText}>
          {startDate ? startDate : 'Start Date'}
        </Text>
      </TouchableOpacity>

      {/* End Date Picker */}
      <TouchableOpacity
        style={styles.inlineButton}
        onPress={() => setEndDatePickerVisible(true)}
      >
        <Icon name="event" size={24} color="#007BFF" />
        <Text style={styles.buttonText}>
          {endDate ? endDate : 'End Date'}
        </Text>
      </TouchableOpacity>

      {/* Download Button */}
      <TouchableOpacity
        style={[
          styles.inlineButton,
          {
            backgroundColor: startDate && endDate ? '#007BFF' : '#d3d3d3',
          },
        ]}
        onPress={handleDownload}
        disabled={!startDate || !endDate}
      >
        <Icon name="file-download" size={24} color="#fff" />
        <Text style={[styles.buttonText, { color: '#fff' }]}>Download</Text>
      </TouchableOpacity>

      {/* Start Date Modal */}
      <Modal
        visible={isStartDatePickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Calendar
            onDayPress={(day) => {
              setStartDate(day.dateString);
              setStartDatePickerVisible(false);
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setStartDatePickerVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* End Date Modal */}
      <Modal
        visible={isEndDatePickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Calendar
            onDayPress={(day) => {
              setEndDate(day.dateString);
              setEndDatePickerVisible(false);
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setEndDatePickerVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical:8,
    paddingHorizontal: 8,
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CalenderAndDownload;
