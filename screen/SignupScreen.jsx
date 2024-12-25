import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon
import { devURL } from '../constants/endpoints';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isButtonDisabled = !name || !mobile || !email || !password;

  const handleSignup = async () => {
    if (isButtonDisabled) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${devURL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const jwtToken = data?.token;

        if (jwtToken) {
          await AsyncStorage.setItem('token', jwtToken);
        }

        Alert.alert('Signup Success', 'Account created successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Unable to sign up. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sign Up</Text>

      <View style={styles.inputContainer}>
        {/* Name Input */}
        <View style={styles.inputWrapper}>
          <Icon name="account" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={setName}
            value={name}
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputWrapper}>
          <Icon name="phone" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#aaaaaa"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={mobile}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Icon name="email" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaaaaa"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
          />
        </View>
      </View>

      <TouchableOpacity
        disabled={isButtonDisabled || loading}
        style={[styles.signupButton, (isButtonDisabled || loading) && styles.buttonDisabled]}
        onPress={handleSignup}
      >
        <Text style={styles.signupButtonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.footerText}>
          Already have an account?
          <Text style={styles.loginText}> Login </Text>
          here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 36,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#007ACC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: '#fff'
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: 'black',
    padding: 14,
    borderRadius: 10,
  },
  signupButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
  },
  signupButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  footerText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'black',
    fontWeight: 'bold',
    color: '#007ACC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
  },
});

export default Signup;
