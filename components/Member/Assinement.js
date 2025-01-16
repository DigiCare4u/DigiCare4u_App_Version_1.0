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

  // console.log('selectedPendingTasks', selectedPendingTasks)

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
        const pendingTasks = tasks.filter(task => task.status === 'pending');
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
        <View style={styles.cardHeader}>
          <Text style={styles.totalAssignmentsText}>
            Total Tasks: {item.totalTasks}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.inlineButtons}>
          <TouchableOpacity
            style={[styles.button, styles.pendingButton]}
            onPress={() => {
              setSelectedPendingTasks(item.pendingTasks);
              setOpenPendingModal(true);
            }}
          >
            <Text style={styles.buttonText}>
              Pending: {item?.pendingTasks?.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.completedButton]}
            onPress={() => {
              setSelectedCompletedTasks(item.completedTasks);
              setOpenCompletedModal(true);
            }}
          >
            <Text style={styles.buttonText}>
              Completed: {item?.completedTasks?.length}
            </Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAssignmentsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  pendingButton: {
    backgroundColor: '#fef6e4',
    borderColor: '#ffd700',
  },
  completedButton: {
    backgroundColor: '#e6ffed',
    borderColor: '#00c851',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Assignment;
