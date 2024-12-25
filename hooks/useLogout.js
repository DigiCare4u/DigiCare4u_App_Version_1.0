import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

export const useLogout = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      console.log('------ logout cvhala -----------------');
      
      await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage

      // Show a success notification
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Logged Out',
        textBody: 'You have successfully logged out.',
      });

      // Navigate to login page
      navigation.navigate('Login');
      
    } catch (error) {
      // Show an error notification if logout fails
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Logout Error',
        textBody: 'Something went wrong while logging out. Please try again.',
        button: 'close',
      });
      console.error('Logout error:', error);
    }
  };

  return { logout };
};
