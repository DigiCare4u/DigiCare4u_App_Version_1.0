import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

const MyModal = ({visible, setVisible, selectedAssignment}) => {
  const [activeTab, setActiveTab] = useState('incomplete'); // Default tab is 'incomplete'
  const [loading, setLoading] = useState(false); // Set to false initially

  // console.log('selectedAssignment', selectedAssignment);

  const handleTabChange = tab => {
    setActiveTab(tab);
    setLoading(true);

    setTimeout(() => {
      setLoading(false); 
    }, 1000); 
  };

  // Function to render content based on selected tab
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (selectedAssignment) {
      const renderTasks = (tasks, type) => {
        if (!tasks || tasks.length === 0) {
          return <Text style={styles.noTasksText}>No {type} tasks found</Text>;
        }
        return tasks.map((task, index) => (
          <View key={index} style={styles.taskContainer}>
            <Text style={styles.taskId}>Task ID: {task.taskId}</Text>
            <Text style={styles.taskLocation}>Location: {task.location}</Text>
            <Text style={styles.taskDate}>
              Date: {new Date(task.dateTime).toLocaleString()}
            </Text>
          </View>
        ));
      };

      return (
        <View style={styles.modalContainer}>
          <View style={styles.tabContent}>
            {activeTab === 'incomplete'
              ? renderTasks(selectedAssignment.inCompleteTaskDetails, 'pending')
              : renderTasks(
                  selectedAssignment.completedTaskDetails,
                  'completed',
                )}
          </View>
        </View>
      );
    } else {
      return <Text style={styles.noAssignmentText}>Assignment Not Found</Text>;
    }
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeIndicator}></Text>
            </TouchableOpacity>
          </View>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => handleTabChange('incomplete')}
              style={{flex: 1}} // Make it stretch across the container if needed
            >
              <Text
                style={{
                  padding: 10,
                  backgroundColor: activeTab === 'incomplete' ? 'blue' : 'red', // Change color based on activeTab
                  color: 'white', // Text color
                  borderRadius: 10, // Optional: rounded corners
                }}>
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTabChange('complete')}
              style={{flex: 1}} // Make it stretch across the container if needed
            >
              <Text
                style={{
                  padding: 10,
                  backgroundColor: activeTab === 'complete' ? 'blue' : 'red', // Change color based on activeTab
                  color: 'white', // Text color
                  borderRadius: 10, // Optional: rounded corners
                }}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content based on the selected tab */}
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Ensure no margins to make the modal fill the screen
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContainer: {
    // backgroundColor:"red"
  },
  tabContent: {
    marginTop: 16,
  },
  taskContainer: {
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    // backgroundColor:"red"
  },
  taskId: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskLocation: {
    fontSize: 13,
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
  noAssignmentText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  closeIndicator: {
    backgroundColor: "black",
    width: 220,
    height: 4,
    borderRadius: 9,
    marginVertical: 0,
    marginBottom: 17
},
});

export default MyModal;
