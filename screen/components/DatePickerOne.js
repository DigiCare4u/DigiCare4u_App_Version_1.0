import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateSelect = ({ setDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, newDate) => {
    setShowDatePicker(false); // Close the date picker
    if (newDate) {
      setSelectedDate(newDate); // Update selected date
      setDate(newDate); // Pass the selected date to the parent component
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker); // Toggle the date picker modal visibility
  };

  return (
    <View style={styles.container}>
      {/* Date Picker Button */}
      <TouchableOpacity style={styles.pickerButton} onPress={toggleDatePicker}>
        <MaterialIcons name="calendar-today" size={24} color="#376ADA" />
        <Text style={styles.buttonText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default DateSelect;

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E8F1FE',
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#376ADA',
  },
});

