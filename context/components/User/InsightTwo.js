import React from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const events = [
  {
    id: '1',
    time: '8:00 AM',
    location: 'Home',
    description: 'Started the day',
    icon: 'home',
  },
  {
    id: '2',
    time: '9:30 AM',
    location: 'Gym',
    description: 'Morning workout',
    icon: 'fitness-center',
  },
  {
    id: '3',
    time: '11:00 AM',
    location: 'Cafe',
    description: 'Coffee break',
    icon: 'local-cafe',
  },
  {
    id: '4',
    time: '1:00 PM',
    location: 'Office',
    description: 'Workday begins',
    icon: 'work',
  },
  {
    id: '5',
    time: '6:00 PM',
    location: 'Park',
    description: 'Evening walk',
    icon: 'park',
  },
];

const InsightTwo = () => {
  const renderItem = ({item}) => (
    <View style={styles.eventContainer}>
      {/* Timeline Section */}
      <View style={styles.timeline}>
        <View style={styles.line} />
        <View style={styles.dot}>
          <Icon name={item.icon} size={20} color="white" style={styles.icon} />
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.eventDetails}>
        <View>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default InsightTwo;

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
