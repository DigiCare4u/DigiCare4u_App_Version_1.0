import React, { createContext, useContext } from 'react';
import { useNavigation } from '@react-navigation/native'; // Use for navigation
import { devURL } from '../constants/endpoints';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const IsAuthenticaticated = async (navigation) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('----------- token hai ??? =-------', token);

      if (!token) {
        navigation.navigate('Login');
        return null;
      }

      const response = await axios.get(`${devURL}/jwt/decrypt`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      // console.log('------ resois -------------->', response?.data?.data.role);

      if (response?.data?.data) {
        const { role, _id } = response.data.data;
        navigation.navigate(`Home/${role}`);
        return { id: _id, role: role };
      } else {
        navigation.navigate('Login');
        return null;
      }

    } catch (error) {
      console.error(error);
      navigation.navigate('Login'); // In case of error, navigate to Login screen
      return null;
    }
  };

  const logout = async (navigation) => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };


  return (
    <AuthContext.Provider value={{
      IsAuthenticaticated,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
