import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const AssignmentModal = ({ visible, setVisible, pendingTasks, completedTasks }) => {

  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('pending'); // Default tab is 'pending'
  const [loading, setLoading] = useState(false); // Set to false initially

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // setLoading(true);
  };


  console.log('pendingTasks________====_____', pendingTasks[0]?.coordinates?.lat);


  const renderTaskItem = ({ item }) => {
    // console.log('______ tasks _________________', item._id);
    const getDayWithSuffix = (day) => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const value = day % 100;
      return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
    };

    const formattedDateTime = moment(item.date).format('ddd, ') + getDayWithSuffix(moment(item.date).date());
    return (
      // <View style={styles.taskCard}>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UserAssignmentMap', {
            taskId: item._id,
            memberId: item.memberId,
          })
        }>
        <View style={styles.taskCard}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item?.coordinates?.lat,
                longitude: item?.coordinates?.lng,
                latitudeDelta: 0.01, // Zoom level
                longitudeDelta: 0.01, // Zoom level
              }}>
              <Marker
                coordinate={{ latitude: item?.coordinates?.lat, longitude: item?.coordinates?.lat }}
                title="Location"
              // description={`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`}
              />
            </MapView>
          </View>
          <View>
            <Text style={styles.taskName}>
              {item?.eventName || 'event name n/a '}
            </Text>
            {/* <Text style={styles.taskLocation}>
                Location: Lat {item.location.lat.toFixed(2)}, Lng{' '}
                {item.location.lng.toFixed(2)}
              </Text> */}
            <View style={styles.row}>
              <Icon
                name="calendar"
                size={16}
                color="#376ADA"
                style={styles.icon}
              />
              <Text style={{ color: 'gray', paddingHorizontal: 5 }}>
                {' '}
                {formattedDateTime}
              </Text>
              <Icon
                name="clock-o" // FontAwesome clock icon name
                size={16}
                color="#376ADA"
                style={styles.icon}
              />
              <Text style={{ color: 'gray', paddingHorizontal: 1 }}>
                {' '}
                {item?.time ? item?.time : "_"}
              </Text>
            </View>

            <View style={styles.tag}>
              <Icon
                name="map-marker"
                size={10}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.tagText}>
                {item?.locationName?.split(',')[0].trim() || 'Test Indai'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>







      // </View>
    )
  }


  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const tasks = activeTab === 'pending' ? pendingTasks : completedTasks;

    if (!tasks || tasks.length === 0) {
      return <Text style={styles.noTasksText}>No {activeTab} tasks found</Text>;
    }

    return <FlatList data={tasks} renderItem={renderTaskItem} keyExtractor={(item) => item.taskId} />;
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeIndicator} />

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => handleTabChange('pending')}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  ...styles.tabText,
                  backgroundColor: activeTab === 'pending' ? 'gray' : 'white',
                  color: activeTab === 'pending' ? 'white' : 'gray',

                }}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTabChange('completed')}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  ...styles.tabText,
                  backgroundColor: activeTab === 'completed' ? 'gray' : 'white',
                  color: activeTab === 'completed' ? 'white' : 'gray',
                }}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.tabContent}>{renderContent()}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalOverlay: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '90%',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    marginTop: 90,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    padding: 10,
    color: 'white',
    borderRadius: 10,
    textAlign: 'center',
  },
  tabContent: {
    marginTop: 16,
    width: '100%',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#376ADA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 5, // Space between tags
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'space-around',
    justifyContent: "space-around",
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginHorizontal: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 4
  },
  taskLocation: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#777',
  },
  noTasksText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  closeIndicator: {
    backgroundColor: 'black',
    width: 220,
    height: 4,
    borderRadius: 9,
    marginVertical: 0,
    marginBottom: 17,
  },
  mapContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the map fits within the rounded corners
    marginBottom: 10,
  },
  map: {
    flex: 1,
    width: '100%',
    // height: '100%',
  },
});

export default AssignmentModal;
