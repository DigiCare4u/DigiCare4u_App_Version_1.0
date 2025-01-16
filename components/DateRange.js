import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateRange = ({ setStartDate, setEndDate, setDateRange }) => {
  const [startDate, setStartDateLocal] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // First day of the current month
  const [endDate, setEndDateLocal] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const updatedStartDate = new Date(selectedDate);
      setStartDateLocal(updatedStartDate);
      setStartDate(updatedStartDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const updatedEndDate = new Date(selectedDate);
      setEndDateLocal(updatedEndDate);
      setEndDate(updatedEndDate);
    }
  };

  const handleSearch = () => {
    setDateRange({ startDate, endDate });
  };

  return (
    <View style={styles.container}>
      {/* Start Date Picker */}
      <View style={styles.datePickerWrapper}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowStartDatePicker(true)}>
          <MaterialIcons name="calendar-today" size={20} color="#4CAF50" />
          <Text style={styles.buttonText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="calendar"
            onChange={onStartDateChange}
            maximumDate={endDate}
          />
        )}
      </View>

      {/* End Date Picker */}
      <View style={styles.datePickerWrapper}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowEndDatePicker(true)}>
          <MaterialIcons name="calendar-today" size={20} color="#4CAF50" />
          <Text style={styles.buttonText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="calendar"
            onChange={onEndDateChange}
            minimumDate={startDate}
          />
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DateRange;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  datePickerWrapper: {
    marginBottom: 20,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
