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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Goback from '../components/GoBack';
import useFetchMember from '../hooks/useFetchMember';

const Profile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { memberProfile, fetchMemberProfile } = useFetchMember();

  useEffect(() => {
    fetchMemberProfile();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Goback />
              <Text style={styles.title}>Edit Profile</Text>
            </View>
          </View>

          <View style={styles.imagePickerContainer}>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() => {
                /* handle image picker */
              }}
            >
              <Image
                source={{
                  uri:
                    image ||
                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text style={styles.changeImageText}>Change Profile Picture</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={memberProfile?.name || 'Enter your name'}
              placeholderTextColor="#A6A6A6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder={memberProfile?.email || 'Enter your email'}
              placeholderTextColor="#A6A6A6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              placeholder={memberProfile?.mobile || 'Enter your mobile number'}
              placeholderTextColor="#A6A6A6"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log('Save Changes')}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#376ADA',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#376ADA',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageText: {
    marginTop: 10,
    fontSize: 14,
    color: '#376ADA',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#376ADA',
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: '#376ADA',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
