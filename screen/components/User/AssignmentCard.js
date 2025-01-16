import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AssignmentModal from '../Modal/UserModel/AssignmentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';


function AssignmentCard({ selectedChannelId, dateRange }) {
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [noAssignmentsMessage, setNoAssignmentsMessage] = useState('');

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


  const pendingTasks =  


  console.log('assignments',assignments)

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
