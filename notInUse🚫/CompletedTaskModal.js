import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Modal from 'react-native-modal';

function CompletedTaskModal({visible, setVisible, selectedCompletedTasks}) {
  // Render each task item in the modal
  const renderTaskItem = ({item}) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskName}>{item.taskName}</Text>
      <Text style={styles.taskLocation}>{item.location}</Text>
      <Text style={styles.taskDate}>
        {new Date(item.dateTime).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}>
      <View style={styles.modalContent}>
        {/* Modal Header */}
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.closeIndicator}></Text>
          </TouchableOpacity>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Completed Tasks</Text>
        </View>

        {/* Task List */}
        <FlatList
          data={selectedCompletedTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.taskId}
          contentContainerStyle={styles.taskList}
        />
      </View>
    </Modal>
  );
}

export default CompletedTaskModal;

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
    width: '100%', // Ensure card takes up 100% width of the container
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
