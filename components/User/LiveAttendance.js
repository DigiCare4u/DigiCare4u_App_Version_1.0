import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {devURL} from '../../constants/endpoints';

const {height} = Dimensions.get('window'); // Get device height

const TodayAttendance = ({visible, setVisible}) => {
  const [members, setMembers] = useState([]);

  // Fetch today's attendance data when modal is opened
  const fetchAttendance = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${devURL}/user/members/attendance/today`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log('response.data?.attendance', response.data.attendance[0]);

      setMembers(response.data?.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', 'Failed to fetch attendance data.');
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAttendance();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}>
        
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}>
            <Text style={styles.closeIndicator}></Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today's Attendance</Text>

          <ScrollView contentContainerStyle={styles.gridContainer}>
            {members.length > 0 ? (
              members.map(member => {
                // Splitting punchInTime into date and time if available
                const punchInDate = member.punchInTime
                  ? new Date(member.punchInTime).toLocaleDateString()
                  : 'Date';
                const punchInTime = member.punchInTime
                  ? new Date(member.punchInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Time';

                return (
                  <View style={styles.memberBox} key={member._id}>
                    <Text style={styles.memberName}>
                      {member.name || 'Name'}
                    </Text>

                    {/* Date & Time */}
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeLabel}>Date:</Text>
                      <Text style={styles.timeValue}>{punchInDate}</Text>
                    </View>

                    <View style={styles.timeContainer}>
                      <Text style={styles.timeLabel}>Time:</Text>
                      <Text style={styles.timeValue}>{punchInTime}</Text>
                    </View>

                    <Text style={styles.statusText}>
                      Status: {member.status || 'Not marked'}
                    </Text>
                    <Text style={styles.hoursText}>
                      Work Hours: {member.totalWorkHours || '0 Hours'}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noDataText}>
                No attendance data available.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TodayAttendance;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: height * 0.8, // 80% of screen height
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    elevation: 5,
    justifyContent: 'space-between',
    // backgroundColor:"red"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#376ADA',
    marginBottom: 10,
    // backgroundColor:"red"
  },
  gridContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  memberBox: {
    width: '48%', // Adjust for 2 items per row
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 2,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#007ACC',
    marginVertical: 5,
    alignSelf: 'stretch',
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
    alignSelf: 'stretch',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  closeIndicator: {
    backgroundColor: 'black',
    width: 220,
    height: 4,
    borderRadius: 9,
    marginVertical: 0,
    marginBottom: 17,
  },
});
