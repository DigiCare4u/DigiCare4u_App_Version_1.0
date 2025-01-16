import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import MapView, { Marker } from 'react-native-maps';

function CompletedTaskModal({ visible, setVisible, selectedCompletedTasks }) {
  const navigation = useNavigation();

  // console.log('selectedPendingTasks', selectedPendingTasks);

  const renderTaskItem = ({ item }) => {
    const formattedDateTime = moment(item.date).format('ddd, DD');
    const { lat, lng } = item.location;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MemberAssignmentMap', { taskId: item.taskId })
        }>
        <View style={styles.taskCard}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01, // Zoom level
                longitudeDelta: 0.01, // Zoom level
              }}>
              <Marker
                coordinate={{ latitude: lat, longitude: lng }}
                title="Location"
                description={`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`}
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
                {item?.locationName?.split(',')[0].trim() || 'not provided'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeIndicator}>Cancel</Text>
        </TouchableOpacity>

        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Pending Tasks</Text>
        </View>

        {/* Task List */}
        {selectedCompletedTasks?.length > 0 ? (
          <FlatList
            data={selectedCompletedTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.taskId}
            contentContainerStyle={styles.taskList}
          />
        ) : (
          <Text style={styles.noTasksText}>No Pending Tasks</Text>
        )}
      </View>
    </Modal>
  );
}

export default CompletedTaskModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  closeIndicator: {
    textAlign: 'right',
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskList: {
    paddingBottom: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around",
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
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
  },
  taskDate: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  taskStatus: {
    fontSize: 14,
    color: '#007bff',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  mapContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the map fits within the rounded corners
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
});
