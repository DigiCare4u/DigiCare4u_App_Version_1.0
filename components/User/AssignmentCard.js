import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AssignmentModal from '../Modal/UserModel/AssignmentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';
import Icon from 'react-native-vector-icons/FontAwesome';

function AssignmentList({ selectedChannelId, dateRange }) {
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const fetchChannelMembersAssignments = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${devURL}/user/members/assignments-records/${selectedChannelId}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          }
        }
      );
      setAssignments(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchChannelMembersAssignments();
  }, [selectedChannelId, dateRange]);

  const handleRowPress = (item) => {
    setSelectedAssignment(item);
    setOpenAssignmentModal(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRowPress(item)} style={styles.row}>
      <View style={styles.rowContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          Total: {item.totalAssignments} | Pending: {item.pending} | Completed: {item.completed}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#888" style={styles.icon} />

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noData}>No assignments available.</Text>}
      />
      <AssignmentModal
        visible={openAssignmentModal}
        setVisible={setOpenAssignmentModal}
        selectedAssignment={selectedAssignment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#376ADA',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rowContent: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AssignmentList;
