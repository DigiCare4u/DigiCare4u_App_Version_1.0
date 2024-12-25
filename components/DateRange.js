import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateRange = ({ setStartDate, setEndDate, setDateRange }) => {
  const [startDate, setStartDateLocal] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) // First day of the current month);
  const [endDate, setEndDateLocal] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const updatedStartDate = new Date(selectedDate);
      setStartDateLocal(updatedStartDate);
      setStartDate(updatedStartDate); // Update parent with the new start date
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const updatedEndDate = new Date(selectedDate);
      setEndDateLocal(updatedEndDate);
      setEndDate(updatedEndDate); // Update parent with the new end date
    }
  };

  const toggleStartDatePicker = () => setShowStartDatePicker(!showStartDatePicker);
  const toggleEndDatePicker = () => setShowEndDatePicker(!showEndDatePicker);

  const handleSearch = () => {
    setDateRange({ startDate, endDate }); // Combine start and end dates into an object and pass to parent
  };

  return (
    <View style={styles.container}>
      {/* Start Date Picker */}
      <View style={styles.datePickerWrapper}>
        <Text style={styles.label}>Start Date:</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={toggleStartDatePicker}>
          <MaterialIcons name="calendar-today" size={24} color="#376ADA" />
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
        <Text style={styles.label}>End Date:</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={toggleEndDatePicker}>
          <MaterialIcons name="calendar-today" size={24} color="#376ADA" />
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
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  datePickerWrapper: {
    marginBottom: 20,
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    color: '#376ADA',
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#376ADA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
