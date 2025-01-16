import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import moment from 'moment';
import UserTimeLineFeed from './UserTimeLineFeed';
import DateSelect from '../DatePickerOne';
import LiveTrackingMap from '../LiveTrackerMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { devURL } from '../../constants/endpoints';
import Loader from '../Loader';
const { width, height } = Dimensions.get('window');

const UserMemberTimeLineFeed = ({ selectedMmeberId, setSelectDate }) => {
  const [transitMemberData, setTransitMemberData] = useState([]);
  const [selectedDate_, setSelectedDate_] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  // const fetchDailyLocations = async () => {
  //   try {
  //     const jwtToken = await AsyncStorage.getItem('token');
  //     setLoading(true);

  //     const response = await axios.get(
  //       `${devURL}/user/members/${selectedMmeberId}/daily-transit?date=${selectedDate_}`,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${jwtToken}`,
  //         },
  //       }
  //     );

  //     const locations = response.data.data[0]?.locations || [];
  //     setTransitMemberData(locations);
  //   } catch (error) {
  //     console.log('Fetch canceled:', error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchDailyLocations();
  // }, [selectedMmeberId, selectedDate_]);

  return (
    <View style={styles.container}>
      <DateSelect setDate={setSelectedDate_} selectedMmeberId={selectedMmeberId} />

      {selectedMmeberId ? (
        <>
          <View style={styles.mapContainer}>
            <LiveTrackingMap
              selectedDate_={selectedDate_}
              selectedMmeberId={selectedMmeberId}
              // transitMemberData={transitMemberData}
            />
          </View>

            <UserTimeLineFeed
              selectedMmeberId={selectedMmeberId}
              selectedDate_={selectedDate_}
              setLoading={handleLoading}
            />
          {/* <View style={styles.timelineContainer}>
          </View> */}
        </>
      ) : <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          color: 'gray',
          marginTop: 50,
          fontWeight: '500',
        }}
      >
        Timeline Data N/A
      </Text>}

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
    </View>
  );
};

export default UserMemberTimeLineFeed;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    marginVertical: 15,
    alignSelf: 'center',
  },
  mapContainer: {
    height: height * 0.4,
    // marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  timelineContainer: {
    // marginHorizontal: 10,
  },
});
