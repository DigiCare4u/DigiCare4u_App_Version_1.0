import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CalenderAndDownload from './CalenderAndDownload';
import MemberReport from './MemberReport';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';
import DateRange from '../DateRange';

function AssignmentAndAttendance() {
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [channelList, setChannelList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

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

      const channels = response?.data?.channels || [];
      setChannelList(channels);

      if (channels.length > 0) {
        setSelectedChannelId(channels[0]._id);
      }
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FlatList
          data={channelList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.channelContainer,
                selectedChannelId === item._id && styles.selectedChannel,
              ]}
              onPress={() => setSelectedChannelId(item._id)}
            >
              <Image
                source={{ uri: item.avatar || 'https://via.placeholder.com/150' }}
                style={styles.memberAvatar}
              />
              <Text style={styles.channelName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <DateRange setDateRange={setDateRange} />

      <MemberReport dateRange={dateRange} selectedChannelId={selectedChannelId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  slider: {
    paddingHorizontal: 0,
  },
  channelContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 12,
    width: 80,
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E1E2E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedChannel: {
    borderColor: '#007BFF',
    backgroundColor: '#E3F1FF',
  },
  channelName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginTop: 6,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  datePickerContainer: {
    marginTop: 16,
  },
});

export default AssignmentAndAttendance;
