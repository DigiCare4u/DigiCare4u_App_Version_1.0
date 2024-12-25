import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AssignmentModal from '../Modal/UserModel/AssignmentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';

// Fake assignment data
const assignments = [
  {
    id: '1',
    name: 'John Doe',
    totalTasks: 10,
    pendingTasks: 3,
    completedTasks: 7,
    imageUrl: 'https://via.placeholder.com/150',
    address: 'gomati nagar, lucknow, uttar pradesh, 226011',
    completedTasksDateTime: '2024-12-18T04:24:32.532Z',
    completedTaskDetails: [
      {
        taskId: 'C1',
        location: 'Aliganj, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-17T10:15:00.000Z',
      },
      {
        taskId: 'C2',
        location: 'Hazratganj, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-16T14:45:00.000Z',
      },
      {
        taskId: 'C3',
        location: 'Chowk, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-15T09:30:00.000Z',
      },
    ],
    inCompleteTaskDetails: [
      {
        taskId: 'IC1',
        location: 'Aashiana, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-14T16:00:00.000Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    totalTasks: 8,
    pendingTasks: 2,
    completedTasks: 6,
    imageUrl: 'https://via.placeholder.com/150',
    address: 'gomati nagar, lucknow, uttar pradesh, 226011',
    completedTasksDateTime: '2024-12-18T04:24:32.532Z',
    completedTaskDetails: [
      {
        taskId: 'C1',
        location: 'Indira Nagar, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-16T11:45:00.000Z',
      },
      {
        taskId: 'C2',
        location: 'Gomti Nagar, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-15T17:30:00.000Z',
      },
    ],
    inCompleteTaskDetails: [
      {
        taskId: 'IC1',
        location: 'Mahanagar, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-14T12:00:00.000Z',
      },
      {
        taskId: 'IC2',
        location: 'Rajajipuram, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-13T10:00:00.000Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Alice Johnson',
    totalTasks: 12,
    pendingTasks: 4,
    completedTasks: 8,
    imageUrl: 'https://via.placeholder.com/150',
    address: 'gomati nagar, lucknow, uttar pradesh, 226011',
    completedTasksDateTime: '2024-12-18T04:24:32.532Z',
    completedTaskDetails: [
      {
        taskId: 'C1',
        location: 'Alambagh, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-16T08:45:00.000Z',
      },
      {
        taskId: 'C2',
        location: 'Charbagh, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-15T14:30:00.000Z',
      },
    ],
    inCompleteTaskDetails: [
      {
        taskId: 'IC1',
        location: 'Telibagh, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-14T09:00:00.000Z',
      },
      {
        taskId: 'IC2',
        location: 'Chinhat, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-13T16:30:00.000Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Michael Brown',
    totalTasks: 5,
    pendingTasks: 1,
    completedTasks: 4,
    imageUrl: 'https://via.placeholder.com/150',
    address: 'gomati nagar, lucknow, uttar pradesh, 226011',
    completedTasksDateTime: '2024-12-18T04:24:32.532Z',
    completedTaskDetails: [
      {
        taskId: 'C1',
        location: 'Hazratganj, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-16T10:45:00.000Z',
      },
    ],
    inCompleteTaskDetails: [
      {
        taskId: 'IC1',
        location: 'Aliganj, Lucknow, Uttar Pradesh',
        dateTime: '2024-12-14T11:00:00.000Z',
      },
    ],
  },
];


function AssignmentCard({ selectedChannelId, dateRange }) {
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);



  const fetchChannelMembersAssignments = async () => {
    try {
      // console.log('payload -----', selectedChannelId, dateRange);

      const jwtToken = await AsyncStorage.getItem('token');
      let today = new Date();
      let formattedDate = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

      const response = await axios.post(`${devURL}/user/members/assignments-records/${selectedChannelId}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {},

        // `${devURL}/user/members/daily-assignments/${selectedChannelId}`,

        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        }
      );

      // console.log('=========Visit data[useFetchMember]================')
      // console.log('aaya ------------------------- !!', response?.data?.data);
      setAssignments(response?.data?.data)
      // const labels = response.data.map((item) => item._id || "Unknown");
      // const data = response.data.map((item) => item.count);

      setChartData_(response?.data?.data);
    } catch (error) {
      console.error("Error fetching visit data:", error);
    }
  };


  useEffect(() => {
    fetchChannelMembersAssignments()
  }, [selectedChannelId,dateRange])







  // console.log('selectedAssignment',selectedAssignment)

  const handleCardPress = (item) => {
    setSelectedAssignment(item); // Set the selected assignment
    setOpenAssignmentModal(true); // Open the modal
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <View style={styles.card}>
        {/* Left Side - Image */}
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        {/* Center - Name */}
        <View style={styles.center}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.taskTitle}>Total : {item.totalAssignments} </Text>
          {/* <Text style={styles.taskCount}>{item.totalAssignments}</Text> */}
        </View>

        {/* Right Side - Task Information */}
        <View style={styles.right}>
          <Text style={styles.taskTitle}>Pending : {item.pending} </Text>
          {/* <Text style={styles.taskCount}>{item.pending}</Text> */}

          <Text style={styles.taskTitle}>Completed : {item.completed} </Text>
          {/* <Text style={styles.taskCount}>{item.completed}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#007BFF',
          marginTop: 10,
        }}
      >
        Assignment
      </Text>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Assignment Modal */}
      <AssignmentModal
        visible={openAssignmentModal}
        setVisible={setOpenAssignmentModal}
        selectedAssignment={selectedAssignment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  right: {
    alignItems: 'flex-end',
  },
  taskTitle: {
    fontSize: 12,
    color: '#666',
  },
  taskCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AssignmentCard;
