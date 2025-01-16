import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {devURL} from '../../../../constants/endpoints';
import ChannelSideBar from '../../../sideBar/userChannelSideBar';
import Icon from 'react-native-vector-icons/AntDesign';

const ChannelList = (props) => {
  const navigation = useNavigation();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isVisibleModel, setVisibleModel] = useState(false);
  const [channelList, setChannelList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedChannelId, setSelectedChannelId] = useState('');

  const fetchChannelList = async () => {
    try {
      setIsLoading(true);
      setIsRefreshing(true);

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

      console.log('Response : ', response?.data);

      const channels = response?.data?.channels || [];
      setChannelList(channels);
      // setWhichChannelIsSelected()

      // Automatically select the first channel if available
      if (channels.length > 0) {
        setSelectedChannelId(channels[0]._id);
        // setSelectedChannel(channels[0]._id);
        // props.setWhichChannelIsSelected(channels[0]._id)
        setVisibleModel(true);
      }

      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching channel list:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChannelList();
  }, []);
  //===========================================

  const renderChannelList = ({item}) => {
    // props.setWhichChannelIsSelected(item?._id)
    return (
      <TouchableOpacity
        style={[
          styles.memberItem,
          selectedChannel === item?._id && styles.selectedChannel,
        ]}
        onPress={() => {
          setSelectedChannelId(item?._id);
          props.setWhichChannelIsSelected(item?._id)

          setSelectedChannel(item?._id);
          setVisibleModel(true);
        }}>
        <Image
          source={{uri: item.avatar || 'https://via.placeholder.com/50'}}
          style={styles.memberAvatar}
        />
        <Text style={styles.memberName}>{item.name}</Text>
        {/* <ChannelSideBar
          visible={isVisibleModel}
          selectedChannelId={selectedChannelId}
          setVisible={setVisibleModel}
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.sliderContainer}>
        
        <Text style={{fontSize: 10, fontWeight: '700', color: 'black'}}>
          Channel List
        </Text>
        <FlatList
          data={channelList}
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
    </SafeAreaView>
  );
};

export default ChannelList;

const styles = StyleSheet.create({
  sliderContainer: {
    // width:"100%",
    // backgroundColor:"red"
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
    marginTop: 5,
  },
  memberName: {
    fontSize: 10,
    color: '#007ACC',
  },
});
