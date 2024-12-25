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
import AttendanceCard from './AttendanceCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';
import DateAndTimePicker from '../DateRange';
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



  // console.log('dateRange _ --------', dateRange);




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

      //   console.log('Response : ', response?.data);

      const channels = response?.data?.channels || [];
      setChannelList(channels);
      // setWhichChannelIsSelected()

      // Automatically select the first channel if available
      if (channels.length > 0) {
        setSelectedChannelId(channels[0]._id);
        // setVisibleModel(true);
      }

      //   setRefreshTrigger(prev => prev + 1);
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
            //   <TouchableOpacity
            //   style={[
            //       styles.channelContainer,
            //       selectedChannel === item.id && styles.selectedChannel,
            //   ]}
            //   onPress={() => setSelectedChannel(item.id)}
            // >
            <TouchableOpacity
              style={[
                styles.channelContainer,
                selectedChannelId === item._id && styles.selectedChannel, // Compare with selectedChannelId
              ]}
              onPress={() => setSelectedChannelId(item._id)} // Update selected channel
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
      {/* <CalenderAndDownload/> */}


      <DateRange setDateRange={setDateRange} />

      <AttendanceCard
        dateRange={dateRange}
        selectedChannelId={selectedChannelId} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // backgroundColor:"red"
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    //  backgroundColor:"red"
  },
  slider: {
    paddingHorizontal: 0,
    //  backgroundColor:"red"
  },
  channelContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 2,
    borderRadius: 10,
    width: 70,
    //  backgroundColor:"red"
  },
  selectedChannel: {
    borderColor: '#007BFF',
    borderWidth: 1.5,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 35,
    marginBottom: 8,
  },
  channelName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#007BFF',
  },
  selectedChannelInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'red',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 7,
  },
});

export default AssignmentAndAttendance;
