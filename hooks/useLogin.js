import { useState } from 'react';
import axios from 'axios';
import { devURL } from '../constants/endpoints';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${devURL}/auth/login`, {
        email: email,
        password: password,
      });

      const jwtToken = response?.data?.token;
      const userType = response?.data?.type;

      await AsyncStorage.setItem('token', jwtToken); // Store token in AsyncStorage
      navigation.navigate(`${userType}/dashboard`); // Navigate to dashboard
    } catch (error) {
      console.error('Login failed', error);
      // Handle error with an alert, toast, or something similar
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
