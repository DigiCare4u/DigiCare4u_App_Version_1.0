import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import useUserFetchChannel from '../../../hooks/useUserFetchChannel';
import { useNavigation } from '@react-navigation/native';

const AddChannelModal = ({visible, setVisible}) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const navigation = useNavigation();

  const { updateChannels, postUpdateChannels } = useUserFetchChannel(
    setChannelName,
    setChannelDescription,
    setVisible,
    navigation

  )


  // console.log('===Chala ========', updateChannels)

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideInRight"
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}>
      <SafeAreaView>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Channel Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Channel Name"
            value={channelName}
            onChangeText={setChannelName}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Channel Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Channel Description"
            value={channelDescription}
            onChangeText={setChannelDescription}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.addButton} onPress={()=>postUpdateChannels(channelName, channelDescription)}>
            <Icon name="pluscircleo" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Channel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddChannelModal;

const styles = StyleSheet.create({
    formContainer: {
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#376ADA',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#CCC',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      color: '#000',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#376ADA',
      borderRadius: 5,
      paddingVertical: 10,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });
