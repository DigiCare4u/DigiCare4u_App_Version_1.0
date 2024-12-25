import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { devURL } from '../constants/endpoints';
import { useLogout } from './useLogout';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export const useDecodedToken = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const { logout } = useLogout();
  const navigation = useNavigation(); // Use navigation to redirect

  const decodeToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setJwtToken(token)
    // console.log('mila token .................. ?', token);

    if (!token) {
      console.warn("No token found");
      return null;
    }

    try {
      const response = await axios.get(`${devURL}/jwt/decrypt`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        setDecodedToken(response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error(error);
        logout(); }
      // } else {
      //   console.error("Error decoding token", error);
      // }
    }
  };

  const protectRoute = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn("No token found, redirecting to login");
      navigation.navigate('login'); // Redirect to login page if no token
    }
  };

  useEffect(() => {
    protectRoute(); // Check token on mount
    decodeToken(); // Decode token on mount
  }, []);

  return { decodedToken ,jwtToken};
};
