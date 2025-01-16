import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import PendingMembers from '../Modal/MemberModal/PendingTaskModal';
import CompletedTaskModal from '../Modal/MemberModal/CompletedTaskModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../../constants/endpoints';
import DatePicker from '../datepicker';

function Assignment() {
  const [events, setEvents] = useState([]); // Holds filtered task data
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const [openCompletedModal, setOpenCompletedModal] = useState(false);
  const [selectedPendingTasks, setSelectedPendingTasks] = useState([]);
  const [selectedCompletedTasks, setSelectedCompletedTasks] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [noAssignmentsMessage, setNoAssignmentsMessage] = useState('');

  console.log('selectedPendingTasks', selectedPendingTasks)

  // Fetch assignments API call
  const fetchAssignments = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${devURL}/assignment/member/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const data = await response.json();
      console.log('API Response:', data?.member?.tasks)

      // Check for no assignments
      if (data.message === 'No assignments found for the given period') {
        setNoAssignmentsMessage('No assignments found for the selected date range.');
        setEvents([]);
      } else {
        setNoAssignmentsMessage('');
        const tasks = data.member.tasks || [];
        const pendingTasks = tasks.filter(task => task.status === 'Pending');
        const completedTasks = tasks.filter(task => task.status === 'completed');
        setEvents([
          {
            ...data.member,
            pendingTasks,
            completedTasks,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setNoAssignmentsMessage('Error fetching assignments.');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [startDate, endDate]);
  

  const renderTaskItem = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* <Text style={styles.nameText}>{item.name}</Text> */}
        <Text style={styles.totalAssignmentsText}>
          Total Tasks: {item.totalTasks}
        </Text>
        <View style={styles.inlineButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectedPendingTasks(item.pendingTasks);
              setOpenPendingModal(true);
            }}
          >
            <Text style={styles.buttonText}>Pending: {item.pendingTasks.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completedButton]}
            onPress={() => {
              setSelectedCompletedTasks(item.completedTasks);
              setOpenCompletedModal(true);
            }}
          >
            <Text style={styles.buttonText}>Completed: {item.completedTasks.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      {noAssignmentsMessage ? (
        <Text style={styles.noAssignmentsText}>{noAssignmentsMessage}</Text>
      ) : (
        <View>
          <Text style={styles.title}>Assignments Details</Text>
          <FlatList
            data={events}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
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
    // padding: 10,
    backgroundColor: '#f8f9fa',
    // marginHorizontal:2,
  },
  title: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 10,
  },
  noAssignmentsText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginHorizontal:5,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color:"#376ADA"
  },
  totalAssignmentsText: {
    fontSize: 20,
    marginBottom: 10,
    color:"black",
    fontWeight:"600",
    textAlign:"center"
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#376ADA',
    padding: 10,
    borderRadius: 5,
  },
  completedButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Assignment;
