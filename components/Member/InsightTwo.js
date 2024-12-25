import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useFetchMember from '../../hooks/useFetchMember';

const InsightTwo = () => {
  const {records, fetchTrackingRecords} = useFetchMember();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    await fetchTrackingRecords();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.eventContainer}>
      {/* Timeline Section */}
      <View style={styles.timeline}>
        <View style={styles.line} />
        <View style={styles.dot}>
          <Icon name="location-on" size={20} color="white" style={styles.icon} />
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.eventDetails}>
        <Text style={styles.location}>
          {item.preferredAddress || 'Address not available'}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.description}>
          {item.address || 'Detailed address not provided'}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View>
        {records && records.length > 0 ? (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={isRefreshing}
            onRefresh={fetchData}
          />
        ) : (
          <Text style={styles.noDataText}>No data found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    // backgroundColor:"red"
  },
  timeline: {
    alignItems: 'center',
    marginRight: 10,
    // backgroundColor:"red"
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    marginBottom: 5,
    backgroundColor:"red" 
  },
  eventDetails: {
    flex: 1,
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  icon: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  noDataText: {
    color: 'black',
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
  },
});

export default InsightTwo;
