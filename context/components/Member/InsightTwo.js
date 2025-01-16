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
      <View style={styles.timeline}>
        <View style={styles.line} />
        <View style={styles.dot}>
          <Icon
            name="location-on"
            size={25}
            color="white"
            style={styles.icon}
          />
        </View>
      </View>

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

export default InsightTwo;

const styles = StyleSheet.create({
  container: {
    paddingLeft:17,
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
    marginTop: 4,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  eventDetails: {
    padding: 5,
    borderRadius: 10,
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
