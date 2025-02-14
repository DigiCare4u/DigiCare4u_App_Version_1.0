import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {devURL} from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DailyTransit_new = ({selectedChannel,selectedDate_}) => {
 
 const [timelineData,   setTimelineData  ] = useState([]);
 
 
  useEffect(() => {
    const fetchDailyLocations = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `${devURL}/user/members/${selectedChannel}/daily-transit?date=${selectedDate_}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        );
        console.log('----------:', response?.data?.data[0].locality);
        setTimelineData(response?.data?.data)
        const locationData = response.data.data;
        if (locationData.length > 0) {
          // setLocations(locationData);
        }
      } catch (error) {
        console.error('Error fetching locations:', error.message);
      }
    };
    fetchDailyLocations();
  }, [selectedChannel]);

  const renderItem = ({item}) => (
    <View style={styles.eventContainer}>
      {/* Timeline Section */}
      <View style={styles.timeline}>
        <View style={styles.line} />
        <View style={styles.dot}>
          <Icon name={'home'} size={20} color="white" style={styles.icon} />
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.eventDetails}>
        <View>
          <Text style={styles.location}>{item._id}  </Text>
          <Text style={styles.description}>Total Visit: {item.count}</Text>
          <Text style={styles.timeText}>{item.averageTimestamp}</Text>
          
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={timelineData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default DailyTransit_new;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
  },
  eventContainer: {
    flexDirection: 'row',
    marginVertical: 0,
  },
  timeContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#007ACC',
    fontWeight: '600',
  },
  timeline: {
    alignItems: 'center',
    width: 40,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#007ACC',
  },
  dot: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#007ACC',
    position: 'absolute',
    top: '10%',
    // marginTop: 5,
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  eventDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 5,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});
