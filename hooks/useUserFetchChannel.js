import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {devURL} from '../constants/endpoints';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

const useUserFetchChannel = (
  setChannelName,
  setVisible,
  setChannelDescription,
  navigation,
  selectedChannelId
) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [channelError, setChannelError] = useState(null);
  const [channelList, setChannelList] = useState([]);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [allChannelErr, setAllChannelErr] = useState(null);
  const [channels, setChannels] = useState([]);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateChannels, setUpdateChannels] = useState([]);
  const [isChannelMemberLoading, setIsChannelMemberLoading] = useState(false);
  const [channelMemberError, setChannelMemberError] = useState(null);
  const [channelMemberList, setChannelMemberList] = useState([]);

  const fetchChannelList = async () => {
    try {
      setIsLoading(true);
      setChannelError(null);

      const jwtToken = await AsyncStorage.getItem('token');
      if (!jwtToken) {
        throw new Error('Token not found');
      }

      const response = await axios.get(`${devURL}/channels`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      // console.log('==========aya gya maal aa gya =========:', response?.data);

      setChannelList(response?.data || []);
      setRefreshTrigger(prev => !prev);
    } catch (error) {
      console.error('Error fetching channel list:', error);
      setChannelError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      setIsChannelLoading(true);
      setAllChannelErr(null);

      const jwtToken = await AsyncStorage.getItem('token');
      if (!jwtToken) {
        throw new Error('Token not found');
      }

      const response = await axios.get(`${devURL}/channels`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      //   console.log('API Response:', response?.data);
      setChannels(response?.data?.channels || []);
    } catch (error) {
      console.error(
        'Error fetching channels:',
        error.response?.data?.message || error.message,
      );
      setAllChannelErr(error.message || 'Channels are not found');
    } finally {
      setIsChannelLoading(false);
    }
  };

  const postUpdateChannels = async (name, description) => {
    try {
      setIsUpdateLoading(true);
      setUpdateError(null);

      const jwtToken = await AsyncStorage.getItem('token');

      if (!jwtToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await axios.post(
        `${devURL}/channels`,
        {
          name,
          description,
          createdByModel: 'User',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      Alert.alert(
        'Success',
        response.data?.message || 'Channel added successfully!',
      );
      setChannelName('');
      setChannelDescription('');
      setVisible(false);
      navigation.navigate('ChatUser');
    } catch (err) {
      console.error('Error occurred:', err);

      const errorMessage =
        err.response?.data?.message || err.message || 'An error occurred.';
      Alert.alert('Error', errorMessage);
      setVisible(false);
      setChannelName('');
      setChannelDescription('');
    } finally {
      setIsUpdateLoading(false);
      setVisible(false);
      setChannelName('');
      setChannelDescription('');
    }
  };

  const fetchChannelMember = async (selectedChannelId) => {
    // console.log(' id====', selectedChannelId)
    try {
      setIsChannelMemberLoading(true);
      setChannelMemberError(null);

      const jwtToken = await AsyncStorage.getItem('token');
      if (!jwtToken) {
        throw new Error('Token is not found');
      }

      const response = await axios.get(
        `${devURL}/channels/members?channelId=${selectedChannelId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      console.log('Reps  : ---------->', response?.status)

      setChannelMemberList(response?.data || []);
    } catch (err) {
      // console.log('err : ',err);
      setChannelError(err);
      setChannelMemberList( []);
    } finally {
      setIsChannelMemberLoading(false);
    }
  };

  useEffect(() => {
    // fetchChannelList();
    // fetchChannels();
    // fetchChannelMember();
    // postUpdateChannels();
  }, []);

  return {
    channelList,
    isLoading,
    channelError,
    channels,
    allChannelErr,
    isChannelLoading,
    isUpdateLoading,
    updateError,
    updateChannels,
    isChannelMemberLoading,
    channelMemberError,
    channelMemberList,
    fetchChannelList,
    fetchChannels,
    postUpdateChannels,
    fetchChannelMember,
    refreshTrigger,
  };
};

export default useUserFetchChannel;
