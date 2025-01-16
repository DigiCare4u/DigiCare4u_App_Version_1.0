import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { devURL } from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyTaskAssignment = () => {
  const [taskName, setTaskName] = useState('');
  const [zone, setZone] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [repetition, setRepetition] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleTaskCreation = async () => {
    try {
      ; // Replace with actual user ID logic
      const dateTime = {
        date: startTime.toISOString().split('T')[0],
        time: startTime.toLocaleTimeString(),
      };
      const eventName = taskName;
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await fetch(`${devURL}/assignment/location/geo-fencing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`, // Add your JWT token here
        },
        body: JSON.stringify({

          dateTime,
          eventName,
          type: 'daily',
        }),
      });

      const result = await response.json();
      console.log(';result---', result);

      if (response.ok) {
        console.log('Location assigned successfully:', result.assignment);
        alert('Task assigned successfully!');
      } else {
        console.error('Error assigning location:', result.message);
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error in handleTaskCreation:', error);
      alert('Failed to assign task');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setAccordionOpen(!accordionOpen)}
      >
        <Text style={styles.accordionHeaderText}>
          Do you want to set this geofenced area as an assignment for your members?
        </Text>
        <Text style={styles.accordionToggleText}>
          {accordionOpen ? '-' : '+'}
        </Text>
      </TouchableOpacity>

      {accordionOpen && (
        <ScrollView contentContainerStyle={styles.accordionContent}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name (e.g., Daily Attendance)"
            value={taskName}
            onChangeText={setTaskName}
          />

          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.timeText}>{startTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartTimePicker(false);
                if (selectedDate) setStartTime(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.timeText}>{endTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndTimePicker(false);
                if (selectedDate) setEndTime(selectedDate);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleTaskCreation}
          >
            <Text style={styles.createButtonText}>Create Task</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,

    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  accordionHeader: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionToggleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  accordionContent: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  timeText: {
    color: '#555',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DailyTaskAssignment;
