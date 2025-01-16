import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { devURL } from '../../constants/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const UserTimeLineFeed = ({ selectedMmeberId, selectedDate_, setTransitMemberData }) => {
  const [timelineData, setTimelineData] = useState([]);

  const fetchDailyLocations = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${devURL}/user/members/${selectedMmeberId}/daily-transit?date=${selectedDate_}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setTimelineData(response?.data?.data); // Set fetched data to state
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchDailyLocations();
  }, [selectedMmeberId, selectedDate_]);
  const getDayWithSuffix = (day) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = day % 100;
    return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
  };

  const renderItem = ({ item }) => {
    const formattedDateTime =
      moment(item.averageTimestamp).format('ddd, ') +
      getDayWithSuffix(moment(item.date).date()) +
      moment(item.averageTimestamp).format(' [@] hh:mm A');

    return (
      <View style={styles.eventContainer}>
        <View style={styles.timeline}>
          <View style={styles.line} />
          <View style={styles.dot}>
            <Icon name="map-marker" size={16} color="white" />
          </View>
        </View>
        <View style={styles.eventDetails}>
          <Text style={styles.location}>{item._id || 'Unknown Location'}</Text>

          <Text style={styles.description}>Total Visits : {item.count}</Text>
          <Text>

            <Icon
              name="clock-o" // FontAwesome clock icon name
              size={16}
              color="#376ADA"
              style={styles.icon}
            /> {formattedDateTime}
          </Text>
        </View>
      </View>

    )
  };

  return (
    <ScrollView style={styles.container}>
      {timelineData && timelineData.length > 0 ? (
        <FlatList
          data={timelineData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available for the selected date.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default UserTimeLineFeed;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height:100,
    padding: 10,
    marginBottom: 10,

  },
  eventContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 10,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 10,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#007ACC',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007ACC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#007ACC',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});
