import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import AddChannelModal from '../../../components/Modal/UserModel/AddChannelModal';
import AddChannelModal from '../components/Modal/UserModel/AddChannelModal';


const AddChannel = () => {
  const navigation = useNavigation();
  const [Ischannelmodel, setIsChannelModal] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add Channel</Text>

      <TouchableOpacity
        style={styles.addButton}
       onPress={()=> setAddMemberVisible(true)}
      >
        <Image
          source={require('../components/Assets/addd.png')}
          style={styles.addIcon}
        />
      </TouchableOpacity>

      {/* ============= Model box =============== */}
      <AddChannelModal
      visible={Ischannelmodel}
      setVisible={setIsChannelModal}
      />
    </View>
  );
};

export default AddChannel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Space between items
    alignItems: 'center', // Center vertically
    padding: 10, // Padding around the container
    backgroundColor: '#fff', // Background color
    borderRadius: 10, // Rounded corners
    marginVertical: 10, // Vertical margin
    shadowColor: '#000', // Shadow color
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    elevation: 3, // Elevation for Android
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#376ADA',
    padding: 5,
  },
  addButton: {
    backgroundColor: '#376ADA', // Background color for the button
    borderRadius: 5, // Rounded corners for the button
    padding: 5, // Padding for the button
  },
  addIcon: {
    width: 30, // Icon width
    height: 30, // Icon height
    tintColor: '#fff', // Icon color
  },
});

