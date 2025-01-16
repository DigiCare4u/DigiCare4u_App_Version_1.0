import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Goback from '../../../components/GoBack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../../../constants/endpoints';
import { useAuth } from '../../../context/auth';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useLocation from '../../../hooks/useLocation';
import SetGeofence from '../../../components/User/SetGeofence';

const { width } = Dimensions.get('window');

const UserProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState(null);
  const { logout } = useAuth();
  const { location, getCurrentLocation } = useLocation();

  const fetchUserProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const userData = response.data.user;
      setName(userData.name);
      setEmail(userData.email);
      setMobile(userData.mobile);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const updateData = { name, email, mobile };
      await axios.patch(`${devURL}/user/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      Alert.alert('Success', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleImagePicker = () => {
    ImagePicker.showImagePicker({ title: 'Select Profile Image' }, response => {
      if (response.didCancel) return;
      if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        setImage(response.uri);
      }
    });
  };

  useEffect(() => {
    if (!location) getCurrentLocation();
  }, [location]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await logout(navigation);
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to log out.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Goback />
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
          <Image
            source={{
              uri:
                image ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#3D5AFE" />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#B1B1B1"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#3D5AFE" />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#B1B1B1"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={24} color="#3D5AFE" />
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder="Mobile Number"
            placeholderTextColor="#B1B1B1"
            keyboardType="phone-pad"
          />
        </View>

        {/* <TouchableOpacity style={styles.button} onPress={updateUserProfile}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity> */}
      </View>

      <SetGeofence location={location} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    fontSize: 16,
    color: '#FF3D00',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3D5AFE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  button: {
    backgroundColor: '#3D5AFE',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UserProfile;
