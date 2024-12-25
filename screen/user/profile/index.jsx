import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Goback from '../../../components/GoBack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {devURL} from '../../../constants/endpoints';
import {useAuth} from '../../../context/auth';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useLocation from '../../../hooks/useLocation';
import { getAddressFromCoordinates } from '../../../services/geoCode';

const UserProfile = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {logout} = useAuth();
  const {location, getCurrentLocation} = useLocation();

  const { latitude,longitude }= getAddressFromCoordinates()

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${devURL}/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const userData = response.data.user;
      setName(userData.name);
      setEmail(userData.email);
      setMobile(userData.mobile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');

      const updateData = {
        name,
        email,
        mobile,
      };

      await axios.patch(`${devURL}/user/profile`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an error updating your profile.');
    }
  };

  const handleImagePicker = () => {
    ImagePicker.showImagePicker({title: 'Select Profile Image'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.uri); // Update image state with selected URI
      }
    });
  };

  
  useEffect(() => {
    if(!location){
      getCurrentLocation();
    }
    console.log('location=======profile', location);
  }, [getCurrentLocation, location]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            await logout(navigation);
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Goback />
              <Text style={styles.title}>Profile</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutButton}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={handleImagePicker}>
              {image ? (
                <Image source={{uri: image}} style={styles.image} />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                  }}
                  style={styles.image}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="co-present"
              size={20}
              color="#3D5AFE"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, {color: '#3D5AFE'}]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#B1B1B1"
            />
          </View>

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="mail" size={20} color="#3D5AFE" style={styles.icon} />
            <TextInput
              style={[styles.input, {color: '#3D5AFE'}]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="#B1B1B1"
            />
          </View>

          {/* Mobile Input */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="contact-phone"
              size={20}
              color="#3D5AFE"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, {color: '#3D5AFE'}]}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              placeholder="Enter your mobile number"
              placeholderTextColor="#B1B1B1"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.button} onPress={updateUserProfile}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          <View style={{marginTop: 25}}>
            <View style={styles.inputContainers}>
              <Icon
                name="location-on"
                size={20}
                color="#3D5AFE"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={`${location.latitude}, ${location.longitude}`}
                placeholderTextColor="#B1B1B1"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3D5AFE',
  },
  logoutButton: {
    backgroundColor: '#3D5AFE',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#3D5AFE',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  label: {
    fontSize: 14,
    color: '#3D5AFE',
    marginBottom: 4,
    fontWeight: '700',
  },

  button: {
    backgroundColor: '#3D5AFE',
    padding: 13,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3D5AFE',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputContainers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
});
