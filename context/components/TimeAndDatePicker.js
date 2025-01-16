import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateAndTimePicker = ({ setDate  }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


    console.log('setDate', setDate)

    const onDateChange = (event, newDate) => {
        setShowDatePicker(false);
        if (newDate) {
          const updatedDate = new Date(selectedDate);
          updatedDate.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
          setSelectedDate(updatedDate);
          setDate(updatedDate); // Update the parent with the new date
        }
      };
    
      const onTimeChange = (event, newTime) => {
        setShowTimePicker(false);
        if (newTime) {
          const updatedTime = new Date(selectedDate);
          updatedTime.setHours(newTime.getHours(), newTime.getMinutes());
          setSelectedDate(updatedTime);
          setDate(updatedTime); // Update the parent with the new time
        }
      };

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleTimePicker = () => setShowTimePicker(!showTimePicker);

  return (
    <View style={styles.container}>
      {/* Date Picker Button */}
      <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
        <MaterialIcons name="calendar-today" size={24} color="#376ADA" />
        <Text style={styles.buttonText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {/* Time Picker Button */}
      <TouchableOpacity style={styles.pickerButtons} onPress={() => setShowTimePicker(true)}>
        <MaterialIcons name="access-time" size={24} color="#376ADA" />
        <Text style={styles.buttonText}>
          {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
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

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

export default DateAndTimePicker;

const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '60%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
    margin:2,
  },
  pickerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '37%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
    margin:2,
  },
  buttonText: {
    fontSize: 16,
    color: '#376ADA',
    fontWeight: '600',
  },
});
