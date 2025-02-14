import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

function PendingTaskModal({visible, setVisible, selectedPendingTasks}) {
  // Render each task item in the modal
  const renderTaskItem = ({item}) => (
    <View style={styles.taskCard}>
      {/* Icon */}
      <Icon
        name="check-circle"
        size={24}
        color="#28a745"
        style={styles.taskIcon}
      />

      <View>
        <Text style={styles.taskName}>{item.taskName}</Text>
        <Text style={styles.taskLocation}>{item.location}</Text>
        <Text style={styles.taskDate}>
          {new Date(item.dateTime).toLocaleString()}
        </Text>
      </View>
    </View>
  );

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
        <FlatList
          data={selectedPendingTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.taskId}
          contentContainerStyle={styles.taskList}
        />
      </View>
    </Modal>
  );
}

export default PendingTaskModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0, // No margin for full width
    justifyContent: 'flex-end', // Align modal to the bottom of the screen
  },
  modalContent: {
    height: '80%', // 80% of the screen height
    width: '100%', // Full width
    backgroundColor: '#fff', // Modal background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskList: {
    width: '100%',
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align icon and text horizontally
  },
  taskIcon: {
    marginRight: 10, // Space between the icon and text
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  taskLocation: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  taskDate: {
    fontSize: 12,
    color: '#888',
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
