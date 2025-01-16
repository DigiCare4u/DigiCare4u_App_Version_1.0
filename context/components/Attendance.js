import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const Attendance = () => {
  const attendanceData = [
    { id: '1', name: 'John Doe', status: 'Present', time: '09:00 AM' },
  ];

  const renderAttendanceItem = ({ item }) => {
    const statusStyles = {
      Present: styles.statusPresent,
      Absent: styles.statusAbsent,
      Late: styles.statusLate,
    };

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.status, statusStyles[item.status]]}>{item.status}</Text>
        </View>
        <Text style={styles.time}>Time: {item.time}</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.id}
        renderItem={renderAttendanceItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: {
    flex:1,
    // backgroundColor: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#376ADA',
    marginTop: 10,
    textAlign:"center"
  },
  listContainer: {
    // paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    // marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal:5,
    marginVertical:5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    textTransform: 'uppercase',
  },
  statusPresent: {
    backgroundColor: '#DFF0D8',
    color: '#3C763D',
  },
  statusAbsent: {
    backgroundColor: '#F2DEDE',
    color: '#A94442',
  },
  statusLate: {
    backgroundColor: '#FCF8E3',
    color: '#8A6D3B',
  },
  time: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#376ADA',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
