import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import PendingMembers from '../Modal/MemberModal/PendingTaskModal';
import CompletedTaskModal from '../Modal/MemberModal/CompletedTaskModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../../constants/endpoints'; // Import the DatePicker component
import DatePicker from '../datepicker';

// Fetch assignments API
function Assignment() {
  const [events, setEvents] = useState([]); // Holds member and task data
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const [openCompletedModal, setOpenCompletedModal] = useState(false);
  const [selectedPendingTasks, setSelectedPendingTasks] = useState([]);
  const [selectedCompletedTasks, setSelectedCompletedTasks] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Default to today's date
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Adds one day
    return tomorrow; // Sets the end date to tomorrow
  });
  const [noAssignmentsMessage, setNoAssignmentsMessage] = useState('');

  // Fetch assignments based on the selected date range
  const fetchAssignments = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await fetch(`${devURL}/assignment/member/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = await response.json();
      console.log('data', data);


      // Check for no assignments
      if (data.message === "No assignments found for the given period") {
        setNoAssignmentsMessage("No assignments found for the selected date range.");
        setEvents([]);
      } else {
        setNoAssignmentsMessage('');
        setEvents([data.member]); // Update the state with fetched data
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setNoAssignmentsMessage('Error fetching assignments.');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [startDate, endDate]); // Fetch assignments when dates change

  const filterTasksByStatus = (tasks, status) => {
    return tasks?.filter(task => task?.status === status);
  };

  const renderTaskItem = ({ item }) => {
    const pendingTasks = filterTasksByStatus(item?.tasks, 'pending');
    const completedTasks = filterTasksByStatus(item?.tasks, 'completed');

    return (
      <View style={styles.card}>
        {/* Profile Image */}
        {/* <Image source={{ uri: item?.imageUrl }} style={styles.profileImage} /> */}

        {/* User Info */}
        {/* <Text style={styles.nameText}>{item?.name}</Text>
        <Text style={styles.addressText}>{item?.address}</Text> */}

        {/* Task Summary */}
        <Text style={styles.totalAssignmentsText}>
          Total Tasks: {item?.totalTasks}
        </Text>
        <View style={styles.inlineButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectedPendingTasks(pendingTasks);
              setOpenPendingModal(true);
            }}>
            <Text style={styles.buttonText}>Pending: {item?.pendingTasks}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completedButton]}
            onPress={() => {
              setSelectedCompletedTasks(completedTasks);
              setOpenCompletedModal(true);
            }}>
            <Text style={styles.buttonText}>
              Completed: {item?.completedTasks}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Date Picker for selecting dates */}

      <DatePicker setStartDate={setStartDate}  setEndDate={setEndDate}/>

      {/* Display No Assignments Message */}
      {noAssignmentsMessage ? (
        <Text style={styles.noAssignmentsText}>{noAssignmentsMessage}</Text>
      ) : (
      <View>
          <Text style={{color:"black",fontSize:15,fontWeight:"600"}}>Assignments Details</Text>
        <FlatList
          data={events}
          renderItem={renderTaskItem}
          keyExtractor={item => item?.id}
        />
      </View>
      )}

      <PendingMembers
        visible={openPendingModal}
        setVisible={setOpenPendingModal}
        selectedPendingTasks={selectedPendingTasks}
      />
      <CompletedTaskModal
        visible={openCompletedModal}
        setVisible={setOpenCompletedModal}
        selectedCompletedTasks={selectedCompletedTasks}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  datePickerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noAssignmentsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  totalAssignmentsText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color:"blue"
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  completedButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },

});



export default Assignment;
