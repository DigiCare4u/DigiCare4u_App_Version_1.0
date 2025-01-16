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
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../../../constants/endpoints';
import Icon from 'react-native-vector-icons/AntDesign';
import UserChannelSideBar from '../../../sideBar/userChannelSideBar';

const ChannelList = ({ setWhichChannelIsSelected }) => {
  const navigation = useNavigation();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelList, setChannelList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar visibility state

  const fetchChannelList = async () => {
    try {
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
      setChannelList(response?.data?.channels || []);
      setSelectedChannel(response?.data?.channels[0]._id);
      setWhichChannelIsSelected(response?.data?.channels[0]._id);
    } catch (error) {
      console.error('Error fetching channel list:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChannelList();
  }, []);

  const renderChannelList = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.channelItem,
        selectedChannel === item?._id && styles.selectedChannel,
      ]}
      onPress={() => {
        setSelectedChannel(item?._id);
        setWhichChannelIsSelected(item?._id);
      }}>
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
        style={styles.channelAvatar}
      />
      <View style={styles.channelInfo}>
        <Text style={styles.channelName}>{item.name}</Text>
        <Text style={styles.channelDescription}>
          {item.description || 'No description available'}
        </Text>
      </View>
      {selectedChannel === item?._id && (
        <Icon name="checkcircle" size={20} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Channel List</Text>
      <FlatList
        data={channelList}
        renderItem={renderChannelList}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={fetchChannelList} />
        }
      />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsSidebarVisible(!isSidebarVisible)}>
        <Text style={styles.toggleButtonText}>
          {isSidebarVisible ? '_' : 'Control Panel'}
        </Text>
      </TouchableOpacity>
      {isSidebarVisible && <UserChannelSideBar
        visible={isSidebarVisible}
        setVisible={setIsSidebarVisible}
        selectedChannelId={selectedChannel}
      />}
    </SafeAreaView>
  );
};

export default ChannelList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  channelItem: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedChannel: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  channelAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  channelInfo: {
    alignItems: 'center',
  },
  channelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  channelDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
