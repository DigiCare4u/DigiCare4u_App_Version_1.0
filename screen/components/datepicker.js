import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateAndTimePicker = ({ setStartDate, setEndDate }) => {
  const [startDate, setStartDateLocal] = useState(new Date());
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
      setEndDate(updatedEndDate); 
    }
  };

  const toggleStartDatePicker = () => setShowStartDatePicker(!showStartDatePicker);
  const toggleEndDatePicker = () => setShowEndDatePicker(!showEndDatePicker);

  return (
    <View style={styles.container}>
      {/* First Pick Date Button */}
      <View style={styles.datePickerWrapper}>
        <Text style={styles.label}>Start Date:</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={toggleStartDatePicker}>
          <MaterialIcons name="calendar-today" size={24} color="#376ADA" />
          <Text style={styles.buttonText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {/* Start Date Picker Modal */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="calendar"
            onChange={onStartDateChange}
            maximumDate={endDate} // Start date cannot be later than end date
          />
        )}
      </View>

      {/* Last Pick Date Button */}
      <View style={styles.datePickerWrapper}>
        <Text style={styles.label}>End Date:</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={toggleEndDatePicker}>
          <MaterialIcons name="calendar-today" size={24} color="#376ADA" />
          <Text style={styles.buttonText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {/* End Date Picker Modal */}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="calendar"
            onChange={onEndDateChange}
            minimumDate={startDate} // End date cannot be earlier than start date
          />
        )}
      </View>
    </View>
  );
};

export default DateAndTimePicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: '49%',
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
});

