import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../../../constants/endpoints';
import Modal from 'react-native-modal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import useUserFetchChannel from '../../../hooks/useUserFetchChannel';
import AddChannelModal from './AddChannelModal';
import AddChannelAccordian from './AddChannelAccordian';

const AddMemberModel = ({ visible, setVisible }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [channelId, setChannelId] = useState('');
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  //====== Status and Function =========
  const { channels, fetchChannels } = useUserFetchChannel();

  useEffect(() => {
    fetchChannels();
  }, []);

  const isButtonDisabled = !name || !number || !email || !channelId;

  const handleAddMember = async () => {
    if (isButtonDisabled) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Validation Error',
        textBody: 'Please fill in all fields.',
        button: 'Close',
      });
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const requestBody = [
        {
          name,
          email,
          mobile: number, // Use descriptive naming if "number" is a phone number
          channelId,
        },
      ];

      const response = await fetch(`${devURL}/user/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('datadatadata-------', data);

      if (response.ok) {
        Alert.alert('Member Added!', `Member "${name}" added successfully!`);

        // Reset form fields
        setName('');
        setEmail('');
        setNumber('');
        setChannelId('');
        setChannelName('');
        setDropdownVisible(false);
        setVisible(false); // Close the modal
      } else {
        Alert.alert('Already Registered !', data?.message);

      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message || 'An unexpected error occurred. Please try again later.',
        button: 'Close',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderChannelOption = ({ item }) => {

    return (
      <TouchableOpacity
        style={styles.option}
        onPress={() => {

          setChannelName(item.name); // Use the channel name as the selected group type
          setChannelId(item._id); // Use the channel name as the selected group type
          setDropdownVisible(false);
        }}>
        <Text style={styles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    )
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>
          <FontAwesomeIcon name="user" size={30} color="#376ADA" />
          <Text style={{ margin: 15, color: '#376ADA' }}>Ad1d New Member</Text>
        </Text>
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#376ADA"
          />
        </View>

        <View>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            value={number}
            onChangeText={setNumber}
            keyboardType="number-pad"
            placeholderTextColor="#376ADA"
          />
        </View>

        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#376ADA"
          />
        </View>

        <View>
          <Text style={styles.label}>Channel</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}>
            <Text style={styles.dropdownText}>
              {channelName || 'Select Channel'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={isButtonDisabled || loading}
          style={[
            styles.button,
            (isButtonDisabled || loading) && styles.buttonDisabled,
          ]}
          onPress={handleAddMember}>
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Member'}
          </Text>
        </TouchableOpacity>

        {/* Channels Dropdown */}
        <Modal
          isVisible={dropdownVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setDropdownVisible(false)}
          style={styles.dropdownModal}>
          <View style={styles.dropdownContainer}>
            <FlatList
              data={channels}
              renderItem={renderChannelOption}
              keyExtractor={item => item._id}
            />
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export default AddMemberModel;

const styles = StyleSheet.create({
  modal: {
    margin: 15,
    justifyContent: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#376ADA',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#376ADA',
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
    color: 'black',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#376ADA',
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
    justifyContent: 'center',
  },
  dropdownText: {
    color: '#376ADA',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#376ADA',
  },
  optionText: {
    color: '#376ADA',
  },
});
