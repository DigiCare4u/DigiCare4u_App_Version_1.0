import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapboxGL from '@rnmapbox/maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {devURL} from '../constants/endpoints';
import InsightTwo from './User/UserTimeLineFeed';

const accessToken =
  'sk.eyJ1IjoicHJvZGV2MzY5IiwiYSI6ImNtM21vaHppbzB5azQycXF6MTJyZjJuamcifQ.ZnpKclc0DrYzGN1fA1jqNQ'; // Replace with your Mapbox token
MapboxGL.setAccessToken(accessToken); // Replace with your Mapbox token

const LiveTrackingMap = ({
  selectedMmeberId,
  selectedDate_,
  transitMemberData,
}) => {
  const [loca_, setLoca_] = useState([]);

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
        },
      );
      //   console.log('resp____________==', response.data.data[0].locations);
      setLoca_(response.data.data[0].locations);

      //   setTimelineData(response?.data?.data); // Set fetched data to state
      // console.log('response?.data?.data',response?.data?.data);

      //   setTransitMemberData(response?.data?.data);
    } catch (error) {
      console.error('Error fetching locations==:', error);
    }
  };

  useEffect(() => {
    fetchDailyLocations();
  }, [selectedMmeberId, selectedDate_]); // Fetch data on channel or date change

  // let today = new Date().toISOString().split('T')[0]

  //   console.log(
  //     'transitMemberData_______________',
  //     transitMemberData[0]?.locations,
  //   );

  const [locations, setLocations] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // console.log('date',date);

  // const fetchDailyLocations = async (selectedDate) => {
  //     try {

  //         const jwtToken = await AsyncStorage.getItem('token');

  //         const response = await axios.get( `${devURL}/user/members/${memberId}/daily-transit?date=${date}`, {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 Authorization: `Bearer ${jwtToken}`,
  //             },
  //             params: {
  //                 date: selectedDate.toISOString().split('T')[0],
  //             },
  //         });
  //         console.log('----------response:', response.data);

  //         const locationData = response?.data?.data;
  //         // console.log('----------locationData:', locationData);
  //         if (locationData?.length > 0) {
  //             setLocations(locationData);
  //         }
  //     } catch (error) {
  //         console.error('Error fetching locations:', error);
  //     }
  // };

  // useEffect(() => {
  //     fetchDailyLocations(date);
  // }, [date]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const getCoordinates = () =>
    locations?.map(loc => [
      loc?.location?.coordinates[0],
      loc?.location?.coordinates[1],
    ]);
  // console.log('=============ggg=======================');
  // console.log(loca_);
  // console.log('====================================');
  return (
    <View>
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity> */}

        {/* {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )} */}

        {transitMemberData ? (
          <MapboxGL.MapView style={styles.map}>
            {/* <MapboxGL.Camera
              zoomLevel={14}
              centerCoordinate={
                transitMemberData.length
                  ? [transitMemberData[0][0], transitMemberData[0][1]] // Set initial center
                  : [-122.4324, 37.78825]
              }
            /> */}
            <MapboxGL.Camera
              zoomLevel={14}
              centerCoordinate={
                loca_.length > 0
                  ? [loca_[0][0], loca_[0][1]] // Use the first location in loca_ for the initial center
                  : [-122.4324, 37.78825]
              }
            />

            {loca_?.map((location, index) => {
              console.log('-fffff', location[1], location[0]);

              return (
                <MapboxGL.PointAnnotation
                  key={index}
                  id={`marker-${index}`}
                  coordinate={[location[0], location[1]]} // Longitude and Latitude
                >
                  <View style={styles.marker}>
                    <Text style={styles.markerText}>{index + 1}</Text>
                  </View>
                </MapboxGL.PointAnnotation>
              );
            })}


            
          </MapboxGL.MapView>
        ) : null}
      </View>
      <InsightTwo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
  map: {
    height: 400, // Adjust as needed
    marginTop: 20,
  },
  dateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  marker: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  routeLine: {
    lineWidth: 3,
    lineColor: '#007AFF',
  },
});

export default LiveTrackingMap;
