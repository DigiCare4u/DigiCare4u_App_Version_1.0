import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import ChannlMiddleWellModel from '../Model/ChannlMiddleWellModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {devURL} from '../../constants/endpoints';

const ChannelNavbar = () => {
  const navigation = useNavigation();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isVisibleModel, setVisibleModel] = useState(false);
  const [channelList, setChannelList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger re-fetch
  const [isRefreshing, setIsRefreshing] = useState(false); // State for RefreshControl

  const fetchChannelList = async () => {
    try {
      setIsLoading(true);
      setIsRefreshing(true); // Start refreshing

      // setChannelError(null);

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
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching channel list:', error);
      // setChannelError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop refreshing
    }
  };

  useEffect(() => {
    fetchChannelList();
  }, []);
  //===========================================

  // Ensure channelList is properly extracted from the API response
  const channels = channelList?.channels || [];

  console.log(
    '== refreshTrigger  ====:',
    refreshTrigger,
    channelList?.channels?.length,
  );

  const renderChannelList = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.memberItem,
          selectedChannel === item._id && styles.selectedChannel,
        ]}
        onPress={() => {
          console.log('pressed -----', item?._id);

          setSelectedChannel(item._id);
          setVisibleModel(true);
        }}>
        <Image
          source={{uri: item.avatar || 'https://via.placeholder.com/50'}}
          style={styles.memberAvatar}
        />
        <Text style={styles.memberName}>{item.name}</Text>
        <ChannlMiddleWellModel
          visible={isVisibleModel}
          selectedChannelId={item?._id}
          setVisible={setVisibleModel}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
    <ScrollView>
      <View style={styles.sliderContainer}>
          <FlatList
            data={channels}
            renderItem={renderChannelList}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={fetchChannelList}
              />
            }
          />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChannelNavbar;

const styles = StyleSheet.create({
  sliderContainer: {
    // width:"100%",
  },
  memberItem: {
    alignItems: 'center',
  },
  selectedChannel: {
    borderWidth: 1,
    borderColor: '#007ACC',
    borderRadius: 5,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 35,
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop:5,
  },
  memberName: {
    fontSize: 10,
    color: '#007ACC',
  },
});
