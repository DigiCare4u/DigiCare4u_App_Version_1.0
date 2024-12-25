import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from './useLogin';
import { useLogout } from './useLogout';
import { useDecodedToken } from '../hooks/useDecoded';
import { useNavigation } from '@react-navigation/native';  // Import navigation for redirecting

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { login, loading: loginLoading } = useLogin();
  const { logout } = useLogout();
  const { decodedToken } = useDecodedToken();
  const navigation = useNavigation(); // Get navigation for redirection

  // Function to validate the token (optional: use an API call or decode the token and check its expiration)
  const isTokenValid = (token) => {
    try {
      const decoded = decodedToken(token);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        return false;
      }
      return true; 
    } catch (error) {
      return false; 
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      
      if (token && isTokenValid(token)) {
        setUser({ token });
      } else {
        navigation.navigate('Login');
      }

      setLoading(false);
    };

    checkToken();
  }, [navigation]); 

  return {
    user,
    loading: loading || loginLoading,
    login,
    logout,
    decodedToken,
  };
};
